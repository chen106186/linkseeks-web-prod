import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect } from 'react'
import { View, Text, Input, Form, Image, Toast, Upload } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import uploadFileRequest from '@/utils/uploadFileRequest'
import { pxTransform, showToast, showLoading, hideLoading } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { getPayAllInPayGetMemberInfo, postPayAllInPayIdCardCollect } from '@apps/apis'
import AgreementLayout from '@/components/Agreement'
import Layout from '../../components/Layout'
import styles from './index.module.scss'
import { useMobileIntl } from '@apps/locales'
const ImageAcquisition = () => {
  const intl = useIntl()
  const translate = useMobileIntl()
  const [fileList, setFileList] = useState<any>([])
  const [PositiveFileList, setPositiveFileList] = useState<any>([])
  const [sideFileList, setsetsideFileList] = useState<any>([])
  const [agre, setagre] = useState<boolean>(true)
  // 通联支付-影印件采集
  const idCardCollect = (data: { picType: number; picture: string }) => {
    console.log(data.picture, '传入的图片')
    postPayAllInPayIdCardCollect(data).then((res: any) => {
      console.log(res, 'res')
    })
  }

  // 图片上传
  const handleUploadChange = async (data: any, picType: number) => {
    const uploadResult = await uploadFileRequest([data[0]])
    switch (picType) {
      case 8:
        setPositiveFileList({
          ...uploadResult[0],
        })
        break
      case 9:
        setsetsideFileList({
          ...uploadResult[0],
        })
        break
      case 1:
        setFileList({
          ...uploadResult[0],
        })
        break
      default:
        break
    }
    return uploadResult
  }

  // 提交数据
  const Submit = async () => {
    // console.log(PositiveFileList, sideFileList,)
    const List = [
      {
        picture: PositiveFileList.url,
        picType: 8,
      },
      {
        picture: sideFileList.url,
        picType: 9,
      },
      {
        picture: fileList.url,
        picType: 1,
      },
    ]

    // const fns = pictures.map((item, index) => new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     const res = postPayAllInPayIdCardCollect(item, {ctlType: "none"})
    //     resolve(res)
    //   }, 500 * index)
    // }))

    // Promise.all(fns).then((res) => {
    //   if(res.every(item => item['code'] === 1000)) {
    //     message.success(intl.formatMessage({ id: 'payandSettle.capitalAccounts.eAccount.caozuochenggong' }))
    //   } else {
    //     message.success(intl.formatMessage({ id: 'payandSettle.capitalAccounts.eAccount.caozuoshibai' }))
    //   }
    //   setLoading(false)
    //   reloadFormData()
    // })
    if (!agre) {
      showToast({
        title: translate('mobile.resource.user.qingyueduxieyi'),
        icon: 'none',
      })
      return
    }
    showLoading({
      title: intl.formatMessage({
        id: 'pay.jiazaizhong',
        defaultMessage: '加载中',
      }),
    })
    const fns = List.map(
      (item: any, index) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            const res = postPayAllInPayIdCardCollect(item)
            resolve(res)
          }, 500 * index)
        }),
    )
    Promise.all(fns).then(async (res) => {
      if (res.every((item: any) => item['code'] === 1000)) {
        Toast.show({
          title: intl.formatMessage({
            id: 'pay.tijiaochenggongdengdaishenhe',
            defaultMessage: '提交成功等待审核...',
          }),
        })
      } else {
        Toast.show({
          title: intl.formatMessage({
            id: 'pay.shangchuanshibai',
            defaultMessage: '上传失败',
          }),
        })
      }
      let arrUrl: any = [
        'basicSetting/entErpriseAuth',
        'basicSetting/ImageAcquisition',
        'basicSetting/enterpBindphone',
        'basicSetting/enterBindbankCard',
      ]
      const { code, data } = await getPayAllInPayGetMemberInfo()
      if (code === 1000) {
        Router.navigateTo(arrUrl[data.step])
        hideLoading()
      } else {
        hideLoading()
      }
    })
    console.log(List)
  }
  return (
    <View className={styles.page}>
      <Layout steps={1}>
        <View className={styles.warp}>
          <View className={styles.warpItem}>
            <View className={styles.WarpTitle}>
              <Text className={styles.WarptitleText}>
                {intl.formatMessage({
                  id: 'pay.shangchuanpingzheng',
                  defaultMessage: '上传凭证',
                })}
              </Text>
            </View>
            <View className={styles.Upload}>
              <Upload actions={(e) => handleUploadChange(e, 8)} pickerMax={1}>
                {!PositiveFileList.url ? (
                  <View>
                    <Image src={getOssUrlPath(`/Images/idNumber.png`)} />
                    <View className={styles.Text}>
                      {intl.formatMessage({
                        id: 'pay.shangchuanshenfenzhengrenxiangmian',
                        defaultMessage: '上传身份证人像面',
                      })}
                    </View>
                  </View>
                ) : (
                  <Image src={PositiveFileList.url} />
                )}
              </Upload>
              <Upload actions={(e) => handleUploadChange(e, 9)} pickerMax={1}>
                {!sideFileList.url ? (
                  <View>
                    <Image src={getOssUrlPath(`/Images/idNumber1.png`)} />
                    <View className={styles.Text}>
                      {intl.formatMessage({
                        id: 'pay.shangchuanshenfenzhengguohuimian',
                        defaultMessage: '上传身份证国徽面',
                      })}
                    </View>
                  </View>
                ) : (
                  <Image src={sideFileList.url} />
                )}
              </Upload>
            </View>
          </View>
        </View>
        <View
          className={styles.warp}
          style={{
            marginTop: pxTransform(10),
          }}
        >
          <View className={styles.warpItem}>
            <View className={styles.WarpTitle}>
              <Text className={styles.WarptitleText}>
                {intl.formatMessage({
                  id: 'pay.shangchuanyingyezhizhao',
                  defaultMessage: '上传营业执照',
                })}
              </Text>
            </View>
            <View
              className={styles.Card}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Upload actions={(e) => handleUploadChange(e, 1)} pickerMax={1}>
                {!fileList.url ? (
                  <View
                    style={{
                      width: '100%',
                      textAlign: 'center',
                    }}
                  >
                    <Image
                      style={{
                        width: pxTransform(24),
                        height: pxTransform(24),
                      }}
                      src={getOssUrlPath(`/Images/plus%402x.png`)}
                    />
                    <View className={styles.Text}>上传营业执照</View>
                  </View>
                ) : (
                  <Image
                    style={{
                      height: pxTransform(80),
                      width: pxTransform(300),
                    }}
                    src={fileList.url}
                    mode="aspectFill"
                  />
                )}
              </Upload>
            </View>
          </View>
          <AgreementLayout click={(e) => setagre(e)} consentText="阅读并同意" />
        </View>

        <View className={styles.btn} onClick={Submit}>
          <View className={styles.btnText}>
            {intl.formatMessage({
              id: 'pay.tijiao',
              defaultMessage: '提交',
            })}
          </View>
        </View>
      </Layout>
    </View>
  )
}
export default GlobalWrapper(ImageAcquisition)
