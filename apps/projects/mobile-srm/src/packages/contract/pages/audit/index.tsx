import React, { useEffect, useState, useMemo } from 'react'
import { View, Text, Toast, TextArea, Picker, Icons, Image, Switch } from '@apps/mobile-ui'
import {
  pxTransform,
  getCurrentInstance,
  setNavigationBarTitle,
  openDocument,
  showLoading,
  hideLoading,
  showToast,
  chooseMessageFile,
  downloadFile,
} from '@apps/mobile-services/utils/taro'
import cx from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import { useSafeArea } from '@apps/mobile-services'
import Router from '@/utils/router'
import { limitByte } from '@/utils'
import styles from './index.module.scss'
import doc from '@/assets/images/Doc.svg'
import pdf from '@/assets/images/PDF.svg'
import excel from '@/assets/images/Excel.svg'
import deleteIcon from '@/assets/images/delete.png'
import add from '@/assets/images/add.png'

import { getToday } from '@/utils/date'
import uploadFileRequest, { uuid } from '@/utils/uploadFileRequest'
import {
  postContractMobileManageCreateExamine,
  postContractMobileManageCreateSubmitExamine,
  postContractMobileManageInvalid,
  postContractMobileManageSign,
  postContractMobileManageSignExamine,
  postContractMobileManageSignSubmit,
} from '@apps/apis'
import PageLayout from '@/components/PageLayout'
import NavBar from '@/components/NavBar'

