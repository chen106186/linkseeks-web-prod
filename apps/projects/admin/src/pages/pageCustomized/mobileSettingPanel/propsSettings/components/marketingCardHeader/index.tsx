import React from 'react'
import { Input } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { changeProps } from '@apps/design-core'

import styles from './index.less'

import ICONS_CONFIG from '../../../../components/mobileClientEditLeft/iconsConfig'

import { UploadImage } from '@apps/components'

interface MarketingCardHeaderProps {
  // 活动类型
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19
  // 自定title
  title?: string
  // 自定info
  explain?: string
  // 自定icon
  icon?: any
  // 倒计时数组[时,分,秒]
  countDown?: string[]
  selectedKey?: any
}

const MarketingCardHeader: React.FC<MarketingCardHeaderProps> = (props: MarketingCardHeaderProps) => {
  const { type, title, explain, icon, selectedKey } = props
  const _defaultInfo = ICONS_CONFIG.filter((item) => item.type === type)[0]
  const _onChangeTitle = (e: any) => {
    const _val = e.target.value
    changeProps({
      props: Object.assign({ ...props }, { title: _val }),
    })
  }
  const _onChangeExplain = (e: any) => {
    const _val = e.target.value
    changeProps({
      props: Object.assign({ ...props }, { explain: _val }),
    })
  }

  const _onChangeIcon = (url: any) => {
    changeProps({
      props: Object.assign({ ...props }, { icon: url }),
    })
  }

  return (
    <div className={styles['marketingCardHeader']}>
      <div className={styles['marketingCardHeader-box']}>
        <div className={styles['marketingCardHeader-box-label']}>标题</div>
        <Input
          key={`${selectedKey}-title`}
          defaultValue={title || _defaultInfo?.title}
          onBlur={_onChangeTitle}
          maxLength={16}
        />
      </div>
      <div className={styles['marketingCardHeader-box']}>
        <div className={styles['marketingCardHeader-box-label']}>标题说明</div>
        <Input
          key={`${selectedKey}-explain`}
          defaultValue={explain || _defaultInfo?.explain}
          onBlur={_onChangeExplain}
        />
      </div>
      <div className={styles['marketingCardHeader-box']}>
        <div className={styles['marketingCardHeader-box-label']}>图标</div>
        {icon ? (
          <div className={styles['marketingCardHeader-box-icon']}>
            <img src={icon} />
            <div className={styles['marketingCardHeader-box-icon-cover']}>
              <UploadImage
                onChange={(url) => {
                  _onChangeIcon(url)
                }}
                listType="text"
              >
                <div className={styles['marketingCardHeader-box-icon-cover-bottom']}>添加图像</div>
              </UploadImage>
              <DeleteOutlined
                className={styles['marketingCardHeader-box-icon-cover-delete']}
                onClick={() => {
                  _onChangeIcon('')
                }}
              />
            </div>
          </div>
        ) : (
          <UploadImage
            onChange={(url) => {
              _onChangeIcon(url)
            }}
            listType="text"
          >
            <div className={styles['marketingCardHeader-box-icon']}>
              <img src={_defaultInfo.icon} />
              <div className={styles['marketingCardHeader-box-icon-cover']}>
                <div className={styles['marketingCardHeader-box-icon-cover-bottom']}>添加图像</div>
              </div>
            </div>
          </UploadImage>
        )}
      </div>
    </div>
  )
}

export default MarketingCardHeader
