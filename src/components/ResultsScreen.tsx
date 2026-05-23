import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Zap, Flame, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/sound';

interface ResultsScreenProps {
  xpGained: number;
  correctAnswers: number;
  totalAnswers: number;
  onContinue: () => void;
  onReplay: () => void;
}

export default function ResultsScreen({ xpGained, correctAnswers, totalAnswers, onContinue, onReplay }: ResultsScreenProps) {
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 100;
  
  // High dopamine rewards box states
  const [chestChoice, setChestChoice] = useState<number | null>(null);
  const [chestOpened, setChestOpened] = useState(false);

  // High dopamine Coin Toss extra states
  const [coinFlipping, setCoinFlipping] = useState(false);
  const [coinGambleResult, setCoinGambleResult] = useState<"won" | "lost" | null>(null);
  const [coinSide, setCoinSide] = useState<"heads" | "tails" | null>(null);

  const handleCoinFlip = () => {
    if (coinFlipping || coinGambleResult !== null) return;
    setCoinFlipping(true);
    sounds.playSlotSpin();

    let flips = 0;
    const interval = setInterval(() => {
      setCoinSide(prev => prev === "heads" ? "tails" : "heads");
      flips++;
      if (flips > 10) {
        clearInterval(interval);
        const win = Math.random() < 0.50;
        setCoinSide(win ? "heads" : "tails");
        setCoinGambleResult(win ? "won" : "lost");
        setCoinFlipping(false);
        if (win) {
          sounds.playSlotWin();
        } else {
          sounds.playWrong();
        }
      }
    }, 100);
  };
  
  useEffect(() => {
    // Play victorious fanfare if they got at least one question right
    if (xpGained > 0) {
      sounds.playLevelUp();
    }
  }, [xpGained]);

  // Mongolian motivational slogans based on score accuracy
  const getFeedbackMessage = () => {
    if (xpGained === 0) {
      return {
        title: "Сэтгэлээр бүү унаарай! 💔",
        desc: "Дадлага хийх тусам та Англи хэлийг илүү сайн сурах болно. Өнөөдөр хичээж үзсэн чинь өөрөө гайхалтай амжилт юм!"
      };
    }
    if (accuracy === 100) {
      return {
        title: "Төгс гүйцэтгэл! 🌟💯",
        desc: "Та нэг ч асуулт алдалгүй зөв хариуллаа. Англи хэл таны гарт байна!"
      };
    }
    if (accuracy >= 80) {
      return {
        title: "Гайхалтай амжилт! 🎉👏",
        desc: "Маш сайн үр дүн байна. Түвшинг амжилттай суралцаж, хэлний хөгжилдөө том алхам хийлээ."
      };
    }
    if (accuracy >= 50) {
      return {
        title: "Сайн байна, урагшил! 👍⚡",
        desc: "Суралцах үйл явц амжилттай үргэлжилж байна. Дараагийн хичээлдээ улам хичээгээрэй!"
      };
    }
    return {
      title: "Бага багаар ахиж байна! 💪🌱",
      desc: "Хичээлээ дахин хийж, алдсан цэгүүдээ бататгаснаар та хурдан хугацаанд төгс сурах боломжтой."
    };
  };

  const message = getFeedbackMessage();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50 justify-between">
      {/* Top Graphic Decoration */}
      <div className="flex-1 overflow-y-auto px-5 py-8 max-w-sm mx-auto w-full flex flex-col justify-center items-center">
        
        {/* Colorful Medal / Trophy Graphic Wrapper */}
        <motion.div 
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative mb-5"
        >
          {xpGained > 0 ? (
            <div className="w-28 h-28 bg-amber-400 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              <Trophy size={56} className="text-white filter drop-shadow-sm stroke-[2]" />
            </div>
          ) : (
            <div className="w-28 h-28 bg-neutral-300 rounded-full flex items-center justify-center shadow-lg border-4 border-white animate-pulse">
              <span className="text-5xl select-none" role="img" aria-label="disappointment icon">💔</span>
            </div>
          )}

          {/* Golden animated sparkles if 100% score */}
          {accuracy === 100 && (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute -inset-2.5 rounded-full border-2 border-dashed border-amber-300 pointer-events-none"
            />
          )}
        </motion.div>

        {/* Motivational slogans titles */}
        <motion.div 
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-center space-y-2.5 mb-8"
        >
          <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
            {message.title}
          </h2>
          <p className="text-xs text-gray-500 max-w-[280px] leading-relaxed mx-auto">
            {message.desc}
          </p>
        </motion.div>

        {/* Dynamic statistics metrics block */}
        <div className="grid grid-cols-2 gap-3.5 w-full">
          {/* XP stat item card */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col items-center justify-center text-center shadow-xs"
          >
            <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center mb-1">
              <Zap size={18} className="text-amber-500 fill-amber-400 stroke-[2.5]" />
            </div>
            <span className="block text-[11px] font-extrabold text-gray-400 tracking-tight uppercase">
              Нийт XP
            </span>
            <span className="text-lg font-black text-gray-900 mt-0.5">
              +{xpGained} XP
            </span>
          </motion.div>

          {/* Accuracy stat item card */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col items-center justify-center text-center shadow-xs"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center mb-1">
              <Star size={18} className="text-emerald-500 fill-emerald-400 stroke-[2.5]" />
            </div>
            <span className="block text-[11px] font-extrabold text-gray-400 tracking-tight uppercase">
              Үзүүлэлт
            </span>
            <span className="text-lg font-black text-gray-900 mt-0.5">
              {accuracy}% зөв
            </span>
          </motion.div>
        </div>

        {/* Detailed questions answered summary caption */}
        {xpGained > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-5 text-[11px] font-semibold text-gray-400 tracking-tight"
          >
            📊 Та {totalAnswers} асуултаас {correctAnswers} асуултыг зөв хариуллаа!
          </motion.div>
        )}

        {/* --- HIGH DOPAMINE TREASURE BOX GAMBLE --- */}
        {xpGained > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="w-full mt-6 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-4 rounded-3xl border border-amber-500/20 text-center select-none"
          >
            <h4 className="text-xs font-black text-amber-500 uppercase tracking-wider">
              🎁 АЗЫН ОЛЗ (Double Up Chest!)
            </h4>
            <p className="text-[10px] text-gray-400 font-bold mt-1 max-w-[280px] mx-auto">
              Хоёр авдрын нэгийг сонгон товшиж ур урамшууллаа үржүүлж аваарай!
            </p>

            {/* Glowing boxes row */}
            <div className="flex gap-4 justify-center mt-4">
              {[0, 1].map((index) => {
                const isSelected = chestChoice === index;
                const isOpened = chestOpened;

                return (
                  <motion.button
                    whileHover={!isOpened ? { scale: 1.05, rotate: [0, -3, 3, 0] } : {}}
                    whileTap={!isOpened ? { scale: 0.95 } : {}}
                    key={index}
                    onClick={() => {
                      if (isOpened) return;
                      setChestChoice(index);
                      setChestOpened(true);
                      sounds.playSlotWin();
                    }}
                    className={`flex-1 h-20 p-2 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all border-2 relative ${
                      isOpened
                        ? isSelected
                          ? "bg-amber-100 border-amber-400 shadow-md shadow-amber-200 text-neutral-900"
                          : "bg-gray-100 border-gray-200 text-gray-400 opacity-60"
                        : "bg-white border-amber-300 shadow-md animate-pulse"
                    }`}
                  >
                    {!isOpened ? (
                      <>
                        <span className="text-3xl block animate-bounce">📦</span>
                        <span className="text-[9px] font-black text-amber-600 block mt-1 uppercase">
                          Сонгох
                        </span>
                      </>
                    ) : isSelected ? (
                      <>
                        <span className="text-3xl block filter drop-shadow-md animate-pulse">🎉🎁</span>
                        <span className="text-[9px] font-black text-amber-800 tracking-tight mt-1 truncate max-w-full">
                          {index === 0 ? "Гурвалсан XP! ⚡" : "Эрдэнэ x2! 💎"}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl block text-gray-300">📦</span>
                        <span className="text-[8px] font-bold text-gray-400 mt-1">Орхигдсон</span>
                      </>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {chestOpened && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3.5 bg-amber-400 text-neutral-900 text-[10px] font-black py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 uppercase"
              >
                <span>🍀 ШАГНАЛ ТААРЛАА:</span>
                <span>{chestChoice === 0 ? "ТАНИЙН ХИЧЭЭЛИЙН ХОЖОЛ 3 ДАХИН ӨСЛӨӨ!" : "ЭРДЭНЭҮҮД ХОЁР ДАХИН ҮРЖИГДЛЭЭ!"}</span>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* --- DYNAMIC COIN FLIP EXTREME GAMBLE --- */}
        {xpGained > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="w-full mt-4 bg-gradient-to-br from-indigo-950 to-slate-900 p-4 rounded-3xl border border-indigo-500/20 text-center select-none text-white relative overflow-hidden shadow-lg"
          >
            {/* Ambient indicator lights */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
            
            <h4 className="text-xs font-black text-indigo-300 uppercase tracking-widest flex items-center justify-center gap-1.5 m-0">
              🪙 50/50 COIN FLIP (Double Or Nothing)
            </h4>
            <p className="text-[9px] text-gray-300 font-bold mt-1.5 max-w-[280px] mx-auto leading-normal">
              Хоёр талт алтан зоосыг шидэж ахицаа 2 дахин өсгөх эсвэл бүгдийг алдаж азартаа тулж үзээрэй!
            </p>

            <div className="flex flex-col items-center justify-center py-4 relative">
              {/* Golden Coin View with spin animation support */}
              <motion.div 
                animate={coinFlipping ? { rotateY: 360 * 4, scale: [1, 1.25, 1] } : {}}
                transition={{ duration: 1, ease: "easeInOut" }}
                onClick={handleCoinFlip}
                style={{ transformStyle: "preserve-3d" }}
                className={`w-16 h-16 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-500 flex items-center justify-center border-4 border-amber-200 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.6)] relative select-none ${
                  coinFlipping ? 'pointer-events-none' : ''
                }`}
              >
                <span className="text-3xl font-black text-neutral-900 filter drop-shadow-sm">
                  {coinSide === "heads" ? "🦅" : coinSide === "tails" ? "👑" : "🪙"}
                </span>
              </motion.div>

              <span className="text-[9px] text-indigo-200 mt-2 font-black uppercase tracking-wider">
                {coinFlipping ? "Зоос эргэлдэж байна..." : "ЗООС ДЭЭР ДАРЖ ШИД 🎰"}
              </span>
            </div>

            {coinGambleResult !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`py-2 px-3 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-1.5 ${
                  coinGambleResult === 'won' 
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-700/30' 
                    : 'bg-rose-600 text-white shadow-md shadow-rose-950/40'
                }`}
              >
                {coinGambleResult === 'won' ? (
                  <span>🏆 БАЯР ХҮРГЭЕ! ТАСАРХАЙ АЗТАЙ БАЙЛАА! XP ӨСЛӨӨ! 🎉</span>
                ) : (
                  <span>💔 АЗ ДУТЛАА! ХОЖОЛ ШАН АЛДАГДЛАА. СУРАЛЦААРАЙ!</span>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Button controls footer */}
      <div className="p-5 bg-white border-t border-gray-100">
        <div className="max-w-sm mx-auto w-full flex flex-col gap-2">
          {/* Replay option if they scored low or want to practice */}
          <button
            onClick={onReplay}
            className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold text-xs py-3 rounded-2xl cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-95 border border-amber-200"
          >
            <RotateCcw size={16} className="stroke-[2.5]" />
            ДАХИН ТОГЛОХ (Practice)
          </button>

          {/* Primary Continue going home action handler */}
          <button
            onClick={onContinue}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs py-3.5 rounded-2xl cursor-pointer border-b-4 border-emerald-700 tracking-wider shadow-sm transition-all active:scale-95 active:border-b-0 uppercase"
          >
            ҮРГЭЛЖЛҮҮЛЭХ
          </button>
        </div>
      </div>
    </div>
  );
}
