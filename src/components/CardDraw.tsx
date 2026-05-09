import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type CardDrawProps = {
  isDrawing: boolean;
  winner: string | null;
};

const CardDraw: React.FC<CardDrawProps> = ({ isDrawing, winner }) => {
  const [phase, setPhase] = useState<'idle' | 'shuffling' | 'revealing'>('idle');

  useEffect(() => {
    if (isDrawing) {
      setPhase('shuffling');
      const timer = setTimeout(() => {
        setPhase('revealing');
      }, 3000); // Shuffle for 3 seconds
      return () => clearTimeout(timer);
    } else {
      setPhase('idle');
    }
  }, [isDrawing]);

  const cards = [0, 1, 2, 3, 4];

  // Variations for flying out
  const flyOutVariants = [
    { x: -300, y: -200, rotate: -45 },
    { x: 300, y: -200, rotate: 45 },
    { x: -300, y: 200, rotate: -45 },
    { x: 300, y: 200, rotate: 45 },
  ];

  return (
    <div className="relative w-64 h-96 perspective-[1000px] flex items-center justify-center">
      <AnimatePresence>
        {cards.map((i) => {
          const isWinnerCard = i === 0;

          // Compute variants based on phase
          let animateProps: any = {};
          let transitionProps: any = {};

          if (phase === 'idle') {
            animateProps = {
              x: (i - 2) * 30,
              y: Math.abs(i - 2) * 10,
              rotateZ: (i - 2) * 8,
              rotateY: 0,
              scale: 1,
              opacity: 1,
              zIndex: i,
            };
            transitionProps = { type: 'spring', stiffness: 200, damping: 20 };
          } else if (phase === 'shuffling') {
            animateProps = {
              x: [0, (i % 2 === 0 ? 50 : -50), 0, (i % 2 === 0 ? -50 : 50), 0],
              y: [0, (i % 2 === 0 ? -20 : 20), 0, (i % 2 === 0 ? 20 : -20), 0],
              rotateZ: [0, 10, -10, 5, 0],
              rotateY: 0,
              scale: 1,
              opacity: 1,
              zIndex: [i, 4 - i, i, 4 - i, i], // Fake z-index shuffle
            };
            transitionProps = {
              duration: 0.6,
              repeat: 4, // 5 * 0.6 = 3s total
              ease: 'easeInOut',
            };
          } else if (phase === 'revealing') {
            if (isWinnerCard) {
              animateProps = {
                x: 0,
                y: 0,
                rotateZ: 0,
                rotateY: 180,
                scale: 1.2,
                opacity: 1,
                zIndex: 50,
              };
              transitionProps = { duration: 0.8, type: 'spring', bounce: 0.4 };
            } else {
              animateProps = {
                x: flyOutVariants[i - 1].x,
                y: flyOutVariants[i - 1].y,
                rotateZ: flyOutVariants[i - 1].rotate,
                opacity: 0,
                scale: 0.5,
              };
              transitionProps = { duration: 0.8, ease: 'easeOut' };
            }
          }

          return (
            <motion.div
              key={i}
              initial={false}
              animate={animateProps}
              transition={transitionProps}
              className="absolute w-64 h-96 rounded-2xl shadow-2xl preserve-3d cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Back of Card (Mythic/Legendary Style) */}
              <div className="absolute inset-0 backface-hidden rounded-2xl border-2 border-amber-500/50 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                {/* Ornate border patterns */}
                <div className="absolute inset-2 border border-amber-600/30 rounded-xl"></div>
                <div className="absolute inset-4 border border-amber-500/20 rounded-lg"></div>
                
                {/* Center glowing element */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 bg-amber-500 blur-xl opacity-30 rounded-full animate-pulse"></div>
                  <div className="w-16 h-16 border-4 border-amber-500 rotate-45 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-amber-300 -rotate-45"></div>
                  </div>
                </div>

                {/* Stars/Dots */}
                <div className="absolute top-8 left-8 w-1 h-1 bg-amber-300 rounded-full shadow-[0_0_5px_#fcd34d]"></div>
                <div className="absolute top-8 right-8 w-1 h-1 bg-amber-300 rounded-full shadow-[0_0_5px_#fcd34d]"></div>
                <div className="absolute bottom-8 left-8 w-1 h-1 bg-amber-300 rounded-full shadow-[0_0_5px_#fcd34d]"></div>
                <div className="absolute bottom-8 right-8 w-1 h-1 bg-amber-300 rounded-full shadow-[0_0_5px_#fcd34d]"></div>
              </div>

              {/* Front of Card (Tarot Style) */}
              {isWinnerCard && (
                <div 
                  className="absolute inset-0 backface-hidden rounded-2xl border-4 border-amber-800 bg-[#f4e4bc] flex flex-col items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.6)]"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  {/* Tarot background pattern */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  
                  {/* Ornate corners */}
                  <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-900 rounded-tl-lg"></div>
                  <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-900 rounded-tr-lg"></div>
                  <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-900 rounded-bl-lg"></div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-900 rounded-br-lg"></div>

                  <div className="z-10 text-center px-4">
                    <p className="text-amber-900/60 text-sm font-serif tracking-[0.3em] uppercase mb-4">
                      The Winner
                    </p>
                    <h2 className="text-3xl font-bold text-amber-950 font-serif drop-shadow-sm break-words line-clamp-3">
                      {winner || '?'}
                    </h2>
                  </div>
                  
                  {/* Bottom ornament */}
                  <div className="absolute bottom-6 w-12 h-1 bg-amber-900/40 rounded-full"></div>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default CardDraw;
