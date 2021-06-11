const Discord = require("discord.js");
const config = require("./config.json");
const fs = require("fs");
const { cpuUsage } = require("process");

//Setup
const client = new Discord.Client();
const prefiacg = "!"
const channelIDs = config.Channel_IDS
const channelID = "477172511424118804"
const oddzialy = ['cg', '1st', '327th', '41st', '212th', 'ws', 'flota']
client.login(config.BOT_TOKEN);
array = []
client.on('ready', () => {
  console.log('I am ready!');
  client.channels.fetch(channelID)
    .then(channel => {
      // channel.send("test")
    })
    .catch(console.error);
});

commands = ["!ping", "!a", "!config", "!help"]

client.on("message", function (message) {
  const channelIDs = config.Channel_IDS
  // console.warn(message.channel.id)
  if (message.author.bot) return;
  if (!message.content.startsWith(prefiacg)) return;
  if (!channelIDs.includes(message.channel.id)) return;

  const commandBody = message.content.slice(prefiacg.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();
  switch (command) {
    case "ping":
      const timeTaken = Date.now() - message.createdTimestamp;
      message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
      break;
    case "a":
      let oddzial = ""
      let cg = -1, ar = -1, art = -1, cz = -1, wj = 1;
      let aresztowany = "", acg = "", artykuly = "", czas = "", wyjscie = ""
      args.forEach(element => {
        if (cg > -1 || oddzialy.includes(element.toLowerCase()))
          if (cg == -1 && oddzialy.includes(element.toLowerCase())) {
            acg = element
            cg = 0;
          } else if (cg == 0 && !element.endsWith(":")) {
            acg += " " + element
          } else if (cg == 0 && element.endsWith(":")) {
            acg += " " + element.replace(":", "")
            cg = 1;
          }
        if ((element.toLowerCase() == "aresztowano" || element.toLowerCase() == "aresztowany" || element.toLowerCase() == "aresztuję" || element.toLowerCase() == "aresztuje")) {
          ar = 0;
        } else if (ar == 0 && (element != "|" || !element.endsWith("|"))) {
          aresztowany += element.trim() + " "

        } else if (ar == 0 && element == "|") {
          ar = 1
        } else if (ar == 0 && element.endsWith("|")) {
          aresztowany += element.trim()
          ar = 1;
        }
        if (art == -1 && element.startsWith("|")) {
          art = 0;
          artykuly += (element.toLowerCase().replace("|", "") + " ").trim()

        } else if (art == 0 && element != "|" && !element.endsWith("|")) {
          artykuly += element.trim().toLowerCase() + " "
        } else if (art == 0 && element.endsWith("|")) {
          artykuly += (element.toLowerCase().replace("|", "") + " ").trim()
          art++;
        } else if (art == 0 && element == "|") {
          art++;
        }
        if (wj == 1 && cz == 1 && (element.startsWith("|") || element.endsWith("|")) && art == 1) {
          wj = 0;
          wyjscie += (element.toLowerCase().replace("|", "") + " ").trim()

        } else if (wj == 1 && cz == 1 && element != "|" && art == 1 && !element.endsWith("|")) {
          wyjscie += element.trim().toLowerCase() + " "
        } else if (wj == 1 && cz == 1 && element.endsWith("|") && art == 1) {
          wyjscie += (element.toLowerCase().replace("|", "") + " ").trim()
          wj++;
        } else if (wj == 1 && cz == 1 && element == "|" && art == 1) {
          wj++;
        }
        if (cz == -1 && (element.startsWith("|") || element.endsWith("|")) && art == 1) {
          cz = 0;
          czas += (element.toLowerCase().replace("|", "") + " ").trim()

        } else if (cz == 0 && element != "|" && art == 1 && !element.endsWith("|")) {
          czas += element.trim().toLowerCase() + " "
        } else if (cz == 0 && element.endsWith("|") && art == 1) {
          czas += (element.toLowerCase().replace("|", "") + " ").trim()
          cz++;
        } else if (cz == 0 && element == "|" && art == 1) {
          cz++;
        }
        // console.log(element)
      });
      aresztowany = aresztowany.trim().split(" ")
      acg = acg.trim()
      artykuly = artykuly.trim()
      czas = czas.trim()
      wyjscie = wyjscie.trim()
      oddzial = aresztowany.shift()
      info = [acg, oddzial, aresztowany.toString().replace(",", " "), artykuly, czas, wyjscie]
      console.log(info)
      break;
    case "config":
      switch (args[0]) {
        case "channels":
          switch (args[1]) {
            case "add":
              object = config
              object.Channel_IDS.push(args[2])
              data = JSON.stringify(object)
              fs.writeFile('./config.json', data, function (err) {
                if (err) {
                  console.log('There has been an error saving your configuration data.');
                  console.log(err.message);
                  return;
                }
                console.log('Configuration saved successfully.')
              });
              break;
            case "remove":
              object = config
              array = object.Channel_IDS
              if (array.length <= 1) {
                message.reply("Nie można usunąć ostatniego kanału!!")
                break;
              }
              index = 0
              for (i = 0; i < array.length; i++) {
                if (args[2] === array[i]) {
                  index = 0
                  break;
                }
              }
              array = array.splice(index, 1)
              console.log(array)
              object.Channel_IDS = array
              data = JSON.stringify(object)
              fs.writeFile('./config.json', data, function (err) {
                if (err) {
                  console.log('There has been an error saving your configuration data.');
                  console.log(err.message);
                  return;
                }
                console.log('Configuration saved successfully.')
              })
              break;
            default:
              message.reply(`Dostępne opcje:\n\`\`\`\nadd {channel ID}\nremove {channel ID}\nlist\`\`\``)
          }
          break;
        default:
          message.reply(`Dostępne opcje:\n\`\`\`channels\`\`\``)
      }
      break;
    case "help":
      message.reply(`Dostępne polecenia:\n\`\`\`${commands.toString().replace(/,/gm, "\n")}\`\`\``)
      break;
    default:
      message.reply(`Brak polecenia ${command}!`)
      console.log(client.channels.cache)
  }
});

console.log("test")