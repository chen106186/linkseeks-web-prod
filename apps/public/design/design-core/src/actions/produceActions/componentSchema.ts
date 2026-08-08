import ACTION_TYPES from '../actionTypes'
import { createActions } from '../../utils'
import { ParentNodeInfo } from '../../types'

export interface CopyCurrentType {
  key: string
  parentKey
  parentPropName
}

export interface AddType {
  parentKey?: string
  position?: string
  componentName: string
  componentProps?: Record<string, any>
  addBefore?: boolean
  reset?: Record<string, any>
  maxLength?: number
  callback?: (key: string) => void
}

export const addChildComponent = (payload: AddChildPayload) =>
  createActions({ type: ACTION_TYPES.addChildComponent, payload })

export const addComponent = () => createActions({ type: ACTION_TYPES.addComponent })

export const addComponentByName = (payload: AddType) =>
  createActions({ type: ACTION_TYPES.addComponentByName, payload })

export const copyComponent = () => createActions({ type: ACTION_TYPES.copyComponent })

export const copyCurrentComponent = (payload: CopyCurrentType) =>
  createActions({ type: ACTION_TYPES.copyCurrentComponent, payload })

export type DragInfoType = ParentNodeInfo & { key: string }

export type AddChildPayload = {
  newKey: string
  componentName: string
  parentPropName: string
  parentKey: string
  [key: string]: any
}

export type LayoutSortPayload = ParentNodeInfo & {
  sortKeys: string[]
  dragInfo?: DragInfoType
}

export type ResetCurrentComponentPayload = {
  parentKey?: string
  childrenNode: {
    key: string
    componentName: string
    title: string
    props: any
  }[]
  title?: string
  props: any
}

export type DeleteComponentByKeyPayload = {
  key: string
  parentKey: string
  parentPropName: string
}

export const onLayoutSortChange = (payload: LayoutSortPayload) =>
  createActions({
    type: ACTION_TYPES.onLayoutSortChange,
    payload,
  })
export const deleteComponent = () => createActions({ type: ACTION_TYPES.deleteComponent })

export const deleteComponentByKey = (payload: DeleteComponentByKeyPayload) =>
  createActions({ type: ACTION_TYPES.deleteComponentByKey, payload })

export const clearChildNodes = () => createActions({ type: ACTION_TYPES.clearChildNodes })

export const resetCurrentComponent = (payload: ResetCurrentComponentPayload) =>
  createActions({ type: ACTION_TYPES.resetCurrentComponent, payload })
