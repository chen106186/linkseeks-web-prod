import React, { useMemo } from 'react'
import { Input, Select } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { useWebIntl } from '@apps/locales'
import { DeleteOutlined } from '@ant-design/icons'
import { changeProps } from '@apps/design-core'
import { LAYOUT_TYPE } from '@/constants'
import { UploadImage } from '@apps/components'
import uploadImgIcon from '@/assets/icons/upload_img_icon.svg'

import styles from './index.less'

interface BottomNavigationClientProps {
  // 默认icon
  defaultIcon?: any
  // 选中icon
  selectIcon?: any
  // 导航标题
  name?: any
  // 链接类型
  /** 类型：1-首页 2-分类 3-购物车 4-工作台 5-我的 6-找现货 7-找供应 8-求购 9-换积分 10-找店铺 */
  type?: any
  // 当前选中组件的key
  selectedKey?: any
  // 1.B端 2.C端 3.SRM
  property?: 1 | 2 | 3
  layoutType: LAYOUT_TYPE
}

const BottomNavigationClient: React.FC<BottomNavigationClientProps> = (props: BottomNavigationClientProps) => {
  const { defaultIcon, selectIcon, name, type, layoutType, selectedKey } = props
  const intl = useIntl()
  const translate = useWebIntl()

  const shopRedirectTypeList = [
    {
      value: 1,
      label: intl.formatMessage({ id: 'editor.bottom.link.type.home' }), // '首页',
    },
    {
      value: 2,
      label: intl.formatMessage({ id: 'editor.bottom.link.type.commodity' }), // '全部商品',
    },
    {
      value: 3,
      label: intl.formatMessage({ id: 'editor.bottom.link.type.classify' }), //'分类',
    },
    {
      value: 4,
      label: intl.formatMessage({ id: 'editor.bottom.link.type.integral.exchange' }), // '积分兑换',
    },
    {
      value: 5,
      label: intl.formatMessage({ id: 'editor.bottom.link.type.shop.member' }), //'店铺会员',
    },
    {
      value: 6,
      label: intl.formatMessage({ id: 'editor.bottom.link.type.shop.info' }), //'商家信息',
    },
  ]

  const ChannelRedirectTypeList = [
    {
      value: 1,
      label: intl.formatMessage({ id: 'editor.bottom.link.type.home' }), // '首页',
    },
    {
      value: 2,
      label: intl.formatMessage({ id: 'editor.bottom.link.type.classify' }), //'分类',
    },
    {
      value: 3,
      label: intl.formatMessage({ id: 'editor.bottom.link.type.integral' }), // '积分'
    },
    {
      value: 4,
      label: intl.formatMessage({ id: 'editor.bottom.link.type.information' }), // '资讯',
    },
    {
      value: 5,
      label: intl.formatMessage({ id: 'editor.bottom.link.type.message' }), // '消息',
    },
    {
      value: 6,
      label: intl.formatMessage({ id: 'editor.bottom.link.type.purchase' }), // '购物车',
    },
    {
      value: 7,
      label: intl.formatMessage({ id: 'editor.bottom.link.type.mine' }), // '我的',
    },
    {
      value: 8,
      label: translate('web.resource.mall.zhaoxianhuo'),
    },
    {
      value: 9,
      label: translate('web.resource.mall.zhaogongying'),
    },
  ]

  const _isNull = (list) => {
    let _number = 0
    for (let key in list) {
      if (list[key]) {
        _number += 1
      }
    }
    return _number === list.length ? false : true
  }

  const _onChangeName = (e: any) => {
    const _val = e.target.value
    changeProps({
      title: _val || '',
      props: Object.assign({ ...props }, { name: _val, isnull: _isNull([defaultIcon, selectIcon, _val, type]) }),
    })
  }

  const _onChangeType = (value: any) => {
    changeProps({
      props: Object.assign({ ...props }, { type: value, isnull: _isNull([defaultIcon, selectIcon, name, value]) }),
    })
  }

  const _onChangeDefaultIcon = (url: any) => {
    changeProps({
      props: Object.assign({ ...props }, { defaultIcon: url, isnull: _isNull([url, selectIcon, name, type]) }),
    })
  }

  const _onChangeSelectIcon = (url: any) => {
    changeProps({
      props: Object.assign({ ...props }, { selectIcon: url, isnull: _isNull([defaultIcon, url, name, type]) }),
    })
  }

  const _getNavLinkType = useMemo(() => {
    if (layoutType === LAYOUT_TYPE.shop) {
      return shopRedirectTypeList
    } else {
      return ChannelRedirectTypeList
    }
  }, [layoutType])

  return (
    <div className={styles['bottomNavigationClient']}>
      <div className={styles['bottomNavigationClient-box']}>
        <div className={styles['bottomNavigationClient-box-label']}>
          {intl.formatMessage({ id: 'editor.setting.form.name' })}
        </div>
        <Input key={`${selectedKey}-name`} maxLength={4} defaultValue={name} onBlur={_onChangeName} />
      </div>
      <div className={styles['bottomNavigationClient-box']}>
        <div className={styles['bottomNavigationClient-box-label']}>
          {intl.formatMessage({ id: 'editor.setting.form.link' })}
        </div>
        <Select key={`${selectedKey}-type`} defaultValue={type} onChange={_onChangeType} style={{ width: '100%' }}>
          {_getNavLinkType?.map((selectItem) => (
            <Select.Option value={selectItem.value} key={`redirect_type_${selectItem.value}`}>
              {selectItem.label}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className={styles['bottomNavigationClient-box']}>
        <div className={styles['bottomNavigationClient-box-label']}>
          {intl.formatMessage({ id: 'editor.form.label.icon.default' })}
        </div>
        {defaultIcon ? (
          <div className={styles['bottomNavigationClient-box-icon']}>
            <img src={defaultIcon} />
            <div className={styles['bottomNavigationClient-box-icon-cover']}>
              <UploadImage
                onChange={(url) => {
                  _onChangeDefaultIcon(url)
                }}
                listType="text"
              >
                <div className={styles['bottomNavigationClient-box-icon-cover-bottom']}>
                  {intl.formatMessage({ id: 'editor.setting.upload.btn' })}
                </div>
                <DeleteOutlined
                  className={styles['bottomNavigationClient-box-icon-cover-delete']}
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    _onChangeDefaultIcon('')
                  }}
                />
              </UploadImage>
            </div>
          </div>
        ) : (
          <UploadImage
            onChange={(url) => {
              _onChangeDefaultIcon(url)
            }}
            listType="text"
          >
            <div className={styles['bottomNavigationClient-box-icon']}>
              <img src={uploadImgIcon} className={styles['bottomNavigationClient-box-icon-add']} />
              <div className={styles['bottomNavigationClient-box-icon-cover']}>
                <div className={styles['bottomNavigationClient-box-icon-cover-bottom']}>
                  {intl.formatMessage({ id: 'editor.setting.upload.btn' })}
                </div>
              </div>
            </div>
          </UploadImage>
        )}
      </div>
      <div className={styles['bottomNavigationClient-box']}>
        <div className={styles['bottomNavigationClient-box-label']}>
          {intl.formatMessage({ id: 'editor.form.label.icon.select' })}
        </div>
        {selectIcon ? (
          <div className={styles['bottomNavigationClient-box-icon']}>
            <img src={selectIcon} />
            <div className={styles['bottomNavigationClient-box-icon-cover']}>
              <UploadImage
                onChange={(url) => {
                  _onChangeSelectIcon(url)
                }}
                listType="text"
              >
                <div className={styles['bottomNavigationClient-box-icon-cover-bottom']}>
                  {intl.formatMessage({ id: 'editor.setting.upload.btn' })}
                </div>
                <DeleteOutlined
                  className={styles['bottomNavigationClient-box-icon-cover-delete']}
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    _onChangeSelectIcon('')
                  }}
                />
              </UploadImage>
            </div>
          </div>
        ) : (
          <UploadImage
            onChange={(url) => {
              _onChangeSelectIcon(url)
            }}
            listType="text"
          >
            <div className={styles['bottomNavigationClient-box-icon']}>
              <img src={uploadImgIcon} className={styles['bottomNavigationClient-box-icon-add']} />
              <div className={styles['bottomNavigationClient-box-icon-cover']}>
                <div className={styles['bottomNavigationClient-box-icon-cover-bottom']}>
                  {intl.formatMessage({ id: 'editor.setting.upload.btn' })}
                </div>
              </div>
            </div>
          </UploadImage>
        )}
      </div>
    </div>
  )
}

export default BottomNavigationClient
