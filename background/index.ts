import { sendToContentScript } from "@plasmohq/messaging"
import { rephrase } from "./messages/rephrase"
import type { Config } from "~constants"
import { Storage } from "@plasmohq/storage"

chrome.contextMenus.onClicked.addListener(async function(info) {
  if (!info.editable) {
    return
  }

  const { selectionText, editable } = info
  if (!editable) {
    return
  }

  if (!selectionText || selectionText === "") {
    await sendToContentScript({
      name: "rephrase",
      body: {
        noSelectionText: true,
      },
      extensionId: 'lmgmonmajdobnmpenbhmaillghcnnddh'
    })

    return
  }

  const storage = new Storage()
  const config = await storage.get("config") as Config
  const response = await rephrase(selectionText, config.defaultTone, true)
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
})

chrome.runtime.onInstalled.addListener(function() {
  const title = "Rephrase";
  chrome.contextMenus.create({
    title: title,
    contexts: ["selection", "editable"],
    id: "rephrase-selection",
  });
})
