import React, { useMemo, useState, useEffect } from 'react'
import { Input, Select, message, Button, Tooltip } from 'antd'
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import { changeProps } from '@apps/design-core'
import ActivityImage from '@/assets/activity/ActivityImage.svg'
import { UploadImage } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import { priceFormat } from '@/utils/numberFomat'
import useSamLevelProps from '../../../common/hooks/useSameLevelProps'

import MixDrawer from '@/pages/pageCustomized/components/drawers/mixDrawer'
import CommodityDrawer from '@/pages/pageCustomized/components/drawers/commodityDrawer'

import uploadImgIcon from '@/assets/icons/upload_img_icon.svg'

import styles from './index.less'

interface BannerClientProps {
  // 名称
  name?: string
  // 图片
  img?: any
  // 跳转类型
  type?: any
  // 跳转类型的id
  id?: any
  // 当前选中组件的key
  selectedKey?: any
  shopId: number
  registerYears: number | undefined
  creditPoint: number | undefined
  memberName: string
  memberId: number
  roleId: number
  logo: string
  productIds: number[]
  productList?: any[]
  // 1.B端 2.C端 3.SRM
  property?: 1 | 2 | 3
  environment: number
}

const RecomendShops: React.FC<BannerClientProps> = (props: BannerClientProps) => {
  const {
    id,
    type,
    property = 1,
    environment,
    memberName,
    memberId,
    roleId,
    logo,
    productIds = [],
    productList = [],
    selectedKey,
  } = props
  const [mixVisible, setMixVisible] = useState<boolean>(false)
  const [actVisible, setActVisible] = useState<boolean>(false)
  const [commodityVisible, setCommodityVisible] = useState<boolean>(false)
  const [record, setRecord] = useState<any>()
  const sameLevelPropsList = useSamLevelProps({ key: selectedKey })

  const _recordDetail = useMemo(() => {
    if (id) {
      return (
        <div className={styles['banner-record-shop']}>
          <img src={logo} />
          <Tooltip title={memberName}>
            <span>{memberName}</span>
          </Tooltip>
        </div>
      )
    }
  }, [id])

  const _onShopClose = () => {
    setMixVisible(false)
  }

  const _onCommodityClose = () => {
    setCommodityVisible(false)
  }

  const _onChooseConfirm = (record) => {
    changeProps({
      title: record.name || record.memberName,
      props: Object.assign(
        { ...props },
        {
          id: record.id,
          registerYears: record.registerYears,
          creditPoint: record.creditPoint,
          memberName: record.name || record.memberName,
          logo: record.logo,
          memberId: record.memberId,
          roleId: record.roleId,
          productList: [],
          productIds: [],
        },
      ),
    })
    _onShopClose()
  }

  /**
   * 选择店铺商品
   * @param record
   */
  const _onChooseCommodityListConfirm = (record) => {
    const listRes = [...productList, ...record]
    if (listRes.length > 3) {
      message.error('最多选择3个店铺商品')
      return
    }
    changeProps({
      title: record.name,
      props: Object.assign(
        { ...props },
        {
          productIds: [...productIds, ...record.map((item) => item.id)],
          productList: [
            ...productList,
            ...record.map((item) => ({
              ...item,
              price: item.min,
            })),
          ],
        },
      ),
    })
    _onCommodityClose()
  }

  const _handleDeleteItem = (deleteId: number) => {
    if (deleteId) {
      changeProps({
        props: Object.assign(
          { ...props },
          {
            productIds: productIds.filter((item) => item !== deleteId),
            productList: productList.filter((item) => item.id !== deleteId),
          },
        ),
      })
    }
  }

  const _recordProductList = useMemo(() => {
    if (productList && productList.length > 0) {
      return productList.map((item) => (
        <>
          <div className={styles['banner-record-commodity-detail']}>
            <img src={item?.mainPic} />
            <div className={styles['banner-record-commodity-detail-right']}>
              <Tooltip title={item?.name}>
                <div className={styles['banner-record-commodity-detail-right-title']}>{item?.name}</div>
              </Tooltip>
              <div className={styles['banner-record-commodity-detail-right-price']}>
                {item?.min ? `¥ ${priceFormat(item?.min)}` : ''}
              </div>
            </div>
            <div className={styles['banner-record-commodity-detail-mask']}>
              <DeleteOutlined
                className={styles['banner-record-commodity-detail-mask-delete']}
                onClick={() => _handleDeleteItem(item?.id)}
              />
            </div>
          </div>
          {item?.activityList?.length > 0 && (
            <div className={styles['banner-record-commodity-box']}>
              <div className={styles['banner-record-commodity-label']}>商品活动</div>
              {item?.activityList?.map((item) => {
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
  }, [productList])

  /**
   * 打开选择店铺抽屉
   */
  const _onChooseShop = () => {
    setMixVisible(true)
  }

  /**
   * 打开选择商品抽屉
   */
  const _onChooseCommodity = () => {
    setCommodityVisible(true)
  }

  return (
    <div className={styles['banner']}>
      <Button onClick={_onChooseShop} style={{ marginBottom: 16 }}>
        选择
      </Button>
      {_recordDetail}
      {id && (
        <div className={styles['banner-box']} style={{ marginTop: 16 }}>
          <div className={styles['banner-box-label']}>店铺商品</div>
          <Button onClick={_onChooseCommodity}>选择</Button>
        </div>
      )}
      {_recordProductList}
      <MixDrawer
        onClose={_onShopClose}
        property={property}
        type={4}
        onConfirm={_onChooseConfirm}
        disabledKeys={sameLevelPropsList ? sameLevelPropsList.map((item) => item.id) : []}
        visible={mixVisible}
        environment={environment}
      />
      <CommodityDrawer
        selectId={productIds}
        visible={commodityVisible}
        onClose={_onCommodityClose}
        onConfirm={_onChooseCommodityListConfirm}
        selectType="checkbox"
        filterParam={{
          memberId,
          memberRoleId: roleId,
        }}
      />
    </div>
  )
}

export default RecomendShops
