import React from 'react'
import { Input, Checkbox } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { changeProps } from '@apps/design-core'
import { UploadImage } from '@apps/components'

import uploadImgIcon from '@/assets/icons/upload_img_icon.svg'
import styles from './index.less'

interface HeaderNavActiontProps {
  // 名称
  name: string
  // 是否显示
  visible: boolean
  // 图片链接或者关键词
  content: string
  // 1: 我的； 2: 购物车；3: 消息；4: 搜索框
  type: number
  // 当前选中组件的key
  selectedKey?: any
  // 1.B端 2.C端 3.SRM
  property?: 1 | 2 | 3
}

const HeaderNavAction: React.FC<HeaderNavActiontProps> = (props: HeaderNavActiontProps) => {
  const { name, visible = true, content, type, selectedKey } = props

  const _onChangeByKey = (val: any, key: string) => {
    changeProps({
      props: Object.assign({ ...props }, { [key]: val }),
    })
  }

  return (
    <div className={styles['banner']}>
      <div className={styles['banner-box']}>
        <div className={styles['banner-box-label']}>名称</div>
        <Input key={`${selectedKey}-name`} disabled defaultValue={name} />
      </div>
      {type === 4 ? (
        <div className={styles['banner-box']}>
          <div className={styles['banner-box-label']}>关键词</div>
          <Input
            key={`${selectedKey}-name`}
            defaultValue={content}
            onBlur={(e) => _onChangeByKey(e.target.value, 'content')}
          />
        </div>
      ) : (
        <div className={styles['banner-box']}>
          <div className={styles['banner-box-label']}>图片</div>
          {content ? (
            <div className={styles['banner-box-icon']}>
              <img src={content} />
              <div className={styles['banner-box-icon-cover']}>
                <UploadImage
                  onChange={(url) => {
                    _onChangeByKey(url, 'content')
                  }}
                  listType="text"
                >
                  <div className={styles['banner-box-icon-cover-bottom']}>添加图像</div>
                </UploadImage>
                <DeleteOutlined
                  className={styles['banner-box-icon-cover-delete']}
                  onClick={() => {
                    _onChangeByKey('', 'content')
                  }}
                />
              </div>
            </div>
          ) : (
            <UploadImage
              onChange={(url) => {
                _onChangeByKey(url, 'content')
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
      )}
      {(type === 1 || type === 3) && (
        <div className={styles['banner-box']}>
          <div className={styles['banner-box-label']}>显示/隐藏</div>
          <Checkbox checked={!visible} onChange={(e) => _onChangeByKey(!e.target.checked, 'visible')}>
            隐藏整个模块
          </Checkbox>
        </div>
      )}
    </div>
  )
}

export default HeaderNavAction
