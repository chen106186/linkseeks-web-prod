import React, { useState, useMemo } from 'react'
import { Button, Tooltip, Input } from 'antd'
import { changeProps } from '@apps/design-core'
import { DeleteOutlined } from '@ant-design/icons'
import { ImageBox } from '@apps/components'
import { UploadImage } from '@apps/components'
import MixDrawer from '../../../../components/drawers/mixDrawer'
import uploadImgIcon from '@/assets/icons/upload_img_icon.svg'
import styles from './index.less'

interface BrandItemType {
  id: number
  name: string
  logoUrl: string
}

interface MobileQualityBrandListProps {
  dataList: any[]
  shopId: number
  environment: number
  name: string
  image: string
  brandList: BrandItemType[]
  brandIds: number[]
}

const MobileQualityBrandList = (props: MobileQualityBrandListProps) => {
  const { image, name, brandList = [], brandIds = [], shopId, environment } = props
  const [visible, setVisible] = useState<boolean>(false)

  const _onChangeByKey = (val: any, key: string, title?: string) => {
    const newProps: any = {
      [key]: val,
    }

    changeProps({
      title: title ? title : name,
      props: Object.assign({ ...props }, newProps),
    })
  }

  const _onClose = () => {
    setVisible(false)
  }

  const _onConfirm = (record: any) => {
    console.log(record, 'record')
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
          <img src={item?.logoUrl} />
          <Tooltip title={item?.name}>
            <span>{item?.name}</span>
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
        <div className={styles['banner-box-label']}>标题</div>
        <Input defaultValue={name} onBlur={(e) => _onChangeByKey(e.target.value, 'name', e.target.value)} />
      </div>
      <div className={styles['banner-box']}>
        <div className={styles['banner-box-label']}>图片</div>
        {image ? (
          <div className={styles['banner-box-icon']}>
            <ImageBox width="100%" height={96} src={image} />
            <div className={styles['banner-box-icon-cover']}>
              <UploadImage
                onChange={(url) => {
                  _onChangeByKey(url, 'image')
                }}
                listType="text"
              >
                <div className={styles['banner-box-icon-cover-bottom']}>添加图像</div>
              </UploadImage>
              <DeleteOutlined
                className={styles['banner-box-icon-cover-delete']}
                onClick={() => {
                  _onChangeByKey('', 'image')
                }}
              />
            </div>
          </div>
        ) : (
          <UploadImage
            onChange={(url) => {
              _onChangeByKey(url, 'image')
            }}
            listType="text"
          >
            <div className={styles['banner-box-icon']}>
              <img src={uploadImgIcon} className={styles['banner-box-icon-add']} />
              <div className={styles['banner-box-icon-cover']}>
                <div className={styles['banner-box-icon-cover-bottom']}>添加图像</div>
              </div>
            </div>
          </UploadImage>
        )}
      </div>
      <div className={styles['banner-box']}>
        <div className={styles['banner-box-label']}>推荐品牌</div>
        <Button onClick={() => setVisible(true)}>选择</Button>
      </div>
      {_recordDetail}
      <MixDrawer
        type={6}
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

export default MobileQualityBrandList
