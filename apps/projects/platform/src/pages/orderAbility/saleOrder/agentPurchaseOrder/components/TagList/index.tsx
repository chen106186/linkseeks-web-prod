import React from 'react'
import cx from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.less'

interface TagListPorps {
  tagList: string[]
}

interface TagItemProps {
  tag?: string
  isCoupon?: boolean
  className?: string
  style?: React.CSSProperties
}

const TagItem = (props: TagItemProps) => {
  const { tag, style, className, isCoupon = false } = props
  const intl = useIntl()

  const tagText = isCoupon ? intl.formatMessage({ id: 'mall.text.coupon', defaultMessage: '优惠券' }) : tag

  return (
    <div title={tagText} className={cx(styles.activity_tag_list_item, className)} style={style}>
      {tagText}
    </div>
  )
}

const TagList: React.FC<TagListPorps> & { Item: typeof TagItem } = (props) => {
  const { tagList = [] } = props

  return (
    <div className={styles.activity_tag_list}>
      {tagList && tagList.map((tag, index) => <TagItem tag={tag} key={`tag_item_${index}`} />)}
    </div>
  )
}

TagList.Item = TagItem

export default TagList
