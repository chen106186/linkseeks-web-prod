import {
  getProductCommodityGetShop,
  getProductCustomerGetCustomerCategoryTree,
  getProductSelectGetSelectBrand,
  postProductCommodityApplyCheckCommodity,
  postProductCommodityCopyCommodity,
  postProductCommodityDeleteBatchCommodity,
  postProductCommodityGetShopBatch,
  postProductCommodityDraftDeleteCommodityDraftBatch,
  postProductCommodityDeleteCommodityByImportBath,
  getProductCommodityGetCommodityImportBath,
  postProductCommodityExportCommodityQrCode,
  postProductCommodityExportCommoditySkuByCommodityIdList,
  postProductCommodityOffPublishCommodityBatch,
  postProductCommodityOffPublishCommodity,
  postProductCommodityPublishCommodityBatch,
  postProductCommodityPublishCommodity,
  postProductCommodityGetCommodityIsExistStock,
  postProductCommodityGetCommoditySkuIdList,
  postOrderCommonProductProcessFind,
  postProductCommodityApplyCheckBatchCommodity,
  postProductCommodityArchiveCommodity,
} from '@apps/apis'
import { EyeAuthButton, ImageBox, RecordColumns } from '@apps/components'
import { useRequestApi } from '@linkseeks/hooks'
import { useIntl } from '@linkseeks/i18n'
import { useMemo, useRef } from 'react'
import { CommodityPriceEnum, priceTypeLabel, productStatusColor, productStatusLabel } from '../constant'
import { Modal, message } from '@linkseeks/ui'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { downFileByBuffer } from '@/utils'
import useMemberShop from '@/hooks/useMemberShop'
import { useWebIntl } from '@apps/locales'
import { GuideMenu } from '../components/putawayGuide'
import { useProduct } from './context'

const { confirm } = Modal

