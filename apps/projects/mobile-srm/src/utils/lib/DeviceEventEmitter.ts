import { eventCenter } from '@apps/mobile-services/utils/taro'
import { EmitterSubscription } from './lib'

const DeviceEventEmitter = {
  addListener: (eventName: string, params: any) => {
    eventCenter.on(eventName, params)
    return {
      eventType: eventName,
      remove: () => {
        eventCenter.off(eventName, params)
      },
    } as EmitterSubscription
  },
  emit: (eventName: string, params?: any) => {
    eventCenter.trigger(eventName, params)
  },
}

export default DeviceEventEmitter
