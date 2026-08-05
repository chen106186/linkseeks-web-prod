import ACTION_TYPES from '../actionTypes'
import { createActions } from '../../utils'
import { PageConfigType } from '../../types'

export const updatePageConfig = (payload: PageConfigType) =>
  createActions({ type: ACTION_TYPES.updatePageConfig, payload })
