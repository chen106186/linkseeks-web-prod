import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { Input as TaroInput } from '@tarojs/components'
import { View, Text, Image, Input, Modal, Checkbox } from '@apps/mobile-ui'
import usePasswordVerify from '@apps/services/verify/usePasswordVerify'
import { showToast, setNavigationBarTitle, pxTransform, getCurrentPages } from '@apps/mobile-services/utils/taro'
import { setAsyncStorage } from '@apps/mobile-services/utils/storage'
import Router from '@/utils/router'
import { COUNTRY_PHONE_CODE, COUNTRY_PHONE_LENGTH } from '@/constants'
import { useIntl } from '@linkseeks/i18n'
import { encryptedByAES } from '@linkseeks/crypto'
import { PATTERN_MAPS } from '@/constants/regExp'
import { REGISTER_DATA } from '@/constants/storage'
import ModeMobile from '@/components/Modemobile'
import PasswordVerify from '@/components/PasswordVerify'
import { useSafeArea } from '@apps/mobile-services'
import { postMemberMobileRegisterPhoneCheck, postMemberMobileRegisterSms } from '@apps/apis'
import { getManageContentNoticeFindAllByColumnType } from '@apps/apis'
import Progress from './components/progress'
import { JumpLike } from './utils'
import styles from './index.module.scss'
import { useTelCode } from '@apps/services'
import { usePageInit } from '@/hooks/usePageInit'
import { useMobileIntl } from '@apps/locales'
import { getOssUrlPath } from '@apps/constants'
import { LOCAL_LEGAL_AGREEMENTS } from '@/constants/legalAgreements'
const fill = getOssUrlPath('/miniprogram/assets/images/arrow-down-fill@2x.png')
const EyeOff = getOssUrlPath('/miniprogram/assets/images/EyeOff.png')
const Eye = getOssUrlPath('/miniprogram/assets/images/eye.png')
type MobileParamsType = {
  phone: string
  smsCode: string
  password: string
  password1: string
  email: string
}
type FunctionItem = {
  /**
   * 标题
   */
  title: string
  columnType: number
  /* 富文本 */
  content: string
  status: string
  id: string
  top: string
}
const Register = () => {
  const intl = useIntl()
  const translate = useMobileIntl()
  const [type, setType] = useState<boolean>(true)
  const [type1, setType1] = useState<boolean>(true)
  const [btnContent, setBtnContent] = useState<any>(
    intl.formatMessage({
      id: 'user.huoquyanzhengma',
      defaultMessage: '获取验证码',
    }),
  ) // f发送验证码文字
  const [btnDisabled, setBtnDisabled] = useState(false) // 禁止点击发送验证
  const [select, setSelect] = useState<boolean>(false) // 勾选协议
  const [toggle, setToggle] = useState<boolean>(false) // 显示手机号模态框
  const [toggleLogin, setToggleLogin] = useState<boolean>(false) // 控制显示弹出
  const [telCode, setCode] = useState(COUNTRY_PHONE_CODE) // 手机区号
  const [phoneLength, setPhoneLength] = useState(COUNTRY_PHONE_LENGTH)
  const [columnTypeList, setColumnTypeList] = useState<FunctionItem[][]>([])
  const [from, setFrom] = useState<MobileParamsType>({
    phone: '',
    smsCode: '',
    password: '',
    password1: '',
    email: '',
  })
  const { safeBottomHeight } = useSafeArea()
  const { getTelPattern } = useTelCode()
  const { success, score } = usePasswordVerify(from.password)
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
          id: 'user.huoquyanzhengma',
          defaultMessage: '获取验证码',
        }),
      )
    }
  }
  /* 给from设置值 */
  const setKey = (val, key) => {
    const fromData = {
      ...from,
    }
    fromData[key] = val
    setFrom(fromData)
  }

  // 获取国家代码和手机号码位数
  const getCode = async () => {
    const { phone } = from
    if (!btnDisabled) {
      if (!phone) {
        showToast({
          title: intl.formatMessage({
            id: 'user.qingshurushoujihaoma',
            defaultMessage: '请输入手机号码',
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
        const param: any = {
          telCode,
          phone: encryptedByAES(phone),
        }
        const res = await postMemberMobileRegisterSms(param)
        if (res.code === 1000) {
          handleCountdown()
          showToast({
            title: intl.formatMessage({
              id: 'user.fasongchenggong',
              defaultMessage: '发送成功',
            }),
          })
        } else {
          showToast({
            title: intl.formatMessage({
              id: `${res.code}`,
              defaultMessage: res.message,
            }),
            icon: 'none',
          })
        }
      }
    }
  }
  const submit = async () => {
    const { phone, smsCode, password, password1, email } = from
    if (!phone) {
      showToast({
        title: intl.formatMessage({
          id: 'user.qingshurushoujihao',
          defaultMessage: '请输入手机号',
        }),
        icon: 'none',
      })
      return
    } else {
      // 根据国家区号判断手机号是否正确
      if (!getTelPattern(telCode as any).test(phone)) {
        showToast({
          title: translate('mobile.common.qingshuruzhengquedeshoujihao'),
          icon: 'none',
        })
        return
      }
    }
    if (!smsCode) {
      showToast({
        title: intl.formatMessage({
          id: 'user.qingshuruyanzhengma',
          defaultMessage: '请输入验证码',
        }),
        icon: 'none',
      })
      return
    }
    if (!PATTERN_MAPS.password.test(password)) {
      showToast({
        title: intl.formatMessage({
          id: 'user.zimushuzihuofuhao',
          defaultMessage: '字母+数字或符号至少二种以上字符组成的8-20位字符，区分大小写',
        }),
        icon: 'none',
      })
      return
    }
    if (password.indexOf(' ') > -1) {
      showToast({
        title: intl.formatMessage({
          id: 'user.password.space',
          defaultMessage: '密码不能包含空格',
        }),
      })
      return
    }
    if (score < 1) {
      showToast({
        title: intl.formatMessage({
          id: 'user.password.reset',
          defaultMessage: '当前密码强度弱，请重新设置密码',
        }),
      })
      return
    }
    if (!PATTERN_MAPS.password.test(password1)) {
      showToast({
        title: intl.formatMessage({
          id: 'user.qingzaicishurumima',
          defaultMessage: '请再次输入密码，字母+数字或符号至少二种以上字符组成的8-20位字符，区分大小写',
        }),
        icon: 'none',
      })
      return
    }
    if (password !== password1) {
      showToast({
        title: intl.formatMessage({
          id: 'user.liangcimimashurubuyi',
          defaultMessage: '两次密码输入不一致',
        }),
        icon: 'none',
      })
      return
    }
    if (!select) {
      showToast({
        title: intl.formatMessage({
          id: 'user.qinggouxuanxieyi',
          defaultMessage: '请勾选协议',
        }),
        icon: 'none',
      })
      return
    }
    if (email && !PATTERN_MAPS.email.test(email)) {
      showToast({
        title: '请输入正确邮箱',
        icon: 'none',
      })
    } else {
      const res = await postMemberMobileRegisterPhoneCheck(
        {
          telCode,
          phone: encryptedByAES(phone),
        },
        {
          showError: false,
        },
      )
      if (res.code === 1000) {
        const data = {
          telCode,
          phone,
          password,
          smsCode,
          email,
        }
        setAsyncStorage(REGISTER_DATA, data)
        JumpLike(1)
      } else {
        setToggleLogin(true)
      }
    }
  }
  /* 选择区号回调 */
  const onConfirm = (item) => {
    setCode(item.value)
    setPhoneLength(item.phoneLength)
    setToggle(false)
  }
  /* 关闭 */
  const onClose = (item) => {
    setToggle(item.toggle)
  }
  /* 协议 */
  const findAllByColumnType = () => {
    getManageContentNoticeFindAllByColumnType({
      columnType: '2',
    })
      .then((res: any) => {
        if (res.code === 1000 && res.data?.length) {
          setColumnTypeList(res.data)
        } else {
          setColumnTypeList(LOCAL_LEGAL_AGREEMENTS as any)
        }
      })
      .catch(() => {
        setColumnTypeList(LOCAL_LEGAL_AGREEMENTS as any)
      })
  }
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'user.zhanghaozhuce', defaultMessage: '帐号注册' }) })
    findAllByColumnType()
  }, [])
  const webView = (items) => {
    Router.navigateTo('basicSetting/webView', {
      id: items.id,
      type: 'sign',
      columnType: items.columnType,
      title: items.title,
    })
  }

  const jumpLogin = () => {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      const prevPage = pages[pages.length - 2]
      const prevPageUrl = prevPage.route
      if (prevPageUrl && prevPageUrl?.indexOf('login') > -1) {
        Router.navigateBack()
        return
      }
    }
    Router.navigateTo('user/login')
  }

  return (
    <View
      className={styles['container']}
      style={{
        paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(16),
      }}
    >
      <Progress setp={1} />
      <View className={styles['InfoName']}>
        {intl.formatMessage({
          id: 'user.jibenxinxi',
          defaultMessage: '基本信息',
        })}
      </View>
      <View className={styles['from']}>
        <View
          className={styles['fromItem']}
          style={{
            marginTop: pxTransform(0),
          }}
        >
          <View className={styles['fill']}>
            <Text className={styles['code']} onClick={() => setToggle(true)}>
              {telCode}
            </Text>
            <Image src={fill} />
          </View>
          <Input
            placeholderClass={styles['placeholderText']}
            type="number"
            maxlength={phoneLength}
            value={from.phone}
            placeholder={intl.formatMessage({
              id: 'user.qingshurushoujihao',
              defaultMessage: '请输入手机号',
            })}
            onChange={(e) => setKey(e, 'phone')}
          />
        </View>
        <View className={styles['fromFlex']}>
          <Input
            placeholderClass={styles['placeholderText']}
            value={from.smsCode}
            placeholder={intl.formatMessage({
              id: 'user.qingshuruyanzhengma',
              defaultMessage: '请输入验证码',
            })}
            onChange={(e) => setKey(e, 'smsCode')}
          />
          <Text
            onClick={getCode}
            className={`${styles['codeNumber']} ${btnDisabled ? styles['codeNumber-disabled'] : ''}`}
          >
            {btnContent}{' '}
          </Text>
        </View>
        <View className={styles['fromFlex']}>
          <Input
            value={from.password}
            type="text"
            password={type ? true : false}
            placeholderClass={styles['placeholderText']}
            placeholder={intl.formatMessage({
              id: 'user.qingshurumima',
              defaultMessage: '请输入密码',
            })}
            onChange={(e) => setKey(e, 'password')}
          />
          <Image src={type ? EyeOff : Eye} onClick={() => setType(!type)} />
        </View>
        {from.password ? <PasswordVerify score={score} /> : <View />}
        <View className={styles['fromFlex']}>
          <Input
            value={from.password1}
            type="text"
            password={type1 ? true : false}
            placeholderClass={styles['placeholderText']}
            placeholder={intl.formatMessage({
              id: 'user.qingzaicishurumima1',
              defaultMessage: '请再次输入密码',
            })}
            onChange={(e) => setKey(e, 'password1')}
          />
          <Image src={type1 ? EyeOff : Eye} onClick={() => setType1(!type1)} />
        </View>
        <View className={styles['fromFlex']}>
          <Input
            value={from.email}
            type="text"
            placeholderClass={styles['placeholderText']}
            placeholder={intl.formatMessage({
              id: 'user.qingshuruyouxiangxuantian',
              defaultMessage: '请输入邮箱(选填)',
            })}
            onChange={(e) => setKey(e, 'email')}
          />
        </View>
        <View className={styles['sign']}>
          <Checkbox checked={select} size={18} onChange={(checked) => setSelect(checked)} />
          <View className={styles['signFlex']}>
            <Text className={styles['signText']} onClick={() => setSelect(!select)}>
              {intl.formatMessage({
                id: 'user.yuedubingtongyi',
                defaultMessage: '阅读并同意',
              })}
            </Text>
            {columnTypeList.map((items: any, index: number) => (
              <React.Fragment key={items.id}>
                {index > 0 && <Text className={styles['signSeparator']}>、</Text>}
                <Text className={styles['signRight']} onClick={() => webView(items)}>
                  {`《${items.title}》`}
                </Text>
              </React.Fragment>
            ))}
          </View>
        </View>
      </View>
      {/* <View className={styles['Tip']}>{intl.formatMessage({id: 'user.zimushuzihuofuhao', defaultMessage: '字母+数字或符号至少二种以上字符组成的8-20位字符，区分大小写'})}</View> */}
      <View className={styles['foot']}>
        <View className={styles['btn']} onClick={submit}>
          {intl.formatMessage({
            id: 'user.queding',
            defaultMessage: '确定',
          })}
        </View>
        <View className={styles['btnText']} onClick={() => jumpLogin()}>
          {intl.formatMessage({ id: 'user.yiyouzhanghaoqudenglu', defaultMessage: '已有账号，去登录' })} &gt;{' '}
        </View>
      </View>

      {/* 选着手机号码模态框 */}
      <ModeMobile toggle={toggle} onConfirm={onConfirm} onClose={onClose} />
      <Modal
        isOpened={toggleLogin}
        onConfirm={() => Router.navigateTo('user/login')}
        onCancel={() => setToggleLogin(false)}
        title={intl.formatMessage({
          id: 'user.gaishoujihaoyijingbangding',
          defaultMessage: '该手机号已经绑定账号,您可以使用该手机号进行登录!',
        })}
        cancelText={intl.formatMessage({
          id: 'user.quxiao',
          defaultMessage: '取消',
        })}
        confirmText={intl.formatMessage({
          id: 'user.qudenglu',
          defaultMessage: '去登录',
        })}
        className={styles['register-model']}
      />
    </View>
  )
}
export default GlobalWrapper(Register)
