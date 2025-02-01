import { Telegraf } from "telegraf"
import dotenv from "dotenv"
import { confirmUser } from "./app/actions";

dotenv.config({ path: ".env.local" })

const bot = new Telegraf("8161546974:AAGY1YsmJEKdw79_js9caNrHwhU-8YcynUQ")



export async function sendApplication(message: any) {
  let email = message.email
  let formApplication = `
  *Имя:* ${message.firstName}\n*Фамилия:* ${message.lastName}\n*Email:* ${message.email}
  `;

  await bot.telegram.sendMessage("5791279590", formApplication, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅", callback_data: "approve" },
          { text: "❌", callback_data: "deny" }
        ]
      ]
    },
  });

  bot.action("approve", async (ctx) => {
    try {
      console.log(email)
    confirmUser({email: email}, false)
    await ctx.answerCbQuery("Заявка одобрена!")
    await ctx.reply("Заявка одобрена ✅")
    } catch (error) {
      await ctx.reply("Произошла ошибка:" + error)
    }
  })

  bot.action("deny", async (ctx) => {
    try {
      console.log("delete user:" + email)
    confirmUser({email: email}, true)
    await ctx.answerCbQuery("Заявка отклонена!")
    await ctx.reply("Заявка отклонена ❌")
    } catch (error) {
      await ctx.reply("Произошла ошибка:" + error)
    }
  })

}

bot.command("start", (ctx) => {
  ctx.reply("Бот запущен и готов к работе!")
})

bot.command("chatid", (ctx) => {
  ctx.reply(`ID этого чата: ${ctx.chat.id}`)
})

bot.on("text", (ctx) => {
  console.log("Получено сообщение:", ctx.message.text)
  console.log("ID чата:", ctx.chat.id)
  ctx.reply("Сообщение получено!")
})


bot.launch()

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))

console.log("Telegram bot is running")

export default bot

