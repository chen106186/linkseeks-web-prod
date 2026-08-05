import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import {
  pxTransform,
  previewImage,
  getCurrentInstance,
  showLoading,
  hideLoading,
} from '@apps/mobile-services/utils/taro'
import { View, Text, Image, Icons, Toast, Checkbox, Upload } from '@apps/mobile-ui'
import Cell from '@/components/Cell'
import { decryptedByAES, encryptedByAES } from '@linkseeks/crypto'
import uploadFileRequest from '@/utils/uploadFileRequest'
import { useStatusBarHeight } from '@apps/mobile-services'
import { getOssUrlPath } from '@apps/constants'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { postMemberMobileSecuritySaveAuthInfo, postMemberMobileSecurityUploadIdCard } from '@apps/apis'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const card_ortho = getOssUrlPath('/miniprogram/assets/images/card_ortho.png')
const card_inverse = getOssUrlPath('/miniprogram/assets/images/card_inverse.png')
type InfoProps = {
  /** 身份证正面(人头像) */
  frontUrl?: string
  /** 身份证反面(国徽像) */
  backUrl?: string
  /** 姓名 */
  name?: string
  /** 身份证号码 */
  cardNo?: string
}
type routeProps = {
  data?: InfoProps
  preview?: boolean
}
const RealNameChange: React.FC<{}> = (props: any) => {
  const params = getCurrentInstance().preloadData as routeProps
  const { statusBarHeight } = useStatusBarHeight()
  const intl = useIntl()
  usePageInit()
  const [info, setInfo] = useState<InfoProps>()
  const [agreement, setAgreement] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(true)
  const [term, setTerm] = useState<boolean>(false)
  const handleAgreement = (e: any) => {
    setAgreement(e)
  }

  /** 人像照 */
  const handleFrontUrl = async (result) => {
    showLoading()
    const uploadResult = await uploadFileRequest(result)
    if (uploadResult[0]) {
      const front = uploadResult[0].thumbUrl
      const data = {
        ...info,
        frontUrl: front,
        backUrl: info?.backUrl,
      }
      hideLoading()
      setTerm(true)
      setInfo(data)
    } else {
      hideLoading()
    }
    return uploadResult
  }

  /** 国徽面 */
  const handleBackUrl = async (result) => {
    // showLoading()
    const uploadResult = await uploadFileRequest(result)
    if (uploadResult[0]) {
      const back = uploadResult[0].thumbUrl
      const data = {
        ...info,
        backUrl: back,
      }
      hideLoading()
      setTerm(true)
      setInfo(data)
    } else {
      hideLoading()
    }
    return uploadResult
  }
  useEffect(() => {
    if (info?.frontUrl && info?.backUrl && info?.cardNo && info?.name && agreement) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [info?.frontUrl, info?.backUrl, info?.cardNo, info?.name, agreement])
  const handleSubmit = () => {
    if (disabled) {
      return
    }
    const _into = {
      ...info,
    }
    showLoading()
    if (_into?.name) {
      _into.name = encryptedByAES(_into.name, false)
    }
    if (_into?.cardNo) {
      _into.cardNo = encryptedByAES(_into.cardNo, false)
    }
    if (_into?.frontUrl) {
      _into.frontUrl = encryptedByAES(_into.frontUrl, false)
    }
    if (_into?.backUrl) {
      _into.backUrl = encryptedByAES(_into.backUrl, false)
    }
    postMemberMobileSecuritySaveAuthInfo({
      ..._into,
    } as any)
      .then((res: any) => {
        if (res.code !== 1000) {
          Toast.show({
            title: intl.formatMessage({
              id: `${res.code}`,
              defaultMessage: res.message,
            }),
            icon: 'none',
          })
          return
        }
        Router.navigateTo('basicSetting/successLayout')
      })
      .finally(() => {
        hideLoading()
      })
  }
  useEffect(() => {
    if (params?.data?.frontUrl && params?.data?.backUrl && params?.data?.name && params?.data?.cardNo) {
      const Idata: InfoProps = {
        name: params?.data?.name,
        frontUrl: decryptedByAES(params?.data?.frontUrl),
        cardNo: decryptedByAES(params?.data?.cardNo),
        backUrl: decryptedByAES(params?.data?.backUrl),
      }
      setInfo(Idata)
      setAgreement(true)
    }
  }, [params?.data?.frontUrl, params?.data?.backUrl, params?.data?.name, params?.data?.cardNo])
  useEffect(() => {
    if (info?.frontUrl && info?.backUrl && term) {
      // showLoading()
      postMemberMobileSecurityUploadIdCard({
        frontUrl: encryptedByAES(info?.frontUrl, false),
        backUrl: encryptedByAES(info?.backUrl, false),
      }).then((res: any) => {
        if (res.code !== 1000) {
          hideLoading()
          Toast.show({
            title: intl.formatMessage({
              id: `${res.code}`,
              defaultMessage: res.message,
            }),
            icon: 'none',
          })
          return
        }
        const data = {
          ...res.data,
          cardNo: decryptedByAES(res.data?.cardNo),
          frontUrl: info?.frontUrl,
          backUrl: info?.backUrl,
        }
        hideLoading()
        setInfo(data)
      })
    }
  }, [info?.frontUrl, info?.backUrl, term])
  const handleCircle = (name: string) => {
    let data: InfoProps = {}
    switch (name) {
      case 'frontUrl':
        data = {
          frontUrl: '',
          name: '',
          cardNo: '',
          backUrl: info?.backUrl,
        }
        setInfo(data)
        break
      case 'backUrl':
        data = {
          frontUrl: info?.frontUrl,
          name: '',
          cardNo: '',
          backUrl: '',
        }
        setInfo(data)
        break
    }
  }
  return (
    <View className={styles['realChange']}>
      <View className={styles['realChange-page']}>
        <View
          className={styles['realChange-header']}
          style={{
            paddingTop: `${statusBarHeight}PX`,
          }}
        >
          <View className={styles['realChange-backLayout']}>
            <View className={styles['realChange-icons']} onClick={() => Router.navigateBack()}>
              <Icons name="ChevronLeft" size={24} color="#FFF" />
            </View>
            <View className={styles['realChange-tipsView']}>
              <Text className={styles['realChange-text']}>
                {intl.formatMessage({
                  id: 'realname.shimingrenzheng',
                  defaultMessage: '实名认证',
                })}
              </Text>
              <Text className={styles['realChange-tipsText']}>
                {intl.formatMessage({
                  id: 'realname.genjuhaiguanyaoqiuhai',
                  defaultMessage:
                    '根据海关要求，海外商品入境需提交收件人身份证信息用于清关申报，请确保提供真实有效的身份证件信息。',
                })}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles['realChange-cardBox']}>
        <View className={styles['realChange-cardBoxHead']}>
          <View className={styles['realChange-docLeft']} />
          <Text className={styles['realChange-headText']}>
            {intl.formatMessage({
              id: 'realname.shangchuanshenfenzhengzhaopian',
              defaultMessage: '上传身份证照片',
            })}
          </Text>
        </View>
        <View className={styles['realChange-cardBody']}>
          <View className={styles['realChange-cardFile']}>
            {info?.frontUrl ? (
              <View className={styles['realChange-fileLayout']}>
                <View className={styles['realChange-imageBox']}>
                  <View className={styles['realChange-clear']} onClick={() => handleCircle('frontUrl')}>
                    <Icons color="#000000" name="MinusCircle" />
                  </View>
                  <Image
                    className={styles['realChange-image']}
                    src={info!.frontUrl!}
                    onClick={() =>
                      previewImage({
                        urls: [info!.frontUrl!],
                      })
                    }
                  />
                </View>
              </View>
            ) : (
              <View className={styles['realChange-fileLayout']}>
                <Upload fileList={[]} pickerMax={1} actions={handleFrontUrl}>
                  <View className={styles['realChange-imageBox']}>
                    <Image className={styles['realChange-image']} src={card_ortho} />
                  </View>
                </Upload>
              </View>
            )}
            <Text className={styles['realChange-fileText']}>
              {intl.formatMessage({
                id: 'realname.renxiangmian',
                defaultMessage: '人像面',
              })}
            </Text>
          </View>
          <View className={styles['realChange-cardFile']}>
            {info?.backUrl ? (
              <View className={styles['realChange-fileLayout']}>
                <View className={styles['realChange-imageBox']}>
                  <View className={styles['realChange-clear']} onClick={() => handleCircle('backUrl')}>
                    <Icons color="#000000" name="MinusCircle" />
                  </View>
                  <Image
                    className={styles['realChange-image']}
                    src={info?.backUrl}
                    onClick={() =>
                      previewImage({
                        urls: [info!.backUrl!],
                      })
                    }
                  />
                </View>
              </View>
            ) : (
              <View className={styles['realChange-fileLayout']}>
                <Upload fileList={[]} pickerMax={1} actions={handleBackUrl}>
                  <View className={styles['realChange-imageBox']}>
                    <Image className={styles['realChange-image']} src={card_inverse} />
                  </View>
                </Upload>
              </View>
            )}
            <Text className={styles['realChange-fileText']}>
              {intl.formatMessage({
                id: 'realname.guohuimian',
                defaultMessage: '国徽面',
              })}
            </Text>
          </View>
        </View>
      </View>
      <View className={styles['realChange-cardInfo']}>
        <Cell>
          <Cell.Item
            customHeadStyle={{
              padding: `${pxTransform(16)} 0`,
            }}
            title={intl.formatMessage({
              id: 'realname.xingming',
              defaultMessage: '姓名',
            })}
            value={
              info?.name ||
              intl.formatMessage({
                id: 'realname.shangchuanhouzidonghuoqu',
                defaultMessage: '上传后自动获取',
              })
            }
          />
          <Cell.Item
            customHeadStyle={{
              padding: `${pxTransform(16)} 0`,
            }}
            title={intl.formatMessage({
              id: 'realname.zhengjianhao',
              defaultMessage: '证件号',
            })}
            value={
              info?.cardNo ||
              intl.formatMessage({
                id: 'realname.shangchuanhouzidonghuoqu',
                defaultMessage: '上传后自动获取',
              })
            }
          />
        </Cell>
      </View>
      <View className={styles['realChange-cardRadio']}>
        <Checkbox checked={agreement} size={16} onChange={handleAgreement}>
          <Text className={styles['realChange-cardRadioText']}>
            {intl.formatMessage({
              id: 'realname.querenshouquanyubenrenjin',
              defaultMessage: '确认授权与本人进行交易的商家使用该身份证件信息办理清关申报',
            })}
          </Text>
        </Checkbox>
      </View>
      <View
        className={cx(styles['realChange-button'], !disabled ? styles['realChange-disabled'] : '')}
        onClick={handleSubmit}
      >
        <Text
          className={styles['realChange-submitText']}
          style={
            !disabled
              ? {
                  color: '#FFFFFF',
                }
              : ''
          }
        >
          {intl.formatMessage({
            id: 'realname.tijiao',
            defaultMessage: '提交',
          })}
        </Text>
      </View>
    </View>
  )
}
export default GlobalWrapper(RealNameChange)
