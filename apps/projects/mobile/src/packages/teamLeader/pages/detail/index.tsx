import React, { useEffect, useState } from 'react'
import GlobalWrapper from '@/components/GlobalWrapper'
import { useIntl } from '@linkseeks/i18n'
import { View, ScrollView, Image, Text, Form } from '@apps/mobile-ui'
import styles from './index.module.scss'
import { pxTransform, useRouter } from '@apps/mobile-services/utils/taro'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import Router from '@/utils/router'
import cx from 'classnames'
import { THEME_COLORS } from '@/constants/theme'

// 人像面背景图
const frontCardImg = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/front-card.png'
// 国徽面背景图
const reverseCardImg = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/reverse-card.png'

const TeamLeaderDetail: React.FC<{}> = () => {
  const intl = useIntl()
  const { params } = useRouter()
  const [formItems, setFormItems] = useState({
    name: '',
    phone: '',
    homeProvince: '',
    homeProvinceCode: '',
    homeCity: '',
    homeCityCode: '',
    homeArea: '',
    homeAreaCode: '',
    homeStreet: '',
    homeStreetCode: '',
    homeAddress: '',
    pickupPointName: '',
    pickupPointProvince: '',
    pickupPointProvinceCode: '',
    pickupPointCity: '',
    pickupPointCityCode: '',
    pickupPointArea: '',
    pickupPointAreaCode: '',
    pickupPointStreet: '',
    pickupPointStreetCode: '',
    pickupPointAddress: '',
    code: '',
    idPhoto: '',
    idPhotoBack: '',
  })

  useEffect(() => {
    if (params.teamLeaderInfo) {
      // 重新修改信息提交申请的，获取路由中的团长信息
      const decoded = decodeURIComponent(params.teamLeaderInfo)
      const info = JSON.parse(decoded)
      // 赋值回显团长信息
      setFormItems((prev) => ({
        ...prev,
        ...info,
      }))
    }
  }, [])

  const editTeamLeader = () => {
    Router.navigateTo('teamLeader/applicationForm', { fromType: 'edit' })
  }

  return (
    <ScrollView scrollY className={styles['application']}>
      <View>
        <View style={{ padding: pxTransform(8), background: THEME_COLORS.surface, textAlign: 'right' }}>
          <Text onClick={() => editTeamLeader()}>编辑</Text>
        </View>

        <Form className={styles['application-form']}>
          {/* 团长信息 */}
          <View className={styles['application-info']}>
            <View className={styles['application-info-top']}>
              <View className={styles['application-info-top-line']} />
              <Text className={styles['application-info-top-title']}>
                {intl.formatMessage({ id: 'teamLeader.tuanzhangxinxi', defaultMessage: '团长信息' })}
              </Text>
            </View>

            <View className={styles['application-info-item']}>
              {/* 团长姓名 */}
              <View className={styles['form-item']}>
                <Text className={styles['form-item-label']}>
                  {intl.formatMessage({ id: 'teamLeader.tuanzhangxingming', defaultMessage: '团长姓名' })}
                  <Text className={styles['form-item-star']}>*</Text>
                </Text>
                <View>
                  <View className={styles['form-item-input']}>
                    <Text
                      style={{ display: 'block', whiteSpace: 'nowrap', overflowX: 'auto' }}
                      className={styles['form-item-text']}
                    >
                      {formItems.name}
                    </Text>
                  </View>
                </View>
              </View>

              {/* 团长手机 */}
              <View className={styles['form-item']}>
                <Text className={styles['form-item-label']}>
                  {intl.formatMessage({ id: 'teamLeader.tuanzhangshouji', defaultMessage: '团长手机' })}
                  <Text className={styles['form-item-star']}>*</Text>
                </Text>
                <View>
                  <View className={styles['form-item-input']}>
                    <Text
                      style={{ display: 'block', whiteSpace: 'nowrap', overflowX: 'auto' }}
                      className={styles['form-item-text']}
                    >
                      {formItems.phone}
                    </Text>
                  </View>
                </View>
              </View>

              {/* 地址 */}
              <View className={styles['form-item']}>
                <Text className={styles['form-item-label']}>
                  {intl.formatMessage({ id: 'teamLeader.jiatingzhuzhi', defaultMessage: '家庭住址' })}
                  <Text className={styles['form-item-star']}>*</Text>
                </Text>
                <View>
                  <View className={styles['form-item-input']}>
                    <Text
                      style={{ display: 'block', whiteSpace: 'nowrap', overflowX: 'auto' }}
                      className={styles['form-item-text']}
                    >
                      {formItems.homeProvince + formItems.homeCity + formItems.homeArea + formItems.homeStreet}
                    </Text>
                  </View>
                </View>
              </View>

              {/* 详细地址 */}
              <View className={styles['form-item']}>
                <Text className={styles['form-item-label']}>
                  {intl.formatMessage({ id: 'teamLeader.jiatingxiangxidizhi', defaultMessage: '家庭详细地址' })}
                  <Text className={styles['form-item-star']}>*</Text>
                </Text>
                <View>
                  <View className={styles['form-item-input']}>
                    <Text
                      style={{ display: 'block', whiteSpace: 'nowrap', overflowX: 'auto' }}
                      className={styles['form-item-text']}
                    >
                      {formItems.homeAddress}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* 上传身份证照片 */}
          <View className={styles['application-info']}>
            <View className={styles['application-info-top']}>
              <View className={styles['application-info-top-line']} />
              <Text className={styles['application-info-top-title']}>
                {intl.formatMessage({ id: 'teamLeader.shangchuanshenfenzheng', defaultMessage: '上传身份证照片' })}
              </Text>
            </View>

            <View className={styles['application-info-certificate']}>
              <View className={styles['realChange']}>
                <View className={styles['realChange-cardFile']}>
                  <View className={styles['realChange-fileLayout']}>
                    <View className={styles['realChange-imageBox']}>
                      <Image className={styles['realChange-image']} src={formItems.idPhoto || frontCardImg} />
                    </View>
                  </View>
                  <View className={styles['realChange-fileText']}>
                    {intl.formatMessage({ id: 'teamLeader.renxiangmian', defaultMessage: '人像面' })}
                  </View>
                </View>
                <View className={styles['realChange-cardFile']}>
                  <View className={styles['realChange-fileLayout']}>
                    <View className={styles['realChange-imageBox']}>
                      <Image className={styles['realChange-image']} src={formItems.idPhotoBack || reverseCardImg} />
                    </View>
                  </View>
                  <View className={styles['realChange-fileText']}>
                    {intl.formatMessage({ id: 'teamLeader.renxiangmian', defaultMessage: '国徽面' })}
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* 自提点信息 */}
          <View className={styles['application-info']}>
            <View className={styles['application-info-top']}>
              <View className={styles['application-info-top-line']} />
              <Text className={styles['application-info-top-title']}>
                {intl.formatMessage({ id: 'teamLeader.zitidianxinxi', defaultMessage: '自提点信息' })}
              </Text>
            </View>

            <View className={styles['application-info-item']}>
              {/* 自提点名称 */}
              <View className={styles['form-item']}>
                <Text className={styles['form-item-label']}>
                  {intl.formatMessage({ id: 'teamLeader.zitidianmingcheng', defaultMessage: '自提点名称' })}
                  <Text className={styles['form-item-star']}>*</Text>
                </Text>
                <View>
                  <View className={styles['form-item-input']}>
                    <Text
                      style={{ display: 'block', whiteSpace: 'nowrap', overflowX: 'auto' }}
                      className={styles['form-item-text']}
                    >
                      {formItems.pickupPointName}
                    </Text>
                  </View>
                </View>
              </View>

              {/* 自提点区域 */}
              <View className={styles['form-item']}>
                <Text className={styles['form-item-label']}>
                  {intl.formatMessage({ id: 'teamLeader.zitidiandizhi', defaultMessage: '自提点地址' })}
                  <Text className={styles['form-item-star']}>*</Text>
                </Text>
                <View>
                  <View className={styles['form-item-input']}>
                    <Text
                      style={{ display: 'block', whiteSpace: 'nowrap', overflowX: 'auto' }}
                      className={styles['form-item-text']}
                    >
                      {formItems.pickupPointProvince +
                        formItems.pickupPointCity +
                        formItems.pickupPointArea +
                        formItems.pickupPointStreet}
                    </Text>
                  </View>
                </View>
              </View>

              {/* 自提点详细地址 */}
              <View className={styles['form-item']}>
                <Text className={styles['form-item-label']}>
                  {intl.formatMessage({ id: 'teamLeader.zitidianxiangxidizhi', defaultMessage: '自提点详细地址' })}
                  <Text className={styles['form-item-star']}>*</Text>
                </Text>
                <View>
                  <View className={styles['form-item-input']}>
                    <Text
                      style={{ display: 'block', whiteSpace: 'nowrap', overflowX: 'auto' }}
                      className={styles['form-item-text']}
                    >
                      {formItems.pickupPointAddress}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Form>

        <FullScreenLoading />
      </View>
    </ScrollView>
  )
}

export default GlobalWrapper(TeamLeaderDetail)
