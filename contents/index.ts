import { sendToBackground } from "@plasmohq/messaging"

chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
  const noSelectionText = message.body.noSelectionText
  if (noSelectionText) {
    document.execCommand("selectAll")

    const text = document.getSelection().toString()
    await sendToBackground({
      name: "rephrase",
      body: {
        text,
      },
      extensionId: 'lmgmonmajdobnmpenbhmaillghcnnddh'
    })

    sendResponse({
      text,
    })
    return
  }

  const text = message.body.text

  document.execCommand("insertText", true, text)

  sendResponse({
    text,
  })
})
