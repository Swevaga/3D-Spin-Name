import React, { useState, useEffect } from 'react';
import { Trash2, Settings, Users, Trophy } from 'lucide-react';
import { GithubIcon, InstagramIcon, DiscordIcon } from './components/Icons';
import confetti from 'canvas-confetti';
import CardDraw from './components/CardDraw';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const defaultNames = "Budi\nSiti\nAndi\nJoko\nDewi";
  const [isLoading, setIsLoading] = useState(true);
  const [namesText, setNamesText] = useState(defaultNames);
  const [namesList, setNamesList] = useState<string[]>(defaultNames.split('\n'));
  const [winnersList, setWinnersList] = useState<string[]>([]);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [maxWinners, setMaxWinners] = useState<number>(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<string | null>(null);
  const [showManualPrompt, setShowManualPrompt] = useState(false);

  useEffect(() => {
    // Simulate loading screen
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateNames = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNamesText(e.target.value);
    const parsedNames = e.target.value
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);
    setNamesList(parsedNames);
  };

  const handleDraw = () => {
    if (namesList.length === 0) {
      alert("Masukkan minimal 1 nama!");
      return;
    }
    if (winnersList.length >= maxWinners) {
      alert("Batas maksimal pemenang telah tercapai!");
      return;
    }

    setIsDrawing(true);
    setCurrentWinner(null);
    setShowManualPrompt(false);

    // Pick a random winner
    const randomIndex = Math.floor(Math.random() * namesList.length);
    const winner = namesList[randomIndex];
    setCurrentWinner(winner);

    // Wait for animation to finish (4 seconds)
    setTimeout(() => {
      triggerWinEffect();
      
      if (mode === 'auto') {
        // Auto mode: remove from list and add to winners
        const newNamesList = [...namesList];
        newNamesList.splice(randomIndex, 1);
        setNamesList(newNamesList);
        setNamesText(newNamesList.join('\n'));
        
        setWinnersList(prev => [...prev, winner]);
        setTimeout(() => {
          setIsDrawing(false);
        }, 3000);
      } else {
        // Manual mode: wait for user decision
        setShowManualPrompt(true);
      }
    }, 3500); // 3.5s to trigger confetti after 3s flip
  };

  const triggerWinEffect = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD700', '#FFA500', '#FF4500']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD700', '#FFA500', '#FF4500']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleManualDecision = (keepNameInList: boolean) => {
    if (!currentWinner) return;

    if (!keepNameInList) {
      const newNamesList = namesList.filter(n => n !== currentWinner);
      setNamesList(newNamesList);
      setNamesText(newNamesList.join('\n'));
    }

    setWinnersList(prev => [...prev, currentWinner]);
    setShowManualPrompt(false);
    setIsDrawing(false);
  };

  const resetWinners = () => {
    if (window.confirm("Yakin ingin mereset daftar pemenang?")) {
      setWinnersList([]);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 shadow-md flex justify-between items-center z-10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
          Spin Card Name
        </h1>
        <div className="flex gap-4">
          <a href="https://www.instagram.com/roufdarkside/" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition">
            <InstagramIcon size={24} />
          </a>
          <a href="https://github.com/Swevaga" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition">
            <GithubIcon size={24} />
          </a>
          <a href="https://discordapp.com/users/1459104242660016155" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition">
            <DiscordIcon size={24} />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row p-4 gap-6 relative">
        {/* Left Panel: Input & Settings */}
        <div className="w-full lg:w-1/4 flex flex-col gap-4 z-10">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xl">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-3 text-amber-300">
              <Users size={20} /> Input Nama ({namesList.length})
            </h2>
            <textarea
              className="w-full h-48 bg-slate-800 border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-amber-500 transition resize-none"
              placeholder="Masukkan nama, pisahkan dengan enter..."
              value={namesText}
              onChange={handleUpdateNames}
              disabled={isDrawing}
            />
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xl">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-3 text-amber-300">
              <Settings size={20} /> Pengaturan
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Mode Undian</label>
                <div className="flex bg-slate-800 rounded-lg p-1">
                  <button
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition ${mode === 'auto' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    onClick={() => setMode('auto')}
                    disabled={isDrawing}
                  >
                    Auto
                  </button>
                  <button
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition ${mode === 'manual' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    onClick={() => setMode('manual')}
                    disabled={isDrawing}
                  >
                    Manual
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {mode === 'auto' ? '*Nama terpilih otomatis dihapus' : '*Opsi hapus/simpan setelah nama terpilih'}
                </p>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Maksimal Pemenang</label>
                <input
                  type="number"
                  min="1"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 focus:outline-none focus:border-amber-500"
                  value={maxWinners}
                  onChange={(e) => setMaxWinners(parseInt(e.target.value) || 1)}
                  disabled={isDrawing}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel: 3D Cards */}
        <div className="w-full lg:w-2/4 flex flex-col items-center justify-center relative min-h-[500px] bg-slate-900/50 rounded-2xl border border-slate-800 shadow-inner overflow-hidden">
          <CardDraw isDrawing={isDrawing} winner={currentWinner} />
          
          {/* Main Draw Button */}
          {!isDrawing && !showManualPrompt && (
            <button
              onClick={handleDraw}
              className="absolute bottom-8 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] transform hover:scale-105 transition-all text-xl"
            >
              Kocok Kartu!
            </button>
          )}

          {/* Manual Mode Prompt */}
          {showManualPrompt && (
            <div className="absolute bottom-8 bg-slate-900 border border-amber-500/50 p-4 rounded-xl shadow-2xl flex flex-col items-center gap-3 z-50 animate-fade-in">
              <p className="text-amber-300 font-semibold text-lg">Pemenang: {currentWinner}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleManualDecision(false)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition"
                >
                  Hapus dari Daftar
                </button>
                <button
                  onClick={() => handleManualDecision(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition"
                >
                  Simpan dalam Daftar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Winners List */}
        <div className="w-full lg:w-1/4 flex flex-col z-10">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-amber-300">
                <Trophy size={20} /> Pemenang
              </h2>
              <span className="bg-slate-800 px-2 py-1 rounded text-sm text-slate-300">
                {winnersList.length} / {maxWinners}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-2">
              {winnersList.length === 0 ? (
                <p className="text-slate-500 text-center italic mt-10">Belum ada pemenang</p>
              ) : (
                winnersList.map((winner, index) => (
                  <div key={index} className="bg-slate-800 border border-slate-700 p-3 rounded-lg flex items-center gap-3 animate-fade-in-up">
                    <div className="bg-amber-500/20 text-amber-400 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="font-medium text-slate-200 truncate">{winner}</span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={resetWinners}
              className="mt-auto flex items-center justify-center gap-2 w-full py-2 bg-slate-800 hover:bg-red-900/30 text-red-400 hover:text-red-300 rounded-lg border border-slate-700 hover:border-red-800 transition"
              disabled={winnersList.length === 0 || isDrawing}
            >
              <Trash2 size={16} /> Reset Pemenang
            </button>
          </div>
        </div>
      </main>

      <footer className="text-center p-4 text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Spin Card Name - By Evaga (Rouf)
      </footer>
    </div>
  );
}

export default App;
