import React, { useEffect, useMemo, useState, useContext } from 'react'
import { Tooltip, Button, Spin } from 'antd'
import NiceForm from '@/components/NiceForm'
import { PlusCircleOutlined } from '@ant-design/icons'
import { changeProps } from '@apps/design-core'
import { FormEffectHooks } from '@apps/formily'
import StatusTag from '@/components/StatusTag'
import { useIntl } from '@linkseeks/i18n'
import { context } from '../../../common/context'
import FormilyUpload from '@/components/UploadFiles/FormilyUploadFiles'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { LAYOUT_TYPE } from '@/constants'
import ActivityDrawer from '@/pages/design/components/drawer/activityDrawer'
import MixDrawer from '@/pages/design/components/drawer/mixDrawer'
import { authService } from '@apps/services'
import defaultLogo from '@/assets/imgs/default_logo.jpg'
import { cardNavSchema } from './schema'
import styles from './index.less'
import {
  getProductCommodityTemplateGetFirstCategoryListByMemberId,
  getCommodityShopDetails,
  getMarketingWebActivityPageGet,
} from '@apps/apis'
import { useWebIntl } from '@apps/locales'

interface CardNavItemProps {
  name: string
  /** 跳转类型：1-品类导航 2.活动导航 3.频道导航 4.外部链接  */
  type: any
  url: string
  icon: string
  // 当前选中组件的key
  selectedKey?: any
  shopId: string
  environment: number
  // 频道 1: 积分兑换; 2:公司介绍; 3:成为会员; 4:行情资讯; 5:最近成交
  id?: any
  // 1.B端 2.C端 3.SRM
  property?: 1 | 2 | 3
  empty?: boolean
  layoutType: LAYOUT_TYPE
}

const { onFieldInputChange$ } = FormEffectHooks

