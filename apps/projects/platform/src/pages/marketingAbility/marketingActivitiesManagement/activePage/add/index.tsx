import React, { useEffect, useMemo, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Button, Space, message, Modal } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { BgColorsOutlined, CheckCircleOutlined, SaveOutlined } from '@ant-design/icons'
import { FormEffectHooks, createFormActions, FormPath } from '@apps/formily'
import moment, { Moment } from 'moment'
import schema from './schema'
import styles from './index.less'
import FormilyTemplateDrawer from '../components/TemplateDrawer/formilyTemplateDrawer'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { usePageStatus } from '@/hooks/usePageStatus'
import ReturnEle from '@/components/ReturnEle'
import RangeTime from '@/components/RangeTime/FormilyRangeTime'
import NiceForm from '@/components/NiceForm'
import {
  getCommodityWebShopWebAll,
  getMarketingWebActivityPageGet,
  GetMarketingWebActivityPageGetResponse,
  postMarketingWebActivityPageAdd,
  postMarketingWebActivityPageUpdate,
} from '@apps/apis'

import { WEB } from '@/constants/environment'

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

type InitialValueType = Omit<
  GetMarketingWebActivityPageGetResponse,
  'startTime' | 'endTime' | 'templateId' | 'templateName' | 'templatePicUrl'
> & {
  startTime: Moment
  endTime: Moment
}

const APP_FIXTURE_LINK = `/marketingAbility/marketingActivitiesManagement/activePage/fixtures`
const WEB_FIXTURE_LINK = `/marketingAbility/marketingActivitiesManagement/activePage/fixtures/web`

const Add = () => {
  const intl = useIntl()
  const { id } = usePageStatus()
  const { pathname } = useLocation()
  const isEdit = useMemo(() => id !== '' && pathname.includes('edit'), [id])
  const isView = useMemo(() => id !== '' && pathname.includes('view'), [id])

  const [initialValue, setInitialValue] = useState<InitialValueType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  /**
   * 只能修改待上线跟已下线的活动
   */
  const isDisabled = initialValue?.status === 2 || initialValue?.status === 3 || initialValue?.status === 5

  const onSubmit = async (values: SubmitType) => {
    const { startTime, endTime, ...rest } = values
    const startTimeStamp = startTime?.valueOf()
    const endTimeStamp = endTime?.valueOf()
    setLoading(true)
    const postData = {
      ...rest,
      type: 2,
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
        message.destroy()
        Modal.confirm({
          title: (
            <span className={styles.modalTitle}>{intl.formatMessage({ id: 'activityPage.activityPageaveOK' })}</span>
          ),
          icon: <CheckCircleOutlined twoToneColor="#52c41a" />,
          content: (
            <span className={styles.modalContent}>{intl.formatMessage({ id: 'activityPage.ifDecoration' })}？</span>
          ),
          okText: intl.formatMessage({ id: 'activityPage.decorationImmediate' }),
          cancelText: intl.formatMessage({ id: 'activityPage.waitMin' }),
          onOk: () => {
            history.push(`${rest.environment === WEB ? WEB_FIXTURE_LINK : APP_FIXTURE_LINK}?id=${data}`)
          },
          onCancel: () => {
            // history.push('/marketingAbility/activityPages/management')
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
        const { startTime, endTime, templateId, templateName, templatePicUrl, ...rest } = data
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
      FormPath.setIn(state, 'props.x-component-props', { environment: initialValue?.environment })
    })
    async function setMall() {
      const data = await fetchMallData({
        environment: initialValue?.environment.toString(),
        type: 1,
      } as any)
      actions.setFieldState('shopId', (state) => {
        state.props.enum = [...data, { label: initialValue?.shopName, value: initialValue?.shopId }]
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
      return intl.formatMessage({ id: 'activityPage.decorationActivityPage' })
    }
    if (isView) {
      return intl.formatMessage({ id: 'activityPage.lookActivityPage' })
    }
    return intl.formatMessage({ id: 'activityPage.addActivityPage' })
  }

  return (
    <PageHeaderWrapper
      title={renderTitle()}
      extra={
        !isView && (
          <Space>
            {(isEdit && (
              <Link to={`${initialValue?.environment === WEB ? WEB_FIXTURE_LINK : APP_FIXTURE_LINK}?id=${id}`}>
                <Button icon={<BgColorsOutlined />}>
                  {intl.formatMessage({ id: 'activityPage.activityPageDecorate' })}
                </Button>
              </Link>
            )) ||
              null}

            <Button
              icon={<SaveOutlined />}
              loading={loading}
              onClick={() => actions.submit()}
              type="primary"
              disabled={isDisabled}
            >
              {intl.formatMessage({ id: 'activityPage.save' })}
            </Button>
          </Space>
        )
      }
    >
      <div className={styles.card}>
        <div className={styles.title}>{intl.formatMessage({ id: 'activityPage.baseInfo' })}</div>
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
              fetchMallData({ type: 1, environment: value.toString(), siteId: import.meta.env.OUT_SITEID } as any).then(
                (data) => {
                  formAction.setFieldValue('shopId', '')
                  formAction.setFieldValue('template', {})
                  linkage.loaded('shopId')
                  linkage.enum('shopId', data)
                },
              )
            })
            onFieldInputChange$('shopId').subscribe((fieldState) => {
              const value = fieldState.value
              const originAsyncData = fieldState.props.enum
              const target = originAsyncData.filter((_item) => _item.value === value)[0]
              formAction.setFieldValue('shopName', target.label)
            })
          }}
          editable={!isView || isDisabled}
          value={initialValue}
        />
      </div>
    </PageHeaderWrapper>
  )
}

export default Add
