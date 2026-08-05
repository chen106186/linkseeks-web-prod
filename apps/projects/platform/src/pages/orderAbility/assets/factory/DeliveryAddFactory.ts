import { FormInstance } from 'antd'
import { DeliveryNoteAddService, ReceivingNoteB2BAddService } from '../handles/HandleFormSubmit'

export enum DeliveryNoteAddType {
  B2B = 1,
  SRM = 2,
}
export class DeliveryAddFactory {
  static instance

  static getInstance(target: DeliveryNoteAddType = 2) {
    if (target === DeliveryNoteAddType.SRM) {
      return new DeliveryNoteAddService()
    }

    if (target === DeliveryNoteAddType.B2B) {
      return new ReceivingNoteB2BAddService()
    }
  }
}
