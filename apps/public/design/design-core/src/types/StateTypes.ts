import { Action } from 'redux'
import { ActionType, VirtualDOMType } from '@apps/design-utils'
import { PropsConfigType } from './ComponentSchemaTypes'

export type PropsNodeType = {
  [propName: string]: string[] | undefined
}

export type PlainObjectType = { [key: string]: any }

export type ChildNodesType = string[] | PropsNodeType

export interface ParentNodeInfo {
  parentKey: string
  parentPropName?: string
}

export type PropsType = {
  [propName: string]: ActionType | any
}

export interface SelectedInfoBaseType extends ParentNodeInfo {
  key: string
  domTreeKeys: string[]
}

export type SelectedInfoType = Omit<SelectedInfoBaseType, 'key'> & {
  selectedKey: string
  propName?: string
  props?: any
  propsConfig: PropsConfigType
}

export interface DragSourceType extends Partial<ParentNodeInfo> {
  vDOMCollection?: PageConfigType
  dragKey?: string
}

export interface DropTargetType {
  selectedKey: string
  propName?: string
  domTreeKeys: string[]
  childNodeKeys: string[]
}

export type PlatformStyleType = (number | string)[]

export interface PlatformInfoType {
  isMobile: boolean
  size: PlatformStyleType
}

export interface PageConfigType {
  [key: string]: VirtualDOMType
}

export interface DesignConfigType {
  [key: string]: {
    /** 是否显示索引 */
    showIndex?: boolean
    /** 不显示在组件树上 */
    canHide?: boolean
    /** 是否一级菜单 */
    firstLevel?: boolean
    /** 是否可以复制 */
    canCopy?: boolean
    /** 是否可以编辑 */
    canEdit?: boolean
    /** 是否可以拖拽 */
    canDrag?: boolean
    /** 是否显示隐藏按钮 */
    hideAction?: boolean
    /** 是否可以删除 */
    canDelete?: boolean
    maxLength?: number
    props?: Record<string, any>
    childProps?: Record<string, any>
    childComponentName?: string
    sort?: number
    children?: DesignConfigType[] &
      {
        title?: string
        hideAction?: boolean
        props?: Record<string, any>
        componentName?: string
        childComponentName?: string
      }[]
    childNodes?: DesignConfigType[]
  }
}

export interface BrickAction extends Action<string> {
  payload?: any
}

export type UndoRedoType = Partial<Omit<StateType, 'undo' | 'redo'>>

export type StateType = {
  pageConfig: PageConfigType
  selectedInfo: SelectedInfoType | null
  undo: UndoRedoType[]
  redo: UndoRedoType[]
  hoverKey: null | string
  dragSource: DragSourceType | null
  dropTarget: null | DropTargetType
  platformInfo: PlatformInfoType
  dragSort?: null | string[]
}

export interface BrickDesignStateType {
  [pageName: string]: StateType | string
}
export type STATE_PROPS = keyof StateType

export const PAGECONFIG_PROPS_KEYS = [
  /** 不显示在组件树上 */
  'canHide',
  /** 是否一级菜单 */
  'firstLevel',
  /** 是否可以复制 */
  'canCopy',
  /** 是否可以编辑 */
  'canEdit',
  /** 是否可以拖拽 */
  'canDrag',
  /** 是否显示隐藏按钮 */
  'hideAction',
  /** 是否可以删除 */
  'canDelete',
  'childComponentName',
  'maxLength',
]
