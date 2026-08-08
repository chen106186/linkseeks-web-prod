import React, { useEffect, useMemo, useState, useContext } from 'react'
import { Button, Tooltip, Spin, message } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { changeProps } from '@apps/design-core'
import { getCommodityShopDetails } from '@apps/apis'
import { getProductCommodityTemplateGetFirstCategoryListByMemberId } from '@apps/apis'
import { getMarketingWebActivityPageGet, getCommodityWebStoreWebFindById } from '@apps/apis'
import { FormEffectHooks } from '@apps/formily'
import StatusTag from '@/components/StatusTag'
import { context } from '../../../common/context'
import NiceForm from '@/components/NiceForm'
import FormilyUpload from '@/components/UploadFiles/FormilyUploadFiles'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import MixDrawer from '@/pages/pageCustomized/components/drawers/mixDrawer'
import ActivityDrawer from '@/pages/pageCustomized/components/drawers/activityDrawer'
import defaultLogo from '@/assets/imgs/default_logo.jpg'
import { cardNavSchema } from './schema'
import styles from './index.less'

interface CardNavItemProps {
  name: string
  /** 跳转类型：1-商城导航 2-活动导航 3-品类导航 4.店铺首页导航 5.频道导航 6.外部链接  */
  type: any
  url: string
  icon: string
  // 当前选中组件的key
  selectedKey?: any
  shopId: string
  // 频道 1: 店铺中心; 2:人气店铺; 3:行情资讯; 4:积分兑换
  id?: any
  // 1.B端 2.C端 3.SRM
  property?: 1 | 2 | 3
  empty?: boolean
  environment: number
}

const ChannelTyleList_B = [
  {
    value: 1,
    label: '店铺中心',
  },
  {
    value: 2,
    label: '人气店铺',
  },
  {
    value: 3,
    label: '行情资讯',
  },
  {
    value: 4,
    label: '积分兑换',
  },
  {
    value: 5,
    label: '社区团购',
  },
]

const RedirectTypeList = [
  {
    value: 1,
    label: '商城导航',
  },
  {
    value: 2,
    label: '活动导航',
  },
  {
    value: 3,
    label: '品类导航',
  },
  {
    value: 4,
    label: '店铺首页导航',
  },
  {
    value: 5,
    label: '频道导航',
  },
  {
    value: 6,
    label: '外部链接',
  },
]

const { onFieldInputChange$ } = FormEffectHooks

const CardNavItem: React.FC<CardNavItemProps> = (props: CardNavItemProps) => {
  const { name, type, url, icon, id, property = 1, environment, shopId, selectedKey } = props
  const fixtureContext = useContext(context)
  const [mixVisible, setMixVisible] = useState<boolean>(false)
  const [actVisible, setActVisible] = useState<boolean>(false)
  const [record, setRecord] = useState<any>()
  const [formValue, setFormVale] = useState<any>()

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

  const _fetch: any = useMemo(() => {
    switch (type) {
      case 1:
        return getCommodityShopDetails
      case 2:
        return getMarketingWebActivityPageGet
      case 4:
        return getCommodityWebStoreWebFindById
      default:
        return async () => {}
    }
  }, [type])

  useEffect(() => {
    if (id) {
      if ([1, 2, 4].includes(type)) {
        _fetch?.({ id: id })
          .then((res) => {
            if (res.code === 1000) {
              setRecord(res.data)
              fixtureContext?.formActions.setFieldValue('recordDetail', res.data)
            } else {
              setRecord(undefined)
              fixtureContext?.formActions.setFieldValue('recordDetail', undefined)
            }
          })
          .catch((_) => {
            setRecord(undefined)
            fixtureContext?.formActions.setFieldValue('recordDetail', undefined)
          })
      }
    } else {
      setRecord(undefined)
      fixtureContext?.formActions.setFieldValue('recordDetail', undefined)
    }
  }, [id, type])

  const recordDetail = () => {
    return useMemo(() => {
      if (record) {
        const chooseType = fixtureContext?.formActions.getFieldValue('type')
        if (chooseType === 1) {
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
        if (chooseType === 2) {
          return (
            <div className={styles['banner-record-activity']}>
              <img src={record?.templatePicUrl || record?.logoUrl || defaultLogo} />
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
                  title={record?.type === 1 ? '平台' : '商家'}
                  type={record?.type === 1 ? 'success' : 'primary'}
                />
              </div>
            </div>
          )
        }
        if (chooseType === 4) {
          return (
            <div className={styles['banner-record-shop']}>
              <img src={record?.logo || defaultLogo} />
              <Tooltip title={record?.name || record?.memberName}>
                <span>{record?.name || record?.memberName}</span>
              </Tooltip>
            </div>
          )
        }
      }
      return null
    }, [record])
  }

  recordDetail.isFieldComponent = true

  const _onShopClose = () => {
    setMixVisible(false)
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
      case 1:
      case 4:
        setMixVisible(true)
        break
    }
  }

  const _onChooseConfirm = (record) => {
    setRecord(record)
    fixtureContext?.formActions.setFieldValue('recordDetail', record)
    const chooseType = fixtureContext?.formActions.getFieldValue('type')
    if (chooseType === 2) {
      _onActClose()
    } else if (chooseType === 1 || chooseType === 4) {
      _onShopClose()
    }
  }

  const renderUploadChild = (value) => {
    const target = value[0]
    return (
      <div className={styles.image}>
        <div className={styles.image_body}>
          <div className={styles.uploadImage}>上传图片</div>
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
      选择
    </Button>
  )

  const handleSumit = (values) => {
    const newProps: any = {
      ...values,
      icon: values.icon[0].url,
      empty: false,
    }
    if (values.channel && values.type === 5) {
      newProps.id = values.channel
    } else if (values.type === 1 || values.type === 2 || values.type === 4) {
      newProps.id = record?.id
    }

    changeProps({
      title: values.name,
      props: Object.assign({ ...props }, newProps),
    })
  }

  // 会员弹框筛选select值
  const fetchSelectOptions = async () => {
    let categoryListRes: any[] = []
    const res = await getProductCommodityTemplateGetFirstCategoryListByMemberId({ shopId })
    if (res.code === 1000 && res.data) {
      const list = res.data.map((item) => {
        return {
          label: item.name,
          value: item.id,
        }
      })
      categoryListRes = list
    }

    return {
      type: RedirectTypeList,
      id: categoryListRes,
      channel: ChannelTyleList_B,
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
              fixtureContext?.formActions.setFieldValue('recordDetail', undefined)
            }
          })
        }}
      />
      <MixDrawer
        onClose={_onShopClose}
        property={property}
        type={fixtureContext?.formActions.getFieldValue('type')}
        onConfirm={_onChooseConfirm}
        visible={mixVisible}
        environment={environment}
      />
      <ActivityDrawer selectId={id} visible={actVisible} onClose={_onActClose} onConfirm={_onChooseConfirm} />
    </>
  )
}

export default CardNavItem
