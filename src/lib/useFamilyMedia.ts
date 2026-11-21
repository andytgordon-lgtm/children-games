import { useEffect, useState } from 'react'
import { CAST_ROLES, type CastRole } from './profiles'
import { loadCartoonMap, loadPhotoMap } from './media'
import type { ThemeId } from '../themes/themes'

export type MediaUrls = Partial<Record<CastRole, string>>

export function useFamilyMedia(theme: ThemeId) {
  const [photos, setPhotos] = useState<MediaUrls>({})
  const [cartoons, setCartoons] = useState<MediaUrls>({})
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    const created: string[] = []

    void (async () => {
      const [photoBlobs, cartoonBlobs] = await Promise.all([loadPhotoMap(), loadCartoonMap(theme)])
      if (cancelled) return
      const nextPhotos: MediaUrls = {}
      const nextCartoons: MediaUrls = {}
      for (const role of CAST_ROLES) {
        const photo = photoBlobs[role]
        if (photo) {
          const url = URL.createObjectURL(photo)
          created.push(url)
          nextPhotos[role] = url
        }
        const cartoon = cartoonBlobs[role]
        if (cartoon) {
          const url = URL.createObjectURL(cartoon)
          created.push(url)
          nextCartoons[role] = url
        }
      }
      setPhotos(nextPhotos)
      setCartoons(nextCartoons)
    })()

    return () => {
      cancelled = true
      for (const url of created) URL.revokeObjectURL(url)
    }
  }, [theme, version])

  return {
    photos,
    cartoons,
    refresh: () => setVersion((value) => value + 1),
  }
}
