import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { CropEntryModal } from './components/CropEntryModal';
import { HomeView } from './views/HomeView';
import { MarketsView } from './views/MarketsView';
import { AskView } from './views/AskView';
import { SchemesView } from './views/SchemesView';
import { ProfileView } from './views/ProfileView';
import { Mic, Volume2 } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isConversationLive,
    orbState,
    startLiveConversation,
    interruptSpeaking
  } = useApp();

  const handleFloatingMic = () => {
    if (activeTab !== 'home' && activeTab !== 'ask') {
      setActiveTab('home');
    }
    if (!isConversationLive) {
      startLiveConversation();
    } else if (orbState === 'speaking') {
      interruptSpeaking();
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f2e9] text-[#1b2a21] flex flex-col items-center">
      {/* Mobile-first frame container */}
      <div className="w-full max-w-md min-h-screen bg-[#faf8f2] shadow-2xl flex flex-col relative border-x border-stone-200/60">
        {/* Sticky Header */}
        <Navbar />

        {/* Dynamic Main View */}
        <main className="flex-1 p-4 overflow-y-auto">
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'markets' && <MarketsView />}
          {activeTab === 'ask' && <AskView />}
          {activeTab === 'schemes' && <SchemesView />}
          {activeTab === 'profile' && <ProfileView />}
        </main>

        {/* Floating Quick Voice Action for Non-Home tabs */}
        {activeTab !== 'home' && activeTab !== 'ask' && (
          <button
            onClick={handleFloatingMic}
            className={`fixed bottom-20 right-4 sm:right-[calc(50%-13rem)] z-30 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-90 border-2 border-white ring-4 group ${
              isConversationLive
                ? 'bg-emerald-500 text-white ring-emerald-400/40 animate-pulse'
                : 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 ring-amber-400/20 shadow-amber-950/30'
            }`}
            title="Talk to KisanMitra"
            aria-label="Talk to KisanMitra"
          >
            {orbState === 'speaking' ? (
              <Volume2 className="w-7 h-7 text-white animate-bounce" />
            ) : (
              <Mic className="w-7 h-7 group-hover:scale-110 transition-transform" />
            )}
          </button>
        )}

        {/* Manual Crop Details Entry Modal */}
        <CropEntryModal />

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
