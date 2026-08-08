import React, { useEffect, useMemo, useState } from 'react'
import { Button, message, Table, Form, FormInstance } from 'antd'
import { Columns } from './columns'
import { Card as CardLayout } from '@linkseeks/ui'
import { PlusOutlined } from '@ant-design/icons'
import { isEmpty } from 'lodash'
import ListModalLayout from '@/pages/marketingAbility/components/listModalLayout'
import CollocationLayout from '@/pages/marketingAbility/components/collocationLayout'
import {
  remindLayout,
  RemindLayoutProps,
} from '@/pages/marketingAbility/paltformSign/readySubmitExamine/components/productListLayout/remind'
import CouponsListLayout from '@/pages/marketingAbility/components/couponsListLayout'
import { postMarketingMerchantActivityGetFilterSkuId } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { getLadderPrice } from '@/utils'

type optionProps = {
  /** key */
  key?: string | number
  /** value */
  value?: number
  /** children */
  children?: string
}

interface ProductListProps {
  /** 活动id */
  activityId?: any
  form?: FormInstance
  /** umi-hooks */
  focus$?: any
  /** 适用商城 */
  shopIdList?: number[]
  /** 接口 */
  fieldApi?: () => Promise<unknown>
  /** 活动规则 -> 有则不调用form.getFieldValue */
  getActivityDefinedBO?: any
  /** 过滤的filterSkuId */
  filterSkuId?: number[]
  /** 是否商家自建营销活动 */
  itrue?: boolean
  /** 活动规则改变 */
  refresh?: boolean
}

