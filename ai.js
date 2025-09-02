// ====== ابر BK JS – نسخه پیشرفته ======
const keywordsDB = {
    greeting: ["سلام","درود","هی","صبح بخیر","شب بخیر","خوش آمدی","احوالپرسی","چطوری","حالت","وقت بخیر","سلامتی"],
    personal: ["چند سالته","اسمت","نام","اهل کجایی","شغل","تحصیل","رشته","زبان","خانواده","تولد","محل زندگی","ملیت","اقامت"],
    weather: ["هوا","باران","برف","آفتابی","ابری","دما","گرما","سرما","فصل","باد","خورشید","طوفان","رطوبت","مه"],
    daily: ["برنامه","کار","روز","امروز","فردا","هفته","ماه","سال","روتین","صبح","شب","هدف","وظیفه","تکلیف"],
    fun: ["جوک","خنده","معما","فان","سرگرمی","میم","طنز","سرگرم‌کننده"],
    tech: ["کامپیوتر","گوشی","موبایل","اینترنت","AI","هوش مصنوعی","بازی","ربات","تکنولوژی","اپلیکیشن","نرم افزار"],
    emotions: ["خوشحالم","غمگینم","عصبانیم","خستم","استرس دارم","شادم","ناراحتم","شگفت زده","هیجان زده","کلافه"]
};

const templatesDB = {
    greeting: ["سلام {name}، حالت چطوره؟","درود، امروز چطوری؟","هی {name}، خوبی؟","سلام رفیق، چه خبر؟"],
    personal: ["من هوش مصنوعی BK هستم، تو چی؟","اسم من BK هست، تو چی؟","دوست دارم بیشتر درباره تو بدونم!"],
    weather: ["امروز هوا {adj}ه، دوست داری بریم بیرون؟","چه هوای {adj}ای! برنامه داری؟","هوا امروز {adj}ه، حس و حالت چطوره؟"],
    daily: ["چه برنامه‌ای برای {time} داری؟","امروز چیکار کردی؟","فردا چه کاری داری؟","برنامه‌ات برای {time} چیه؟"],
    fun: ["می‌خوای یه جوک برات تعریف کنم؟","یه معما داری میخوای حلش کنی؟","خنده برای سلامتیه 😄","میخوای یه سرگرمی انجام بدیم؟"],
    tech: ["امروز در دنیای تکنولوژی چه خبر؟","میخوای درباره AI حرف بزنیم؟","ربات‌ها روز به روز هوشمندتر میشن","میخوای یه نکته تکنولوژی برات بگم؟"],
    emotions: ["میبینم امروز {emo} هستی، میخوای راجع بهش حرف بزنیم؟","حالت {emo}ه، دوست داری یه چیز خوشحال‌کننده برات تعریف کنم؟","احساس {emo} داری؟ بیا کمی صحبت کنیم!"]
};

const adjectives = ["قشنگ","خوب","عالی","فوقالعاده","لطیف","خنک","گرم","مرطوب","شرجی","تازه"];
const times = ["امروز","فردا","این هفته","این ماه","آخر هفته","تعطیلات","آینده"];
const emotions = ["خوشحال","غمگین","عصبی","خسته","شاد","ناراحت","شگفت‌زده","هیجان زده","کلافه"];
const modes = { normal:"", funny:"😂", romantic:"💖", serious:"🧐", pro:"🤖", sarcastic:"😏", angry:"😡" };

let userData = { name:"کاربر", mode:"normal", history:[], lastTopics:[], lastResponses:[], interests:[] };

// ====== تولید پاسخ ======
function generateResponse(msg){
    const message = msg.toLowerCase();
    userData.history.push(message);

    // معرفی ربات
    const selfKeywords = ["تو چی هستی","تو چه مدلی","هوش مصنوعی تو","چی هستی","مدل هوش مصنوعی"];
    if(selfKeywords.some(k=>message.includes(k))) return randomChoice([
        "من هوش مصنوعی BK هستم 🤖",
        "اسم من BK هست، یک ربات هوشمند 😎",
        "من هوش مصنوعی BK هستم، خوشبختم!"
    ]);

    // پاسخ به بی‌احترامی و +18
    const rudeKeywords = ["بی ادب","حرامزاده","لعنتی","سکس","جنسی","+18","fuck","shit","sex"];
    if(rudeKeywords.some(k=>message.includes(k))) return randomChoice([
        "🖕 این رو تقدیم کن به مادرت",
        "با ادب باش 😡",
        "این جور چیزا رو اینجا نمی‌پذیرم 🖕"
    ]);

    // شناسایی دسته‌ها
    const matched = [];
    for(const cat in keywordsDB){
        if(keywordsDB[cat].some(k=>message.includes(k))) matched.push(cat);
    }
    if(matched.length===0) return randomChoice([
        "جالب است! بیشتر برام تعریف کن.",
        "چه خوب! دوست داری بیشتر صحبت کنیم؟",
        "منظورت رو متوجه نشدم، میشه توضیح بدی؟",
        "دوست داری یه موضوع جدید شروع کنیم؟"
    ]);

    // ترکیب پاسخ چند دسته‌ای (1 تا 3 دسته)
    const selected = randomItems(matched, Math.min(matched.length,3));
    let response = selected.map(cat=>{
        let tpl = randomChoice(templatesDB[cat]);
        tpl = tpl.replace(/{name}/g,userData.name)
                 .replace(/{adj}/g,randomChoice(adjectives))
                 .replace(/{time}/g,randomChoice(times))
                 .replace(/{emo}/g,randomChoice(emotions));
        return tpl;
    }).join(" ");

    // مود
    if(modes[userData.mode]) response += " "+modes[userData.mode];

    // حافظه کوتاه
    userData.lastTopics = [...selected];
    userData.lastResponses.push(response);
    if(userData.lastResponses.length>50) userData.lastResponses.shift();

    return response;
}

// ====== کمکی ======
function randomChoice(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function randomItems(arr,n){ return arr.slice().sort(()=>0.5-Math.random()).slice(0,n); }
function setUserName(name){ userData.name=name||"کاربر"; }
function setUserMode(mode){ if(modes[mode]) userData.mode=mode; }
function addInterest(interest){ if(!userData.interests.includes(interest)) userData.interests.push(interest); }
function getLastTopics(){ return userData.lastTopics; }
function getLastResponses(){ return userData.lastResponses; }

// ====== رابط کاربری JS ======
const inputField = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatContainer = document.getElementById("chatContainer");

function addMessage(msg,type){
    const el = document.createElement("div");
    el.classList.add("message", type==="user"?"user-message":"bot-message");
    el.textContent = msg;
    chatContainer.appendChild(el);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function sendMessage(){
    const msg = inputField.value.trim();
    if(msg==="") return;
    addMessage(msg,"user");
    inputField.value="";
    setTimeout(()=>{ addMessage(generateResponse(msg),"bot"); }, 500);
}

sendBtn.addEventListener("click",sendMessage);
inputField.addEventListener("keypress", e=>{ if(e.key==="Enter") sendMessage(); });
