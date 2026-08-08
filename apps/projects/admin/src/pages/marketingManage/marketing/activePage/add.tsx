import React, { useEffect, useMemo, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import RangeTime from '@/components/RangeTime/FormilyRangeTime'
import { Button, Space, message, Modal } from 'antd'
import ReturnEle from '@/components/ReturnEle'
import { history } from '@linkseeks/router-manager'
import { useLocation, Link } from '@linkseeks/router-core'
import { BgColorsOutlined, CheckCircleOutlined, SaveOutlined } from '@ant-design/icons'
import { FormEffectHooks, createFormActions, FormPath } from '@apps/formily'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import moment, { Moment } from 'moment'
import { usePageStatus } from '@/hooks/usePageStatus'
import schema from './schema'
import styles from './add.less'
import FormilyTemplateDrawer from './components/TemplateDrawer/formilyTemplateDrawer'
import {
  getMarketingWebActivityPageGet,
  GetMarketingWebActivityPageGetResponse,
  postMarketingWebActivityPageAdd,
  postMarketingWebActivityPageUpdate,
  getCommodityWebShopWebAll,
} from '@apps/apis'
import { WEB } from '@/constants/const/environment'

const actions = createFormActions()

const { onFieldInputChange$ } = FormEffectHooks

type SubmitType = {
  /** 1 平台， 2。商家 */
  type: 1 | 2 | number
  name: string
  startTime: string
  endTime: string
  /** 1.WEB 2.H5 3.小程序 4.APP */
  environment: 1 | 2 | 3 | 4 | number
  shopId: number
  shopName: string
  adornContent: {
    [key: string]: any
  }
}

type ValueDataType = Omit<
  GetMarketingWebActivityPageGetResponse,
  'startTime' | 'endTime' | 'templateId' | 'templateName' | 'templatePicUrl'
> & {
  startTime: Moment
  endTime: Moment
}

const WEB_FIXTURE_LINK = '/marketingManage/marketing/activePage/fixtures'
const APP_FIXTURE_LINK = '/marketingManage/marketing/activePage/fixtures/mobile'

const Add = () => {
  const { id } = usePageStatus()
  const { pathname } = useLocation()
  const isEdit = useMemo(() => id !== '' && pathname.includes('edit'), [id])
  const isView = useMemo(() => id !== '' && pathname.includes('view'), [id])

  const [initialValue, setInitialValue] = useState<ValueDataType | null>(null)
  const fixtureLink = initialValue?.environment === WEB ? WEB_FIXTURE_LINK : APP_FIXTURE_LINK

  const [loading, setLoading] = useState<boolean>(false)
  /**
   * 待上线获 已下线可以保存
   */
  const isDisabled = initialValue?.status === 2 || initialValue?.status === 3 || initialValue?.status === 5

  const onSubmit = async (values: SubmitType) => {
    const { startTime, endTime, ...rest } = values
    const startTimeStamp = moment(startTime, 'YYYY-MM-DD HH:mm:ss').valueOf()
    const endTimeStamp = moment(endTime, 'YYYY-MM-DD HH:mm:ss').valueOf()
    setLoading(true)
    const postData = {
      ...rest,
      /** type = 1 指平台，写死 */
      type: 1,
      startTime: startTimeStamp,
      endTime: endTimeStamp,
      adornContent: initialValue?.adornContent || {},
    }
    const isWithIdPostData = isEdit ? { id: id, ...postData } : postData
    const service = isEdit ? postMarketingWebActivityPageUpdate : postMarketingWebActivityPageAdd
    const { data, code } = await service(isWithIdPostData as any)
    setLoading(false)

    if (code === 1000) {
      if (!isEdit && !isView) {
        Modal.confirm({
          title: <span className={styles.modalTitle}>活动页保存成功</span>,
          icon: <CheckCircleOutlined twoToneColor="#52c41a" />,
          content: <span className={styles.modalContent}>是否立即装修活动页？</span>,
          okText: '立即装修',
          cancelText: '稍后',
          onOk: () => {
            const jumpLink = values.environment === WEB ? WEB_FIXTURE_LINK : APP_FIXTURE_LINK
            history.push(`${jumpLink}?id=${data}`)
          },
          onCancel: () => {
            history.goBack()
          },
        })
        return
      }
      // history.goBack();
    }
  }

  useEffect(() => {
    if (!isEdit && !isView) {
      return
    }
    async function getDetail() {
      const { data, code } = await getMarketingWebActivityPageGet({ id: id })
      if (code === 1000) {
        const { startTime, endTime, ...rest } = data
        setInitialValue({
          ...rest,
          startTime: moment(startTime),
          endTime: moment(endTime),
        })
        actions.setFieldState('*(environment,template,shopId)', (state) => {
          FormPath.setIn(state, 'props.editable', false)
        })
      }
    }
    getDetail()
  }, [])

  useEffect(() => {
    if (!initialValue) {
      return
    }
    actions.setFieldState('template', (state) => {
      FormPath.setIn(state, 'props.x-component-props', { environment: initialValue.environment })
    })
    async function setMall() {
      const data = await fetchMallData({
        type: 1,
        isMemberType: false,
        environment: initialValue?.environment.toString(),
      } as any)
      actions.setFieldState('shopId', (state) => {
        state.props.enum = data
      })
    }
    setMall()
  }, [initialValue])

  const fetchMallData = async (params: { siteId: string; environment: string }) => {
    const { code, data } = await getCommodityWebShopWebAll(params as any, { ctlType: 'none' })
    if (code === 1000) {
      return data.map((_item) => {
        return {
          label: _item.name,
          value: _item.id,
        }
      })
    }
    return []
  }

  const renderTitle = () => {
    if (isEdit) {
      return '修改活动页'
    }
    if (isView) {
      return '查看活动页'
    }
    return '新增活动页'
  }

  return (
    <PageHeaderWrapper
      title={renderTitle()}
      extra={
        !isView && (
          <Space>
            {isEdit && (
              <Link to={`${fixtureLink}?id=${id}`}>
                <Button icon={<BgColorsOutlined />}>活动页装修</Button>
              </Link>
            )}
            <Button
              icon={<SaveOutlined />}
              loading={loading}
              onClick={() => actions.submit()}
              type="primary"
              disabled={isDisabled}
            >
              保存
            </Button>
          </Space>
        )
      }
    >
      <div className={styles.card}>
        <div className={styles.title}>基本信息</div>
        <NiceForm
          onSubmit={onSubmit}
          schema={schema}
          actions={actions}
          components={{ RangeTime, FormilyTemplateDrawer }}
          effects={($, formAction) => {
            const linkage = useLinkageUtils()
            onFieldInputChange$('environment').subscribe((fieldState) => {
              const value = fieldState.value
              formAction.setFieldState('template', (state) => {
                FormPath.setIn(state, 'props.x-component-props', { environment: value })
              })
              formAction.setFieldState('shopId', (state) => {
                FormPath.setIn(state, 'props.x-props.hasFeedback', true)
              })
              linkage.loading('shopId')
              fetchMallData({ type: 1, isMemberType: false, environment: value.toString() } as any).then((data) => {
                formAction.setFieldValue('shopId', '')
                formAction.setFieldValue('template', {})
                linkage.loaded('shopId')
                linkage.enum('shopId', data)
              })
            })
            onFieldInputChange$('shopId').subscribe((fieldState) => {
              const value = fieldState.value
              const originAsyncData = fieldState.props.enum
              const target = originAsyncData.filter((_item) => _item.value === value)[0]
              formAction.setFieldValue('shopName', target.label)
            })
          }}
          editable={!isView}
          value={initialValue}
        />
      </div>
    </PageHeaderWrapper>
  )
}

export default Add
