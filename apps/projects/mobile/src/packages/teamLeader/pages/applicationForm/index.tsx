import React, { useEffect, useMemo, useState } from 'react'
import GlobalWrapper from '@/components/GlobalWrapper'
import { useIntl } from '@linkseeks/i18n'
import { View, ScrollView, Input, Text, Form, Icons } from '@apps/mobile-ui'
import styles from './index.module.scss'
import { COUNTRY_PHONE_CODE, COUNTRY_PHONE_LENGTH } from '@/constants'
import { USER_INFO } from '@/constants/storage'
import { pxTransform, getStorageSync, showToast, useRouter } from '@apps/mobile-services/utils/taro'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import { useTelCode } from '@apps/services'
import { useMobileIntl } from '@apps/locales'
import IDCardUploader from './components/iDCardUploader'
import Router from '@/utils/router'
import {
  postMarketingMobileCbgTeamLeaderApply,
  postMarketingMobileCbgTeamLeaderSendApplySmsCode,
  getMarketingMobileCbgTeamLeaderQueryTeamLeader,
  postMarketingMobileCbgTeamLeaderEdit,
} from '@apps/apis'
import AddressPopup from '../../components/addressPopup'
import cx from 'classnames'
import Taro from '@tarojs/taro'

const TeamLeaderApplicationForm: React.FC<{}> = () => {
  const intl = useIntl()
  const { params } = useRouter()
  const [submitting, setSubmitting] = useState(false)
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
    status: 0,
    rejectionReason: '',
  })
  const [fromType, setFromType] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)

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
      setFrontUrl(info.idPhoto)
      setBackUrl(info.idPhotoBack)
    } else if (params.fromType) {
      setFromType(params.fromType)
      Taro.setNavigationBarTitle({
        title: '编辑团长信息',
      })
      getTeamLeaderInfo()
    } else {
      // 获取缓存登录账户信息
      const userInfoStr = getStorageSync(USER_INFO)
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr)
        const name = userInfo.userName
        const phone = userInfo.phone
        setFormItems((prev) => ({ ...prev, name, phone }))
      }
    }
  }, [])

  const getTeamLeaderInfo = () => {
    FullScreenLoading.show()
    getMarketingMobileCbgTeamLeaderQueryTeamLeader()
      .then((res) => {
        if (res.code === 1000) {
          const info = res.data
          // 赋值回显团长信息
          setFormItems((prev) => ({
            ...prev,
            ...info,
          }))
          setFrontUrl(info.idPhoto)
          setBackUrl(info.idPhotoBack)
          setIsDisabled(info.status === 1)
        } else {
          showToast({
            title:
              res?.message ||
              intl.formatMessage({
                id: 'teamLeader.huoqushujushibai',
                defaultMessage: '获取数据失败',
              }),
            icon: 'none',
          })
        }
      })
      .catch((error) => {
        const errMsg =
          error?.response?.data?.message ||
          error?.message ||
          intl.formatMessage({
            id: 'teamLeader.huoqushujushibai',
            defaultMessage: '获取数据失败',
          })
        showToast({
          title: errMsg,
          icon: 'none',
        })
      })
      .finally(() => {
        FullScreenLoading.hide()
      })
  }

  const changeInputValue = (key: string, val: any) => {
    setFormItems({ ...formItems, [key]: val })
  }

  const [homeAddressPopup, setHomeAddressPopup] = useState(false)
  const [pickupPointAddressPopup, setPickupPointAddressPopup] = useState(false)

  // 选择家庭住址-省市区街道
  const handleHomeAddress = (value) => {
    const { provinceName, cityName, districtName, streetName, provinceCode, cityCode, districtCode, streetCode } = value
    setFormItems((prev) => ({
      ...prev,
      homeProvince: provinceName || '',
      homeCity: cityName || '',
      homeArea: districtName || '',
      homeStreet: streetName || '',
      homeProvinceCode: provinceCode || '',
      homeCityCode: cityCode || '',
      homeAreaCode: districtCode || '',
      homeStreetCode: streetCode || '',
    }))
  }
  // 家庭住址-省市区街道input中显示
  const homeAddressArea = useMemo(() => {
    const { homeProvince, homeCity, homeArea, homeStreet } = formItems
    return [homeProvince, homeCity, homeArea, homeStreet].filter(Boolean).join('')
  }, [formItems.homeProvince, formItems.homeCity, formItems.homeArea, formItems.homeStreet])

  // 选择自提点地址-省市区街道
  const handlePickupPointAddress = (value) => {
    const { provinceName, cityName, districtName, streetName, provinceCode, cityCode, districtCode, streetCode } = value
    setFormItems((prev) => ({
      ...prev,
      pickupPointProvince: provinceName || '',
      pickupPointCity: cityName || '',
      pickupPointArea: districtName || '',
      pickupPointStreet: streetName || '',
      pickupPointProvinceCode: provinceCode || '',
      pickupPointCityCode: cityCode || '',
      pickupPointAreaCode: districtCode || '',
      pickupPointStreetCode: streetCode || '',
    }))
  }
  // 自提点地址-省市区街道input中显示
  const pickupPointAddressArea = useMemo(() => {
    const { pickupPointProvince, pickupPointCity, pickupPointArea, pickupPointStreet } = formItems
    return [pickupPointProvince, pickupPointCity, pickupPointArea, pickupPointStreet].filter(Boolean).join('')
  }, [formItems.pickupPointProvince, formItems.pickupPointCity, formItems.pickupPointArea, formItems.pickupPointStreet])

  // 获取验证码块
  // 获取手机号正则判断
  const { getTelPattern } = useTelCode()
  // 禁止点击发送验证
  const [btnDisabled, setBtnDisabled] = useState(false)
  // 发送验证码文字
  const [btnContent, setBtnContent] = useState(
    intl.formatMessage({ id: 'teamLeader.huoquyanzhengma', defaultMessage: '获取验证码' }),
  )
  // 手机区号
  const [telCode] = useState(COUNTRY_PHONE_CODE)
  const [max] = useState(COUNTRY_PHONE_LENGTH)
  const translate = useMobileIntl()
  /* 倒计时 */
  let time = 60
  const handleCountdown = () => {
    if (time > 0 && time <= 60) {
      time -= 1
      setBtnContent(time < 10 ? `0${time}s` : `${time}s`)
      setBtnDisabled(true)
      setTimeout(() => {
        handleCountdown()
      }, 1000)
    } else {
      time = 60
      setBtnDisabled(false)
      setBtnContent(
        intl.formatMessage({
          id: 'teamLeader.huoquyanzhengma',
          defaultMessage: '获取验证码',
        }),
      )
    }
  }
  /* 获取验证码 */
  const getCode = () => {
    const phone = formItems.phone
    if (!phone) {
      showToast({
        title: intl.formatMessage({
          id: 'teamLeader.qingshurunindexinshouji',
          defaultMessage: '请输入您的手机号码',
        }),
        icon: 'none',
      })
    } else {
      // 根据国家区号判断手机号是否正确
      if (!getTelPattern(telCode as any).test(phone)) {
        showToast({
          title: translate('mobile.common.qingshuruzhengquedeshoujihao'),
          icon: 'none',
        })
        return
      }
      // 倒计时
      handleCountdown()
      const toastOpts: Taro.showToast.Option = {
        title: intl.formatMessage({
          id: 'teamLeader.fasongchenggong',
          defaultMessage: '发送成功',
        }),
        icon: 'success',
        mask: true,
      }
      showToast(toastOpts)
      // 请求发送短信接口
      const params = {
        telCode: telCode?.startsWith('+') ? telCode.slice(1) : telCode,
        phone: phone,
      }
      postMarketingMobileCbgTeamLeaderSendApplySmsCode(params).then((res) => {
        if (res.code === 1000) {
          showToast({
            title: res.message,
            icon: 'none',
          })
        } else {
          showToast({
            title: res.message,
            icon: 'none',
          })
        }
      })
    }
  }

  // 上传证件照
  const [frontUrl, setFrontUrl] = useState<string | undefined>()
  const [backUrl, setBackUrl] = useState<string | undefined>()
  const handleUploadSuccess = ({ frontUrl: f, backUrl: b }) => {
    // if (f !== undefined) {
    //   setFrontUrl(f)
    //   setFormItems((prev) => ({
    //     ...prev,
    //     idPhoto: f || '',
    //   }))
    // }
    // if (b !== undefined) {
    //   setBackUrl(b)
    //   setFormItems((prev) => ({
    //     ...prev,
    //     idPhotoBack: b || '',
    //   }))
    // }

    setFrontUrl(f || '')
    setBackUrl(b || '')
    setFormItems((prev) => ({
      ...prev,
      idPhoto: f || '',
      idPhotoBack: b || '',
    }))
  }

  // 校验
  const validateForm = (formItems, intl, telCode) => {
    const param = { ...formItems }
    if (!param.name) {
      return intl.formatMessage({ id: 'teamLeader.qingshuruxingming', defaultMessage: '请输入姓名' })
    }
    if (!param.phone) {
      return intl.formatMessage({ id: 'teamLeader.qingshurushouji', defaultMessage: '请输入手机' })
    }
    if (!getTelPattern(telCode).test(param.phone)) {
      return intl.formatMessage({
        id: 'mobile.common.qingshuruzhengquedeshoujihao',
        defaultMessage: '请输入正确的手机号',
      })
    }
    if (!param.code) {
      return intl.formatMessage({ id: 'teamLeader.qingshuruyanzhengma', defaultMessage: '请输入验证码' })
    }
    if (!homeAddressArea) {
      return intl.formatMessage({ id: 'teamLeader.qingshurushengshiqu', defaultMessage: '请输入家庭地址-省市区' })
    }
    if (!param.homeAddress) {
      return intl.formatMessage({ id: 'teamLeader.qingshurujiatingxiangxidizhi', defaultMessage: '请输入家庭详细地址' })
    }
    if (!param.pickupPointName) {
      return intl.formatMessage({ id: 'teamLeader.qingshuruzitidianmingcheng', defaultMessage: '请输入自提点名称' })
    }
    if (!pickupPointAddressArea) {
      return intl.formatMessage({ id: 'teamLeader.qingshuruzitidianquyu', defaultMessage: '请输入自提点区域' })
    }
    if (!param.pickupPointAddress) {
      return intl.formatMessage({
        id: 'teamLeader.qingshuruzitidianxiangxidizhi',
        defaultMessage: '请输入自提点详细地址',
      })
    }
    if (!param.idPhoto) {
      return intl.formatMessage({ id: 'teamLeader.qingshangchuanrenxiangmian', defaultMessage: '请上传身份证人像面' })
    }
    if (!param.idPhotoBack) {
      return intl.formatMessage({ id: 'teamLeader.qingshangchuanguohuimian', defaultMessage: '请上传身份证国徽面' })
    }
    // 所有校验通过
    return ''
  }

  // 提交申请
  const handleSubmit = () => {
    if (submitting || isDisabled) return
    const flag = validateForm(formItems, intl, telCode)
    if (flag) {
      showToast({ title: flag, icon: 'none' })
      return
    }
    setSubmitting(true)
    FullScreenLoading.show()
    const { status, rejectionReason, ...params } = formItems
    const httpMethod = fromType ? postMarketingMobileCbgTeamLeaderEdit : postMarketingMobileCbgTeamLeaderApply
    httpMethod(params)
      .then((res) => {
        if (res.code === 1000) {
          if (fromType) {
            showToast({
              title: intl.formatMessage({
                id: 'teamLeader.tijiaoshibai',
                defaultMessage: '提交成功，等待审核',
              }),
              icon: 'none',
            })
            setTimeout(() => {
              Router.navigateBack()
            }, 1500)
            return
          }

          Router.navigateTo('teamLeader/applySuccess')
        } else {
          showToast({
            title:
              res?.message ||
              intl.formatMessage({
                id: 'teamLeader.tijiaoshibai',
                defaultMessage: '提交失败',
              }),
            icon: 'none',
          })
        }
      })
      .catch((error) => {
        const errMsg =
          error?.response?.data?.message ||
          error?.message ||
          intl.formatMessage({
            id: 'teamLeader.tijiaoyichang',
            defaultMessage: '提交失败',
          })
        showToast({
          title: errMsg,
          icon: 'none',
        })
      })
      .finally(() => {
        setSubmitting(false)
        FullScreenLoading.hide()
      })
  }

  return (
    <ScrollView scrollY className={styles['application']}>
      <View>
        {fromType && (
          <View>
            {(formItems.status === 1 || formItems.status === 3) && (
              <View style={{ padding: pxTransform(8), background: '#FFF2F0', textAlign: 'left' }}>
                <View style={{ textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                  <Icons name="AlertFill" size={16} color="#F63939" />
                  {formItems.status === 1 ? (
                    <Text style={{ marginLeft: '10rpx' }}>当前信息正在审核中，不可编辑</Text>
                  ) : (
                    <Text style={{ marginLeft: '10rpx' }}>
                      审核不通过，驳回原因：{formItems?.rejectionReason || ''}
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
        )}

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
                <Input
                  className={styles['form-item-input']}
                  name="name"
                  maxlength={20}
                  placeholder={intl.formatMessage({ id: 'teamLeader.qingshuruxingming', defaultMessage: '请输入姓名' })}
                  placeholderClass={styles['form-item-placeholder']}
                  value={formItems.name}
                  onChange={(e) => changeInputValue('name', e)}
                  disabled={isDisabled}
                />
              </View>

              {/* 团长手机 */}
              <View className={styles['form-item']}>
                <Text className={styles['form-item-label']}>
                  {intl.formatMessage({ id: 'teamLeader.tuanzhangshouji', defaultMessage: '团长手机' })}
                  <Text className={styles['form-item-star']}>*</Text>
                </Text>
                <Input
                  className={styles['form-item-input']}
                  name="phone"
                  maxlength={max}
                  type="number"
                  placeholder={intl.formatMessage({ id: 'teamLeader.qingshurushouji', defaultMessage: '请输入手机' })}
                  placeholderClass={styles['form-item-placeholder']}
                  value={formItems.phone}
                  onChange={(e) => changeInputValue('phone', e)}
                  disabled={isDisabled}
                />
              </View>

              {/* 验证码 */}
              <View className={styles['form-item']}>
                <Text className={styles['form-item-label']}>
                  {intl.formatMessage({ id: 'teamLeader.shoujiyanzhengma', defaultMessage: '手机验证码' })}
                  <Text className={styles['form-item-star']}>*</Text>
                </Text>
                <Input
                  placeholder={intl.formatMessage({
                    id: 'teamLeader.qingshuruyanzhengma',
                    defaultMessage: '请输入验证码',
                  })}
                  name="code"
                  style={{ width: pxTransform(100) }}
                  value={formItems.code}
                  className={cx(styles['form-item-input'], styles['team-leader-form-item-input'])}
                  placeholderClass={styles['form-item-placeholder']}
                  maxlength={4}
                  onChange={(e) => changeInputValue('code', e)}
                  disabled={isDisabled}
                >
                  <View className={styles['form-item-code']}>
                    <Text
                      className={styles['form-item-code-text']}
                      onClick={() => {
                        if (!btnDisabled || !isDisabled) {
                          getCode()
                        }
                      }}
                    >
                      {btnContent}
                    </Text>
                  </View>
                </Input>
              </View>

              {/* 地址 */}
              <View className={styles['form-item']}>
                <Text className={styles['form-item-label']}>
                  {intl.formatMessage({ id: 'teamLeader.jiatingzhuzhi', defaultMessage: '家庭住址' })}
                  <Text className={styles['form-item-star']}>*</Text>
                </Text>
                <View
                  onClick={() => {
                    if (!isDisabled) {
                      setHomeAddressPopup(true)
                    }
                  }}
                >
                  <View className={styles['form-item-input']}>
                    {homeAddressArea ? (
                      <Text
                        style={{
                          display: 'block',
                          whiteSpace: 'nowrap',
                          overflowX: 'auto',
                          color: isDisabled ? '#c6c9cc' : '#303133',
                        }}
                        className={styles['form-item-text']}
                      >
                        {homeAddressArea}
                      </Text>
                    ) : (
                      <Text
                        className={styles['form-item-placeholder']}
                        style={{ color: isDisabled ? '#c6c9cc' : '#303133' }}
                      >
                        {intl.formatMessage({ id: 'teamLeader.shengshiqu', defaultMessage: '省/市/区' })}
                      </Text>
                    )}
                  </View>
                  {/*<Input*/}
                  {/*  editable={false}*/}
                  {/*  className={styles['form-item-input']}*/}
                  {/*  name="addressArea"*/}
                  {/*  placeholder={intl.formatMessage({ id: 'teamLeader.shengshiqu', defaultMessage: '省/市/区' })}*/}
                  {/*  placeholderClass={styles['form-item-placeholder']}*/}
                  {/*  value={homeAddressArea}*/}
                  {/*/>*/}
                </View>
              </View>

              {/* 详细地址 */}
              <View className={styles['form-item']}>
                <Text className={styles['form-item-label']}>
                  {intl.formatMessage({ id: 'teamLeader.jiatingxiangxidizhi', defaultMessage: '家庭详细地址' })}
                  <Text className={styles['form-item-star']}>*</Text>
                </Text>
                <Input
                  className={styles['form-item-input']}
                  name="homeAddress"
                  placeholder={intl.formatMessage({
                    id: 'teamLeader.qingshurujiatingxiangxidizhi',
                    defaultMessage: '请输入家庭详细地址',
                  })}
                  placeholderClass={styles['form-item-placeholder']}
                  value={formItems.homeAddress}
                  onChange={(e) => changeInputValue('homeAddress', e)}
                  disabled={isDisabled}
                />
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
              <IDCardUploader
                frontUrl={frontUrl}
                backUrl={backUrl}
                onUploadSuccess={handleUploadSuccess}
                disabled={isDisabled}
              />
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
                <Input
                  className={styles['form-item-input']}
                  name="pickupPointName"
                  placeholder={intl.formatMessage({
                    id: 'teamLeader.qingshuruzitidianmingcheng',
                    defaultMessage: '请输入自提点名称',
                  })}
                  placeholderClass={styles['form-item-placeholder']}
                  value={formItems.pickupPointName}
                  onChange={(e) => changeInputValue('pickupPointName', e)}
                  disabled={isDisabled}
                />
              </View>

              {/* 自提点区域 */}
              <View className={styles['form-item']}>
                <Text className={styles['form-item-label']}>
                  {intl.formatMessage({ id: 'teamLeader.zitidiandizhi', defaultMessage: '自提点地址' })}
                  <Text className={styles['form-item-star']}>*</Text>
                </Text>
                <View
                  onClick={() => {
                    if (!isDisabled) {
                      setPickupPointAddressPopup(true)
                    }
                  }}
                >
                  <View className={styles['form-item-input']}>
                    {pickupPointAddressArea ? (
                      <Text
                        style={{
                          display: 'block',
                          whiteSpace: 'nowrap',
                          overflowX: 'auto',
                          color: isDisabled ? '#c6c9cc' : '#303133',
                        }}
                        className={styles['form-item-text']}
                      >
                        {pickupPointAddressArea}
                      </Text>
                    ) : (
                      <Text
                        className={styles['form-item-placeholder']}
                        style={{ color: isDisabled ? '#c6c9cc' : '#303133' }}
                      >
                        {intl.formatMessage({ id: 'teamLeader.shengshiqu', defaultMessage: '省/市/区' })}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {/* 自提点详细地址 */}
              <View className={styles['form-item']}>
                <Text className={styles['form-item-label']}>
                  {intl.formatMessage({ id: 'teamLeader.zitidianxiangxidizhi', defaultMessage: '自提点详细地址' })}
                  <Text className={styles['form-item-star']}>*</Text>
                </Text>
                <Input
                  className={styles['form-item-input']}
                  name="pickupPointAddress"
                  placeholder={intl.formatMessage({
                    id: 'teamLeader.qignshuruzitidianxiangxidizhi',
                    defaultMessage: '请输入自提点详细地址',
                  })}
                  placeholderClass={styles['form-item-placeholder']}
                  value={formItems.pickupPointAddress}
                  onChange={(e) => changeInputValue('pickupPointAddress', e)}
                  disabled={isDisabled}
                />
              </View>
            </View>
          </View>
        </Form>

        <View className={styles['application-bottom']}>
          <View className={styles['application-button']} onClick={handleSubmit}>
            {intl.formatMessage({ id: 'teamLeader.tijiaoshenqing', defaultMessage: '提交申请' })}
          </View>
        </View>

        <FullScreenLoading />

        {/* 省市区选择弹窗 */}
        <AddressPopup
          visible={homeAddressPopup}
          onClose={() => setHomeAddressPopup(false)}
          onChange={(value) => handleHomeAddress(value)}
        />

        <AddressPopup
          visible={pickupPointAddressPopup}
          onClose={() => setPickupPointAddressPopup(false)}
          onChange={(value) => handlePickupPointAddress(value)}
        />
      </View>
    </ScrollView>
  )
}

export default GlobalWrapper(TeamLeaderApplicationForm)
