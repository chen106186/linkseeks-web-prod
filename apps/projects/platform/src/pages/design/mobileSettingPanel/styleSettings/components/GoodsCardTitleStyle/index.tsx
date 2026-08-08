import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import { changeProps } from '@apps/design-core'
import styles from './styles.less'

interface DataItemType {
  id: number
  title: string
  style: number
  viceTitle: string
  productIdList: number[]
  productList?: any[]
  expand: boolean
}

interface GoodsCardTitleStylePropsType {
  dataList: DataItemType[]
}

const STYLE_THEME_LIST = [
  {
    id: 0,
    styleName: 'one',
  },
  {
    id: 1,
    styleName: 'two',
  },
  {
    id: 2,
    styleName: 'three',
  },
  {
    id: 3,
    styleName: 'four',
  },
  {
    id: 4,
    styleName: 'five',
  },
  {
    id: 5,
    styleName: 'six',
  },
  {
    id: 6,
    styleName: 'seven',
  },
]

const GoodsCardTitleStyle: React.FC<GoodsCardTitleStylePropsType> = (props) => {
  const { dataList } = props
  const [currentItem, setCurrentItem] = useState<DataItemType | null>(null)
  const intl = useIntl()

  const updateCurrentItem = (list: DataItemType[]) => {
    const expandList = list.filter((item) => item.expand)
    if (expandList.length > 0) {
      setCurrentItem(expandList[0])
    } else {
      setCurrentItem(null)
    }
  }

  useEffect(() => {
    console.log(dataList, 'dataList')
    updateCurrentItem(dataList)
  }, [dataList])

  const handleSelectStyle = (id: number) => {
    const newList = [...dataList]
    for (const item of newList) {
      if (item.id === currentItem.id) {
        item.style = id
      }
    }
    changeProps({
      props: Object.assign({ ...props }, { dataList: newList }),
    })
  }

  return currentItem ? (
    <div className={styles.goods_card_title_style}>
      <div className={styles.style_list}>
        {STYLE_THEME_LIST.map((item) => (
          <div
            className={cx(styles.style_list_item, item.id === currentItem?.style ? styles.active : null)}
            key={`style_list_item_${item.id}`}
            onClick={() => handleSelectStyle(item.id)}
          >
            <div className={cx(styles.card_style, styles[item.styleName])}>
              <div className={styles['card_style_left']}>
                <div className={styles['card_style_left_title']}>
                  {intl.formatMessage({ id: 'editor.setting.form.title' })}
                </div>
                <label className={styles['card_style_left_vicetitle']}>
                  {intl.formatMessage({ id: 'editor.setting.form.viceTitle' })}
                </label>
              </div>
              <div className={styles['card_style_more']}>
                <span>{intl.formatMessage({ id: 'common.text.more' })} &gt;</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null
}

export default GoodsCardTitleStyle
