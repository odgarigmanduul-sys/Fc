import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Unit, Lesson } from '../types';
import { sounds } from '../utils/sound';

interface HomeScreenProps {
  units: Unit[];
  onStartLesson: (lesson: Lesson, unitColor: string, unitColorDark: string) => void;
  activeAura?: any;
  setGems: React.Dispatch<React.SetStateAction<number>>;
  setTotalXP: React.Dispatch<React.SetStateAction<number>>;
}

// Highly stylized advice quotes from Duo
const DUO_QUOTES = [
  "Ойр ойрхон давтах нь гадаад хэлийг тархинд хоногшуулах шидтэй! 🧠",
  "Гурван минут суралцах нь огт сурахгүй байснаас 100 дахин дээр шүү. 🦉",
  "Тасаршгүй өдрийн цувралаа (Streak) алдаж болохгүй шүү! Duo харж байгаа... 👀",
  "Дөрвөлжин хаалгаар орж, дугуй хэллэгээр яриарай! Манай Касиногоос шинэ Аура авсан уу? 💎",
  "Баяр хүргэе! Таны суралцах хурд урьд өмнөхөөсөө 150% нэмэгдсэн байна. 🔥",
  "Алдаа бол хамгийн шилдэг багш. Алдахаас хэзээ ч бүү ай! 💖",
];

