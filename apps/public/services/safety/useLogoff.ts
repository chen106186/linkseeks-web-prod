import { useMemo, useRef } from 'react'
import { GetMemberMobileSecurityCancellationCheckResponse, getMemberMobileSecurityCancellationCheck } from '@apps/apis'
import { useRequestApi, useToggle, ApiResult } from '@linkseeks/hooks'
import { useIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'

export interface LogoffOptions {
  onCheckSuccess?(data: ApiResult<GetMemberMobileSecurityCancellationCheckResponse>): void
}

/**
 * 注销功能
 *
 * PC 和 移动端共用逻辑
 */
const useLogoff = (props: LogoffOptions = {}) => {
  const intl = useIntl()
  const [isRead, toggleReadStatus] = useToggle(false)
  const translate = getWebIntl()
  const { data, loading, run } = useRequestApi(getMemberMobileSecurityCancellationCheck, {
    manual: true,
    onSuccess: props.onCheckSuccess,
  })

  const validateMaps = useRef({
    accountBalance: translate('web.resource.system.nindepingtaihuodianpuzhanghaoshangyouyue'),
    memberStatus: translate('web.resource.system.nindedangqianzhanghaochuyudongjiezt'),
    notCompleteAfterSale: translate('web.resource.system.nindezhanghaoyouweiwanchengdeshouhou'),
    notCompleteComplaint: translate('web.resource.system.nindezhanghaoneiyouzhengzaichulidetoushu'),
    notCompleteDispute: translate('web.resource.system.dangqianzhanghaocunzaijiufen'),
    notCompleteOrder: translate('web.resource.system.zhanghaoneiyouweiwanchengdingdan'),
    notCompleteSettlement: translate('web.resource.system.zhanghaoneiyouyingshouyingfujiesuan'),
    notCompleteStore: translate('web.resource.system.zhanghaoyicunzaigongyingshangjuese'),
    subUserStatus: translate('web.resource.system.zhanghaoyouqiyongzhongdeyonghuzizhanghao'),
    shelvesStatus: translate('web.resource.system.nindezhanghaocunzaishangpinweixiajiaqingquanbuxiajiahouzaicaozuo'),
  })

  const formatTips = useRef([
    `1. ${translate('web.resource.system.zhuxiaoxiang1')})`,
    `2. ${translate('web.resource.system.zhuxiaoxiang2')}`,
    `3. ${translate('web.resource.system.zhuxiaoxiang3')}`,
    `4. ${translate('web.resource.system.zhuxiaoxiang4')}`,
    `5. ${translate('web.resource.system.zhuxiaoxiang5')}`,
    `6. ${translate('web.resource.system.zhuxiaoxiang6')}`,
    `7. ${translate('web.resource.system.zhuxiaoxiang7')}`,
    `8. ${translate('web.resource.system.zhuxiaoxiang8')}`,
    `9. ${translate('web.resource.system.zhuxiaoxiang9')}`,
    `10. ${translate('web.resource.system.zhanghaoruoweipingtaishangjiaxuxiajiaquanbushangpin')}`,
  ])

  // 开始发起注销
  const handleSubmitCheck = () => {
    run()
  }

  // 错误的信息列表
  const failKeyList: string[] | undefined = useMemo(() => {
    if (data) {
      return Object.keys(data).filter((key) => !data[key])
      // .map((key) => validateMaps.current[key])
    }
  }, [data])

  return {
    // 是否已经阅读
    isRead,
    // 阅读状态切换
    toggleReadStatus,
    // 发起注销前校验
    handleSubmitCheck,
    // 校验接口的loading状态，可用于按钮
    checkLoading: loading,
    // 静态页面的提示列表
    formatTips: formatTips.current,
    // 校验之后的提示语
    validateMaps: validateMaps.current,
    // 校验结果组成的错误列表
    failKeyList,
    // 待注销的手机号
    phone: data?.phone,
  }
}

export default useLogoff
