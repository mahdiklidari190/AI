// ai.js
// نسخه 0.0.1 — یک چت‌بات خیلی ساده

export class MiniAI {
  constructor() {
    this.rules = [
      { pattern: /سلام|درود/i, reply: "سلام! حالت چطوره؟" },
      { pattern: /خوب/i, reply: "عالیه! خوشحالم شنیدم." },
      { pattern: /تو کی هستی/i, reply: "من یک چت‌بات اوپن‌سورس هستم 😎" },
      { pattern: /خدافظ|بای/i, reply: "خداحافظ! دوباره بیا." },
    ];
  }

  reply(message) {
    for (let rule of this.rules) {
      if (rule.pattern.test(message)) {
        return rule.reply;
      }
    }
    return "هنوز جواب اینو بلد نیستم 🤖";
  }
}
