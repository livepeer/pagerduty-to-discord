import HTMLToText from "html-to-text";
const { htmlToText } = HTMLToText;

const emojis = {
  "incident.trigger": "🚨",
  "incident.acknowledge": "👩‍💻",
  "incident.unacknowledge": "⁉️",
  "incident.resolve": "✅",
  "incident.assign": "➡️",
  "incident.escalate": "🙀",
  "incident.delegate": "⏬",
  "incident.annotate": "📝",
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const discordHook = async (discordUrl, content) => {
  return await fetch(discordUrl, {
    method: "post",
    body: JSON.stringify({ content }),
    headers: {
      "content-type": "application/json",
    },
  });
};

export default async function pagerdutyToDiscord({ event, discordUrl }) {
  for (const message of event.messages) {
    const emoji = emojis[message.event] || "❓";
    let content = [
      `${emoji} ${message.incident.summary}`,
      `_${message.event}_`,
    ];
    const channel = message.incident.first_trigger_log_entry.channel;
    content.push(`<${message.incident.html_url}>`);
    content = content
      .join("\n")
      .split("\n")
      .map((x, i) => {
        // Give all lines but the first one indentation
        if (i === 0) {
          return x;
        }
        return `       ${x}`;
      });
    if (
      message.event === "incident.trigger" &&
      channel &&
      channel.type === "email"
    ) {
      const body = htmlToText(channel.body)
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line)
        .join("\n");
      content.push("```" + `from: ${channel.from}\n\n${body}` + "```");
    }

    const res = await discordHook(discordUrl, content.join("\n"));
    if (res.status !== 204) {
      throw new Error(await res.text());
    }
    await delay(500);
    return res;
  }
}

if (typeof addEventListener === "function") {
  async function handleRequest(req) {
    if (typeof DISCORD_URL !== "string") {
      throw new Error("missing DISCORD_URL secret");
    }
    let res;
    try {
      const data = await req.json();
      res = await pagerdutyToDiscord({
        event: data,
        discordUrl: DISCORD_URL,
      });
    } catch (e) {
      res = await discordHook(
        DISCORD_URL,
        `Error in Discord hook: ${e.message}
        ${"```"}
        ${e.stack}
        ${"```"}
      `
      );
    }

    return res;
  }

  addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
  });
}
