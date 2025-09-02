import { app, safeStorage } from 'electron'
import { ProxyAgent, setGlobalDispatcher, Agent } from 'undici'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

type Stored = { dataB64: string }
type ProxyConfig = { url: string | null }

function getProxyConfigPath(): string {
  const dir = app.getPath('userData')
  return path.join(dir, 'proxy.json')
}

function getSecretsPath(): string {
  const dir = app.getPath('userData')
  return path.join(dir, 'secrets.json')
}

export function applyProxyFromStorage(): void {
  const { url } = loadProxyConfig()
  // Main process (Undici) should always use proxy if URL exists, regardless of toggle
  if (url) setGlobalDispatcher(new ProxyAgent(url))
  else setGlobalDispatcher(new Agent())
}

export function loadProxyConfig(): ProxyConfig {
  try {
    const file = getProxyConfigPath()
    const raw = readFileSync(file, 'utf8')
    const parsed = JSON.parse(raw) as Partial<Stored>
    if (!parsed || typeof parsed.dataB64 !== 'string') {
      return { url: null }
    }
    const bytes = Buffer.from(parsed.dataB64, 'base64')
    if (!safeStorage.isEncryptionAvailable()) {
      return { url: null }
    }
    const url = safeStorage.decryptString(bytes)
    return { url }
  } catch {
    return { url: null }
  }
}

export function saveProxyUrl(url: string): void {
  if (!safeStorage.isEncryptionAvailable()) return
  const encrypted = safeStorage.encryptString(url)
  const blob: Stored = { dataB64: Buffer.from(encrypted).toString('base64') }
  const file = getProxyConfigPath()
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, JSON.stringify(blob), 'utf8')
  // Re-apply with possibly new URL when enabled
  applyProxyFromStorage()
}

export function hasStoredProxyUrl(): boolean {
  const { url } = loadProxyConfig()
  return url != null
}

// Internals are intentionally not exported to keep module encapsulation tight per GEMINI.md

type SecretStored = { dataB64: string }

export function saveGeminiApiKey(key: string): void {
  if (!safeStorage.isEncryptionAvailable()) return
  const encrypted = safeStorage.encryptString(key)
  const file = getSecretsPath()
  mkdirSync(path.dirname(file), { recursive: true })
  const payload: SecretStored = {
    dataB64: Buffer.from(encrypted).toString('base64')
  }
  writeFileSync(file, JSON.stringify(payload), 'utf8')
}

export function loadGeminiApiKey(): string | null {
  try {
    const file = getSecretsPath()
    const raw = readFileSync(file, 'utf8')
    const parsed = JSON.parse(raw) as Partial<SecretStored>
    if (!parsed || typeof parsed.dataB64 !== 'string') return null
    const bytes = Buffer.from(parsed.dataB64, 'base64')
    if (!safeStorage.isEncryptionAvailable()) return null
    return safeStorage.decryptString(bytes)
  } catch {
    return null
  }
}
