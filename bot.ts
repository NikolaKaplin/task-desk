import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { confirmUser } from "./app/actions";
import { prisma } from "./prisma/prisma-client";

dotenv.config({ path: ".env.local" });

const bot = new Telegraf("8161546974:AAGY1YsmJEKdw79_js9caNrHwhU-8YcynUQ");

export async function sendApplication(message: any) {
  bot.drop
  const email = message.email;
  const formApplication = `
  *Имя:* ${message.firstName}\n*Фамилия:* ${message.lastName}\n*Email:* ${message.email}`;

  await bot.telegram.sendMessage("5791279590", formApplication, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅", callback_data: "approve" },
          { text: "❌", callback_data: "deny" },
        ],
      ],
    },
  });

  bot.action("approve", async (ctx) => {
    try {
      let res = await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          role: "USER",
        },
      });
      if (res) {
        await ctx.answerCbQuery("Заявка одобрена!");
        await ctx.reply("Заявка одобрена ✅");
      }
      bot.stop();
    } catch (error) {
      await ctx.reply("Произошла ошибка:" + error);
      bot.stop();
    }
  });

  bot.action("deny", async (ctx) => {
    try {
      let res = await prisma.user.delete({
        where: {
          email: email,
        },
      });
      if (res) {
        await ctx.answerCbQuery("Заявка отклонена!");
        await ctx.reply("Заявка отклонена ❌");
      }
      bot.stop();
    } catch (error) {
      await ctx.reply("Произошла ошибка:" + error);
      bot.stop();
    }
  });
}
