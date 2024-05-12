export enum Provider {
  ollama = "ollama",
  openai = "openai"
}

export interface Config {
  provider: string
  endpoint?: string
  apiKey?: string
  model: string
  defaultTone: string
}

export const tones = [
  "Friendly",
  "Professional",
  "Playful",
  "Supportive"
]

