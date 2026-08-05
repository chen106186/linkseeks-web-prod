import { StateType, PageConfigType } from '../types'
import produce from 'immer'

export function updatePageConfig(state: StateType, payload: PageConfigType): StateType {
  const { pageConfig, undo, redo } = state
  undo.push({ pageConfig })
  redo.length = 0
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldState) => {
      const _oldKeys = Object.keys(oldState)
      const _newKeys = Object.keys(payload)
      if (_newKeys.length >= _oldKeys.length) {
        for (let key in payload) {
          oldState[key] = payload[key]
        }
      } else {
        let _filter = _oldKeys.filter((item) => {
          if (!_newKeys.includes(item)) {
            return item
          }
        })
        for (let key in payload) {
          oldState[key] = payload[key]
        }
        for (let keys in _filter) {
          delete oldState[_filter[keys]]
        }
      }
    }),
    undo,
    redo,
  }
}
