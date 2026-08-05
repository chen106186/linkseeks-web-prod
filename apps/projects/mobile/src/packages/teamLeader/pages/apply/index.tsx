import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { View, Text, Image } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import Header from '@/components/NavBar'
import styles from './index.module.scss'
import cx from 'classnames'
import { pxTransform, useDidShow, showLoading, hideLoading } from '@apps/mobile-services/utils/taro'
import { getMarketingMobileCbgTeamLeaderGetTeamLeaderInfo } from '@apps/apis'
const infoIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/teamleader-apply-house.png'
import Router from '@/utils/router'

interface Info {
  id: number
  name: string
  phone: string
  idPhoto: string
  idPhotoBack: string
  homeProvince: string
  homeProvinceCode: string
  homeCity: string
  homeCityCode: string
  homeArea: string
  homeAreaCode: string
  homeStreet: string
  homeStreetCode: string
  homeAddress: string
  pickupPointName: string
  countryCode: string
  pickupPointProvince: string
  pickupPointProvinceCode: string
  pickupPointCity: string
  pickupPointCityCode: string
  pickupPointArea: string
  pickupPointAreaCode: string
  pickupPointStreet: string
  pickupPointStreetCode: string
  pickupPointAddress: string
  status: number
  rejectionReason: string
}
const TeamLeaderApply: React.FC<{}> = () => {
  const intl = useIntl()
  // 申请状态: 0：未申请，1：待审核，2：审核通过，3：审核不通过，4：已禁用
  const [applyStatus, setApplyStatus] = useState(0)
  // 团长信息
  const [teamLeaderInfo, setTeamLeaderInfo] = useState<Partial<Info>>({})

  // useEffect(() => {
  //   getTeamLeaderInfo()
  // }, [])

  useDidShow(() => {
    getTeamLeaderInfo()
  })

  // 获取团长信息
  const getTeamLeaderInfo = () => {
    showLoading({
      title: intl.formatMessage({ id: 'teamLeader.jiazaizhong', defaultMessage: '加载中' }),
      mask: true,
    })
    getMarketingMobileCbgTeamLeaderGetTeamLeaderInfo()
      .then((res) => {
        const data = res.data
        if (!data || (Array.isArray(data) && data.length === 0)) {
          setApplyStatus(0)
        } else {
          setApplyStatus(data.status ? data.status : 0)
          setTeamLeaderInfo(data)
        }
      })
      .finally(() => {
        hideLoading()
      })
  }

  const handleBack = () => {
    Router.reLaunch('extra/mine', {
      hasTab: 'true',
    })
  }

  const handleApplyClick = () => {
    // 审核中
    if (applyStatus === 1) return
    // 审核通过
    if (applyStatus === 2) {
      Router.navigateTo('teamLeader/mine')
      return
    }
    // 填写信息页
    const path = 'teamLeader/applicationForm'
    if (applyStatus === 0) {
      Router.navigateTo(path)
    } else if (applyStatus === 3) {
      Router.navigateTo(path, { teamLeaderInfo: JSON.stringify(teamLeaderInfo) })
    }
  }

  const tagStyle = {
    video: 'width: 100%;',
  }

  const htmlDetails = `<p style="margin-bottom: 11px; font-family: 等线; font-size: 15px; line-height: normal;" class="" data-tools-id="61408">
    <br/>
</p>
<p style="margin-bottom: 11px; font-family: 等线; font-size: 15px; line-height: normal;" class="" data-tools-id="61408">
    <strong>您需要拥有以下资质：</strong>
</p>
<p style="margin-bottom: 11px; font-family: 等线; font-size: 15px; line-height: normal;">
    <span style="font-size: 15px">1. 年满18周岁，</span><span style="font-size: 15px">持有中国大陆居民身份证及同名银行卡；</span>
</p>
<p style="margin-bottom: 11px; font-family: 等线; font-size: 15px; line-height: normal;">
    <span style="font-size: 15px">2.</span><span style="font-family: &#39;Segoe UI&#39;;color: rgb(64, 64, 64);font-size: 16px">&nbsp;</span><span style="font-size: 15px">能力要求（满足任一即可）：</span>
</p>
<p style="margin-bottom: 11px; font-family: 等线; font-size: 15px; line-height: normal;">
    <span style="font-size: 15px">社群运营经验</span><span style="font-size: 15px">：</span><span style="font-size: 15px"><span style="font-family:等线">拥有</span><span style="font-family:等线">≥1个200人以上的活跃微信群（</span></span><span style="font-size: 15px">提交截图证明）</span>
</p>
<p style="margin-bottom: 11px; font-family: 等线; font-size: 15px; line-height: normal;" class="" data-tools-id="96321">
    <span style="font-size: 15px">线下实体资源</span><span style="font-size: 15px">：</span><span style="font-size: 15px"><span style="font-family:等线">便利店</span>/快递驿站/等可作自提点</span><span style="font-size: 15px">（提供营业执照以及地理定位截图）</span>
</p>
<p style="margin-bottom: 11px; font-family: 等线; font-size: 15px; line-height: normal;" class="" data-tools-id="28271">
    <span style="font-size: 15px">社区影响力</span><span style="font-size: 15px">：</span><span style="font-size: 15px">居委会成员或社区团购从业者</span><span style="font-size: 15px">（</span><span style="font-size: 15px"><span style="font-family:等线">工作证</span>/历史订单记录证明</span><span style="font-size: 15px">）</span>
</p>
<p style="margin-bottom: 11px; font-family: 等线; font-size: 15px; line-height: normal;" class="" data-tools-id="45523">
    <span style="font-size: 15px">提交审核后我们会尽快审理哦。</span>
</p>
<p style="margin-bottom: 11px; font-family: 等线; font-size: 15px; line-height: normal;">
    <strong>您可以获得：</strong><strong></strong>
</p>
<p style="margin-bottom: 11px; font-family: 等线; font-size: 15px; line-height: normal;">
    <span style="font-size: 15px">1.丰厚的佣金：获得订单实际价格比例的佣金</span>
</p>
<p style="margin-bottom: 11px; font-family: 等线; font-size: 15px; line-height: normal;">
    <span style="font-size: 15px">2.优质的培训：云链认养鲜为您提供专业的社区团购经验分享</span>
</p>
<p class="" data-tools-id="22431">
    <br/>
</p>`

  return (
    <View className={styles['apply']}>
      <View className={styles['header']}>
        <View className={styles['header-top']}>
          <Header
            back={handleBack}
            backIconColor="#FFF"
            titleColor="#FFF"
            customStyle="background: transparent"
            title={
              <Text style={{ fontSize: pxTransform(16), textAlign: 'center' }}>
                {intl.formatMessage({
                  id: 'teamLeader.shenqingchengweituanzhang',
                  defaultMessage: '申请成为团长',
                })}
              </Text>
            }
          />
        </View>
        <View className={styles['header-bottom']}></View>
      </View>
      <View className={styles['apply-box']}>
        {applyStatus !== 0 && (
          <View className={styles['apply-box-info']}>
            <Image className={styles['apply-box-info-icon']} src={infoIcon} />
            <Text className={styles['apply-box-info-text']}>{teamLeaderInfo?.name}</Text>
          </View>
        )}
        <View className={styles['apply-box-join']}>
          <Text className={styles['apply-box-join-text']}>
            {applyStatus === 0
              ? intl.formatMessage({ id: 'teamLeader.ninhaibushituanzhang', defaultMessage: '您还不是团长' })
              : applyStatus === 1
              ? intl.formatMessage({ id: 'teamLeader.tuanzhangshenhezhong', defaultMessage: '您的团长申请正在审核中' })
              : applyStatus === 2
              ? intl.formatMessage({ id: 'teamLeader.shenhetongguo', defaultMessage: '审核通过' })
              : applyStatus === 3
              ? intl.formatMessage({
                  id: 'teamLeader.tuanzhangshenhebutongguo',
                  defaultMessage: '您的团长申请审核不通过',
                })
              : ''}
          </Text>
          <Text className={styles['apply-box-join-text']}>
            {applyStatus === 0
              ? intl.formatMessage({ id: 'teamLeader.shenqingjiaruwomen', defaultMessage: '申请加入我们吧' })
              : applyStatus === 1
              ? intl.formatMessage({ id: 'teamLeader.qingnaixindengdai', defaultMessage: '请耐心等待' })
              : applyStatus === 2
              ? ''
              : applyStatus === 3
              ? intl.formatMessage({ id: 'teamLeader.qingchongxintijiao', defaultMessage: '请重新提交' })
              : ''}
          </Text>
          <View
            className={cx(styles['apply-box-join-add'], `${applyStatus === 1 ? styles['join-add-opacity'] : ''}`)}
            onClick={handleApplyClick}
          >
            {applyStatus === 0
              ? intl.formatMessage({ id: 'teamLeader.shenqingchengweituanzhang', defaultMessage: '申请成为团长' })
              : applyStatus === 1
              ? intl.formatMessage({ id: 'teamLeader.shenhezhong', defaultMessage: '审核中' })
              : applyStatus === 2
              ? intl.formatMessage({ id: 'teamLeader.jinrutuanzhangzhongxin', defaultMessage: '进入团长中心' })
              : applyStatus === 3
              ? intl.formatMessage({ id: 'teamLeader.xiugaixinxi', defaultMessage: '修改信息' })
              : ''}
          </View>
          {applyStatus === 3 && (
            <Text className={styles['apply-box-join-tips']}>
              {intl.formatMessage({
                id: 'teamLeader.bohuiyuanyin',
                defaultMessage: '驳回原因：',
              })}
              {teamLeaderInfo?.rejectionReason}
            </Text>
          )}
        </View>
      </View>
      <View className={styles['apply-rule']}>
        <View className={styles['apply-rule-top']}>
          <View className={styles['apply-rule-top-line']}></View>
          <Text className={styles['apply-rule-top-title']}>
            {intl.formatMessage({
              id: 'teamLeader.shenqingtuanzhangguizeshuoming',
              defaultMessage: '申请团长规则说明',
            })}
          </Text>
        </View>
        <View
          className={cx(
            styles['apply-rule-content'],
            `${applyStatus !== 0 ? styles['apply-rule-content-height2'] : styles['apply-rule-content-height1']}`,
          )}
        >
          <parser html={htmlDetails} tag-style={tagStyle} />
        </View>
      </View>
    </View>
  )
}

export default GlobalWrapper(observer(TeamLeaderApply))
