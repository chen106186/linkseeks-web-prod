import { getEnv, isWindow } from '.'

const SOCKET_PROTOCOL = isWindow ? (location.protocol === 'https:' ? 'wss' : 'ws') : 'ws'

const getWebSocketControlHeader = !isWindow ? '' : SOCKET_PROTOCOL

// socket的链接地址， 默认会使用后端接口网关地址
export const SOCKET_URL = getEnv('BACK_GATEWAY')?.replace(/^https?/, getWebSocketControlHeader)
