import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import { Typography, Image } from 'antd'
import style from './index.less'
import { CaretUpOutlined } from '@ant-design/icons'

interface ProductListLayoutProps {
  /** 标题 */
  title?: string
  /** 列表数据 */
  dataSource?: any[]
}

const ProductListLayout: React.FC<ProductListLayoutProps> = (props: any) => {
  const intl = useIntl()
  const { title, dataSource } = props
  const data = [
    {
      sort: 1,
      name: intl.formatMessage({ id: 'marketingAbility.jinkoutoucenghuangniupi' }),
      tag: `${intl.formatMessage({ id: 'marketingAbility.manliangcuxiao' })}`,
      img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      number: '300',
      percentum: '25',
    },
    {
      sort: 2,
      name: intl.formatMessage({ id: 'marketingAbility.jinkoutoucenghuangniupi' }),
      tag: `${intl.formatMessage({ id: 'marketingAbility.manliangcuxiao' })}`,
      img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      number: '300',
      percentum: '25',
    },
    {
      sort: 3,
      name: intl.formatMessage({ id: 'marketingAbility.jinkoutoucenghuangniupi' }),
      tag: `${intl.formatMessage({ id: 'marketingAbility.manliangcuxiao' })}`,
      img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      number: '300',
      percentum: '25',
    },
    {
      sort: 4,
      name: intl.formatMessage({ id: 'marketingAbility.jinkoutoucenghuangniupi' }),
      tag: `${intl.formatMessage({ id: 'marketingAbility.manliangcuxiao' })}`,
      img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      number: '300',
      percentum: '25',
    },
    {
      sort: 5,
      name: intl.formatMessage({ id: 'marketingAbility.jinkoutoucenghuangniupi' }),
      tag: `${intl.formatMessage({ id: 'marketingAbility.manliangcuxiao' })}`,
      img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      number: '300',
      percentum: '25',
    },
    {
      sort: 6,
      name: intl.formatMessage({ id: 'marketingAbility.jinkoutoucenghuangniupi' }),
      tag: `${intl.formatMessage({ id: 'marketingAbility.manliangcuxiao' })}`,
      img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      number: '300',
      percentum: '25',
    },
    {
      sort: 7,
      name: intl.formatMessage({ id: 'marketingAbility.jinkoutoucenghuangniupi' }),
      tag: `${intl.formatMessage({ id: 'marketingAbility.manliangcuxiao' })}`,
      img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      number: '300',
      percentum: '25',
    },
    {
      sort: 8,
      name: intl.formatMessage({ id: 'marketingAbility.jinkoutoucenghuangniupi' }),
      tag: `${intl.formatMessage({ id: 'marketingAbility.manliangcuxiao' })}`,
      img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      number: '300',
      percentum: '25',
    },
    {
      sort: 9,
      name: intl.formatMessage({ id: 'marketingAbility.jinkoutoucenghuangniupi' }),
      tag: `${intl.formatMessage({ id: 'marketingAbility.manliangcuxiao' })}`,
      img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      number: '300',
      percentum: '25',
    },
    {
      sort: 10,
      name: intl.formatMessage({ id: 'marketingAbility.jinkoutoucenghuangniupi' }),
      tag: `${intl.formatMessage({ id: 'marketingAbility.manliangcuxiao' })}`,
      img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      number: '300',
      percentum: '25',
    },
  ]
  return (
    <div className={style.card}>
      <div className={style.card_title}>
        {intl.formatMessage({ id: 'marketingAbility.jinrihuodongshangpingoumaipaiming' })}
      </div>
      <div className={style.card_list}>
        {data.map((item) => (
          <div className={style.card_list_item} key={item.sort}>
            <div className={style.card_list_item_sort}>
              <div className={style.card_list_item_sort_number}>{item.sort}</div>
            </div>
            <div className={style.card_list_item_img}>
              <Image width={48} height={48} src={item.img} />
            </div>
            <div className={style.card_list_item_info}>
              <Typography.Paragraph ellipsis={{ rows: 1, expandable: false }}>{item.name}</Typography.Paragraph>
              <div>
                <Typography.Text type="secondary">
                  {item.number}
                  {intl.formatMessage({ id: 'marketingAbility.jianxiangbizuori' })}
                </Typography.Text>
                <Typography.Text type="danger">
                  <CaretUpOutlined className={style.info_icon_style} />
                  {item.percentum}%
                </Typography.Text>
              </div>
            </div>
            <div className={style.card_list_item_tag}>{item.tag}</div>
          </div>
        ))}
        <Typography.Text className={style.card_list_wran} type="secondary">
          {intl.formatMessage({ id: 'marketingAbility.zhizhanshiqian10ming' })}
        </Typography.Text>
      </div>
    </div>
  )
}
export default ProductListLayout
