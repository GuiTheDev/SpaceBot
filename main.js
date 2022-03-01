const Discord = { Client, Intents, DiscordAPIError, MessageEmbed} = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const axios = require('axios')
const tuc = require('temp-units-conv');
require('dotenv').config({ path: '.env' });
const prefix = process.env.PREFIX
const token = process.env.TOKEN

client.on("ready", () => {
    console.log('Bot is logged in '+ client.user.tag)
})

client.on("message", (message) => {
    if (!message.content.startsWith(prefix)) return;
    
    const args = message.content.substr(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase();
    console.log(args)
    console.log(command)

    if(command == 'planet') {
        const CHPlanet = args[0].toLowerCase()
        axios.get('https://api.le-systeme-solaire.net/rest/bodies/' + CHPlanet)
            .then((res) => {
                axios.get('https://images-api.nasa.gov/search?q='+ res.data.id)
                    .then((resImage) => {
                        console.log('RES: ', res)
                        const PLimage = resImage.data.collection.items[0].links[0].href
                        console.log(PLimage)
                        message.reply('planet was searched DEBUG')
                        const tempInC = new Intl.NumberFormat('en-IN', {maximumFractionDigits: 2}).format(tuc.k2c(res.data.avgTemp))
                        const planetEmbed = new MessageEmbed()
                            .setTitle(res.data.englishName)
                            .setThumbnail(PLimage)
                            .setFields(
                                { name: 'Average Temprature', value: `${tempInC}°C`}
                            )
        
        
                        message.channel.send({ embeds: [planetEmbed] });
                    })
            
            })
    }
})

client.login(token)