const ProductListLayout: React.FC<ProductListProps> = (props: any) => {
  const intl = getIntl()
  const { activityId, form, focus$, shopIdList, fieldApi, getActivityDefinedBO, filterSkuId, itrue, refresh } = props
  const [value, setValue] = useState<number>(1)
  const [productVisible, setProductVisible] = useState<boolean>(false)
  const [listModalVisible, setListModalVisible] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<any[]>([])
  const [idNotInList, setIdNotInList] = useState<number[]>([]) // 排除的id集合 ,Long
  const [skuId, setSkuId] = useState<number>(0) // 当前设置商品的id
  const [remind, setRemind] = useState<RemindLayoutProps>({})
  const [collocation, setCollocation] = useState<any[]>([])
  const [current, setCurrent] = useState<number>(1)
  const [idNots, setIdNots] = useState<number[]>([])

  const handleOnShowSizeChange = (current, _size) => {
    setCurrent(current)
  }

  const handlesStFieldsValue = () => {
    const params = [...dataSource]
    params.forEach((_item, _i) => {
      form.setFieldsValue({
        [`plummetPrice_${_i}`]: _item.plummetPrice,
        [`activityPrice_${_i}`]: _item.activityPrice,
        [`restrictNum_${_i}`]: _item.restrictNum,
        [`restrictTotalNum_${_i}`]: _item.restrictTotalNum,
      })
    })
  }

  useEffect(() => {
    if (focus$) {
      setValue(focus$)
      setDataSource([])
    }
  }, [focus$])

  /** 删除一个 */
  const handleDelete = (key) => {
    const newData = [...dataSource]
    form.setFieldsValue({
      productList: newData.filter((item) => item.skuId !== key),
    })
    setIdNotInList(idNotInList.filter((item) => item !== key))
    setIdNots(idNots.filter((item) => item !== key))
    setDataSource(newData.filter((item) => item.skuId !== key))
  }

  /** 设置搭配 */
  const handlCollocation = (record: any) => {
    const tableRecord: any = { ...record }
    if (remind.value !== 1 && tableRecord.couponGroupList !== undefined) {
      setCollocation(tableRecord.couponGroupList)
    } else if (remind.value === 1 && tableRecord.goodsSubsidiaryGroupList !== undefined) {
      setCollocation(tableRecord.goodsSubsidiaryGroupList)
    } else {
      setCollocation([])
    }
    setSkuId(tableRecord.skuId)
    setListModalVisible(true)
  }

  const columns = useMemo(() => {
    return Columns[value]?.({
      dataSource,
      setDataSource,
      handleDelete,
      form,
      setIdNotInList,
      handlCollocation,
      value,
      current,
    })
  }, [value, dataSource, current])

  const toggle = (flag: boolean) => {
    const activityDefined = form.getFieldValue('activityDefined') || getActivityDefinedBO
    if (isEmpty(shopIdList)) {
      message.warning(`${intl.formatMessage({ id: 'marketingAbility.qingxuanzeshiyongshangcheng！' })}`)
      return
    }
    if ((value === 6 || value === 13) && isEmpty(activityDefined)) {
      message.warning(`${intl.formatMessage({ id: 'marketingAbility.qingxuanzehuodongguize！' })}`)
      return
    }
    if (value === 6 && !isEmpty(activityDefined) && (!activityDefined.giveType || !activityDefined.giftType)) {
      message.warning(
        `${intl.formatMessage({ id: 'marketingAbility.qingxuanzezengsongcuxiaoleixinghezengpinleixing！' })}`,
      )
      return
    }
    if (value === 13 && !isEmpty(activityDefined) && !activityDefined.swapType) {
      message.warning(`${intl.formatMessage({ id: 'marketingAbility.qingxuanzehuangouleixing！' })}`)
      return
    }
    if (value === 6) {
      setRemind(remindLayout(value, activityDefined.giveType, activityDefined.giftType))
    }
    if (value === 13) {
      setRemind(remindLayout(value, activityDefined.swapType))
    }
    if (value === 15) {
      setRemind(remindLayout(value))
    }
    if (itrue && flag) {
      if (
        form.getFieldValue('activityDefined') &&
        form.getFieldValue('startTime') &&
        form.getFieldValue('endTime') &&
        form.getFieldValue('activityType')
      ) {
        const param = {
          activityType: form.getFieldValue('activityType'),
          activityDefined: form.getFieldValue('activityDefined'),
          startTime: Number(form.getFieldValue('startTime').format('x')),
          endTime: Number(form.getFieldValue('endTime').format('x')),
        }
        postMarketingMerchantActivityGetFilterSkuId(param, { ctlType: 'none' }).then((res) => {
          if (res.code !== 1000) {
            return
          }
          setIdNotInList([...res.data.filterSkuId, ...idNots])
          setProductVisible(flag)
        })
      } else {
        message.warn(`${intl.formatMessage({ id: 'marketingAbility.qingxianwanshanhuodongshijianhehuodongguize!' })}`)
      }
    } else {
      setProductVisible(flag)
    }
  }

  const handleSelectActiveProducts = (params) => {
    setDataSource([...dataSource, ...params])
    setIdNots([...idNots, ...params.map((item) => item.skuId)])
    toggle(false)
  }

  useEffect(() => {
    if (!isEmpty(activityId)) {
      fieldApi({ current: '1', pageSize: '999', ...activityId }).then((res) => {
        if (res.code !== 1000) {
          return
        }
        const activityDefined = form.getFieldValue('activityDefined') || getActivityDefinedBO
        if (value === 6) {
          setRemind(remindLayout(value, activityDefined.giveType, activityDefined.giftType))
        }
        if (value === 13) {
          setRemind(remindLayout(value, activityDefined.swapType))
        }
        if (value === 15) {
          setRemind(remindLayout(value))
        }
        form.setFieldsValue({
          productList: res.data.data,
        })
        setDataSource(res.data.data)
        setIdNotInList([...idNotInList, ...res.data.data.map((item) => item.skuId)])
      })
    }
  }, [!isEmpty(activityId)])

  useEffect(() => {
    handlesStFieldsValue()
  }, [dataSource])

  /** 设置搭配商品 */
  const handleConfirm = (params: any) => {
    const fields = [...dataSource]
    console.log('arr=>>>>>', params)
    fields.forEach((item) => {
      if (item.skuId === skuId) {
        if (params && params.length > 0) {
          item.goodsSubsidiaryGroupList = params
        }
      }
    })
    form.setFieldsValue({
      productList: fields,
    })
    setListModalVisible(false)
    setDataSource(fields)
  }

  /** 设置优惠券 */
  const handleCouponConfirm = (params: any) => {
    const fields = [...dataSource]
    console.log('arr=>>>>>', params)
    fields.forEach((item) => {
      if (item.skuId === skuId) {
        item.couponGroupList = [...params]
      }
    })
    form.setFieldsValue({
      productList: fields,
    })
    setListModalVisible(false)
    setDataSource(fields)
  }

  useEffect(() => {
    if (!isEmpty(filterSkuId)) {
      setIdNots([])
      setDataSource([])
      setIdNotInList(filterSkuId)
    }
  }, [!isEmpty(filterSkuId)])

  useEffect(() => {
    setIdNots([])
    setDataSource([])
    setIdNotInList([])
  }, [refresh])

  return (
    <CardLayout id="productListLayout" title={intl.formatMessage({ id: 'marketingAbility.huodongshangpin' })}>
      <Button style={{ marginBottom: '16px' }} block type="dashed" icon={<PlusOutlined />} onClick={() => toggle(true)}>
        {intl.formatMessage({ id: 'marketingAbility.xuanzehuodongshangpin' })}
      </Button>
      <Form.Item
        name="productList"
        rules={[
          { required: true, message: `${intl.formatMessage({ id: 'marketingAbility.qingxuanzehuodongshangpin' })}` },
        ]}
      >
        <Table
          rowKey={(record) => record.skuId}
          columns={columns}
          dataSource={dataSource}
          pagination={{
            size: 'small',
            onChange: handleOnShowSizeChange,
          }}
        />
        {/* 选择活动商品 */}
        <CollocationLayout
          visible={productVisible}
          idNotInList={[...idNotInList, ...idNots]}
          shopIdList={shopIdList}
          toggle={toggle}
          onConfirm={handleSelectActiveProducts}
        />
        {/* 设置搭配商品 */}
        {!isEmpty(remind) && remind.value === 1 && (
          <ListModalLayout
            isGift={value}
            title={remind.modalTitle}
            remind={remind}
            idNotInList={[skuId, ...idNotInList]}
            shopIdList={shopIdList}
            visible={listModalVisible}
            onClose={() => setListModalVisible(false)}
            onConfirm={handleConfirm}
            value={collocation}
          />
        )}
        {/* 设置优惠券 */}
        {!isEmpty(remind) && remind.value !== 1 && (
          <CouponsListLayout
            title={remind.modalTitle}
            remind={remind}
            visible={listModalVisible}
            onClose={() => setListModalVisible(false)}
            onConfirm={handleCouponConfirm}
            value={collocation}
          />
        )}
      </Form.Item>
    </CardLayout>
  )
}
export default ProductListLayout
