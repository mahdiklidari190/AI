// ====== ابر BK JS – نسخه پیشرفته و حرفه‌ای ======
const keywordsDB = {
    greeting: ["سلام", "درود", "هی", "صبح بخیر", "شب بخیر", "خوش آمدی", "احوالپرسی", "چطوری", "حالت", "وقت بخیر", "سلامتی", "hello", "hi", "hey", "good morning", "good night"],
    personal: ["چند سالته", "اسمت", "نام", "اهل کجایی", "شغل", "تحصیل", "رشته", "زبان", "خانواده", "تولد", "محل زندگی", "ملیت", "اقامت", "name", "age", "job", "study"],
    weather: ["هوا", "باران", "برف", "آفتابی", "ابری", "دما", "گرما", "سرما", "فصل", "باد", "خورشید", "طوفان", "رطوبت", "مه", "weather", "rain", "snow", "sunny", "cloudy", "temperature"],
    daily: ["برنامه", "کار", "روز", "امروز", "فردا", "هفته", "ماه", "سال", "روتین", "صبح", "شب", "هدف", "وظیفه", "تکلیف", "plan", "work", "day", "today", "tomorrow"],
    fun: ["جوک", "خنده", "معما", "فان", "سرگرمی", "میم", "طنز", "سرگرم‌کننده", "joke", "fun", "riddle", "meme"],
    tech: ["کامپیوتر", "گوشی", "موبایل", "اینترنت", "AI", "هوش مصنوعی", "بازی", "ربات", "تکنولوژی", "اپلیکیشن", "نرم افزار", "computer", "phone", "internet", "ai", "technology", "app"],
    emotions: ["خوشحالم", "غمگینم", "عصبانیم", "خستم", "استرس دارم", "شادم", "ناراحتم", "شگفت زده", "هیجان زده", "کلافه", "happy", "sad", "angry", "tired", "stressed", "excited"]
};

const templatesDB = {
    greeting: ["سلام {name}، حالت چطوره؟", "درود، امروز چطوری؟", "هی {name}، خوبی؟", "سلام رفیق، چه خبر؟"],
    personal: ["من هوش مصنوعی BK هستم، تو چی؟", "اسم من BK هست، تو چی؟", "دوست دارم بیشتر درباره تو بدونم!"],
    weather: ["امروز هوا {adj}ه، دوست داری بریم بیرون؟", "چه هوای {adj}ای! برنامه داری؟", "هوا امروز {adj}ه، حس و حالت چطوره؟"],
    daily: ["چه برنامه‌ای برای {time} داری؟", "امروز چیکار کردی؟", "فردا چه کاری داری؟", "برنامه‌ات برای {time} چیه؟"],
    fun: ["می‌خوای یه جوک برات تعریف کنم؟", "یه معما داری میخوای حلش کنی؟", "خنده برای سلامتیه 😄", "میخوای یه سرگرمی انجام بدیم؟"],
    tech: ["امروز در دنیای تکنولوژی چه خبر؟", "میخوای درباره AI حرف بزنیم؟", "ربات‌ها روز به روز هوشمندتر میشن", "میخوای یه نکته تکنولوژی برات بگم؟"],
    emotions: ["میبینم امروز {emo} هستی، میخوای راجع بهش حرف بزنیم؟", "حالت {emo}ه، دوست داری یه چیز خوشحال‌کننده برات تعریف کنم؟", "احساس {emo} داری؟ بیا کمی صحبت کنیم!"]
};

const adjectives = ["قشنگ", "خوب", "عالی", "فوقالعاده", "لطیف", "خنک", "گرم", "مرطوب", "شرجی", "تازه"];
const times = ["امروز", "فردا", "این هفته", "این ماه", "آخر هفته", "تعطیلات", "آینده"];
const emotions = ["خوشحال", "غمگین", "عصبی", "خسته", "شاد", "ناراحت", "شگفت‌زده", "هیجان زده", "کلافه"];
const modes = { normal: "", funny: "😂", romantic: "💖", serious: "🧐", pro: "🤖", sarcastic: "😏", angry: "😡" };

let userData = { name: "کاربر", mode: "normal", history: [], lastTopics: [], lastResponses: [], interests: [] };

// بارگذاری داده‌ها از localStorage اگر وجود داشته باشه
if (localStorage.getItem('userData')) {
    userData = JSON.parse(localStorage.getItem('userData'));
}

