import { sendToContentScript, type PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { type Config, tones } from "~constants"

export const rephrase = async (text: string, tone: (typeof tones)[0], stream: boolean) => {
  const response = await fetch(`http://127.0.0.1:11434/api/chat`, {
    method: 'POST',
    body: JSON.stringify({
      model: 'llama3:latest',
      messages: [
        {
          role: "user", content: [
            `Rephrase this sentence in a ${tone} tone, ONLY return the rephrased sentence text directly: `,
            `${text}`
          ].join("\n")
        }
      ],
      stream,
    })
  })

  const body = response.body
  const decoderStream = new TextDecoderStream()
  const pipe = body.pipeThrough(decoderStream)
  const reader = pipe.getReader()

  return reader
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const text = req.body.text

  const storage = new Storage()
  const config = await storage.get("config") as Config

  const response = await rephrase(text, config.defaultTone, true)

  let result: ReadableStreamReadResult<string>
  while (!result?.done) {
    result = await response.read();
    const json = JSON.parse(result.value)

    await sendToContentScript({
      name: "rephrase",
      body: {
        text: json.message.content,
      },
      extensionId: 'lmgmonmajdobnmpenbhmaillghcnnddh'
    })
  }

  res.send(response)
}

export default handler
