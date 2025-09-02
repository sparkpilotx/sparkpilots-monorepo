import { app, safeStorage } from 'electron'
import { ProxyAgent, setGlobalDispatcher } from 'undici'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

type EncryptedBlob = {
  v: 1
  dataB64: string
}

function getProxyConfigPath(): string {
  const dir = app.getPath('userData')
  return path.join(dir, 'proxy.json')
}

export function configureGlobalUndiciProxy(proxyUrl?: string): void {
  const urlToUse = proxyUrl ?? loadProxyUrl()
  if (!urlToUse) return
  const agent = new ProxyAgent(urlToUse)
  setGlobalDispatcher(agent)
}

export function loadProxyUrl(): string | null {
  try {
    const file = getProxyConfigPath()
    const raw = readFileSync(file, 'utf8')
    const parsed = JSON.parse(raw) as EncryptedBlob
    if (!parsed || typeof parsed.dataB64 !== 'string') return null
    const bytes = Buffer.from(parsed.dataB64, 'base64')
    if (!safeStorage.isEncryptionAvailable()) {
      return null
    }
    return safeStorage.decryptString(bytes)
  } catch {
    return null
  }
}

export function saveProxyUrl(url: string): void {
  if (!safeStorage.isEncryptionAvailable()) return
  const encrypted = safeStorage.encryptString(url)
  const blob: EncryptedBlob = {
    v: 1,
    dataB64: Buffer.from(encrypted).toString('base64')
  }
  const file = getProxyConfigPath()
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, JSON.stringify(blob), 'utf8')
}

export function hasStoredProxyUrl(): boolean {
  return loadProxyUrl() != null
}

export const __internal = {
  getProxyConfigPath
}