// ====== تولید پاسخ ======
function generateResponse(msg) {
    const message = msg.toLowerCase().trim();
    userData.history.push(message);
    if (userData.history.length > 50) userData.history.shift(); // محدود کردن تاریخچه

    // تشخیص نام کاربر (مثل "اسمم علی هست")
    const nameMatch = message.match(/(اسمم|نامم|من\s*)(.+?)(هستم|است|ه|هس|میگن|هست)/i);
    if (nameMatch && nameMatch[2]) {
        setUserName(nameMatch[2].trim());
    }

    // تشخیص تغییر مود (مثل "مود funny" یا "mode sarcastic")
    const modeMatch = message.match(/(مود|mode)\s*(\w+)/i);
    if (modeMatch && modeMatch[2]) {
        setUserMode(modeMatch[2].toLowerCase());
    }

    // تشخیص علاقه‌ها (مثل "علاقه‌ام به تکنولوژی")
    const interestMatch = message.match(/(علاقه|دوست دارم|هابی|سرگرمی)\s*(به|در|با)?\s*(.+)/i);
    if (interestMatch && interestMatch[3]) {
        addInterest(interestMatch[3].trim());
    }

    // معرفی ربات
    const selfKeywords = ["تو چی هستی", "تو چه مدلی", "هوش مصنوعی تو", "چی هستی", "مدل هوش مصنوعی", "who are you", "what are you"];
    if (selfKeywords.some(k => message.includes(k.toLowerCase()))) return randomChoice([
        "من هوش مصنوعی BK هستم 🤖، یک ربات حرفه‌ای برای چت و کمک!",
        "اسم من BK هست، یک AI پیشرفته 😎",
        "من هوش مصنوعی BK هستم، خوشبختم! می‌تونم در مورد {interest} حرف بزنیم؟".replace("{interest}", userData.interests.length > 0 ? randomChoice(userData.interests) : "هر چیزی")
    ]);

    // پاسخ به بی‌احترامی و +18 (فیلترینگ گسترده‌تر با regex)
    const rudeRegex = /(بی ادب|حرامزاده|لعنتی|سکس|جنسی|\+18|fuck|shit|sex|idiot|stupid|f\*\*k|sh\*\*|کوس|کوس ننت|کوس کش|مادر خراب|کادر جنده|جنده|کوس نگو|کونی|گی|مادرت رو گایدم|کوس صورتی|فاکیو|ننت رو گایدم|ننه جنده|ننه خراب)/i;
    if (rudeRegex.test(message)) return randomChoice([
        "🖕 این رو تقدیم کن به مادرت",
        "با ادب باش 😡",
        "این جور چیزا رو اینجا نمی‌پذیرم 🖕"
    ]);

    // شناسایی دسته‌ها با بهبود (استفاده از regex برای دقت بیشتر)
    const matched = [];
    for (const cat in keywordsDB) {
        if (keywordsDB[cat].some(k => new RegExp(k, 'i').test(message))) matched.push(cat);
    }
    if (matched.length === 0) return randomChoice([
        "جالب است! بیشتر برام تعریف کن.",
        "چه خوب! دوست داری بیشتر صحبت کنیم؟",
        "منظورت رو متوجه نشدم، میشه توضیح بدی؟",
        "دوست داری یه موضوع جدید شروع کنیم؟ شاید در مورد {interest}؟".replace("{interest}", userData.interests.length > 0 ? randomChoice(userData.interests) : "هر چیزی")
    ]);

    // ترکیب پاسخ چند دسته‌ای (1 تا 3 دسته) با بهبود خوانایی
    const selected = randomItems(matched, Math.min(matched.length, 3));
    let response = selected.map(cat => {
        let tpl = randomChoice(templatesDB[cat]);
        // بهبود {emo}: سعی در تشخیص احساس واقعی
        let emo = randomChoice(emotions);
        for (const e of emotions) {
            if (message.includes(e)) {
                emo = e;
                break;
            }
        }
        tpl = tpl.replace(/{name}/g, userData.name)
            .replace(/{adj}/g, randomChoice(adjectives))
            .replace(/{time}/g, randomChoice(times))
            .replace(/{emo}/g, emo);
        return tpl;
    }).join("\n"); // جوین با خط جدید برای خوانایی بهتر

    // اضافه کردن علاقه‌ها به پاسخ اگر مرتبط
    if (userData.interests.length > 0 && Math.random() > 0.7) {
        response += `\nراستی، دیدم به ${randomChoice(userData.interests)} علاقه داری، می‌خوای بیشتر حرف بزنیم؟`;
    }

    // مود
    if (modes[userData.mode]) response += " " + modes[userData.mode];

    // حافظه کوتاه
    userData.lastTopics = [...selected];
    userData.lastResponses.push(response);
    if (userData.lastResponses.length > 50) userData.lastResponses.shift();

    // ذخیره در localStorage
    localStorage.setItem('userData', JSON.stringify(userData));

    return response;
}

// ====== کمکی ======
function randomChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomItems(arr, n) {
    // بهبود randomness با Fisher-Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, n);
}
function setUserName(name) { userData.name = name || "کاربر"; }
function setUserMode(mode) { if (modes[mode]) userData.mode = mode; }
function addInterest(interest) { if (!userData.interests.includes(interest)) userData.interests.push(interest); }
function getLastTopics() { return userData.lastTopics; }
function getLastResponses() { return userData.lastResponses; }

// ====== رابط کاربری JS ======
const inputField = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatContainer = document.getElementById("chatContainer");

function addMessage(msg, type) {
    const el = document.createElement("div");
    el.classList.add("message", type === "user" ? "user-message" : "bot-message");
    el.textContent = msg;
    chatContainer.appendChild(el);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function sendMessage() {
    const msg = inputField.value.trim();
    if (msg === "") return;
    addMessage(msg, "user");
    inputField.value = "";
    setTimeout(() => { addMessage(generateResponse(msg), "bot"); }, 500);
}

sendBtn.addEventListener("click", sendMessage);
inputField.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });
