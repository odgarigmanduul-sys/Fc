import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, FastForward, Swords, Users, Trophy, Award, Zap, Coins, Clock, Sparkles } from 'lucide-react';
import { sounds } from '../utils/sound';
import { AuraSkin } from '../utils/auraData';

interface ArenaScreenProps {
  gems: number;
  totalXP: number;
  setGems: React.Dispatch<React.SetStateAction<number>>;
  setTotalXP: React.Dispatch<React.SetStateAction<number>>;
  activeAura: AuraSkin | null;
  triggerConfetti: () => void;
}

// Simulated online opponent bot database
interface Opponent {
  name: string;
  avatar: string;
  winRate: string;
  auraColor: string;
  auraName: string;
  auraEmoji: string;
  difficulty: "Хялбар" | "Дундаж" | "Хэцүү" | "Домогт";
  botAuraGlow: string;
  xp: number;
}

const SHIELD_BOTS: Opponent[] = [
  { name: "Баатарчин_Ганаа", avatar: "🦁", winRate: "62%", auraColor: "from-amber-400 to-orange-500", auraName: "Нарлаг Лууны Нүд", auraEmoji: "🐉", difficulty: "Дундаж", botAuraGlow: "shadow-[0_0_15px_#f59e0b]", xp: 1200 },
  { name: "Англи_Мэргэн_🦉", avatar: "🦉", winRate: "78%", auraColor: "from-fuchsia-400 via-rose-500 to-cyan-400", auraName: "Сансрын Оч", auraEmoji: "🌌", difficulty: "Хэцүү", botAuraGlow: "shadow-[0_0_25px_#d946ef]", xp: 3400 },
  { name: "Кибер_Чоно_99", avatar: "🐺", winRate: "89%", auraColor: "from-rose-500 to-pink-600", auraName: "Кибер Самурай", auraEmoji: "⚔️", difficulty: "Домогт", botAuraGlow: "shadow-[0_0_30px_#f43f5e]", xp: 8700 },
  { name: "Саруул_Эрдэнэ", avatar: "🐨", winRate: "48%", auraColor: "from-emerald-400 to-green-600", auraName: "Энгийн Нахиа", auraEmoji: "🌱", difficulty: "Хялбар", botAuraGlow: "shadow-[0_0_10px_#10b981]", xp: 450 },
  { name: "Солонгоо_Заяа", avatar: "🦄", winRate: "55%", auraColor: "from-sky-400 to-blue-600", auraName: "Алтан Солонго", auraEmoji: "🌈", difficulty: "Хялбар", botAuraGlow: "shadow-[0_0_12px_#38bdf8]", xp: 880 },
  { name: "Аварга_Бат", avatar: "🐯", winRate: "82%", auraColor: "from-amber-400 to-orange-500", auraName: "Хэрцгий Бар", auraEmoji: "🐯", difficulty: "Хэцүү", botAuraGlow: "shadow-[0_0_20px_#f97316]", xp: 4200 }
];

// Custom Rapid English Translation Question Pool for Battles
interface BattleQuestion {
  q: string;
  mn: string;
  options: string[];
  correctIdx: number;
}

const BATTLE_QUESTIONS: BattleQuestion[] = [
  { q: "What is 'Apple' in Mongolian?", mn: "Алим", options: ["Гадил", "Алим", "Жүрж", "Үзэм"], correctIdx: 1 },
  { q: "We ___ learning English right now.", mn: "We are group plural", options: ["is", "am", "are", "be"], correctIdx: 2 },
  { q: "'How are you?' translates to?", mn: "Мэндчилгээ", options: ["Сайн уу?", "Баяртай", "Баярлалаа", "Сайн байна уу?"], correctIdx: 3 },
  { q: "Complete: 'A ___ can fly in the sky.'", mn: "Тэнгэрт нисдэг амьтан", options: ["fish", "cat", "bird", "dog"], correctIdx: 2 },
  { q: "'Saturday' tells which day?", mn: "Хагас сайн өдөр", options: ["Даваа", "Хагас сайн", "Бүтэн сайн", "Пүрэв"], correctIdx: 1 },
  { q: "Opposite of 'Hot'?", mn: "Халууны эсрэг утга", options: ["Warm", "Cold", "Dry", "Rainy"], correctIdx: 1 },
  { q: "What color is 'Yellow'?", mn: "Нарны өнгө", options: ["Шар", "Ногоон", "Хөх", "Улаан"], correctIdx: 0 },
  { q: "Choose correct spelling:", mn: "Баяр хүргэх", options: ["Congratulashon", "Congrats", "Congratulations", "Congradulations"], correctIdx: 2 },
  { q: "'Good night' means:", mn: "Орондоо орохдоо", options: ["Өглөөний мэнд", "Өдрийн мэнд", "Сайхан амраарай", "Байж бай"], correctIdx: 2 },
  { q: "'Thank you very much' translates to:", mn: "Маш их баярлах", options: ["Маш их баярлалаа", "Уучлаарай", "Сайн уу", "Зүгээр дээ"], correctIdx: 0 }
];

