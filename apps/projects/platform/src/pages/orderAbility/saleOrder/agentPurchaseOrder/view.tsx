/*
 * @Author: GHua
 * @Date: 2022-03-29 17:42:11
 * @LastEditTime: 2022-04-12 16:27:54
 * @LastEditors: GHua
 * @Description: 代客下单（购物车下单）
 */
import React, { useEffect, useRef, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import cx from 'classnames'
import { Button, Anchor, message, AutoComplete, Input } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { ImageBox } from '@apps/components'
import { getCommodityWebShopWebAll } from '@apps/apis'
import {
  postMemberManageLowerProviderPage,
  postMemberManageLowerConsumerPage,
  getMemberManageLowerConsumerMemberPage,
} from '@apps/apis'
import MellowCard from '@/components/MellowCard'
import { authService } from '@apps/services'
import styles from './index.less'
import { MallItemType, MemberItemType, OptionType } from './types'
import useAgentInfo, { AGENT_ORDER_KEY } from './hooks/useAgentInfo'
import { lifecyclePhaseRules } from '@/constants/order'
import { useWebIntl } from '@apps/locales'

const { Link } = Anchor

const AgentPurchaseOrder: React.FC = () => {
  const [btnLoading, setBtnLoading] = useState(false)
  const [mallList, setMallList] = useState<MallItemType[]>([])
  const [selectMall, setSelectMall] = useState<MallItemType>()
  const [options, setOptions] = useState<OptionType[]>([])
  const [selectMember, setSelectMember] = useState<OptionType>()
  // const isSaas = GlobalConfig.global.siteInfo.enableMultiTenancy === 1
  const intl = useIntl()
  const translate = useWebIntl()
  const userInfo = authService.getAuth()
  const { dispatch, fetchStoreId } = useAgentInfo()
  let inputTimer = null

  const highlightText = (value: string, keyword: string): string => {
    if (value && typeof value === 'string') {
      const newValue = value.replace(keyword, `<b style='color: #00A98F'>${keyword}</b>`)
      return newValue
    }

    return value
  }

  const formatData = (data: MemberItemType[], keyword: string) => {
    if (data && data.length > 0) {
      setOptions(
        data.map((item) => {
          const value = `${item.name}/${item.memberTypeName}/${item.roleName}`
          return {
            value,
            label: (
              <div
                className={styles.memberOptions}
                dangerouslySetInnerHTML={{ __html: highlightText(value, keyword) }}
              />
            ),
            ...item,
          }
        }),
      )
    }
  }

  const fetchAgentMember = async (name: string) => {
    const param: { siteId: string; name: string; lifeCycleStageRuleId: number } = {
      siteId: String(import.meta.env.OUT_SITEID),
      name: name,
      lifeCycleStageRuleId: lifecyclePhaseRules.CUSTOMER_ORDER,
    }
    const res = await getMemberManageLowerConsumerMemberPage(param)
    if (res.code === 1000 && res.data) {
      formatData(res.data.data, name)
    }
  }

  const fetchShopWebAll = async (type?: number) => {
    const params = {
      environment: 1,
      isMemberType: true,
      memberId: userInfo.memberId,
      roleId: userInfo.memberRoleId,
    }
    if (type) {
      params['type'] = type
    }
    const res = await getCommodityWebShopWebAll(params)
    if (res.code === 1000 && res.data && res.data.length > 0) {
      message.destroy()
      setMallList(res.data)
    }
  }

  useEffect(() => {
    fetchShopWebAll()
  }, [])

  const handleSelectMall = (info: MallItemType) => {
    if (!selectMall || (selectMall && selectMall.id !== info.id)) {
      setSelectMall(info)
    }
  }

  const onSearch = (value: string) => {
    if (inputTimer) {
      clearTimeout(inputTimer)
      inputTimer = null
    }
    inputTimer = setTimeout(() => {
      fetchAgentMember(value)
    }, 200)
  }

  const onSelect = (_: string, options: OptionType) => {
    setSelectMember(options)
  }

  const waitMini = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 200)
    })
  }

  const handleNextStep = async () => {
    if (!selectMall) {
      message.error(
        intl.formatMessage({ id: 'agentOrder.selectMall.required', defaultMessage: '请选择需要下单的商城' }),
      )
      return
    }
    if (!selectMember) {
      message.error(
        intl.formatMessage({ id: 'agentOrder.selectMember.required', defaultMessage: '请输入下单的采购会员' }),
      )
      return
    }
    setBtnLoading(true)
    let storeId: number | undefined = undefined
    if (selectMall.type === 1 && !selectMall.isSelf) {
      storeId = await fetchStoreId()
      if (!storeId) {
        message.error(intl.formatMessage({ id: 'shop.template.create.tip' }))
        setBtnLoading(false)
        return
      }
    } else {
      await waitMini()
    }

    const mallInfo = {
      shopId: selectMall.id,
      shopName: selectMall.name,
      type: selectMall.type,
      isChannel: selectMall.type === 3 || selectMall.type === 4,
      environment: selectMall.environment,
      property: selectMall.property,
      isSelf: selectMall.isSelf,
      isMemberOperate: selectMall.isMemberOperate,
      logoUrl: selectMall.logoUrl,
      memberId: selectMember.memberId,
      memberName: selectMember.name,
      roleId: selectMember.roleId,
      memberLevel: selectMember.level,
      storeId,
    }

    dispatch({
      type: 'update',
      payload: mallInfo,
    })
    history.push(`/orderAbility/saleOrder/agentPurchaseOrder/commodity`)
    setBtnLoading(false)
  }

  return (
    <PageHeaderWrapper
      extra={
        <Button type="primary" loading={btnLoading} onClick={handleNextStep}>
          {translate('web.common.nextStep')}
        </Button>
      }
      isAnchor
      items={[
        {
          key: 'selectMall',
          label: intl.formatMessage({ id: 'agentOrder.selectMall', defaultMessage: '下单商城' }),
        },
        {
          key: 'selectMember',
          label: intl.formatMessage({ id: 'agentOrder.selectMember', defaultMessage: '下单会员' }),
        },
      ]}
    >
      <div>
        <MellowCard
          style={{ marginBottom: 16 }}
          title={
            <div className={styles.cardHeader}>
              <span>
                {intl.formatMessage({ id: 'agentOrder.selectMall.required', defaultMessage: '请选择需要下单的商城' })}
              </span>
              <i className={styles.required}>*</i>
            </div>
          }
          id="selectMall"
        >
          <div className={styles.mallList}>
            {mallList &&
              mallList.map((item) => (
                <div
                  key={item.id}
                  className={cx(styles.mallListItem, selectMall && selectMall.id === item.id ? styles.active : {})}
                  onClick={() => handleSelectMall(item)}
                >
                  <div className={styles.mallListItemBody}>
                    <ImageBox width={32} height={32} src={item.logoUrl} circle wrapperStyle={{ marginRight: 8 }} />
                    <span>{item.name}</span>
                  </div>
                </div>
              ))}
          </div>
        </MellowCard>
        <MellowCard
          title={
            <div className={styles.cardHeader}>
              <span>
                {intl.formatMessage({ id: 'agentOrder.selectMember.required', defaultMessage: '请输入下单的采购会员' })}
              </span>
              <i className={styles.required}>*</i>
            </div>
          }
          id="selectMember"
        >
          <div className={styles.memberSearchWrap}>
            <AutoComplete
              options={options}
              style={{ width: 600 }}
              onSelect={onSelect}
              onSearch={onSearch}
              placeholder={intl.formatMessage({ id: 'agentOrder.text.select', defaultMessage: '请选择' })}
              notFoundContent={
                <div style={{ textAlign: 'center' }}>
                  {intl.formatMessage({ id: 'agentOrder.text.noData', defaultMessage: '无数据' })}
                </div>
              }
            >
              <Input className={styles.autoComplete} />
            </AutoComplete>
          </div>
        </MellowCard>
      </div>
    </PageHeaderWrapper>
  )
}

export default AgentPurchaseOrder
