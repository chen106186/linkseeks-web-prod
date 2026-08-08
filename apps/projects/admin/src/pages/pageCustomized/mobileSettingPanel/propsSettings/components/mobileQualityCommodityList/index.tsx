import React, { useState, useMemo } from 'react'
import { Button, Tooltip } from 'antd'
import { changeProps } from '@apps/design-core'
import StatusTag from '@/components/StatusTag'
import { priceFormat } from '@/utils/numberFomat'
import { DeleteOutlined } from '@ant-design/icons'
import ActivityImage from '@/assets/activity/ActivityImage.svg'
import CommodityDrawer from '../../../../components/drawers/commodityDrawer'
import styles from './index.less'

interface MobileQualityCommodityListProps {
  id: number[]
  dataList: any[]
  shopId: number
}

const MobileQualityCommodityList = (props: MobileQualityCommodityListProps) => {
  const { id = [], dataList = [], shopId } = props
  const [visible, setVisible] = useState<boolean>(false)

  const _onChangeByKey = (val: any, key: string, title?: string) => {}

  const _onClose = () => {
    setVisible(false)
  }

  const _onConfirm = (record: any) => {
    changeProps({
      props: Object.assign(
        { ...props },
        {
          id: [...id, ...record.map((item) => item.id)],
          dataList: [...dataList, ...record],
        },
      ),
    })
    setVisible(false)
  }

  const _handleDeleteItem = (deleteId: number) => {
    if (deleteId) {
      changeProps({
        props: Object.assign(
          { ...props },
          {
            id: id.filter((item) => item !== deleteId),
            dataList: dataList.filter((item) => item.id !== deleteId),
          },
        ),
      })
    }
  }

  const _recordDetail = useMemo(() => {
    if (dataList && dataList.length > 0) {
      return dataList.map((item) => (
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
  }, [dataList])

  return (
    <div className={styles['banner']}>
      <div className={styles['banner-box']}>
        <div className={styles['banner-box-label']}>推荐商品</div>
        <Button onClick={() => setVisible(true)}>选择</Button>
      </div>
      {_recordDetail}
      <CommodityDrawer
        visible={visible}
        selectId={id}
        onConfirm={_onConfirm}
        onClose={_onClose}
        selectType="checkbox"
      />
    </div>
  )
}

export default MobileQualityCommodityList
