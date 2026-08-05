import React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from '@linkseeks/i18n'
import TabBottom from '@/components/TabBottom/'
import { getOssUrlPath } from '@apps/constants'

const newhomeSelectIcon = getOssUrlPath('/miniprogram/assets/images/default/newhomeSelectIcon.png')
const newhomeDefaultIcon = getOssUrlPath('/miniprogram/assets/images/default/newhomeDefaultIcon.png')
const newClassifySelectIcon = getOssUrlPath('/miniprogram/assets/images/default/newClassifySelectIcon.png')
const newClassifyDefaultIcon = getOssUrlPath('/miniprogram/assets/images/default/newClassifyDefaultIcon.png')
const newRecommendSelectIcon = getOssUrlPath('/miniprogram/assets/images/default/newRecommendSelectIcon.png')
const newRecommendDefaultIcon = getOssUrlPath('/miniprogram/assets/images/default/newRecommendDefaultIcon.png')
const newmineSelectIcon = getOssUrlPath('/miniprogram/assets/images/default/newmineSelectIcon.png')
const newmineDefaultIcon = getOssUrlPath('/miniprogram/assets/images/default/newmineDefaultIcon.png')

const News = (props) => {
  const intl = useIntl()
  const tabList = [
    {
      url: 'companyNews/newsHome',
      name: intl.formatMessage({ id: 'companyNews.component.shouye', defaultMessage: '首页' }),
      pic: newhomeDefaultIcon,
      lightPic: newhomeSelectIcon,
    },
    // {
    //   url: 'companyNews/newsClassify',
    //   name: intl.formatMessage({ id: 'companyNews.component.fenlei', defaultMessage: '分类' }),
    //   pic: newClassifyDefaultIcon,
    //   lightPic: newClassifySelectIcon,
    // },
    {
      url: 'companyNews/newsRecommend',
      name: intl.formatMessage({ id: 'companyNews.component.tuijian', defaultMessage: '推荐' }),
      pic: newRecommendDefaultIcon,
      lightPic: newRecommendSelectIcon,
    },
    {
      url: 'companyNews/newsMy',
      name: intl.formatMessage({ id: 'companyNews.component.wode', defaultMessage: '我的' }),
      pic: newmineDefaultIcon,
      lightPic: newmineSelectIcon,
    },
  ]
  return (
    <TabBottom tabList={tabList} activeUrl={`companyNews/${props.mySel}`}>
      {props.children}
    </TabBottom>
  )
}
export default observer(News)
