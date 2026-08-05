import React from 'react'
import { Input, Radio, Space, Select } from 'antd'
import { changeProps, PageConfigType, updatePageConfig, produce } from '@apps/design-core'

import styles from './index.less'

interface ClassifyLabelProps {
  title?: string
  explain?: string
  type?: number
  manageWay?: number
  num?: number
  customize?: any
  // 当前选中组件的key
  selectedKey?: any
  pageConfig: PageConfigType
}

const ClassLabelType = [
  {
    label: '商品',
    value: 1,
  },
  {
    label: '店铺',
    value: 2,
  },
  {
    label: '品牌',
    value: 3,
  },
  {
    label: '资讯',
    value: 4,
  },
]

const ChildComponentMap = {
  1: {
    componentName: 'SuggestProduct.Commodity',
    btnText: '添加商品',
  },
  2: {
    componentName: 'SuggestProduct.Store',
    btnText: '添加店铺',
  },
  3: {
    componentName: 'SuggestProduct.Brand',
    btnText: '添加品牌',
  },
  4: {
    componentName: 'SuggestProduct.Information',
    btnText: '添加资讯',
  },
}

const ClassifyLabel: React.FC<ClassifyLabelProps> = (props: ClassifyLabelProps) => {
  const { title, explain, type, num, manageWay, selectedKey, pageConfig } = props
  const _isNull = (list) => {
    let _number = 0
    for (let key in list) {
      if (list[key]) {
        _number += 1
      }
    }
    return _number === list.length ? false : true
  }

  const _onChangeByKey = (val: any, key: string, newTitle?: string) => {
    const newProps: any = {
      [key]: val,
      isnull: false,
    }

    // 如果选择的类型是商品，则判断商品展示是否自定义商品
    if (key === 'manageWay' && Number(val) === 3) {
      const newPageConfig = produce(pageConfig, (oldPageConfig) => {
        oldPageConfig[selectedKey] = {
          ...oldPageConfig[selectedKey],
          props: {
            ...oldPageConfig[selectedKey].props,
            ...newProps,
            column: 2,
            type,
          },
          childComponentName: ChildComponentMap[1].componentName,
          childNodes: [],
          addBtnText: ChildComponentMap[1].btnText,
        }
      })
      updatePageConfig(newPageConfig)
      return
    } else if (key === 'manageWay' && Number(val) !== 3) {
      const newPageConfig = produce(pageConfig, (oldPageConfig) => {
        oldPageConfig[selectedKey] = {
          ...oldPageConfig[selectedKey],
          props: {
            ...oldPageConfig[selectedKey].props,
            ...newProps,
            column: 2,
            type,
          },
          childComponentName: ChildComponentMap[1].componentName,
          addBtnText: '',
          firstLevel: true,
          childNodes: [],
        }
      })
      updatePageConfig(newPageConfig)
      return
    }

    // 商品以外的类型
    if (key === 'type' && Number(val) !== 1) {
      const newPageConfig = produce(pageConfig, (oldPageConfig) => {
        oldPageConfig[selectedKey] = {
          ...oldPageConfig[selectedKey],
          props: {
            ...oldPageConfig[selectedKey].props,
            ...newProps,
            column: 1,
          },
          childNodes: [],
          childComponentName: ChildComponentMap[Number(val)].componentName,
          addBtnText: ChildComponentMap[Number(val)].btnText,
        }
      })
      updatePageConfig(newPageConfig)
      return
    }

    changeProps({
      title: newTitle ? newTitle : title,
      props: Object.assign({ ...props }, newProps),
    })
  }

  return (
    <div className={styles['ClassifyLabel']}>
      <div className={styles['ClassifyLabel-box']}>
        <div className={styles['ClassifyLabel-box-label']}>标题</div>
        <Input
          key={`${selectedKey}-title`}
          defaultValue={title}
          onBlur={(e) => _onChangeByKey(e.target.value, 'title', e.target.value)}
          maxLength={8}
        />
      </div>
      <div className={styles['ClassifyLabel-box']}>
        <div className={styles['ClassifyLabel-box-label']}>标题说明</div>
        <Input
          key={`${selectedKey}-explain`}
          defaultValue={explain}
          onBlur={(e) => _onChangeByKey(e.target.value, 'explain')}
          maxLength={16}
        />
      </div>
      <div className={styles['ClassifyLabel-box']}>
        <div className={styles['ClassifyLabel-box-label']}>类型</div>
        <Select
          key={`${selectedKey}-type`}
          defaultValue={type}
          onChange={(val) => _onChangeByKey(val, 'type')}
          style={{ width: '100%' }}
        >
          {ClassLabelType.map((selectItem) => (
            <Select.Option value={selectItem.value} key={`redirect_type_${selectItem.value}`}>
              {selectItem.label}
            </Select.Option>
          ))}
        </Select>
      </div>
      {type === 1 && (
        <>
          <div className={styles['ClassifyLabel-box']}>
            <div className={styles['ClassifyLabel-box-label']}>商品展示</div>
            <Radio.Group
              key={`${selectedKey}-type`}
              onChange={(e) => _onChangeByKey(e.target.value, 'manageWay')}
              defaultValue={manageWay}
            >
              <Space direction="vertical">
                <Radio value={1}>自动按销量排行展示 (从高到低)</Radio>
                <Radio value={5}>自动按上架时间排序 (从新到旧)</Radio>
                <Radio value={3}>自定义商品</Radio>
              </Space>
            </Radio.Group>
          </div>
          {manageWay !== 3 && (
            <div className={styles['ClassifyLabel-box']}>
              <div className={styles['ClassifyLabel-box-label']}>展示数量</div>
              <Input
                key={`${selectedKey}-num`}
                type="number"
                defaultValue={num}
                onBlur={(e) => _onChangeByKey(e.target.value, 'num')}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ClassifyLabel
