import { TenderInStateTexts, TenderOutStateTexts } from '@/constants/procurement'
import { unixChangeRender } from '@/pages/procurementAbility/callForBids/addNewBid/constant'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

/** 参数字段转换为form数据 */
export const fieldTransformRender = (params) => {
  let result: any = {}
  result['inviteTenderId'] = params.id
  result['inviteTenderCode'] = params.code
  result['remark'] = params.remark
  result['memberName'] = params.memberName
  result['inviteTenderArea'] = params.inviteTenderAreaList
    .map((item) => item.provinceName + '' + item.cityName)
    .join('/')
  result['createTime'] = unixChangeRender(params.createTime)
  result['registerStartTime'] = unixChangeRender(params.registerStartTime)
  result['registerEndTime'] = unixChangeRender(params.registerEndTime)
  result['registerRequirement'] = params.registerRequirement
  result['registerNeedFile'] = params.registerFile
  result['inviteTenderMember'] = params.submitTenderMemberName
  result['submitTenderOutStatus'] = params.submitTenderOutStatusValue
  result['submitTenderInStatus'] = params.submitTenderInStatusValue

  // // 给地址控件赋初值
  // result['tenderAddress'] = [{ provinceCode: null, province: null, cityCode: null, city: null, areaCode: null, area: null }]

  return result
}

/** form数据转换成提交数据 */
export const formDataTransformParams = (param) => {
  let params: any = { ...param }
  params['provinceName'] = params.tenderAddress[0].province
  params['cityName'] = params.tenderAddress[0].city
  params['provinceCode'] = params.tenderAddress[0].provinceCode
  params['cityCode'] = params.tenderAddress[0].cityCode
  params['regionCode'] = params.tenderAddress[0].areaCode
  params['regionName'] = params.tenderAddress[0].area

  return params
}

// 选择商品和会员弹框的列
export const columnsSetMember: any[] = [
  {
    title: 'ID',
    dataIndex: 'memberId',
    align: 'center',
    key: 'memberId',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.memberName' }),
    dataIndex: 'name',
    align: 'center',
    key: 'name',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.memberType' }),
    dataIndex: 'memberTypeName',
    align: 'center',
    key: 'memberTypeName',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.role' }),
    dataIndex: 'roleName',
    align: 'center',
    key: 'roleName',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.leveTag' }),
    dataIndex: 'levelTag',
    align: 'center',
    key: 'levelTag',
  },
]
