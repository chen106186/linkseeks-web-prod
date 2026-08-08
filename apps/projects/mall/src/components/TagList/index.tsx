import React from 'react'
import cx from 'classnames'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

interface TagListPorps {
  style?: React.CSSProperties
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
  const translate = getWebIntl()

  const tagText = isCoupon ? translate('web.resource.mall.coupon') : tag

  return (
    <div title={tagText} className={cx(styles['activity_tag_list_item'], className)} style={style}>
      {tagText}
    </div>
  )
}

const TagList: React.FC<TagListPorps> & { Item: typeof TagItem } = (props) => {
  const { tagList = [], style } = props

  return (
    <div className={styles['activity_tag_list']} style={style}>
      {tagList && tagList.map((tag, index) => <TagItem tag={tag} key={`tag_item_${index}`} />)}
    </div>
  )
}

TagList.Item = TagItem

export default TagList
