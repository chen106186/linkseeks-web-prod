/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-25 11:34:36
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-26 14:41:00
 * @Description: 会员方块复选框
 */
import React, { useState, useEffect, useRef } from 'react'
import { Checkbox, Row, Col, Descriptions, Button } from 'antd'
import classNames from 'classnames'
import { checkMore } from '@/utils'
import styles from './index.less'

const PAGE_SIZE = 8

export type OptionItemType = {
  /**
   * 名称
   */
  label: string
  /**
   * 数据id
   */
  value: number
  /**
   * 等级
   */
  level: number
  /**
   * 角色名称
   */
  roleName: string
  /**
   * 等级类型
   */
  levelTypeName: string
  /**
   * 会员类型
   */
  memberTypeName: string
  /**
   * 等级标签
   */
  levelTag: string
}

export type ValueType = any[]

export type ParamsType = {
  /**
   * 当前页
   */
  current: number
  /**
   * 当前页数
   */
  pageSize: number
}

export type ResponseType = {
  data: OptionItemType[]
  totalCount: number
}

export type MemberCheckboxGroupProps = {
  /**
   * 选项
   */
  options?: OptionItemType[]
  /**
   * 值
   */
  value?: any[]
  /**
   * 默认值
   */
  defaultValue?: any[]
  /**
   * 选项改变触发事件
   */
  onChange?: (value: ValueType) => void
  /**
   * 是否显示加载更多按钮，默认 false
   */
  showMoreAction?: Boolean
  /**
   * 请求 options 的异步方法，与 options 属性互斥，options优先级高
   */
  fetchOptions?: (params: ParamsType) => Promise<ResponseType>
  /**
   * fetchOptions 额外的请求参数
   */
  extraParams?: { [key: string]: any }
  /**
   * 是否禁用
   */
  disabled?: boolean
}

const MemberCheckboxGroup: React.FC<MemberCheckboxGroupProps> = (props) => {
  const {
    options,
    value: outerValue,
    defaultValue = [],
    onChange,
    showMoreAction = false,
    fetchOptions,
    extraParams,
    disabled,
  } = props
  const initValue = 'value' in props ? outerValue : defaultValue
  const [value, setValue] = useState<ValueType>(initValue!)
  const [internalOptions, setInternalOptions] = useState<ResponseType>({ data: [], totalCount: 0 })
  const [loading, setLoading] = useState(false)

  const pageRef = useRef<number>(1)
  const sizeRef = useRef<number>(PAGE_SIZE)
  const hasMoreRef = useRef<boolean>(true)

  const getOptions: () => Promise<ResponseType> = () => {
    if (fetchOptions) {
      if (!hasMoreRef.current) {
        return
      }
      setLoading(true)
      return new Promise((resolve, reject) => {
        const params: ParamsType = Object.assign(
          {},
          { current: pageRef.current, pageSize: sizeRef.current },
          extraParams,
        )
        fetchOptions(params)
          .then((res) => {
            if (res) {
              resolve(res)
              hasMoreRef.current = checkMore(pageRef.current, sizeRef.current, res.data.length, res.totalCount)
            }
            reject()
          })
          .finally(() => {
            setLoading(false)
          })
      })
    }
  }

  useEffect(() => {
    if ('value' in props) {
      setValue(props.value!)
    }
  }, [props.value])

  useEffect(() => {
    if (!fetchOptions) {
      return
    }
    pageRef.current = 1
    hasMoreRef.current = true
    getOptions()?.then((res) => {
      setInternalOptions(res)
    })
  }, [fetchOptions])

  useEffect(() => {
    // 初始请求一次之后才生效
    if (!extraParams) {
      return
    }
    pageRef.current = 1
    hasMoreRef.current = true
    getOptions()?.then((res) => {
      setInternalOptions(res)
    })
  }, [extraParams])

  const handleChange = (val: ValueType) => {
    if (!('value' in props)) {
      setValue(val)
    }
    if (onChange) {
      onChange(val)
    }
  }

  const handleLoadMore = () => {
    if (loading) {
      return
    }
    pageRef.current += 1
    getOptions()?.then((res) => {
      setInternalOptions({ data: internalOptions.data.concat(res.data), totalCount: res.totalCount })
    })
  }

  const optionList = options || internalOptions.data
  const isShowMoreAction = showMoreAction && internalOptions.data.length < internalOptions.totalCount

  return (
    <div className={styles['member-list']}>
      <Checkbox.Group
        value={value}
        onChange={handleChange}
        className={styles['member-list-checkboxGroup']}
        disabled={disabled}
      >
        <Row gutter={[16, 16]}>
          {optionList.map((item) => {
            const itemCls = classNames(styles['member-list-item'], {
              [styles['member-list-item-checked']]: Array.isArray(value) && value.includes(item.value),
            })
            return (
              <Col span={12} key={item.value}>
                <div className={itemCls}>
                  <Row gutter={16} style={{ width: '100%' }}>
                    <Col span={6}>
                      <div className={styles['member-list-descriptions']}>
                        <div className={styles['member-list-descriptions-label']}>会员类型:</div>
                        <div className={styles['member-list-descriptions-content']}>{item.memberTypeName}</div>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className={styles['member-list-descriptions']}>
                        <div className={styles['member-list-descriptions-label']}>会员角色:</div>
                        <div className={styles['member-list-descriptions-content']}>{item.roleName}</div>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className={styles['member-list-descriptions']}>
                        <div className={styles['member-list-descriptions-label']}>等级类型:</div>
                        <div className={styles['member-list-descriptions-content']}>{item.levelTypeName}</div>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className={styles['member-list-descriptions']}>
                        <div className={styles['member-list-descriptions-label']}>等级标签:</div>
                        <div className={styles['member-list-descriptions-content']}>{item.levelTag}</div>
                      </div>
                    </Col>
                  </Row>
                  <Checkbox value={item.value} className={styles['member-list-item-checkbox']} />
                </div>
              </Col>
            )
          })}
        </Row>
      </Checkbox.Group>
      {isShowMoreAction && (
        <div className={styles['member-list-more']}>
          <Button type="link" loading={loading} onClick={handleLoadMore}>
            {!loading ? '加载更多' : '正在加载'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default MemberCheckboxGroup
