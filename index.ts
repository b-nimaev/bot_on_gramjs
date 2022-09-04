import { TelegramClient } from "telegram";
import { Api } from "telegram/tl";
import { StringSession } from "telegram/sessions";
import { NewMessage, NewMessageEvent } from "telegram/events/NewMessage";
import * as input from "input"; // npm i input

const apiId = 16409256;
const apiHash = "b5b24897de7945d47a511cf85c5b6487";
const stringSession = new StringSession("1AgAOMTQ5LjE1NC4xNjcuNTEBu4m2CbdgWNxNMBkAj5+6858LiCwDDDWJtOEsfYsk+vXYagJO0LJp94M2GWg3tQUCcwfOYXoRrHajsW4IMqh0FHXNbh7KL0pbP2NVU8OlfW/dwqTvLPW8trX99l/mMsKhQD/UXhI8Zb0WhO4m8yinE1Hl8shIf94uRqB1zC6AZO1CfccY9bQUcSZoLiWsIr/tj92csX5uGWiB3kdPKuCynrgMOUSmbrqwAJYKq5xwMMerHTasNeCUDnlrcexg7GZzQ+3zK5WI3Qa/gIyYHmWwOUAd2MAcD7svUNRsh90uPgs3WXWN0MH1NsmXA6d61IrY7lsFdSmj4D1jQ/fcff8D3CI="); // fill this later with the value from session.save()

(async () => {
    console.log("Loading interactive example...");

    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });

    await client.start({
        phoneNumber: async () => await input.text("Please enter your number: "),
        password: async () => await input.text("Please enter your password: "),
        phoneCode: async () =>
            await input.text("Please enter the code you received: "),
        onError: (err) => console.log(err),
    });

    console.log(client.session.save()); // Save this string to avoid logging in again
    let channel = -1001737667504

    async function eventPrint(event: NewMessageEvent) {
        const message = event.message;
        console.log(await message.getSender())
        // Checks if it's a private message (from user or bot)
        if (event.isPrivate) {
            // read message
            if (message) {
                const sender = await message.getSender();

                // @ts-ignore
                if (sender.username == 'SmartTablesTemplatesBot') {
                    await client.sendMessage(channel, {
                        message: `${message.message}`
                    })
                }
            }
        }
    }

    // adds an event handler for new messages
    client.addEventHandler(eventPrint, new NewMessage({}));

})();