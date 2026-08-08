import React, { useEffect, useState, useMemo } from 'react'
import {
  getCurrentInstance,
  setNavigationBarTitle,
  openDocument,
  showLoading,
  hideLoading,
  preload,
  downloadFile,
  setClipboardData,
} from '@apps/mobile-services/utils/taro'
import { View, ScrollView, Text, Icons, Toast, Image } from '@apps/mobile-ui'
import Router from '@/utils/router'
import cx from 'classnames'
import Cell from '@/components/Cell'
import ContractProduct from '../../components/contractProduct'
import doc from '@/assets/images/Doc.svg'
import pdf from '@/assets/images/PDF.svg'
import excel from '@/assets/images/Excel.svg'
import { useSafeArea } from '@apps/mobile-services'
import {
  getContractMobileManageGetDetail,
  GetContractMobileManageGetDetailResponse,
  postContractMobileManageCreateSubmit,
  postContractMobileManageGetPurchaseById,
} from '@apps/apis'
import PaymentSchedule from '../../components/paymentSchedule'
import MaterialPopup from '../../components/materialPopup'
import PurchasePopup from '../../components/purchasePop'
import styles from './index.module.scss'
import CollapseCard from '@/components/CollapseCard'
import PageLayout from '@/components/PageLayout'
import NavBar from '@/components/NavBar'

