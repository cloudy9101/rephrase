// import { sendToBackground } from "@plasmohq/messaging";
// import { type PlasmoCSConfig } from "plasmo";
//
// export const config: PlasmoCSConfig = {
// }
//
// const getRephase = async (text: string) => {
//   const resp = await sendToBackground({
//     name: "rephase",
//     body: {
//       text,
//     },
//     extensionId: 'lmgmonmajdobnmpenbhmaillghcnnddh' // find this in chrome's extension manager
//   })
//
//   return resp
// }
//
// const getActiveTextInput = (): HTMLTextAreaElement | HTMLInputElement => {
//   // Get the active element
//   const activeElement = document.activeElement;
//
//   // Check if the active element is a text input or textarea
//   if (activeElement && (activeElement.tagName.toLowerCase() === 'input' || activeElement.tagName.toLowerCase() === 'textarea')) {
//     return activeElement as HTMLTextAreaElement | HTMLInputElement;
//   }
// }
//
// document.addEventListener("focusin", () => {
//   const element = getActiveTextInput()
//   if (!element) {
//     return
//   }
//
//   if (element.getAttribute("data-better-comment-init") === "true") {
//     return
//   }
//
//   const button = document.createElement("button")
//   button.textContent = "Rephase"
//   button.classList.add("btn", "btn-sm")
//   button.addEventListener('click', async (e) => {
//     e.preventDefault()
//
//     const text = element.value
//     const resp = await getRephase(text)
//     element.value = resp.result
//   })
//   element.parentElement.append(button)
//
//   element.setAttribute("data-better-comment-init", "true")
// })
