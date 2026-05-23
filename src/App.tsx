import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Flame, Zap, Play, Download, Sparkles, Trophy, Sword, Settings } from 'lucide-react';

import { Lesson } from './types';
import { INITIAL_UNITS } from './data';
import { sounds } from './utils/sound';
import { AuraSkin } from './utils/auraData';

import HomeScreen from './components/HomeScreen';
import ExerciseScreen from './components/ExerciseScreen';
import ResultsScreen from './components/ResultsScreen';
import LeagueScreen from './components/LeagueScreen';
import ProfileScreen from './components/ProfileScreen';
import GachaScreen from './components/GachaScreen';
import AuraShopScreen from './components/AuraShopScreen';
import DuoMascot from './components/DuoMascot';

// --- Confetti particle explosion component ---
function ConfettiExplosion({ trigger }: { trigger: number }) {
  const [particles, setParticles] = useState<{ id: number; left: string; color: string; delay: number; size: number; dx: string; dy: string; rot: string }[]>([]);

  React.useEffect(() => {
    if (trigger === 0) return;
    const colors = ["#58cc02", "#ffc800", "#1cb0f6", "#ff4b4b", "#ce82ff", "#ff9600"];
    const newParticles = Array.from({ length: 30 }, (_, i) => {
      const dx = `${Math.floor((Math.random() - 0.5) * 240)}px`;
      const dy = `${Math.floor(-100 - Math.random() * 180)}px`;
      const rot = `${Math.floor(Math.random() * 360)}deg`;
      return {
        id: Date.now() + i,
        left: `${Math.floor(20 + Math.random() * 60)}%`,
        color: colors[i % colors.length],
        delay: Math.random() * 0.3,
        size: 8 + Math.random() * 10,
        dx,
        dy,
        rot
      };
    });
    setParticles(newParticles);
    const timer = setTimeout(() => setParticles([]), 1800);
    return () => clearTimeout(timer);
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute bottom-1/4 rounded-full"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            animationName: 'confettiFall',
            animationDuration: '1.4s',
            animationDelay: `${p.delay}s`,
            animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            animationFillMode: 'both',
            // pass custom targets to fallback CSS animation variables
            ['--dx' as any]: p.dx,
            ['--dy' as any]: p.dy,
            ['--rot' as any]: p.rot
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(0.3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

// Interactive animated slow recharge practice simulation
function RechargeHeartTimer({ onComplete }: { onComplete: () => void }) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [percent, setPercent] = React.useState(0);
  const [cheatingStep, setCheatingStep] = React.useState("Duo-той бясалгаж байна...");

  React.useEffect(() => {
    if (!isPlaying) return;
    let progress = 0;
    const interval = setInterval(() => {
      progress += 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsPlaying(false);
          setPercent(0);
          onComplete();
          try { sounds.playCorrect(); } catch(e) {}
        }, 800);
      }
      setPercent(progress);
      if (progress < 30) {
        setCheatingStep("Амьсгал авч байна... 🧘‍♂️");
      } else if (progress < 65) {
        setCheatingStep("Дөрвөн хэлээр шивнэж байна... 💬");
      } else {
        setCheatingStep("Амь шингэж байна! 💖");
      }
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying]);

  if (isPlaying) {
    return (
      <div className="w-full bg-slate-50 border-2 border-dashed border-sky-200 p-4 rounded-2xl flex flex-col items-center">
        <span className="text-xl animate-bounce">🧘🦉🧘‍♂️</span>
        <span className="text-[11px] font-black text-sky-600 block mt-1 uppercase">{cheatingStep}</span>
        
        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden mt-3 p-0.5 border">
          <div 
            className="h-full bg-sky-400 rounded-full transition-all duration-100"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-[9px] text-zinc-400 font-extrabold mt-1 block">ТА БЭЛТГЭЖ БАЙНА ({percent}%)</span>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        setIsPlaying(true);
        try { sounds.playSlotSpin(); } catch(e) {}
      }}
      className="w-full p-3.5 rounded-2xl border-2 border-b-6 bg-sky-50/60 border-sky-100 border-b-sky-300 hover:border-sky-200 flex items-center justify-between cursor-pointer transition-all text-left"
    >
      <div className="text-left">
        <span className="block text-xs font-black text-sky-800 uppercase">БЯСАЛГАЛААР АМЬ НЭХЭХ</span>
        <span className="text-[10px] text-zinc-500 font-bold block mt-0.5">Duo-той бясалгаж +1 Амь авах (Үнэгүй)</span>
      </div>
      <div className="bg-sky-400 text-white font-black text-[9px] px-2.5 py-1 rounded-full flex items-center gap-1 font-mono uppercase shrink-0">
        <span>хурдан</span>
      </div>
    </button>
  );
}

export default function App() {
  const [tab, setTab] = useState<"home" | "league" | "casino" | "profile" | "shop">("home");
  const [screen, setScreen] = useState<"main" | "exercise" | "results">("main");
  
  // High dopamine 1GB Asset loading simulation states
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [currentAssetStep, setCurrentAssetStep] = useState("Индексүүдийг холбож байна...");
  const [loadedMegabytes, setLoadedMegabytes] = useState(0);

  React.useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 5) + 3;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setLoadingAssets(false);
          try {
            sounds.playLevelUp();
          } catch(e) {}
        }, 1200);
      }
      setDownloadProgress(progress);
      setLoadedMegabytes(Math.round((progress / 100) * 1024.0 * 10) / 10);

      // Highly detailed gameplay components
      if (progress < 15) {
        setCurrentAssetStep("Engine Core booting up (v3.0.0 Pro)... (85.2 MB)");
      } else if (progress < 30) {
        setCurrentAssetStep("Unpacking MongolEng_UltraHD_3D_GUI.bundle (245.4 MB)");
      } else if (progress < 50) {
        setCurrentAssetStep("Synthesizing hyper-dopamine neon particle sparks & lightning lines (310.8 MB)");
      } else if (progress < 70) {
        setCurrentAssetStep("Initializing high-fidelity Mongolian studio voiceovers (194.2 MB)");
      } else if (progress < 88) {
        setCurrentAssetStep("Injecting legendary Golden Super Saiyan Level-5 aura_glow.compiled.shader (145.0 MB)");
      } else if (progress < 96) {
        setCurrentAssetStep("Loading reward slot gacha drops, streak multipliers & game physics (43.4 MB)");
      } else {
        setCurrentAssetStep("Optimizing frame buffer render arrays for extreme 120fps limit break mode!");
      }
    }, 110);

    return () => clearInterval(interval);
  }, []);

  // Audio state
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Lesson states
  const [units, setUnits] = useState(INITIAL_UNITS);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeUnitColors, setActiveUnitColors] = useState({ primary: "#58cc02", dark: "#46a302" });

  // Post-lesson reward metrics indicators
  const [lastLessionStats, setLastLessionStats] = useState({ correct: 0, total: 0, xp: 0 });

  // User persistent profiles
  const [streak, setStreak] = useState(7);
  const [gems, setGems] = useState(380);
  const [totalXP, setTotalXP] = useState(2310);
  const [hearts, setHearts] = useState(5);
  const [showHeartsRefill, setShowHeartsRefill] = useState(false);

  // User custom Aura Skins wardrobe states
  const [activeAura, setActiveAura] = useState<AuraSkin | null>({
    id: 1,
    name: "Энгийн Аура 🟢",
    emoji: "🌱",
    rarity: "Common",
    price: 0,
    unlocked: true,
    color: "from-emerald-400 to-green-600",
    glowStyle: "shadow-[0_0_10px_#10b981]",
    animationClass: "",
    desc: "Үндсэн стандарт ногоон аура"
  });
  const [unlockedAuraIds, setUnlockedAuraIds] = useState<number[]>([1]);

  // FX Trigger
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    sounds.enabled = nextVal;
  };

  const handleStartLesson = (lesson: Lesson, primaryColor: string, darkColor: string) => {
    if (hearts <= 0) {
      setShowHeartsRefill(true);
      try { sounds.playWrong(); } catch(e) {}
      return;
    }
    setActiveLesson(lesson);
    setActiveUnitColors({ primary: primaryColor, dark: darkColor });
    setScreen("exercise");
  };

  const handleLessonFinished = (stats: { correctCount: number; totalCount: number; xpGained: number }) => {
    setLastLessionStats({
      correct: stats.correctCount,
      total: stats.totalCount,
      xp: stats.xpGained
    });

    if (stats.xpGained > 0) {
      setTotalXP(prev => prev + stats.xpGained);
      // Give gem bonus
      const earnedGems = stats.correctCount * 2 + (stats.correctCount === stats.totalCount ? 15 : 0);
      setGems(prev => prev + earnedGems);

      // Save lesson completion in progressive path state!
      if (activeLesson) {
        setUnits(prevUnits => 
          prevUnits.map(unit => {
            const hasLesson = unit.lessons.some(l => l.id === activeLesson.id);
            if (!hasLesson) return unit;

            const updatedLessons = unit.lessons.map((lesson, idx) => {
              if (lesson.id === activeLesson.id) {
                return { ...lesson, done: true };
              }
              // Unlock successive lesson in this unit automatically
              if (idx > 0 && unit.lessons[idx - 1].id === activeLesson.id) {
                return { ...lesson, locked: false };
              }
              return lesson;
            });

            return { ...unit, lessons: updatedLessons };
          })
        );
        // trigger fireworks
        setConfettiTrigger(prev => prev + 1);
      }
    }

    setScreen("results");
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center font-sans antialiased">
      
      {/* Real-time FX render overlays */}
      <ConfettiExplosion trigger={confettiTrigger} />

      {/* Main smartphone form framework with custom animated aura boundaries */}
      <div className={`w-full max-w-xl min-h-screen md:min-h-[880px] md:h-[880px] md:rounded-3xl bg-[#131F24] text-white flex flex-col overflow-hidden relative border-4 transition-all duration-300 ${
        activeAura 
          ? `${activeAura.glowStyle} border-amber-400 ring-4 ring-offset-2 ring-offset-zinc-900 ${
              activeAura.rarity === 'Cosmic' ? 'ring-fuchsia-500/50' : 
              activeAura.rarity === 'Legendary' ? 'ring-amber-500/50' : 
              activeAura.rarity === 'Epic' ? 'ring-rose-500/45' : 
              activeAura.rarity === 'Rare' ? 'ring-purple-500/35' : 'ring-emerald-500/20'
            }`
          : 'border-white/5 shadow-2xl'
      }`}>
        
        {/* Render dynamic sub-screen transitions (Exercise vs Results vs Normal Hub) */}
        {loadingAssets ? (
          <div className="flex-1 bg-gradient-to-b from-neutral-950 via-zinc-900 to-indigo-950 text-white p-6 flex flex-col justify-between overflow-y-auto h-full select-none">
            {/* Asset loader wrapper header */}
            <div className="text-center pt-8">
              <span className="bg-amber-400 text-neutral-950 font-black text-[9px] uppercase px-3 py-1 rounded-full tracking-widest select-none animate-pulse">
                MOBILE GAME HD ENGINE v2.8
              </span>
              <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 mt-3 hover:scale-105 transition-transform duration-350">
                MongolEng Saga
              </h1>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-extrabold mt-1">
                High-Dopamine English Quest
              </p>
            </div>

            {/* Rotating central radar / aura loader core component */}
            <div className="flex flex-col items-center justify-center my-6 relative py-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-4 border-dashed border-amber-400/30"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  className="absolute w-28 h-28 rounded-full border border-double border-cyan-400/40"
                />
                <div className="absolute w-20 h-20 rounded-full bg-radial from-amber-500/20 via-transparent to-transparent animate-ping" />
                <div className="absolute z-10 scale-105">
                  <DuoMascot mood="excited" size={84} />
                </div>
              </div>
              <div className="absolute -bottom-2 bg-neutral-900/90 border border-amber-400/30 px-3 py-1 rounded-xl text-center select-none shadow-lg">
                <span className="text-sm font-black font-mono text-amber-400">
                  {downloadProgress}%
                </span>
                <span className="text-[8px] text-zinc-400 uppercase block font-bold">ХУУЛБАРЛАЖ БАЙНА</span>
              </div>
            </div>

            {/* Downloader & compiler log feed */}
            <div className="space-y-4 max-w-sm mx-auto w-full bg-black/55 p-4 rounded-2xl border border-white/5 shadow-inner">
              <div className="flex items-center justify-between text-[11px] font-extrabold">
                <div className="flex items-center gap-1 text-emerald-400">
                  <Download size={12} className="animate-bounce" />
                  <span>Татаж байна...</span>
                </div>
                <div className="font-mono text-zinc-300">
                  <span className="text-white font-bold">{loadedMegabytes}</span> / 1024.0 MB
                </div>
              </div>

              {/* Glowing animated progress tube */}
              <div className="h-4 bg-zinc-850/95 rounded-full overflow-hidden border border-white/10 p-0.5 relative shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-500 rounded-full transition-all duration-150 relative"
                  style={{ width: `${downloadProgress}%` }}
                >
                  <span className="absolute right-1 top-0 w-2 h-2 rounded-full bg-white animate-ping" />
                </div>
              </div>

              {/* Status stream line */}
              <p className="text-[10px] text-zinc-300 font-bold text-center italic min-h-[36px] flex items-center justify-center leading-normal px-2 bg-white/5 rounded-xl border border-white/5">
                {currentAssetStep}
              </p>
            </div>

            {/* Interactive Audio Soundboard to play while waiting */}
            <div className="mt-4 p-3 bg-indigo-950/40 border border-indigo-500/10 rounded-2xl">
              <span className="text-[8px] font-black text-indigo-350 block mb-2 text-center uppercase tracking-wider">
                🎁 Дуу Төхөөрөмж Турших (Live Soundboard)
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                <button 
                  onClick={() => { try { sounds.playCombo(3); } catch(e) {} }}
                  className="bg-white/5 hover:bg-amber-400 hover:text-neutral-950 border border-white/5 hover:border-transparent active:scale-95 text-[9px] font-bold py-1.5 px-1 rounded-xl text-zinc-300 transition-all cursor-pointer"
                >
                  Combo ⚡
                </button>
                <button 
                  onClick={() => { try { sounds.playSlotSpin(); } catch(e) {} }}
                  className="bg-white/5 hover:bg-amber-400 hover:text-neutral-950 border border-white/5 hover:border-transparent active:scale-95 text-[9px] font-bold py-1.5 px-1 rounded-xl text-zinc-300 transition-all cursor-pointer"
                >
                  Spin 🎰
                </button>
                <button 
                  onClick={() => { try { sounds.playLevelUp(); } catch(e) {} }}
                  className="bg-white/5 hover:bg-amber-400 hover:text-neutral-950 border border-white/5 hover:border-transparent active:scale-95 text-[9px] font-bold py-1.5 px-1 rounded-xl text-zinc-300 transition-all cursor-pointer"
                >
                  LevelUp 🏆
                </button>
                <button 
                  onClick={() => { try { sounds.playCorrect(); } catch(e) {} }}
                  className="bg-white/5 hover:bg-emerald-400 hover:text-neutral-950 border border-white/5 hover:border-transparent active:scale-95 text-[9px] font-bold py-1.5 px-1 rounded-xl text-zinc-300 transition-all cursor-pointer"
                >
                  Correct ✨
                </button>
              </div>
            </div>

            <div className="pt-3 pb-2 text-center">
              <button
                onClick={() => {
                  setDownloadProgress(100);
                  setLoadingAssets(false);
                  try { sounds.playLevelUp(); } catch(e) {}
                }}
                className="bg-amber-400 text-neutral-950 hover:bg-amber-300 hover:scale-105 active:scale-95 transition-all text-[11px] font-black px-6 py-2.5 rounded-2xl uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-400/15"
              >
                <span>ЭХЛЭХ (Instant Skip)</span>
                <Play size={12} className="fill-neutral-950" />
              </button>
              <span className="block text-[8px] text-zinc-500 uppercase font-black mt-2">
                1024.0 MB (1.0 GB) суулгах шаардлагатай
              </span>
            </div>
          </div>
        ) : screen === "exercise" && activeLesson ? (
          <ExerciseScreen 
            lesson={activeLesson}
            unitColor={activeUnitColors.primary}
            unitColorDark={activeUnitColors.dark}
            onFinished={handleLessonFinished}
            onClose={() => setScreen("main")}
            hearts={hearts}
            setHearts={setHearts}
          />
        ) : screen === "results" ? (
          <ResultsScreen 
            xpGained={lastLessionStats.xp}
            correctAnswers={lastLessionStats.correct}
            totalAnswers={lastLessionStats.total}
            onContinue={() => setScreen("main")}
            onReplay={() => {
              if (activeLesson) {
                handleStartLesson(activeLesson, activeUnitColors.primary, activeUnitColors.dark);
              }
            }}
          />
        ) : (
          /* MAIN NAV HUB DESIGN */
          <>
            {/* Interactive Top Navigation Menu Bar (At the absolute top) */}
            <div className="bg-[#131F24] border-b-2 border-zinc-800 h-[66px] grid grid-cols-5 select-none shrink-0 px-4 text-white">
              
              {/* Home mapping Tab */}
              <button
                onClick={() => setTab("home")}
                className="flex flex-col items-center justify-center cursor-pointer relative uppercase text-[10px] gap-1 font-extrabold"
              >
                <div className={`text-2xl filter transition-transform leading-none ${
                  tab === 'home' ? 'scale-110 text-emerald-400 font-black' : 'text-zinc-500 saturate-50'
                }`}>
                  🏠
                </div>
                <span className={tab === 'home' ? 'text-emerald-400 font-black' : 'text-zinc-500'}>
                  Нүүр
                </span>
                {tab === 'home' && (
                  <motion.div layoutId="navline" className="absolute bottom-1 w-8 h-1 bg-emerald-400 rounded-full" />
                )}
              </button>

              {/* Casino Lucky slots Tab */}
              <button
                onClick={() => setTab("casino")}
                className="flex flex-col items-center justify-center cursor-pointer relative uppercase text-[10px] gap-1 font-extrabold"
              >
                <div className={`text-2xl filter transition-transform leading-none ${
                  tab === 'casino' ? 'scale-110 text-emerald-400 font-bold' : 'text-zinc-500 saturate-50'
                }`}>
                  🎰
                </div>
                <span className={tab === 'casino' ? 'text-emerald-400 font-orange' : 'text-zinc-500'}>
                  Азарт
                </span>
                {tab === 'casino' && (
                  <motion.div layoutId="navline" className="absolute bottom-1 w-8 h-1 bg-amber-500 rounded-full" />
                )}
              </button>

              {/* Shop / Wardrobe Boutique Tab */}
              <button
                onClick={() => setTab("shop")}
                className="flex flex-col items-center justify-center cursor-pointer relative uppercase text-[10px] gap-1 font-extrabold"
              >
                <div className={`text-2xl filter transition-transform leading-none ${
                  tab === 'shop' ? 'scale-110 text-emerald-400 font-bold' : 'text-zinc-500 saturate-50'
                }`}>
                  🛍️
                </div>
                <span className={tab === 'shop' ? 'text-emerald-400 font-black' : 'text-zinc-500'}>
                  Шоп
                </span>
                {tab === 'shop' && (
                  <motion.div layoutId="navline" className="absolute bottom-1 w-8 h-1 bg-purple-500 rounded-full" />
                )}
              </button>

              {/* League Board Tab */}
              <button
                onClick={() => setTab("league")}
                className="flex flex-col items-center justify-center cursor-pointer relative uppercase text-[10px] gap-1 font-extrabold"
              >
                <div className={`text-2xl filter transition-transform leading-none ${
                  tab === 'league' ? 'scale-110 text-emerald-400' : 'text-zinc-500 saturate-50'
                }`}>
                  🏆
                </div>
                <span className={tab === 'league' ? 'text-emerald-400 font-black' : 'text-zinc-500'}>
                  Лиг
                </span>
                {tab === 'league' && (
                  <motion.div layoutId="navline" className="absolute bottom-1 w-8 h-1 bg-emerald-400 rounded-full" />
                )}
              </button>

              {/* Profile setup tabs */}
              <button
                onClick={() => setTab("profile")}
                className="flex flex-col items-center justify-center cursor-pointer relative uppercase text-[10px] gap-1 font-extrabold"
              >
                <div className={`text-2xl filter transition-transform leading-none ${
                  tab === 'profile' ? 'scale-110 text-emerald-400' : 'text-zinc-500 saturate-50'
                }`}>
                  👤
                </div>
                <span className={tab === 'profile' ? 'text-emerald-400 font-black' : 'text-zinc-500'}>
                  Профайл
                </span>
                {tab === 'profile' && (
                  <motion.div layoutId="navline" className="absolute bottom-1 w-8 h-1 bg-emerald-400 rounded-full" />
                )}
              </button>
            </div>

            {/* Header branding & stats deck (Now below top menu) */}
            <div className="px-5 py-3 border-b-2 border-zinc-800 flex items-center justify-between select-none shrink-0 bg-[#131F24]">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-emerald-400 tracking-tight leading-none">
                  MongolEng
                </span>
                <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-900/40 font-extrabold text-[9px] px-2 py-0.5 rounded-full select-none uppercase tracking-wider">
                  Англи хэл
                </span>
              </div>

              {/* Action Stats and sound selectors */}
              <div className="flex items-center gap-3.5 text-xs font-black">
                {/* Hearts count indicator (Click to open refill) */}
                <button 
                  onClick={() => {
                    setShowHeartsRefill(true);
                    try { sounds.playCombo(1); } catch(e) {}
                  }}
                  className="flex items-center gap-0.5 text-red-400 hover:scale-105 active:scale-95 transition-all cursor-pointer bg-transparent border-none p-0 select-none font-black"
                  title="Амь цэнэглэх / Хянах"
                >
                  <span className="text-sm select-none animate-pulse">❤️</span>
                  <span className="font-mono text-xs text-red-300">{hearts}</span>
                </button>

                {/* Streak count */}
                <div className="flex items-center gap-0.5 text-orange-400" title="Өдрийн амжилт">
                  <Flame size={16} className="fill-orange-400 stroke-orange-600 shrink-0" />
                  <span className="font-mono text-orange-300">{streak}</span>
                </div>

                {/* Gems count */}
                <div className="flex items-center gap-0.5 text-sky-400" title="Эрдэнэ">
                  <span className="text-sm select-none">💎</span>
                  <span className="font-mono text-sky-300">{gems}</span>
                </div>

                {/* XP sum indicator */}
                <div className="flex items-center gap-0.5 text-amber-400" title="Нийт туршлага (XP)">
                  <Zap size={16} className="fill-amber-400 stroke-amber-600 shrink-0" />
                  <span className="font-mono text-amber-300">{totalXP}</span>
                </div>

                {/* Audio sound settings toggle button */}
                <button 
                  onClick={toggleSound}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 active:scale-95 cursor-pointer bg-transparent border-none transition-all mr-1"
                  title={soundEnabled ? 'Дууг хаах' : 'Дууг нээх'}
                >
                  {soundEnabled ? <Volume2 size={18} className="text-emerald-400" /> : <VolumeX size={18} />}
                </button>
              </div>
            </div>

            {/* Active Display Tab Canvas Panel */}
            <div className="flex-1 overflow-hidden flex flex-col relative bg-[#131F24]">
              <AnimatePresence mode="wait">
                {tab === "home" && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.18 }}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    <HomeScreen 
                      units={units}
                      onStartLesson={handleStartLesson}
                      activeAura={activeAura}
                      setGems={setGems}
                      setTotalXP={setTotalXP}
                    />
                  </motion.div>
                )}

                {tab === "league" && (
                  <motion.div
                    key="league"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.18 }}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    <LeagueScreen totalXP={totalXP} />
                  </motion.div>
                )}

                {tab === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.18 }}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    <ProfileScreen 
                      totalXP={totalXP}
                      streak={streak}
                      gems={gems}
                      activeAura={activeAura}
                      setGems={setGems}
                      setTotalXP={setTotalXP}
                      triggerConfetti={() => setConfettiTrigger(prev => prev + 1)}
                    />
                  </motion.div>
                )}

                {tab === "casino" && (
                  <motion.div
                    key="casino"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.18 }}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    <GachaScreen 
                      gems={gems}
                      totalXP={totalXP}
                      setGems={setGems}
                      setTotalXP={setTotalXP}
                      triggerConfetti={() => setConfettiTrigger(prev => prev + 1)}
                      activeAura={activeAura}
                      setActiveAura={setActiveAura}
                      unlockedAuraIds={unlockedAuraIds}
                      setUnlockedAuraIds={setUnlockedAuraIds}
                    />
                  </motion.div>
                )}

                {tab === "shop" && (
                  <motion.div
                    key="shop"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.18 }}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    <AuraShopScreen 
                      gems={gems}
                      setGems={setGems}
                      activeAura={activeAura}
                      setActiveAura={setActiveAura}
                      unlockedAuraIds={unlockedAuraIds}
                      setUnlockedAuraIds={setUnlockedAuraIds}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Duolingo style Hearts Recharge modal popup */}
        <AnimatePresence>
          {showHeartsRefill && (
            <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="bg-white p-6 rounded-3xl w-full max-w-sm text-center shadow-2xl border-2 border-gray-100 flex flex-col items-center"
              >
                {/* Header section with Duo */}
                <DuoMascot
                  mood={hearts === 0 ? "wrong" : "excited"}
                  size={88}
                  className="mb-1"
                />
                
                <h3 className="text-xl font-black text-gray-900 leading-tight mt-2 select-none uppercase tracking-tight">
                  {hearts === 5 ? "АМЬ ДҮҮРЭН БАЙНА! ❤️" : "АМЬ ЦЭНЭГЛЭХ ҮҮ?"}
                </h3>
                
                <p className="text-xs text-gray-500 mt-2 leading-relaxed max-w-xs font-semibold">
                  {hearts === 5 
                    ? "Таны амь дүүрэн байгаа тул хичээлээ айлтгүй өрнүүлээрэй! Амжилт хүсэе 💚" 
                    : `Та одоогоор ${hearts} амьтай байна. Хичээл хийхэд амь шаардлагатай байдаг.`}
                </p>

                {/* Status Indicator */}
                <div className="flex gap-2 my-4 select-none">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-2xl filter drop-shadow-sm transform hover:scale-110 active:scale-95 transition-all">
                      {i < hearts ? "❤️" : "🖤"}
                    </span>
                  ))}
                </div>

                {/* Recharge Option Cards */}
                {hearts < 5 && (
                  <div className="w-full space-y-2.5 mt-2">
                    
                    {/* Option 1: Recharge with Gems */}
                    <button
                      onClick={() => {
                        if (gems >= 350) {
                          setGems(prev => prev - 350);
                          setHearts(5);
                          try { sounds.playLevelUp(); } catch(e) {}
                          setShowHeartsRefill(false);
                        } else {
                          alert("Уучлаарай, танд хангалттай 💎 Эрдэнэ байхгүй байна!");
                        }
                      }}
                      className={`w-full p-3.5 rounded-2xl border-2 border-b-6 flex items-center justify-between transition-all select-none cursor-pointer text-left ${
                        gems >= 350 
                          ? "bg-amber-50/60 border-amber-300 border-b-amber-500 hover:border-amber-400" 
                          : "bg-gray-50 border-gray-200 border-b-gray-300 opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <div className="text-left">
                        <span className="block text-xs font-black text-amber-850 uppercase">ГҮЙЦЭТ НАЙРУУЛАХ</span>
                        <span className="text-[10px] text-zinc-500 font-bold block mt-0.5">5 Амь шууд цэнэглэх</span>
                      </div>
                      <div className="bg-amber-400 text-neutral-950 font-mono font-black text-xs px-3 py-1 rounded-full flex items-center gap-1 shrink-0">
                        <span>💎 350</span>
                      </div>
                    </button>

                    {/* Option 2: Fun fast meditation recharge */}
                    <RechargeHeartTimer onComplete={() => {
                      setHearts(prev => Math.min(5, prev + 1));
                    }} />

                  </div>
                )}

                {/* Footer Close */}
                <button
                  onClick={() => setShowHeartsRefill(false)}
                  className="w-full mt-4 bg-gray-950 hover:bg-black text-white font-extrabold text-xs py-3.5 rounded-2xl cursor-pointer shadow-md transition-all uppercase tracking-wider"
                >
                  Хаах / Буцах
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
