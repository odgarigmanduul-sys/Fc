import { Unit, LeaderboardItem } from './types';

// Vocabulary words and Sentences lists for each of the 20 Units
interface RawUnitData {
  id: number;
  name: string;
  icon: string;
  color: string;
  colorDark: string;
  colorPale: string;
  vocab: { eng: string; mn: string; emoji: string }[];
  sentences: { eng: string; mn: string }[];
}

const RAW_UNITS: RawUnitData[] = [
  {
    id: 1,
    name: "Англи цагаан толгой ба авиа зүй",
    icon: "🌱",
    color: "#58cc02",
    colorDark: "#46a302",
    colorPale: "#d7ffb8",
    vocab: [
      { eng: "Apple", mn: "Алим", emoji: "🍎" },
      { eng: "Book", mn: "Ном", emoji: "📖" },
      { eng: "Cat", mn: "Муур", emoji: "🐱" },
      { eng: "Dog", mn: "Нохой", emoji: "🐶" },
      { eng: "Egg", mn: "Өндөг", emoji: "🥚" },
      { eng: "Fish", mn: "Загас", emoji: "🐟" },
      { eng: "House", mn: "Байшин", emoji: "🏠" },
      { eng: "Ice", mn: "Мөс", emoji: "❄️" },
      { eng: "Juice", mn: "Жүүс", emoji: "🥤" },
      { eng: "Sun", mn: "Нар", emoji: "☀️" }
    ],
    sentences: [
      { eng: "This is an apple", mn: "Энэ бол алим." },
      { eng: "I see a cat", mn: "Би муур харж байна." },
      { eng: "She has a book", mn: "Түүнд ном бий." },
      { eng: "We like the dog", mn: "Бидэнд нохой таалагддаг." },
      { eng: "This is a house", mn: "Энэ бол байшин." }
    ]
  },
  {
    id: 2,
    name: "Үндсэн мэндчилгээ ба Харилцан яриа",
    icon: "👋",
    color: "#1cb0f6",
    colorDark: "#1899d6",
    colorPale: "#ddf4ff",
    vocab: [
      { eng: "Hello", mn: "Сайн уу", emoji: "👋" },
      { eng: "Goodbye", mn: "Баяртай", emoji: "🏃" },
      { eng: "Thank you", mn: "Багш аа баярлалаа", emoji: "🙏" },
      { eng: "Please", mn: "Гуйя", emoji: "🥺" },
      { eng: "Friend", mn: "Найз", emoji: "🤝" },
      { eng: "Welcome", mn: "Тавтай морилно уу", emoji: "✨" },
      { eng: "Yes", mn: "Тийм", emoji: "🟢" },
      { eng: "No", mn: "Үгүй", emoji: "🔴" }
    ],
    sentences: [
      { eng: "My name is Sara", mn: "Миний нэрийг Сара гэдэг." },
      { eng: "Nice to meet you", mn: "Чамтай уулзсандаа таатай байна." },
      { eng: "How are you today", mn: "Чи өнөөдөр хэр байна вэ?" },
      { eng: "I am fine thank you", mn: "Би сайн байна, баярлалаа." }
    ]
  },
  {
    id: 3,
    name: "Анхны тоонууд ба Тоолох арга зүй",
    icon: "🔢",
    color: "#ffc107",
    colorDark: "#ca9100",
    colorPale: "#fff6d6",
    vocab: [
      { eng: "One", mn: "Нэг", emoji: "1️⃣" },
      { eng: "Two", mn: "Хоёр", emoji: "2️⃣" },
      { eng: "Three", mn: "Гурав", emoji: "3️⃣" },
      { eng: "Four", mn: "Дөрөв", emoji: "4️⃣" },
      { eng: "Five", mn: "Тав", emoji: "5️⃣" },
      { eng: "Ten", mn: "Арав", emoji: "🔟" },
      { eng: "Hundred", mn: "Зуу", emoji: "💯" },
      { eng: "Many", mn: "Олон", emoji: "📊" }
    ],
    sentences: [
      { eng: "I have two dogs", mn: "Надад хоёр нохой бий." },
      { eng: "She is five years old", mn: "Тэр таван настай." },
      { eng: "We see ten stars", mn: "Бид арван од харж байна." },
      { eng: "He has three books", mn: "Түүнд гурван ном бий." }
    ]
  },
  {
    id: 4,
    name: "Гэр бүл ба Ойр дотны хүмүүс",
    icon: "🏠",
    color: "#ff82ff",
    colorDark: "#e157e1",
    colorPale: "#ffe6ff",
    vocab: [
      { eng: "Mother", mn: "Ээж", emoji: "👩" },
      { eng: "Father", mn: "Аав", emoji: "👨" },
      { eng: "Sister", mn: "Эгч эсвэл эмэгтэй дүү", emoji: "👧" },
      { eng: "Brother", mn: "Ах эсвэл эрэгтэй дүү", emoji: "👦" },
      { eng: "Baby", mn: "Нялх хүүхэд", emoji: "👶" },
      { eng: "Grandfather", mn: "Өвөө", emoji: "👴" },
      { eng: "Grandmother", mn: "Эмээ", emoji: "👵" },
      { eng: "Family", mn: "Гэр бүл", emoji: "👪" }
    ],
    sentences: [
      { eng: "This is my mother", mn: "Энэ бол миний ээж." },
      { eng: "He loves his family", mn: "Тэр гэр бүлдээ хайртай." },
      { eng: "Do you have a brother", mn: "Чамд ах эсвэл эрэгтэй дүү бий юу?" },
      { eng: "My sister is young", mn: "Миний эмэгтэй дүү залуухан настай." }
    ]
  },
  {
    id: 5,
    name: "Өнгөнүүд ба Дүрс харьцаанууд",
    icon: "🎨",
    color: "#22c55e",
    colorDark: "#15803d",
    colorPale: "#dcfce7",
    vocab: [
      { eng: "Red", mn: "Улаан өнгө", emoji: "🔴" },
      { eng: "Blue", mn: "Усан цэнхэр", emoji: "🔵" },
      { eng: "Green", mn: "Ногоон өнгө", emoji: "🟢" },
      { eng: "Yellow", mn: "Шар өнгө", emoji: "🟡" },
      { eng: "Black", mn: "Хар өнгө", emoji: "⚫" },
      { eng: "White", mn: "Цагаан өнгө", emoji: "⚪" },
      { eng: "Orange", mn: "Улбар шар өнгө", emoji: "🟠" },
      { eng: "Circle", mn: "Дугуй дүрс", emoji: "⭕" }
    ],
    sentences: [
      { eng: "The sky is blue", mn: "Тэнгэр цэнхэр байна." },
      { eng: "I like red apples", mn: "Би улаан алиманд дуртай." },
      { eng: "Green grass is beautiful", mn: "Ногоон өвс үзэсгэлэнтэй үзэгдэнэ." },
      { eng: "A circle is round", mn: "Дугуй дүрс дув дугуй байдаг." }
    ]
  },
  {
    id: 6,
    name: "Гэр орон ба Эргэн тойрон уур амьсгал",
    icon: "🛋️",
    color: "#ce82ff",
    colorDark: "#a855f7",
    colorPale: "#f3e8ff",
    vocab: [
      { eng: "Table", mn: "Ширээ", emoji: "🧱" },
      { eng: "Chair", mn: "Сандал", emoji: "🪑" },
      { eng: "Bed", mn: "Ор сав", emoji: "🛏️" },
      { eng: "Door", mn: "Хаалга", emoji: "🚪" },
      { eng: "Window", mn: "Цонх", emoji: "🪟" },
      { eng: "Key", mn: "Түлхүүр", emoji: "🔑" },
      { eng: "Room", mn: "Өрөө", emoji: "🏡" },
      { eng: "Kitchen", mn: "Гал тогоо", emoji: "🍳" }
    ],
    sentences: [
      { eng: "The door is open", mn: "Хаалга нээлттэй байна." },
      { eng: "We live in a big house", mn: "Бид том байшинд амьдардаг." },
      { eng: "My key is on the table", mn: "Миний түлхүүр ширээн дээр байна." },
      { eng: "This is a clean room", mn: "Энэ бол цэвэрхэн өрөө." }
    ]
  },
  {
    id: 7,
    name: "Түгээмэл амтлаг хоол хүнс ба ундаа",
    icon: "🍎",
    color: "#f97316",
    colorDark: "#c2410c",
    colorPale: "#ffedd5",
    vocab: [
      { eng: "Water", mn: "Ус мөрөн", emoji: "💧" },
      { eng: "Bread", mn: "Талх таваг", emoji: "🍞" },
      { eng: "Milk", mn: "Сүү цагаан", emoji: "🥛" },
      { eng: "Rice", mn: "Будаг будаа", emoji: "🍚" },
      { eng: "Meat", mn: "Мах хүнс", emoji: "🥩" },
      { eng: "Tea", mn: "Цай ундаа", emoji: "🍵" },
      { eng: "Fruit", mn: "Жимс амтат", emoji: "🍎" },
      { eng: "Cheese", mn: "Бяслаг шар", emoji: "🧀" }
    ],
    sentences: [
      { eng: "I drink cold water", mn: "Би хүйтэн ус уудаг." },
      { eng: "She eats white bread", mn: "Тэр цагаан талх иддэг." },
      { eng: "Would you like tea", mn: "Та цай уух уу?" },
      { eng: "Rice is good food", mn: "Будаа бол сайн хоол." }
    ]
  },
  {
    id: 8,
    name: "Биеийн эрхтэн ба Нарийн эрүүл мэнд",
    icon: "💪",
    color: "#ef4444",
    colorDark: "#b91c1c",
    colorPale: "#fee2e2",
    vocab: [
      { eng: "Head", mn: "Толгой", emoji: "🧠" },
      { eng: "Eye", mn: "Нүд", emoji: "👁️" },
      { eng: "Hand", mn: "Гар", emoji: "✋" },
      { eng: "Leg", mn: "Хөл хөшүүн", emoji: "🦵" },
      { eng: "Mouth", mn: "Ам", emoji: "👄" },
      { eng: "Body", mn: "Бие эрхтэн", emoji: "🧍" },
      { eng: "Sleep", mn: "Унтаж амрах", emoji: "😴" },
      { eng: "Healthy", mn: "Эрүүл энх", emoji: "🩺" }
    ],
    sentences: [
      { eng: "Touch your head now", mn: "Толгойдоо одоо хүр." },
      { eng: "Wash your hands clean", mn: "Гараа цэвэрхэн угаа." },
      { eng: "I have two eyes", mn: "Надад хоёр нүд бий." },
      { eng: "Sleep is good for you", mn: "Унтах нь танд ач тустай." }
    ]
  },
  {
    id: 9,
    name: "Амьтны ерөнхий ертөнц ба Ой тойрон",
    icon: "🦁",
    color: "#eab308",
    colorDark: "#a16207",
    colorPale: "#fef9c3",
    vocab: [
      { eng: "Lion", mn: "Арслан", emoji: "🦁" },
      { eng: "Bird", mn: "Шувуухай", emoji: "🐦" },
      { eng: "Horse", mn: "Морин толгой", emoji: "🐎" },
      { eng: "Cow", mn: "Үхэр мал", emoji: "🐄" },
      { eng: "Sheep", mn: "Сүргийн хонь", emoji: "🐏" },
      { eng: "Fox", mn: "Шар үнэг", emoji: "🦊" },
      { eng: "Fish", mn: "Амьд загас", emoji: "🐟" },
      { eng: "Bear", mn: "Хүрэн баавгай", emoji: "🐻" }
    ],
    sentences: [
      { eng: "The lion is strong", mn: "Арслан бол хүчтэй амьтан." },
      { eng: "Birds can fly high", mn: "Шувууд өндөрт нисэж чадна." },
      { eng: "He rides a horse", mn: "Тэр морь унадаг." },
      { eng: "A small sheep lives here", mn: "Багахан хонь энд амьдардаг." }
    ]
  },
  {
    id: 10,
    name: "Баялаг цаг хугацаа ба Цаг агаарын хуудас",
    icon: "⏰",
    color: "#06b6d4",
    colorDark: "#0e7490",
    colorPale: "#cffafe",
    vocab: [
      { eng: "Day", mn: "Өдрийн цаг", emoji: "☀️" },
      { eng: "Night", mn: "Шөнийн цаг", emoji: "🌙" },
      { eng: "Today", mn: "Өнөөдөр", emoji: "📅" },
      { eng: "Year", mn: "Жил хугацаа", emoji: "🗓️" },
      { eng: "Sun", mn: "Нар шар", emoji: "☀️" },
      { eng: "Rain", mn: "Цас бороо", emoji: "🌧" },
      { eng: "Snow", mn: "Цагаан цас", emoji: "❄️" },
      { eng: "Wind", mn: "Салхи шуурга", emoji: "💨" }
    ],
    sentences: [
      { eng: "Today is a sunny day", mn: "Өнөөдөр нарлаг өдөр байна." },
      { eng: "I love the summer rain", mn: "Би зуны бороонд дуртай." },
      { eng: "The wind is very cold", mn: "Салхи маш хүйтэн байна." },
      { eng: "We sleep at night", mn: "Бид шөнө унтдаг." }
    ]
  },
  {
    id: 11,
    name: "Үйл үгс, Анхны идэвхтэй хөдөлгөөнүүд",
    icon: "🏃",
    color: "#d946ef",
    colorDark: "#a21caf",
    colorPale: "#fdf4ff",
    vocab: [
      { eng: "Run", mn: "Гүйж харайх", emoji: "🏃" },
      { eng: "Walk", mn: "Алхаж явах", emoji: "🚶" },
      { eng: "Read", mn: "Ном унших", emoji: "📖" },
      { eng: "Write", mn: "Бичиж тэмдэглэх", emoji: "✍️" },
      { eng: "Speak", mn: "Ярьж хэлэх", emoji: "🗣️" },
      { eng: "Jump", mn: "Дээшээ үсрэх", emoji: "🦘" },
      { eng: "Sing", mn: "Дуулж хөгжимдөх", emoji: "🎤" },
      { eng: "Play", mn: "Тоглож наадах", emoji: "🎮" }
    ],
    sentences: [
      { eng: "I like to run fast", mn: "Би хурдан гүйх дуртай." },
      { eng: "She reads a new book", mn: "Тэр шинэ ном уншиж байна." },
      { eng: "They sing a nice song", mn: "Тэд сайхан дуу дуулж байна." },
      { eng: "Can you write this letter", mn: "Та энэ захидал бичиж чадах уу?" }
    ]
  },
  {
    id: 12,
    name: "Аялал жуулчлал ба Чиглэл заах уриа",
    icon: "🚗",
    color: "#3b82f6",
    colorDark: "#1d4ed8",
    colorPale: "#dbeafe",
    vocab: [
      { eng: "Car", mn: "Суудлын машин", emoji: "🚗" },
      { eng: "Bus", mn: "Нийтийн автобус", emoji: "🚌" },
      { eng: "Plane", mn: "Нисэх онгоц", emoji: "✈️" },
      { eng: "Road", mn: "Хатуу хучилттай зам", emoji: "🛣️" },
      { eng: "Map", mn: "Газрын зураг", emoji: "🗺️" },
      { eng: "Stop", mn: "Түр зогсолт", emoji: "🛑" },
      { eng: "Go", mn: "Урагшаа явах", emoji: "🟢" },
      { eng: "Train", mn: "Галт тэрэг хурдан", emoji: "🚆" }
    ],
    sentences: [
      { eng: "I go by plane", mn: "Би онгоцоор явдаг." },
      { eng: "Where is the bus stop", mn: "Автобусны буудал хаана байна вэ?" },
      { eng: "This road is very long", mn: "Энүүгээр зам маш урт байна." },
      { eng: "Drive the car slowly", mn: "Машиныг аажуухан унаарай." }
    ]
  },
  {
    id: 13,
    name: "Ажил мэргэжил ба Сургуулийн амьдрал",
    icon: "💼",
    color: "#14b8a6",
    colorDark: "#0f766e",
    colorPale: "#ccfbf1",
    vocab: [
      { eng: "Doctor", mn: "Хүний эмч", emoji: "🧑‍⚕️" },
      { eng: "Teacher", mn: "Багш сурган", emoji: "🧑‍🏫" },
      { eng: "Student", mn: "Оюутан сурагч", emoji: "🧑‍🎓" },
      { eng: "School", mn: "Дунд сургууль", emoji: "🏫" },
      { eng: "Work", mn: "Ажил хийх", emoji: "💼" },
      { eng: "Job", mn: "Хөдөлмөр эрхлэлт", emoji: "🛠️" },
      { eng: "Office", mn: "Ажлын оффис", emoji: "🏢" },
      { eng: "Class", mn: "Сургалтын анги", emoji: "🏫" }
    ],
    sentences: [
      { eng: "My mother is a doctor", mn: "Миний ээж бол эмч." },
      { eng: "I study at school", mn: "Би сургуульд сурдаг." },
      { eng: "She goes to work early", mn: "Тэр ажилдаа эрт явдаг." },
      { eng: "The teacher is very kind", mn: "Багш маш эелдэг байна." }
    ]
  },
  {
    id: 14,
    name: "Хувцас хэрэглэл, Загвар ба Төрх",
    icon: "👕",
    color: "#a855f7",
    colorDark: "#7e22ce",
    colorPale: "#f3e8ff",
    vocab: [
      { eng: "Shirt", mn: "Цамц өмсөх", emoji: "👕" },
      { eng: "Pants", mn: "Урт өмд", emoji: "👖" },
      { eng: "Shoes", mn: "Хөлийн гутал", emoji: "👟" },
      { eng: "Hat", mn: "Толгойн малгай", emoji: "🎩" },
      { eng: "Coat", mn: "Дулаан хүрэм", emoji: "🧥" },
      { eng: "Bag", mn: "Цүнх сав", emoji: "🎒" },
      { eng: "Dress", mn: "Эмэгтэй даашинз", emoji: "👗" },
      { eng: "Ring", mn: "Гар бөгж", emoji: "💍" }
    ],
    sentences: [
      { eng: "I wear a warm coat", mn: "Би дулаан хүрэм өмсдөг." },
      { eng: "Her shoes are black", mn: "Түүний гутал хар өнгөтэй байна." },
      { eng: "This bag is very heavy", mn: "Энэ цүнх маш хүнд байна." },
      { eng: "He lost his gold ring", mn: "Тэр алтан бөгжөө гээчихжээ." }
    ]
  },
  {
    id: 15,
    name: "Дэлгүүр хэсэх, Үнэ ханш ба Эдийн засаг",
    icon: "🛒",
    color: "#f43f5e",
    colorDark: "#be123c",
    colorPale: "#ffe4e6",
    vocab: [
      { eng: "Money", mn: "Мөнгө санхүү", emoji: "💵" },
      { eng: "Price", mn: "Үнэ өртөг", emoji: "🏷️" },
      { eng: "Buy", mn: "Худалдаж авах", emoji: "🛍️" },
      { eng: "Shop", mn: "Үйлчилгээний дэлгүүр", emoji: "🏪" },
      { eng: "Cheap", mn: "Хямдхан хэмнэлттэй", emoji: "📉" },
      { eng: "Expensive", mn: "Их үнэтэй", emoji: "📈" },
      { eng: "Pay", mn: "Төлбөр төлөх", emoji: "💳" },
      { eng: "Cost", mn: "Борлуулах өртөг", emoji: "💰" }
    ],
    sentences: [
      { eng: "How much does this cost", mn: "Энэ ямар үнэтэй вэ?" },
      { eng: "I want to buy shoes", mn: "Би гутал худалдаж авмаар байна." },
      { eng: "This luxury coat is expensive", mn: "Энэ тансаг хүрэм үнэтэй байна." },
      { eng: "Can I pay with cash", mn: "Би бэлэн мөнгөөр төлж болох уу?" }
    ]
  },
  {
    id: 16,
    name: "Улс орон, Хэл соёл ба Дэлхий дахин",
    icon: "🌍",
    color: "#6366f1",
    colorDark: "#4338ca",
    colorPale: "#e0e7ff",
    vocab: [
      { eng: "World", mn: "Дэлхий ертөнц", emoji: "🌍" },
      { eng: "Country", mn: "Эх орон улс", emoji: "🏳️" },
      { eng: "Language", mn: "Хэл яриа харилцаа", emoji: "🗣️" },
      { eng: "City", mn: "Нийслэл хот", emoji: "🏙️" },
      { eng: "Mountain", mn: "Өндөр уул", emoji: "🏔️" },
      { eng: "River", mn: "Түрхэрч урсах гол", emoji: "🌊" },
      { eng: "Sea", mn: "Цэнхэр далай", emoji: "🌊" },
      { eng: "Earth", mn: "Хөрс газар шороо", emoji: "🌎" }
    ],
    sentences: [
      { eng: "English is a world language", mn: "Англи хэл бол дэлхийн хэл юм." },
      { eng: "Mongolia is my country", mn: "Монгол бол миний эх орон." },
      { eng: "He climbs the high mountain", mn: "Тэр өндөр ууланд авирдаг." },
      { eng: "I live in a big city", mn: "Би том хотод амьдардаг." }
    ]
  },
  {
    id: 17,
    name: "Чөлөөт цаг, Наадам заах Спорт ба Хобби",
    icon: "⚽",
    color: "#84cc16",
    colorDark: "#4d7c0f",
    colorPale: "#ecfccb",
    vocab: [
      { eng: "Sport", mn: "Биеийн тамир спорт", emoji: "⚽" },
      { eng: "Ball", mn: "Дугуй бөмбөг", emoji: "⚽" },
      { eng: "Game", mn: "Интерактив тоглоом", emoji: "🎮" },
      { eng: "Music", mn: "Аялгуу хөгжим", emoji: "🎵" },
      { eng: "Movie", mn: "Дэлгэцийн кино", emoji: "🎬" },
      { eng: "Book", mn: "Түүхт уран зохиол ном", emoji: "📚" },
      { eng: "Run", mn: "Хурдан гүйлт", emoji: "🏃" },
      { eng: "Jump", mn: "Урт үсрэлт", emoji: "🦘" }
    ],
    sentences: [
      { eng: "I play computer games", mn: "Би компьютерийн тоглоом тоглодог." },
      { eng: "She listens to soft music", mn: "Тэр зөөлөн хөгжим сонсдог." },
      { eng: "We watch a comedy movie", mn: "Бид инээдмийн кино үзэж байна." },
      { eng: "Football is my favorite sport", mn: "Хөлбөмбөг бол миний дуртай спорт." }
    ]
  },
  {
    id: 18,
    name: "Тэмдэг нэрс ба Сэтгэл хөдлөл мэдрэмж",
    icon: "😄",
    color: "#ec4899",
    colorDark: "#be185d",
    colorPale: "#fce7f3",
    vocab: [
      { eng: "Happy", mn: "Аз жаргалтай", emoji: "😄" },
      { eng: "Sad", mn: "Гунигтай сэтгэлтэй", emoji: "😢" },
      { eng: "Angry", mn: "Уур уцаартай", emoji: "😡" },
      { eng: "Cold", mn: "Хүйтэн жихүүн", emoji: "🥶" },
      { eng: "Hot", mn: "Халуун бүгчим", emoji: "🥵" },
      { eng: "Big", mn: "Үлэмж том", emoji: "🐘" },
      { eng: "Small", mn: "Нэн жижиг", emoji: "🐭" },
      { eng: "Fast", mn: "Цахилгаан хурдан", emoji: "⚡" }
    ],
    sentences: [
      { eng: "Today I am very happy", mn: "Өнөөдөр би маш их жаргалтай байна." },
      { eng: "The hot soup is delicious", mn: "Халуун шөл маш амттай байна." },
      { eng: "She has a small mouse", mn: "Түүнд жижигхэн хулгана байдаг." },
      { eng: "The green train is fast", mn: "Ногоон галт тэрэг галзуу хурдан юм." }
    ]
  },
  {
    id: 19,
    name: "Асуулт хариулт ба Үгүйсгэх ахисан дүрэм",
    icon: "📝",
    color: "#64748b",
    colorDark: "#334155",
    colorPale: "#f1f5f9",
    vocab: [
      { eng: "What", mn: "Биет юу", emoji: "❓" },
      { eng: "Where", mn: "Орон хаана", emoji: "📍" },
      { eng: "Who", mn: "Хүн хэн", emoji: "👤" },
      { eng: "When", mn: "Хугацаа хэзээ", emoji: "⏰" },
      { eng: "Yes", mn: "Зөв тийм", emoji: "🟢" },
      { eng: "No", mn: "Буруу үгүй", emoji: "🔴" },
      { eng: "Why", mn: "Шалтгаан яагаад", emoji: "❓" },
      { eng: "How", mn: "Хэлбэр хэрхэн", emoji: "⚙️" }
    ],
    sentences: [
      { eng: "Where do you live now", mn: "Та одоо хаана амьдардаг вэ?" },
      { eng: "What is your favorite food", mn: "Таны хамгийн дуртай хоол юу вэ?" },
      { eng: "I do not like coffee", mn: "Би гашуун кофе уух дургүй." },
      { eng: "She does not play tennis", mn: "Тэр охин теннис тоглодоггүй." }
    ]
  },
  {
    id: 20,
    name: "Бизнес зөвлөгөө ба Түгээмэл 200 Хэлц",
    icon: "🤝",
    color: "#a1a1aa",
    colorDark: "#71717a",
    colorPale: "#f4f4f5",
    vocab: [
      { eng: "Meeting", mn: "Ажлын уулзалт", emoji: "🤝" },
      { eng: "Email", mn: "Цахим и-мэйл", emoji: "📧" },
      { eng: "Company", mn: "Бизнес компани", emoji: "🏢" },
      { eng: "Client", mn: "Үнэт үйлчлүүлэгч", emoji: "👤" },
      { eng: "Project", mn: "Төлөвлөгөөт төсөл", emoji: "📊" },
      { eng: "Help", mn: "Дэмжлэг тусламж", emoji: "🆘" },
      { eng: "Clean", mn: "Гэрэлтсэн цэвэрхэн", emoji: "✨" },
      { eng: "Success", mn: "Агуу амжилт", emoji: "🏆" }
    ],
    sentences: [
      { eng: "We have an important meeting", mn: "Бидэнд маш чухал уулзалт байгаа." },
      { eng: "Please send me an email", mn: "Надад цахим шуудан илгээнэ үү." },
      { eng: "We finished the big project", mn: "Бид чухал хүнд төслийг дуусгалаа." },
      { eng: "Teamwork brings great success", mn: "Хамтын ажиллагаа маш их баялаг амжилт авчирдаг." }
    ]
  },
  {
    id: 21,
    name: "Технологи ба Цахим ертөнц",
    icon: "💻",
    color: "#0ea5e9",
    colorDark: "#0369a1",
    colorPale: "#e0f2fe",
    vocab: [
      { eng: "Computer", mn: "Компьютер төхөөрөмж", emoji: "💻" },
      { eng: "Internet", mn: "Цахим сүлжээ", emoji: "🌐" },
      { eng: "Phone", mn: "Ухаалаг утас", emoji: "📱" },
      { eng: "Code", mn: "Програмчлалын код", emoji: "💻" },
      { eng: "Data", mn: "Мэдээллийн сан", emoji: "📊" },
      { eng: "System", mn: "Үйлдлийн систем", emoji: "⚙️" },
      { eng: "Network", mn: "Сүлжээ холболт", emoji: "🔌" },
      { eng: "User", mn: "Хэрэглэгч гишүүн", emoji: "👤" }
    ],
    sentences: [
      { eng: "The internet is very fast", mn: "Интернэт холболт маш хурдан байна." },
      { eng: "I write clean computer code", mn: "Би компьютерийн цэвэр код бичдэг." },
      { eng: "Where is my smart phone", mn: "Миний ухаалаг утас хаана байна вэ?" },
      { eng: "They protect user data well", mn: "Тэд хэрэглэгчийн мэдээллийг сайн хамгаалдаг." }
    ]
  },
  {
    id: 22,
    name: "Байгаль орчин ба Экологи",
    icon: "🌲",
    color: "#15803d",
    colorDark: "#166534",
    colorPale: "#f0fdf4",
    vocab: [
      { eng: "Tree", mn: "Ногоон мод", emoji: "🌳" },
      { eng: "Forest", mn: "Хөвч ой мод", emoji: "🌲" },
      { eng: "Nature", mn: "Эх байгаль", emoji: "🌸" },
      { eng: "Flower", mn: "Дэлбээлсэн цэцэг", emoji: "🌸" },
      { eng: "Animal", mn: "Байгалийн амьтан", emoji: "🦊" },
      { eng: "Water", mn: "Туйлширсан цэвэр ус", emoji: "💧" },
      { eng: "Air", mn: "Цэвэр агаар", emoji: "💨" },
      { eng: "Earth", mn: "Цэнхэр гариг", emoji: "🌍" }
    ],
    sentences: [
      { eng: "We must save our nature", mn: "Бид эх байгалиа хамгаалах ёстой." },
      { eng: "The green forest is beautiful", mn: "Ногоон ой мод үнэхээр үзэсгэлэнтэй." },
      { eng: "Trees give us clean air", mn: "Моднууд бидэнд цэвэр агаар өгдөг." },
      { eng: "Water is life for earth", mn: "Ус бол дэлхий дээрх амьдрал юм." }
    ]
  },
  {
    id: 23,
    name: "Соёл урлаг ба Кино театр",
    icon: "🎬",
    color: "#ec4899",
    colorDark: "#db2777",
    colorPale: "#fdf2f8",
    vocab: [
      { eng: "Art", mn: "Дүрслэх урлаг", emoji: "🎨" },
      { eng: "Music", mn: "Уянгалаг хөгжим", emoji: "🎵" },
      { eng: "Movie", mn: "Уран сайхны кино", emoji: "🎬" },
      { eng: "Actor", mn: "Жүжигчин хүн", emoji: "🎭" },
      { eng: "Song", mn: "Дуулах аялгуу", emoji: "🎤" },
      { eng: "Dance", mn: "Хэмнэлт бүжиг", emoji: "💃" },
      { eng: "Theater", mn: "Театрын ордон", emoji: "🎭" },
      { eng: "Culture", mn: "Үндэсний соёл", emoji: "🛖" }
    ],
    sentences: [
      { eng: "I love human visual art", mn: "Би хүний дүрслэх урлагт дуртай." },
      { eng: "She watches a golden movie", mn: "Тэр шилдэг уран сайхны кино үзэж байна." },
      { eng: "The actor speaks english well", mn: "Тэр жүжигчин англиар маш сайн ярьдаг." },
      { eng: "We dance to beautiful music", mn: "Бид үзэсгэлэнт уянгалаг хөгжимд бүжиглэдэг." }
    ]
  },
  {
    id: 24,
    name: "Сэтгүүл зүй ба Хэвлэл мэдээлэл",
    icon: "📰",
    color: "#6b7280",
    colorDark: "#4b5563",
    colorPale: "#f3f4f6",
    vocab: [
      { eng: "News", mn: "Шинэ мэдээ", emoji: "📰" },
      { eng: "Paper", mn: "Сонин сэтгүүл", emoji: "📄" },
      { eng: "Media", mn: "Хэвлэл мэдээлэл", emoji: "📺" },
      { eng: "Journal", mn: "Сэтгүүл зүй", emoji: "📓" },
      { eng: "Camera", mn: "Зургийн аппарат", emoji: "📷" },
      { eng: "Video", mn: "Бичлэг дүрс", emoji: "📹" },
      { eng: "Post", mn: "Нийтлэл бичих", emoji: "✍️" },
      { eng: "Writer", mn: "Нэрт зохиолч", emoji: "✍️" }
    ],
    sentences: [
      { eng: "I read daily world news", mn: "Би өдөр тутмын дэлхийн мэдээг уншдаг." },
      { eng: "She works in local media", mn: "Тэр орон нутгийн хэвлэл мэдээлэлд ажилладаг." },
      { eng: "Where is the new camera", mn: "Шинэ зургийн аппарат хаана байна вэ?" },
      { eng: "He is a famous writer", mn: "Тэр бол алдартай зохиолч юм." }
    ]
  },
  {
    id: 25,
    name: "Эрүүл мэнд ба Анагаах ухаан",
    icon: "🏥",
    color: "#f43f5e",
    colorDark: "#e11d48",
    colorPale: "#fff1f2",
    vocab: [
      { eng: "Health", mn: "Эрүүл мэнд", emoji: "🩺" },
      { eng: "Clinic", mn: "Эмнэлгийн газар", emoji: "🏥" },
      { eng: "Nurse", mn: "Сувилагч охин", emoji: "👩‍⚕️" },
      { eng: "Medicine", mn: "Уух эм тариа", emoji: "💊" },
      { eng: "Body", mn: "Бие бялдар", emoji: "🧍" },
      { eng: "Heart", mn: "Хүний зүрх", emoji: "❤️" },
      { eng: "Life", mn: "Амьдрал хувь тавилан", emoji: "🌱" },
      { eng: "Food", mn: "Эрүүл хоол хүнс", emoji: "🍎" }
    ],
    sentences: [
      { eng: "Your health is very important", mn: "Таны эрүүл мэнд үнэхээр чухал." },
      { eng: "The nurse gave me medicine", mn: "Сувилагч надад уух эм өглөө." },
      { eng: "We love eating healthy food", mn: "Бид эрүүл хоол хүнс идэх дуртай." },
      { eng: "Save human life every day", mn: "Өдөр бүр хүний амь насыг авар." }
    ]
  },
  {
    id: 26,
    name: "Шинжлэх ухаан ба Сансар огторгуй",
    icon: "🚀",
    color: "#8b5cf6",
    colorDark: "#6d28d9",
    colorPale: "#f5f3ff",
    vocab: [
      { eng: "Science", mn: "Шинжлэх ухаан", emoji: "🧪" },
      { eng: "Space", mn: "Сансар огторгуй", emoji: "🌌" },
      { eng: "Rocket", mn: "Сансрын хөлөг", emoji: "🚀" },
      { eng: "Star", mn: "Тэнгэрийн од", emoji: "⭐" },
      { eng: "Moon", mn: "Шөнийн сар", emoji: "🌙" },
      { eng: "Sun", mn: "Халуун нар", emoji: "☀️" },
      { eng: "Planet", mn: "Одон гариг", emoji: "🪐" },
      { eng: "Lab", mn: "Туршилтын лаборатори", emoji: "🧪" }
    ],
    sentences: [
      { eng: "Science helps us discover planets", mn: "Шинжлэх ухаан бидэнд өөр гаригуудыг нээхэд тусалдаг." },
      { eng: "The rocket flies to space", mn: "Сансрын хөлөг огторгуй руу нисэж байна." },
      { eng: "I see stars at night", mn: "Би шөнө олон оддыг хардаг." },
      { eng: "They work in the lab", mn: "Тэд судалгааны лабораторид ажилладаг." }
    ]
  },
  {
    id: 27,
    name: "Хоолны соёл ба Дэлхийн гал тогоо",
    icon: "🍕",
    color: "#f97316",
    colorDark: "#ea580c",
    colorPale: "#fff7ed",
    vocab: [
      { eng: "Chef", mn: "Ахлах тогооч", emoji: "👨‍🍳" },
      { eng: "Kitchen", mn: "Гал тогооны өрөө", emoji: "🍳" },
      { eng: "Salt", mn: "Цагаан давс", emoji: "🧂" },
      { eng: "Soup", mn: "Халуун шөл", emoji: "🍲" },
      { eng: "Rice", mn: "Агшаасан будаа", emoji: "🍚" },
      { eng: "Cake", mn: "Амтат бялуу", emoji: "🍰" },
      { eng: "Sugar", mn: "Чихэрлэг элсэн чихэр", emoji: "🍬" },
      { eng: "Plate", mn: "Хоолны таваг", emoji: "🍽️" }
    ],
    sentences: [
      { eng: "The chef makes hot soup", mn: "Тогооч халуун амтат шөл хийж байна." },
      { eng: "We need salt for food", mn: "Бидэнд хоолонд хийх давс хэрэгтэй." },
      { eng: "This cake has much sugar", mn: "Энэ бялуу маш их чихэртэй байна." },
      { eng: "Clean the display plates now", mn: "Хоолны тавгуудыг одоо цэвэрлэ." }
    ]
  },
  {
    id: 28,
    name: "Хууль, эрх зүйн үндэс",
    icon: "⚖️",
    color: "#4f46e5",
    colorDark: "#3730a3",
    colorPale: "#e0e7ff",
    vocab: [
      { eng: "Law", mn: "Улсын хууль", emoji: "⚖️" },
      { eng: "Judge", mn: "Шүүгч хүн", emoji: "👨‍⚖️" },
      { eng: "Court", mn: "Шүүхийн танхим", emoji: "🏛️" },
      { eng: "Right", mn: "Үндсэн эрх", emoji: "🟢" },
      { eng: "Rule", mn: "Мөрдөх журам", emoji: "📋" },
      { eng: "Truth", mn: "Үнэн бодит байдал", emoji: "✨" },
      { eng: "Duty", mn: "Иргэний үүрэг", emoji: "💼" },
      { eng: "State", mn: "Төрийн засаг захиргаа", emoji: "🏛️" }
    ],
    sentences: [
      { eng: "We must follow the law", mn: "Бид улсын хуулийг дагах ёстой." },
      { eng: "The judge search for truth", mn: "Шүүгч үнэн бодит байдлыг хайдаг." },
      { eng: "Rules are good for society", mn: "Журам дүрэм нь нийгэмд хэрэгтэй байдаг." },
      { eng: "Every citizen has a duty", mn: "Иргэн бүр өөрийн гэсэн үүрэгтэй." }
    ]
  },
  {
    id: 29,
    name: "Санхүү, хөрөнгө оруулалт ба Крипто",
    icon: "📈",
    color: "#16a34a",
    colorDark: "#15803d",
    colorPale: "#f0fdf4",
    vocab: [
      { eng: "Bank", mn: "Хадгаламжийн банк", emoji: "🏦" },
      { eng: "Coin", mn: "Зоосон мөнгө", emoji: "🪙" },
      { eng: "Stock", mn: "Компанийн хувьцаа", emoji: "📈" },
      { eng: "Crypto", mn: "Крипто валют", emoji: "🪙" },
      { eng: "Wallet", mn: "Мөнгөний түрийвч", emoji: "👛" },
      { eng: "Trade", mn: "Худалдаа арилжаа", emoji: "📊" },
      { eng: "Gold", mn: "Шар алт", emoji: "🥇" },
      { eng: "Market", mn: "Мөнгөний зах зээл", emoji: "📈" }
    ],
    sentences: [
      { eng: "I save money in bank", mn: "Би банкинд мөнгө хадгалдаг." },
      { eng: "He trades crypto and gold", mn: "Тэр алт болон крипто валют арилжаалдаг." },
      { eng: "Keep your wallet password safe", mn: "Мөнгөний түрийвчний нууц үгээ сайн хамгаал." },
      { eng: "The stock market is active", mn: "Хувьцааны зах зээл маш идэвхтэй байна." }
    ]
  },
  {
    id: 30,
    name: "Ирээдүйн технологи ба AI",
    icon: "🤖",
    color: "#a855f7",
    colorDark: "#7e22ce",
    colorPale: "#f3e8ff",
    vocab: [
      { eng: "Robot", mn: "Ухаалаг робот", emoji: "🤖" },
      { eng: "Future", mn: "Ирээдүй цаг хугацаа", emoji: "🚀" },
      { eng: "Mind", mn: "Оюун ухаан сэтгэхүй", emoji: "🧠" },
      { eng: "Space", mn: "Сансрын хил хязгаар", emoji: "🌌" },
      { eng: "Fly", mn: "Дээшээ нисэх", emoji: "✈️" },
      { eng: "Power", mn: "Хүч чадал эрчим", emoji: "⚡" },
      { eng: "Dream", mn: "Ирээдүйн мөрөөдөл", emoji: "💭" },
      { eng: "Smart", mn: "Маш ухаалаг", emoji: "💡" }
    ],
    sentences: [
      { eng: "AI is the smart future", mn: "Хиймэл оюун ухаан бол ухаалаг ирээдүй юм." },
      { eng: "Robots will help our life", mn: "Роботууд бидний амьдралд туслах болно." },
      { eng: "I dream to fly high", mn: "Би маш өндөрт нисэхийг мөрөөддөг." },
      { eng: "Future power is clean energy", mn: "Ирээдүйн эрчим хүч бол цэвэр энерги юм." }
    ]
  }
];

