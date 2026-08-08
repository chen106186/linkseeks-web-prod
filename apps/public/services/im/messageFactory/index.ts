import { IMMESSAGE } from './common'
import { TextMessage } from './TextMessage'

export type MESSAGE_TYPE = 'text'
// 消息工厂类，用于创建不同类型的消息
export class MessageFactory {
  static createMessage(type: MESSAGE_TYPE, sender: string, timestamp: number, content: any): IMMESSAGE {
    switch (type) {
      case 'text':
        return new TextMessage(sender, timestamp, content)
      // case 'emoji':
      // 		return new EmojiMessage(sender, timestamp, content);
      // case 'image':
      // 		return new ImageMessage(sender, timestamp, content);
      // case 'order':
      // 		return new OrderMessage(sender, timestamp, content.orderId, content.orderDetails);
      // case 'product':
      // 		return new ProductMessage(sender, timestamp, content.productId, content.productName, content.productPrice);
      default:
        throw new Error('Unknown message type')
    }
  }

  static getNowTime() {
    return new Date().getTime()
  }
}
