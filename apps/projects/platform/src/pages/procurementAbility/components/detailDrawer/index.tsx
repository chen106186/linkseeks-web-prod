import React, { useEffect, useState } from 'react'
import { Drawer, Anchor, Row, Col, Divider, Typography } from 'antd'
import style from './index.less'
import { LinkOutlined } from '@ant-design/icons'
import cx from 'classnames'
import { getIntl } from '@linkseeks/i18n'
import { downloadFileByNameAndUrl } from '@apps/utils'

const { Link } = Anchor

interface IProps {
  dataSource: any
  visible: boolean
  title?: string
  onOk?: () => void
  onCalcel?: () => void
}

const intl = getIntl()

const DetailDrawer: React.FC<IProps> = (props: any) => {
  const { dataSource, visible, title, onOk, onCalcel } = props
  const [isSeleted, setIsSeleted] = useState<number>(1)
  const [menu] = useState([
    { id: 1, label: intl.formatMessage({ id: 'detail.purchase.basicLayout' }) },
    { id: 2, label: intl.formatMessage({ id: 'detail.purchase.purchaseCount' }) },
    { id: 3, label: intl.formatMessage({ id: 'detail.purchase.file' }) },
  ])

  const handleClick = (id, anchorName) => {
    setIsSeleted(id)
    if (anchorName) {
      let anchorElement = document.getElementById(anchorName)
      if (anchorElement) {
        anchorElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  useEffect(() => {
    setIsSeleted(1)
  }, [visible])

  return (
    <Drawer
      title={title}
      placement="right"
      visible={visible}
      onClose={onCalcel}
      width="40%"
      className={style.drawerBox}
    >
      <div className={style.container}>
        <div className={style.menu}>
          {menu.map((item) => (
            <div
              key={item.id}
              className={cx(style.menuItem, isSeleted === item.id && style.active)}
              onClick={() => handleClick(item.id, `menu${item.id}`)}
            >
              {item.label}
            </div>
          ))}
        </div>
        <div className={style.content}>
          {dataSource.map((item, index) => (
            <div key={`link${index + 1}`} id={`menu${index + 1}`}>
              <div className={style.anchor}>{item.linkTitle}</div>
              <div className={style.formItem}>
                {item.linkContent.map((items, keys) => (
                  <div key={`content${keys + 1}`} className={style.list}>
                    <div className={style.listLable} style={{ flex: '0 0 100px' }}>
                      {items.label}：
                    </div>
                    {!items.file && <div className={style.listContent}>{items.content}</div>}
                    {items.file && (
                      <div className={style.upload_data}>
                        {items.content.length > 0 &&
                          items.content.map((v, index) => (
                            <div key={index} className={style.upload_item}>
                              <div className={style.upload_left}>
                                <Typography.Link
                                  key={`link_${index + 1}`}
                                  onClick={() => downloadFileByNameAndUrl(v.url, v.name)}
                                >
                                  <LinkOutlined style={{ marginRight: '5px' }} />
                                  {v.name}
                                </Typography.Link>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  )
}
export default DetailDrawer
