import { TUIChatService } from '@tencentcloud/chat-uikit-engine'

export const sendCustomMessage = (info, type: 'order' | 'commodity' | 'after', payload?) => {
  TUIChatService.sendCustomMessage({
    payload: {
      data: JSON.stringify({
        info,
        type,
        payload,
      }),
      description: '',
      extension: '',
    },
  })
}
