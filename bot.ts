import { Telegraf } from 'telegraf';
import { confirmUser } from './app/actions';

const bot = new Telegraf('8161546974:AAGY1YsmJEKdw79_js9caNrHwhU-8YcynUQ'); // Замените YOUR_BOT_TOKEN на токен вашего бота

bot.start((ctx) => ctx.reply('Добро пожаловать!'));
bot.help((ctx) => ctx.reply('Это помощник бота.'));
bot.command('accept', async (ctx) => {
  const commandText = (ctx.message.text).split(' ')[1];
  await confirmUser({email: commandText}, false)
  await ctx.reply('Заявка принята!');
});
bot.command('deny', async (ctx) => {
  const commandText = (ctx.message.text).split(' ')[1];
  console.log(commandText)
  await confirmUser({email: commandText}, true)
  await ctx.reply('Заявка отклонена!');
});
bot.launch()
  .then(() => {
    console.log('Bot is running...');
  })
  .catch(err => {
    console.error('Error launching the bot:', err);
  });

// Обработка остановки бота
process.once('SIGINT', () => {
  bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
});