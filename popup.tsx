import { useStorage } from "@plasmohq/storage/hook"
import type { Config } from "~constants"
import { tones } from "~options"

import "~options/style.css"

function OptionsIndex() {
  const [config, setConfig, {
    setRenderValue,
    setStoreValue,
    remove
  }] = useStorage<Config>("config", {
    provider: "ollama",
    endpoint: "",
    apiKey: "",
    model: "",
    defaultTone: "Friendly",
  })
  const onChange = (field: string) => {
    return async (e) => {
      const newConfig = {
        ...config,
        [field]: e.target.value,
      }

      setConfig(newConfig)
      setRenderValue(newConfig)
      setStoreValue(newConfig)
    }
  }

  return (
    <div className="w-64 text-slate-600 block px-3 py-2">
      <div className="flex gap-4 items-center">
        <label className="text-sm font-medium leading-6 text-gray-900" htmlFor="model">Set Default Tone</label>
        <select name="defaultTone" defaultValue={config.defaultTone} onChange={onChange("defaultTone")} value={config.defaultTone}
          className="rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          {tones.map(tone => <option key={tone} value={tone}>{tone}</option>)}
        </select>
      </div>
    </div>
  )
}

export default OptionsIndex