export default function HomeScreen({ units, onStartLesson, activeAura, setGems, setTotalXP }: HomeScreenProps) {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [activeGuide, setActiveGuide] = useState<number | null>(null);
  const [wobbleId, setWobbleId] = useState<string | null>(null);
  
  // High dopamine state for Daily Gacha Chest
  const [chestClaimed, setChestClaimed] = useState(() => {
    return localStorage.getItem('mongoleng_home_chest') === 'claimed';
  });
  const [chestAnimation, setChestAnimation] = useState<'idle' | 'opening' | 'reward'>('idle');
  const [chestReward, setChestReward] = useState<{ gems: number; xp: number } | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);

  // Active Duo quote rotation
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Quick ripple effects state to show multiple shockwaves
  const [ripples, setRipples] = useState<{ id: number; lessonId: string }[]>([]);

  // Periodically rotate helpful advice
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % DUO_QUOTES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const getGuideContent = (unitId: number) => {
    const guides: Record<number, { title: string; sections: { subtitle: string; text: string }[] }> = {
      1: {
        title: "Англи авиа зүй ба Цагаан толгой (Нэгж 1)",
        sections: [
          { subtitle: "🗣️ Үсэг ба Дуудлага", text: "Англи хэлний үндсэн дуудлагууд болон авиануудыг Apple (Алим), Book (Ном), Cat (Муур) зэрэг үгс дээр бэлтгэж эхэлнэ. Эхлэн сурагчдад үгийн эхний авиаг зөв унших нь чухал." },
          { subtitle: "📝 'An' ба 'A' хэрэглэх дүрэм", text: "Эгшиг авиагаар (a, e, i, o, u) эхэлсэн нэр үгийн өмнө 'an', гийгүүлэгч авиагаар эхэлсэн бол 'a' хэрэглэнэ. Жишээ: an apple, a cat, a book." }
        ]
      },
      2: {
        title: "Үндсэн мэндчилгээ ба Харилцан яриа (Нэгж 2)",
        sections: [
          { subtitle: "👋 Хүндэтгэлийн мэндчилгээ", text: "Хүнтэй уулзахдаа 'Hello' (Сайн уу) эсвэл 'Good morning' (Өглөөний мэнд) гэж эелдэг мэндчилнэ. Салахдаа 'Goodbye' (Баяртай) хэмээнэ." },
          { subtitle: "🤝 Танилцах соёл", text: "'My name is...' (Намайг... гэдэг) гэж өөрийгөө илэрхийлж, 'Nice to meet you' (Уулзсандаа таатай байна) гэж яриа өрнүүлнэ." }
        ]
      },
      3: {
        title: "Анхны тоонууд ба Тоолох арга зүй (Нэгж 3)",
        sections: [
          { subtitle: "🔢 Нэгээс Арав хүртэлх тоо", text: "One (1), Two (2), Three (3), Four (4), Five (5), Ten (10) зэрэг үндсэн тоонуудыг заавал чгүй тогтооно. Үргэлж нэр үгийнхээ өмнө тоог байрлуулна. Жишээ: two dogs." },
          { subtitle: "📊 Тооны дарааллын дүрэм", text: "Англи хэлэнд олон тооны нэр үгийн араас 's' залгадаг. Жишээ: ten stars (арван одод)." }
        ]
      },
      4: {
        title: "Гэр бүл ба Ойр дотны хүмүүс (Нэгж 4)",
        sections: [
          { subtitle: "👨 Гэр бүлийн гишүүд", text: "Mother (Ээж), Father (Аав), Sister (Эмэгтэй дүү/эгч), Brother (Ах/эрэгтэй дүү). Эдгээр нь хамгийн түгээмэл ойр дотны хүмүүсийн нэршил юм." },
          { subtitle: "🏠 Хамаатуулах төлөөний нэр", text: "'My' гэдэг нь 'Миний' гэсэн утгатай. Миний ээж гэж хэлэхийг хүсвэл: 'This is my mother.' хэмээнэ." }
        ]
      },
      5: {
        title: "Өнгөнүүд ба Дүрс харьцаанууд (Нэгж 5)",
        sections: [
          { subtitle: "🎨 Өнгө заах дүрэм", text: "Red (Улаан), Blue (Цэнхэр), Green (Ногоон), Yellow (Шар). Өнгийг уншихдаа нэр үгний өмнө байршуулж өгүүлбэр бүтээнэ. Жишээ: I see a yellow balloon." },
          { subtitle: "🔴 Тэнгэр ба Байгалийн дүрслэл", text: "Байгалийн үзэгдэлд хандахад: 'The sky is blue.' (Тэнгэр цэнхэр байна) эсвэл 'Green grass' (Ногоон өвс) гэх мэтээр ашиглана." }
        ]
      },
      6: {
        title: "Гэр орон ба Эргэн тойрон (Нэгж 6)",
        sections: [
          { subtitle: "🪑 Өрөөний тавилга хэрэгсэл", text: "Table (Ширээ), Chair (Сандал), Bed (Ор). Өрөөн доторх эд зүйлийг заахад 'on the table' (ширээн дээр), 'in the room' (өрөөнд) гэх мэт заах үгсийг ашиглана." },
          { subtitle: "🔑 Нээлттэй ба Хаалттай төлөв", text: "Юмс нээлттэй байгааг 'open', хаалттайг 'closed' гэнэ. Жишээ: The door is open." }
        ]
      },
      7: {
        title: "Түгээмэл амтлаг хоол хүнс ба ундаа (Нэгж 7)",
        sections: [
          { subtitle: "🥛 Уух ба Идэх үйл үгс", text: "Шингэн зүйл уухад 'drink', хоол идэхэд 'eat' гэсэн үйл үгсийг ашиглана. Жишээ: I drink water. She eats bread." },
          { subtitle: "🍵 Эелдэг санал тавих", text: "Бусдад хоол ундаа санал болгохдоо 'Would you like some...?' (Та ... уух уу/идэх үү?) гэж соёлтойгоор хэлнэ." }
        ]
      },
      8: {
        title: "Биеийн эрхтэн ба Нарийн эрүүл мэнд (Нэгж 8)",
        sections: [
          { subtitle: "🧠 Биеийн үндсэн хэсгүүд", text: "Head (Толгой), Eye (Нүд), Hand (Гар), Leg (Хөл). Эдгээр үгсийг ашиглан биеэ зааж, эмчилгээ, зааварчилгаа авахад хэрэглэдэг." },
          { subtitle: "❤️ Эрүүл төлөв байдал", text: "Эрүүл, сайн байхыг 'healthy' гэнэ. Хангалттай унтаж амрахыг 'sleep' хэмээнэ. Жишээ: Sleep is good for your body." }
        ]
      },
      9: {
        title: "Амьтны ерөнхий ертөнц ба Байгаль (Нэгж 9)",
        sections: [
          { subtitle: "🦁 Зэрлэг ба Гэрийн амьтад", text: "Lion (Арслан), Horse (Морь), Cow (Үхэр), Sheep (Хонь). Хамгийн эхэнд мал аж ахуй болон түгээмэл амьтдын нэрийг тод тогтоох нь чухал." },
          { subtitle: "🦅 Чадварыг илэрхийлэх 'Can'", text: "Амьтдын хийж чадах зүйлийг 'can' ашиглан бичнэ. Жишээ: Birds can fly high (Шувууд өндөрт нисэж чадна)." }
        ]
      },
      10: {
        title: "Баялаг цаг хугацаа ба Цаг агаар (Нэгж 10)",
        sections: [
          { subtitle: "☀️ Өдөр ба Шөнө", text: "Day (Өдөр), Night (Шөнө), Today (Өнөөдөр). Өдрийн цагаар ажиллаад шөнийн цагаар унтдагийг: 'We sleep at night.' гэж холбоно." },
          { subtitle: "🌧️ Цаг агаарын төлөв байдал", text: "Бороотой өдрийг 'rainy', шуургатайг 'wind', нарлаг өдрийг 'sunny' гэнэ. Жишээ: Today is a sunny day." }
        ]
      },
      11: {
        title: "Үйл үгс, Анхны идэвхтэй хөдөлгөөн (Нэгж 11)",
        sections: [
          { subtitle: "🏃 Хөдөлгөөн заах үйл үгс", text: "Run (Гүйх), Walk (Алхах), Jump (Үсрэх). Өөрийн дуртай үйлдлийг 'like to [action]' бүтцээр хэлнэ. Жишээ: I like to run fast." },
          { subtitle: "📖 Сурч мэдэх үйлдлүүд", text: "Read (Унших), Write (Бичих), Speak (Ярих). Жишээ: She reads a new book (Тэр шинэ ном уншиж байна)." }
        ]
      },
      12: {
        title: "Аялал жуулчлал ба Тээврийн хэрэгсэл (Нэгж 12)",
        sections: [
          { subtitle: "🚗 Тээврийн хэрэгслийн төрөл", text: "Car (Машин), Bus (Автобус), Plane (Онгоц), Train (Галт тэрэг). Тээврийн хэрэгслээр зорчихдоо 'by' туслах үгийг залгана. Жишээ: I go by plane." },
          { subtitle: "📍 Байршил асуух 'Where'", text: "Буудал болон чиглэл хайхдаа 'Where is...?' (Хаана байна вэ?) хэмээн асууна. Жишээ: Where is the bus stop?" }
        ]
      },
      13: {
        title: "Ажил мэргэжил ба Сургуулийн амьдрал (Нэгж 13)",
        sections: [
          { subtitle: "💼 Мэргэжил нэг бүр", text: "Doctor (Эмч), Teacher (Багш), Student (Оюутан). Хэний мэргэжлийг тайлбарлаж байгаагаас хамааран өгүүлбэрээ угсарна уу. Жишээ: My mother is a doctor." },
          { subtitle: "🏫 Сургууль ба Ажлын байр", text: "Сургуульд сурахыг 'study at school', ажилд явахыг 'go to work' гэнэ. Жишээ: I study at school." }
        ]
      },
      14: {
        title: "Хувцас хэрэглэл, Загвар ба Төрх (Нэгж 14)",
        sections: [
          { subtitle: "👕 Өдөр тутмын хувцаслалт", text: "Shirt (Цамц), Pants (Өмд), Shoes (Гутал), Coat (Хүрэм). Өмсөж зүүхийг 'wear' гэсэн үйл үгээр илэрхийлнэ. Жишээ: I wear a warm coat." },
          { subtitle: "👜 Тэмдэг нэрээр дурдах", text: "Хувцсыг тодорхойлохдоо өнгийг нь хамтад нь оруулж болно. Жишээ: Her shoes are black (Түүний гутал хар байна)." }
        ]
      },
      15: {
        title: "Дэлгүүр хэсэх, Үнэ ханш ба Эдийн засаг (Нэгж 15)",
        sections: [
          { subtitle: "🛒 Худалдан авалт ба Мөнгө", text: "Money (Мөнгө), Price (Үнэ), Buy (Худалдаж авах), Price (Үнэ). Юмс худалдан авахыг хүсвэл: 'I want to buy shoes.' хэмээнэ." },
          { subtitle: "💰 Үнэ асуух 'How much'", text: "Барааны өртгийг лавлахад 'How much does this cost?' (Энэ ямар үнэтэй вэ?) гэсэн хэллэгийг цээжлэн хэрэглээрэй." }
        ]
      },
      16: {
        title: "Улс орон, Хэл соёл ба Дэлхий дахин (Нэгж 16)",
        sections: [
          { subtitle: "🌍 Манай Дэлхий ба Хэл", text: "World (Дэлхий), Country (Улс), Language (Хэл). Дэлхий нийтээр харилцдаг хэлийг тодорхойлоход: 'English is a world language.' гэнэ." },
          { subtitle: "🏔️ Байгалийн тогтоцууд", text: "Mountain (Уул), River (Гол), Sea (Далай). Жишээ: He climbs the high mountain (Тэр өндөр ууланд авирдаг)." }
        ]
      },
      17: {
        title: "Чөлөөт цаг, Спорт ба Хобби (Нэгж 17)",
        sections: [
          { subtitle: "⚽ Спорт ба Тоглоом", text: "Sport (Спорт), Ball (Бөмбөг), Game (Тоглоом). Спортын төрлөөр тоглохдоо 'play' үйл үгийг шууд холбож бичнэ. Жишээ: I play computer games." },
          { subtitle: "🎬 Хөгжим ба Кино урлаг", text: "Хөгжим сонсохыг 'listens to music', кино үзэхийг 'watch a movie' гэнэ. Жишээ: We watch a comedy movie." }
        ]
      },
      18: {
        title: "Тэмдэг нэрс ба Сэтгэл хөдлөл (Нэгж 18)",
        sections: [
          { subtitle: "😄 Сэтгэл санааны байдлууд", text: "Happy (Аз жаргалтай), Sad (Гунигтай), Angry (Ууртай). Сэтгэл хөдлөлөө To Be үйл үгтэй шууд залгана. Жишээ: Today I am very happy." },
          { subtitle: "🐘 Харьцуулах тэмдэг нэр", text: "Биетийн хэмжээг Big (Том), Small (Жижиг), Хурдыг Fast (Хурдан) гэнэ. Жишээ: The green train is fast." }
        ]
      },
      19: {
        title: "Асуулт хариулт ба Үгүйсгэх ахисан дүрэм (Нэгж 19)",
        sections: [
          { subtitle: "❓ Асуух үгс цээжлэх", text: "What (Юу), Where (Хаана), Who (Хэн), When (Хэзээ). Эдгээр үгс нь өгүүлбэрийн хамгийн урд байрладаг. Жишээ: Where do you live?" },
          { subtitle: "❌ Үгүйсгэсэн 'Do not'", text: "Дургүй эсвэл хийдэггүй үйлээ илэрхийлэхэд 'do not' / 'does not' ашиглана. Жишээ: I do not like coffee." }
        ]
      },
      20: {
        title: "Бизнес зөвлөгөө ба Түгээмэл хэлцүүд (Нэгж 20)",
        sections: [
          { subtitle: "🤝 Оффисын яриа соёл", text: "Meeting (Уулзалт), Email (И-мэйл), Company (Компани), Project (Төсөл). Бизнесийн орчинд 'send an email' (и-мэйл илгээх) гэхийг өргөн хэрэглэнэ." },
          { subtitle: "🏆 Багаар ажиллаж амжилтад хүрэх", text: "Амжилтыг 'success' гэнэ. Жишээ: Teamwork brings great success (Хамтын ажиллагаа маш их амжилт авчирдаг)." }
        ]
      }
    };

    return guides[unitId] || {
      title: "Англи хэлний түвшин тодорхойлох гарын авлага",
      sections: [
        { subtitle: "✨ Амжилт хүсье", text: "Таны Англи хэлний сурах цаашдын аялалд өндөр амжилтыг хүсэн ерөөе! Өдөр бүр бага багаар, тасралтгүй суралцаж амжилтаа бататгаарай." }
      ]
    };
  };

  const currentGuide = activeGuide ? getGuideContent(activeGuide) : null;

  const handleLessonClick = (lesson: Lesson, isLocked: boolean) => {
    const rippleId = Date.now();
    setRipples(prev => [...prev, { id: rippleId, lessonId: lesson.id }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 1000);

    if (isLocked) {
      try { sounds.playWrong(); } catch(e) {}
      setWobbleId(lesson.id);
      setTimeout(() => setWobbleId(null), 500);
      return;
    }

    if (lesson.done) {
      try { sounds.playSlotSpin(); } catch(e) {}
    } else {
      try { sounds.playCardFlip(); } catch(e) {}
    }

    setTooltip(tooltip === lesson.id ? null : lesson.id);
  };

  // High dopamine logic to open the claim box
  const openDailyChest = () => {
    if (chestClaimed) return;
    try { sounds.playSlotSpin(); } catch(e) {}
    setChestAnimation('opening');

    setTimeout(() => {
      const generatedReward = {
        gems: Math.floor(Math.random() * 150) + 100, // 100-250
        xp: Math.floor(Math.random() * 40) + 20, // 20-60
      };
      setChestReward(generatedReward);
      setChestAnimation('reward');
      setShowRewardModal(true);
      setChestClaimed(true);
      localStorage.setItem('mongoleng_home_chest', 'claimed');
      
      // Update real values!
      setGems(prev => prev + generatedReward.gems);
      setTotalXP(prev => prev + generatedReward.xp);

      try { sounds.playLevelUp(); } catch(e) {}
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden pb-20 scrollbar-thin scrollbar-thumb-zinc-800 bg-[#131F24] relative text-white">
      <style>{`
        @keyframes custom-ripple {
          0% { transform: scale(0.6); opacity: 0.9; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(6deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-8deg); }
        }
        @keyframes orbit-cw {
          0% { transform: rotate(0deg) translateX(48px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(48px) rotate(-360deg); }
        }
        @keyframes orbit-ccw {
          0% { transform: rotate(360deg) translateX(44px) rotate(-360deg); }
          100% { transform: rotate(0deg) translateX(44px) rotate(0deg); }
        }
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 6px var(--aura-color, #10b981)) brightness(1); }
          50% { filter: drop-shadow(0 0 18px var(--aura-color, #10b981)) brightness(1.3); }
        }
        @keyframes shake-wobble {
          0%, 100% { transform: translateX(0); }
          15%, 45%, 75% { transform: translateX(-6px) rotate(-2.5deg); }
          30%, 60%, 90% { transform: translateX(6px) rotate(2.5deg); }
        }
        @keyframes starGlint {
          0%, 100% { transform: scale(0.6) rotate(0deg); opacity: 0.35; }
          50% { transform: scale(1.15) rotate(180deg); opacity: 0.95; }
        }
        @keyframes lightBeam {
          0% { transform: translateX(-150%) skewX(-15deg); }
          100% { transform: translateX(180%) skewX(-15deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>

      {/* Floating Background Sparkles Ambiance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute top-[8%] left-[10%] text-amber-300 text-lg opacity-45 animate-[starGlint_3.5s_infinite]">✨</div>
        <div className="absolute top-[22%] right-[15%] text-indigo-300 text-base opacity-35 animate-[starGlint_4.5s_infinite_1s]">⭐</div>
        <div className="absolute top-[38%] left-[82%] text-emerald-300 text-xl opacity-45 animate-[starGlint_5s_infinite_0.5s]">✨</div>
        <div className="absolute top-[55%] left-[6%] text-pink-300 text-lg opacity-35 animate-[starGlint_5.5s_infinite_2s]">🔮</div>
        <div className="absolute top-[75%] right-[10%] text-sky-400 text-lg opacity-50 animate-[starGlint_3.8s_infinite_1.2s]">⭐</div>
        <div className="absolute top-[88%] left-[12%] text-amber-400 text-base opacity-35 animate-[starGlint_6s_infinite_0.4s]">✨</div>
      </div>

      {/* Dynamic Wisdom Header Coach (Interactive quote) */}
      <div className="mx-4 mt-4 bg-[#202F36] border-2 border-[#2b3c44] p-4 rounded-3xl flex items-start gap-3.5 shadow-md relative overflow-hidden z-10 hover:border-emerald-500/50 transition-colors select-none">
        <div className="w-12 h-12 rounded-full bg-emerald-950/45 border-2 border-emerald-900/50 flex items-center justify-center shrink-0 text-3xl animate-[bounce-slow_3s_infinite]">
          🦉
        </div>
        <div className="flex-1">
          <span className="block text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-0.5">
            Duo Багшийн зөвлөгөө
          </span>
          <p className="text-[12.5px] font-black tracking-tight text-zinc-100 leading-normal m-0 animate-pulse">
            "{DUO_QUOTES[quoteIndex]}"
          </p>
        </div>
      </div>

      {/* Daily Gacha Mystery Box widget */}
      <div className="mx-4 mt-3 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-500 rounded-3xl p-4.5 border-b-6 border-amber-600 text-white shadow-xl relative overflow-hidden z-10">
        {/* Shimmer effect */}
        <div 
          className="absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 pointer-events-none"
          style={{ animation: 'lightBeam 4s infinite linear' }}
        />
        
        <div className="flex items-center justify-between gap-4 select-none relative z-10">
          <div className="flex items-center gap-3.5">
            <span className="text-4xl animate-bounce">
              {chestAnimation === 'opening' ? '🔮' : chestClaimed ? '🎁' : '👑'}
            </span>
            <div>
              <span className="block text-[8px] font-black text-amber-955 uppercase tracking-widest">
                ӨДӨР БҮРИЙН УРАМШУУЛАЛ
              </span>
              <h3 className="text-sm font-black text-neutral-950 tracking-tight m-0">
                {chestClaimed ? "Өнөөдрийн бэлэг авсан" : "Өдрийн нууцлаг Хайрцаг"}
              </h3>
              <span className="text-[10px] text-amber-950 font-extrabold block mt-0.5">
                {chestClaimed 
                  ? "Бэлгийг амжилттай задалсан. Маргааш дахин ирээрэй! ✨" 
                  : "Нээгээд 100-250 💎 Эрдэнэ үнэгүй аваарай"}
              </span>
            </div>
          </div>

          <button
            onClick={openDailyChest}
            disabled={chestClaimed || chestAnimation === 'opening'}
            className={`font-black text-xs px-4 py-2.5 rounded-2xl border-b-4 transition-all uppercase select-none cursor-pointer ${
              chestClaimed 
                ? "bg-amber-100/30 text-amber-200 border-none opacity-50 cursor-not-allowed" 
                : chestAnimation === 'opening'
                  ? "bg-slate-900 border-b-slate-950 text-white animate-pulse"
                  : "bg-neutral-950 hover:bg-black text-white hover:scale-105 active:scale-95 border-b-neutral-800"
            }`}
          >
            {chestAnimation === 'opening' ? "Уншиж байна..." : chestClaimed ? "Задалсан" : "ЗАДЛАХ"}
          </button>
        </div>
      </div>

      {/* Equipped Aura Status Banner (If custom aura) */}
      {activeAura && (
        <div className="mx-4 mt-3 bg-[#202F36] border-2 border-[#2b3c44] px-4 py-3.5 rounded-3xl flex items-center justify-between shadow-xl select-none relative overflow-hidden z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full" />
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${activeAura.color} flex items-center justify-center text-lg ${activeAura.glowStyle} relative`}>
              <span className="absolute inset-0 bg-white/20 rounded-full animate-ping pointer-events-none" />
              {activeAura.emoji}
            </div>
            <div>
              <span className="block text-[8px] font-black text-emerald-400 uppercase tracking-widest">
                ИДЭВХТЭЙ ГОЁЛЫН АУРА ЭФФЕКТ
              </span>
              <span className="text-[12px] font-extrabold text-white tracking-tight">
                {activeAura.name}
              </span>
            </div>
          </div>
          <span className="bg-zinc-800 text-zinc-300 font-extrabold text-[8px] px-2.5 py-1 rounded-lg border border-zinc-700/65 uppercase tracking-widest shrink-0">
            {activeAura.rarity}
          </span>
        </div>
      )}

      {/* Units Loop */}
      {units.map((unit) => {
        // High dopamine progress computations
        const finishedLessonsCount = unit.lessons.filter(l => l.done).length;
        const totalLessonsCount = unit.lessons.length;
        const progressPercent = totalLessonsCount > 0 
          ? Math.round((finishedLessonsCount / totalLessonsCount) * 100) 
          : 0;

        return (
          <div key={unit.id} className="mb-6 relative z-10">
            
            {/* Shimmering Unit Header Card Banner */}
            <div 
              className="mx-4 mt-4 p-5 rounded-4xl text-white shadow-xl flex flex-col gap-4 border transition-all duration-300 hover:scale-[1.015] hover:-translate-y-0.5 active:scale-[0.995] relative overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${unit.color}, ${unit.colorDark})`,
                borderColor: unit.colorDark,
                boxShadow: `0 12px 28px -6px ${unit.colorDark}60`
              }}
            >
              {/* Shimmer light path */}
              <div 
                className="absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent transform skew-x-12 pointer-events-none"
                style={{ animation: 'lightBeam 5s infinite ease-out' }}
              />

              <div className="flex flex-row justify-between items-center gap-2 relative z-10 w-full">
                <div className="flex items-center gap-3.5">
                  <span className="text-4xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)] select-none animate-[float-slow_4s_infinite_ease-in-out]">
                    {unit.icon}
                  </span>
                  <div>
                    <span className="block text-[9.5px] font-black tracking-widest text-white/80 uppercase">
                      {unit.label}
                    </span>
                    <h2 className="text-base font-black tracking-tight text-white m-0">
                      {unit.name}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 select-none">
                  {/* Progress Stars Badge */}
                  <span className="bg-white/18 border border-white/20 text-white font-mono font-black text-[10px] px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1">
                    ⭐ {finishedLessonsCount}/{totalLessonsCount} Completed
                  </span>
                  
                  <button 
                    onClick={() => {
                      setActiveGuide(unit.id);
                      try { sounds.playCardFlip(); } catch(e) {}
                    }}
                    className="bg-zinc-950/20 hover:bg-zinc-950/45 text-white active:scale-90 transition-all text-xs font-black p-2.5 rounded-2xl cursor-pointer shadow-sm flex items-center justify-center"
                    title="Гарын авлага нээх"
                  >
                    📖
                  </button>
                </div>
              </div>

              {/* Dynamic Progress indicator bar (Vibrant with neon drop shadows) */}
              <div className="bg-black/25 rounded-2xl p-3 border border-white/10 relative z-10 select-none">
                <div className="flex justify-between items-center text-[9px] font-black text-white/90 uppercase tracking-wider mb-2">
                  <span>Нэгжийн Сургалтын Явц:</span>
                  <span className="font-mono text-amber-300">{progressPercent}% дууссан</span>
                </div>
                
                <div className="w-full h-3.5 bg-zinc-950/50 rounded-full p-0.5 border border-white/5 relative overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-300 via-amber-400 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                    style={{ width: `${progressPercent || 4}%` }}
                  />
                  {/* Progress light indicator trail */}
                  {progressPercent > 0 && progressPercent < 100 && (
                    <div 
                      className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-pulse"
                      style={{ left: `calc(${progressPercent}% - 30px)` }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Lesson Path Circles with Zigzag Offset */}
            <div className="py-8 px-4 flex flex-col items-center relative min-h-[300px]">
              {unit.lessons.map((lesson, li) => {
                const positions = ["center", "left", "right", "center", "left"];
                const pos = positions[li % positions.length];
                const offsetX = pos === "left" ? -60 : pos === "right" ? 60 : 0;
                const isTooltipOpen = tooltip === lesson.id;

                let isLocked = lesson.locked;
                if (li > 0) {
                  const prevLesson = unit.lessons[li - 1];
                  if (!prevLesson.done) {
                    isLocked = true;
                  }
                }

                const isActiveLevel = !isLocked && !lesson.done;
                const currentRipples = ripples.filter(r => r.lessonId === lesson.id);

                return (
                  <div key={lesson.id} className="flex flex-col items-center w-full relative">
                    {/* Vertical connector line between bubbles */}
                    {li > 0 && (
                      <div 
                        className="w-3.5 h-12 -my-2 rounded-full shrink-0 relative overflow-hidden" 
                        style={{ 
                          background: lesson.done ? unit.color : "#202F36",
                          boxShadow: lesson.done ? `0 2px 10px ${unit.colorDark}60` : "none"
                        }}
                      >
                        {lesson.done && (
                          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent animate-pulse" style={{ animationDuration: '1.2s' }} />
                        )}
                        <div className="absolute inset-0 bg-transparent border-l-2 border-r-2 border-white/10" />
                      </div>
                    )}

                    <div 
                      className="relative my-2.5 select-none"
                      style={{ transform: `translateX(${offsetX}px)` }}
                    >
                      {/* Tooltip Overlay */}
                      <AnimatePresence>
                        {isTooltipOpen && !isLocked && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.82, y: -15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.82, y: -15 }}
                            transition={{ type: "spring", stiffness: 440, damping: 20 }}
                            className="absolute z-20 bottom-[114%] left-1/2 -translate-x-1/2 w-54 bg-[#202F36] border-2 border-[#2b3c44] rounded-4xl p-4 shadow-[0_16px_36px_-4px_rgba(0,0,0,0.55)] text-center text-white"
                          >
                            <div className="font-black text-[13.5px] text-white leading-tight mb-1 uppercase tracking-tight">
                              {lesson.label}
                            </div>
                            <div className="text-[10px] text-emerald-300 font-extrabold mb-3.5 flex items-center justify-center gap-1 uppercase tracking-widest bg-emerald-950/50 border border-emerald-900/30 px-2 py-0.5 rounded-full mx-auto w-fit">
                              {lesson.done ? "👑 АМЖИЛТТАЙ ДҮҮРГЭСЭН" : `🔥 ${lesson.exercises.length} ХОС ДАСГАЛУУД`}
                            </div>
                            <button
                              onClick={() => {
                                setTooltip(null);
                                onStartLesson(lesson, unit.color, unit.colorDark);
                              }}
                              className="w-full text-white font-black text-xs py-3.5 rounded-3xl transition-all cursor-pointer active:scale-95 border-b-6 hover:brightness-105 active:border-b-0 hover:shadow-lg flex items-center justify-center gap-1.5"
                              style={{ 
                                background: unit.color, 
                                borderColor: unit.colorDark,
                              }}
                            >
                              <span>{lesson.done ? "👑 ДАХИН АЯЛАХ" : "▶️ СУРАЛЦАХ"}</span>
                            </button>
                            {/* Triangle arrow at the bottom */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-4 overflow-hidden pointer-events-none">
                              <div className="w-3.5 h-3.5 bg-[#202F36] border-b border-r border-[#2b3c44] rotate-45 mx-auto -translate-y-2 shadow-[2px_2px_4px_rgba(0,0,0,0.25)]" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Circular Level Bubble */}
                      <div className="relative">
                        
                        {/* Shockwaves rendering */}
                        {currentRipples.map(ripple => (
                          <div 
                            key={ripple.id}
                            className="absolute inset-0 rounded-full bg-cyan-400 pointer-events-none mix-blend-screen"
                            style={{
                              animation: 'custom-ripple 0.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
                              backgroundColor: lesson.done ? '#fbbf24' : unit.color
                            }}
                          />
                        ))}

                        {/* Equipped Level Active Aura Halos & Orbiting Mini Emojis */}
                        {isActiveLevel && activeAura && (
                          <>
                            <div 
                              className={`absolute inset-0 rounded-full bg-gradient-to-br ${activeAura.color} opacity-40 blur-md scale-125 animate-pulse`}
                              style={{
                                ['--aura-color' as any]: activeAura.color.includes('emerald') ? '#10b981' : 
                                                          activeAura.color.includes('sky') ? '#0ea5e9' : 
                                                          activeAura.color.includes('rose') ? '#f43f5e' : 
                                                          activeAura.color.includes('purple') ? '#8b5cf6' : '#d97706',
                                animation: 'glowPulse 2s infinite ease-in-out'
                              }}
                            />
                            {/* Rotating Halo */}
                            <div 
                              className={`absolute -inset-2.5 rounded-full bg-gradient-to-tr ${activeAura.color} opacity-85`}
                              style={{
                                padding: '2px',
                                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                maskComposite: 'exclude',
                                WebkitMaskComposite: 'xor',
                                animation: 'orbit-cw 6s linear infinite'
                              }}
                            />
                            <div 
                              className={`absolute -inset-1.5 rounded-full bg-gradient-to-br ${activeAura.color} opacity-60`}
                              style={{
                                padding: '2.5px',
                                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                maskComposite: 'exclude',
                                WebkitMaskComposite: 'xor',
                                animation: 'orbit-ccw 5s linear infinite'
                              }}
                            />

                            {/* Orbiting particles */}
                            <div className="absolute inset-0 pointer-events-none select-none z-10">
                              <span 
                                className="absolute text-xs select-none text-shadow"
                                style={{ animation: 'orbit-cw 3s linear infinite' }}
                              >
                                {activeAura.emoji}
                              </span>
                              <span 
                                className="absolute text-xs opacity-75 select-none text-shadow"
                                style={{ animation: 'orbit-cw 4.5s linear infinite 1.5s' }}
                              >
                                ✨
                              </span>
                              <span 
                                className="absolute text-xs select-none text-shadow"
                                style={{ animation: 'orbit-ccw 3.8s linear infinite 0.7s' }}
                              >
                                💎
                              </span>
                            </div>
                          </>
                        )}

                        {/* Standard default pulsing state if aura is NOT equipped */}
                        {isActiveLevel && !activeAura && (
                          <span className="absolute inset-0 rounded-full animate-ping bg-emerald-400/25 opacity-85 pointer-events-none" />
                        )}

                        {/* Main Round Level Bubble Selector Button */}
                        <motion.button
                          whileHover={!isLocked ? { scale: 1.15, rotate: [0, -3.5, 3.5, 0], transition: { duration: 0.22 } } : {}}
                          whileTap={!isLocked ? { scale: 0.88 } : {}}
                          onClick={() => handleLessonClick(lesson, isLocked)}
                          className={`w-20 h-20 rounded-full border-b-6 flex items-center justify-center relative cursor-pointer outline-hidden transition-all duration-150 select-none ${
                            isLocked 
                              ? "bg-[#202F36] border-[#2b3c44] border-b-[#172328] text-zinc-500 cursor-not-allowed" 
                              : lesson.done 
                                ? "bg-amber-500/25 border-amber-400 border-b-amber-600 text-amber-300 shadow-md"
                                : "bg-white shadow-xl text-neutral-900"
                          }`}
                          style={{ 
                            borderColor: isLocked ? undefined : (lesson.done ? undefined : unit.color),
                            borderBottomColor: isLocked ? undefined : (lesson.done ? undefined : unit.colorDark),
                            animation: wobbleId === lesson.id ? 'shake-wobble 0.35s ease-in-out' : undefined,
                            boxShadow: !isLocked && !lesson.done ? `0 0 0 5px ${unit.colorPale}, 0 8px 20px rgba(0,0,0,0.16)` : undefined
                          }}
                        >
                          <span 
                            className="text-3.5xl select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] block"
                            style={{ filter: isLocked ? "grayscale(1) opacity(0.35)" : "none" }}
                          >
                            {lesson.icon}
                          </span>

                          {/* Level completion stats tag (Done versus Lock Icon badge) */}
                          {isLocked && (
                            <span className="absolute -bottom-1 -right-0.5 w-6 h-6 bg-zinc-850 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#202F36] select-none shadow-md">
                              🔒
                            </span>
                          )}

                          {lesson.done && !isLocked && (
                            <span className="absolute -top-1 -right-1 bg-amber-400 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md select-none border-2 border-[#202F36] animate-bounce">
                              👑
                            </span>
                          )}
                        </motion.button>
                      </div>

                      {/* Micro descriptor captions representing lesson name */}
                      <div 
                        className={`text-center text-[12px] font-black mt-2.5 tracking-tight uppercase leading-none ${
                          isLocked ? 'text-zinc-600' : 'text-zinc-200'
                        }`}
                      >
                        {lesson.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Guide/Handbook Modal Pop */}
      <AnimatePresence>
        {currentGuide && (
          <div className="fixed inset-0 bg-neutral-900/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#202F36] rounded-4xl w-full max-w-md max-h-[82vh] flex flex-col shadow-2xl border border-[#2b3c44] text-white"
            >
              <div className="px-6 py-5 border-b border-[#2b3c44] flex justify-between items-center bg-[#172328] rounded-t-4xl">
                <span className="text-amber-400 text-lg font-black flex items-center gap-1.5">💡 Гарын авлага</span>
                <button 
                  onClick={() => {
                    setActiveGuide(null);
                    try { sounds.playCardFlip(); } catch(e) {}
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all cursor-pointer border-none"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5 scrollbar-thin">
                <h3 className="text-lg font-black text-white leading-tight">
                  {currentGuide.title}
                </h3>
                <div className="h-[3px] bg-amber-400 w-16 rounded-full" />
                
                {currentGuide.sections.map((sec, idx) => (
                  <div key={idx} className="bg-[#172328]/50 p-4.5 rounded-3xl border border-[#2b3c44]/60">
                    <h4 className="font-black text-[14px] text-emerald-400 mb-2 flex items-center gap-1.5">
                      {sec.subtitle}
                    </h4>
                    <p className="text-zinc-300 text-xs leading-relaxed whitespace-pre-line m-0 font-bold">
                      {sec.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-5 border-t border-[#2b3c44]">
                <button
                  onClick={() => {
                    setActiveGuide(null);
                    try { sounds.playCorrect(); } catch(e) {}
                  }}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm py-4 rounded-3xl cursor-pointer active:scale-98 transition-all border-none shadow-lg"
                >
                  Ойлгосон, Хичээлдээ буцах
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Daily Gacha Chest Confetti Opening Reward Modal Popup */}
      <AnimatePresence>
        {showRewardModal && chestReward && (
          <div className="fixed inset-0 bg-neutral-900/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className="bg-white p-6 rounded-4xl w-full max-w-sm text-center shadow-2xl border-4 border-amber-300 flex flex-col items-center relative overflow-hidden"
            >
              {/* Radial shiny background aura glow */}
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-radial from-amber-200/40 via-transparent to-transparent animate-pulse rounded-full" />

              <span className="text-6xl my-4 animate-bounce filter drop-shadow-md">👑🎁✨</span>

              <h2 className="text-2xl font-black text-amber-500 uppercase tracking-tight m-0">
                БЭЛЭГ ЗАДАРЛАА!
              </h2>

              <p className="text-[12px] text-gray-500 font-extrabold mt-1.5 leading-relaxed max-w-xs">
                Өдрийн нууцлаг хайрцагнаас дараах өндөр дүнтэй урамшуулал уналаа! Баяр хүргэе! 🎉
              </p>

              {/* Shimmering reward bubbles */}
              <div className="flex gap-3 my-4 w-full">
                <div className="flex-1 bg-gradient-to-br from-sky-50 to-sky-100/60 p-3.5 rounded-2xl border-2 border-sky-200 text-center shadow-xs">
                  <span className="text-xl block">💎</span>
                  <span className="block text-xs font-black text-sky-800 uppercase mt-1">Олсон Эрдэнэ</span>
                  <span className="text-lg font-mono font-black text-sky-500 block">+{chestReward.gems}</span>
                </div>

                <div className="flex-1 bg-gradient-to-br from-amber-55 to-amber-100/60 p-3.5 rounded-2xl border-2 border-amber-200 text-center shadow-xs">
                  <span className="text-xl block">⚡</span>
                  <span className="block text-xs font-black text-amber-850 uppercase mt-1">Нэмэлт XP</span>
                  <span className="text-lg font-mono font-black text-amber-500 block">+{chestReward.xp}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowRewardModal(false);
                  try { sounds.playCorrect(); } catch(e) {}
                  // Refreshing window state or parent container is handled seamlessly!
                }}
                className="w-full bg-slate-900 hover:bg-black text-white font-black text-sm py-4 rounded-3xl cursor-pointer active:scale-95 transition-all uppercase tracking-wider"
              >
                Гаргаж Авах 🌟
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
