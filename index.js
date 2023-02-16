const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')
const token = '5876709362:AAGvMEu50b7uUu2aIplLs937EdF0csJOfTg';

const bot = new TelegramApi(token, {polling: true})

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage( chatId, 'Сейчас я загадаю чисо от 0 до 9, а ты должен ее угадать')
    const randomNumber = Math.floor(Math.random() * 10 );
    chats[chatId] = randomNumber;
    await bot.sendMessage( chatId, 'Отгадывай', gameOptions);
}

const start = () => {
bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Получить информацию'},
    {command: '/game', description: 'Начать игру'},
])

bot.on('message', async msg => {

    const text = msg.text;
    const chatId = msg.chat.id;

    if  ( text === '/start') {
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp');
        return bot.sendMessage(chatId, 'Привет')
    }
    if ( text === '/info' ) {
        console.log(msg);
    
        return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.username}`)
    } 
    if ( text === "/game") {
        return startGame(chatId);
    }
    return bot.sendMessage(chatId, "я тебя не понимаю, попробуй еще раз!")
})

bot.on('callback_query', msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if ( data === "/again" ) {
        return startGame(chatId)
    }
    if (data == chats[chatId]) {
        return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
    } else {
        return bot.sendMessage(chatId, `К сожалению, ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
    }
})

};

start();
