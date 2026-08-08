import React from 'react'
import moment from 'moment'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { BidInStateTexts, BidOutStateTexts } from '@/constants/procurement'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()

/** 时间转时间戳 */
export const dataChangeUnix = (t) => moment(t).valueOf()

/** 时间戳转datapicker所需格式 */
export const unixChangeRender = (t) => (t ? moment(t).format('YYYY-MM-DD HH:mm:ss') : null)

/** 文件数组转url字符串数组 */
export const fileChangeStringArray = (arr) =>
  arr.map((item) => {
    const { pageStatus } = usePageStatus()
    let param = {
      id: item.id,
      name: item.name.split('/').pop(),
      url: item.url,
    }
    if (pageStatus === PageStatus.ADD) {
      delete param.id
    }
    return param
  })

const isAll = (element) => {
  return element.some((item) => item['provinceCode'] === '0' && item['cityCode'] === '0')
}
/** 传参 数据转换 id：判断是否编辑 */
export const paramsConversionFn = (value, pageStatus) => {
  const _value = { ...value }
  value['evaluationStartTime'] = dataChangeUnix(_value['evaluationStartTime'])
  value['evaluationEndTime'] = dataChangeUnix(_value['evaluationEndTime'])
  value['inviteTenderStartTime'] = dataChangeUnix(_value['inviteTenderStartTime'])
  value['inviteTenderEndTime'] = dataChangeUnix(_value['inviteTenderEndTime'])
  value['hopeDate'] = dataChangeUnix(_value['hopeDate'])
  value['openTenderTime'] = dataChangeUnix(_value['openTenderTime'])
  value['preCheckStartTime'] = dataChangeUnix(_value['preCheckStartTime'])
  value['preCheckEndTime'] = dataChangeUnix(_value['preCheckEndTime'])
  value['registerStartTime'] = dataChangeUnix(_value['registerStartTime'])
  value['registerEndTime'] = dataChangeUnix(_value['registerEndTime'])
  if (value?.evaluationFile && value.evaluationFile.length)
    value['evaluationFile'] = fileChangeStringArray(_value['evaluationFile'])
  if (value?.inviteTenderFile && value.inviteTenderFile.length)
    value['inviteTenderFile'] = fileChangeStringArray(_value['inviteTenderFile'])
  if (value?.preCheckFile && value.preCheckFile.length)
    value['preCheckFile'] = fileChangeStringArray(_value['preCheckFile'])
  if (value?.registerFile && value.registerFile.length)
    value['registerFile'] = fileChangeStringArray(_value['registerFile'])
  value['materielList'] = _value?.materielList
    ? _value['materielList'].map((item) => {
        if (item?.file && item.file.length) {
          return {
            ...item,
            file: item['file'].map((_item) => {
              let param = {
                id: _item.id,
                name: _item.name.split('/').pop(),
                url: _item['url'],
              }
              if (pageStatus === PageStatus.ADD) {
                delete param.id
              }
              return param
            }),
          }
        } else {
          return { ...item }
        }
      })
    : []
  if (value?.memberList?.length) {
    value['memberList'] = _value['memberList'].map((item) => {
      let param = {
        id: item.id,
        memberName: item.name,
        memberRoleId: item.roleId,
        memberRoleName: item.roleName,
        ...item,
      }
      if (pageStatus === PageStatus.ADD) {
        delete param.id
      }
      return param
    })
  }
  // 增加不限区域和城市字段
  // if (value?.inviteTenderAreaList?.length > 0) {
  if (value?.inviteTenderAreaList?.length > 0 && !isAll(value.inviteTenderAreaList)) {
    value.isAllArea = false
  } else {
    value.isAllArea = true
  }
  value['inviteTenderAreaList'] = _value.inviteTenderAreaList.map((item) => {
    let param = {
      id: item.id,
      provinceCode: item.provinceCode,
      provinceName: item.province,
      cityCode: item.cityCode,
      cityName: item.city,
      isAllCity: item?.cityCode !== '0' ? false : true,
    }
    if (pageStatus === PageStatus.ADD) {
      delete param.id
    }
    return param
  })

  return value
}

