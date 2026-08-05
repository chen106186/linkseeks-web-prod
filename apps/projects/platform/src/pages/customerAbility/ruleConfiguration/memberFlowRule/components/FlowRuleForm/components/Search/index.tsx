/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-28 14:30:06
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 17:41:01
 * @Description: 搜索组件
 */
import React, { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Input, Button } from 'antd'
import styles from './index.less'

interface IProps {
  /**
   * 值
   */
  value?: string
  /**
   * 输入改变触发事件
   */
  onChange?: (value: string) => void
  /**
   * 搜索事触发事件
   */
  onSearch?: (value: string) => void
  /**
   * 点击重置按钮触发事件
   */
  onReset?: () => void
  /**
   * 是否在点击重置按钮的时候调用 onSearch 事件，默然为 true
   */
  searchOnResetAction?: boolean
}

const MySearch: React.FC<IProps> = (props: IProps) => {
  const { value, onChange, onSearch, onReset, searchOnResetAction, ...rest } = props
  const [keyword, setKeyword] = useState('')

  const intl = useIntl()

  useEffect(() => {
    if ('value' in props) {
      setKeyword(value)
    }
  }, [value])

  const handleChange = (next: string) => {
    if (!('value' in props)) {
      setKeyword(next)
    }
    if (onChange) {
      onChange(next)
    }
  }

  const handleSearch = (next) => {
    if (onSearch) {
      onSearch(next)
    }
  }

  const handleReset = () => {
    handleChange('')
    if (searchOnResetAction) {
      handleSearch('')
    }
    if (onReset) {
      onReset()
    }
  }

  return (
    <div className={styles.search}>
      <Input.Search
        style={{ width: '200px', marginRight: 16 }}
        value={keyword}
        onChange={(e) => handleChange(e.target.value)}
        onSearch={handleSearch}
        {...rest}
      />
      <Button onClick={handleReset}>
        {intl.formatMessage({ id: 'member.memberFlowRule.components.Search.reset' })}
      </Button>
    </div>
  )
}

MySearch.defaultProps = {
  onReset: undefined,
  searchOnResetAction: true,
}

export default MySearch
