import { action, makeObservable, observable, runInAction } from 'mobx'
import { RootStoreModel } from '../rootStore/model'
import { CreateStoreModel, FileUploadVO } from './model'

export default class CreateStore implements CreateStoreModel {
  private rootStore: RootStoreModel

  vendorMemberId = undefined
  vendorRoleId = undefined
  vendorMemberName = undefined
  deliverTime = undefined
  departmentId = undefined
  department = undefined
  purpose = undefined
  digest = undefined
  products: any[] = []
  advanceDeliveryDate = undefined
  deliveryMethod = undefined
  deliveryType = undefined
  deliveryAddress = undefined
  deliveryAddressId = undefined
  requisitionerId = undefined
  requisitioner = undefined
  attachments: FileUploadVO[] = []
  constructor(rootStore: RootStoreModel) {
    makeObservable(this, {
      vendorMemberId: observable,
      vendorRoleId: observable,
      vendorMemberName: observable,
      deliverTime: observable,
      departmentId: observable,
      department: observable,
      purpose: observable,
      digest: observable,
      products: observable,
      advanceDeliveryDate: observable,
      deliveryMethod: observable,
      deliveryType: observable,
      deliveryAddress: observable,
      deliveryAddressId: observable,
      requisitionerId: observable,
      requisitioner: observable,
      attachments: observable,
      setAttachments: action.bound,
      setCreateValues: action.bound,
      setCreateValuesMaps: action.bound,
      clearStore: action.bound,
    })
    this.rootStore = rootStore
  }

  setCreateValues(key: string, value: any) {
    this[key] = value
  }

  setAttachments(data: FileUploadVO[]) {
    this.attachments = data
  }

  setCreateValuesMaps(data: any) {
    for (let key in data) {
      if (key in this) {
        this[key] = data[key]
      }
    }
  }

  clearStore() {
    const _list = [
      'vendorMemberId',
      'vendorRoleId',
      'vendorMemberName',
      'deliverTime',
      'departmentId',
      'department',
      'purpose',
      'digest',
      'products',
      'advanceDeliveryDate',
      'deliveryMethod',
      'deliveryType',
      'deliveryAddress',
      'deliveryAddressId',
      'requisitionerId',
      'requisitioner',
      'attachments',
    ]
    for (let key in _list) {
      if (_list[key] === 'products' || _list[key] === 'attachments') {
        this[_list[key]] = []
      } else {
        this[_list[key]] = undefined
      }
    }
  }
}
