import React from 'react'
import { Input, Radio, Space } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { changeProps } from '@apps/design-core'

import styles from './index.less'

interface SuggestProductProps {
  title?: string
  explain?: string
  type?: number
  num?: number
  customize?: any
  // 当前选中组件的key
  selectedKey?: any
}

const SuggestProduct: React.FC<SuggestProductProps> = (props: SuggestProductProps) => {
  const { title, explain, type, num, customize, selectedKey } = props
  const intl = useIntl()

  const _isNull = (list) => {
    let _number = 0
    for (let key in list) {
      if (list[key]) {
        _number += 1
      }
    }
    return _number === list.length ? false : true
  }

  const _onChangeTitle = (e: any) => {
    const _val = e.target.value
    changeProps({
      title: _val || '',
      props: Object.assign({ ...props }, { title: _val, isnull: _isNull([_val, explain, type]) }),
    })
  }

  const _onChangeExplain = (e: any) => {
    const _val = e.target.value
    changeProps({
      props: Object.assign({ ...props }, { explain: _val, isnull: _isNull([title, _val, type]) }),
    })
  }

  const _onChangeType = (e: any) => {
    const _val = e.target.value
    changeProps({
      props: Object.assign({ ...props }, { type: _val, isnull: _isNull([title, explain, _val]) }),
      childComponentName: 'SuggestProduct.Commodity',
      childNodes: [],
      addBtnText: _val === 3 ? intl.formatMessage({ id: 'editor.template.add.product' }) : '',
    })
  }

  const _onChangeNum = (e: any) => {
    const _val = e.target.value.replace(/[^\d]/g, '')
    changeProps({
      props: Object.assign({ ...props }, { num: _val, isnull: _isNull([title, explain, type]) }),
      maxLength: _val,
    })
  }

  return (
    <div className={styles['suggestProduct']}>
      <div className={styles['suggestProduct-box']}>
        <div className={styles['suggestProduct-box-label']}>
          {intl.formatMessage({ id: 'editor.setting.form.title' })}
        </div>
        <Input key={`${selectedKey}-title`} defaultValue={title} onBlur={_onChangeTitle} maxLength={8} />
      </div>
      <div className={styles['suggestProduct-box']}>
        <div className={styles['suggestProduct-box-label']}>
          {intl.formatMessage({ id: 'editor.setting.form.explain' })}
        </div>
        <Input key={`${selectedKey}-explain`} defaultValue={explain} onBlur={_onChangeExplain} maxLength={8} />
      </div>
      <div className={styles['suggestProduct-box']}>
        <div className={styles['suggestProduct-box-label']}>
          {intl.formatMessage({ id: 'editor.form.label.product.show' })}
        </div>
        <Radio.Group key={`${selectedKey}-type`} onChange={_onChangeType} defaultValue={type}>
          <Space direction="vertical">
            <Radio value={1}>{intl.formatMessage({ id: 'editor.form.label.product.type_1' })}</Radio>
            <Radio value={5}>{intl.formatMessage({ id: 'editor.form.label.product.type_2' })}</Radio>
            <Radio value={3}>{intl.formatMessage({ id: 'editor.form.label.product.type_3' })}</Radio>
          </Space>
        </Radio.Group>
      </div>
      <div className={styles['suggestProduct-box']}>
        <div className={styles['suggestProduct-box-label']}>
          {intl.formatMessage({ id: 'editor.form.label.product.show.count' })}
        </div>
        <Input key={`${selectedKey}-num`} defaultValue={num} onBlur={_onChangeNum} />
      </div>
    </div>
  )
}

export default SuggestProduct
