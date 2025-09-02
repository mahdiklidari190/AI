// ====== ابر BK JS ======
const keywordsDB = {
  greeting:["سلام","درود","هی","صبح بخیر","شب بخیر","خوش آمدی","احوالپرسی","چطوری","حالت"],
  personal:["چند سالته","اسمت","نام","اهل کجایی","شغل","تحصیل","رشته","زبان","خانواده","تولد"],
  weather:["هوا","باران","برف","آفتابی","ابری","دما","گرما","سرما","فصل","باد","خورشید"],
  daily:["برنامه","کار","روز","امروز","فردا","هفته","ماه","سال","روتین","صبح","شب","هدف"],
  fun:["جوک","خنده","معما","فان","سرگرمی","میم","خنده دار","طنز"],
  tech:["کامپیوتر","گوشی","موبایل","اینترنت","AI","هوش مصنوعی","بازی","ربات"],
  emotions:["خوشحالم","غمگینم","عصبانیم","خستم","استرس دارم","شادم","ناراحتم"]
};
const templatesDB = {
  greeting:["سلام {name}، حالت چطوره؟","درود، امروز چطوری؟","هی {name}، خوبی؟","سلام رفیق، چه خبر؟"],
  personal:["من هوش مصنوعی BK هستم، تو چی؟","اسم من BK هست، تو چی؟","دوست دارم بیشتر درباره تو بدونم!"],
  weather:["امروز هوا {adj}ه، دوست داری بریم بیرون؟","چه هوای {adj}ای! برنامه داری؟"],
  daily:["چه برنامه‌ای برای {time} داری؟","امروز چیکار کردی؟","فردا چه کاری داری؟"],
  fun:["می‌خوای یه جوک برات تعریف کنم؟","یه معما داری میخوای حلش کنی؟","خنده برای سلامتیه 😄"],
  tech:["امروز در دنیای تکنولوژی چه خبر؟","میخوای درباره AI حرف بزنیم؟","ربات‌ها روز به روز هوشمندتر میشن"],
  emotions:["میبینم امروز {emo} هستی، میخوای راجع بهش حرف بزنیم؟","حالت {emo}ه، دوست داری یه چیز خوشحال‌کننده برات تعریف کنم؟"]
};
const adjectives=["قشنگ","خوب","عالی","فوقالعاده","لطیف","خنک","گرم","مرطوب","شرجی","تازه"];
const times=["امروز","فردا","این هفته","این ماه","آخر هفته","تعطیلات","آینده"];
const emotions=["خوشحال","غمگین","عصبی","خسته","شاد","ناراحت","شگفت‌زده"];
let userData={name:"کاربر",mode:"normal",history:[],lastTopics:[],lastResponses:[]};

function generateResponse(msg){
  const message=msg.toLowerCase();
  userData.history.push(message);

  const selfKeywords=["تو چی هستی","تو چه مدلی","هوش مصنوعی تو","چی هستی","مدل هوش مصنوعی"];
  if(selfKeywords.some(k=>message.includes(k))) return "من هوش مصنوعی BK هستم";

  const rudeKeywords=["بی ادب","حرامزاده","لعنتی","سکس","جنسی","+18","fuck","shit","sex"];
  if(rudeKeywords.some(k=>message.includes(k))) return "🖕 این رو تقدیم کن به مادرت";

  const matched=[];
  for(const cat in keywordsDB){ if(keywordsDB[cat].some(k=>message.includes(k))) matched.push(cat); }
  if(matched.length===0) return getGeneralResponse();

  // جلوگیری از تکرار پاسخ
  const selected=getRandomItems(matched,Math.min(matched.length,3));
  let response="";
  for(let cat of selected){
    let tpl=getRandomItemNoRepeat(templatesDB[cat],userData.lastResponses);
    tpl=tpl.replace(/{name}/g,userData.name)
           .replace(/{adj}/g,getRandomItem(adjectives))
           .replace(/{time}/g,getRandomItem(times))
           .replace(/{emo}/g,getRandomItem(emotions));
    response+=tpl+" ";
  }
  response=response.trim();

  userData.lastTopics=[...selected];
  userData.lastResponses.push(response);
  if(userData.lastResponses.length>50) userData.lastResponses.shift();

  return response;
}

function getGeneralResponse(){
  const general=["جالب است! بیشتر برام تعریف کن.","چه خوب! دوست داری بیشتر صحبت کنیم؟","منظورت رو متوجه نشدم، میشه توضیح بدی؟"];
  return getRandomItemNoRepeat(general,userData.lastResponses);
}

// کمکی‌ها
function getRandomItems(arr,n){return arr.sort(()=>0.5-Math.random()).slice(0,n);}
function getRandomItem(arr){return arr[Math.floor(Math.random()*arr.length)];}
function getRandomItemNoRepeat(arr,history){
  const filtered=arr.filter(x=>!history.includes(x));
  return filtered.length>0?filtered[Math.floor(Math.random()*filtered.length)]:getRandomItem(arr);
}
function setUserName(name){userData.name=name||"کاربر";}
function setUserMode(mode){userData.mode=mode;}
