import { Row, Button, Space, Tag, Anchor, message } from '@linkseeks/ui'
import CardWrapper from '../../components/CardWrapper'
import React, { useState, createContext, useContext, useRef } from 'react'
import styles from './index.less'
import cn from 'classnames'
import { EditFillIcon, FileRemoveFillIcon } from '@linkseeks/icons'
import { StandardUpload, UploadFile } from '@apps/components'
import EditPhotoModal from './EditPhotoModal'
import EditCharModal from './EditCharModal'
import { CONTENT_TYPE, ContentProp, ProductDetailProvider, useProductDetailContext } from './context'
import { ShowType, UploadFileType } from '@apps/components/src/web/UploadFile/constants'
import { SortableContext, verticalListSortingStrategy, useSortable, CSS } from '@linkseeks/tools'
import { DndContextProvider, useDnd } from './useDnd'
import { FormItemWrapper, useProductForm, ProductPreviewBlock } from '@apps/services/commodity'
import { useWebIntl } from '@apps/locales'
import { useToggle } from '@linkseeks/hooks'

const CONTAINER_HEIGHT = 600

// 点击滚动hook
const useScrollable = () => {
  // 处理滚动到锚点的函数
  const scrollToAnchor = (id: string) => {
    // 计算滚动位置，例如，滚动到锚点 "anchor1"
    // @ts-ignore
    const anchorElement = document.getElementById(id)

    anchorElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }

  return {
    scrollToAnchor,
  }
}

const renderContent = ({ id, type, content, url }: ContentProp) => {
  switch (type) {
    case CONTENT_TYPE.PICTURE:
      return <img src={url} />
    case CONTENT_TYPE.TEXT:
      return <div dangerouslySetInnerHTML={{ __html: content || '' }}></div>
    case CONTENT_TYPE.VIDEO:
      return <video src={url} controls height={300} width={750} />
    default:
      return <p>{content}</p>
  }
}

const renderAbbr = ({ type, id, url, content }: ContentProp) => {
  const translate = useWebIntl()
  switch (type) {
    case CONTENT_TYPE.PICTURE:
      return <img key={id} src={url} />
    case CONTENT_TYPE.TEXT:
      return (
        <div key={id} className={styles['abbr-text']}>
          {translate('web.resource.commodity.wenzineirong')}
        </div>
      )
    case CONTENT_TYPE.VIDEO:
      return (
        <div key={id} className={styles['abbr-text']}>
          {translate('web.resource.commodity.shipingneirong')}
        </div>
      )
    default:
      return <p>{content}</p>
  }
}

const ControlItem = (props) => {
  const translate = useWebIntl()
  const { id, index, type, content } = props
  const { removeContentArea, photoRef, charToggle, charRef, photoToggle, setPhotoAttr, moveContentArea, contentArea } =
    useProductDetailContext()
  const { disabled } = useProductForm()
  const { scrollToAnchor } = useScrollable()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.id })
  const style: any = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'move',
    position: 'relative',
    zIndex: isDragging ? 999 : 1,
    margin: 8,
  }

  const removeItem = (e) => {
    e.stopPropagation()
    charRef.current.initValue = ''
    removeContentArea(id)
  }

  const editItem = (e) => {
    e.stopPropagation()
    switch (type) {
      case CONTENT_TYPE.PICTURE: {
        setPhotoAttr(props)
        photoToggle(true)
        return
      }

      case CONTENT_TYPE.TEXT: {
        charRef.current.initValue = content
        charRef.current.activeId = id
        charToggle()
        return
      }

      case CONTENT_TYPE.VIDEO: {
      }
    }
  }

  const handleClickItem = () => {
    scrollToAnchor(id)
  }
  return (
    <div
      key={id}
      className={styles['item']}
      onClick={handleClickItem}
      ref={disabled ? null : setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {renderAbbr(props)}
      <Tag className={styles['dot']} color="#00A98F">
        {index + 1}
      </Tag>
      <div className={styles['tools']}>
        {props.type !== CONTENT_TYPE.VIDEO && (
          <Button type="text" className={styles['icon-btn']} icon={<EditFillIcon />} onClick={editItem}>
            {translate('web.common.edit')}
          </Button>
        )}
        <Button type="text" className={styles['icon-btn']} icon={<FileRemoveFillIcon />} onClick={removeItem}>
          {translate('web.common.delete')}
        </Button>
      </div>
    </div>
  )
}
const ProductDetail = () => {
  const translate = useWebIntl()
  const { addContentArea, contentArea, photoRef, charRef, charToggle, moveContentArea } = useProductDetailContext()
  const divRef = useRef<any>(null)
  const [uploadLoading, toggleUploadLoading] = useToggle()
  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = contentArea.findIndex((v) => v.id === active.id)
      const newIndex = contentArea.findIndex((v) => v.id === over.id)
      moveContentArea(oldIndex, newIndex)
    }
  }
  const dndProps = useDnd()

  const handleAddImage = (imageList: string[]) => {
    console.log(imageList)
    addContentArea(
      imageList.map((v) => {
        return {
          type: CONTENT_TYPE.PICTURE,
          url: v,
        }
      }),
    )
  }

  const handleAddVideo = (videoList: string[]) => {
    addContentArea(
      videoList.map((v) => {
        return {
          type: CONTENT_TYPE.VIDEO,
          url: v,
        }
      }),
    )
  }

  const openChar = () => {
    if (contentArea.filter((v) => v.type === CONTENT_TYPE.TEXT).length < 5) {
      // 这样表示新增
      charRef.current.activeId = ''
      charToggle()
    } else {
      message.error(translate('web.resource.commodity.weibenzuidazhi'))
    }
  }
  return (
    <CardWrapper id="6" title={translate('web.resource.commodity.shanpinxiangqing')}>
      <Row>
        <ProductPreviewBlock contentArea={contentArea} />
        <div
          className={cn(styles['control'], styles['container'])}
          style={{ width: 515, height: CONTAINER_HEIGHT }}
          ref={divRef}
        >
          <DndContextProvider {...dndProps} handleDragEnd={handleDragEnd} items={contentArea}>
            <div className={cn(styles['preview'])}>
              {contentArea?.map((v, index) => (
                <ControlItem {...v} key={v.id} index={index} />
              ))}
            </div>

            <div className={styles['btn-list']}>
              <Space>
                <StandardUpload
                  showUploadList={false}
                  onChange={handleAddImage}
                  multiple
                  maxCount={10}
                  accept=".png,.jpg,.jpeg,.svg,.webp,.gif"
                >
                  <Button>{translate('web.resource.commodity.tianjiatupian')}</Button>
                </StandardUpload>
                <Button onClick={openChar}>{translate('web.resource.commodity.tianjiawenzi')}</Button>
                <StandardUpload
                  fileType={StandardUpload.UploadFileType.VIDEO}
                  showUploadList={false}
                  onChange={handleAddVideo}
                  multiple
                  maxCount={100}
                  loading={uploadLoading}
                  toggleLoading={toggleUploadLoading}
                >
                  <Button loading={uploadLoading}>{translate('web.resource.commodity.tianjiashiping')}</Button>
                </StandardUpload>
              </Space>
            </div>
          </DndContextProvider>
        </div>
      </Row>
      <EditPhotoModal ref={photoRef} />
      <EditCharModal />
    </CardWrapper>
  )
}

export default () => (
  <FormItemWrapper name="commodityRemarkList" initialValue={[]} noStyle>
    <ProductDetailProvider>
      <ProductDetail />
    </ProductDetailProvider>
  </FormItemWrapper>
)
