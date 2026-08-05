import React, { useState, useMemo } from 'react'
import { Button, Tooltip, Input } from 'antd'
import { changeProps } from '@apps/design-core'
import StatusTag from '@/components/StatusTag'
import { DeleteOutlined } from '@ant-design/icons'
import MixDrawer from '../../../../components/drawers/mixDrawer'
import styles from './index.less'

interface BrandItemType {
  id: number
  name: string
  logoUrl: string
}

interface MobileQualityInformationListProps {
  id: number[]
  dataList: any[]
  shopId: number
  environment: number
}

const MobileQualityInformationList = (props: MobileQualityInformationListProps) => {
  const { id = [], dataList = [], shopId, environment } = props
  const [visible, setVisible] = useState<boolean>(false)

  const _onClose = () => {
    setVisible(false)
  }

  const _onConfirm = (record: any) => {
    changeProps({
      title: '资讯列表',
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
        <div className={styles['banner-record-activity']}>
          <img src={item?.imageUrl} />
          <div className={styles['banner-record-activity-right']}>
            <Tooltip title={item?.title}>
              <div className={styles['banner-record-activity-right-top']}>{item?.title}</div>
            </Tooltip>
            <div style={{ display: 'inline-block' }}>
              <StatusTag title={item?.columnName} type={'primary'} />
            </div>
          </div>
          <div className={styles['banner-record-activity-mask']}>
            <DeleteOutlined
              className={styles['banner-record-activity-mask-delete']}
              onClick={() => _handleDeleteItem(item?.id)}
            />
          </div>
        </div>
      ))
    }
  }, [dataList])

  return (
    <div className={styles['banner']}>
      <div className={styles['banner-box']}>
        <div className={styles['banner-box-label']}>推荐资讯</div>
        <Button onClick={() => setVisible(true)}>选择</Button>
      </div>
      {_recordDetail}
      <MixDrawer
        type={5}
        visible={visible}
        selectId={id}
        onConfirm={_onConfirm}
        property={1}
        onClose={_onClose}
        selectType="checkbox"
        shopId={shopId}
        environment={environment}
      />
    </div>
  )
}

export default MobileQualityInformationList
