/**
 * 做一些常量的定义
 */
import { getEnv } from '../utils/taro'

/**
 * 当前运行环境
 */
export const CURRENT_ENV = getEnv()

/**
 * 是否h5
 * 目前只做h5和微信小程序
 */
export const IS_WEB = CURRENT_ENV === 'WEB'
