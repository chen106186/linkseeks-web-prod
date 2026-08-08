import { Fragment, useState } from 'react'
import { Button, Modal } from 'antd'
import { LinkTo } from '@/utils'
import { MEMBER_CENTER_URL } from '@/constants/domain'
import { getWebIntl } from '@/utils/locales'
import { useGlobalConext } from '@/context/globalProvider'
import { useStoreContext } from '@/context/storeProvider'
import ApplyStepModal from './applyStepModal'
import { LAYOUT_TYPE } from '@/types/global'
import { validateLoginWrapper } from '@/utils/validateLogin'

interface ApplyMemberButtonPropsType {
  className?: string
}

const ApplyMemberButton = (props: ApplyMemberButtonPropsType) => {
  const { userInfo, shopInfo, mallInfo, url, layoutType } = useGlobalConext()
  const { className } = props
  const [applyVisible, setApplyVisible] = useState<boolean>(false)
  const { applyState } = useStoreContext()

  const translate = getWebIntl()

  const confirmContent = () => {
    switch (layoutType) {
      case LAYOUT_TYPE.own:
        return translate('web.resource.mall.shifouchengweigaishangchenghuiyuan')
      case LAYOUT_TYPE.shop:
        return translate('web.resource.mall.shifoushenqingchengweibendianhuiyuan')
      case LAYOUT_TYPE.shopIndex:
        return translate('web.resource.mall.shifoushenqingchengweirukugongyingshang')
      default:
        return translate('web.resource.mall.shifouquerenshenqingjiaru')
    }
  }

  const handleApply = validateLoginWrapper(() => {
    // 0-正常（继续申请流程），1-入库审核中，2-已入库审核通过，3-淘汰，4-黑名单,5-不符合条件不能申请
    switch (applyState?.status) {
      case 0:
      case 3:
        Modal.confirm({
          centered: true,
          content: confirmContent(),
          okText: translate('web.common.confirm'),
          cancelText: translate('web.common.cancel'),
          onOk: () => {
            if (layoutType === LAYOUT_TYPE.own) {
              LinkTo(
                `${MEMBER_CENTER_URL}/customerAbility/customerInvitationInfo/inventoryData/apply?upperMemberId=${mallInfo?.memberId}&upperRoleId=${mallInfo?.memberRoleId}`,
              )
            } else if (layoutType === LAYOUT_TYPE.shopIndex) {
              LinkTo(
                `${MEMBER_CENTER_URL}/supplierAbility/supplierInvitationInfo/inventoryData/apply?upperMemberId=${shopInfo?.memberId}&upperRoleId=${shopInfo?.roleId}`,
              )
            } else {
              setApplyVisible(true)
            }
          },
        })
        break
      case 1:
      case 2:
        if (layoutType === LAYOUT_TYPE.shopIndex) {
          LinkTo(`${MEMBER_CENTER_URL}/supplierAbility/supplierEnterpriseBasicInfo`)
        } else {
          LinkTo(`${MEMBER_CENTER_URL}/customerAbility/customerEnterpriseBasicInfo`)
        }
        break
      case 4:
      case 5:
        break
      default:
        break
    }
  })

  return applyState && !applyState.show && userInfo ? null : (
    <Fragment>
      <Button type="primary" className={className} disabled={applyState && applyState.disabled} onClick={handleApply}>
        {applyState?.value
          ? applyState?.value
          : layoutType === LAYOUT_TYPE.shopIndex
          ? translate('web.resource.mall.shenqingchengweirukugongyingshang')
          : translate('web.resource.mall.shenqingchengweibendianhuiyuan')}
      </Button>
      <ApplyStepModal visible={applyVisible} setVisible={setApplyVisible} shopInfo={shopInfo!} />
    </Fragment>
  )
}

export default ApplyMemberButton
