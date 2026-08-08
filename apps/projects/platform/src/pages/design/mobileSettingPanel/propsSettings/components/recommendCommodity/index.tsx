import React, { useState, useEffect, useMemo } from 'react'
import { Input, Radio, Space, Select, Button, message, Tooltip, InputNumber } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { changeProps } from '@apps/design-core'
import { useIntl } from '@linkseeks/i18n'
import CommodityDrawer from '@/pages/design/components/drawer/commodityDrawer'
import ActivityImage from '@/assets/couponIcons/ActivityImage.svg'
import { authService } from '@apps/services'
import StatusTag from '@/components/StatusTag'
import { LAYOUT_TYPE } from '@/constants'
import { priceFormat } from '@/utils/numberFomat'
import styles from './index.less'
import { getWebIntl } from '@apps/locales'
import { getProductCommodityTemplateGetFirstCategoryListByMemberId } from '@apps/apis'

const translate = getWebIntl()
interface RecommendCommodityProps {
  title?: string
  categoryId: number
  idList: number[]
  explain?: string
  type?: number
  manageWay?: number
  dataList: any[]
  num?: number
  customize?: any
  // 当前选中组件的key
  selectedKey?: any
  shopId: number
  layoutType: LAYOUT_TYPE
}

const RecommendCommodity: React.FC<RecommendCommodityProps> = (props: RecommendCommodityProps) => {
  const { title, categoryId, num, idList = [], dataList = [], manageWay, layoutType, selectedKey, shopId } = props
  const [categoryList, setCategoryList] = useState<{ label: string; value: number }[]>([])
  const [commodityVisible, setCommodityVisible] = useState<boolean>(false)
  const { memberId, memberRoleId } = authService.getAuth() || {}
  const intl = useIntl()

  useEffect(() => {
    getFirstCategoryList()
  }, [])

  const getFirstCategoryList = async () => {
    if (shopId) {
      const params: any = {
        shopId,
        memberId,
        memberRoleId,
      }
      getProductCommodityTemplateGetFirstCategoryListByMemberId(params).then((res) => {
        if (res.code === 1000 && res.data) {
          const list = res.data.map((item) => {
            return {
              label: item.name,
              value: item.id,
            }
          })
          console.log(list, 'list')
          setCategoryList(list)
        } else {
          setCategoryList([])
        }
      })
    }
  }

  const _onChooseConfirm = (record) => {
    const newList = [...dataList, ...record]
    // if (newList.length > 4) {
    //   message.error('最多选择四件商品')
    //   return
    // }
    changeProps({
      props: Object.assign(
        { ...props },
        {
          idList: [...idList, ...record.map((item) => item.id)],
          dataList: [...dataList, ...record],
        },
      ),
    })
    _onCommodityClose()
  }

  const _onChangeByKey = (val: any, key: string, newTitle?: string) => {
    const newProps: any = {
      [key]: val,
    }

    if (key === 'num') {
      if (Number(val) < 0) {
        newProps[key] = 1
      } else if (val.indexOf('.')) {
        newProps[key] = Math.round(Number(val))
      }
    }

    if (key === 'categoryId') {
      newProps.idList = []
      newProps.dataList = []
    }

    changeProps({
      title: newTitle ? newTitle : title,
      props: Object.assign({ ...props }, newProps),
    })
  }

  const _onChoose = () => {
    if (!categoryId) {
      message.info('请先选择品类')
      return
    }
    setCommodityVisible(true)
  }

  const _onCommodityClose = () => {
    setCommodityVisible(false)
  }

  const _handleDeleteItem = (deleteId: number) => {
    if (deleteId) {
      changeProps({
        props: Object.assign(
          { ...props },
          {
            idList: idList.filter((item) => item !== deleteId),
            dataList: dataList.filter((item) => item.id !== deleteId),
          },
        ),
      })
    }
  }

  const _recordDetail = useMemo(() => {
    if (dataList && dataList.length > 0) {
      return dataList.map((dateItem) => (
        <>
          <div className={styles['banner-record-commodity-detail']}>
            <img src={dateItem?.mainPic} />
            <div className={styles['banner-record-commodity-detail-right']}>
              <Tooltip title={dateItem?.name}>
                <div className={styles['banner-record-commodity-detail-right-title']}>{dateItem?.name}</div>
              </Tooltip>
              <div className={styles['banner-record-commodity-detail-right-price']}>
                {dateItem?.min ? `${translate('web.common.currencySymbol')}${priceFormat(dateItem?.min)}` : ''}
              </div>
            </div>
            <div className={styles['banner-record-commodity-detail-mask']}>
              <DeleteOutlined
                className={styles['banner-record-commodity-detail-mask-delete']}
                onClick={() => _handleDeleteItem(dateItem?.id)}
              />
            </div>
          </div>
          {dateItem?.activityList?.length > 0 && (
            <div className={styles['banner-record-commodity-box']}>
              <div className={styles['banner-record-commodity-label']}>商品活动</div>
              {dateItem?.activityList?.map((item) => {
                return (
                  <div className={styles['banner-record-commodity-activityList']}>
                    <img src={ActivityImage} />
                    <div className={styles['banner-record-commodity-activityList-name']}>{item.name}</div>
                    <StatusTag title={item.type} type="danger" />
                  </div>
                )
              })}
            </div>
          )}
        </>
      ))
    }
  }, [dataList])

  return (
    <div className={styles['RecommendCommodity']}>
      <div className={styles['RecommendCommodity-box']}>
        <div className={styles['RecommendCommodity-box-label']}>
          {intl.formatMessage({ id: 'editor.setting.form.title' })}
        </div>
        <Input
          key={`${selectedKey}-title`}
          defaultValue={title}
          onBlur={(e) => _onChangeByKey(e.target.value, 'title', e.target.value)}
          maxLength={8}
        />
      </div>
      <div className={styles['RecommendCommodity-box']}>
        <div className={styles['RecommendCommodity-box-label']}>
          {intl.formatMessage({ id: 'editor.columns.category' })}
        </div>
        <Select
          key={`${selectedKey}-type`}
          value={categoryList && categoryList.some((item) => item.value === categoryId) ? categoryId : undefined}
          onChange={(value) => _onChangeByKey(value, 'categoryId')}
          style={{ width: '100%' }}
        >
          {categoryList &&
            categoryList.map((selectItem) => (
              <Select.Option value={selectItem.value} key={`redirect_type_${selectItem.value}`}>
                {selectItem.label}
              </Select.Option>
            ))}
        </Select>
      </div>
      <div className={styles['RecommendCommodity-box']}>
        <div className={styles['RecommendCommodity-box-label']}>
          {intl.formatMessage({ id: 'editor.form.label.product.show' })}
        </div>
        <Radio.Group
          key={`${selectedKey}-type`}
          onChange={(e) => _onChangeByKey(e.target.value, 'manageWay')}
          defaultValue={manageWay}
        >
          <Space direction="vertical">
            <Radio value={1}>{intl.formatMessage({ id: 'editor.form.label.product.type_1' })}</Radio>
            <Radio value={2}>{intl.formatMessage({ id: 'editor.form.label.product.type_2' })}</Radio>
            <Radio value={3}>{intl.formatMessage({ id: 'editor.form.label.product.type_3' })}</Radio>
          </Space>
        </Radio.Group>
      </div>
      {(manageWay === 1 || manageWay === 2) && (
        <div className={styles['RecommendCommodity-box']}>
          <div className={styles['RecommendCommodity-box-label']}>
            {intl.formatMessage({ id: 'editor.form.label.product.show.count' })}
          </div>
          <InputNumber
            precision={0}
            style={{ width: '100%' }}
            key={`${selectedKey}-num`}
            min={1}
            defaultValue={num}
            onBlur={(e) => _onChangeByKey(e.target.value, 'num')}
          />
        </div>
      )}
      {manageWay === 3 && (
        <div className={styles['RecommendCommodity-box']}>
          <div className={styles['RecommendCommodity-box-label']}>
            {intl.formatMessage({ id: 'editor.template.channel.product.title' })}
          </div>
          <Button onClick={_onChoose}>{intl.formatMessage({ id: 'common.button.select' })}</Button>
        </div>
      )}
      {_recordDetail}
      <CommodityDrawer
        selectId={idList}
        layoutType={layoutType}
        visible={commodityVisible}
        onClose={_onCommodityClose}
        onConfirm={_onChooseConfirm}
        selectType="checkbox"
        filterParam={{
          memberId,
          memberRoleId,
          customerCategoryId: categoryId,
        }}
      />
    </div>
  )
}

export default RecommendCommodity
