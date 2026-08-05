import { useContext } from 'react'
import { helmetContext } from '@/context/helmetProvider'

export type helmetContextType = {
  title: string
  keyword: string
  description: string
  setTitle: (title: string) => void
  setKeyword: (keyword: string) => void
  setDescription: (description: string) => void
  meta: any
  setMeta: (meta: any) => void
  link: any
  setLink: (link: any) => void
  script: any
  setScript: (script: any) => void
  style: string | []
  setStyle: (style: string | []) => void
}

const useHelmet = (): helmetContextType => {
  return useContext(helmetContext) as helmetContextType
}

export default useHelmet
