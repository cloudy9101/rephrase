// Context menu listener
chrome.runtime.onMessage.addListener(
  async function(message, _, sendResponse) {
    if (message.result) {
      const textarea = document.activeElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      var before = textarea.value.slice(0, start);
      var after = textarea.value.slice(end);

      var text = before + message.result + after;
      textarea.value = text;

      sendResponse({
        error: null,
        message: "ok"
      });
      return true
    }

    sendResponse({
      error: "Unknown message format",
      message: message
    });
    return true
  }
);

const init = function() {
  // Add rephase button
  const elements = document.getElementsByName('comment[body]')
  elements.forEach(function(element) {
    const btn = document.createElement("button")
    btn.textContent = "Rephase"
    btn.classList.add("btn")
    btn.addEventListener("click", async function(e) {
      e.preventDefault()

      element.focus()
      element.selectionStart = 0
      element.selectionEnd = element.value.length + 1

      await chrome.runtime.sendMessage(element.value)
    })
    element.parentNode.appendChild(btn)
  })
}

window.addEventListener("turbo:load", init)
