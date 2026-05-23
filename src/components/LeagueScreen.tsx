import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LeaderboardItem } from '../types';
import { Trophy, Clock, ChevronUp, ChevronDown } from 'lucide-react';

interface LeagueScreenProps {
  totalXP: number;
}

const INITIAL_MOCK_LEADERBOARD = [
  { name: "Анар", avatar: "🦊", xp: 2850, me: false },
  { name: "Дорж", avatar: "🐯", xp: 2650, me: false },
  { name: "Чимэг", avatar: "🦁", xp: 2440, me: false },
  { name: "Тайван Хэрэглэгч", avatar: "🐼", xp: 2310, me: true },
  { name: "Болд", avatar: "🦅", xp: 1890, me: false },
  { name: "Сарнай", avatar: "🦋", xp: 1540, me: false },
  { name: "Ганбат", avatar: "🐻", xp: 1220, me: false },
  { name: "Мөнхцэцэг", avatar: "🦄", xp: 980, me: false },
  { name: "Бямба", avatar: "🐨", xp: 720, me: false },
  { name: "Оюунбаатар", avatar: "🦊", xp: 540, me: false },
];

export default function LeagueScreen({ totalXP }: LeagueScreenProps) {
  const [board, setBoard] = useState<LeaderboardItem[]>(INITIAL_MOCK_LEADERBOARD);

  // Synchronize active user's XP on props update
  useEffect(() => {
    setBoard(prev => {
      const updated = prev.map(item => {
        if (item.me) {
          return { ...item, xp: totalXP };
        }
        return item;
      });
      // Sort immediately
      return updated.sort((a, b) => b.xp - a.xp);
    });
  }, [totalXP]);

  // Simulate active background competition! Other players gain small randomized XP ticks
  useEffect(() => {
    const timer = setInterval(() => {
      setBoard(prev => {
        const randIndex = Math.floor(Math.random() * prev.length);
        const itemToUpdate = prev[randIndex];
        
        // Prevent upgrading myself in the background, only mock competitors increment
        if (itemToUpdate && !itemToUpdate.me) {
          const updated = prev.map((item, idx) => {
            if (idx === randIndex) {
              const gained = Math.round(10 + Math.random() * 20);
              return { ...item, xp: item.xp + gained };
            }
            return item;
          });
          // Sort after modification
          return updated.sort((a, b) => b.xp - a.xp);
        }
        return prev;
      });
    }, 12000); // every 12 seconds check

    return () => clearInterval(timer);
  }, []);

  const myRank = board.findIndex(item => item.me) + 1;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#131F24]">
      
      {/* Golden Promotion banner */}
      <div className="bg-amber-400 text-amber-950 p-4 border-b border-amber-500/10 flex items-center justify-between shadow-xs select-none">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-xs">
            <Trophy size={20} className="fill-amber-600 stroke-amber-900" />
          </div>
          <div>
            <h3 className="text-xs font-black tracking-tight uppercase m-0 leading-tight">
              💎 ОЧИР ЭРДЭНЭ ЛИГ (Diamond)
            </h3>
            <span className="text-[10px] font-bold text-amber-950/85 block">
              Шилдэг 3-т орж шагнал гардана уу!
            </span>
          </div>
        </div>

        {/* Dynamic ticking Countdown timer */}
        <div className="flex items-center gap-1.5 bg-neutral-950/15 px-3 py-1.5 rounded-xl border border-white/10 shrink-0 text-white font-extrabold text-[10px]">
          <Clock size={12} className="stroke-[2.5]" />
          <span>⏰ 2 өдөр үлдлээ</span>
        </div>
      </div>

      {/* Promotion Threshold Explanation Caption */}
      <div className="px-5 py-3.5 bg-[#172328] text-sky-200 border-b border-zinc-805 flex items-center gap-3.5 select-none text-[11px] font-bold">
        <span>🎉 Өнөөдрийн дүн:</span>
        <span className="bg-sky-950 text-sky-350 px-2 py-0.5 rounded-md border border-sky-900/40 font-black">
          Таны байр: {myRank}-р байр ({totalXP} XP)
        </span>
        <span className="text-sky-450 ml-auto flex items-center gap-0.5 font-bold">
          {myRank <= 3 ? <ChevronUp size={14} className="stroke-[3] text-emerald-450" /> : <ChevronDown size={14} className="stroke-[3] text-rose-455" />}
          {myRank <= 3 ? "Шат ахих" : "Хэвээр үлдэх"}
        </span>
      </div>

      {/* Leaderboard Table Grid list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 pb-16 scrollbar-thin scrollbar-thumb-zinc-850">
        <AnimatePresence initial={false}>
          {board.map((item, idx) => {
            const rank = idx + 1;
            const isMe = item.me;

            return (
              <motion.div
                key={item.name}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className={`p-3.5 rounded-2xl flex items-center justify-between border select-none transition-shadow ${
                  isMe 
                    ? "bg-amber-400 border-amber-500/40 text-amber-950 shadow-md ring-2 ring-amber-300 font-extrabold" 
                    : rank <= 3 
                      ? "bg-[#202F36] border-[#2b3c44] shadow-sm hover:shadow-md text-white" 
                      : "bg-[#1c2a30]/85 border-[#25353d]/50 text-zinc-300"
                }`}
              >
                {/* Left Placement & Avatar Section */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Rank visual representation */}
                  <div className="w-7 text-center shrink-0">
                    {rank === 1 && (
                      <span className="text-2xl filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] select-none">🥇</span>
                    )}
                    {rank === 2 && (
                      <span className="text-2xl filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] select-none">🥈</span>
                    )}
                    {rank === 3 && (
                      <span className="text-2xl filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] select-none">🥉</span>
                    )}
                    {rank > 3 && (
                      <span className={`text-xs font-black tracking-tight ${isMe ? 'text-amber-955' : 'text-zinc-550'}`}>
                        {rank}
                      </span>
                    )}
                  </div>

                  {/* Character Avatar Icon Frame */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 border select-none shadow-xs ${
                    isMe ? 'bg-white/40 border-white/20' : 'bg-[#172328] border-[#2b3c44]'
                  }`}>
                    {item.avatar}
                  </div>

                  {/* Competitor Name */}
                  <span className={`text-xs tracking-tight truncate leading-tight ${isMe ? 'font-black' : 'font-extrabold text-zinc-100'}`}>
                    {item.name} 
                    {isMe && <span className="ml-1.5 bg-white/25 text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-full uppercase">БИ</span>}
                  </span>
                </div>

                {/* Right Experience values */}
                <div className="flex items-center gap-1 shrink-0 font-black text-xs">
                  <span className={isMe ? "text-amber-955" : "text-zinc-200"}>
                    {item.xp.toLocaleString()}
                  </span>
                  <span className={`text-[10px] font-bold ${isMe ? 'text-amber-950/70' : 'text-zinc-500'}`}>
                    XP
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Encouragement Footer Panel */}
      <div className="bg-[#172328] p-3 pt-3 border-t border-zinc-800 flex items-center justify-center text-center text-[10px] font-bold text-zinc-500 select-none pb-4 shrink-0">
        ⚔️ Лигийн шинэчлэл 12 секунд тутамд явагдаж байна
      </div>
    </div>
  );
}
