import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Exercise, FeedbackState } from '../types';
import { Volume2 } from 'lucide-react';
import { sounds } from '../utils/sound';
import DuoMascot from './DuoMascot';

const ALPHABET_DATA = [
  { letter: "A", word: "Apple", mn: "Алим", emoji: "🍎", phonetic: "[ei]" },
  { letter: "B", word: "Book", mn: "Ном", emoji: "📖", phonetic: "[bi:]" },
  { letter: "C", word: "Cat", mn: "Муур", emoji: "🐱", phonetic: "[si:]" },
  { letter: "D", word: "Dog", mn: "Нохой", emoji: "🐶", phonetic: "[di:]" },
  { letter: "E", word: "Egg", mn: "Өндөг", emoji: "🥚", phonetic: "[i:]" },
  { letter: "F", word: "Fish", mn: "Загас", emoji: "🐟", phonetic: "[ef]" },
  { letter: "G", word: "Girl", mn: "Охин", emoji: "👧", phonetic: "[dʒi:]" },
  { letter: "H", word: "Hat", mn: "Малгай", emoji: "🎩", phonetic: "[eitʃ]" },
  { letter: "I", word: "Ice", mn: "Мөс", emoji: "❄️", phonetic: "[ai]" },
  { letter: "J", word: "Juice", mn: "Шүүс", emoji: "🧃", phonetic: "[dʒei]" },
  { letter: "K", word: "Key", mn: "Түлхүүр", emoji: "🔑", phonetic: "[kei]" },
  { letter: "L", word: "Lion", mn: "Арслан", emoji: "🦁", phonetic: "[el]" },
  { letter: "M", word: "Milk", mn: "Сүү", emoji: "🥛", phonetic: "[em]" },
  { letter: "N", word: "Net", mn: "Тор", emoji: "🕸️", phonetic: "[en]" },
  { letter: "O", word: "Orange", mn: "Улбар шар", emoji: "🍊", phonetic: "[ou]" },
  { letter: "P", word: "Pen", mn: "Үзэг", emoji: "🖊️", phonetic: "[pi:]" },
  { letter: "Q", word: "Queen", mn: "Хатан хаан", emoji: "👑", phonetic: "[kju:]" },
  { letter: "R", word: "Rain", mn: "Бороо", emoji: "🌧️", phonetic: "[a:r]" },
  { letter: "S", word: "Sun", mn: "Нар", emoji: "☀️", phonetic: "[es]" },
  { letter: "T", word: "Tree", mn: "Мод", emoji: "🌳", phonetic: "[ti:]" },
  { letter: "U", word: "Umbrella", mn: "Шүхэр", emoji: "⛱️", phonetic: "[ju:]" },
  { letter: "V", word: "Van", mn: "Микробус", emoji: "🚐", phonetic: "[vi:]" },
  { letter: "W", word: "Water", mn: "Ус", emoji: "💧", phonetic: "[`dʌblju:]" },
  { letter: "X", word: "Xylophone", mn: "Ксилофон", emoji: "🎼", phonetic: "[eks]" },
  { letter: "Y", word: "Yo-yo", mn: "Ио-ио тоглоом", emoji: "🪀", phonetic: "[wai]" },
  { letter: "Z", word: "Zebra", mn: "Тахь", emoji: "🦓", phonetic: "[zed]" }
];

interface ExerciseScreenProps {
  lesson: {
    id: string;
    label: string;
    exercises: Exercise[];
  };
  unitColor: string;
  unitColorDark: string;
  onFinished: (stats: { correctCount: number; totalCount: number; xpGained: number }) => void;
  onClose: () => void;
  hearts: number;
  setHearts: React.Dispatch<React.SetStateAction<number>>;
}

