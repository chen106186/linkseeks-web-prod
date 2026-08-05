import React, { useEffect, useState } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { useQuery, useLocation } from '@linkseeks/router-core'
import { usePrompt } from '@linkseeks/router-core'
import { PageHeaderWrapper } from '@apps/components'
import { getColor } from '@/components/FormProgress'
import { Button, Form } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import BasicInfo from './components/basicInfo'
import QualityMaterial from './components/qualityMaterial'
import Attachment from './components/attachment'
import { AddedContext } from '@/components/DetailLayout/components/context'
import { authService } from '@apps/services'
import { getOrderQualityDetail, postOrderQualitySaveOrUpdate } from '@apps/apis'
import type { Moment } from 'moment'
import moment from 'moment'
import { getOrderReceiveOrderReceiveOrderByQualityCreate } from '@apps/apis'
import { getProductSampleDeliverBuyerQualityCreateBySampleDelivery } from '@apps/apis'

type dataInfo = {
  /** 质检单生成类型：1-新增2-收货单生成 */
  orderResource?: number
  /** 收货单编号 */
  receiveId?: number
  receiveNo?: string
  /** 质检类型1-来料质检,2-样品质检,3-试制品质检 */
  qualityType?: number
  startTime?: Moment
  endTime?: Moment
  /** 质检单摘要 */
  digest?: string
  /** 采购会员Id  */
  buyerMemberId?: number
  /** 采购会员角色Id  */
  buyerRoleId?: number
  /** 采购会员名称  */
  buyerMemberName?: string
  /** 供应商会员Id  */
  vendorMemberId?: number
  /** 供应商会员角色Id  */
  vendorRoleId?: number
  /** 供应商会员名称  */
  vendorMemberName?: string
  /** 质检物料  */
  qualityOrderProductVOS?: any[]
}

/** 收货单生成 */
export const ODR_TWO = 2
/** 来料质检 */
const QUATYPE_ONE = 1
/** 样品质检 */
export const SEND_SAMPLE_THREE = 2

export const layout: any = {
  colon: false,
  labelCol: { style: { width: '144px' } },
  labelAlign: 'left',
}

const progress = {
  display: 'flex',
  alignItems: 'center',
  width: '240px',
  height: '16px',
  marginLeft: '8px',
  padding: '0 8px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: 'normal',
}

export enum TYPE {
  /** 生成B2B质检单 */
  B2B = 1,
  /** 生成SRM质检单 */
  SRM,
}

export enum ORDERRESOURCE {
  /** 新增生成 */
  ADDED = 1,
  /** 收货单生成 */
  ORDER,
  /** 样品生成 */
  SEND,
}

const IDX_ZERO = 0