// 表格每一行的操作按钮事件
export const useControl = () => {
  const intl = useIntl()
  const {
    setUpId,
    setDownSelModal,
    setUpModal,
    setUpSelModal,
    mainTableRef,
    importProductTableRef,
    setIsUp,
    setUpDownModal,
    setCurrentOptionRow,
    setShopsOption,
    upForm,
    refDraft,
    setImportModal,
    setModalStep,
    setExceptionCheck,
    exceptionContent,
    setExceptionContent,
    ref,
    loading,
    setLoading,
    deleteBatchModal,
    setDeleteBatchModal,
    importBathValue,
    setImportBathValue,
    importBathLoading,
    setImportBathLoading,
    importBathData,
    setImportBathData,
    upperRef,
    exportLoading,
    setExportLoading,
    exportQrcodeModal,
    setExportQrcodeModal,
    exportVisible,
    setExportVisible,
    isBatch,
    setIsBatch,
    currentCtrlRef,
    isDisabledOKbtn,
    setIsDisabledOKbtn,
    giudeVisible,
    setGiudeVisible,
    shopIdRef,
    shopsOption,
    currentOptionRow,
    isUp,
    giudeStep,
    setGiudeStep,
    inconformityProductIds,
    setInconformityProductIds,
    previewUpperTableRef,
    productDataRef,
  } = useProduct()
  const { getMemberShopInfo } = useMemberShop()
  const translate = useWebIntl()

  const clickCopy = (record) => {
    const { id } = record
    if (id) {
      confirm({
        title: intl.formatMessage({ id: 'commodity.products.clickCopy.title' }),
        icon: <ExclamationCircleOutlined />,
        onOk() {
          postProductCommodityCopyCommodity({ id: id }).then((res) => {
            if (res.code === 1000) {
              mainTableRef.current.reload()
            }
          })
        },
        onCancel() {
          console.log('Cancel')
        },
        okText: intl.formatMessage({ id: 'commodity.products.clickCopy.okText' }),
        cancelText: intl.formatMessage({ id: 'commodity.products.clickCopy.cancelText' }),
      })
    }
  }

  const clickSubmitCheck = (record) => {
    const { id } = record
    if (id)
      postProductCommodityApplyCheckCommodity({ id: id }).then((res) => {
        if (res.code === 1000) mainTableRef.current.reload()
      })
  }

  const clickModify = (id: number) => {
    history.push(`/commodityAbility/commodity/products/edit?id=${id}`)
  }

  const handleBatchDelete = (ids: number[] = [], param?: boolean) => {
    if (ids.length) {
      if (param) {
        confirm({
          title: intl.formatMessage({ id: 'commodity.products.handleBatchDelete.title' }),
          icon: <ExclamationCircleOutlined />,
          onOk() {
            postProductCommodityDeleteBatchCommodity({ idList: ids }).then((res) => {
              if (res.code === 1000) {
                mainTableRef.current.reload()
                mainTableRef.current.setSelectionKeys([])
                mainTableRef.current.setSelectionItems([])
              }
            })
          },
          okType: 'danger',
          onCancel() {
            console.log('Cancel')
          },
          okText: intl.formatMessage({ id: 'commodity.products.handleBatchDelete.okText' }),
          cancelText: intl.formatMessage({ id: 'commodity.products.handleBatchDelete.cancelText' }),
        })
      } else {
        postProductCommodityDeleteBatchCommodity({ idList: ids }).then((res) => {
          if (res.code === 1000) {
            mainTableRef.current.reload()
            mainTableRef.current.setSelectionKeys([])
            mainTableRef.current.setSelectionItems([])
          }
        })
      }
    } else {
      message.error(intl.formatMessage({ id: 'commodity.products.handleBatchDelete.error' }))
    }
  }

  const confirmDelete = (paramId: number) => {
    confirm({
      title: intl.formatMessage({ id: 'commodity.products.confirmDelete.title' }),
      icon: <ExclamationCircleOutlined />,
      okText: intl.formatMessage({ id: 'commodity.products.confirmDelete.okText' }),
      okType: 'danger',
      cancelText: intl.formatMessage({ id: 'commodity.products.confirmDelete.cancelText' }),
      onOk() {
        handleBatchDelete([paramId])
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const clickUp = (param: number, record: any) => {
    // param: 0 下架  1上架 record.id为null批量上架
    setCurrentOptionRow(record)
    const fn = record?.id ? getProductCommodityGetShop : postProductCommodityGetShopBatch
    // @ts-ignore
    fn(record?.id ? { id: record.id } : { idList: mainTableRef.current.selectionKeys }, { ctlType: 'none' }).then(
      ({ data }) => {
        setShopsOption(data.sort((a, b) => a.shopId - b.shopId))
        let initValue = {}
        data.forEach((item) => {
          initValue[item.shopId] = item.isCheck
        })
        upForm.setFieldsValue({ ...initValue })
      },
    )
    setIsUp(param)
    setUpDownModal(true)
  }

  const previewUpper = (upId) => {
    history.push(`/commodityAbility/commodity/products/detail?id=${upId}`)
  }

  const upModalFn = (id: number) => {
    previewUpperTableRef.current.setVisible(true)
    productDataRef.current.row = {
      id,
    }
  }

  const clickDraftModify = (record) => {
    history.push(`/commodityAbility/commodity/products/draft?isDraft=1&id=${record['id']}`)
  }

  const clickDraftDelete = (record) => {
    confirm({
      title: intl.formatMessage({ id: 'commodity.products.confirmDelete.title' }),
      icon: <ExclamationCircleOutlined />,
      okText: intl.formatMessage({ id: 'commodity.products.confirmDelete.okText' }),
      okType: 'danger',
      cancelText: intl.formatMessage({ id: 'commodity.products.confirmDelete.cancelText' }),
      onOk() {
        postProductCommodityDraftDeleteCommodityDraftBatch({ idList: [record['id']] }).then(({ code }) => {
          if (code === 1000) {
            refDraft.current.reload()
          }
        })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const handleCancel = () => {
    setImportModal(false)
  }

  const handleOkDeleteBatch = () => {
    if (importBathValue) {
      setLoading(true)
      postProductCommodityDeleteCommodityByImportBath({ commodityImportBath: importBathValue }).then(({ code }) => {
        if (code === 1000) {
          setLoading(false)
          mainTableRef.current.reload()
        }
        setLoading(false)
        setDeleteBatchModal(false)
      })
    }
  }

  const handleCancelDelete = () => {
    setDeleteBatchModal(false)
  }

  const handleImportBathChange = (value, options) => {
    setImportBathValue(value)
  }

  const handleImportBathSearch = (value?: string) => {
    setImportBathLoading(true)
    getProductCommodityGetCommodityImportBath({ name: value || '' })
      .then((res) => {
        if (res.code === 1000 && res.data.length > 0) {
          setImportBathData(
            res.data.map((item) => ({
              label: item,
              value: item,
            })),
          )
        }
      })
      .finally(() => setImportBathLoading(false))
  }

  const handleUpperCommodity = () => {
    importProductTableRef.current.setVisible(true)
  }

  const handleExportQrcode = () => {
    let a: any = document.createElement('a')
    document.body.appendChild(a)
    a.style = 'display: none'
    setExportLoading(true)
    const selectedRowKeys = mainTableRef.current.selectionKeys
    if (selectedRowKeys.length > 1000) {
      return message.error(intl.formatMessage({ id: 'commodity.products.schema.fastSchema.zuiduodaochuyiqiange' }))
    }
    postProductCommodityExportCommodityQrCode(
      { idList: selectedRowKeys },
      { responseType: 'blob', getResponse: true },
    ).then((res: any) => {
      const { response } = res
      if (response.status == 200) {
        const filename = response.headers.get('content-disposition').split('=')[1]
        const blob = new Blob([response.data], { type: 'application/x-zip-compressed' })
        downFileByBuffer(blob, filename)
        setExportLoading(false)
        message.success(intl.formatMessage({ id: 'commodity.products.schema.fastSchema.daochuchenggong' }))
        setExportQrcodeModal(false)
        mainTableRef.current.setSelectionKeys([])
      }
    })
  }

  const handleExport = () => {
    const selectedRowKeys = mainTableRef.current.selectionKeys
    let a: any = document.createElement('a')
    document.body.appendChild(a)
    a.style = 'display: none'
    setExportLoading(true)
    if (selectedRowKeys.length > 1000) {
      return message.error(intl.formatMessage({ id: 'commodity.products.schema.fastSchema.zuiduodaochuyiqiange' }))
    }
    postProductCommodityExportCommoditySkuByCommodityIdList(
      { idList: selectedRowKeys },
      { responseType: 'blob', getResponse: true },
    ).then((res: any) => {
      const { response } = res
      if (response.status == 200) {
        const filename = response.headers.get('content-disposition').split('=')[1]
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
        downFileByBuffer(blob, filename)
        message.success(intl.formatMessage({ id: 'commodity.products.schema.fastSchema.daochuchenggong' }))
        setExportVisible(false)
        setExportLoading(false)
        mainTableRef.current.setSelectionKeys([])
      }
    })
  }

  const handleExportAll = () => {
    // TODO 添加导出全部表示
    postProductCommodityExportCommoditySkuByCommodityIdList(
      { exportAll: true },
      { responseType: 'blob', getResponse: true },
    ).then((res: any) => {
      const { response } = res
      if (response.status == 200) {
        const filename = response.headers.get('content-disposition').split('=')[1]
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
        downFileByBuffer(blob, filename)
        message.success(intl.formatMessage({ id: 'commodity.products.schema.fastSchema.daochuchenggong' }))
        setExportVisible(false)
        setExportLoading(false)
        mainTableRef.current.setSelectionKeys([])
      }
    })
  }

  const handleBatch = (type: string) => {
    // 判断 批量操作的商品类型相同、并且满足可上（审核通过，下架）下架（）的状态
    const rows = mainTableRef.current.getSelectionItems()
    const selectedRowKeys = mainTableRef.current.selectionKeys
    const canUp = rows.every((item) => item.status === 4 || item.status === 6)
    const canDown = !rows.some((item) => item.status !== 5)
    const isSamilar = rows.every((item) => item.priceType === rows[0]['priceType'])
    if (!rows.length) {
      return message.error(intl.formatMessage({ id: 'commodity.products.handleBatch.error.1' }))
    }
    if (!isSamilar) {
      return message.error(intl.formatMessage({ id: 'commodity.products.handleBatch.error.2' }))
    }
    if ((type === '3' && canUp) || (type === '4' && canDown)) {
      setIsBatch(true)
      confirm({
        title: `${
          type === '3'
            ? intl.formatMessage({ id: 'commodity.products.handleBatch.title.1' })
            : intl.formatMessage({ id: 'commodity.products.handleBatch.title.2' })
        }`,
        icon: <ExclamationCircleOutlined />,
        onOk() {
          if (type === '3') {
            clickUp(1, null)
          } else {
            postProductCommodityOffPublishCommodityBatch({ idList: selectedRowKeys }).then((res) => {
              mainTableRef.current.clearSelection()
              mainTableRef.current.reload()
              currentCtrlRef.current?.setSelectedRowKeys([])
              currentCtrlRef.current?.setSelectRow([])
            })
          }
        },
        okType: type === '3' ? 'primary' : 'danger',
        onCancel() {
          console.log('Cancel')
        },
        okText: intl.formatMessage({ id: 'commodity.products.handleBatch.okText' }),
        cancelText: intl.formatMessage({ id: 'commodity.products.handleBatch.cancelText' }),
      })
    } else {
      setIsBatch(false)
      message.error(
        type === '3'
          ? intl.formatMessage({ id: 'commodity.products.handleBatch.error.3' })
          : intl.formatMessage({ id: 'commodity.products.handleBatch.error.4' }),
      )
    }
  }

  const handleMenuClick = (e) => {
    const selectedRowKeys = mainTableRef.current.selectionKeys
    // 1 批量删除；2 删除导入批次 0 导入上游；3 批量上架；4 批量下架 5导出商品二维码 6导出
    if (e.key === '1') {
      handleBatchDelete(selectedRowKeys, true)
    } else if (e.key === '2') {
      console.log('删除导入批次')
      setDeleteBatchModal(true)
    } else if (e.key === '0') {
      handleUpperCommodity()
    } else if (e.key === '3' || e.key === '4') {
      handleBatch(e.key)
    } else if (e.key === '5') {
      if (!mainTableRef.current.getSelectionItems().every((item) => item.status === 5)) {
        mainTableRef.current.clearSelection()
        return message.error(
          intl.formatMessage({ id: 'commodity.products.schema.fastSchema.qingxuanzeshangjiashangpin' }),
        )
      }
      selectedRowKeys.length
        ? setExportQrcodeModal(true)
        : message.error(intl.formatMessage({ id: 'commodity.products.handleBatchDelete.error' }))
    } else if (e.key === '6') {
      selectedRowKeys.length
        ? setExportVisible(true)
        : message.error(intl.formatMessage({ id: 'commodity.products.handleBatchDelete.error' }))
    } else if (e.key === '7') {
      setDownSelModal(true)
    } else if (e.key === '8') {
      Modal.confirm({
        title: translate('web.resource.commodity.shifouquerenyaodaochuquanbushangpin'),
        centered: true,
        onOk: () => {
          handleExportAll()
        },
      })
    } else if (e.key === '9') {
      handleBatchSubmitAudit()
    }
  }

  const handleBatchSubmitAudit = () => {
    const selectItems = mainTableRef.current.getSelectionItems()
    if (!selectItems.length) {
      message.error(translate('web.resource.commodity.qingxuantijiaoshenheshangpin'))
      return
    }

    if (selectItems.some((item) => item.status !== 1)) {
      message.error(translate('web.resource.commodity.qingxuanzedaitijiaoshenheshangpin'))
      return
    }

    Modal.confirm({
      title: translate('web.resource.deal.shifoutijiaoshenhe'),
      centered: true,
      onOk: () => {
        postProductCommodityApplyCheckBatchCommodity({
          idList: selectItems.map((item) => item.id),
        }).then((res) => {
          if (res.code === 1000) {
            mainTableRef.current.reload()
            mainTableRef.current.clearSelection()
          }
        })
      },
    })
  }

  const handleCancelUp = () => {
    upForm.resetFields()
    setUpDownModal(false)
  }

  // 执行商品上架逻辑
  const executePutaway = (params) => {
    getMemberShopInfo().then((data) => {
      const fn = isBatch ? postProductCommodityPublishCommodityBatch : postProductCommodityPublishCommodity
      const shopId = shopIdRef.current
      // @ts-ignore
      fn(
        isBatch
          ? {
              storeId: data ? data['id'] : null,
              storeName: data ? data['name'] : null,
              storeLogo: data ? data['logo'] : null,
              shopList: params.shopList,
              idList: mainTableRef.current.selectionKeys,
            }
          : {
              ...params,
              storeId: data ? data['id'] : null,
              storeName: data ? data['name'] : null,
              storeLogo: data ? data['logo'] : null,
            },
      ).then((res) => {
        if (res.code === 1000) {
          setGiudeVisible(false)
          mainTableRef.current.reload()
          mainTableRef.current.clearSelection()
          setIsDisabledOKbtn(false)
        }
      })
    })
  }

  const judgeStop = async (values) => {
    // 全部是自营商城 无需判断
    if (values.every((item) => item.isSelfShop)) {
      return true
    }
    // 全部是积分商城 无需判断
    if (values.every((item) => item.type === 2)) {
      return true
    }
    // 判断上架之前是否有店铺
    const data = await getMemberShopInfo()
    if (data) {
      // setShopId(data)
      shopIdRef.current = data
      return true
    } else {
      return false
    }
  }

  const judgeStore = async (values) => {
    const productIds = [...values]
    const { code, data } = await postProductCommodityGetCommodityIsExistStock(
      { idList: productIds },
      { ctlType: 'none' },
    )
    if (code === 1000 && data.length > 0) {
      setInconformityProductIds(data)
      return false
    } else if (code === 1000) {
      return true
    }
  }

  const judgeProcess = async (values, shops) => {
    // 查询商品skuId数组
    const res = await postProductCommodityGetCommoditySkuIdList({ idList: values }, { ctlType: 'none' })
    const { data: skuids, code } = res
    if (code === 1000) {
      const products: { productId: number; skuId: number; crossBorder: any }[] = []
      skuids.forEach((item) => {
        item.skuIdList.forEach((_item) => {
          products.push({
            productId: item.commodityId,
            skuId: _item,
            crossBorder: isBatch
              ? mainTableRef.current.getSelectionItems().filter((i) => i.id === item.commodityId)[0]['isCrossBorder']
              : currentOptionRow['isCrossBorder'],
          })
        })
      })
      const params = {
        shopIds: shops.map((item) => item.shopId),
        products,
        shopType: shops.map((item) => item.type)[0],
      }
      const { data, code } = await postOrderCommonProductProcessFind(params, { ctlType: 'none' })
      if (code === 1000 && data.length > 0) {
        setInconformityProductIds(data.map((item) => item.productId))
        return false
      } else if (code === 1000) {
        return true
      }
    }
  }

  // 商品上架引导步骤判断
  const handlePutwayGuide = async (params) => {
    console.log(params, 'handlePutwayGuide')
    const checkShops = [...params.upShops]
    // 1. 判断是否有店铺
    const hasShop = await judgeStop(checkShops)
    if (hasShop) {
      const params = isBatch ? mainTableRef.current.selectionKeys : [currentOptionRow.id]
      // 2. 判断是否库存
      const hasStore = await judgeStore(params)
      if (hasStore) {
        // 3. 判断是否配置流程
        const hasProcess = await judgeProcess(params, checkShops)
        if (hasProcess) {
          // executePutaway()
          return true
        } else {
          setGiudeStep(GuideMenu.ConfigProcess)
        }
      } else {
        setGiudeStep(GuideMenu.ConfigStore)
      }
    } else {
      setGiudeStep(GuideMenu.CreateShop)
    }
  }

  const handleUp = (values) => {
    const upShops = shopsOption.filter((item) => values[item.shopId])
    setIsDisabledOKbtn(true)
    let params = {
      id: currentOptionRow?.id,
      shopList: upShops,
    }
    if (upShops.length > 0) {
      handlePutwayGuide({ upShops })
        .then((res) => {
          // 返回true时 全部验证通过
          if (res) {
            // 执行上架逻辑
            executePutaway(params)
            currentCtrlRef.current?.setSelectedRowKeys([])
            currentCtrlRef.current?.setSelectRow([])
          } else {
            // 弹框 上架引导
            setGiudeVisible(true)
          }
        })
        .finally(() => {
          setUpDownModal(false)
          setIsDisabledOKbtn(false)
        })
    } else {
      getMemberShopInfo().then((data) => {
        postProductCommodityOffPublishCommodity({
          ...params,
          storeId: data ? data['id'] : undefined,
          storeName: data ? data['name'] : undefined,
          storeLogo: data ? data['logo'] : undefined,
        }).then(() => {
          setUpDownModal(false)
          mainTableRef.current.reload()
          mainTableRef.current.clearSelection()
          setIsDisabledOKbtn(false)
        })
      })
    }
  }

  const handleGuideCancel = () => {
    setGiudeVisible(false)
    setUpDownModal(false)
  }

  const modalImportData = () => {
    setModalStep(0)
    setImportModal(false)
    mainTableRef.current.reload()
  }

  const exportErrorLog = () => {
    if (exceptionContent) {
      download_txt('log.txt', exceptionContent)
    }
    setModalStep(0)
    setImportModal(false)
  }

  const download_txt = (filename: string, content: string, contentType?: string) => {
    if (!contentType) contentType = 'application/octet-stream'
    var a = document.createElement('a')
    var blob = new Blob([content], { type: contentType })
    a.href = window.URL.createObjectURL(blob)
    a.download = filename
    a.click()
  }

  /** 归档 */
  const handleArchive = (id: number) => {
    Modal.confirm({
      centered: true,
      title: translate('web.resource.commodity.shangpinguidangbukehuifu'),
      onOk: () => {
        return new Promise((resolve) => {
          postProductCommodityArchiveCommodity({ id })
            .then((res) => {
              if (res.code === 1000) {
                mainTableRef.current.reload()
              }
            })
            .finally(() => {
              resolve(true)
            })
        })
      },
    })
  }

  return {
    clickCopy,
    clickSubmitCheck,
    clickModify,
    handleBatchDelete,
    confirmDelete,
    previewUpper,
    clickUp,
    upModalFn,
    clickDraftModify,
    clickDraftDelete,
    handleCancel,
    handleOkDeleteBatch,
    handleCancelDelete,
    handleImportBathChange,
    handleImportBathSearch,
    handleUpperCommodity,
    handleExportQrcode,
    handleExport,
    handleMenuClick,
    handleCancelUp,
    handleUp,
    handleGuideCancel,
    modalImportData,
    exportErrorLog,
    handleArchive,
  }
}
