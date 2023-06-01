import { TelegramClient } from "telegram";
const os = require("os")
const pkg = require("./package.json")
import { Api } from "telegram/tl";
import { StringSession } from "telegram/sessions";
import { NewMessage, NewMessageEvent } from "telegram/events/NewMessage";
import * as input from "input"; // npm i input

const apiId = 29577119;
const apiHash = "db2bbdfa5d628b8ed65a929f441af9b0";
const stringSession = new StringSession("1AgAOMTQ5LjE1NC4xNjcuNTABu5dtuoty6br9Y3I99nwF8ZMCv7WnhiqE261ornBVbfa++p6XjLv21ew8yjnqmKGycN6j73AzzOpVbib+3ZoGfJ5vGLkTzEu2D0LqY12PbnSZ/0O9lu/ttkGIbCPxNnaOZNTWsMh1Bon8ALlETVdjyKIGi599IeUjlk8NNlp8QFhsRTNAYN0etFVoVvqo3ueXPAPmYu2SeEGj0JCCQvsQOnCaYGGrPg4GEC5tW1XeU62XHoz9mwLwooQ6PPKjhW6Ol3npc+o0jFnKMeg8IG8iMaqHvCzKhlrUHx6O9oRjbTmZk3eI8K8bHk+bLc3X4b0zxDJWlSl+FDbCpqhLGvdtX44="); // fill this later with the value from session.save()

(async () => {
    console.log("Loading interactive example...");

    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
        deviceModel: `${pkg.name}@${os.hostname()}`,
        systemVersion: os.version() || "Unknown node",
        appVersion: pkg.version,
        useWSS: true,
        testServers: false,
    });
    console.log(os.hostname())

    await client.start({
        phoneNumber: async () => await input.text("Please enter your number: "),
        password: async () => await input.text("Please enter your password: "),
        phoneCode: async () =>
            await input.text("Please enter the code you received: "),
        onError: (err) => console.log(err),
    });

    console.log(client.session.save()); // Save this string to avoid logging in again
    // let channel = -1001737667504

    async function eventPrint(event: NewMessageEvent) {


        const message = event.message;
        let sender = await message.getSender()

        // 853773971 айди бота
        // 1272270574 мой айди
        // 990629674 айди группы куда нужно скидывать

        if (sender.id.valueOf() === 853773971) {

            // console.log(message)

            // @ts-ignore
            let groupid = message.peerId.chatId.valueOf()
            let channellink = message.message.split('\n')
            let link = channellink[1]
            let channel_name = link.split('/')[1]
            let postid = link.split('/')[2]

            // const messages = await client.invoke(
            //     new Api.messages.GetMessages({
            //         channel: channel_name,
            //         // @ts-ignore
            //         id: [parseFloat(postid)],
            //     })
            // );
            // console.log(messages)

           await client.invoke(
                new Api.messages.ForwardMessages({
                    fromPeer: channel_name,
                    // @ts-ignore
                    id: [parseFloat(postid)],
                    toPeer: "-990629674"
                })
            );

            // const fullUser = await client.invoke(
                // new Api.users.GetFullUser({
                    // id: userId,
                // })
            // );

            // console.log(fullUser)

            await client.invoke(
                new Api.messages.SendMessage({
                    peer: "-990629674",
                    // @ts-ignore
                    // message: message.message + `\n\n` + message.media.webpage.description + `\n\nотправлено с @${channel_name}\n`,
                    message: link,
                    noWebpage: true
                })
            )


            // console.log(message)
        }


    }

    // adds an event handler for new messages
    client.addEventHandler(eventPrint, new NewMessage({}));

})();