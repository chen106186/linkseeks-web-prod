import React, { useMemo } from 'react'
import { Input, Select } from 'antd'
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import { changeProps } from '@apps/design-core'

import styles from './index.less'

import { UploadImage } from '@apps/components'

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
}

const RedirectTypeListB = [
  {
    value: 1,
    label: '首页',
  },
  {
    value: 2,
    label: '分类',
  },
  {
    value: 3,
    label: '购物车',
  },
  {
    value: 4,
    label: '消息',
  },
  {
    value: 5,
    label: '我的',
  },
  {
    value: 6,
    label: '找现货',
  },
  {
    value: 7,
    label: '找供应',
  },
  {
    value: 8,
    label: '换积分',
  },
  {
    value: 9,
    label: '找店铺',
  },
  {
    value: 10,
    label: '在线客服',
  },
]

const RedirectTypeListC = [
  {
    value: 1,
    label: '首页',
  },
  {
    value: 2,
    label: '分类',
  },
  {
    value: 3,
    label: '购物车',
  },
  {
    value: 4,
    label: '我的',
  },
  {
    value: 5,
    label: '消息',
  },
  {
    value: 6,
    label: '积分兑换',
  },
  {
    value: 10,
    label: '在线客服',
  },
]

const BottomNavigationClient: React.FC<BottomNavigationClientProps> = (props: BottomNavigationClientProps) => {
  const { defaultIcon, selectIcon, name, type, property = 2, selectedKey } = props

  const _isNull = (list) => {
    let _number = 0
    for (const key in list) {
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

  const RedirectTypeList = useMemo(() => {
    if (property === 1) {
      return RedirectTypeListB
    } else if (property === 2) {
      return RedirectTypeListC
    }
  }, [property])

  return (
    <div className={styles['bottomNavigationClient']}>
      <div className={styles['bottomNavigationClient-box']}>
        <div className={styles['bottomNavigationClient-box-label']}>名称</div>
        <Input key={`${selectedKey}-name`} defaultValue={name} onBlur={_onChangeName} />
      </div>
      <div className={styles['bottomNavigationClient-box']}>
        <div className={styles['bottomNavigationClient-box-label']}>链接</div>
        <Select key={`${selectedKey}-type`} defaultValue={type} onChange={_onChangeType} style={{ width: '100%' }}>
          {RedirectTypeList?.map((selectItem) => (
            <Select.Option value={selectItem.value} key={`redirect_type_${selectItem.value}`}>
              {selectItem.label}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className={styles['bottomNavigationClient-box']}>
        <div className={styles['bottomNavigationClient-box-label']}>图标-默认</div>
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
                <div className={styles['bottomNavigationClient-box-icon-cover-bottom']}>添加图像</div>
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
              <PlusCircleOutlined className={styles['bottomNavigationClient-box-icon-add']} />
              <div className={styles['bottomNavigationClient-box-icon-cover']}>
                <div className={styles['bottomNavigationClient-box-icon-cover-bottom']}>添加图像</div>
              </div>
            </div>
          </UploadImage>
        )}
      </div>
      <div className={styles['bottomNavigationClient-box']}>
        <div className={styles['bottomNavigationClient-box-label']}>图标-选中</div>
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
                <div className={styles['bottomNavigationClient-box-icon-cover-bottom']}>添加图像</div>
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
              <PlusCircleOutlined className={styles['bottomNavigationClient-box-icon-add']} />
              <div className={styles['bottomNavigationClient-box-icon-cover']}>
                <div className={styles['bottomNavigationClient-box-icon-cover-bottom']}>添加图像</div>
              </div>
            </div>
          </UploadImage>
        )}
      </div>
    </div>
  )
}

export default BottomNavigationClient
