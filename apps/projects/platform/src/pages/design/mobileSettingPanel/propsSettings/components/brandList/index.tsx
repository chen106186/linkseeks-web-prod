import React, { useState, useMemo } from 'react'
import { Button, Tooltip } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { changeProps } from '@apps/design-core'
import { DeleteOutlined } from '@ant-design/icons'
import { LAYOUT_TYPE } from '@/constants'
import MixDrawer from '@/pages/design/components/drawer/mixDrawer'
import { ImageBox } from '@apps/components'
import styles from './index.less'

interface BrandItemType {
  id: number
  name: string
  logoUrl: string
}

interface MobileQualityBrandListProps {
  shopId: number
  brandList: BrandItemType[]
  brandIds: number[]
  layoutType: LAYOUT_TYPE
  environment: number
}

const MobileBrandList: React.FC<MobileQualityBrandListProps> = (props) => {
  const { brandList = [], brandIds = [], environment, shopId, layoutType } = props
  const [visible, setVisible] = useState<boolean>(false)
  const intl = useIntl()

  const _onClose = () => {
    setVisible(false)
  }

  const _onConfirm = (record: any) => {
    changeProps({
      props: Object.assign(
        { ...props },
        {
          brandIds: [...brandIds, ...record.map((item) => item.id)],
          brandList: [...brandList, ...record],
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
            brandIds: brandIds.filter((item) => item !== deleteId),
            brandList: brandList.filter((item) => item.id !== deleteId),
          },
        ),
      })
    }
  }

  const _recordDetail = useMemo(() => {
    if (brandList && brandList.length > 0) {
      return brandList.map((item) => (
        <div className={styles['banner-record-shop']}>
          <ImageBox width={40} height={40} src={item?.logoUrl} />
          <Tooltip title={item?.name}>
            <span style={{ marginLeft: 8 }}>{item?.name}</span>
          </Tooltip>
          <div className={styles['banner-record-shop-mask']}>
            <DeleteOutlined
              className={styles['banner-record-shop-mask-delete']}
              onClick={() => _handleDeleteItem(item?.id)}
            />
          </div>
        </div>
      ))
    }
  }, [brandList])

  return (
    <div className={styles['banner']}>
      <div className={styles['banner-box']}>
        <div className={styles['banner-box-label']}>
          {intl.formatMessage({ id: 'editor.form.label.brand.recommend' })}
        </div>
        <Button onClick={() => setVisible(true)}>{intl.formatMessage({ id: 'common.button.select' })}</Button>
      </div>
      {_recordDetail}
      <MixDrawer
        type={6}
        layoutType={layoutType}
        visible={visible}
        selectId={brandIds}
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

export default MobileBrandList
