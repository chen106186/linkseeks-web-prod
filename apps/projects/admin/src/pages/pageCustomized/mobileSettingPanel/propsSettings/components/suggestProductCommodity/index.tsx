import React, { useState, useEffect, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { Input, Button, Tag, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { changeProps } from '@apps/design-core'
import { usePageStatus } from '@/hooks/usePageStatus'
import styles from './index.less'

import StatusTag from '@/components/StatusTag'

import { getMarketingAdornGoodsListAdorn } from '@apps/apis'

import CommodityDrawer from '@/pages/pageCustomized/components/drawers/commodityDrawer'
import ActivityImage from '@/assets/activity/ActivityImage.svg'

import { priceFormat } from '@/utils/numberFomat'
interface SuggestProductCommodityProps {
  id?: any
  tags?: any
  // 当前选中组件的key
  selectedKey?: any
}

const SuggestProductCommodity: React.FC<SuggestProductCommodityProps> = (props: SuggestProductCommodityProps) => {
  const { id, tags, selectedKey } = props
  const { shopId } = usePageStatus()
  const [record, setRecord] = useState<any>([])
  const [commodityVisible, setCommodityVisible] = useState(false)
  const [inputVisible, setInputVisible] = useState(false)
  const saveEditInputRef = useRef<any>({})
  const saveInputRef = useRef<any>({})
  const [editInputIndex, setEditInputIndex] = useState(-1)
  const [editInputValue, setEditInputValue] = useState<any>('')
  const [inputValue, setInputValue] = useState<any>('')

  useEffect(() => {
    if (id && id != record[0]?.id) {
      const _params: any = {
        shopId,
        idInList: Array.isArray(id) ? id.join(',') : id,
        current: 1,
        pageSize: 10,
      }
      getMarketingAdornGoodsListAdorn(_params)
        .then((res) => {
          if (res.code === 1000) {
            setRecord(res.data.data)
          }
        })
        .catch((err) => console.log(err))
    } else if (!id) {
      setRecord([])
    }
  }, [id])

  const onOk = (data: any) => {
    setRecord(data)
    const _data = data
    changeProps({
      title: _data.name,
      props: Object.assign(
        { ...props },
        {
          ..._data,
          name: _data.name,
          image: _data.mainPic,
          mode: 'vertical',
          discountPrice: priceFormat(_data.min),
          buyBtn: false,
        },
      ),
    })
    setCommodityVisible(false)
  }

  const _onCommodityClose = () => {
    setCommodityVisible(false)
  }

  const _showInput = () => {
    setInputVisible(true)
  }

  const _handleClose = (removedTag: any) => {
    const _tags = tags?.filter((tag) => tag !== removedTag)
    changeProps({
      props: Object.assign({ ...props }, { tags: _tags }),
    })
  }

  useEffect(() => {
    if (inputVisible) {
      saveInputRef?.current?.focus()
    }
  }, [inputVisible])

  useEffect(() => {
    if (editInputIndex > -1 && editInputValue) {
      saveEditInputRef?.current?.focus()
    }
  }, [editInputIndex, editInputValue])

  const _handleEditInputChange = (e: any) => {
    setEditInputValue(e.target.value)
  }

  const _handleEditInputConfirm = () => {
    const newTags = [...tags]
    newTags[editInputIndex] = editInputValue
    setEditInputIndex(-1)
    setEditInputValue('')
    changeProps({
      props: Object.assign({ ...props }, { tags: newTags }),
    })
  }

  const _handleInputChange = (e: any) => {
    setInputValue(e.target.value)
  }

  const _handleInputConfirm = () => {
    let _tags = tags ? [...tags] : []
    if (inputValue && _tags.indexOf(inputValue) === -1) {
      _tags = [..._tags, inputValue]
    }
    setInputVisible(false)
    setInputValue('')
    changeProps({
      props: Object.assign({ ...props }, { tags: _tags }),
    })
  }

  const _handleToDetailPage = (id, belongType) => {
    if (belongType === 1) {
      history.open(`/marketing/marketingSearch/preview?id=${id}`)
    } else {
      history.open(`/marketingManage/merchantMarketing/merchantMarketingSearch/preview?id=${id}`)
    }
  }

  const _record = record[0]

  return (
    <div className={styles['suggestProductCommodity']}>
      {id && record ? (
        <>
          <div className={styles['suggestProductCommodity-detail']}>
            <img src={_record?.mainPic} />
            <div className={styles['suggestProductCommodity-detail-right']}>
              <Tooltip title={_record?.name}>
                <div className={styles['suggestProductCommodity-detail-right-title']}>{_record?.name}</div>
              </Tooltip>
              <div className={styles['suggestProductCommodity-detail-right-price']}>
                {_record?.min ? `¥ ${priceFormat(_record?.min)}` : ''}
              </div>
            </div>
            <div
              className={styles['suggestProductCommodity-detail-cover']}
              onClick={() => {
                setCommodityVisible(true)
              }}
            >
              <div className={styles['suggestProductCommodity-detail-cover-bottom']}>更换商品</div>
            </div>
          </div>
          <div className={styles['suggestProductCommodity-box']}>
            <div className={styles['suggestProductCommodity-box-label']}>商品活动</div>
            {_record?.activityList?.map((item, index) => {
              return (
                <div
                  className={styles['suggestProductCommodity-activityList']}
                  key={index}
                  onClick={() => {
                    _handleToDetailPage(item.id, item.belongType)
                  }}
                >
                  <img src={ActivityImage} />
                  <div className={styles['suggestProductCommodity-activityList-name']}>{item.name}</div>
                  <StatusTag title={item.type} type="danger" />
                </div>
              )
            })}
          </div>
          <div className={styles['suggestProductCommodity-box']}>
            <div className={styles['suggestProductCommodity-box-label']}>活动标签</div>
            <>
              {tags?.map((tag, index) => {
                if (editInputIndex === index) {
                  return (
                    <Input
                      ref={saveEditInputRef}
                      key={index}
                      size="small"
                      className={styles['tag-input']}
                      defaultValue={editInputValue}
                      onChange={_handleEditInputChange}
                      onBlur={_handleEditInputConfirm}
                      onPressEnter={_handleEditInputConfirm}
                    />
                  )
                }

                const isLongTag = tag.length > 20

                const tagElem = (
                  <Tag className={styles['edit-tag']} key={tag} closable onClose={() => _handleClose(tag)} color="red">
                    <span
                      onDoubleClick={(e) => {
                        if (index !== 0) {
                          setEditInputIndex(index)
                          setEditInputValue(tag)
                          e.preventDefault()
                        }
                      }}
                    >
                      {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                    </span>
                  </Tag>
                )
                return isLongTag ? (
                  <Tooltip title={tag} key={tag}>
                    {tagElem}
                  </Tooltip>
                ) : (
                  tagElem
                )
              })}
              {inputVisible && (
                <Input
                  ref={saveInputRef}
                  type="text"
                  size="small"
                  className={styles['tag-input']}
                  defaultValue={inputValue}
                  onChange={_handleInputChange}
                  onBlur={_handleInputConfirm}
                  onPressEnter={_handleInputConfirm}
                />
              )}
              {!inputVisible && (!tags || tags.length <= 2) && (
                <Tag className={styles['site-tag-plus']} onClick={_showInput}>
                  <PlusOutlined /> 新增标签
                </Tag>
              )}
            </>
          </div>
        </>
      ) : (
        <Button
          onClick={() => {
            setCommodityVisible(true)
          }}
        >
          选择商品
        </Button>
      )}
      <CommodityDrawer selectId={id} visible={commodityVisible} onClose={_onCommodityClose} onConfirm={onOk} />
    </div>
  )
}

export default SuggestProductCommodity
