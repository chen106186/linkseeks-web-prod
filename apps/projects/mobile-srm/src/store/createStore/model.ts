export interface FileUploadVO {
  name: string
  url: string
  goodsName?: string
}

export interface CreateStoreModel {
  vendorMemberId: number | undefined
  vendorRoleId: number | undefined
  vendorMemberName: string | undefined
  deliverTime: string | undefined
  departmentId: number | undefined
  department: string | undefined
  purpose: string | undefined
  digest: string | undefined
  products: any[]
  advanceDeliveryDate: string | undefined
  deliveryMethod: number | undefined
  deliveryType: number | undefined
  deliveryAddress: string | undefined
  deliveryAddressId: number | undefined
  requisitionerId: number | undefined
  requisitioner: string | undefined
  attachments: FileUploadVO[]
  setCreateValues: (key: string, value: any) => void
  setAttachments: (data: FileUploadVO[]) => void
  setCreateValuesMaps: (data: any) => void
  clearStore: () => void
}
