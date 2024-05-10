const getRephase = async function(text) {
  const res = await fetch("http://127.0.0.1:11434/api/chat", {
    method: 'POST',
    body: JSON.stringify({
      model: "llama3",
      messages: [
        { role: "user", content: [
          "Rephrase this sentence to be more reader-friendly, only return the rephrased sentence directly, don't return any other words around it, don't return the prefix Here is a rephrased version of the sentence:: ",
          `${text}`
        ].join("\n")}
      ],
      stream: false
    })
  })
  json = await res.json()
  result = json.message.content
  return result
}

chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: '1',
    title: 'rephase',
    type: 'normal',
    contexts: ['selection'],
  });

  chrome.contextMenus.onClicked.addListener(async (event) => {
    let result = ""

    if (event.selectionText) {
      result = await getRephase(event.selectionText)
    }

    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {
      result
    });
    // do something with response here, not outside the function
    console.log(response);
  })

  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("MSG", message)
    const result = await getRephase(message)

    console.log("RESULT", result)

    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    await chrome.tabs.sendMessage(tab.id, {
      result
    });

    return true
  })
});