const RequisitionDetail: React.FC = () => {
  const params = getCurrentInstance().preloadData as any
  const { id, refresh, contractType } = params
  const [dataSoucre, setDataSoucre] = useState<GetContractMobileManageGetDetailResponse>()
  const [showMore, setShowMore] = useState<boolean>(false)
  const [showPayMore, setShowPaayMore] = useState<boolean>(false)
  const [materialVisible, setMaterialVisible] = useState<boolean>(false)
  const [materialData, setMaterialData] = useState<any>({})
  const { safeBottomHeight } = useSafeArea()

  const [purchaseData, setPurchaseData] = useState<any>([])
  const [PurchaseVisible, setPurchaseVisible] = useState<boolean>(false)

  const [barTitle, setBarTitle] = useState<string>('')

  /* 头部标题 */
  const scrollView = (evt) => {
    const contentOffsetY: number = evt.detail.scrollTop
    if (Math.round(contentOffsetY) >= 45) {
      setNavigationBarTitle({ title: dataSoucre?.basics?.innerStatusName || '' })
      setBarTitle(dataSoucre?.basics?.innerStatusName || '')
    } else {
      setNavigationBarTitle({ title: '' })
      setBarTitle('')
    }
  }

  const clipboard = (dataText: any) => {
    setClipboardData({
      data: dataText,
      success: () => {
        Toast.show({ title: '内容复制成功', icon: 'none' })
      },
    })
  }

  const getData = () => {
    getContractMobileManageGetDetail({ contractId: id } as any).then((res) => {
      if (res.code !== 1000) {
        Toast.show({ title: res.message, icon: 'none' })
        return
      }
      setDataSoucre(res.data)
    })
  }

  useEffect(() => {
    getData()
  }, [])

  const handleButton = useMemo(() => {
    if (!contractType || !dataSoucre?.basics) return {}
    if (dataSoucre.basics.outerStatus == 9) {
      return {}
    }
    if (
      contractType == 'search' &&
      dataSoucre.basics.outerStatus != 7 &&
      dataSoucre.basics.outerStatus != 9 &&
      dataSoucre.basics.outerStatus != 8
    ) {
      return {
        type: 'search',
        typeText: '合同查询',
        text: '作废',
        title: '合同作废',
        plceholder: '点击输入作废的原因',
      }
    } else {
      if (dataSoucre.basics.innerStatus == 21) {
        return {
          type: 'creatSubmit',
          typeText: '待提交审核合同创建',
          text: '提交审核',
          title: '',
          plceholder: '',
        }
      } else if (
        dataSoucre.basics.outerStatus == 4 &&
        (dataSoucre.basics.innerStatus == 4 || dataSoucre.basics.innerStatus == 6 || dataSoucre.basics.innerStatus == 8)
      ) {
        return {
          type: 'sign',
          typeText: '待确认合同签订',
          text: '确认合同签订',
          title: '确认合同签订',
          plceholder: '点击输入原因,最长120个字符，60个汉字',
        }
      } else {
        if (dataSoucre.basics.innerStatus == 22) {
          return {
            type: 'creatExamineOne',
            typeText: '待审核合同创建（一级）',
            buttonStyle: 'audit',
          }
        }
        if (dataSoucre.basics.innerStatus == 24) {
          return {
            type: 'creatExamineTwo',
            typeText: '待审核合同创建（二级）',
            buttonStyle: 'audit',
          }
        }
        if (dataSoucre.basics.innerStatus == 26) {
          return {
            type: 'creat',
            typeText: '待确认合同创建',
            buttonStyle: 'audit',
          }
        }
        if (dataSoucre.basics.innerStatus == 3) {
          return {
            type: 'signExamine',
            typeText: '待提交审核合同签订',
            buttonStyle: 'audit',
          }
        }
        if (dataSoucre.basics.innerStatus == 5) {
          return {
            type: 'signExamineOne',
            typeText: '待审核合同签订（一级）',
            buttonStyle: 'audit',
          }
        }
        if (dataSoucre.basics.innerStatus == 7) {
          return {
            type: 'signExamineTwo',
            typeText: '待审核合同签订（二级）',
            buttonStyle: 'audit',
          }
        }
      }
    }
    return {}
  }, [dataSoucre])

  const _productList = useMemo(() => {
    const _list = dataSoucre?.materialList
    if (_list) {
      let _toList = showMore ? dataSoucre?.materialList : []
      if (!showMore) {
        for (let i = 0; i < 3; i++) {
          if (_list[i]) {
            _toList.push(_list[i])
          } else {
            break
          }
        }
      }
      return _toList
    }
    return []
  }, [dataSoucre, showMore])

  const _payPlanList = useMemo(() => {
    const _list = dataSoucre?.payPlanList
    if (_list) {
      let _toList = showPayMore ? dataSoucre?.payPlanList : []
      if (!showPayMore) {
        for (let i = 0; i < 3; i++) {
          if (_list[i]) {
            _toList.push(_list[i])
          } else {
            break
          }
        }
      }
      return _toList
    }
    return []
  }, [dataSoucre, showPayMore])

  const handleAuditLayout = (flag?: boolean) => {
    if (handleButton?.type == 'creatSubmit') {
      postContractMobileManageCreateSubmit({ contractId: id } as any).then((res) => {
        if (res.code === 1000) {
          Toast.show({ title: res.message, icon: 'none' })
          setTimeout(() => {
            Router.navigateBack({
              delta: 1,
              success: () => {
                refresh()
              },
            })
          }, 200)
        } else {
          Toast.show({ title: res.message, icon: 'none' })
        }
      })
      return
    }

    let title = flag ? '审核不通过原因' : '审核通过原因'
    let plceholder = flag ? '点击输入不通过的原因' : '点击输入通过的原因'

    const _params: any = {
      id: id,
      reasonPlacehoder: handleButton?.buttonStyle == 'audit' ? plceholder : handleButton?.plceholder,
      title: handleButton?.buttonStyle == 'audit' ? title : handleButton?.title,
      contractType: handleButton?.type,
      buttonStyle: handleButton?.buttonStyle,
      agree: flag ? 0 : 1,
      refresh,
    }
    preload(_params)
    Router.navigateTo('contract/contractAudit')
  }

  const handleShowMore = () => {
    setShowMore(!showMore)
  }

  const handleShowMaterial = (item: any) => {
    setMaterialData(item)
    setMaterialVisible(true)
  }

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

  const handleOpenDocument = (url) => {
    if (!url) return
    downloadFile({
      url: url,
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

  const handlePurchaseClick = (item) => {
    showLoading()
    postContractMobileManageGetPurchaseById({
      purchaseRequisitionIds: item?.purchaseRequisitionIds,
      prpIds: item?.prpIds,
    } as any).then((res) => {
      if (res.code !== 1000) {
        Toast.show({ title: res.message, icon: 'none' })
        hideLoading()
        return
      }
      hideLoading()
      setPurchaseData({ list: res.data, materielName: item.materielName, materielNo: item.materielNo })
      setPurchaseVisible(true)
    })
  }

  return (
    <View className={styles['container']} style={handleButton?.type ? {} : { paddingBottom: 0 }}>
      <PageLayout
        style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
        renderHeader={
          <>
            <NavBar title={barTitle} titleColor="#fff" customStyle={'background: #00A98F;'} backIconColor="#fff" />
          </>
        }
      >
        <View className={cx(styles['scrollView-outer'], !handleButton?.type ? styles['paddingBottomHide'] : '')}>
          <ScrollView onScroll={scrollView} className={styles['scrollView']}>
            <View className={styles['scrollView-box']}>
              <View className={styles['scrollView-box-status']}>
                <View className={styles['scrollView-box-status-line']}>
                  <Text className={styles['scrollView-box-status-line-text']}>
                    {dataSoucre?.basics?.innerStatusName}
                  </Text>
                  <Icons name="ChevronRight" size={14} color="#FFFFFF" />
                </View>
              </View>
              {/* 内容 */}
              <View className={styles['scrollView-box-content']}>
                <View className={styles['productInfo']}>
                  <View className={styles['productInfoTitle']}>
                    <View className={styles['docLine']} />
                    <Text className={styles['productName']}>{dataSoucre?.basics?.contractAbstract}</Text>
                  </View>
                  <View className={styles['productInfoNo']}>
                    <Text className={styles['productNo']}>合同编号：{dataSoucre?.basics?.contractNo}</Text>
                    {/* <View>
                      <Text onClick={() => clipboard(dataSoucre?.basics?.contractNo)} className={styles['textCopyStyle']}>复制</Text>
                    </View> */}
                  </View>
                </View>
                {/* 基本信息 */}
                <CollapseCard
                  customContentStyle={{
                    padding: 0,
                  }}
                  className={styles['customStyle']}
                  title="基本信息"
                >
                  <Cell>
                    {/* <Cell.Item
                      title='合同编号'
                      value={
                        <View className={styles['customStyle-box']}>
                          <Text className={styles['customStyle-value']}>{dataSoucre?.basics?.contractNo}</Text>
                          <View className={styles['customStyle-copy']} onClick={() => clipboard(dataSoucre?.basics?.contractNo)}>
                            <Text className={styles['customStyle-copy-text']}>复制</Text>
                          </View>
                        </View>
                      }
                    /> */}
                    <Cell.Item title="合同编号" value={dataSoucre?.basics?.contractNo} />
                    <Cell.Item title="外部状态" value={dataSoucre?.basics?.outerStatusName} />
                    {/* <Cell.Item
                      title='内部状态'
                      value={dataSoucre?.basics?.innerStatusName}
                    /> */}
                    <Cell.Item title="合同摘要" value={dataSoucre?.basics?.contractAbstract} />
                    <Cell.Item title="来源类型" value={dataSoucre?.basics?.sourceTypeName} />
                    <Cell.Item
                      title="合同有效期"
                      value={dataSoucre?.basics?.startTime + ' 至 ' + dataSoucre?.basics?.endTime}
                    />
                  </Cell>
                </CollapseCard>

                {/* 合同关联信息 */}
                <CollapseCard
                  customContentStyle={{
                    padding: 0,
                  }}
                  className={styles['customStyle']}
                  title="合同关联信息"
                >
                  <Cell>
                    <Cell.Item title="对应单据" value={dataSoucre?.basics?.sourceNo} />
                    <Cell.Item title="供应商" value={dataSoucre?.basics?.partyBName} />
                    <Cell.Item title="币别" value={dataSoucre?.basics?.currencyTypeName} />
                    <Cell.Item title="合同金额" value={dataSoucre?.basics?.totalAmount} />
                  </Cell>
                </CollapseCard>

                {/* 合同采购物料 */}
                <CollapseCard
                  customContentStyle={{
                    padding: 0,
                  }}
                  className={styles['customStyle']}
                  title="采购物料"
                >
                  {_productList.map((item, index) => (
                    <ContractProduct data={item} key={item.id * index} onClick={handleShowMaterial} />
                  ))}
                  {dataSoucre?.materialList && dataSoucre?.materialList.length > 3 && (
                    <View className={styles['productItem-showMore']} onClick={handleShowMore}>
                      <Text className={styles['productItem-showMore-text']}>{showMore ? '收起' : '展开更多'}</Text>
                    </View>
                  )}
                  <Text className={styles['product-row']}>
                    总金额：<Text className={styles['product-row-amount']}>{dataSoucre?.basics?.totalAmount}</Text>
                  </Text>
                </CollapseCard>

                {/* 合同付款计划 */}

                <CollapseCard
                  customContentStyle={{
                    padding: 0,
                  }}
                  className={styles['customStyle']}
                  title="付款计划"
                >
                  {_payPlanList.map((item, index) => (
                    <PaymentSchedule data={item} key={item.id * index} index={index + 1} />
                  ))}
                  {dataSoucre?.payPlanList && dataSoucre?.payPlanList.length > 3 && (
                    <View className={styles['productItem-showMore']} onClick={() => setShowPaayMore(!showPayMore)}>
                      <Text className={styles['productItem-showMore-text']}>{showMore ? '收起' : '展开更多'}</Text>
                    </View>
                  )}
                </CollapseCard>

                {/* 附件 */}
                <CollapseCard
                  customContentStyle={{
                    padding: 0,
                  }}
                  className={styles['customStyle']}
                  title="合同信息"
                  extra={
                    dataSoucre?.contractText?.contractName ? undefined : (
                      <Text className={styles['contractText']}>不使用电子合同</Text>
                    )
                  }
                >
                  {dataSoucre?.contractText?.contractName ? (
                    <View
                      className={styles['contract']}
                      onClick={() => handleOpenDocument(dataSoucre?.contractText.contractUrl)}
                    >
                      <Image
                        src={handleContractType(dataSoucre?.contractText?.contractName)}
                        className={styles['img']}
                      />
                      <Text>{dataSoucre?.contractText.contractName}</Text>
                    </View>
                  ) : null}
                </CollapseCard>
              </View>
            </View>
          </ScrollView>
          {handleButton?.type ? (
            <>
              <View
                className={styles['scrollView-outer-fixButton']}
                style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
              >
                <View className={styles['scrollView-outer-fixButton-btnBox']}>
                  {handleButton?.buttonStyle == 'audit' && (
                    <View
                      className={cx(
                        styles['scrollView-outer-fixButton-btnBox-btn'],
                        styles['scrollView-outer-fixButton-btnBox-btn__cancel'],
                      )}
                      onClick={() => {
                        handleAuditLayout(true)
                      }}
                    >
                      <Text
                        className={cx(
                          styles['scrollView-outer-fixButton-btnBox-btn-text'],
                          styles['scrollView-outer-fixButton-btnBox-btn__cancel-text'],
                        )}
                      >
                        审核不通过
                      </Text>
                    </View>
                  )}
                  <View
                    className={styles['scrollView-outer-fixButton-btnBox-btn']}
                    onClick={() => {
                      handleAuditLayout()
                    }}
                  >
                    <Text className={styles['scrollView-outer-fixButton-btnBox-btn-text']}>
                      {handleButton?.buttonStyle == 'audit' ? '审核通过' : handleButton?.text}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          ) : null}

          <MaterialPopup
            visible={materialVisible}
            sourceType={dataSoucre?.basics?.sourceType || ''}
            onClose={() => {
              setMaterialVisible(false)
            }}
            handlePurchaseClick={(item) => handlePurchaseClick(item)}
            materialData={materialData}
          />

          <PurchasePopup
            visible={PurchaseVisible}
            onClose={() => {
              setPurchaseVisible(false)
            }}
            purchaseData={purchaseData}
          />
        </View>
      </PageLayout>
    </View>
  )
}
export default RequisitionDetail