// Helper function to dynamically generate 10 unique, fully-functional lessons per unit
function generateLessonsForUnit(
  unitId: number,
  vocab: { eng: string; mn: string; emoji: string }[],
  sentences: { eng: string; mn: string }[]
): any[] {
  const lessons: any[] = [];
  
  const lessonLabels = [
    "Анхан шатны мэдлэг",
    "Шинэ үгийн сан 1",
    "Шинэ үгийн сан 2",
    "Дүрмийн анхны алхмууд",
    "Өгүүлбэр угсрах дасгал",
    "Авиа зүй ба дуудлага",
    "Өдөр тутмын хэрэглээ",
    "Ойлголтыг бататгах сорил",
    "Ахисан түвшний хослол",
    "Нэгжийн төгсгөлийн шалгалт"
  ];

  const lessonIcons = ["👋", "⭐️", "📖", "✏️", "🎯", "💡", "🧠", "🔥", "💬", "👑"];

  for (let li = 1; li <= 10; li++) {
    const lessonId = `${unitId}-${li}`;
    const label = lessonLabels[li - 1] || `Хичээл ${li}`;
    const icon = lessonIcons[li - 1] || "📚";
    const exercises: any[] = [];

    // --- Exercise 1: Tap choice (vocab 1) ---
    const v1 = vocab[(li * 2) % vocab.length];
    const tapAnswers1 = [
      { text: v1.mn, emoji: v1.emoji, correct: true }
    ];
    for (let di = 1; di <= 3; di++) {
      const dist = vocab[(li * 2 + di) % vocab.length];
      if (dist.mn !== v1.mn) {
        tapAnswers1.push({ text: dist.mn, emoji: dist.emoji, correct: false });
      } else {
        tapAnswers1.push({ text: vocab[(li * 2 + di + 4) % vocab.length].mn, emoji: vocab[(li * 2 + di + 4) % vocab.length].emoji, correct: false });
      }
    }
    // Simple deterministic swap based on lesson index
    const swapIdx1 = li % 4;
    const temp1 = tapAnswers1[0];
    tapAnswers1[0] = tapAnswers1[swapIdx1];
    tapAnswers1[swapIdx1] = temp1;

    exercises.push({
      type: "tap",
      q: `"${v1.eng}" гэдэг үгийн зөв орчуулга аль нь вэ?`,
      char: v1.emoji,
      answers: tapAnswers1
    });

    // --- Exercise 2: Arrange Sentence ---
    const s1 = sentences[li % sentences.length];
    const words1 = s1.eng.split(/\s+/);
    exercises.push({
      type: "arrange",
      q: "Дараах өгүүлбэрийг зөв дарааллаар угсарна уу",
      mn: s1.mn,
      words: words1,
      correct: s1.eng
    });

    // --- Exercise 3: Fill (Missing Word) ---
    const s2 = sentences[(li + 3) % sentences.length];
    const s2Words = s2.eng.split(/\s+/);
    const blankIdx = Math.floor(s2Words.length / 2);
    const blankWordWithPunct = s2Words[blankIdx];
    const cleanBlank = blankWordWithPunct.replace(/[.,?/#!$%^&*;:{}=\-_`~()]/g, "");
    
    // Split into before and after parts
    const beforePart = s2Words.slice(0, blankIdx).join(" ");
    const afterPart = s2Words.slice(blankIdx + 1).join(" ");

    const fillOptions = [cleanBlank];
    for (let di = 1; di <= 3; di++) {
      const opt = vocab[(li * 3 + di) % vocab.length].eng.replace(/[.,?/#!$%^&*;:{}=\-_`~()]/g, "");
      if (opt.toLowerCase() !== cleanBlank.toLowerCase() && !fillOptions.includes(opt)) {
        fillOptions.push(opt);
      } else {
        fillOptions.push(vocab[(li * 3 + di + 4) % vocab.length].eng.replace(/[.,?/#!$%^&*;:{}=\-_`~()]/g, ""));
      }
    }

    // Deterministic swap
    const swapIdx2 = (li + 2) % 4;
    const temp2 = fillOptions[0];
    fillOptions[0] = fillOptions[swapIdx2];
    fillOptions[swapIdx2] = temp2;

    exercises.push({
      type: "fill",
      before: beforePart,
      blank: cleanBlank,
      after: afterPart + (blankWordWithPunct.endsWith(".") ? "." : blankWordWithPunct.endsWith("?") ? "?" : ""),
      hint: `${cleanBlank} / ${fillOptions.filter(o => o !== cleanBlank)[0] || "not_this"}`,
      mn: s2.mn,
      options: fillOptions
    });

    // --- Exercise 4: Tap choice (vocab 2) ---
    const v2 = vocab[(li * 2 + 1) % vocab.length];
    const tapAnswers2 = [
      { text: v2.mn, emoji: v2.emoji, correct: true }
    ];
    for (let di = 1; di <= 3; di++) {
      const dist = vocab[(li * 2 + 1 + di) % vocab.length];
      if (dist.mn !== v2.mn) {
        tapAnswers2.push({ text: dist.mn, emoji: dist.emoji, correct: false });
      } else {
        tapAnswers2.push({ text: vocab[(li * 2 + 1 + di + 3) % vocab.length].mn, emoji: vocab[(li * 2 + 1 + di + 3) % vocab.length].emoji, correct: false });
      }
    }
    const swapIdx3 = (li + 3) % 4;
    const temp3 = tapAnswers2[0];
    tapAnswers2[0] = tapAnswers2[swapIdx3];
    tapAnswers2[swapIdx3] = temp3;

    exercises.push({
      type: "tap",
      q: `💡 "${v2.eng}" үгийн зөв Монгол орчуулгыг сонгоорой`,
      char: v2.emoji,
      answers: tapAnswers2
    });

    // Make lesson 1-1 done initially so users have starter progress, others progressive and locked
    const isFirstOfAll = (unitId === 1 && li === 1);
    
    lessons.push({
      id: lessonId,
      icon,
      label,
      done: isFirstOfAll, // First lesson of first unit starts as done for onboarding feeling
      locked: unitId === 1 ? li > 1 : li > 1, // Only Lesson 1 is natively pre-unlocked in all units to ease navigation!
      exercises
    });
  }

  return lessons;
}

// Map programmatically generated units, total 20 units x 10 lessons = 200 high quality lessons
export const INITIAL_UNITS: Unit[] = RAW_UNITS.map(unit => {
  return {
    id: unit.id,
    color: unit.color,
    colorDark: unit.colorDark,
    colorPale: unit.colorPale,
    icon: unit.icon,
    label: `НЭГЖ ${unit.id}`,
    name: unit.name,
    lessons: generateLessonsForUnit(unit.id, unit.vocab, unit.sentences)
  };
});

export const INITIAL_LEADERBOARD: LeaderboardItem[] = [
  { name: "Анар", avatar: "🦊", xp: 4820, me: false },
  { name: "Дорж", avatar: "🐯", xp: 3650, me: false },
  { name: "Чимэг", avatar: "🦁", xp: 2940, me: false },
  { name: "Тайван Хэрэглэгч", avatar: "🐼", xp: 2310, me: true },
  { name: "Болд", avatar: "🦅", xp: 1890, me: false },
  { name: "Сарнай", avatar: "🦋", xp: 1540, me: false },
  { name: "Ганбат", avatar: "🐻", xp: 1220, me: false },
  { name: "Мөнхцэцэг", avatar: "🦄", xp: 980, me: false },
  { name: "Бямба", avatar: "🐨", xp: 720, me: false },
  { name: "Оюунбаатар", avatar: "🦊", xp: 540, me: false },
];

export const BADGES = [
  { id: "fire", name: "Галт суралцагч", desc: "7 хоногийн өдрийн дараалал хадгалах", icon: "🔥", threshold: 7, count: 7 },
  { id: "xp", name: "XP-ийн Хаан", desc: "Нийт 2,500-аас дээш XP цуглуулах", icon: "👑", threshold: 2500, count: 2310 },
  { id: "gems", name: "Очир эрдэнэ", desc: "Апп-д 300-аас дээш Эрдэнэ цуглуулах", icon: "💎", threshold: 300, count: 380 },
  { id: "lesson", name: "Төгс суралцагч", desc: "Нэг хичээлийг 100% амжилттай дуусгах", icon: "🎯", threshold: 1, count: 1 }
];

// Rich vocabulary list collected from the 20 Units databases so that references display perfectly inside the "Aura/Shop" & vocab review list
export const VOCABULARIES = [
  { eng: "Apple", mn: "Алим", cat: "Үндсэн", level: "Easy", emoji: "🍎" },
  { eng: "Hello", mn: "Сайн уу", cat: "Мэндчилгээ", level: "Easy", emoji: "👋" },
  { eng: "One / Two / Three", mn: "Нэг / Хоёр / Гурав", cat: "Тоонууд", level: "Easy", emoji: "🔢" },
  { eng: "Mother / Father", mn: "Ээж / Аав", cat: "Гэр бүл", level: "Easy", emoji: "👪" },
  { eng: "Red / Blue / Green", mn: "Улаан / Цэнхэр / Ногоон", cat: "Өнгөнүүд", level: "Easy", emoji: "🎨" },
  { eng: "Table / Chair", mn: "Ширээ / Сандал", cat: "Гэр", level: "Easy", emoji: "🛋️" },
  { eng: "Water / Bread / Milk", mn: "Ус / Талх / Сүү", cat: "Хоол хүнс", level: "Easy", emoji: "🍎" },
  { eng: "Head / Eye / Hand", mn: "Толгой / Нүд / Гар", cat: "Бие эрхтэн", level: "Easy", emoji: "💪" },
  { eng: "Lion / Bird / Horse", mn: "Арслан / Шувуу / Морь", cat: "Амьтад", level: "Easy", emoji: "🦁" },
  { eng: "Today / Sun / Rain", mn: "Өнөөдөр / Нар / Бороо", cat: "Цаг агаар", level: "Easy", emoji: "⏰" },
  { eng: "Run / Walk / Read", mn: "Гүйх / Алхах / Унших", cat: "Үйл үгс", level: "Medium", emoji: "🏃" },
  { eng: "Car / Bus / Plane", mn: "Машин / Автобус / Онгоц", cat: "Аялал", level: "Medium", emoji: "🚗" },
  { eng: "Doctor / Teacher", mn: "Эмч / Багш", cat: "Ажил", level: "Medium", emoji: "💼" },
  { eng: "Shirt / Pants / Shoes", mn: "Цамц / Өмд / Гутал", cat: "Хувцас", level: "Medium", emoji: "👕" },
  { eng: "Money / Price / Buy", mn: "Мөнгө / Үнэ / Худалдан авах", cat: "Худалдаа", level: "Medium", emoji: "🛒" },
  { eng: "World / Country", mn: "Дэлхий / Улс орон", cat: "Газар зүй", level: "Medium", emoji: "🌍" },
  { eng: "Sport / Game / Music", mn: "Спорт / Тоглоом / Хөгжим", cat: "Хобби", level: "Medium", emoji: "⚽" },
  { eng: "Happy / Sad / Angry", mn: "Баяртай / Гунигтай / Ууртай", cat: "Сэтгэл хөдлөл", level: "Medium", emoji: "😄" },
  { eng: "What / Where / Who", mn: "Юу / Хаана / Хэн", cat: "Асуултууд", level: "Hard", emoji: "📝" },
  { eng: "Meeting / Project / Success", mn: "Уулзалт / Төсөл / Амжилт", cat: "Бизнес", level: "Hard", emoji: "🤝" }
];
