import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Coins, HelpCircle, AlertCircle, RefreshCw, Zap } from 'lucide-react';
import { sounds } from '../utils/sound';
import { AuraSkin } from '../utils/auraData';
import ArenaScreen from './ArenaScreen';
import AuraShopScreen from './AuraShopScreen';

interface GachaScreenProps {
  gems: number;
  totalXP: number;
  setGems: React.Dispatch<React.SetStateAction<number>>;
  setTotalXP: React.Dispatch<React.SetStateAction<number>>;
  triggerConfetti: () => void;
  activeAura: AuraSkin | null;
  setActiveAura: React.Dispatch<React.SetStateAction<AuraSkin | null>>;
  unlockedAuraIds: number[];
  setUnlockedAuraIds: React.Dispatch<React.SetStateAction<number[]>>;
}

const SPIN_ITEMS = ["💎", "🔥", "👑", "🍒", "🍀", "🍇"];

export default function GachaScreen({ 
  gems, 
  totalXP, 
  setGems, 
  setTotalXP, 
  triggerConfetti,
  activeAura,
  setActiveAura,
  unlockedAuraIds,
  setUnlockedAuraIds
}: GachaScreenProps) {
  
  // Tab routing parameters
  const [activeTab, setActiveTab] = useState<"slot" | "scratch" | "arena" | "shop">("slot");
  
  const [reels, setReels] = useState(["💎", "👑", "🔥"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<{ title: string; desc: string; winGems: number; winXP: number; jackpot: boolean } | null>(null);
  const [statusMessage, setStatusMessage] = useState("Нэг эргэлт: 45 💎");

  // Scratch card ticket simulator
  const [scratchCardActive, setScratchCardActive] = useState(false);
  const [scratchResult, setScratchResult] = useState<{ value: string; x: number; y: number }[]>([]);
  const [scratchedIndexes, setScratchedIndexes] = useState<number[]>([]);
  const [hasScratchWon, setHasScratchWon] = useState<boolean | null>(null);

  // Play slot spinning animation loop
  const handleSpinSlots = () => {
    if (gems < 45) {
      sounds.playWrong();
      setStatusMessage("🚨 Эрдэнэ хүрэлцэхгүй байна! Түвшин давж цуглуулаарай.");
      return;
    }

    // Deduct gems
    setGems(prev => prev - 45);
    setIsSpinning(true);
    setSpinResult(null);
    setStatusMessage("Эргэлдэж байна... 🎰");

    let counter = 0;
    const interval = setInterval(() => {
      // Pick random items for reels
      const randReel1 = SPIN_ITEMS[Math.floor(Math.random() * SPIN_ITEMS.length)];
      const randReel2 = SPIN_ITEMS[Math.floor(Math.random() * SPIN_ITEMS.length)];
      const randReel3 = SPIN_ITEMS[Math.floor(Math.random() * SPIN_ITEMS.length)];
      
      setReels([randReel1, randReel2, randReel3]);
      sounds.playSlotSpin();

      counter++;
      if (counter > 14) {
        clearInterval(interval);
        
        // Final Results Calculation
        const finalReel1 = SPIN_ITEMS[Math.floor(Math.random() * SPIN_ITEMS.length)];
        const finalReel2 = SPIN_ITEMS[Math.floor(Math.random() * SPIN_ITEMS.length)];
        let finalReel3 = SPIN_ITEMS[Math.floor(Math.random() * SPIN_ITEMS.length)];

        // Rig high-adrenaline winning rates moderately for maximum fun and user dopamine!
        if (Math.random() < 0.28) {
          // forces exact high hit match!
          finalReel3 = finalReel1;
        }

        setReels([finalReel1, finalReel2, finalReel3]);
        calculatePrizes(finalReel1, finalReel2, finalReel3);
      }
    }, 110);
  };

  const calculatePrizes = (r1: string, r2: string, r3: string) => {
    setIsSpinning(false);
    
    // 3 Matches Jackpot
    if (r1 === r2 && r2 === r3) {
      let winGems = 150;
      let winXP = 100;
      let title = "ЖЕКПОТ АВЛАА! 👑💎";
      let desc = "Гурван ижил тэмдэг таарлаа! Аз таныг ивээв.";

      if (r1 === "💎") {
        winGems = 450;
        winXP = 200;
        title = "ЭРДЭНИЙН ИХ ЖЕКПОТ!!! 💎💎💎";
      } else if (r1 === "👑") {
        winGems = 300;
        winXP = 150;
        title = "ХААНЫ СҮРЛЭГ ХИТ!!! 👑👑👑";
      }

      setGems(prev => prev + winGems);
      setTotalXP(prev => prev + winXP);
      setSpinResult({ title, desc, winGems, winXP, jackpot: true });
      setStatusMessage("🎉 ИХ ХОЖОЛ 🎉");
      sounds.playSlotWin();
      triggerConfetti();
    }
    // 2 Matches Mini Win
    else if (r1 === r2 || r2 === r3 || r1 === r3) {
      const matchSym = r1 === r2 ? r1 : r3;
      const winGems = matchSym === "💎" ? 30 : matchSym === "🍒" ? 25 : 20;
      const winXP = 15;

      setGems(prev => prev + winGems);
      setTotalXP(prev => prev + winXP);
      setSpinResult({
        title: "Бага Хожил! 🍒✨",
        desc: "Хоёр хос тэмдэг амжилттай таарлаа.",
        winGems,
        winXP,
        jackpot: false
      });
      setStatusMessage("👍 Зүгээр шүү!");
      sounds.playCorrect();
    }
    // No matches
    else {
      setSpinResult({
        title: "Дараагийн удаа... 🍀",
        desc: "Харамсалтай нь хожил таарсангүй. Дахин амжилтаа туршаарай!",
        winGems: 0,
        winXP: 0,
        jackpot: false
      });
      setStatusMessage("Нэг эргэлт: 45 💎");
      sounds.playWrong();
    }
  };

  // Scratch card mechanics
  const handleStartScratch = () => {
    if (gems < 30) {
      sounds.playWrong();
      setStatusMessage("🚨 Эрдэнэ хүрэлцэхгүй байна! (Хэрэгцээ: 30 💎)");
      return;
    }
    setGems(prev => prev - 30);
    setScratchedIndexes([]);
    setHasScratchWon(null);

    // Populate gacha prize items
    const prizes = ["💎", "💎", "🔥", "❌", "👑", "❌"];
    // Shuffle
    const shuffled = prizes
      .map((item, idx) => ({ value: item, x: idx % 3, y: Math.floor(idx / 3) }))
      .sort(() => Math.random() - 0.5);

    setScratchResult(shuffled);
    setScratchCardActive(true);
    setStatusMessage("Шударч хусна уу! ✨💅");
  };

  const handleScratchCell = (idx: number) => {
    if (scratchedIndexes.includes(idx)) return;
    const nextIdxList = [...scratchedIndexes, idx];
    setScratchedIndexes(nextIdxList);
    sounds.playCardFlip();

    // Check if card matches any positive results after scratching major parts
    if (nextIdxList.length === 6) {
      const matches = scratchResult.filter(r => r.value !== "❌");
      if (matches.length >= 3) {
        setGems(prev => prev + 60);
        setTotalXP(prev => prev + 30);
        setHasScratchWon(true);
        sounds.playSlotWin();
        triggerConfetti();
      } else {
        setHasScratchWon(false);
        sounds.playWrong();
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto pb-16 bg-[#131F24] text-white scrollbar-thin scrollbar-thumb-amber-600/20">
      
      {/* 4 Multi-tab Switcher Bar Navigation header */}
      <div className="px-3 py-3 bg-[#131F24] border-b border-zinc-800 flex gap-1 items-center overflow-x-auto shrink-0 select-none scrollbar-none">
        
        <button
          onClick={() => setActiveTab("slot")}
          className={`px-3 py-2 rounded-xl text-[10px] font-black tracking-tight shrink-0 transition-all uppercase ${
            activeTab === 'slot' 
              ? 'bg-amber-400 text-neutral-950 font-black shadow-md' 
              : 'text-zinc-400 hover:text-white bg-[#202F36] hover:bg-zinc-800'
          }`}
        >
          🎰 Слотс
        </button>

        <button
          onClick={() => setActiveTab("scratch")}
          className={`px-3 py-2 rounded-xl text-[10px] font-black tracking-tight shrink-0 transition-all uppercase ${
            activeTab === 'scratch' 
              ? 'bg-amber-400 text-neutral-950 font-black shadow-md' 
              : 'text-zinc-400 hover:text-white bg-[#202F36] hover:bg-zinc-800'
          }`}
        >
          💅 Лото хусах
        </button>

        <button
          onClick={() => setActiveTab("arena")}
          className={`px-3 py-2 rounded-xl text-[10px] font-black tracking-tight shrink-0 transition-all uppercase ${
            activeTab === 'arena' 
              ? 'bg-amber-400 text-neutral-950 font-black shadow-md' 
              : 'text-zinc-400 hover:text-white bg-[#202F36] hover:bg-zinc-800'
          }`}
        >
          ⚔️ Мөрийт Дуэль
        </button>

        <button
          onClick={() => setActiveTab("shop")}
          className={`px-3 py-2 rounded-xl text-[10px] font-black tracking-tight shrink-0 transition-all uppercase ${
            activeTab === 'shop' 
              ? 'bg-amber-400 text-neutral-950 font-black shadow-md' 
              : 'text-zinc-400 hover:text-white bg-[#202F36] hover:bg-zinc-800'
          }`}
        >
          🎨 Аура (60 Шалны)
        </button>
      </div>

      {/* Render selected view */}
      {activeTab === "slot" && (
        <div className="px-5 mt-4 flex flex-col items-center">
          
          {/* Visual Header */}
          <div className="text-center mb-4 max-w-xs select-none">
            <h2 className="text-xs font-black text-amber-400 uppercase tracking-wide">Алтан Слот Машин</h2>
            <p className="text-[9px] text-gray-400 font-bold mt-1 max-w-[210px] mx-auto leading-normal">
              45 💎 ашиглан эргүүлж гурван ижил тэмдэг тааруулан авдар Эрдэнэ, XP хож!
            </p>
          </div>

          {/* Mechanical Main Cabinet Frame */}
          <div className="w-full max-w-sm rounded-3xl bg-neutral-950 p-6 border-4 border-amber-400 shadow-[0_15px_40px_rgba(245,158,11,0.25)] relative overflow-hidden flex flex-col items-center">
            
            {/* Top gold display neon bar */}
            <div className="w-full text-center bg-amber-400 text-neutral-950 text-[11px] font-black py-1.5 rounded-t-xl mb-4 select-none animate-pulse">
              CASINO MULTIPLIERS ONLINE
            </div>

            {/* Core Reels block */}
            <div className="grid grid-cols-3 gap-3 w-full bg-neutral-900 p-4 rounded-2xl border border-white/10 relative overflow-hidden min-h-[120px] items-center">
              
              {reels.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`h-20 bg-neutral-800 rounded-xl flex items-center justify-center text-4xl border-2 shadow-inner select-none overflow-hidden relative ${
                    isSpinning 
                      ? 'border-yellow-400 shadow-yellow-500/20' 
                      : 'border-orange-500/30'
                  }`}
                >
                  <motion.div
                    key={item + idx}
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                    className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                  >
                    {item}
                  </motion.div>

                  {/* Horizontal indicator golden guideline */}
                  <div className="absolute inset-y-1/2 inset-x-0 h-0.5 bg-red-500/45 pointer-events-none mix-blend-screen" />
                </div>
              ))}
            </div>

            {/* Spin action trigger button / lever */}
            <div className="w-full mt-6 flex flex-col items-center select-none">
              
              {/* Dynamic Status message text prompt */}
              <div className="text-center text-xs font-bold text-amber-200 mb-3 block truncate max-w-full">
                {statusMessage}
              </div>

              <motion.button
                whileHover={!isSpinning ? { scale: 1.04 } : {}}
                whileTap={!isSpinning ? { scale: 0.94 } : {}}
                disabled={isSpinning}
                onClick={handleSpinSlots}
                style={{
                  background: isSpinning ? "gray" : "linear-gradient(135deg, #fbbf24, #d97706)",
                }}
                className={`w-full text-neutral-950 font-black text-sm tracking-widest py-3.5 rounded-2xl border-b-6 border-amber-700 shadow-lg cursor-pointer outline-hidden relative group overflow-hidden uppercase`}
              >
                {!isSpinning && (
                  <span className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-[-120%] transition-transform duration-1000" />
                )}
                {isSpinning ? "ЭРГҮҮЛЖ БАЙНА..." : "ЭРГҮҮЛЭХ 🎰"}
              </motion.button>
            </div>
          </div>

          {/* Slot prize table checklist */}
          <div className="w-full max-w-sm mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 select-none text-xs space-y-2">
            <span className="block font-black text-amber-400 mb-2.5 uppercase tracking-wider text-[10px]">
              🎁 ШАГНАЛТ ТӨЛӨВЛӨГӨӨ (Payout Table):
            </span>
            <div className="flex justify-between items-center text-gray-300">
              <span className="font-semibold flex items-center gap-1.5">💎💎💎 Трой Эрдэнэ</span>
              <span className="font-extrabold text-amber-400">+450 💎 / +200 XP</span>
            </div>
            <div className="flex justify-between items-center text-gray-350">
              <span className="font-semibold flex items-center gap-1.5">👑👑👑 Сүрлэг Хаан</span>
              <span className="font-extrabold text-amber-400">+300 💎 / +150 XP</span>
            </div>
            <div className="flex justify-between items-center text-gray-350">
              <span className="font-semibold flex items-center gap-1.5">🔥/🍒/🍇 (Ижил 3)</span>
              <span className="font-extrabold text-amber-400">+150 💎 / +100 XP</span>
            </div>
            <div className="flex justify-between items-center text-gray-350">
              <span className="font-semibold flex items-center gap-1.5">Ижил 2 хос тэмдэг</span>
              <span className="font-bold text-gray-350">+20-30 💎</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "scratch" && (
        <div className="px-5 mt-4 flex flex-col items-center">
          
          <div className="w-full max-w-sm p-5 rounded-2xl bg-white/5 border border-white/10 shadow-lg flex flex-col items-center">
            
            <div className="text-center mb-4 select-none">
              <h3 className="font-black text-xs text-amber-400 uppercase leading-snug">Шудардаг Ид Шүү лото</h3>
              <p className="text-[10px] text-gray-400 font-bold mt-1 max-w-[240px]">
                30 💎 төлж, дор хаяж 3 "❌ биш" тэмдэг хусвал асар том өгөөж болох +60 💎 авна!
              </p>
            </div>

            {scratchCardActive ? (
              <div className="grid grid-cols-3 gap-2.5 w-full bg-neutral-950 p-3 rounded-xl border border-white/5 relative min-h-[160px]">
                {scratchResult.map((cell, idx) => {
                  const isScratched = scratchedIndexes.includes(idx);
                  
                  return (
                    <motion.button
                      key={idx}
                      onClick={() => handleScratchCell(idx)}
                      whileHover={!isScratched ? { scale: 1.04 } : {}}
                      whileTap={{ scale: 0.95 }}
                      className={`h-16 rounded-lg flex items-center justify-center text-2xl font-black transition-all cursor-pointer relative shadow-xs overflow-hidden select-none ${
                        isScratched 
                          ? 'bg-neutral-800 text-white font-black border-2 border-amber-400/50' 
                          : 'bg-gradient-to-br from-amber-500 to-amber-700 text-neutral-950 border border-amber-400 shadow-md'
                      }`}
                    >
                      {isScratched ? (
                        cell.value
                      ) : (
                        <span className="text-base font-black">🌟</span>
                      )}
                    </motion.button>
                  );
                })}

                {/* Cover success notification */}
                {hasScratchWon !== null && (
                  <div className="absolute inset-0 bg-neutral-950/92 flex flex-col items-center justify-center text-center p-4">
                    {hasScratchWon ? (
                      <>
                        <span className="text-3xl block mb-1">🎉🤑👑</span>
                        <h4 className="text-sm font-black text-amber-400">Азтан таарлаа!</h4>
                        <p className="text-[10px] text-gray-300 font-bold">Та +60 💎, +30 XP хожлоо.</p>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl block mb-1">😭😢</span>
                        <h4 className="text-sm font-black text-gray-400">Харамсалтай байна!</h4>
                        <p className="text-[10px] text-gray-500 font-bold">Үр дүн хүрэлцсэнгүй.</p>
                      </>
                    )}
                    <button
                      onClick={() => setScratchCardActive(false)}
                      className="mt-3.5 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black text-[10px] px-3.5 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer"
                    >
                      ХААХ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 flex justify-center w-full">
                <button
                  onClick={handleStartScratch}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-102 text-white font-black text-xs py-3.5 px-6 rounded-2xl cursor-pointer shadow-md border-b-4 border-emerald-700 active:scale-95 active:border-b-0 uppercase transition-all"
                >
                  ШИНЭ ХУУДАС ХУДАЛДАН АВАХ (30 💎)
                </button>
              </div>
            )}
            
            {/* Display message status inside Scratch deck */}
            <div className="text-xs text-amber-300 font-bold tracking-tight text-center mt-3 h-5">
              {!scratchCardActive ? `Хандив: 30 💎` : statusMessage}
            </div>
          </div>
        </div>
      )}

      {/* English Wager PvP battles */}
      {activeTab === "arena" && (
        <ArenaScreen 
          gems={gems}
          totalXP={totalXP}
          setGems={setGems}
          setTotalXP={setTotalXP}
          activeAura={activeAura}
          triggerConfetti={triggerConfetti}
        />
      )}

      {/* 60 Aura skins Boutique shop */}
      {activeTab === "shop" && (
        <AuraShopScreen 
          gems={gems}
          setGems={setGems}
          activeAura={activeAura}
          setActiveAura={setActiveAura}
          unlockedAuraIds={unlockedAuraIds}
          setUnlockedAuraIds={setUnlockedAuraIds}
        />
      )}

      {/* Pop-up Results overlay for dynamic slot payouts feedback */}
      <AnimatePresence>
        {spinResult && (
          <div className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-neutral-900 select-none text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-3xl w-full max-w-sm text-center shadow-3xl border border-amber-300 block relative"
            >
              {/* Golden reward banner */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-amber-400 text-neutral-950 font-black text-[10px] py-1 px-4 rounded-full uppercase border-2 border-white tracking-widest shadow-md">
                {spinResult.winGems > 0 ? "УРАМШУУЛАЛ" : "ДУУСЛАА"}
              </div>

              <span className="text-5xl block mb-2 mt-2 select-none">
                {spinResult.winGems > 0 ? "🥇💰🎰" : "🍀⚙️"}
              </span>

              <h3 className="text-md font-black text-gray-900 leading-tight">
                {spinResult.title}
              </h3>
              
              <p className="text-[11px] text-gray-500 mt-2 font-bold leading-relaxed max-w-[260px] mx-auto">
                {spinResult.desc}
              </p>

              {/* Won points statistics tickers block */}
              {spinResult.winGems > 0 && (
                <div className="grid grid-cols-2 gap-3.5 mt-5">
                  <div className="bg-sky-50 border border-sky-100 p-2 rounded-xl text-center">
                    <span className="block text-[8px] font-black text-sky-600 uppercase font-sans">Эрдэнэ урамшуулал</span>
                    <span className="text-xs font-black text-sky-950">+{spinResult.winGems} 💎</span>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 p-2 rounded-xl text-center">
                    <span className="block text-[8px] font-black text-amber-600 uppercase font-sans">Туршлага (XP)</span>
                    <span className="text-xs font-black text-amber-950">+{spinResult.winXP} XP</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSpinResult(null)}
                className="w-full mt-6 bg-neutral-950 hover:bg-neutral-900 active:scale-95 text-white font-extrabold text-xs py-3 rounded-2xl transition-all cursor-pointer"
              >
                ОЙЛГОСОН (Баярлалаа!)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
