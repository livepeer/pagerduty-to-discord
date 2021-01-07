# pagerduty-to-discord

Cloudflare worker that eats PagerDuty webhooks and spits Discord webhooks.

## Building

```
yarn install
```

## Deploying to Cloudflare

Copy `dist/pagerduty-to-discord.js` to a Cloudflare worker. Configure two environment variables.

`DISCORD_URL`: Discord webhook URL.
`SECRET_PATH`: Secret path prefix so events can't be triggered publicly. I just use a UUID.

<img src="https://user-images.githubusercontent.com/257909/103857596-a5e67a00-506b-11eb-8daf-7931ce5b0ffd.png">

## Adding PagerDuty integration

Click into one of your services. Click "Integrations", then "Add or manage extensions", then "New Extension".

For type, pick "Generic V2 Webhook", put whatever you want for name, and put the URL as `https://<WORKER URL>/<SECRET_PATH>`.

<img src="https://user-images.githubusercontent.com/257909/103858042-7dab4b00-506c-11eb-9365-7d1929953265.png" />

Then when you trigger an incident for that service it'll look like this:

<img src="https://user-images.githubusercontent.com/257909/103858107-a2072780-506c-11eb-8e94-a978a3bc85eb.png" />

Hooray!
