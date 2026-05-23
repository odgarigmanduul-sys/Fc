export interface AuraSkin {
  id: number;
  name: string;
  emoji: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary" | "Cosmic";
  price: number;
  unlocked: boolean;
  color: string; // Gradient color schema class
  glowStyle: string; // Dynamic tailwind drop-shadow/box-shadow style
  animationClass: string; // Custom keyframe animation from index.css
  desc: string;
}

// 60 Custom beautifully designed skins with ascending effects, pricing & high-dopamine themes
export function generate60Skins(): AuraSkin[] {
  // Define custom data structure to form exactly 60 distinct epic items
  const CUSTOM_SKINS_LIST: { name: string; emoji: string; rarity: AuraSkin["rarity"]; price: number; glowStyle: string; animationClass: string; desc: string }[] = [
    // --- 1-15: COMMON LEVELS (Price: 0 - 80 💎) ---
    {
      name: "Стандарт Ногоон Аура 🟢",
      emoji: "🌱",
      rarity: "Common",
      price: 0,
      glowStyle: "shadow-[0_0_10px_rgba(16,185,129,0.4)] border-emerald-500",
      animationClass: "",
      desc: "Анхны энгийн зөөлөн ногоон туяа."
    },
    {
      name: "Цэнхэр Нахиа 🔵",
      emoji: "💧",
      rarity: "Common",
      price: 25,
      glowStyle: "shadow-[0_0_10px_rgba(56,189,248,0.4)] border-sky-400",
      animationClass: "",
      desc: "Ургамал усаар тэжээгдэх мэт даруухан гэрэл."
    },
    {
      name: "Шаргал Нар ☀️",
      emoji: "☀️",
      rarity: "Common",
      price: 35,
      glowStyle: "shadow-[0_0_10px_rgba(251,191,36,0.4)] border-yellow-400",
      animationClass: "",
      desc: "Бага зэрэг дулаан шаргал өнгөт хамгаалалт."
    },
    {
      name: "Жүржийн Хальс 🍊",
      emoji: "🍊",
      rarity: "Common",
      price: 45,
      glowStyle: "shadow-[0_0_10px_rgba(249,115,22,0.4)] border-orange-400",
      animationClass: "hover:scale-105 transition-transform",
      desc: "Амин дэмээр баялаг жимслэг энерги."
    },
    {
      name: "Улаан Сэрэмж 🚨",
      emoji: "🚨",
      rarity: "Common",
      price: 50,
      glowStyle: "shadow-[0_0_10px_rgba(239,68,68,0.4)] border-red-500",
      animationClass: "",
      desc: "Аюул тохиоход нэг шатны дохио өгөх аура."
    },
    {
      name: "Мөөгний Оч 🍄",
      emoji: "🍄",
      rarity: "Common",
      price: 55,
      glowStyle: "shadow-[0_0_8px_rgba(244,63,94,0.4)] border-rose-450",
      animationClass: "animate-bounce-slow",
      desc: "Ойн зэрлэг мөөгнөөс гарах сонирхолтой хөөрөлт."
    },
    {
      name: "Шөнийн Цагаан 🌙",
      emoji: "🌙",
      rarity: "Common",
      price: 60,
      glowStyle: "shadow-[0_0_10px_rgba(224,242,254,0.4)] border-sky-100",
      animationClass: "",
      desc: "Шөнийн сарны сүүн цагаан даруухан гэрэл."
    },
    {
      name: "Нэвт харагдах Шил 🥂",
      emoji: "🥂",
      rarity: "Common",
      price: 65,
      glowStyle: "shadow-[0_0_10px_rgba(254,243,199,0.4)] border-amber-100",
      animationClass: "",
      desc: "Хангинах шил шиг хэврэг боловч гялтганана."
    },
    {
      name: "Ягаан Чихэр 🍬",
      emoji: "🍬",
      rarity: "Common",
      price: 70,
      glowStyle: "shadow-[0_0_10px_rgba(236,72,153,0.4)] border-pink-400",
      animationClass: "hover:rotate-12 transition-transform",
      desc: "Хүүхэлдэйн киноны жижиг чихрэн өнгөт аура."
    },
    {
      name: "Азтай Навч 🍀",
      emoji: "🍀",
      rarity: "Common",
      price: 75,
      glowStyle: "shadow-[0_0_10px_rgba(34,197,94,0.4)] border-green-500",
      animationClass: "",
      desc: "Дөрвөн навчит ховорхон ургамлын бэлгэдэл."
    },
    {
      name: "Интоорын Одод 🍒",
      emoji: "🍒",
      rarity: "Common",
      price: 80,
      glowStyle: "shadow-[0_0_10px_rgba(244,63,94,0.4)] border-rose-500",
      animationClass: "",
      desc: "Улаан өнгийн амтлаг жимсний зөөлөн туяа."
    },
    {
      name: "Метал дуулга 🪖",
      emoji: "🪖",
      rarity: "Common",
      price: 85,
      glowStyle: "shadow-[0_0_10px_rgba(115,115,115,0.4)] border-neutral-400",
      animationClass: "",
      desc: "Энгийн бат бөх металл хамгаалалтын хаалт."
    },
    {
      name: "Хөх Навч 🌿",
      emoji: "🌿",
      rarity: "Common",
      price: 90,
      glowStyle: "shadow-[0_0_10px_rgba(16,185,129,0.4)] border-emerald-400",
      animationClass: "",
      desc: "Тайвшруулах үйлчилгээт уламжлалт навчит бүрхүүл."
    },
    {
      name: "Энгийн Робот 🤖",
      emoji: "🤖",
      rarity: "Common",
      price: 95,
      glowStyle: "shadow-[0_0_10px_rgba(14,165,233,0.4)] border-sky-500",
      animationClass: "",
      desc: "Электрон роботын нүднээс цацрах цэнхэр гэрэл."
    },
    {
      name: "Код бичигч 📟",
      emoji: "📟",
      rarity: "Common",
      price: 100,
      glowStyle: "shadow-[0_0_10px_rgba(34,197,94,0.4)] border-green-600",
      animationClass: "animate-pulse",
      desc: "Сонгодог ногоон фонттой терминал маягийн аура."
    },

    // --- 16-30: RARE LEVELS (Price: 110 - 220 💎) ---
    {
      name: "Нил Ягаан Оч 🔮",
      emoji: "🔮",
      rarity: "Rare",
      price: 110,
      glowStyle: "shadow-[0_0_16px_#a855f7] border-purple-400",
      animationClass: "hover:scale-105 transition-transform duration-350",
      desc: "Шидэт бөмбөрцгөөс цацрах нууцлаг нил ягаан туяа."
    },
    {
      name: "Галт Бар 🐯",
      emoji: "🐯",
      rarity: "Rare",
      price: 120,
      glowStyle: "shadow-[0_0_16px_#f97316] border-orange-500",
      animationClass: "animate-pulse",
      desc: "Зэрлэг барсын сүр хүчийг агуулсан дайчин улбар шар хамгаалалт."
    },
    {
      name: "Далайн Гүн 🌊",
      emoji: "🌊",
      rarity: "Rare",
      price: 130,
      glowStyle: "shadow-[0_0_16px_#06b6d4] border-cyan-400",
      animationClass: "animate-float",
      desc: "Далайн тэнгисийн хүчит давлагаанаас ундаргатай усан аура."
    },
    {
      name: "Нарлаг Үүл ⛅",
      emoji: "⛅",
      rarity: "Rare",
      price: 140,
      glowStyle: "shadow-[0_0_16px_#facc15] border-yellow-300",
      animationClass: "animate-float",
      desc: "Баруун зүгийн нарнаас унах алтан шаргал зөөлөн сүүдэр."
    },
    {
      name: "Сүүн замын сансар 🌌",
      emoji: "🌌",
      rarity: "Rare",
      price: 150,
      glowStyle: "shadow-[0_0_20px_#8b5cf6] border-indigo-400",
      animationClass: "animate-pulse-glow",
      desc: "Од тоглох сансрын гайхамшигт нил ягаан судал."
    },
    {
      name: "Ойн Шар Шувуу 🦉",
      emoji: "🦉",
      rarity: "Rare",
      price: 160,
      glowStyle: "shadow-[0_0_16px_#e2e8f0] border-gray-350",
      animationClass: "animate-float",
      desc: "Мэргэн боловсролын бэлгэдэл болсон цагаан шар шувууны аура."
    },
    {
      name: "Кибер Сүлжээ 🌐",
      emoji: "🌐",
      rarity: "Rare",
      price: 170,
      glowStyle: "shadow-[0_0_16px_#0ea5e9] border-sky-400",
      animationClass: "animate-pulse",
      desc: "Дэлхий даяарх интернэт сүлжээний урсгалт солонго."
    },
    {
      name: "Мөсөн Хаант Улс ❄️",
      emoji: "❄️",
      rarity: "Rare",
      price: 180,
      glowStyle: "shadow-[0_0_18px_#38bdf8] border-sky-200",
      animationClass: "animate-pulse-glow",
      desc: "Гар дээр хайлахгүй сийлсэн мөсөн ширхэгт хүрээ."
    },
    {
      name: "Үлэг Гүрвэлийн Догшин Аура 🦖",
      emoji: "🦖",
      rarity: "Rare",
      price: 190,
      glowStyle: "shadow-[0_0_16px_#22c55e] border-emerald-500",
      animationClass: "hover:scale-110",
      desc: "Юрийн галавын үеийн хүчирхэг баатруудын ногоон аура."
    },
    {
      name: "Ягаан Муурны Савар 🐱",
      emoji: "🐱",
      rarity: "Rare",
      price: 200,
      glowStyle: "shadow-[0_0_16px_#ec4899] border-pink-400",
      animationClass: "animate-bounce-slow",
      desc: "Японы Кавайи анимацийн чамин хөөрхөн ягаан хэлбэр."
    },
    {
      name: "Шинэ Нинжагийн Сүүдэр 🥷",
      emoji: "🥷",
      rarity: "Rare",
      price: 210,
      glowStyle: "shadow-[0_0_16px_#3f3f46] border-zinc-650",
      animationClass: "hover:skew-x-6 transition-transform",
      desc: "Сүүдэрт нуугдан дайрах нинжагийн цэрэгжсэн догшин гэрэл."
    },
    {
      name: "Алимын Орд 🍎",
      emoji: "🍎",
      rarity: "Rare",
      price: 215,
      glowStyle: "shadow-[0_0_16px_#ef4444] border-red-500",
      animationClass: "",
      desc: "Англи хэлний сургалтын бэлгэдэл төгс улаан алим."
    },
    {
      name: "Гайхамшигийн Бөмбөг 🔮",
      emoji: "🔮",
      rarity: "Rare",
      price: 220,
      glowStyle: "shadow-[0_0_20px_#a855f7] border-purple-500",
      animationClass: "animate-pulse-glow",
      desc: "Хүүхэлдэйн киноны нууц шидэт хүчийг хуримтлуулагч."
    },
    {
      name: "Зөгийн Үүр 🐝",
      emoji: "🐝",
      rarity: "Rare",
      price: 225,
      glowStyle: "shadow-[0_0_16px_#eab308] border-yellow-500",
      animationClass: "animate-float",
      desc: "Шар хар ууртай зөгийний хөдөлгөөнт ажилсаг энергийн урсгал."
    },
    {
      name: "Мөнгөн Ирмэг 🗡️",
      emoji: "🗡️",
      rarity: "Rare",
      price: 230,
      glowStyle: "shadow-[0_0_16px_#cbd5e1] border-slate-300",
      animationClass: "hover:scale-105",
      desc: "Хурц үзүүрт мөнгөн илдний аюултай сэрүүн тусгал."
    },

    // --- 31-45: EPIC LEVELS (Price: 240 - 450 💎) (Vivid glow, Lightning/Cartoon bounce) ---
    {
      name: "Галт Фениксийн жигүүр 🔥🦅",
      emoji: "🦅",
      rarity: "Epic",
      price: 250,
      glowStyle: "shadow-[0_0_22px_#ef4444] border-red-500 ring-2 ring-red-400",
      animationClass: "animate-bounce-slow",
      desc: "Үнсэн дороос дахин төрөн асах Галт Фениксийн далавч!"
    },
    {
      name: "Электро-Цохилт ⚡⚡",
      emoji: "⚡",
      rarity: "Epic",
      price: 270,
      glowStyle: "shadow-[0_0_24px_#3b82f6] border-sky-400 ring-2 ring-blue-300",
      animationClass: "animate-lightning-aura",
      desc: "Доргио уур амьсгал оруулах өндөр хүчдэлийн цахилгаан урсгал."
    },
    {
      name: "Галзуу Рок Хамтлаг 🎸",
      emoji: "🎸",
      rarity: "Epic",
      price: 290,
      glowStyle: "shadow-[0_0_20px_#f43f5e] border-rose-500 ring-2 ring-rose-400/40",
      animationClass: "animate-pulse-glow",
      desc: "Неон улаан гэрэлтэлттэй, тайзыг эзэгнэсэн рок дуучны сүр сүлд."
    },
    {
      name: "Ногоон Матриц 🧬",
      emoji: "🐸",
      rarity: "Epic",
      price: 310,
      glowStyle: "shadow-[0_0_22px_#10b981] border-emerald-500 ring-2 ring-emerald-300",
      animationClass: "animate-lightning-aura",
      desc: "Картүүн киноны хортой химийн бодисонд орсон мэт неон ногоон гэрэл."
    },
    {
      name: "Ган Самурайн Илдэн Хаалт ⚔️",
      emoji: "⚔️",
      rarity: "Epic",
      price: 335,
      glowStyle: "shadow-[0_0_20px_#64748b] border-slate-400 ring-2 ring-slate-350",
      animationClass: "animate-pulse",
      desc: "Самурай хүний ган бүрхүүл, ирмэгэнд буусан цагаан хаалт."
    },
    {
      name: "Тамын Галт Уул 🌋",
      emoji: "🌋",
      rarity: "Epic",
      price: 350,
      glowStyle: "shadow-[0_0_25px_#ea580c] border-orange-600 ring-2 ring-orange-400",
      animationClass: "animate-bounce-slow",
      desc: "Ууртай хүрхрэх лаав, улбар шар утаат гайхалтай энерги."
    },
    {
      name: "Кибернетик Нарийн Код ⚡💻",
      emoji: "💻",
      rarity: "Epic",
      price: 370,
      glowStyle: "shadow-[0_0_22px_#06b6d4] border-cyan-400 ring-2 ring-cyan-200",
      animationClass: "animate-lightning-aura",
      desc: "Системийн ухаалаг кибер аюулгүй байдлын гэрлүүд."
    },
    {
      name: "Ганц Оврын Чоно 🐺",
      emoji: "🐺",
      rarity: "Epic",
      price: 390,
      glowStyle: "shadow-[0_0_20px_#94a3b8] border-slate-500 ring-2 ring-slate-400/50",
      animationClass: "animate-float",
      desc: "Аниме догшин баатрын ганцаардмал, сүрлэг саарал чонон хамгаалалт."
    },
    {
      name: "Поп Картүүн Оч 🌠",
      emoji: "🎨",
      rarity: "Epic",
      price: 410,
      glowStyle: "shadow-[0_0_24px_#ec4899] border-pink-500 ring-2 ring-pink-300",
      animationClass: "animate-bounce-slow",
      desc: "Релакс уран зургийн поп угаалгад автах чамин ягаан туяа."
    },
    {
      name: "Сүнсний Түлхүүр 🔑",
      emoji: "🔑",
      rarity: "Epic",
      price: 420,
      glowStyle: "shadow-[0_0_20px_#fbbf24] border-amber-400 ring-2 ring-yellow-300",
      animationClass: "animate-float",
      desc: "Эртний сүнсэн дуудлагат алтан шар хамгаалагч түлхүүр."
    },
    {
      name: "Дулгын Хаан Медуза 👾",
      emoji: "👾",
      rarity: "Epic",
      price: 430,
      glowStyle: "shadow-[0_0_22px_#8b5cf6] border-purple-500 ring-2 ring-purple-300",
      animationClass: "animate-pulse-glow",
      desc: "Аркад тоглоомын хуучны сүнслэг неон ягаан дайсан."
    },
    {
      name: "Намрын Цахилгаан Шуурга ⚡🍂",
      emoji: "🍂",
      rarity: "Epic",
      price: 435,
      glowStyle: "shadow-[0_0_22px_#b45309] border-amber-700 ring-2 ring-amber-500/50",
      animationClass: "animate-float",
      desc: "Хөх хуй салхи, алтан шаргал навчсын ширүүн бүжиг."
    },
    {
      name: "Дагинасын Шүршигч 🪄",
      emoji: "🪄",
      rarity: "Epic",
      price: 440,
      glowStyle: "shadow-[0_0_24px_#ec4899] border-fuchsia-400 ring-2 ring-fuchsia-300/60",
      animationClass: "animate-float",
      desc: "Шидэт саваагаар үлээх цагаан ягаан дагинас аура."
    },
    {
      name: "Тархины Хэт Хүч 🧠",
      emoji: "🧠",
      rarity: "Epic",
      price: 445,
      glowStyle: "shadow-[0_0_24px_#38bdf8] border-sky-400 ring-2 ring-sky-300/70",
      animationClass: "animate-pulse-glow",
      desc: "Сэтгэн бодох сорилтыг 10 дахин өсгөх ухаалаг аура."
    },
    {
      name: "Кибер-Трансформер 🦖💻",
      emoji: "⚙️",
      rarity: "Epic",
      price: 450,
      glowStyle: "shadow-[0_0_25px_#f43f5e] border-rose-650 ring-2 ring-rose-500",
      animationClass: "animate-lightning-aura",
      desc: "Роботын мета трансформацийн хурц улаан неон хүрээ."
    },

    // --- 46-55: LEGENDARY LEVELS (Price: 500 - 850 💎) (Super Saiyan Golden Flare & Anime Sagas) ---
    {
      name: "Сөнөөгч Лууны Галт Аура 🐉 (Super Saiyan)",
      emoji: "🐉",
      rarity: "Legendary",
      price: 520,
      glowStyle: "shadow-[0_0_35px_#f59e0b] border-yellow-500 ring-4 ring-orange-500/60 ring-offset-1 ring-offset-zinc-950",
      animationClass: "animate-super-saiyan",
      desc: "Драгон Бол анимийн домогт асар хүчит шар алтан галын догшин флэйр!"
    },
    {
      name: "Шиноби Самурайн Шаринган 👁️🩸 (Sharingan)",
      emoji: "🥷",
      rarity: "Legendary",
      price: 550,
      glowStyle: "shadow-[0_0_35px_#ef4444] border-red-650 ring-4 ring-rose-600/80 ring-offset-1 ring-offset-zinc-950",
      animationClass: "animate-super-saiyan",
      desc: "Наруто анимийн Учиха овгийн хамгийн цуут улаан догшин нүдний гэрэлтэлт!"
    },
    {
      name: "Цуутай Наруто Кюби Кий 🔥🦊 (Ninetails)",
      emoji: "🦊",
      rarity: "Legendary",
      price: 590,
      glowStyle: "shadow-[0_0_40px_#f97316] border-orange-500 ring-4 ring-yellow-400 ring-offset-2 ring-offset-neutral-900",
      animationClass: "animate-super-saiyan",
      desc: "Есөн сүүлт үнэгний догшин лаав шиг уур хилэн, алтан хамгаалалт!"
    },
    {
      name: "Солонгос К-Поп Идол 💖👑",
      emoji: "👑",
      rarity: "Legendary",
      price: 640,
      glowStyle: "shadow-[0_0_35px_#ec4899] border-pink-400 ring-4 ring-fuchsia-400/70",
      animationClass: "animate-pulse duration-500",
      desc: "Поп тайзыг орвонгоор нь хувиргах гайхамшигт ягаан зүрхэн сүлд."
    },
    {
      name: "Алтан Тэнгэрийн Арслан 🦁🏆 (Golden Lion)",
      emoji: "🦁",
      rarity: "Legendary",
      price: 680,
      glowStyle: "shadow-[0_0_35px_#d97706] border-amber-500 ring-4 ring-yellow-400 ring-offset-1",
      animationClass: "animate-super-saiyan",
      desc: "Ялагчийн хамгийн эрхэмсэг, сүр хүчит догшин алтан арслангийн аура."
    },
    {
      name: "Шидэт Талст Магистр 🔮🧙",
      emoji: "🧙",
      rarity: "Legendary",
      price: 720,
      glowStyle: "shadow-[0_0_32px_#8b5cf6] border-indigo-500 ring-4 ring-purple-400",
      animationClass: "animate-pulse-glow",
      desc: "Дайны үеийн ахмад шидтэнүүдийн элч нил ягаан судар хаалт."
    },
    {
      name: "Очир Эрдэнийн Хаан Орой 💎💫",
      emoji: "💎",
      rarity: "Legendary",
      price: 760,
      glowStyle: "shadow-[0_0_40px_#38bdf8] border-cyan-400 ring-4 ring-sky-300 ring-offset-2 ring-offset-black",
      animationClass: "animate-float",
      desc: "Эвдэршгүй бат бөх цэнхэр талст очир алмазын аура!"
    },
    {
      name: "Үхлийн Соул Слейер ⚡💀",
      emoji: "💀",
      rarity: "Legendary",
      price: 800,
      glowStyle: "shadow-[0_0_35px_#4b5563] border-zinc-500 ring-4 ring-red-500/60 ring-offset-1 ring-offset-zinc-950",
      animationClass: "animate-lightning-aura",
      desc: "Сүнс хураагч нарын хамгийн аюултай хар саарал аянгат цацрал."
    },
    {
      name: "Кибер-Самурай Сакура ⚔️🌸",
      emoji: "🌸",
      rarity: "Legendary",
      price: 830,
      glowStyle: "shadow-[0_0_35px_#ec4899] border-pink-400 ring-4 ring-cyan-450",
      animationClass: "animate-super-saiyan",
      desc: "Сакура цэцэг унах мэт нууц неон ягаан аниме дайчин."
    },
    {
      name: "Үнэмлэхүй Зевс Хаан ⚡🌩️ (Thunder God)",
      emoji: "🌩️",
      rarity: "Legendary",
      price: 850,
      glowStyle: "shadow-[0_0_45px_#3b82f6] border-white ring-4 ring-amber-400 ring-offset-2 ring-offset-black",
      animationClass: "animate-super-saiyan",
      desc: "Тэнгэрийн оройн Зевс бурхны хурц сийчих цагаан алтан аянга!"
    },

    // --- 56-60: COSMIC ULTIMATE LEVELS (Price: 900 - 1500 💎) (Avatar state, Celestial shift, Luffy Gear 5 cosmic) ---
    {
      name: "Бурханлиг Аватар Төлөв 🌀 (Avatar State)",
      emoji: "🌪️",
      rarity: "Cosmic",
      price: 950,
      glowStyle: "shadow-[0_0_55px_#ffffff] border-cyan-350 ring-4 ring-cyan-400/80 ring-offset-3 ring-offset-neutral-950",
      animationClass: "animate-avatar-state",
      desc: "Хүүхэлдэйн киноны дөрвөн махбодыг эзэмшсэн Бурханлиг Аватарын сүүн цагаан аура!"
    },
    {
      name: "Лүүфи Gear 5 Сүнс ☁️🥊 (Luffy Gear 5)",
      emoji: "🥊",
      rarity: "Cosmic",
      price: 1100,
      glowStyle: "shadow-[0_0_55px_#fca5a5] border-white ring-4 ring-purple-300 ring-offset-3 ring-offset-indigo-950",
      animationClass: "animate-avatar-state",
      desc: "One Piece анимийн Нарны бурхан Ника төлөвт хувирах чөлөөт цагаан үүлс!"
    },
    {
      name: "Бурхан Судар: Домэйн Илчлэлт 🌌 (Domain Expansion)",
      emoji: "🌌",
      rarity: "Cosmic",
      price: 1250,
      glowStyle: "shadow-[0_0_60px_#c084fc] border-white ring-4 ring-fuchsia-500 ring-offset-3 ring-offset-zinc-950",
      animationClass: "animate-cosmic-shift",
      desc: "Огторгуйн орон зайн туйлын хүршгүй бурханлиг хүчирхийлэгч неон ягаан урсгал!"
    },
    {
      name: "Муген Цукуёми Саран Аура 🔮🌙 (Infinite Tsukuyomi)",
      emoji: "🔮",
      rarity: "Cosmic",
      price: 1400,
      glowStyle: "shadow-[0_0_60px_#ec4899] border-red-500 ring-4 ring-pink-500/90 ring-offset-3 ring-offset-black",
      animationClass: "animate-cosmic-shift",
      desc: "Төгсгөлгүй зүүдний улаан сарны нөлөөт хамгийн дээд зэрэглэлийн аниме сүлд!"
    },
    {
      name: "Дээд Одот Сансрын Эзэн 👑🌌 (Cosmic Overlord)",
      emoji: "🛸",
      rarity: "Cosmic",
      price: 1500,
      glowStyle: "shadow-[0_0_75px_rgba(236,72,153,1)] border-white ring-4 ring-cyan-300/90 ring-offset-4 ring-offset-neutral-950 border border-white/60",
      animationClass: "animate-rainbow-glow",
      desc: "60 аураны хамгийн дээд оргил! Солонгорон гэрэлтэх, анивчих, сансар огторгуйн бурхны аура!"
    }
  ];

  // Return exactly 60 items combining our custom design structure & filler entries safely
  const skins: AuraSkin[] = [];
  
  for (let i = 1; i <= 60; i++) {
    // If we have custom designed meta, load it!
    const customMeta = CUSTOM_SKINS_LIST[i - 1];
    
    if (customMeta) {
      skins.push({
        id: i,
        name: customMeta.name,
        emoji: customMeta.emoji,
        rarity: customMeta.rarity,
        price: customMeta.price,
        unlocked: i === 1, // unlocked for #1 basic
        color: customMeta.rarity === 'Cosmic' ? 'from-fuchsia-500 via-rose-500 to-cyan-400' :
               customMeta.rarity === 'Legendary' ? 'from-amber-400 to-orange-500' :
               customMeta.rarity === 'Epic' ? 'from-rose-500 to-pink-600' :
               customMeta.rarity === 'Rare' ? 'from-indigo-400 to-purple-600' : 'from-emerald-400 to-green-600',
        glowStyle: customMeta.glowStyle,
        animationClass: customMeta.animationClass,
        desc: customMeta.desc
      });
    } else {
      // Emergency Fallback if somehow array bounds shift
      skins.push({
        id: i,
        name: `Хожлын Сүлд Чип #${i} 🌟`,
        emoji: "🌟",
        rarity: "Common",
        price: 10 + i * 5,
        unlocked: false,
        color: "from-emerald-400 to-green-600",
        glowStyle: "shadow-[0_0_10px_#10b981]",
        animationClass: "",
        desc: "Нэмэлт картүүн хамгаалалтын оч."
      });
    }
  }

  return skins;
}
