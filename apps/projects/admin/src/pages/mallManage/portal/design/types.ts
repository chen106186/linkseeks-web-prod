export interface DesingConfigItemType {
  name: string
  status: boolean
  sort?: number
  content: any
}

export type PlatformConfigType = DesingConfigItemType[]
