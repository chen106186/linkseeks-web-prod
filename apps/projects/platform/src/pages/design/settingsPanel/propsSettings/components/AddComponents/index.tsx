import { SelectedInfoBaseType, addComponentByName, clearSelectedStatus, selectComponent } from '@apps/design-core'
import { WEB_DESIGN_COMPONENT } from '@apps/design-ui'
import SettingPanel from '@/pages/design/components/SettingPanel'
import { getWebIntl } from '@apps/locales'
import { Col, message, Row } from 'antd'
import { useMemo, useRef, useState } from 'react'
import cx from 'classnames'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import carouselBannerIcon from './imgs/banner.png'
import horizontalBannerIcon from './imgs/advert-banner.png'
import richTextIcon from './imgs/richtext.png'
import commodityFloorIcon from './imgs/commodity-floor.png'
import emptyIcon from './imgs/empty.png'
import hotspotImageIcon from './imgs/hotspot-image.png'
import couponIcon from './imgs/coupon.png'
import horizontalCommodityIcon from './imgs/horizontal-commodity.png'
import verticalCommodityIcon from './imgs/vertical-commodity.png'
import styles from './index.less'

interface IProps {
  layoutType: LAYOUT_TYPE
}

const AddComponents: React.FC<IProps> = (props) => {
  const { layoutType } = props
  const [selectComponentName, setSelectComponentName] = useState<WEB_DESIGN_COMPONENT>()
  const translate = getWebIntl()
  const newAddKey = useRef<string>()

  const handleCancel = () => {
    clearSelectedStatus()
  }

  const handleAddComponent = (componentName: WEB_DESIGN_COMPONENT) => {
    setSelectComponentName(componentName)
  }

  const handleConfirmSave = () => {
    if (selectComponentName) {
      const selectInfo = options.find((item) => item.value === selectComponentName)
      addComponentByName({
        position: '99',
        componentName: selectComponentName,
        componentProps: {
          canDelete: true,
          linkdisable: true,
        },
        addBefore: true,
        reset: {
          canDrag: true,
          canDelete: true,
          title: selectInfo?.label,
          firstLevel: true,
        },
        callback: (key) => {
          newAddKey.current = key
        },
      })

      if (newAddKey.current) {
        handleCancel()
        const specialProps: SelectedInfoBaseType = {
          parentKey: '0',
          key: newAddKey.current,
          domTreeKeys: ['0', newAddKey.current],
        }
        selectComponent(specialProps)
      }
    } else {
      message.info(translate('web.resource.shop.qingxuanzezujian'))
    }
  }

  const options = useMemo(() => {
    const list = [
      {
        img: carouselBannerIcon,
        label: translate('web.resource.shop.lunbotupian'),
        value: WEB_DESIGN_COMPONENT.CarouselBanner,
      },
      {
        img: horizontalBannerIcon,
        label: translate('web.resource.shop.hengxiangtupianguanggaowei'),
        value: WEB_DESIGN_COMPONENT.HorizontalBanner,
      },
      {
        img: richTextIcon,
        label: translate('web.resource.shop.fuwenben'),
        value: WEB_DESIGN_COMPONENT.RichText,
      },
      {
        img: hotspotImageIcon,
        label: translate('web.resource.shop.tupianrequ'),
        value: WEB_DESIGN_COMPONENT.HotspotImage,
      },
      {
        img: commodityFloorIcon,
        label: translate('web.resource.shop.shangpinlouceng'),
        value: WEB_DESIGN_COMPONENT.CommodityFloor,
      },
      {
        img: emptyIcon,
        label: translate('web.resource.shop.fuzhukongbai'),
        value: WEB_DESIGN_COMPONENT.Empty,
      },
      {
        img: couponIcon,
        label: translate('web.resource.shop.youhuiquantuijian'),
        value: WEB_DESIGN_COMPONENT.Coupon,
      },
      {
        img: horizontalCommodityIcon,
        label: translate('web.resource.shop.shangpintuijianhengxiang'),
        value: WEB_DESIGN_COMPONENT.HorizontalCommodity,
      },
      {
        img: verticalCommodityIcon,
        label: translate('web.resource.shop.shangpintuijianzongxiang'),
        value: WEB_DESIGN_COMPONENT.VerticalCommodity,
      },
    ]
    return list
  }, [layoutType])

  return (
    <SettingPanel onCancel={handleCancel} onOK={handleConfirmSave}>
      <Row>
        {options.map((item) => (
          <Col span={12} key={item.value}>
            <div className={styles['options-item']}>
              <div
                className={cx(styles['options-item-img'], item.value === selectComponentName && styles.active)}
                onClick={() => handleAddComponent(item.value)}
              >
                <img src={item.img} />
              </div>
              <div className={styles['options-item-label']}>{item.label}</div>
            </div>
          </Col>
        ))}
      </Row>
    </SettingPanel>
  )
}

export default AddComponents
