import { useState, useReducer, useCallback } from 'react'

// 写入一些全局共享状态

export const useGlobal = () => {
  const [GlobalState, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'SET_SELECT_KEY': {
        return Object.assign({}, state, action.key)
      }

      default: return state
    }
  }, {menuSelectKey: ''})

  return [
    GlobalState,
    dispatch
  ]
}