import { useStorage } from "@plasmohq/storage/hook"
import { useEffect, useState } from "react"
import "./style.css"
import { Provider, type Config, tones } from "~constants"

export const providers = [
  { label: "Ollama", value: Provider.ollama },
  { label: "OpenAI", value: Provider.openai }
]

const openAIModels = [
  { label: "GPT 4", value: "gpt-4" },
  { label: "GPT 3.5 Turbo", value: "gpt-3.5-turbo" }
]

const getModels = async (config: Config) => {
  switch (config.provider) {
    case Provider.ollama:
      try {
        const url = new URL(`${config.endpoint}/api/tags`)
        const resp = await fetch(url)
        const json: { models: { name: string }[] } = await resp.json()
        return json.models.map(model => ({ name: model.name, value: model.name }))
      } catch (e) {
        console.error(e)
        return []
      }
    case Provider.openai:
      return openAIModels.map(model => ({ name: model.label, value: model.value }))
    default:
      return []
  }
}

function OptionsIndex() {
  const [config, setConfig, {
    setRenderValue,
    setStoreValue,
    remove
  }] = useStorage<Config>("config", {
    provider: "ollama",
    endpoint: "http:127.0.0.1:11434",
    apiKey: "",
    model: "",
    defaultTone: "Friendly",
  })
  const [models, setModels] = useState([])

  useEffect(() => {
    (async () => {
      const models = await getModels(config)
      if (models) {
        setModels(models)
      }
    })()
  }, [config.provider, config.endpoint])

  const onChange = (field: string) => {
    return async (e) => {
      let newConfig = {
        ...config,
        [field]: e.target.value,
      }

      if (field === "provider" || field === "endpoint") {
        const newModels = await getModels(newConfig)
        setModels(newModels)
      }

      if (field === "provider") {
        newConfig = {
          ...newConfig,
          model: models?.[0]?.value,
        }
      }

      setConfig(newConfig)
      setRenderValue(newConfig)
    }
  }

  return (
    <div className="mx-auto mt-8 container flex flex-col gap-4 text-slate-600">
      <h1 className="text-3xl font-bold">Setup LLM</h1>
      <div className="flex gap-4 items-center">
        <label className="text-sm font-medium leading-6 text-gray-900" htmlFor="provider">Provider</label>
        <select
          name="provider"
          defaultValue={config.provider}
          onChange={onChange("provider")}
          value={config.provider}
          className="w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          {providers.map(provider => (<option key={provider.value} value={provider.value}>{provider.label}</option>))}
        </select>
      </div>
      {
        config.provider === Provider.ollama ?
          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium leading-6 text-gray-900" htmlFor="endpoint">Endpoint</label>
            <input name="endpoint" defaultValue={config.endpoint} onChange={onChange("endpoint")} value={config.endpoint}
              className="w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div> : null
      }
      {
        config.provider === Provider.openai ?
          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium leading-6 text-gray-900" htmlFor="api_key">API Key</label>
            <input name="api_key" defaultValue={config.apiKey} onChange={onChange("apiKey")} value={config.apiKey}
              className="w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div> : null
      }
      <div className="flex gap-4 items-center">
        <label className="text-sm font-medium leading-6 text-gray-900" htmlFor="model">Model</label>
        <select name="model" defaultValue={config.model} onChange={onChange("model")} value={config.model}
          className="w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          <option value=""></option>
          {models.map(model => <option key={model.value} value={model.value}>{model.name}</option>)}
        </select>
      </div>
      <div className="flex gap-4 items-center">
        <label className="text-sm font-medium leading-6 text-gray-900" htmlFor="model">Default Tone</label>
        <select name="defaultTone" defaultValue={config.defaultTone} onChange={onChange("defaultTone")} value={config.defaultTone}
          className="w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          {tones.map(tone => <option key={tone} value={tone}>{tone}</option>)}
        </select>
      </div>
      <div>
        <button
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={(e) => {
            setStoreValue(config)
            e.currentTarget.innerText = "Saved"
          }}
        >Save</button>
      </div>
    </div>
  )
}

export default OptionsIndex