const CardNavItem: React.FC<CardNavItemProps> = (props: CardNavItemProps) => {
  const { name, type, url, icon, id, empty, environment, shopId, selectedKey, layoutType } = props
  const [actVisible, setActVisible] = useState<boolean>(false)
  const [record, setRecord] = useState<any>()
  const { memberId, memberRoleId } = authService.getAuth() || {}
  const fixtureContext = useContext(context)
  const [formValue, setFormVale] = useState<any>()
  const [mixVisible, setMixVisible] = useState<boolean>(false)
  const intl = useIntl()
  const translate = useWebIntl()

  const TyleList = [
    {
      value: 1,
      label: intl.formatMessage({ id: 'editor.nav.link.type.integral.exchange' }), // '积分兑换',
    },
    {
      value: 2,
      label: intl.formatMessage({ id: 'editor.nav.link.type.company.about' }), // '公司介绍',
    },
    {
      value: 3,
      label: intl.formatMessage({ id: 'editor.nav.link.type.apply.member' }), // '成为会员',
    },
  ]

  const TyleList_Own = [
    {
      value: 1,
      label: intl.formatMessage({ id: 'editor.nav.link.type.integral.exchange' }), // '积分兑换',
    },
    {
      value: 4,
      label: intl.formatMessage({ id: 'editor.nav.link.type.information' }), // '行情资讯',
    },
    {
      value: 3,
      label: intl.formatMessage({ id: 'editor.nav.link.type.apply.member' }), // '成为会员',
    },
    {
      value: 2,
      label: intl.formatMessage({ id: 'editor.nav.link.type.company.about' }), // '公司介绍',
    },
  ]

  const RedirectTypeList_Own = [
    {
      value: 5,
      label: intl.formatMessage({ id: 'editor.nav.link.type.mall' }), // '商城导航',
    },
    {
      value: 2,
      label: intl.formatMessage({ id: 'editor.nav.link.type.activity' }), // '活动导航',
    },
    {
      value: 1,
      label: intl.formatMessage({ id: 'editor.nav.link.type.category' }), // '品类导航',
    },
    {
      value: 3,
      label: intl.formatMessage({ id: 'editor.nav.link.type.channel' }), // '频道导航',
    },
    {
      value: 6,
      label: translate('web.resource.mall.zhaoxianhuo'),
    },
    {
      value: 7,
      label: translate('web.resource.mall.zhaogongying'),
    },
    {
      value: 4,
      label: intl.formatMessage({ id: 'editor.nav.link.type.webview' }), // '外部链接',
    },
  ]

  const RedirectTypeList = [
    {
      value: 1,
      label: intl.formatMessage({ id: 'editor.nav.link.type.category' }), // '品类导航',
    },
    {
      value: 2,
      label: intl.formatMessage({ id: 'editor.nav.link.type.activity' }), // '活动导航',
    },
    {
      value: 3,
      label: intl.formatMessage({ id: 'editor.nav.link.type.channel' }), // '频道导航',
    },
    {
      value: 4,
      label: intl.formatMessage({ id: 'editor.nav.link.type.webview' }), // '外部链接',
    },
  ]

  const _fetch: any = useMemo(() => {
    switch (type) {
      case 2:
        return getMarketingWebActivityPageGet
      case 5:
        return getCommodityShopDetails
      default:
        return async () => {}
    }
  }, [type])

  useEffect(() => {
    if (id) {
      if ([2, 5].includes(type)) {
        _fetch?.({ id })
          .then((res) => {
            if (res.code === 1000) {
              setRecord(res.data)
            } else {
              setRecord(undefined)
            }
          })
          .catch((_) => setRecord(undefined))
      }
    } else {
      setRecord(undefined)
    }
  }, [id, type])

  useEffect(() => {
    setFormVale({
      name,
      type,
      url: url || '',
      icon: icon ? [{ url: icon }] : undefined,
      channel: id || undefined,
      id: id || undefined,
    })
  }, [selectedKey])

  const getFirstCategoryList = async () => {
    if (shopId) {
      const params: any = {
        shopId,
        memberId,
        memberRoleId,
      }

      const res = await getProductCommodityTemplateGetFirstCategoryListByMemberId(params)
      if (res.code === 1000 && res.data) {
        const list = res.data.map((item) => {
          return {
            label: item.name,
            value: item.id,
          }
        })
        return list
      }
    }
    return []
  }

  const recordDetail = () => {
    return useMemo(() => {
      if (record) {
        const chooseType = fixtureContext?.formActions.getFieldValue('type')

        if (chooseType === 2) {
          return (
            <div className={styles['banner-record-activity']}>
              <div className={styles['banner-record-activity-right']}>
                <Tooltip title={record?.name}>
                  <div className={styles['banner-record-activity-right-top']}>{record?.name}</div>
                </Tooltip>
                {record?.type === 2 && (
                  <div className={styles['banner-record-activity-right-bottom']}>{record?.memberName}</div>
                )}
              </div>
              <div className={styles['banner-record-activity-tag']}>
                <StatusTag
                  title={
                    record?.type === 1
                      ? intl.formatMessage({ id: 'common.text.platform' })
                      : intl.formatMessage({ id: 'common.text.business' })
                  }
                  type={record?.type === 1 ? 'success' : 'primary'}
                />
              </div>
            </div>
          )
        } else if (chooseType === 5) {
          return (
            <div className={styles['banner-record-activity']}>
              <img src={record?.logoUrl || defaultLogo} />
              <div className={styles['banner-record-activity-right']}>
                <Tooltip title={record?.name}>
                  <div className={styles['banner-record-activity-right-top']}>{record?.name}</div>
                </Tooltip>
              </div>
            </div>
          )
        }
      }
      return null
    }, [type, record])
  }

  const _onActClose = () => {
    setActVisible(false)
  }

  const _onChoose = () => {
    const chooseType = fixtureContext?.formActions.getFieldValue('type')
    switch (chooseType) {
      case 2:
        setActVisible(true)
        break
      case 5:
        setMixVisible(true)
        break
      default:
        break
    }
  }

  const _onChooseConfirm = (record) => {
    setRecord(record)
    const chooseType = fixtureContext?.formActions.getFieldValue('type')
    switch (chooseType) {
      case 2:
        _onActClose()
        break
      case 5:
        setMixVisible(false)
        break
      default:
        break
    }
  }

  const _getTypeList = useMemo(() => {
    switch (layoutType) {
      case LAYOUT_TYPE.shop:
        return TyleList
      case LAYOUT_TYPE.own:
        return TyleList_Own
      default:
        return TyleList
    }
  }, [layoutType])

  const renderUploadChild = (value) => {
    const target = value[0]
    return (
      <div className={styles.image}>
        <div className={styles.image_body}>
          <div className={styles.uploadImage}>{intl.formatMessage({ id: 'editor.form.btn.upload.img' })}</div>
          <div className={styles.imageIcon}>
            <Spin spinning={target?.status === 'uploading'}>
              {target?.url ? (
                <img src={target?.url} style={{ width: '100%', height: '96px' }} />
              ) : (
                <PlusCircleOutlined />
              )}
            </Spin>
          </div>
        </div>
      </div>
    )
  }

  const SelectBtn = (
    <Button style={{ marginTop: 26 }} block onClick={() => _onChoose()}>
      {intl.formatMessage({ id: 'common.button.select' })}
    </Button>
  )

  const handleSumit = (values) => {
    const newProps: any = {
      ...values,
      icon: values.icon[0].url,
      empty: false,
    }
    if (values.channel && values.type === 3) {
      newProps.id = values.channel
    } else if (values.type === 2 || values.type === 5) {
      newProps.id = record ? record?.id : undefined
    }

    changeProps({
      title: values.name,
      props: Object.assign({ ...props }, newProps),
    })
  }

  // 会员弹框筛选select值
  const fetchSelectOptions = async () => {
    const list = await getFirstCategoryList()

    return {
      type: layoutType === LAYOUT_TYPE.own ? RedirectTypeList_Own : RedirectTypeList,
      id: list,
      channel: _getTypeList,
    }
  }

  const formProps = {
    // onSubmit: handleSubmit,
    expressionScope: {
      renderUploadChild,
      SelectBtn,
    },
    actions: fixtureContext?.formActions,
    components: { FormilyUpload, recordDetail },
  }

  const _onMixClose = () => {
    setMixVisible(false)
  }

  return (
    <>
      <NiceForm
        value={formValue}
        layout="vertical"
        {...formProps}
        onSubmit={handleSumit}
        schema={cardNavSchema}
        effects={($, actions) => {
          useAsyncInitSelect(['type', 'id', 'channel'], fetchSelectOptions)
          onFieldInputChange$('type').subscribe((fieldState) => {
            const { value } = fieldState
            if (value !== type) {
              fixtureContext?.formActions.setFieldValue('id', undefined)
              fixtureContext?.formActions.setFieldValue('channel', undefined)
              setRecord(undefined)
            }
          })
        }}
      />
      <ActivityDrawer selectId={id} visible={actVisible} onClose={_onActClose} onConfirm={_onChooseConfirm} />
      <MixDrawer
        selectId={id}
        layoutType={layoutType}
        onClose={_onMixClose}
        type={1}
        property={3}
        environment={environment}
        onConfirm={_onChooseConfirm}
        visible={mixVisible}
      />
    </>
  )
}

export default CardNavItem
