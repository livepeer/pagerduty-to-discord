import "isomorphic-fetch";
import fs from "fs";
import pagerdutyToDiscord from "./pagerduty-to-discord.mjs";

const str = fs.readFileSync(process.argv[2], "utf8");
const event = JSON.parse(str);
const discordUrl = process.env.DISCORD_URL;
if (!discordUrl) {
  throw new Error("missing environment variable DISCORD_URL");
}
pagerdutyToDiscord({
  event,
  discordUrl:
    "https://discord.com/api/webhooks/712068331854757998/ZETxlE7DS1s9H7S_k3-n7zz7AhAIxyW2LymZukwTn25NcoVZOeDHeB3QsxVof-W3g67O",
}).catch((err) => {
  console.log(err);
});
