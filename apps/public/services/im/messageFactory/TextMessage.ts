import { IMMESSAGE } from './common'

/**
 * 消息类型
 */
export class TextMessage extends IMMESSAGE {
  constructor(public sender: string, public timestamp: number, public content: string) {
    super(sender, timestamp)
  }
  render() {
    return this.content
  }
}