const QualityManageSrmAdded = (props: any) => {
  const intl = getIntl()
  const { id } = useQuery()
  const { pathname } = useLocation()
  const [PATH] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState<any>({})
  const [percent, setPercent] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [_urls, setUrls] = useState<any[]>([])
  const [unsaved, setUnsaved] = useState<boolean>(false)
  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })
  /**计算输入框输入了百分之多少 */
  const onFieldsChange = () => {
    const allValues = form.getFieldsValue()
    const values = Object.values(allValues)
    console.log(values)
    let num = 0
    values.forEach((_item) => {
      if (_item) {
        num += 1
      }
    })
    setPercent(Number((num / values.length) * 100))
  }

  const orderResource = () => {
    switch (PATH) {
      case 'formed':
        return ORDERRESOURCE.ORDER
      case 'send':
        return ORDERRESOURCE.SEND
      default:
        return ORDERRESOURCE.ADDED
    }
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const {
        qualityNo,
        qualityType,
        receiveId,
        receiveNo,
        digest,
        vendorMemberId,
        vendorRoleId,
        vendorMemberName,
        startTime,
        endTime,
        qualityInspector,
        remark,
        qualityOrderProductVOS,
        urls,
      } = values
      const params = {
        id: undefined,
        type: TYPE.B2B,
        orderResource: orderResource(),
        receiveId,
        qualityNo,
        qualityType,
        receiveNo,
        digest,
        vendorMemberId,
        vendorRoleId,
        vendorMemberName,
        startTime: moment(startTime).format('YYYY-MM-DD'),
        endTime: moment(endTime).format('YYYY-MM-DD'),
        qualityInspector,
        remark,
        qualityOrderProductVOS,
        urls,
        memberId: authService.getAuth()?.memberId,
        roleId: authService.getAuth()?.memberRoleId,
      }
      if (PATH === 'edit') {
        params.id = Number(id)
      }
      setLoading(true)
      postOrderQualitySaveOrUpdate(params)
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          setUnsaved(false)

          setTimeout(() => {
            if (PATH === 'formed' || PATH === 'send') {
              history.push('/qualityAbility/qualityManage/b2b')
              return
            }

            history.goBack()
          }, 200)
        })
        .catch(() => setLoading(false))
    })
  }

  useEffect(() => {
    if (id && PATH === 'edit') {
      getOrderQualityDetail({ id: id.toString() }).then((res) => {
        if (res.code !== 1000) {
          return
        }
        const { data } = res
        setUrls(data?.urls)
        setDataSource(data)
        form.setFieldsValue({
          qualityNo: data?.qualityNo,
          receiveId: data?.receiveId,
          receiveNo: data?.receiveNo,
          qualityType: data?.qualityType,
          digest: data?.digest,
          vendorMemberId: data?.vendorMemberId,
          vendorRoleId: data?.vendorRoleId,
          vendorMemberName: data?.vendorMemberName,
          startTime: moment(data?.startTime),
          endTime: moment(data?.endTime),
          qualityInspector: data?.qualityInspector,
          remark: data?.remark,
          urls: data?.urls,
          qualityOrderProductVOS: data?.qualityOrderProductVOS,
        })
        onFieldsChange()
      })
    }

    if (id && (PATH === 'formed' || PATH === 'send')) {
      const orderByQualityCreateApi =
        PATH === 'formed'
          ? getOrderReceiveOrderReceiveOrderByQualityCreate
          : getProductSampleDeliverBuyerQualityCreateBySampleDelivery
      orderByQualityCreateApi({ id: id.toString() }).then((res) => {
        if (res.code !== 1000) {
          return
        }
        const { data } = res
        const params: dataInfo = {
          ...data,
          qualityType: PATH === 'formed' ? QUATYPE_ONE : SEND_SAMPLE_THREE,
          startTime: moment(data?.receiveTime),
          endTime: moment(data?.receiveTime),
          receiveId: Number(id),
          receiveNo: PATH === 'formed' ? data?.receiveNo : data?.deliveryNo,
          qualityOrderProductVOS: data?.qualityOrderProductVOS.map((_item) => ({
            ..._item,
            receiveCount: _item?.receiveCount || _item?.deliverCount,
          })),
          digest: `${moment(data?.receiveTime).format('YYYY-MM-DD')}${
            data?.qualityOrderProductVOS[IDX_ZERO].productName
          }质检单`,
        }
        setDataSource(params)
        form.setFieldsValue({
          ...params,
        })
        onFieldsChange()
      })
    }

    setUnsaved(true)
  }, [id])

  const getEnclosureUrls = (data) => {
    setUrls(data)
    form.setFieldsValue({
      urls: data,
    })
  }

  const removeEnclosureUrls = (index) => {
    const files = [..._urls]
    files.splice(index, 1)
    setUrls(files)
    form.setFieldsValue({
      urls: files,
    })
  }

  return (
    <AddedContext.Provider value={{ form, dataSource, PATH, onFieldsChange }}>
      <PageHeaderWrapper
        title={props?.route?.name}
        subTitle={
          <div
            style={{
              ...progress,
              backgroundColor: getColor(percent).bg,
              color: getColor(percent).text,
            }}
          >
            {intl.formatMessage({ id: 'process.infointegrity', defaultMessage: '信息完整度' })} {percent.toFixed(0)}%
          </div>
        }
        items={[
          {
            label: intl.formatMessage({ id: 'quality.jibenxinxi', defaultMessage: '基本信息' }),
            key: 'basicInfo',
          },
          {
            label: intl.formatMessage({
              id: 'quality.zhijianshangpin',
              defaultMessage: '质检商品',
            }),
            key: 'qualityMaterial',
          },
          {
            label: intl.formatMessage({ id: 'quality.fujian', defaultMessage: '附件' }),
            key: 'attachment',
          },
        ]}
        extra={
          <Button icon={<SaveOutlined />} type="primary" onClick={() => handleSubmit()} loading={loading}>
            {intl.formatMessage({ id: 'quality.baocun', defaultMessage: '保存' })}
          </Button>
        }
      >
        <Form
          form={form}
          {...layout}
          onFieldsChange={() => onFieldsChange()}
          onValuesChange={() => {
            if (!unsaved) {
              setUnsaved(true)
            }
          }}
        >
          <BasicInfo />
          <QualityMaterial />
          <Attachment
            enclosureUrls={_urls || []}
            getEnclosureUrls={getEnclosureUrls}
            removeEnclosureUrls={removeEnclosureUrls}
          />
        </Form>
      </PageHeaderWrapper>
    </AddedContext.Provider>
  )
}
export default QualityManageSrmAdded