export default function ExerciseScreen({ 
  lesson, 
  unitColor, 
  unitColorDark, 
  onFinished, 
  onClose,
  hearts,
  setHearts
}: ExerciseScreenProps) {
  const [exIdx, setExIdx] = useState(1);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Is this Unit 1? If yes, show alphabet study deck first! (Ehleed usegnuudee zaaj ug tegeed asuu)
  const [showAlphabetStudy, setShowAlphabetStudy] = useState(lesson.id.startsWith("1-"));
  const [activeLetterIdx, setActiveLetterIdx] = useState(0);

  // Gamification dopamine elements
  const [combo, setCombo] = useState(0);
  const [shake, setShake] = useState(false);
  const [mascotText, setMascotText] = useState("Хамтдаа хичээллэж, слот машинд бэлдэцгээе! 🎰");
  const [mascotStatus, setMascotStatus] = useState<"idle" | "correct" | "wrong" | "combo">("idle");

  // Stats gathered for results screen
  const [correctCount, setCorrectCount] = useState(0);

  const totalExercises = lesson.exercises.length;
  const currentEx = lesson.exercises[exIdx - 1];

  // Tap-answer selected index
  const [chosenOption, setChosenOption] = useState<number | null>(null);

  // sentence arrange chosen words
  const [arrangedWords, setArrangedWords] = useState<string[]>([]);
  const [scrambledPool, setScrambledPool] = useState<string[]>([]);

  // fill-in-the-blank chosen option
  const [filledWord, setFilledWord] = useState<string | null>(null);

  // High dopamine correct splash animation states
  const [correctSplash, setCorrectSplash] = useState<{ text: string; emoji: string } | null>(null);

  const triggerCorrectSplash = () => {
    const splashes = [
      { text: "МАШ САЙН! 🌟", emoji: "💯", english: "Very good" },
      { text: "САЙН БАЙНА! 🎯", emoji: "🔥", english: "Well done" },
      { text: "ГАЙХАЛТАЙ! 🚀", emoji: "⚡", english: "Fantastic" },
      { text: "МУНДАГ БАЙНА! 👑", emoji: "🧠", english: "Excellent" },
      { text: "БҮРЭН ЗӨВ! 💎", emoji: "🏆", english: "Perfect" },
    ];
    const choice = splashes[Math.floor(Math.random() * splashes.length)];
    setCorrectSplash(choice);

    // Dynamic positive vocal speaking response!
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(choice.english);
        utterance.lang = 'en-US';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (e) {}
    }

    setTimeout(() => setCorrectSplash(null), 1400);
  };

  // Sound triggers on state changes
  useEffect(() => {
    // Reset answers when changing exercise
    setChosenOption(null);
    setArrangedWords([]);
    setFilledWord(null);
    setFeedback(null);

    // Keep mascot motivated
    if (combo >= 3) {
      setMascotText(`ТА ОДОО 🔥 ${combo} ДАРААЛСАН КОМБО-ТОЙ БАЙНА! АЙМШИГТАЙ!`);
      setMascotStatus("combo");
    } else {
      setMascotText("Дараагийн асуултыг нураагаад өгье! 😉");
      setMascotStatus("idle");
    }

    if (currentEx) {
      if (currentEx.type === 'arrange' && currentEx.words) {
        // Scramble words pool
        setScrambledPool([...currentEx.words].sort(() => Math.random() - 0.5));
      }
      // Speak the prompt aloud automatically if it corresponds to an English word/sentence
      speakSentence(currentEx.correct || currentEx.blank || "");
    }
  }, [exIdx, currentEx]);

  // Read sentences aloud using Google Synthesis
  const speakSentence = (text: string) => {
    if (!text || typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel(); // Stop current speaking
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85; // slightly slower for instructional clarity
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech Synthesis failed", e);
    }
  };

  const handleCheckAnswer = () => {
    if (!currentEx) return;

    if (currentEx.type === 'tap') {
      if (chosenOption === null) return;
      const ans = currentEx.answers?.[chosenOption];
      if (ans?.correct) {
        setCorrectCount(prev => prev + 1);
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        triggerCorrectSplash();
        
        setFeedback({ ok: true, hint: "Маш сайн ажиллалаа! Төгс хариулт." });
        
        if (nextCombo > 1) {
          sounds.playCombo(nextCombo);
          setMascotStatus("combo");
          setMascotText(`ГАЛ АСЛАА! 🔥 ${nextCombo} КОМБО!!!`);
          // Shake screen on combo streak
          setShake(true);
          setTimeout(() => setShake(false), 500);
        } else {
          sounds.playCorrect();
          setMascotStatus("correct");
          setMascotText("Зөв хариуллаа! Яг ингэж үргэлжлүүл!");
        }
      } else {
        setHearts(prev => Math.max(0, prev - 1));
        setCombo(0);
        setMascotStatus("wrong");
        setMascotText("Өөх, харамсалтай байна! Алдаанаасаа суралцаарай 🩹");
        setShake(true);
        setTimeout(() => setShake(false), 500);

        const correctText = currentEx.answers?.find(a => a.correct)?.text || "";
        setFeedback({ ok: false, hint: `Буруу байна. Зөв хариулт нь: "${correctText}"` });
        sounds.playWrong();
      }
    }

    else if (currentEx.type === 'arrange') {
      const sentence = arrangedWords.join(" ");
      const isCorrect = sentence.toLowerCase().replace(/[.,?/#!$%^&*;:{}=\-_`~()]/g,"") === 
                        currentEx.correct?.toLowerCase().replace(/[.,?/#!$%^&*;:{}=\-_`~()]/g,"");
      
      if (isCorrect) {
        setCorrectCount(prev => prev + 1);
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        triggerCorrectSplash();

        setFeedback({ ok: true, hint: "Агуу байна! Өгүүлбэр төгс орчуулагдлаа." });
        
        if (nextCombo > 1) {
          sounds.playCombo(nextCombo);
          setMascotStatus("combo");
          setMascotText(`ТА ХҮЧЭЭ АВЛАА! 🔥 ${nextCombo} КОМБО!!!`);
          setShake(true);
          setTimeout(() => setShake(false), 500);
        } else {
          sounds.playCorrect();
          setMascotStatus("correct");
          setMascotText("Гайхалтай! Зөв холболт боллоо.");
        }
        speakSentence(currentEx.correct || "");
      } else {
        setHearts(prev => Math.max(0, prev - 1));
        setCombo(0);
        setMascotStatus("wrong");
        setMascotText("Дараалал таарсангүй. Дараагийн багц руу зүтгэцгээе!");
        setShake(true);
        setTimeout(() => setShake(false), 500);

        setFeedback({ ok: false, hint: `Буруу дараалал. Зөв орчуулга: "${currentEx.correct}"` });
        sounds.playWrong();
      }
    }

    else if (currentEx.type === 'fill') {
      if (!filledWord) return;
      const isCorrect = filledWord === currentEx.blank;
      if (isCorrect) {
        setCorrectCount(prev => prev + 1);
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        triggerCorrectSplash();

        setFeedback({ ok: true, hint: `Зөв хариулт! Хоосон зайг амжилттай нөхлөө.` });
        
        if (nextCombo > 1) {
          sounds.playCombo(nextCombo);
          setMascotStatus("combo");
          setMascotText(`ЮУ Ч ЗОГСООХГҮЙ! 🔥 ${nextCombo} КОМБО!!!`);
          setShake(true);
          setTimeout(() => setShake(false), 500);
        } else {
          sounds.playCorrect();
          setMascotStatus("correct");
          setMascotText("Гялс бөглөлөө! Илүү олон дасгал зөв хийгээрэй.");
        }
        speakSentence(currentEx.before + " " + currentEx.blank + " " + currentEx.after);
      } else {
        setHearts(prev => Math.max(0, prev - 1));
        setCombo(0);
        setMascotStatus("wrong");
        setMascotText("Буруу үг сонгосон байна. Одоо ухаалаг хандаарай 🦉");
        setShake(true);
        setTimeout(() => setShake(false), 500);

        setFeedback({ ok: false, hint: `Буруу байна. Зөв хариулт нь: "${currentEx.blank}"` });
        sounds.playWrong();
      }
    }
  };

  const handleNext = () => {
    if (hearts <= 0) {
      // Failed lesson, exit to home
      onFinished({ correctCount: 0, totalCount: totalExercises, xpGained: 0 });
      return;
    }

    if (exIdx >= totalExercises) {
      // Completed last exercise
      const finalAccuracy = Math.round((correctCount / totalExercises) * 100);
      const calculatedXp = finalAccuracy > 0 ? (correctCount * 10) + 10 : 10;
      onFinished({ correctCount, totalCount: totalExercises, xpGained: calculatedXp });
    } else {
      setExIdx(prev => prev + 1);
    }
  };

  // Skip the exercise if they get stuck or loose hearts
  const handleSkip = () => {
    setHearts(prev => Math.max(0, prev - 1));
    const correctSol = currentEx.type === 'tap' 
      ? (currentEx.answers?.find(a => a.correct)?.text || "")
      : currentEx.type === 'fill' 
        ? currentEx.blank 
        : currentEx.correct;

    setFeedback({ 
      ok: false, 
      hint: `Алгаслаа. Зөв хариулт нь байсан: "${correctSol}"` 
    });
    sounds.playWrong();
  };

  // Sentenced building helpers
  const handleWordSelect = (word: string) => {
    if (feedback) return;
    setArrangedWords(prev => [...prev, word]);
    // Remove one instance of selected word from pool
    const idx = scrambledPool.indexOf(word);
    if (idx !== -1) {
      const newPool = [...scrambledPool];
      newPool.splice(idx, 1);
      setScrambledPool(newPool);
    }
  };

  const handleWordDeselect = (word: string) => {
    if (feedback) return;
    // Remove exact instance
    const idx = arrangedWords.indexOf(word);
    if (idx !== -1) {
      const newArranged = [...arrangedWords];
      newArranged.splice(idx, 1);
      setArrangedWords(newArranged);
      setScrambledPool(prev => [...prev, word]);
    }
  };

  const progressPercent = (exIdx / totalExercises) * 100;

  return (
    <div className={`flex flex-col min-h-screen bg-white transition-all duration-200 ${shake ? 'animate-shake' : ''}`}>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          12%, 36%, 60%, 84% { transform: translateX(-6px); }
          24%, 48%, 72%, 96% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>

      {/* Exercise Top Bar */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
        <button 
          onClick={() => setShowExitDialog(true)}
          className="text-gray-400 hover:text-gray-600 text-2xl font-semibold cursor-pointer w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-all active:scale-95 select-none"
        >
          ✕
        </button>

        {/* Progress Bar Container */}
        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden relative border border-gray-200/50">
          <div 
            className="h-full rounded-full transition-all duration-300 relative"
            style={{ 
              width: `${progressPercent}%`,
              background: `linear-gradient(90deg, ${unitColor}, #c2f542)`
            }}
          >
            {/* Glossy overlay shimmer effect for high craftsmanship */}
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>

        {/* Dynamic Heart indicators */}
        <div className="flex items-center gap-1 select-none shrink-0" title="Үлдсэн амь">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-xl filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)] transition-all duration-300">
              {i < hearts ? "❤️" : "🖤"}
            </span>
          ))}
        </div>
      </div>

      {/* Main Task Canvas */}
      {showAlphabetStudy ? (
        <div className="flex-1 overflow-y-auto px-5 py-6 max-w-xl mx-auto w-full flex flex-col justify-start space-y-5 select-none animate-fadeIn">
          <div className="text-center">
            <span className="bg-emerald-100/80 text-emerald-800 text-[10px] font-black tracking-wide px-3 py-1 rounded-full uppercase border border-emerald-200">
              📚 АНГЛИ ЦАГААН ТОЛГОЙ & ҮСЭГ СУРАХ
            </span>
            <h2 className="text-xl font-black text-gray-900 mt-2">Эхлээд үсгүүдээ сурцгаая! 🦉</h2>
            <p className="text-xs text-slate-500 mt-1 leading-normal">
              Үсэг бүрийн дуудлагыг сонсон цээжлээд, "ОЙЛГОЛОО" товчийг дарж хамтдаа сонирхолтой асуултууддаа хариулаарай!
            </p>
          </div>

          {/* Large Interactive Showcase Board with nice glass and custom frame */}
          <div className="bg-slate-50 rounded-2xl p-5 border-2 border-slate-200/80 flex flex-col items-center justify-center relative min-h-[160px] shadow-sm hover:shadow-md transition-all">
            <span className="absolute top-2.5 left-3 bg-emerald-500 text-white font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wide">
              СОНГОГДСОН ҮСЭГ
            </span>
            
            <button 
              onClick={() => {
                const item = ALPHABET_DATA[activeLetterIdx];
                speakSentence(`${item.letter}, ${item.word}`);
              }}
              className="absolute top-2.5 right-3 bg-white hover:bg-sky-50 text-sky-500 p-2 rounded-full shadow-xs border border-sky-100 active:scale-90 transition-all cursor-pointer"
              title="Үсэгний дуудлага сонсох"
            >
              <Volume2 size={20} className="stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-6 mt-2">
              <span className="text-8xl font-black text-slate-800 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                {ALPHABET_DATA[activeLetterIdx].letter}
              </span>
              <div className="text-left">
                <div className="text-2xl font-black text-sky-600 font-mono tracking-tight leading-none mb-1">
                  {ALPHABET_DATA[activeLetterIdx].phonetic}
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                  Холболт:
                </div>
                <div className="text-md font-black text-slate-700 flex items-center gap-1.5 leading-tight">
                  <span className="text-2xl filter drop-shadow-xs">{ALPHABET_DATA[activeLetterIdx].emoji}</span>
                  <span>{ALPHABET_DATA[activeLetterIdx].word}</span>
                </div>
                <div className="text-xs font-black text-slate-500 bg-white/95 border border-slate-100 px-2.5 py-1 rounded-lg mt-1 inline-block">
                  🇲🇳 Монголоор: {ALPHABET_DATA[activeLetterIdx].mn}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => {
                const item = ALPHABET_DATA[activeLetterIdx];
                speakSentence(`${item.letter} is for ${item.word}`);
              }}
              className="mt-4 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 font-black text-[10px] px-3.5 py-1.5 rounded-lg flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <Volume2 size={12} className="stroke-[2.5]" />
              Дуудлага бүтнээр сонсох
            </button>
          </div>

          <div className="p-3 bg-sky-50 border border-sky-100 rounded-2xl flex items-center gap-2.5 shadow-xs">
            <span className="text-3xl animate-bounce shrink-0">🦉</span>
            <p className="text-[11px] font-black text-sky-800 m-0 leading-normal">
              Duo: "Эхний нэгжийн бүх асуултад маш сайн хариулахын тулд доорх үсгүүд дээр дарж дуудлагыг сонсоорой. Ойлгомжтой бол Ойлгосон товчоо дараарай!"
            </p>
          </div>

          <div>
            <div className="grid grid-cols-6 gap-2">
              {ALPHABET_DATA.map((item, idx) => {
                const isSelected = activeLetterIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveLetterIdx(idx);
                      speakSentence(`${item.letter}, ${item.word}`);
                      try { sounds.playCardFlip(); } catch(e) {}
                    }}
                    className={`h-11 rounded-xl font-bold flex flex-col items-center justify-center transition-all duration-150 cursor-pointer text-xs uppercase shadow-xs border-2 border-b-4 ${
                      isSelected 
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 shadow-emerald-200" 
                        : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="font-extrabold text-[13px] leading-none mb-0.5">{item.letter}</span>
                    <span className={`text-[8px] font-mono leading-none ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>{item.phonetic}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-5 py-6 max-w-xl mx-auto w-full flex flex-col justify-start animate-fadeIn">
          
          {/* Step Indicator Header */}
          <div className="flex items-center justify-between mb-2 shrink-0">
            <span className="bg-gray-100 text-gray-600 text-[10px] font-black tracking-wide px-3 py-1 rounded-full uppercase">
              Дасгал {exIdx} / {totalExercises}
            </span>
            <span className="text-[11px] font-extrabold text-amber-500">
              {currentEx.type === 'tap' && "🎯 ОРЧУУЛГА СОНГОХ"}
              {currentEx.type === 'arrange' && "🧩 ӨГҮҮЛБЭР ЭРЭМБЭЛЭХ"}
              {currentEx.type === 'fill' && "📝 ХООСОН ЗАЙГ НӨХӨХ"}
            </span>
          </div>

          {/* COMPANION OWL SPEECH PANEL */}
          <div className="flex items-center gap-4 mb-4 select-none shrink-0 relative p-1">
            <DuoMascot
              mood={mascotStatus === 'combo' ? 'combo' : mascotStatus === 'correct' ? 'correct' : mascotStatus === 'wrong' ? 'wrong' : 'idle'}
              size={72}
            />
            <div className="flex-1 relative">
              <div className="bg-white border-2 border-gray-200 text-gray-700 font-extrabold text-[11px] px-4 py-3 rounded-2xl shadow-sm leading-normal relative">
                {mascotText}
                {/* Chevron arrow pointing left to the Mascot */}
                <div className="absolute left-[-6px] top-6 w-2.5 h-2.5 bg-white border-l-2 border-b-2 border-gray-200 transform rotate-45" />
              </div>
            </div>
            {combo >= 2 && (
              <div className="bg-orange-500 text-white font-black text-[9px] py-1 px-2.5 rounded-xl uppercase animate-pulse shrink-0 border-b-2 border-orange-700">
                {combo}x Combo 🔥
              </div>
            )}
          </div>

          {/* Exercise Frame Section */}
          {currentEx.type === 'tap' && (
            <div className="flex-1 flex flex-col justify-center space-y-6">
              <h3 className="text-lg font-black text-gray-900 leading-tight border-l-4 pl-3" style={{ borderColor: unitColor }}>
                {currentEx.q}
              </h3>

              {/* Display character block with Audio Speak if present */}
              <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center justify-center border border-gray-100 min-h-[120px] relative shrink-0">
                {currentEx.correct && (
                  <button 
                    onClick={() => speakSentence(currentEx.correct || "")}
                    className="absolute top-3 right-3 bg-white hover:bg-sky-50 text-sky-500 p-2.5 rounded-full shadow-xs border border-sky-100 active:scale-90 transition-all cursor-pointer"
                    title="Speak phrase"
                  >
                    <Volume2 size={20} className="stroke-[2.5]" />
                  </button>
                )}
                <span className="text-6xl mb-2 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)] select-none">
                  {currentEx.char}
                </span>
                {currentEx.mn && (
                  <div className="text-sm font-bold text-gray-700 bg-white/80 px-4 py-1.5 rounded-full shadow-xs">
                    {currentEx.mn}
                  </div>
                )}
              </div>

              {/* Option Cards Blocks Grid */}
              <div className="grid grid-cols-2 gap-3.5 pt-2">
                {currentEx.answers?.map((ans, i) => {
                  const isSelected = chosenOption === i;
                  
                  // Colors state based on selected results
                  let cardStyle = "border-gray-200 hover:border-gray-300 border-b-gray-300";
                  if (isSelected) {
                    if (feedback) {
                      cardStyle = feedback.ok 
                        ? "bg-emerald-50 border-emerald-400 border-b-emerald-600 text-emerald-900 font-extrabold shadow-md shadow-emerald-100" 
                        : "bg-rose-50 border-rose-400 border-b-rose-600 text-rose-950 font-extrabold shadow-md shadow-rose-100";
                    } else {
                      cardStyle = `border-sky-400 border-b-sky-600 font-bold bg-sky-50/50 shadow-xs ring-2 ring-sky-100`;
                    }
                  } else if (feedback) {
                    // highlight the right one if user failed
                    if (ans.correct && !feedback.ok) {
                      cardStyle = "border-emerald-400 border-b-emerald-600 animate-pulse bg-emerald-50/40";
                    } else {
                      cardStyle = "opacity-55 border-gray-100 border-b-gray-200 cursor-not-allowed";
                    }
                  }

                  return (
                    <motion.button
                      key={i}
                      whileHover={!feedback ? { y: -2 } : {}}
                      whileTap={!feedback ? { scale: 0.98 } : {}}
                      disabled={feedback !== null}
                      onClick={() => setChosenOption(i)}
                      className={`p-4 rounded-2xl bg-white border-2 border-b-6 shadow-xs flex flex-row items-center gap-3 cursor-pointer text-left transition-all select-none min-h-[58px] ${cardStyle}`}
                    >
                      <span className="text-2xl filter drop-shadow-sm shrink-0">{ans.emoji || "💡"}</span>
                      <span className="text-xs font-black text-gray-800 leading-tight break-words pr-1">
                        {ans.text}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {currentEx.type === 'arrange' && (
            <div className="flex-1 flex flex-col justify-start space-y-6 pt-4">
              <div>
                <h3 className="text-lg font-black text-gray-900 leading-tight">
                  {currentEx.q}
                </h3>
                {currentEx.mn && (
                  <div className="text-sm font-semibold text-gray-500 mt-1 flex items-center gap-1.5 select-none bg-sky-50/40 px-3 py-1.5 rounded-xl border border-sky-100/30 w-fit">
                    <span>🇲🇳 МН:</span>
                    <span className="text-gray-700">{currentEx.mn}</span>
                  </div>
                )}
              </div>

              {/* Speaking speaker assistance */}
              <div className="flex justify-center select-none pt-1">
                <button 
                  onClick={() => speakSentence(currentEx.correct || "")}
                  className="bg-sky-50 hover:bg-sky-100 text-sky-500 hover:text-sky-600 px-6 py-2.5 rounded-full flex items-center justify-center gap-2 font-extrabold text-[12px] shadow-xs active:scale-95 transition-all border border-sky-100 cursor-pointer"
                >
                  <Volume2 size={18} className="stroke-[2.5]" />
                  АВАЛИАД СОНСОХ (Speak)
                </button>
              </div>

              {/* Sentence arrangement area display */}
              <div className="min-h-[100px] border-b-2 border-gray-200 flex flex-wrap gap-2 py-4 items-center justify-center content-center bg-gray-50/30 rounded-2xl px-4 border border-dashed border-gray-200 relative">
                {arrangedWords.length === 0 && (
                  <span className="text-gray-400 text-xs font-semibold tracking-wide uppercase select-none">
                    ЭНД ДҮГНЭЛТҮҮДИЙГ ОРУУЛ
                  </span>
                )}
                {arrangedWords.map((word, idx) => (
                  <motion.button
                    layoutId={`word-${word}-${idx}`}
                    key={idx}
                    onClick={() => handleWordDeselect(word)}
                    disabled={feedback !== null}
                    className="bg-white border-2 border-gray-200 hover:border-gray-300 border-b-4 border-b-gray-300 hover:bg-gray-50 font-extrabold text-xs px-4 py-2 rounded-xl text-gray-800 transition-all inline-block cursor-pointer shadow-xs active:scale-95 select-none"
                  >
                    {word}
                  </motion.button>
                ))}
              </div>

              {/* Selection Options Pool */}
              <div className="flex flex-wrap gap-2 justify-center py-4">
                {scrambledPool.map((word, idx) => {
                  const isSelectedElsewhere = feedback !== null;
                  
                  return (
                    <motion.button
                      layoutId={`word-pool-${word}-${idx}`}
                      disabled={isSelectedElsewhere}
                      key={idx}
                      onClick={() => handleWordSelect(word)}
                      className="bg-gray-100 hover:bg-gray-200 border-2 border-transparent border-b-4 border-b-gray-300 font-extrabold text-xs px-4 py-2 rounded-xl text-gray-700 transition-all inline-block cursor-pointer active:scale-95 select-none"
                    >
                      {word}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {currentEx.type === 'fill' && (
            <div className="flex-1 flex flex-col justify-start space-y-6 pt-4">
              <div>
                <h3 className="text-lg font-black text-gray-900 leading-tight">
                  {currentEx.q}
                </h3>
                {currentEx.mn && (
                  <div className="text-sm font-semibold text-gray-500 mt-1 flex items-center gap-1.5 select-none bg-emerald-50/20 px-3 py-1.5 rounded-xl border border-emerald-100/20 w-fit">
                    <span>🇲🇳 МН:</span>
                    <span className="text-gray-700">{currentEx.mn}</span>
                  </div>
                )}
              </div>

              {/* Sentence context with empty blank line */}
              <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[140px] text-center shrink-0">
                <span className="text-[11px] font-extrabold uppercase text-gray-400 tracking-wider mb-2 select-none">
                  Өгүүлбэрийг бөглөх:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2.5 text-lg font-black text-gray-900">
                  <span>{currentEx.before}</span>
                  
                  <span 
                    onClick={() => {
                      if (feedback) return;
                      setFilledWord(null);
                    }}
                    className={`px-5 py-1.5 min-w-[80px] border-b-3 rounded-xl inline-block text-center transition-all text-xs font-black select-none ${
                      filledWord 
                        ? "bg-white border-sky-400 border-b-sky-600 text-sky-700 cursor-pointer hover:bg-gray-50" 
                        : "bg-gray-200/60 border-gray-300 border-dashed border-b-gray-400 text-transparent min-h-[34px]"
                    }`}
                  >
                    {filledWord || "______"}
                  </span>

                  <span>{currentEx.after}</span>
                </div>
                
                {currentEx.hint && (
                  <div className="text-[10px] text-gray-400 font-bold tracking-tight mt-4 select-none">
                    💡 Зөвлөмж: {currentEx.hint}
                  </div>
                )}
              </div>

              {/* Selection Choices Tray */}
              <div className="pt-2">
                <span className="block text-center text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide select-none">
                  Опционы хувилбарууд:
                </span>
                <div className="flex flex-wrap gap-2.5 justify-center">
                  {currentEx.options?.map((opt, i) => {
                    const isSelected = filledWord === opt;
                    let optStyle = "bg-white border-gray-200 border-b-gray-300 text-gray-800 hover:border-gray-300";
                    
                    if (isSelected) {
                      optStyle = "bg-sky-50 border-sky-400 border-b-sky-600 text-sky-800 font-black shadow-xs ring-2 ring-sky-100";
                    } else if (feedback) {
                      optStyle = "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400";
                    }

                    return (
                      <button
                        key={i}
                        disabled={feedback !== null}
                        onClick={() => setFilledWord(opt)}
                        className={`px-5 py-3 rounded-2xl border-2 border-b-4 font-extrabold text-xs transition-all active:scale-95 cursor-pointer select-none ${optStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Floating Skip/Heart alert if they have 0 hearts */}
      {hearts <= 0 && !feedback && (
        <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-40">
          <div className="bg-white p-6 rounded-3xl w-full max-w-sm text-center shadow-2xl border border-gray-100">
            <span className="text-5xl block mb-2 select-none">❤️💔</span>
            <h4 className="text-lg font-black text-gray-900 leading-tight">Амь дууслаа!</h4>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Та дараагийн хичээлдээ бэлтгэж, алдаанаасаа сургамж аваарай. Сэтгэлээр бүү унаарай!
            </p>
            <button
              onClick={() => onFinished({ correctCount: 0, totalCount: totalExercises, xpGained: 0 })}
              className="w-full mt-5 bg-rose-500 text-white font-extrabold text-xs py-3 rounded-xl shadow-md border-b-4 border-rose-700 cursor-pointer hover:bg-rose-600 active:scale-95 active:border-b-0"
            >
              БУЦАХ (ГЭРТЭЭ ХАРИХ)
            </button>
          </div>
        </div>
      )}

      {/* Solid Dynamic Action Bottom Feedback Bar */}
      <div 
        className={`px-5 py-5 border-t select-none transition-all duration-200 ${
          showAlphabetStudy 
            ? "bg-emerald-50/50 border-emerald-100"
            : feedback 
              ? feedback.ok 
                ? "bg-emerald-100 border-emerald-200 text-emerald-950 shadow-inner" 
                : "bg-rose-100 border-rose-200 text-rose-950 shadow-inner" 
              : "bg-gray-50 border-gray-100"
        }`}
      >
        <div className="max-w-xl mx-auto w-full flex flex-col gap-3.5">
          {showAlphabetStudy ? (
            <button
              onClick={() => {
                setShowAlphabetStudy(false);
                try { sounds.playLevelUp(); } catch (e) {}
              }}
              className="w-full text-white font-black text-xs py-4 rounded-2xl cursor-pointer text-center uppercase tracking-wider border-b-4 hover:brightness-105 active:scale-98 active:border-b-0 bg-emerald-500 border-emerald-700 shadow-md shadow-emerald-100"
            >
              ҮСГҮҮДЭЭ СУРЧ ДУУССАН, ОДОО ШАЛГАХ АСУУЛТУУДАД БЭЛЭН! 🚀
            </button>
          ) : (
            <>
              <AnimatePresence mode="wait">
                {feedback && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-3xl filter drop-shadow-xs leading-none shrink-0" role="img" aria-label="feedback icon">
                      {feedback.ok ? "🎉" : "💡"}
                    </span>
                    <div className="flex-1 min-w-0 pr-1">
                      <span className="block font-black text-xs uppercase tracking-tight">
                        {feedback.ok ? "Гайхалтай! Зөв байна." : "Анхаараарай:"}
                      </span>
                      <p className="text-xs font-semibold leading-normal break-words m-0 mt-0.5">
                        {feedback.hint}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-3">
                {/* Skip/Aksah Button */}
                {!feedback && (
                  <button
                    disabled={feedback !== null}
                    onClick={handleSkip}
                    className="bg-white hover:bg-gray-100 text-gray-500 font-extrabold text-xs px-5 py-3.5 rounded-2xl border-2 border-b-4 border-gray-200 transition-all shrink-0 cursor-pointer active:scale-95 active:border-b-0"
                  >
                    Алгасах (Skip)
                  </button>
                )}

                {/* Primary confirmation handler trigger */}
                {feedback ? (
                  <button
                    onClick={handleNext}
                    className="flex-1 text-white font-extrabold text-xs py-3.5 rounded-2xl cursor-pointer shadow-sm transition-all text-center uppercase tracking-wide border-b-4 hover:brightness-105 active:scale-98 active:border-b-0"
                    style={{ 
                      background: feedback.ok ? "#58cc02" : "#ea2b2b",
                      borderColor: feedback.ok ? "#46a302" : "#cc1f1f",
                    }}
                  >
                    ҮРГЭЛЖЛҮҮЛЭХ
                  </button>
                ) : (
                  <button
                    disabled={
                      (currentEx.type === 'tap' && chosenOption === null) ||
                      (currentEx.type === 'arrange' && arrangedWords.length === 0) ||
                      (currentEx.type === 'fill' && !filledWord)
                    }
                    onClick={handleCheckAnswer}
                    className={`flex-1 text-white font-extrabold text-xs py-3.5 rounded-2xl cursor-pointer text-center uppercase tracking-wide border-b-4 transition-all ${
                      (currentEx.type === 'tap' && chosenOption === null) ||
                      (currentEx.type === 'arrange' && arrangedWords.length === 0) ||
                      (currentEx.type === 'fill' && !filledWord)
                        ? "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed border-none shadow-none"
                        : "shadow-md hover:brightness-105 active:scale-98 active:border-b-0"
                    }`}
                    style={{ 
                      background: (currentEx.type === 'tap' && chosenOption === null) ||
                                  (currentEx.type === 'arrange' && arrangedWords.length === 0) ||
                                  (currentEx.type === 'fill' && !filledWord)
                                    ? undefined 
                                    : unitColor,
                      borderColor: (currentEx.type === 'tap' && chosenOption === null) ||
                                   (currentEx.type === 'arrange' && arrangedWords.length === 0) ||
                                   (currentEx.type === 'fill' && !filledWord)
                                     ? undefined 
                                     : unitColorDark,
                    }}
                  >
                    ШАЛГАХ (Check)
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Exit Dialog Modal */}
      <AnimatePresence>
        {showExitDialog && (
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-6 rounded-3xl w-full max-w-sm text-center shadow-2xl border border-gray-100"
            >
              <span className="text-5xl block mb-2 select-none">😢</span>
              <h3 className="text-lg font-black text-gray-900 leading-tight">Бүх ахиц алдагдана!</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Та одоо хичээлээс гарвал хийсэн дасгалын ахиц хувь алдагдана. Дахин бодож үзээрэй.
              </p>
              
              <div className="grid grid-cols-2 gap-3.5 mt-6">
                <button
                  onClick={() => setShowExitDialog(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs py-3 rounded-xl tracking-tight transition-all active:scale-95 cursor-pointer"
                >
                  ХИЧЭЭЛД ҮЛДЭХ
                </button>
                <button
                  onClick={() => {
                    setShowExitDialog(false);
                    onClose();
                  }}
                  className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs py-3 rounded-xl tracking-tight shadow-sm border-b-4 border-rose-700 transition-all active:scale-95 active:border-b-0 cursor-pointer"
                >
                  ГАРНА (Орхих)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* High Dopamine Correct Answer Splash Overlay */}
      <AnimatePresence>
        {correctSplash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 z-40 pointer-events-none select-none overflow-hidden"
          >
            {/* Spinning background light */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute w-72 h-72 rounded-full border border-dashed border-emerald-400/[0.25]"
            />

            {/* Glowing Splash Card */}
            <motion.div
              initial={{ scale: 0.5, y: 50, rotate: -8 }}
              animate={{ scale: [0.5, 1.15, 1], y: 0, rotate: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: -30 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="bg-white/95 border-b-6 border-emerald-500 shadow-[0_20px_50px_rgba(16,185,129,0.4)] backdrop-blur-md px-8 py-6 rounded-3xl flex flex-col items-center gap-1 max-w-xs text-center border-2 border-emerald-200"
            >
              <span className="text-6xl filter drop-shadow-md animate-bounce inline-block mb-1">
                {correctSplash.emoji}
              </span>
              <h2 className="text-xl font-black text-emerald-600 tracking-tight leading-none uppercase m-0">
                {correctSplash.text}
              </h2>
              <span className="text-[10px] text-emerald-500 font-extrabold tracking-widest uppercase mt-1 block">
                +15 XP & КОМБО ӨСӨЛТ 🔥
              </span>
            </motion.div>

            {/* Flying mini confetti inside bounds */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                return (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, scale: 0 }}
                    animate={{ 
                      x: Math.cos(angle) * 160, 
                      y: Math.sin(angle) * 160, 
                      scale: [0, 1.2, 0],
                      rotate: [0, 180]
                    }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute left-1/2 top-1/2 -ml-2 -mt-2 text-xl select-none"
                  >
                    {["✨", "🔥", "⭐", "🎉", "💎", "💯"][i % 6]}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
