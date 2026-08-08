import { useWebIntl } from '@apps/locales'
import styles from './index.less'
import { CONTENT_TYPE, ContentProp } from '../../productCtl/blocks/productDetail/context'

const CONTAINER_HEIGHT = 600

export const renderContent = ({ id, type, content, url }: ContentProp) => {
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
/**
 * 商品详情展示区域
 */
const ProductPreviewBlock = (props: any) => {
  const translate = useWebIntl()
  const { contentArea } = props
  return (
    <div
      className={styles['container']}
      style={{ display: 'flex', justifyContent: 'center', flex: 1, height: CONTAINER_HEIGHT, overflowY: 'auto' }}
    >
      {contentArea.length > 0 ? (
        <div style={{ width: 750 }}>
          {contentArea.map((v) => (
            <div id={v.id} key={v.id}>
              {renderContent(v)}
            </div>
          ))}
        </div>
      ) : (
        <p className={styles['detail']} style={{ marginTop: CONTAINER_HEIGHT / 3 }}>
          {translate('web.resource.commodity.shanpinxiangqingyulang')}
        </p>
      )}
    </div>
  )
}

export default ProductPreviewBlock
