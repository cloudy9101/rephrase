import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { Provider, type Config } from "~constants"

const handlers = {
  [Provider.ollama]: async (text: string, config: Config) => {
    const response = await fetch(`${config.endpoint}/api/chat`, {
      method: 'POST',
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: "user", content: [
              `Rephrase this sentence in a ${config.defaultTone} tone, ONLY return the rephrased sentence text directly: `,
              `${text}`
            ].join("\n")
          }
        ],
        stream: false
      })
    })

    const json = await response.json()
    const result = json.message.content

    return result
  },
  [Provider.openai]: async (text: string, config: Config) => {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: "user", content: [
              `Rephrase this sentence in a ${config.defaultTone} tone, ONLY return the rephrased sentence text directly: `,
              `${text}`
            ].join("\n")
          }
        ],
        stream: false
      })
    })

    const json = await response.json()
    const result = json.choices[0]?.message?.content

    return result
  }
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const text = req.body.text

  const storage = new Storage()
  const config = await storage.get("config") as Config

  const handler = handlers[config.provider]
  const result = await handler(text, config)

  res.send({
    result,
  })
}

export default handler
