import React, { useState, useEffect, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import cx from 'classnames'
import styles from '../../index.less'
import { Button, Tooltip, Upload } from 'antd'
import { DeleteOutlined, DragOutlined, LinkOutlined, PlusOutlined } from '@ant-design/icons'
import { useDrag, useDrop, DropTargetMonitor, XYCoord, DragSourceMonitor } from 'react-dnd'

/**
 * 新增商品 商品描述区域 图片拖拽排序
 */

interface RenderProps {
  id: number
  key: number
  index: number
  item: ImageItemProps
  uploadProps: any
  uploadTip?: string
  handleDelete: (idx: number) => void
  handleAddlink: (idx: number) => void
  changePosition: (dragIdx: number, hoverIdx: number) => void
}

interface DragItem {
  index: number
  id: string
  type: string
}

const ImageItem: React.FC<RenderProps> = (props) => {
  const intl = useIntl()
  const { id, key, index, item, uploadProps, uploadTip, handleAddlink, handleDelete, changePosition } = props

  const ref = useRef<HTMLDivElement>(null)
  const [, drop] = useDrop({
    accept: 'ImageItem',
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }
      /** 当前拖拽的索引 */
      const dragIndex = item.index
      /** 拖拽后位置的索引 */
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      const clientOffset = monitor.getClientOffset()
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // console.log(dragIndex, hoverIndex)
      changePosition(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    item: { type: 'ImageItem', id, index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  return (
    <div key={index} className={cx(styles['descript-box'], styles['media-content-box'])} ref={ref}>
      <p className={styles.divImage}>
        <img src={item['url']} />
      </p>
      <div className={styles['right-btn']}>
        <Tooltip title={uploadTip || ''}>
          <Upload {...uploadProps}>
            <Button size="small" icon={<PlusOutlined />} />
          </Upload>
        </Tooltip>
        <Tooltip title={intl.formatMessage({ id: 'commodity.products.components.dragSortImageList.tooltip.1' })}>
          <Button size="small" onClick={() => handleDelete(index)} icon={<DeleteOutlined />} />
        </Tooltip>
        <Tooltip title={intl.formatMessage({ id: 'commodity.products.components.dragSortImageList.tooltip.2' })}>
          <Button size="small" onClick={() => handleAddlink(index)} icon={<LinkOutlined />} />
        </Tooltip>
        <Tooltip title={intl.formatMessage({ id: 'commodity.products.components.dragSortImageList.tooltip.3' })}>
          <Button size="small" icon={<DragOutlined />} />
        </Tooltip>
      </div>
    </div>
  )
}

interface ImageItemProps {
  url: string
  linkType: number
  link: string
}

interface DragSortImageListProps {
  imageList: ImageItemProps[]
  uploadProps: any
  describe?: string
  uploadTip?: string
  handleDelete: (idx: number) => void
  handleAddlink: (idx: number) => void
  changePosition: (dragIdx: number, hoverIdx: number) => void
}

const DragSortImageList: React.FC<DragSortImageListProps> = (props) => {
  const intl = useIntl()
  const { imageList, uploadProps, uploadTip, describe, handleDelete, handleAddlink, changePosition } = props

  const renderImageList = (item: ImageItemProps, index: number) => {
    return (
      <ImageItem
        id={index}
        key={index}
        index={index}
        item={item}
        uploadProps={uploadProps}
        uploadTip={uploadTip}
        handleDelete={handleDelete}
        handleAddlink={handleAddlink}
        changePosition={changePosition}
      />
    )
  }

  return (
    <div>
      {imageList?.length > 0 ? (
        imageList.map((item, index) => renderImageList(item, index))
      ) : (
        <div className={styles['descript-box']}>
          <p>
            {describe
              ? describe
              : intl.formatMessage({ id: 'commodity.products.components.dragSortImageList.descriptBox' })}
          </p>
          <div className={styles['right-btn']}>
            <Tooltip title={uploadTip || ''}>
              <Upload {...uploadProps}>
                <Button size="small" icon={<PlusOutlined />} />
              </Upload>
            </Tooltip>
            <Button size="small" icon={<DeleteOutlined />} />
          </div>
        </div>
      )}
    </div>
  )
}

export default DragSortImageList
