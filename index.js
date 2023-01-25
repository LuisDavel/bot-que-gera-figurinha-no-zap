const { Client, MessageMedia } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const axios = require('axios')
const client = new Client({})

client.on('qr', qr => {
    qrcode.generate(qr, {small: true})
});

client.on('ready', () => {
    console.log('Gerado')
});

client.on('message_create', msg => {
    const command = msg.body.split(' ')[0];
    const sender = msg.from.includes("998447068") ? msg.to : msg.from
    if (command === "/sticker")  generateSticker(msg, sender)
});

client.initialize();

const generateSticker = async (msg, sender) => {
    if(msg.type === "image") {
        try {
            const { data } = await msg.downloadMedia()
            const image = await new MessageMedia("image/jpeg", data, "image.jpg")
            await client.sendMessage(sender, image, { sendMediaAsSticker: true })
            msg.reply(`Seu sticker foi gerado com sucesso :D`)
        } catch(e) {
            msg.reply("Não foi possivel carregar a imagem")
        }
    } else {
        try {

            const url = msg.body.substring(msg.body.indexOf(" ")).trim()
            const { data } = await axios.get(url, {responseType: 'arraybuffer'})
            const returnedB64 = Buffer.from(data).toString('base64');
            const image = await new MessageMedia("image/jpeg", returnedB64, "image.jpg")
            await client.sendMessage(sender, image + msg.reply('Mensagem enviada'), { sendMediaAsSticker: true } )
        } catch(e) {
            msg.reply("Não foi possivel carregar a imagem")
        }
    }
}