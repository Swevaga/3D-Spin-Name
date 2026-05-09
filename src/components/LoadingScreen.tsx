import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-[100] text-amber-400">
      <div className="relative w-32 h-48 mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.5)] animate-spin-slow"></div>
        <div className="absolute inset-[2px] bg-slate-900 rounded-xl flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-2 tracking-widest uppercase bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent animate-pulse">
        Spin Card Name
      </h1>
      <p className="text-slate-400 font-medium tracking-wide">By Evaga (Rouf)</p>
    </div>
  );
};

export default LoadingScreen;
