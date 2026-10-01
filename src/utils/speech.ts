import { Language } from '../types';
import { SUPPORTED_LANGUAGES } from './translations';

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Speak response in farmer's selected language
export function speakText(
  text: string,
  language: Language,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (!isSpeechSynthesisSupported()) {
    if (onEnd) onEnd();
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // cancel any active speech

    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langObj.voiceCode;
    utterance.rate = 0.96; // comfortable, natural pacing
    utterance.pitch = 1.0;

    // Pick best available voice matching language code or Indian regional locale
    const voices = window.speechSynthesis.getVoices();
    const primaryCode = langObj.voiceCode.split('-')[0];
    const matchedVoice =
      voices.find(v => v.lang.toLowerCase() === langObj.voiceCode.toLowerCase()) ||
      voices.find(v => v.lang.toLowerCase().startsWith(primaryCode)) ||
      voices.find(v => v.lang.includes('IN')) ||
      voices[0];

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    let hasEnded = false;
    const endSafely = () => {
      if (!hasEnded) {
        hasEnded = true;
        if (onEnd) onEnd();
      }
    };

    if (onStart) {
      utterance.onstart = onStart;
    }

    utterance.onend = endSafely;
    utterance.onerror = (e) => {
      console.warn('Speech synthesis ended:', e);
      endSafely();
    };

    // Safety fallback: in case onend never fires on some mobile browsers
    const wordsCount = text.split(' ').length;
    const estimatedDurationMs = Math.max(2500, wordsCount * 450);
    setTimeout(() => {
      endSafely();
    }, estimatedDurationMs + 4000);

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    if (onEnd) onEnd();
    return false;
  }
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

// ----------------- Tap-to-Talk Voice Controller -----------------

export interface TapToTalkHandlers {
  onListening: () => void;
  onSpeechDetected: () => void;
  onInterimText: (text: string) => void;
  onSpeechEnd: (finalText: string) => void;
  onError: (errorMessage: string, isPermissionError: boolean) => void;
  onReset: () => void;
}

export class TapToTalkController {
  private static activeInstance: TapToTalkController | null = null;
  private recognition: any = null;
  private isListening: boolean = false;
  private hasReceivedSpeech: boolean = false;
  private accumulatedText: string = '';
  private initialSilenceTimer: any = null;
  private pauseDebounceTimer: any = null;
  private maxDurationTimer: any = null;
  private handlers: TapToTalkHandlers;
  private language: Language;
  private finalized: boolean = false;

  constructor(handlers: TapToTalkHandlers, language: Language) {
    this.handlers = handlers;
    this.language = language;
  }

  public setLanguage(lang: Language) {
    this.language = lang;
  }

  public startListening() {
    // 1. Ensure any previous instance is stopped completely
    if (TapToTalkController.activeInstance && TapToTalkController.activeInstance !== this) {
      TapToTalkController.activeInstance.stop();
    }
    TapToTalkController.activeInstance = this;

    this.stop(); // reset self
    stopSpeaking(); // stop any ongoing audio playback

    if (!isSpeechRecognitionSupported()) {
      this.handlers.onError(
        'Voice input is unavailable on this device. Please use "Type instead".',
        false
      );
      return;
    }

    try {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();

      const langObj =
        SUPPORTED_LANGUAGES.find(l => l.code === this.language) || SUPPORTED_LANGUAGES[0];
      this.recognition.lang = langObj.voiceCode;
      this.recognition.continuous = false; // Single-turn Tap to Talk
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.isListening = true;
      this.hasReceivedSpeech = false;
      this.accumulatedText = '';
      this.finalized = false;

      // Initial silence timer: If no speech within 6.5s, report friendly error and reset
      this.initialSilenceTimer = setTimeout(() => {
        if (!this.hasReceivedSpeech && this.isListening && !this.finalized) {
          console.warn('Initial silence timeout: no speech detected');
          this.cleanupTimers();
          this.safelyAbort();
          this.handlers.onError(
            "Sorry, I didn't hear that. Tap the microphone and try again.",
            false
          );
        }
      }, 6500);

      // Maximum utterance safety timer: 15 seconds max per tap
      this.maxDurationTimer = setTimeout(() => {
        if (this.isListening && !this.finalized) {
          this.finalize(this.accumulatedText);
        }
      }, 15000);

      this.recognition.onstart = () => {
        this.handlers.onListening();
      };

      this.recognition.onspeechstart = () => {
        this.hasReceivedSpeech = true;
        this.clearInitialSilenceTimer();
        this.handlers.onSpeechDetected();
      };

      this.recognition.onresult = (event: any) => {
        this.hasReceivedSpeech = true;
        this.clearInitialSilenceTimer();

        let interim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalChunk += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const currentTotal = (this.accumulatedText + ' ' + finalChunk + ' ' + interim).trim();

        if (finalChunk) {
          this.accumulatedText = (this.accumulatedText + ' ' + finalChunk).trim();
        }

        if (currentTotal) {
          this.handlers.onInterimText(currentTotal);
        }

        // Speech pause detection: Reset pause timer on every sound/word.
        // When farmer pauses for 1100ms, finalize turn automatically!
        this.clearPauseTimer();
        this.pauseDebounceTimer = setTimeout(() => {
          const textToSubmit = (this.accumulatedText || currentTotal).trim();
          if (textToSubmit.length > 0) {
            this.finalize(textToSubmit);
          }
        }, 1100);
      };

      this.recognition.onspeechend = () => {
        // Browser detected end of speech; if we have text, finalize in 400ms if pause timer doesn't fire first
        if (this.accumulatedText.trim().length > 0) {
          this.clearPauseTimer();
          this.pauseDebounceTimer = setTimeout(() => {
            this.finalize(this.accumulatedText);
          }, 400);
        }
      };

      this.recognition.onerror = (event: any) => {
        const err = event.error;
        console.warn('Speech recognition error event:', err);
        this.cleanupTimers();

        if (this.finalized) return;

        if (err === 'not-allowed' || err === 'service-not-allowed') {
          this.safelyAbort();
          this.handlers.onError(
            'Microphone permission is required for voice input. Please enable microphone access in your browser settings.',
            true
          );
        } else if (err === 'no-speech') {
          this.safelyAbort();
          if (this.accumulatedText.trim()) {
            this.finalize(this.accumulatedText);
          } else {
            this.handlers.onError(
              "Sorry, I didn't hear that. Tap the microphone and try again.",
              false
            );
          }
        } else if (err === 'aborted') {
          // Manually aborted or clean reset, don't show noisy error
          this.handlers.onReset();
        } else {
          this.safelyAbort();
          if (this.accumulatedText.trim()) {
            this.finalize(this.accumulatedText);
          } else {
            this.handlers.onError(
              "Sorry, I didn't hear that. Tap the microphone and try again.",
              false
            );
          }
        }
      };

      this.recognition.onend = () => {
        this.cleanupTimers();
        this.isListening = false;

        // If speech was captured and not yet finalized, finalize it now
        if (!this.finalized && this.accumulatedText.trim()) {
          this.finalize(this.accumulatedText);
        } else if (!this.finalized && !this.hasReceivedSpeech) {
          // Ended with no speech captured
          this.handlers.onReset();
        }
      };

      this.recognition.start();
    } catch (err: any) {
      console.warn('SpeechRecognition start failed:', err);
      this.cleanupTimers();
      this.safelyAbort();
      this.handlers.onError(
        'Could not access microphone. Tap to try again.',
        false
      );
    }
  }

  public finalize(finalText: string) {
    if (this.finalized) return;
    this.finalized = true;
    this.isListening = false;

    this.cleanupTimers();
    this.safelyStop();

    const clean = (finalText || this.accumulatedText).trim();
    if (clean) {
      this.handlers.onSpeechEnd(clean);
    } else {
      this.handlers.onError(
        "Sorry, I didn't hear that. Tap the microphone and try again.",
        false
      );
    }
  }

  public stop() {
    this.isListening = false;
    this.finalized = true;
    this.cleanupTimers();
    this.safelyAbort();
    this.handlers.onReset();
  }

  private clearInitialSilenceTimer() {
    if (this.initialSilenceTimer) {
      clearTimeout(this.initialSilenceTimer);
      this.initialSilenceTimer = null;
    }
  }

  private clearPauseTimer() {
    if (this.pauseDebounceTimer) {
      clearTimeout(this.pauseDebounceTimer);
      this.pauseDebounceTimer = null;
    }
  }

  private cleanupTimers() {
    this.clearInitialSilenceTimer();
    this.clearPauseTimer();
    if (this.maxDurationTimer) {
      clearTimeout(this.maxDurationTimer);
      this.maxDurationTimer = null;
    }
  }

  private safelyStop() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
  }

  private safelyAbort() {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {
        // ignore
      }
      this.recognition = null;
    }
  }
}