export default function ArenaScreen({ gems, totalXP, setGems, setTotalXP, activeAura, triggerConfetti }: ArenaScreenProps) {
  const [battleState, setBattleState] = useState<"lobby" | "searching" | "vs" | "playing" | "results">("lobby");
  const [wager, setWager] = useState<number>(50);
  const [matchedOpponent, setMatchedOpponent] = useState<Opponent | null>(null);
  
  // Gameplay parameters
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [timer, setTimer] = useState(7); // 7 seconds per battle question
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [battleQuestions, setBattleQuestions] = useState<BattleQuestion[]>([]);
  const [lastRoundUserCorrect, setLastRoundUserCorrect] = useState<boolean | null>(null);

  // Search lobby matchmaking
  const handleStartMatchmaking = () => {
    if (gems < wager) {
      sounds.playWrong();
      alert("🚨 Бооцооны эрдэнэ хүрэлцэхгүй байна! Бусад замаар эрдэнэ олно уу.");
      return;
    }

    setGems(prev => prev - wager);
    setBattleState("searching");
    sounds.playSlotSpin();

    // Matchmaking spinning logic
    setTimeout(() => {
      const selectedOpponent = SHIELD_BOTS[Math.floor(Math.random() * SHIELD_BOTS.length)];
      setMatchedOpponent(selectedOpponent);
      setBattleState("vs");
      sounds.playSlotWin();

      // Start actual game countdown
      setTimeout(() => {
        // Shuffle and select exactly 5 questions
        const shuffled = [...BATTLE_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
        setBattleQuestions(shuffled);
        
        setCurrentQuestionIdx(0);
        setUserScore(0);
        setOpponentScore(0);
        setBattleState("playing");
        setTimer(7);
        setSelectedAns(null);
        setIsAnswering(false);
      }, 3500);
    }, 2800);
  };

  // Turn ticking timer controls inside Battle
  useEffect(() => {
    if (battleState !== "playing") return;

    if (timer <= 0) {
      // Auto-skip or resolve blank answer
      handleChooseAnswer(-1, false);
      return;
    }

    const interval = setInterval(() => {
      setTimer(t => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, battleState]);

  // Turn resolving logic
  const handleChooseAnswer = (idx: number, isUserAction = true) => {
    if (isAnswering) return;
    setIsAnswering(true);
    setSelectedAns(idx);

    const question = battleQuestions[currentQuestionIdx];
    const isCorrect = idx === question.correctIdx;
    setLastRoundUserCorrect(isCorrect);

    // Calculate score based on fastest time remaining
    let earnedPoints = 0;
    if (isCorrect) {
      earnedPoints = 100 + (timer * 20); // Speed bonus! Up to 240 pts
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }

    // Process Bot's automatic calculated outcome
    let botEarned = 0;
    const botAccuracy = matchedOpponent?.difficulty === 'Домогт' ? 0.90 : matchedOpponent?.difficulty === 'Хэцүү' ? 0.78 : 0.60;
    const botCorrect = Math.random() < botAccuracy;
    if (botCorrect) {
      const botSpeedRandom = Math.floor(Math.random() * 5) + 2; // simulated response time
      botEarned = 100 + (botSpeedRandom * 20);
    }

    // Update state scores
    setUserScore(prev => prev + earnedPoints);
    setOpponentScore(prev => prev + botEarned);

    // Briefly display correctness state, then advance
    setTimeout(() => {
      setSelectedAns(null);
      setIsAnswering(false);
      setLastRoundUserCorrect(null);

      if (currentQuestionIdx < 4) {
        setCurrentQuestionIdx(prev => prev + 1);
        setTimer(7); // reset timers
      } else {
        // Complete match
        setBattleState("results");
        resolveWagerOutcome();
      }
    }, 1600);
  };

  const resolveWagerOutcome = () => {
    // Determine winner based on final points sum
    const isUserWinner = userScore >= opponentScore;
    if (isUserWinner) {
      const winPayout = wager * 2;
      setGems(prev => prev + winPayout);
      setTotalXP(prev => prev + 120);
      sounds.playSlotWin();
      triggerConfetti();
    } else {
      // Lost. Gems were already deducted
      setTotalXP(prev => prev + 20);
      sounds.playWrong();
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-start p-5 text-white bg-gradient-to-b from-neutral-900 to-amber-950/40 select-none">
      
      {/* Lobby Selector */}
      {battleState === "lobby" && (
        <div className="flex flex-col items-center flex-1 justify-center space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center text-3xl shadow-xl border-2 border-white animate-bounce-slow">
            ⚔️
          </div>

          <div>
            <h2 className="text-xl font-black text-amber-400 uppercase tracking-wider">Халуун Мөрийтэй Дуэль</h2>
            <p className="text-[10px] text-gray-400 font-bold max-w-xs uppercase tracking-widest mt-1">
              Англи хэлээр уралдаж бооцоо тавь. Давж ялбал хоёр дахин үржүүлж ав! 💰
            </p>
          </div>

          {/* Wager Level selector cards */}
          <div className="w-full max-w-sm grid grid-cols-2 gap-3">
            {[20, 50, 100, 300].map(amt => (
              <button
                key={amt}
                onClick={() => setWager(amt)}
                className={`p-4 rounded-2xl border-2 cursor-pointer text-center relative flex flex-col justify-center items-center transition-all ${
                  wager === amt 
                    ? 'border-amber-400 bg-amber-400/10 text-white shadow-lg' 
                    : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <span className="text-xl">💎</span>
                <span className="font-extrabold text-sm block mt-1">{amt} Эрдэнэ</span>
                <span className="text-[8px] font-black tracking-wider text-amber-500 uppercase mt-0.5">
                  Хожвол: {amt * 2} 💎
                </span>
                {wager === amt && (
                  <span className="absolute -top-2 right-2 bg-amber-400 text-neutral-950 font-black text-[7px] px-1.5 py-0.5 rounded uppercase">
                    Сонгосон
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="text-[10px] font-extrabold text-gray-500 flex items-center gap-1">
            <Users size={12} className="text-amber-500" />
            <span>ОДОО ОНЛАЙН БАЙГАА ТОГЛОГЧИД: 1,842</span>
          </div>

          <button
            onClick={handleStartMatchmaking}
            className="w-full max-w-xs bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black py-4 rounded-2xl border-b-6 border-amber-700 active:scale-95 active:border-b-0 cursor-pointer shadow-xl tracking-wider text-xs uppercase"
          >
            БҮРТГҮҮЛЖ, ӨРСӨЛДӨГЧ ХАЙХ 🥊
          </button>
        </div>
      )}

      {/* Matchmaking pulse wave searching overlay */}
      {battleState === "searching" && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="relative flex items-center justify-center">
            {/* Spinning Radar Ring */}
            <div className="w-32 h-32 rounded-full border-4 border-amber-500/20 animate-ping absolute" />
            <div className="w-24 h-24 rounded-full border-2 border-amber-400 flex items-center justify-center text-4xl bg-neutral-950 shadow-2xl relative z-10 animate-spin-slow">
              ⚡
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-sm font-black text-amber-400 animate-pulse uppercase tracking-wider">
              ӨРСӨЛДӨГЧИЙГ ОЛЖ БАЙНА...
            </h3>
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-1">
              Бооцооны хэмжээ: {wager} 💎
            </p>
          </div>
        </div>
      )}

      {/* Versus Matching card display screen */}
      {battleState === "vs" && matchedOpponent && (
        <div className="flex-1 flex flex-col justify-around items-center py-6 select-none">
          
          <div className="text-center">
            <span className="bg-red-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest animation-pulse">
              ТӨЛӨВ: ДУЭЛЬ ЭХЭЛЖ БАЙНА
            </span>
          </div>

          <div className="w-full flex items-center justify-center gap-6">
            
            {/* USER CARD DECK */}
            <div className="flex flex-col items-center text-center space-y-1.5 flex-1">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl border-4 ${
                activeAura ? activeAura.glowStyle + ' border-transparent' : 'border-neutral-500'
              } bg-neutral-800`}>
                🐼
              </div>
              <div>
                <span className="block text-xs font-black truncate max-w-[100px]">Та (Би)</span>
                <span className="block text-[8px] font-black uppercase text-amber-500 tracking-wider">
                  AURA: {activeAura ? activeAura.name.split(' ').slice(1, -1).join(' ') : "Одоогоор байхгүй"}
                </span>
              </div>
            </div>

            {/* VS CENTER SPARK LOGO */}
            <div className="text-4xl font-black text-amber-400 italic">VS</div>

            {/* OPPONENT CARD DECK */}
            <div className="flex flex-col items-center text-center space-y-1.5 flex-1 animate-pulse">
              <div className={`w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center text-4xl border-4 ${matchedOpponent.botAuraGlow} border-transparent`}>
                {matchedOpponent.avatar}
              </div>
              <div>
                <span className="block text-xs font-black text-rose-300 truncate max-w-[100px]">
                  {matchedOpponent.name}
                </span>
                <span className="block text-[8px] font-bold text-gray-400 capitalize">
                  Ялалт: {matchedOpponent.winRate} ({matchedOpponent.difficulty})
                </span>
              </div>
            </div>
          </div>

          <div className="text-center max-w-xs">
            <span className="block text-xl">⚔️💰⚔️</span>
            <span className="block text-[10px] text-gray-400 font-extrabold mt-1">
              ҮЗЭГЧИД БЭЛЭН! ЯЛАГЧ {wager * 2} 💎 АВЧ ХАРИХ БОЛНО!
            </span>
          </div>
        </div>
      )}

      {/* Actual Live Rapid English Wager Arena Game Loop */}
      {battleState === "playing" && battleQuestions.length > 0 && (
        <div className="flex-1 flex flex-col justify-between py-2">
          
          {/* Real-time score boards */}
          <div className="bg-neutral-950 p-3 rounded-2xl border border-white/5 grid grid-cols-2 gap-4 shrink-0 shadow-md">
            
            {/* User points sum indicator */}
            <div className="flex flex-col items-start border-r border-white/10 pr-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xl">🐼</span>
                <span className="text-[10px] font-black tracking-tight text-emerald-400">Миний оноо</span>
              </div>
              <span className="text-sm font-black text-white font-mono mt-0.5">{userScore} PTS</span>
            </div>

            {/* Target Bot points sum indicator */}
            <div className="flex flex-col items-end pl-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[10px] font-black tracking-tight text-rose-400">{matchedOpponent?.name}</span>
                <span className="text-xl">{matchedOpponent?.avatar}</span>
              </div>
              <span className="text-sm font-black text-rose-300 font-mono mt-0.5">{opponentScore} PTS</span>
            </div>
          </div>

          {/* Quick round progress bar slider */}
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden my-3 border border-white/5 relative z-0">
            <div 
              className="h-full bg-amber-400 rounded-full transition-all duration-300 shadow-xs"
              style={{ width: `${((currentQuestionIdx + 1) / 5) * 100}%` }}
            />
          </div>

          {/* Core Wager active question card */}
          <div className="bg-neutral-900 border-2 border-amber-400/40 p-5 rounded-3xl text-center space-y-4 flex-1 flex flex-col justify-center relative">
            
            {/* Round Count Tag */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-neutral-950 font-black text-[8px] py-1 px-3 rounded-full uppercase tracking-wider">
              Бичих сорил {currentQuestionIdx + 1} / 5
            </div>

            {/* Timer visual circle indicator */}
            <div className="flex items-center justify-center gap-1 text-center mt-3">
              <Clock size={16} className={`${timer <= 2 ? 'text-red-500 animate-ping' : 'text-amber-400'}`} />
              <span className={`font-mono text-xs font-black ${timer <= 2 ? 'text-red-500' : 'text-amber-200'}`}>
                {timer} сек үлдлээ
              </span>
            </div>

            <div>
              <span className="block text-[9px] text-amber-200 font-bold uppercase tracking-widest">{battleQuestions[currentQuestionIdx].mn}</span>
              <h3 className="text-base font-black text-white tracking-tight mt-1 leading-snug">
                {battleQuestions[currentQuestionIdx].q}
              </h3>
            </div>
          </div>

          {/* Interactive Multi-choice response options list */}
          <div className="grid grid-cols-2 gap-2.5 mt-4 select-none shrink-0">
            {battleQuestions[currentQuestionIdx].options.map((opt, optionIdx) => {
              const isSelected = selectedAns === optionIdx;
              const correctIdx = battleQuestions[currentQuestionIdx].correctIdx;
              const isCorrectTarget = optionIdx === correctIdx;

              let styleClass = "bg-white/10 hover:bg-white/15 border border-white/10 text-white";
              if (isSelected) {
                styleClass = isCorrectTarget 
                  ? "bg-emerald-500 border-emerald-400 text-white ring-2 ring-emerald-300" 
                  : "bg-red-500 border-red-400 text-white ring-2 ring-red-300";
              } else if (isAnswering && isCorrectTarget) {
                // reveal standard correct answer
                styleClass = "bg-emerald-500 border-emerald-400 text-white";
              }

              return (
                <button
                  key={optionIdx}
                  disabled={isAnswering}
                  onClick={() => handleChooseAnswer(optionIdx)}
                  className={`py-3.5 px-4 rounded-xl text-xs font-black transition-all cursor-pointer select-none active:scale-95 leading-normal ${styleClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* correctness notification pop feedback text */}
          <div className="text-center h-4 text-xs font-bold font-sans mt-2 animate-pulse">
            {lastRoundUserCorrect === true && <span className="text-emerald-400">🔥 +{100 + (timer * 20)} Хурдны урамшуулал!</span>}
            {lastRoundUserCorrect === false && <span className="text-rose-400">❌ Алдлаа! Сөрөг оноо байхгүй.</span>}
          </div>
        </div>
      )}

      {/* End Battle final result stats screen */}
      {battleState === "results" && matchedOpponent && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-5 text-center py-6">
          
          <div className="animate-bounce">
            {userScore >= opponentScore ? (
              <span className="text-6xl block filter drop-shadow-lg">🏆💰👑</span>
            ) : (
              <span className="text-5xl block filter drop-shadow-md">😭🩹🦾</span>
            )}
          </div>

          <div>
            <h2 className="text-xl font-black uppercase tracking-wider leading-none">
              {userScore >= opponentScore ? "ТА ДУЭЛЬД ЯЛЛАА!" : "ДУЭЛЬД ХАРАМСАЛТАЙ НЬ ЯЛАГДЛАА"}
            </h2>
            <p className="text-[10px] text-gray-400 font-bold max-w-xs mt-1 uppercase tracking-widest leading-relaxed">
              {userScore >= opponentScore 
                ? `Гайхалтай хурд болон мэдлэг! Та тавьсан бооцоо болон дуэлийн +${wager * 2} 💎, +120 XP авлаа.`
                : "Зүгээр шүү, алдаанаасаа сурч аваарай! Та оролцсоноор +20 XP авав."
              }
            </p>
          </div>

          {/* Stats card matching comparison */}
          <div className="bg-neutral-950 p-5 rounded-3xl border border-white/5 w-full max-w-sm space-y-3.5 select-none text-xs">
            <div className="flex justify-between items-center text-gray-300">
              <span className="font-semibold flex items-center gap-1">🐼 Таны авсан оноо</span>
              <span className="font-extrabold text-amber-400 font-mono text-sm">{userScore} PTS</span>
            </div>

            <div className="flex justify-between items-center text-gray-350">
              <span className="font-semibold flex items-center gap-1">🤖 {matchedOpponent.name}</span>
              <span className="font-bold text-gray-350 font-mono">{opponentScore} PTS</span>
            </div>

            <div className="border-t border-white/10 pt-3 flex justify-between items-center">
              <span className="font-black text-[10px] text-amber-500 uppercase">МӨРИЙНИЙ ХОЖИЛ</span>
              <span className="font-extrabold text-white font-mono">
                {userScore >= opponentScore ? `+${wager * 2} 💎` : `-${wager} 💎`}
              </span>
            </div>
          </div>

          <button
            onClick={() => setBattleState("lobby")}
            className="w-full max-w-xs bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black py-3.5 rounded-2xl shadow-md border-b-4 border-amber-700 cursor-pointer active:scale-95 text-xs uppercase"
          >
            ЛОББИДОО БУЦАХ 🥊
          </button>
        </div>
      )}

    </div>
  );
}
