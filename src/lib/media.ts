import { CAST_ROLES, type CastRole } from './profiles'
import { THEMES, type ThemeId } from '../themes/themes'

const DB_NAME = 'sound-world-media'
const DB_VERSION = 1
const PHOTOS = 'photos'
const CARTOONS = 'cartoons'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(PHOTOS)) db.createObjectStore(PHOTOS)
      if (!db.objectStoreNames.contains(CARTOONS)) db.createObjectStore(CARTOONS)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Could not open photo storage'))
  })
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Photo storage failed'))
  })
}

function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error('Photo storage failed'))
    tx.onabort = () => reject(tx.error ?? new Error('Photo storage was cancelled'))
  })
}

function cartoonKey(role: CastRole, theme: ThemeId): string {
  return `${role}:${theme}`
}

export async function savePhoto(role: CastRole, blob: Blob): Promise<void> {
  const db = await openDb()
  const tx = db.transaction(PHOTOS, 'readwrite')
  tx.objectStore(PHOTOS).put(blob, role)
  await txDone(tx)
  db.close()
}

export async function loadPhoto(role: CastRole): Promise<Blob | null> {
  const db = await openDb()
  const tx = db.transaction(PHOTOS, 'readonly')
  const result = await requestToPromise(tx.objectStore(PHOTOS).get(role))
  await txDone(tx)
  db.close()
  return result instanceof Blob ? result : null
}

export async function deleteRoleMedia(role: CastRole): Promise<void> {
  const db = await openDb()
  const tx = db.transaction([PHOTOS, CARTOONS], 'readwrite')
  tx.objectStore(PHOTOS).delete(role)
  for (const theme of THEMES) {
    tx.objectStore(CARTOONS).delete(cartoonKey(role, theme.id))
  }
  await txDone(tx)
  db.close()
}

export async function saveCartoon(role: CastRole, theme: ThemeId, blob: Blob): Promise<void> {
  const db = await openDb()
  const tx = db.transaction(CARTOONS, 'readwrite')
  tx.objectStore(CARTOONS).put(blob, cartoonKey(role, theme))
  await txDone(tx)
  db.close()
}

export async function loadCartoon(role: CastRole, theme: ThemeId): Promise<Blob | null> {
  const db = await openDb()
  const tx = db.transaction(CARTOONS, 'readonly')
  const result = await requestToPromise(tx.objectStore(CARTOONS).get(cartoonKey(role, theme)))
  await txDone(tx)
  db.close()
  return result instanceof Blob ? result : null
}

export async function loadPhotoMap(): Promise<Partial<Record<CastRole, Blob>>> {
  const entries = await Promise.all(CAST_ROLES.map(async (role) => [role, await loadPhoto(role)] as const))
  return Object.fromEntries(entries.filter((entry): entry is [CastRole, Blob] => entry[1] instanceof Blob))
}

export async function loadCartoonMap(theme: ThemeId): Promise<Partial<Record<CastRole, Blob>>> {
  const entries = await Promise.all(
    CAST_ROLES.map(async (role) => [role, await loadCartoon(role, theme)] as const),
  )
  return Object.fromEntries(entries.filter((entry): entry is [CastRole, Blob] => entry[1] instanceof Blob))
}

export async function compressPhoto(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  try {
    const maxEdge = 640
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not prepare the photo')
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    return await blobFromCanvas(canvas, 0.72)
  } finally {
    bitmap.close()
  }
}

function frameInk(theme: ThemeId): string {
  switch (theme) {
    case 'trains':
      return '#d94f2b'
    case 'planes':
      return '#1d4e89'
    case 'dinosaurs':
      return '#2f7a3e'
    case 'farm':
      return '#8a5a12'
    case 'space':
      return '#24315c'
    case 'sea':
      return '#0e6e8a'
  }
}

function costumeMark(theme: ThemeId, role: CastRole): string {
  const pet = role === 'dog' || role === 'cat'
  if (pet) {
    if (theme === 'dinosaurs') return '🦴'
    if (theme === 'space') return '⭐'
    if (theme === 'sea') return '🐚'
    return '🎀'
  }
  switch (theme) {
    case 'trains':
      return '🧢'
    case 'planes':
      return '🧣'
    case 'dinosaurs':
      return '🎩'
    case 'farm':
      return '👒'
    case 'space':
      return '🧑‍🚀'
    case 'sea':
      return '🤿'
  }
}

/** On-device poster look. The photo is not sent anywhere. */
export async function cartoonFromPhoto(blob: Blob, theme: ThemeId, role: CastRole): Promise<Blob> {
  const bitmap = await createImageBitmap(blob)
  try {
    const size = 480
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not draw the cartoon')

    const scale = Math.max(size / bitmap.width, size / bitmap.height)
    const width = bitmap.width * scale
    const height = bitmap.height * scale
    ctx.drawImage(bitmap, (size - width) / 2, (size - height) / 2, width, height)

    const image = ctx.getImageData(0, 0, size, size)
    const data = image.data
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.round((data[i] ?? 0) / 36) * 36 + 10)
      data[i + 1] = Math.round((data[i + 1] ?? 0) / 36) * 36
      data[i + 2] = Math.max(0, Math.round((data[i + 2] ?? 0) / 36) * 36 - 6)
    }
    ctx.putImageData(image, 0, 0)

    ctx.strokeStyle = frameInk(theme)
    ctx.lineWidth = 22
    ctx.strokeRect(11, 11, size - 22, size - 22)
    ctx.fillStyle = 'rgba(255, 250, 240, 0.92)'
    ctx.beginPath()
    ctx.arc(size / 2, 78, 54, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = '72px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(costumeMark(theme, role), size / 2, 82)

    return await blobFromCanvas(canvas, 0.86)
  } finally {
    bitmap.close()
  }
}

function blobFromCanvas(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not save the picture'))), 'image/jpeg', quality)
  })
}
