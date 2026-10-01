import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { processConversationTurn } from './src/utils/conversationEngine';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini client if API key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KisanMitra AI Real-Time Voice Backend',
    aiAvailable: !!aiClient,
    timestamp: new Date().toISOString()
  });
});

// Real-Time Conversational Voice Assistant Turn endpoint
app.post('/api/voice-turn', async (req, res) => {
  const { userUtterance, language = 'en', context } = req.body;

  if (!userUtterance) {
    return res.status(400).json({ error: 'userUtterance is required' });
  }

  // First process with agricultural benchmark and state engine
  const ruleResult = processConversationTurn(userUtterance, context || {}, language);

  // If Gemini client is available, refine spoken phrasing for conversational flow
  if (aiClient && ruleResult.screenData.type !== 'data_unavailable') {
    try {
      const prompt = `You are KisanMitra AI, an empathetic Indian agricultural voice assistant speaking to a farmer.
Language for voice response: ${ruleResult.switchedLanguage || language}.
User asked: "${userUtterance}"
Context: Crop=${ruleResult.updatedContext.crop}, Quantity=${ruleResult.updatedContext.quantityKg} kg, Location=${ruleResult.updatedContext.location}.
Factual numbers from Agmarknet benchmark database:
${JSON.stringify(ruleResult.screenData, null, 2)}

Instructions:
1. Speak concisely in 1 to 2 clear, friendly spoken sentences in the requested language.
2. If this is a price question, mention the highest price market and rate per kg.
3. If this is a transport or net realization question, explain the net in-hand earnings after freight.
4. Keep the factual numbers EXACTLY matching the benchmark database above. Do not invent any other numbers.
5. Return ONLY the spoken response string.`;

      const aiResponse = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.2,
        }
      });

      if (aiResponse.text && aiResponse.text.trim()) {
        ruleResult.voiceResponse = aiResponse.text.trim();
      }
    } catch (err: any) {
      console.warn('Gemini voice turn refinement warning (using rule result):', err?.message);
    }
  }

  return res.json(ruleResult);
});

// General Q&A endpoint
app.post('/api/ask', async (req, res) => {
  const { query, language = 'English', farmerContext } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  if (aiClient) {
    try {
      const systemInstruction = `You are KisanMitra AI, an empathetic, expert agricultural post-harvest selling advisor for Indian farmers.
Respond in ${language}.
Farmer Context: ${farmerContext ? JSON.stringify(farmerContext) : 'None'}
Guidelines: Focus on net price after transport, APMC mandi fees, storage, weather. Be concise, direct and respectful.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: query,
        config: {
          systemInstruction,
          temperature: 0.3,
        }
      });

      return res.json({
        answer: response.text,
        source: 'gemini-3.8-flash'
      });
    } catch (err: any) {
      console.warn('Gemini ask error:', err?.message);
    }
  }

  // Fallback
  return res.json({
    answer: `KisanMitra Recommendation: Always calculate your net in-hand realization after vehicle transport freight and mandi deductions. Storing dry produce in WDRA registered godowns can yield higher off-season returns.`,
    source: 'kisanmitra-rulebase'
  });
});

async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`KisanMitra AI server listening on http://0.0.0.0:${port}`);
  });
}

setupServer().catch(err => {
  console.error('Failed to start server:', err);
});