const Audit: React.FC = () => {
  const intl = useIntl()
  const params = getCurrentInstance().preloadData || {}
  const { id, title, contractType, reasonPlacehoder, agree, buttonStyle, refresh } = params // 详情数据
  const { safeBottomHeight } = useSafeArea()
  const [reason, setReason] = useState<string>('')
  const [createValues, setCreateValues] = useState<string>(getToday())
  const [fileData, setFileData] = useState<{ name: string; url: string }>({ name: '', url: '' })
  const [signRadio, setSignRadio] = useState<boolean>(true)

  useEffect(() => {
    if (title) {
      setNavigationBarTitle({ title })
    } else {
      setNavigationBarTitle({ title: '确认审核不通过' })
    }
  }, [title])

  const handleContractType = (name) => {
    if (name?.endsWith('docx') || name?.endsWith('doc')) {
      return doc
    }
    if (name?.endsWith('xls') || name?.endsWith('xlsx')) {
      return excel
    }
    if (name?.endsWith('pdf')) {
      return pdf
    }
    return ''
  }

  const _disbale = useMemo(() => {
    if (contractType == 'sign') {
      return signRadio ? false : reason.length <= 0
    } else if (contractType == 'search') {
      return reason.length <= 0
    } else if (agree == 1) {
      return false
    } else if (agree === undefined || agree === 0) {
      return reason.length <= 0
    } else {
      return false
    }
  }, [reason, agree, signRadio])

  const _func = useMemo(() => {
    switch (contractType) {
      case 'search':
        return postContractMobileManageInvalid
      case 'creatExamineOne':
        return postContractMobileManageCreateExamine
      case 'creatExamineTwo':
        return postContractMobileManageCreateExamine

      case 'creat':
        return postContractMobileManageCreateSubmitExamine

      case 'signExamine':
        return postContractMobileManageSignSubmit
      case 'signExamineOne':
        return postContractMobileManageSignExamine
      case 'signExamineTwo':
        return postContractMobileManageSignExamine
      case 'sign':
        return postContractMobileManageSign
    }
  }, [contractType])

  const handleTextInputChange = (text: string) => {
    setReason(text)
  }

  /** 审核提交 */
  const handleSubmit = () => {
    const param: any = {
      contractId: id,
      opinion: reason,
    }

    if (contractType == 'search') {
      param.invalidTime = createValues
      param.invalidReason = reason
    }

    if (buttonStyle == 'audit') {
      param.isPass = agree
    }

    if (contractType == 'sign') {
      param.isPass = signRadio ? 1 : 0
      param.contractUrl = fileData.url
      param.opinion = reason
    }

    const message = limitByte(reason, { maxByte: contractType == 'search' ? 100 : 120 })
    if (message) {
      showToast({ title: message, icon: 'none' })
      return
    }
    if (_disbale) {
      Toast.show({ title: '请输入原因', icon: 'none' })
      return
    }
    FullScreenLoading.show()

    _func(param).then((res) => {
      if (res.code !== 1000) {
        FullScreenLoading.hide()
        Toast.show({ title: res.message, icon: 'none' })
        return
      }
      Toast.show({ title: res.message, icon: 'none' })
      setTimeout(() => {
        Router.navigateBack({
          delta: 2,
          success: () => {
            refresh()
          },
        })
      }, 200)

      FullScreenLoading.hide()
    })
  }

  const handleDateChange = (e): void => {
    setCreateValues(e.detail.value)
  }

  const handleCheck = (e) => {
    setSignRadio(!signRadio)
  }

  const handleOpenDocument = () => {
    if (!fileData?.url) return
    downloadFile({
      url: fileData.url,
      success: function (res) {
        var filePath = res.tempFilePath
        openDocument({
          filePath: filePath,
          success: function () {
            console.log('打开文档成功')
          },
        })
      },
    })
  }

  const handleChooseMessageFile = () => {
    chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['docx', 'doc', 'xls', 'xlsx', 'pdf'],
      success: async function (res) {
        const result = res.tempFiles.map((_item) => {
          return {
            ..._item,
            status: 'ready',
            _id: uuid(),
            path: _item?.path,
            name: _item?.name,
          }
        })
        showLoading()
        const uploadResult = await uploadFileRequest(result)
        const files = uploadResult.map((_item) => {
          return { ..._item, name: _item.name, url: _item.url }
        })
        hideLoading()
        if (uploadResult.length > 0) {
          setFileData(files[0])
        }
      },
    })
  }

  return (
    <PageLayout
      renderHeader={
        <>
          <NavBar title={title || '确认审核不通过'} />
        </>
      }
    >
      <View
        className={styles['auditLayout']}
        style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
      >
        <FullScreenLoading />

        {contractType == 'sign' && (
          <>
            <View className={styles['sign']}>
              <View className={styles['sign-title']}>合同附件（乙方已盖章签字）</View>
              {fileData.name && (
                <View className={styles['sign-contract']} onClick={handleOpenDocument}>
                  <View className={styles['sign-flex']}>
                    <Image
                      className={styles['sign-contract-svg']}
                      style={{ width: pxTransform(24), height: pxTransform(24) }}
                      src={handleContractType(fileData.name)}
                    />
                    <Text className={styles['sign-contract-text']}>{fileData.name}</Text>
                  </View>
                  <Image
                    className={styles['sign-contract-delete']}
                    style={{ width: pxTransform(16), height: pxTransform(16) }}
                    src={deleteIcon}
                    onClick={(e) => {
                      e.stopPropagation()
                      setFileData('')
                    }}
                  />
                </View>
              )}
              <View className={styles['sign-button']} onClick={handleChooseMessageFile}>
                <Image className={styles['sign-button-img']} src={add} />
                上传附件
              </View>
            </View>

            <View className={styles['sign-radio']}>
              <Switch
                border={false}
                title="是否同意签订"
                color="#00A98F"
                checked={signRadio}
                onChange={handleCheck}
              ></Switch>
            </View>
          </>
        )}

        {contractType == 'search' && (
          <View className={styles['auditLayout-time']}>
            <View className={styles['auditLayout-time-title']}>作废日期</View>
            <View className={styles['auditLayout-time-picker']}>
              <Picker mode="date" value={createValues ?? ''} onChange={handleDateChange}>
                <Text className={styles['advanceDeliveryDate']}>{createValues ?? '请选择日期'}</Text>
              </Picker>
              <Icons className={styles['auditLayout-time-picker-icon']} name="ChevronRight" size={16} color="#c9cacc" />
            </View>
          </View>
        )}

        <View className={styles['auditLayout-inputBox']}>
          <TextArea
            maxLength={100}
            count={false}
            height="100%"
            placeholder={reasonPlacehoder}
            value={reason}
            onChange={handleTextInputChange}
          />
        </View>
        <View className={styles['auditLayout-btnBox']}>
          <View className={styles['auditLayout-touchableOpacity']} onClick={() => handleSubmit()}>
            <View className={cx(styles['auditLayout-primaryBtn'], _disbale ? styles['auditLayout__disableBtn'] : '')}>
              <Text
                className={cx(styles['auditLayout-primaryText'], _disbale ? styles['auditLayout__disbaleText'] : '')}
              >
                {intl.formatMessage({ id: 'inquiry.queren', defaultMessage: '确认' })}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </PageLayout>
  )
}

export default Audit
