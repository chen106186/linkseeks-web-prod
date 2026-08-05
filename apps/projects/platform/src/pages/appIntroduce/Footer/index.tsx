import React from 'react'
import { getIntl } from '@linkseeks/i18n'
import './index.less'
import { useWebIntl } from '@apps/locales'
const intl = getIntl()
const Footer: React.FC = () => {
  const translate = useWebIntl()
  const baseUrl = 'https://www.yuque.com/xsnnko/kh076h'
  const footerNavList = [
    {
      title: intl.formatMessage({ id: 'components.huiyuanfuwu' }),
      children: [
        {
          path: `${baseUrl}/bzci9x`,
          title: intl.formatMessage({ id: 'components.huiyuanzhuce' }),
        },
        {
          path: `${baseUrl}/pz44gw`,
          title: intl.formatMessage({ id: 'components.huiyuandenglu' }),
        },
        {
          path: `${baseUrl}/ia27ef`,
          title: intl.formatMessage({ id: 'components.huiyuanfuwu' }),
        },
        {
          path: `${baseUrl}/xupg3d`,
          title: intl.formatMessage({ id: 'components.wangjimima' }),
        },
      ],
    },
    {
      title: intl.formatMessage({ id: 'components.caigougongying' }),
      children: [
        {
          path: `${baseUrl}/il6eqw`,
          title: intl.formatMessage({ id: 'components.fabugongying' }),
        },
        {
          path: `${baseUrl}/aeob5u`,
          title: intl.formatMessage({ id: 'components.fabuxuqiu' }),
        },
        {
          path: `${baseUrl}/eh909i`,
          title: intl.formatMessage({ id: 'components.goumaixianhuo' }),
        },
        {
          path: `${baseUrl}/yks6bd`,
          title: intl.formatMessage({ id: 'components.xunjiabaojia' }),
        },
      ],
    },
    {
      title: intl.formatMessage({ id: 'components.zhanghuanquan' }),
      children: [
        {
          path: `${baseUrl}/gxx84r`,
          title: intl.formatMessage({ id: 'components.zhanghuchaxun' }),
        },
        {
          path: `${baseUrl}/bufen8`,
          title: intl.formatMessage({ id: 'components.zhanghuguanli' }),
        },
        {
          path: `${baseUrl}/qsmohg`,
          title: intl.formatMessage({ id: 'components.anquanzhongxin' }),
        },
        {
          path: `${baseUrl}/arsh01`,
          title: intl.formatMessage({ id: 'components.mimafuwu' }),
        },
      ],
    },
    {
      title: intl.formatMessage({ id: 'components.xinyongpingjia' }),
      children: [
        {
          path: `${baseUrl}/klpeox`,
          title: intl.formatMessage({ id: 'components.fabupingjia' }),
        },
        {
          path: `${baseUrl}/tkp309`,
          title: intl.formatMessage({ id: 'components.zhakanpingjia' }),
        },
        {
          path: `${baseUrl}/svdz9o`,
          title: intl.formatMessage({ id: 'components.tousujubao' }),
        },
        {
          path: `${baseUrl}/ngkh0k`,
          title: intl.formatMessage({ id: 'components.pingjiaguize' }),
        },
      ],
    },
    {
      title: intl.formatMessage({ id: 'components.guanyuwomen' }),
      children: [
        {
          path: `${baseUrl}/eoegc4`,
          title: intl.formatMessage({ id: 'components.pingtaijieshao' }),
        },
        {
          path: `${baseUrl}/yttpx7`,
          title: intl.formatMessage({ id: 'components.lianxiwomen' }),
        },
        {
          path: `${baseUrl}/cyd7rb`,
          title: intl.formatMessage({ id: 'components.fuwutiaokuan' }),
        },
        {
          path: `${baseUrl}/uht4qm`,
          title: intl.formatMessage({ id: 'components.mianzhaishengming' }),
        },
      ],
    },
  ]
  return (
    <div className="footer">
      <div className="footer_container">
        {footerNavList.map((item, index) => (
          <ul className="footer_nav_item" key={`footer_nav_item_${index}`}>
            <li className="title">{item.title}</li>
            {item.children.map((item, index) => (
              <li key={`footer_nav_item_${index}`}>
                <a href={item.path} target="_blank" rel="noreferrer">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        ))}
      </div>
      <div className="copyright">{translate('web.common.copyright')}</div>
    </div>
  )
}

export default Footer
