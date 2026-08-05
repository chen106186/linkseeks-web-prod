import React from 'react'
import { TagsPaneProps } from './Pane'

export type ActiveKeyType = string

export interface TagsPane extends TagsPaneProps {
  key: string
  name: React.ReactNode
  node: React.ReactElement
  id: string
}
