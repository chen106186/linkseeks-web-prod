import React, { useEffect, useRef, useState } from 'react'
import { CloseOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Input, Tag, Space } from 'antd'
// eslint-disable-next-line @typescript-eslint/camelcase
import { unstable_batchedUpdates } from 'react-dom'
import styles from './product.less'
import { priceFormat } from '@/utils/numberFomat'
import StatusTag from '@/components/StatusTag'
import defaultActivityImage from '@/assets/activity/ActivityImage.svg'

interface Iprops {
  onEdit?: ((data: { id: number; activityId: number }) => void) | null
  onRemove?: ((data: { id: number; activityId: number }) => void) | null
  productName: string
  productImgUrl: string
  id: number
  activityId?: number
  price: number
  activityList: {
    name: string
    id: number
    type: number
  }[]
  /** 是否有标签 */
  isWithLabels?: boolean
  activityImage?: string
  label?: string[]
  onLabelChange?: ((data: { id: number; activityId: number; label: string[] }) => void) | null
}

const defaultLabel = []
const Product: React.FC<Iprops> = (props: Iprops) => {
  const {
    onEdit,
    onRemove,
    productName,
    productImgUrl,
    id,
    activityId,
    price,
    activityList,
    isWithLabels,
    activityImage = defaultActivityImage,
    label = defaultLabel,
    onLabelChange = null,
  } = props
  const [inputVisible, setInputVisible] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const inputRef = useRef<Input | null>(null)
  const [tags, setTags] = useState<string[]>([])

  const showInput = () => {
    setInputVisible(true)
  }

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus()
    }
  }, [inputVisible])

  useEffect(() => {
    if (!isWithLabels || typeof label === 'undefined') {
      return
    }
    setTags(label)
  }, [isWithLabels, label])

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleInputConfirm = () => {
    if (inputValue === '') {
      setInputVisible(false)
      return
    }
    const newTag = tags.concat(inputValue)
    onLabelChange?.({ id: id, activityId: activityId!, label: newTag })
    unstable_batchedUpdates(() => {
      setTags(newTag)
      setInputValue('')
      setInputVisible(false)
    })
  }

  const handleEdit = () => {
    onEdit?.({
      id: id,
      activityId: activityId!,
    })
  }

  const handleRemove = () => {
    onRemove?.({
      id: id,
      activityId: activityId!,
    })
  }

  const removeTag = (index) => {
    const newTag = tags.filter((_item, _index) => _index !== index)
    setTags(newTag)
    onLabelChange?.({ id: id, activityId: activityId!, label: newTag })
  }

  const renderLabel = () => {
    return (
      <div className={styles.tagContainer}>
        <div className={styles.headerName}>活动标签</div>
        <div className={styles.tag}>
          {tags?.map((_item, index) => {
            return (
              <div className={styles.tagItem} key={index} onClick={() => removeTag(index)}>
                <StatusTag type="danger" title={_item}></StatusTag>
                <div>
                  <CloseOutlined style={{ color: '#EF3346' }} />
                </div>
              </div>
            )
          })}

          {inputVisible && (
            <Input
              ref={inputRef}
              type="text"
              size="small"
              className={styles.tagInput}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          )}
          {!inputVisible && (
            <Tag className={styles.addTag} onClick={showInput}>
              <PlusOutlined /> 新增标签
            </Tag>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.section}>
      <div className={styles.actions}>
        <Space>
          {onEdit && (
            <div className={styles.iconContainer} onClick={handleEdit}>
              <EditOutlined className={styles.icon} />
            </div>
          )}
          {onRemove && (
            <div className={styles.iconContainer} onClick={handleRemove}>
              <DeleteOutlined className={styles.icon} />
            </div>
          )}
        </Space>
      </div>
      <div className={styles.container}>
        <div className={styles.product}>
          {(productImgUrl && <img className={styles.img} src={productImgUrl} />) || (
            <div className={styles.img} style={{ border: '1px solid #ccc' }}></div>
          )}
          <div className={styles.info}>
            <span className={styles.name}>{productName}</span>
            <span className={styles.price}>￥{priceFormat(price)}</span>
          </div>
        </div>
        <div className={styles.activity}>
          <div className={styles.headerName}>商品活动</div>
          {activityList?.map((_item) => {
            return (
              <a
                className={styles.activityItem}
                key={_item.id}
                href={`/marketingManage/marketing/marketingSearch/preview?id=${_item.id}`}
                target="_blank"
              >
                <img className={styles.activityImg} src={activityImage} />
                <span className={styles.activityName}>{_item.name}</span>
                <StatusTag type="danger" title={_item.type}></StatusTag>
              </a>
            )
          })}
        </div>
        {(isWithLabels && renderLabel()) || null}
      </div>
    </div>
  )
}

export default Product