/** 回显 数据转换 */
export const paramsRenderFn = (value) => {
  const _value = { ...value }
  value['evaluationStartTime'] = unixChangeRender(_value['evaluationStartTime'] || null)
  value['evaluationEndTime'] = unixChangeRender(_value['evaluationEndTime'] || null)
  value['inviteTenderStartTime'] = unixChangeRender(_value['inviteTenderStartTime'])
  value['inviteTenderEndTime'] = unixChangeRender(_value['inviteTenderEndTime'])
  value['hopeDate'] = unixChangeRender(_value['hopeDate'])
  value['openTenderTime'] = unixChangeRender(_value['openTenderTime'])
  value['preCheckStartTime'] = unixChangeRender(_value['preCheckStartTime'])
  value['preCheckEndTime'] = unixChangeRender(_value['preCheckEndTime'])
  value['registerStartTime'] = unixChangeRender(_value['registerStartTime'])
  value['registerEndTime'] = unixChangeRender(_value['registerEndTime'])
  value['createTime'] = unixChangeRender(_value['createTime'])

  // 状态转换
  value['inviteTenderInStatus'] = _value['inviteTenderInStatusValue']
  value['inviteTenderOutStatus'] = _value['inviteTenderOutStatusValue']

  value['addMode'] = 1

  if (value?.targetPrice) {
    value['hasAimPrice'] = true
  }

  if (value?.inviteTenderAreaList?.length) {
    value['inviteTenderAreaList'] = _value['inviteTenderAreaList'].map((item) => {
      return {
        ...item,
        province: item.provinceName,
        city: item.cityName,
      }
    })
  }

  if (value?.memberList?.length) {
    value['memberList'] = _value['memberList'].map((item) => {
      return {
        ...item,
        name: item.memberName,
        roleId: item.memberRoleId,
        roleName: item.memberRoleName,
      }
    })
  }

  if (value?.materielList?.length) {
    value['materielList'] = _value['materielList'].map((item) => {
      return {
        ...item,
        categoryId: item.categoryId.split(',').map((item) => item.replaceAll('|', '')),
      }
    })
  }

  return value
}

// 招标物料列
export const materialInfoColumns: any[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    align: 'center',
    key: 'id',
    className: 'commonHide',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.materialCode' }),
    dataIndex: 'code',
    align: 'center',
    key: 'code',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.materialName' }),
    dataIndex: 'name',
    align: 'center',
    key: 'name',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.type' }),
    dataIndex: 'type',
    align: 'center',
    key: 'type',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.customerCategory' }),
    dataIndex: 'categoryName',
    align: 'center',
    key: 'categoryName',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.categoryId' }),
    dataIndex: 'categoryId',
    align: 'center',
    key: 'categoryId',
    className: 'commonHide',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.brand' }),
    dataIndex: 'brandName',
    align: 'center',
    key: 'brandName',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.unitName' }),
    dataIndex: 'unitName',
    align: 'center',
    key: 'unitName',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.unitNameId' }),
    dataIndex: 'unitId',
    align: 'center',
    key: 'unitId',
    className: 'commonHide',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.isList' }),
    dataIndex: 'has',
    align: 'center',
    key: 'has',
    className: 'commonHide',
    render: (text) => (text ? translate('web.common.shi') : translate('web.common.fou')),
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.purchaseCount' }),
    dataIndex: 'count',
    align: 'center',
    key: 'count',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.option' }),
    dataIndex: 'ctl',
    align: 'center',
    key: 'ctl',
  },
]

// 招标方式 邀请会员列
export const inviteMemberColumns: any[] = [
  // {
  //   dataIndex: 'id',
  //   title: 'ID',
  //   align: 'center',
  //   className: 'commonHide',
  // },
  {
    dataIndex: 'memberId',
    title: intl.formatMessage({ id: 'detail.purchase.memberId' }),
    align: 'center',
  },
  {
    dataIndex: 'name',
    align: 'center',
    title: intl.formatMessage({ id: 'detail.purchase.memberName' }),
  },
  {
    dataIndex: 'memberTypeName',
    title: intl.formatMessage({ id: 'detail.purchase.memberType' }),
    align: 'center',
  },
  {
    dataIndex: 'roleName',
    title: intl.formatMessage({ id: 'detail.purchase.role' }),
    align: 'center',
  },
  {
    dataIndex: 'levelTag',
    title: intl.formatMessage({ id: 'detail.purchase.leveTag' }),
    align: 'center',
  },
  // {
  //   dataIndex: 'isSubMember',
  //   title: intl.formatMessage({ id: 'detail.purchase.isSubMember' }),
  //   align: 'center',
  //   render: (t, r) => t ? intl.formatMessage({ id: 'table.purchase.okText' }) : intl.formatMessage({ id: 'table.purchase.cancelText' }),
  // },
  // {
  //   dataIndex: 'isSend',
  //   title: intl.formatMessage({ id: 'detail.purchase.isSend' }),
  //   align: 'isSend',
  // },
  // {
  //   dataIndex: intl.formatMessage({ id: 'detail.purchase.option' }),
  //   title: intl.formatMessage({ id: 'detail.purchase.option' }),
  //   align: 'center',
  // }
]

// 招标方式 邀请会员列弹窗
export const inviteMemberModalColumns: any[] = [
  {
    dataIndex: 'memberId',
    title: intl.formatMessage({ id: 'detail.purchase.memberId' }),
    align: 'center',
  },
  {
    dataIndex: 'name',
    align: 'center',
    title: intl.formatMessage({ id: 'detail.purchase.memberName' }),
  },
  {
    dataIndex: 'lifeCycleStageName',
    title: intl.formatMessage({ id: 'detail.purchase.lifeCycleStage' }),
    align: 'center',
  },
  {
    dataIndex: 'depositTime',
    title: intl.formatMessage({ id: 'detail.purchase.depositTime' }),
    align: 'center',
  },
]
