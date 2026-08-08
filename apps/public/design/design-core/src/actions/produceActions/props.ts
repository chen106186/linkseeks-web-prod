import ACTION_TYPES from '../actionTypes'
import { createActions } from '../../utils'

export type ChangePropsPayload = {
  props: any
  title?: any
  treeKey?: string
  [key: string]: any
}

export type ChangeStatePropsPayload = {
  props: any
  currentKey: string
}

export const changeProps = (payload: ChangePropsPayload) =>
  createActions({
    type: ACTION_TYPES.changeProps,
    payload,
  })

export const changePropsByKey = (payload: ChangePropsPayload) =>
  createActions({
    type: ACTION_TYPES.changePropsByKey,
    payload,
  })

export const changeStatusProps = (payload: ChangeStatePropsPayload) =>
  createActions({
    type: ACTION_TYPES.changeStatusProps,
    payload,
  })

export const resetProps = () => createActions({ type: ACTION_TYPES.resetProps })
