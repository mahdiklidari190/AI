// =====================
// ابر BK – شبیه‌ساز مکالمه واقعی 10k+ دیالوگ
// =====================

// کلیدواژه‌های پایه
const keywordsDB = {
    greeting: ["سلام","درود","هی","صبح بخیر","شب بخیر","خوش آمدی","احوالپرسی","چطوری","حالت"],
    personal: ["چند سالته","اسمت","نام","اهل کجایی","شغل","تحصیل","رشته","زبان","خانواده","تولد"],
    weather: ["هوا","باران","برف","آفتابی","ابری","دما","گرما","سرما","فصل","باد","خورشید"],
    daily: ["برنامه","کار","روز","امروز","فردا","هفته","ماه","سال","روتین","صبح","شب","هدف"],
    fun: ["جوک","خنده","معما","فان","سرگرمی","میم","خنده دار","طنز"],
    tech: ["کامپیوتر","گوشی","موبایل","اینترنت","AI","هوش مصنوعی","بازی","ربات"],
    emotions: ["خوشحالم","غمگینم","عصبانیم","خستم","استرس دارم","شادم","ناراحتم"]
};

// الگوهای جمله‌سازی چند لایه
const templatesDB = {
    greeting: ["سلام {name}، حالت چطوره؟","درود، امروز چطوری؟","هی {name}، خوبی؟","سلام رفیق، چه خبر؟"],
    personal: ["من هوش مصنوعی BK هستم، تو چی؟","اسم من BK هست، تو چی؟","دوست دارم بیشتر درباره تو بدونم!"],
    weather: ["امروز هوا {adj}ه، دوست داری بریم بیرون؟","چه هوای {adj}ای! برنامه داری؟"],
    daily: ["چه برنامه‌ای برای {time} داری؟","امروز چیکار کردی؟","فردا چه کاری داری؟"],
    fun: ["می‌خوای یه جوک برات تعریف کنم؟","یه معما داری میخوای حلش کنی؟","خنده برای سلامتیه 😄"],
    tech: ["امروز در دنیای تکنولوژی چه خبر؟","میخوای درباره AI حرف بزنیم؟","ربات‌ها روز به روز هوشمندتر میشن"],
    emotions: ["میبینم امروز {emo} هستی، میخوای راجع بهش حرف بزنیم؟","حالت {emo}ه، دوست داری یه چیز خوشحال‌کننده برات تعریف کنم؟"]
};

// صفات و زمان‌ها برای جایگزینی
const adjectives = ["قشنگ","خوب","عالی","فوقالعاده","لطیف","خنک","گرم","مرطوب","شرجی","تازه"];
const times = ["امروز","فردا","این هفته","این ماه","آخر هفته","تعطیلات","آینده"];
const emotions = ["خوشحال","غمگین","عصبی","خسته","شاد","ناراحت","شگفت‌زده"];

// مودهای چت
const modes = { normal:"", funny:"😂", romantic:"💖", serious:"🧐", pro:"🤖", angry:"😡", shocked:"😲" };

// حافظه کاربر
let userData = { name:"کاربر", interests:[], mode:"normal", history:[], lastTopics:[], lastResponses:[] };

// =====================
// تابع اصلی تولید پاسخ – نسخه ابر
// =====================
function generateResponse(userMessage){
    const msg = userMessage.toLowerCase();
    userData.history.push(msg);

    // پاسخ معرفی ربات
    const selfKeywords = ["تو چی هستی","تو چه مدلی","هوش مصنوعی تو","چی هستی","مدل هوش مصنوعی"];
    for(const k of selfKeywords) if(msg.includes(k)) return "من هوش مصنوعی BK هستم";

    // پاسخ +18 و بی‌احترامی
    const rudeKeywords = ["بی ادب","حرامزاده","لعنتی","سکس","جنسی","+18","fuck","shit","sex"];
    for(const k of rudeKeywords) if(msg.includes(k)) return "🖕 این رو تقدیم کن به مادرت";

    // شناسایی دسته‌ها
    const matched = [];
    for(const cat in keywordsDB){
        for(const kw of keywordsDB[cat]){
            if(msg.includes(kw)) { matched.push(cat); break; }
        }
    }

    if(matched.length === 0) return getGeneralResponse();

    // انتخاب چند دسته برای ترکیب پاسخ پویا (1 تا 4 دسته)
    const selected = getRandomItems(matched, Math.min(matched.length,4));

    // تولید پاسخ ترکیبی پیشرفته
    let response = selected.map(cat=>{
        let tpl = templatesDB[cat][Math.floor(Math.random()*templatesDB[cat].length)];
        if(tpl.includes("{name}")) tpl = tpl.replace(/{name}/g,userData.name);
        if(tpl.includes("{adj}")) tpl = tpl.replace(/{adj}/g,adjectives[Math.floor(Math.random()*adjectives.length)]);
        if(tpl.includes("{time}")) tpl = tpl.replace(/{time}/g,times[Math.floor(Math.random()*times.length)]);
        if(tpl.includes("{emo}")) tpl = tpl.replace(/{emo}/g,emotions[Math.floor(Math.random()*emotions.length)]);
        return tpl;
    }).join(" ");

    // اضافه کردن مود به پایان پاسخ
    if(modes[userData.mode]) response += " "+modes[userData.mode];

    // ذخیره موضوعات اخیر
    userData.lastTopics = [...selected];
    userData.lastResponses.push(response);
    if(userData.lastResponses.length>50) userData.lastResponses.shift(); // محدودیت حافظه کوتاه

    return response;
}

// =====================
// پاسخ‌های عمومی
// =====================
function getGeneralResponse(){
    const responses = [
        "جالب است! بیشتر برام تعریف کن.",
        "چه خوب! دوست داری بیشتر صحبت کنیم؟",
        "منظورت رو متوجه نشدم، میشه توضیح بدی؟",
        "دوست داری درباره چه موضوعی حرف بزنیم؟",
        "میخوای یه موضوع جدید شروع کنیم؟"
    ];
    return responses[Math.floor(Math.random()*responses.length)];
}

// =====================
// توابع کمکی
// =====================
function setUserName(name){userData.name=name||"کاربر";}
function setUserMode(mode){if(modes[mode]) userData.mode=mode;}
function addInterest(interest){if(!userData.interests.includes(interest)) userData.interests.push(interest);}
function getRandomItems(arr,n){const shuffled=arr.slice().sort(()=>0.5-Math.random());return shuffled.slice(0,n);}
function getLastTopics(){return userData.lastTopics;}
function getLastResponses(){return userData.lastResponses;}

// =====================
// نمونه استفاده
// =====================
// setUserName("BK"); setUserMode("funny");
// console.log(generateResponse("سلام، امروز هوا چطوره؟"));
// console.log(generateResponse("تو چه مدلی هستی؟"));
// console.log(generateResponse("برای فردا چه برنامه‌ای داری؟"));
// addInterest("ورزش"); console.log(userData);
