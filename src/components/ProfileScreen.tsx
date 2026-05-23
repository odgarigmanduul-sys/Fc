import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, BookOpen, Volume2, Search, Medal, ShieldAlert } from 'lucide-react';
import { BADGES, VOCABULARIES } from '../data';
import { AuraSkin } from '../utils/auraData';
import { sounds } from '../utils/sound';

const PROMO_CODES: Record<string, { gems: number; xp: number; title: string; desc: string }> = {
  "CODE100K": { gems: 100000, xp: 100000, title: "Төгс Хоршил Бонус (100k)", desc: "100,000 Эрдэнэ & 100,000 XP хамтдаа дансанд тань орлоо!" },
  "MONGOLIA100K": { gems: 100000, xp: 0, title: "Морин Сүр Хүч (100k)", desc: "100,000 Эрдэнэ амжилттай идэвхжлээ!" },
  "DOPAMINE100K": { gems: 0, xp: 100000, title: "Хэт Хөөрөлтийн Оч (100k)", desc: "100,000 XP шууд таны Кредитэд нэмэгдлээ!" },
  "SAIYAN100": { gems: 80000, xp: 80000, title: "Цуут Саяаны Дайчин (160k)", desc: "80,000 Эрдэнэ & 80,000 XP амжилттай нэмэгдлээ!" },
  "AURABOOST": { gems: 50000, xp: 20000, title: "Аура Ботикийн Хаалга (70k)", desc: "50,000 Эрдэнэ & 20,000 XP тусламжтай дурын аурагаа аваарай!" },
  "AISTUDIO": { gems: 25000, xp: 25000, title: "AI Studio Хөгжүүлэгчийн Бэлэг (50k)", desc: "Салбартаа тэргүүлэгч 25k Эрдэнэ болон 25k XP бонус!" },
  "FREECOINS": { gems: 10000, xp: 5000, title: "Эхлэлийн Түлхүүр", desc: "10,000 Эрдэнэ болон 5,000 XP нэмэлт шагнал." }
};

interface ProfileScreenProps {
  totalXP: number;
  streak: number;
  gems: number;
  activeAura: AuraSkin | null;
  setGems: React.Dispatch<React.SetStateAction<number>>;
  setTotalXP: React.Dispatch<React.SetStateAction<number>>;
  triggerConfetti?: () => void;
}

const AVAILABLE_AVATARS = ["🐼", "🦊", "🐯", "🦁", "🐨", "🦄", "🦅", "🦉", "🐸", "🐙", "🦖"];

export default function ProfileScreen({ 
  totalXP, 
  streak, 
  gems, 
  activeAura,
  setGems,
  setTotalXP,
  triggerConfetti
}: ProfileScreenProps) {
  const [avatar, setAvatar] = useState("🐼");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  
  // Game Engine performance states (1GB HD Assets)
  const [cacheSize, setCacheSize] = useState(1024.0); // Megabytes
  const [isRecompiling, setIsRecompiling] = useState(false);
  const [engineReport, setEngineReport] = useState<string | null>(null);
  const [fpsMode, setFpsMode] = useState<"ECO (30 FPS)" | "ULTRA (60 / 120 FPS)">("ULTRA (60 / 120 FPS)");
  const [intensityMode, setIntensityMode] = useState<"NORMAL" | "SUPER SAIYAN LIMIT BREAK">("SUPER SAIYAN LIMIT BREAK");

  // Promo code states
  const [promoInput, setPromoInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [redeemedReward, setRedeemedReward] = useState<{ gems: number; xp: number; title: string; desc: string } | null>(null);
  const [usedCodes, setUsedCodes] = useState<string[]>([]);
  const [showCodeCheatsheet, setShowCodeCheatsheet] = useState(false);

  const handleRedeemCode = () => {
    const cleanedCode = promoInput.trim().toUpperCase();
    if (!cleanedCode) return;

    if (usedCodes.includes(cleanedCode)) {
      setErrorMessage("Та энэ кодыг аль хэдийн идэвхжүүлсэн байна! ❌");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    if (PROMO_CODES[cleanedCode]) {
      const reward = PROMO_CODES[cleanedCode];
      
      // Update values
      if (reward.gems > 0) setGems(prev => prev + reward.gems);
      if (reward.xp > 0) setTotalXP(prev => prev + reward.xp);
      
      setUsedCodes(prev => [...prev, cleanedCode]);
      setRedeemedReward(reward);
      setPromoInput("");
      setErrorMessage(null);
      
      try {
        sounds.playSlotWin();
      } catch (e) {}

      if (triggerConfetti) {
        triggerConfetti();
        setTimeout(() => triggerConfetti(), 300);
        setTimeout(() => triggerConfetti(), 600);
      }
    } else {
      setErrorMessage("Буруу код байна! Дахин шалгана уу. 🔍");
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };
  
  // Vocab search state
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCat, setActiveCat] = useState("Бүгд");

  // Read sentences aloud using Google Synthesis
  const speakWord = (text: string) => {
    if (!text || typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech Synthesis failed", e);
    }
  };

  // Compute live achievement states dynamically off state props
  const getBadgeProgress = (badgeId: string) => {
    switch (badgeId) {
      case 'fire':
        return { count: streak, max: 7, isUnlocked: streak >= 7 };
      case 'xp':
        return { count: totalXP, max: 2500, isUnlocked: totalXP >= 2500 };
      case 'gems':
        return { count: gems, max: 300, isUnlocked: gems >= 300 };
      default:
        // 'lesson'
        return { count: 1, max: 1, isUnlocked: true };
    }
  };

  // Filter dictionary definitions
  const categories = ["Бүгд", "Үндсэн", "Мэндчилгээ", "Тоо", "Хоол", "Гэр"];
  const filteredVocab = VOCABULARIES.filter(v => {
    const matchesSearch = v.eng.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.mn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCat === "Бүгд" || v.cat === activeCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex-1 overflow-y-auto pb-16 bg-[#131F24] scrollbar-thin scrollbar-thumb-zinc-805">
      
      {/* Profile Header Deck */}
      <div className="bg-[#131F24] px-5 py-6 border-b border-zinc-800 flex flex-col items-center select-none shrink-0 relative text-white">
        
        {/* Sparkly Mascot Profile Avatar Frame */}
        <div className="relative group mb-3">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowAvatarPicker(true)}
            className={`w-24 h-24 rounded-full bg-sky-50 flex items-center justify-center text-5xl cursor-pointer select-none shadow-md transition-shadow relative border-4 ${
              activeAura ? `${activeAura.glowStyle} border-transparent ${activeAura.animationClass}` : 'border-sky-400'
            }`}
          >
            {avatar}
            <div className="absolute inset-x-0 bottom-0 bg-neutral-900/60 text-white text-[8px] font-black uppercase text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-full">
              Засах
            </div>
          </motion.div>

          <span className="absolute bottom-0 right-0 w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center text-xs border-2 border-[#131F24] cursor-pointer select-none shadow-sm" onClick={() => setShowAvatarPicker(true)}>
            ✏️
          </span>
        </div>

        <h2 className="text-xl font-black text-white tracking-tight leading-none mb-1">
          Тайван Хэрэглэгч
        </h2>
        
        <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-500 capitalize">
          <Calendar size={13} />
          <span>Суралцаж эхэлсэн: 2026 оны 5 сар</span>
        </div>

        {/* Basic Stats block Row */}
        <div className="grid grid-cols-3 gap-3.5 w-full mt-6">
          <div className="bg-[#202F36] border border-[#2b3c44] p-3 rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="text-xl select-none">🔥</span>
            <span className="block text-xs font-black text-orange-400 mt-1">{streak} өдөр</span>
            <span className="text-[10px] text-zinc-500 font-bold tracking-tight uppercase">Үргэлжлэл</span>
          </div>

          <div className="bg-[#202F36] border border-[#2b3c44] p-3 rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="text-xl select-none">💎</span>
            <span className="block text-xs font-black text-sky-400 mt-1">{gems}</span>
            <span className="text-[10px] text-zinc-500 font-bold tracking-tight uppercase">Эрдэнэ</span>
          </div>

          <div className="bg-[#202F36] border border-[#2b3c44] p-3 rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="text-xl select-none">⚡</span>
            <span className="block text-xs font-black text-amber-400 mt-1">{totalXP}</span>
            <span className="text-[10px] text-zinc-500 font-bold tracking-tight uppercase font-mono">Нийт XP</span>
          </div>
        </div>
      </div>

      {/* Promo Code Redemption Module */}
      <div className="px-5 pt-4">
        <div className="bg-gradient-to-br from-neutral-900 to-slate-900 p-4 rounded-3xl border border-amber-500/30 text-white relative overflow-hidden shadow-xl">
          {/* Decorative neon tag */}
          <div className="absolute top-0 right-0 bg-amber-400 text-neutral-950 font-black text-[7px] uppercase px-2 py-0.5 rounded-bl-xl tracking-wider animate-pulse">
            100K БОНУС КЛУБ
          </div>
          
          <h4 className="text-xs font-black text-amber-300 uppercase tracking-widest flex items-center gap-1.5 mb-1 m-0">
            🎫 ПРОМО КОД ИДЭВХЖҮҮЛЭХ
          </h4>
          <p className="text-[10px] text-gray-300 font-medium leading-relaxed mb-3.5">
            Урамшууллын нууц код оруулан <b className="text-amber-400">+100,000 хүртэлх</b> эрдэнэ болон XP бонусыг дансандаа аваарай!
          </p>

          <div className="flex gap-2 relative">
            <input 
              type="text"
              placeholder="Кодоо бичнэ үү (жишээ нь: CODE100K)"
              value={promoInput}
              onChange={(e) => {
                setPromoInput(e.target.value);
                setErrorMessage(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRedeemCode();
              }}
              className="flex-1 bg-white/10 border border-white/15 outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 text-xs font-bold font-mono px-3.5 py-2.5 rounded-xl text-white placeholder-gray-500 transition-all uppercase"
            />
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleRedeemCode}
              className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-neutral-950 font-black text-[10px] px-4 rounded-xl cursor-pointer transition-all uppercase tracking-wider shadow-md shadow-amber-500/10 flex items-center justify-center gap-1"
            >
              ИДЭВХЖҮҮЛЭХ 
            </motion.button>
          </div>

          {/* Feedback message display */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[10px] text-rose-450 font-extrabold mt-2.5 bg-rose-500/10 px-2 py-1 rounded-lg"
              >
                ⚠️ {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cheat code assistance trigger button */}
          <div className="mt-3.5 flex justify-between items-center text-[10px] border-t border-white/5 pt-3">
            <button
              onClick={() => setShowCodeCheatsheet(!showCodeCheatsheet)}
              className="text-amber-400/90 hover:text-amber-300 font-extrabold cursor-pointer flex items-center gap-1 transition-all select-none bg-amber-400/5 hover:bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/10"
            >
              <span>{showCodeCheatsheet ? "❌ Жагсаалтыг нуух" : "💡 Бэлэн кодуудыг харах"}</span>
            </button>
            <span className="text-gray-500 font-bold text-[8px] uppercase tracking-wide">
              {usedCodes.length} ашигласан
            </span>
          </div>

          {/* Expandable list of available promo codes */}
          <AnimatePresence>
            {showCodeCheatsheet && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-3"
              >
                <div className="bg-black/45 rounded-2xl p-3 border border-white/5 space-y-2 mt-0.5 text-left grid grid-cols-1 gap-1.5">
                  <span className="text-[9px] font-black text-amber-200 uppercase block tracking-wider mb-1">
                    Сонголттой кодууд (Жагсаалт):
                  </span>
                  {Object.entries(PROMO_CODES).map(([codeKey, info]) => {
                    const claimed = usedCodes.includes(codeKey);
                    return (
                      <div 
                        key={codeKey}
                        onClick={() => {
                          if (!claimed) {
                            setPromoInput(codeKey);
                            setErrorMessage(null);
                          }
                        }}
                        className={`p-2 rounded-xl text-left transition-all flex items-center justify-between border cursor-pointer select-none ${
                          claimed 
                            ? "bg-gray-900/40 border-dashed border-gray-650 opacity-40 focus:outline-hidden" 
                            : "bg-white/5 hover:bg-white/10 border-white/5 active:scale-[0.99]"
                        }`}
                      >
                        <div className="min-w-0">
                          <code className="text-[10px] font-bold font-mono text-amber-400 block">
                            {codeKey} {claimed ? "✅" : ""}
                          </code>
                          <span className="text-[8px] text-gray-400 font-semibold block leading-tight mt-0.5 truncate max-w-[200px]">
                            {info.title}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[9px] font-black font-mono text-emerald-400">
                            {info.gems > 0 ? `💎 +${info.gems.toLocaleString()}` : ""}
                          </span>
                          <span className="text-[9px] font-black font-mono text-amber-300 block">
                            {info.xp > 0 ? `⚡ +${info.xp.toLocaleString()}` : ""}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 1GB HD Game Engine Controller Panel */}
      <div className="px-5 pt-4">
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-neutral-900 p-4 rounded-3xl border border-cyan-500/20 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 bg-cyan-400 text-neutral-950 font-black text-[7px] uppercase px-2.5 py-0.5 rounded-bl-xl tracking-wider select-none">
            ENGINE CORE v3.0 HD
          </div>

          <h4 className="text-xs font-black text-cyan-350 uppercase tracking-widest flex items-center gap-1.5 mb-1 m-0">
            👾 ГРАФИК ENGINE ТОХИРГОО (1GB+)
          </h4>
          <p className="text-[10px] text-zinc-300 font-bold leading-normal mb-3">
            Таны төхөөрөмж дээрх 3D Аура эффект, бөөмийн хурд болон дууны сангийн төлөвийг хянах.
          </p>

          {/* Allocation Cache indicator */}
          <div className="bg-black/45 p-3 rounded-2xl border border-white/5 space-y-2.5">
            <div className="flex justify-between items-center text-[10px] font-extrabold text-zinc-350">
              <span>Суулгасан HD Дата сан:</span>
              <span className="font-mono text-cyan-400">{cacheSize.toFixed(1)} MB / 1024.0 MB</span>
            </div>
            
            {/* Horizontal progress bar representing allocated memory */}
            <div className="h-2 bg-neutral-900 rounded-full overflow-hidden border border-white/10 p-0.5 relative">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${(cacheSize / 1024.0) * 100}%` }}
              />
            </div>

            {/* Config controls Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1 font-extrabold text-[9px]">
              {/* FPS Toggle */}
              <button 
                onClick={() => {
                  try { sounds.playCombo(1); } catch(e) {}
                  setFpsMode(prev => prev.includes("ULTRA") ? "ECO (30 FPS)" : "ULTRA (60 / 120 FPS)");
                }}
                className="bg-white/5 hover:bg-white/10 active:scale-95 text-left p-2 rounded-xl border border-white/5 flex flex-col justify-between transition-all cursor-pointer"
              >
                <span className="text-zinc-400 uppercase tracking-wider block text-[8px]">ДҮРСНИЙ ХУРД:</span>
                <span className="text-cyan-400 mt-1 block font-black">{fpsMode}</span>
              </button>

              {/* Intensity multiplier Toggle */}
              <button 
                onClick={() => {
                  try { sounds.playCombo(2); } catch(e) {}
                  setIntensityMode(prev => prev.includes("SUPER") ? "NORMAL" : "SUPER SAIYAN LIMIT BREAK");
                  if (triggerConfetti) triggerConfetti();
                }}
                className="bg-white/5 hover:bg-white/10 active:scale-95 text-left p-2 rounded-xl border border-white/5 flex flex-col justify-between transition-all cursor-pointer"
              >
                <span className="text-zinc-400 uppercase tracking-wider block text-[8px]">ОЧНЫ ЦУВРАЛ:</span>
                <span className="text-pink-400 mt-1 block font-black truncate">{intensityMode}</span>
              </button>
            </div>
          </div>

          {/* Action buttons list */}
          <div className="mt-3.5 flex justify-between items-center gap-2">
            <button
              onClick={() => {
                if (isRecompiling) return;
                setIsRecompiling(true);
                setCacheSize(0);
                setEngineReport("Ой санах ойг цэвэрлэж байна...");
                try { sounds.playSlotSpin(); } catch(e) {}

                setTimeout(() => {
                  setEngineReport("1024MB Аниме Аура файлуудыг дахин индексжүүлж байна...");
                }, 800);

                setTimeout(() => {
                  setCacheSize(1024.0);
                  setIsRecompiling(false);
                  setEngineReport("Амжилттай! График суулгац шинэчлэгдлээ ✨");
                  try { sounds.playLevelUp(); } catch(e) {}
                  if (triggerConfetti) triggerConfetti();
                }, 2200);
              }}
              disabled={isRecompiling}
              className="flex-1 bg-cyan-400 hover:bg-cyan-300 active:scale-95 disabled:bg-zinc-700 text-neutral-950 font-black text-[9px] py-2.5 px-3 rounded-xl cursor-pointer transition-all uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/10"
            >
              <span>{isRecompiling ? "ШИНЭЧЛЭЖ БАЙНА..." : "🔄 СУУЛГАЦ ДАХИН ШИНЭЧЛЭХ (HD Boost)"}</span>
            </button>
          </div>

          {/* Reporting feedback message screen status indicator */}
          {engineReport && (
            <div className="mt-2 text-[9px] font-black text-cyan-300 bg-cyan-400/10 border border-cyan-400/20 px-2.5 py-1.5 rounded-lg text-center select-none animate-pulse">
              ⚙️ {engineReport}
            </div>
          )}
        </div>
      </div>

      {/* Gamified Achievements Badge List Deck */}
      <div className="px-5 py-6">
        <h3 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2 mb-4 select-none uppercase">
          <Medal size={16} className="text-amber-500 stroke-[2.5]" />
          <span>Миний Ололтууд (Achievements)</span>
        </h3>

        <div className="space-y-3">
          {BADGES.map((b) => {
            const prog = getBadgeProgress(b.id);
            const ratio = Math.min(100, Math.round((prog.count / prog.max) * 100));

            return (
              <div 
                key={b.id}
                className={`p-3.5 rounded-2xl border flex items-center gap-4 transition-all ${
                  prog.isUnlocked 
                    ? "bg-white border-neutral-200/50 shadow-xs" 
                    : "bg-gray-100/40 border-gray-100 text-gray-400"
                }`}
              >
                {/* Visual Circle Badge with customized shading */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 border select-none shadow-xs ${
                  prog.isUnlocked 
                    ? "bg-amber-100 border-amber-200 text-amber-500 scale-100 shadow-sm" 
                    : "bg-gray-200/50 border-gray-300 text-gray-500 grayscale filter"
                }`}>
                  {b.icon}
                </div>

                {/* Badge text values and Progress Bar indicators */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`text-[12px] font-extrabold tracking-tight truncate leading-tight ${
                      prog.isUnlocked ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {b.name}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 font-mono">
                      {prog.count} / {prog.max}
                    </span>
                  </div>

                  <p className="text-[10px] font-semibold text-gray-500 leading-normal truncate mb-2">
                    {b.desc}
                  </p>

                  {/* Tiny progress path */}
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200/20">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        prog.isUnlocked ? 'bg-amber-400 shadow-xs' : 'bg-gray-400'
                      }`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Learned Vocabulary Dictionary block */}
      <div className="px-5 py-2">
        <div className="border-t border-gray-100/80 pt-6">
          <div className="flex justify-between items-center mb-4 select-none">
            <h3 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2 uppercase">
              <BookOpen size={16} className="text-sky-500 stroke-[2.5]" />
              <span>Миний Толь бичиг</span>
            </h3>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full uppercase font-mono">
              {filteredVocab.length} үг сурсан
            </span>
          </div>

          {/* Search box filters input */}
          <div className="relative mb-3.5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none stroke-[2.5]" size={15} />
            <input 
              type="text"
              placeholder="Англи эсвэл Монгол үг хайх..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 outline-hidden focus:border-sky-400 text-xs py-2.5 pl-10 pr-4 rounded-xl text-gray-800 transition-all font-semibold font-sans placeholder-gray-400/80 shadow-xs"
            />
          </div>

          {/* Horizontal Tags Categories Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3Scroll select-none py-1 mb-4 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-tight cursor-pointer shrink-0 transition-all ${
                  activeCat === cat 
                    ? "bg-sky-500 text-white shadow-xs border border-sky-600/10" 
                    : "bg-white border border-gray-200 text-gray-500 hover:text-gray-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Word List Deck - Clicking speaks word aloud */}
          <div className="grid grid-cols-2 gap-2.5">
            {filteredVocab.map((v, i) => (
              <motion.div
                whileHover={{ y: -1, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                key={i}
                onClick={() => speakWord(v.eng)}
                className="bg-white border border-gray-200/60 p-3 rounded-2xl flex flex-col justify-between cursor-pointer shadow-xs hover:border-sky-200 select-none group transition-all"
                title="Дуудлага сонсох"
              >
                <div className="flex items-start justify-between gap-1 mb-1 min-w-0">
                  <span className="text-[12px] font-black text-gray-900 group-hover:text-sky-600 tracking-tight transition-colors truncate">
                    {v.eng}
                  </span>
                  
                  {/* Speaker mini icon */}
                  <div className="w-5 h-5 rounded-full bg-sky-50 group-hover:bg-sky-100 flex items-center justify-center text-sky-500 shrink-0 transition-colors">
                    <Volume2 size={11} className="stroke-[2.5]" />
                  </div>
                </div>

                <div className="text-[10px] font-extrabold text-gray-500 truncate leading-tight">
                  🇲🇳 {v.mn}
                </div>

                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-gray-50/60">
                  <span className="text-[8px] font-black tracking-wider text-gray-400/80 bg-neutral-50 border border-neutral-100 px-1.5 py-0.5 rounded uppercase">
                    {v.cat}
                  </span>
                  <span className={`text-[8px] font-black uppercase ${
                    v.level === 'Easy' ? 'text-emerald-500' : v.level === 'Medium' ? 'text-amber-500' : 'text-rose-500'
                  }`}>
                    {v.level}
                  </span>
                </div>
              </motion.div>
            ))}

            {filteredVocab.length === 0 && (
              <div className="col-span-2 py-8 text-center text-gray-400 font-semibold text-xs border border-dashed border-gray-200 rounded-3xl p-6 bg-gray-50 select-none flex flex-col items-center gap-1">
                <ShieldAlert size={18} className="text-gray-400" />
                Үг олдсонгүй
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Changer Floating Overlay Picker */}
      <AnimatePresence>
        {showAvatarPicker && (
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-6 rounded-3xl w-full max-w-sm text-center shadow-2xl border border-gray-100"
            >
              <h3 className="text-base font-black text-gray-900 leading-tight mb-4 uppercase tracking-tight">
                Маскот сонгох:
              </h3>
              
              <div className="grid grid-cols-4 gap-3 py-2 justify-center">
                {AVAILABLE_AVATARS.map((mascot) => (
                  <button
                    key={mascot}
                    onClick={() => {
                      setAvatar(mascot);
                      setShowAvatarPicker(false);
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-3xl border cursor-pointer select-none transition-all active:scale-90 ${
                      avatar === mascot 
                        ? 'bg-sky-50 border-sky-400 shadow-sm ring-2 ring-sky-200' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {mascot}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAvatarPicker(false)}
                className="w-full mt-6 bg-gray-900 hover:bg-black text-white font-extrabold text-xs py-3 rounded-xl cursor-pointer transition-all"
              >
                ХААХ
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Massive Neon Congratulations Overlay of Redeemed Code */}
      <AnimatePresence>
        {redeemedReward && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-5 z-50">
            <motion.div 
              initial={{ scale: 0.4, opacity: 0, rotate: -15 }}
              animate={{ scale: [0.4, 1.12, 1], opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -30 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-indigo-950 border-4 border-amber-400 p-8 rounded-3xl w-full max-w-sm text-center shadow-[0_0_50px_rgba(245,158,11,0.5)] relative overflow-hidden"
            >
              {/* Pulsing light rings */}
              <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

              {/* Animated sparkles */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                className="absolute w-56 h-56 rounded-full border border-dashed border-amber-400/20 top-1/2 left-1/2 -ml-28 -mt-28"
              />

              <div className="relative z-10 select-none">
                <span className="text-6xl block mb-3.5 animate-bounce">
                  🏆
                </span>

                <h3 className="text-lg font-black text-amber-400 tracking-tight leading-none uppercase mb-2">
                  Урамшуулал Амжилттай!
                </h3>
                
                <h4 className="text-sm font-extrabold text-white tracking-wide leading-tight mb-4">
                  {redeemedReward.title}
                </h4>

                <p className="text-[10px] text-gray-300 font-semibold leading-relaxed mb-6 max-w-[240px] mx-auto bg-white/5 border border-white/5 p-3 rounded-2xl">
                  {redeemedReward.desc}
                </p>

                {/* Rewards Grid indicators */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {redeemedReward.gems > 0 && (
                    <div className="bg-emerald-500/10 rounded-2xl border border-emerald-500/20 p-3 flex flex-col items-center">
                      <span className="text-2xl select-none">💎</span>
                      <span className="text-xs font-black text-emerald-400 font-mono mt-1">
                        +{redeemedReward.gems.toLocaleString()}
                      </span>
                      <span className="text-[8px] text-gray-400 font-black uppercase">Эрдэнэ</span>
                    </div>
                  )}

                  {redeemedReward.xp > 0 && (
                    <div className="bg-amber-500/10 rounded-2xl border border-amber-500/20 p-3 flex flex-col items-center">
                      <span className="text-2xl select-none">⚡</span>
                      <span className="text-xs font-black text-amber-300 font-mono mt-1">
                        +{redeemedReward.xp.toLocaleString()}
                      </span>
                      <span className="text-[8px] text-gray-400 font-black uppercase">Про XP</span>
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRedeemedReward(null)}
                  className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-950 font-black text-xs py-3.5 rounded-2xl cursor-pointer hover:from-amber-300 hover:to-yellow-400 shadow-[0_10px_25px_rgba(245,158,11,0.3)] transition-all uppercase tracking-widest"
                >
                  ХҮЛЭЭН АВАХ 🔥
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
