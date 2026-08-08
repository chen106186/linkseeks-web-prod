import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Button, Space } from 'antd'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import UpperProductModalTable from './components/upperProductModalTable'
import PutawayGuide from './components/putawayGuide'
import { ProductView, ProductSel } from './productModal'
import { ProductProvider, useProduct } from './services/context'
import { useProductList } from './services/useProductlist'
import { useControl } from './services/useControl'
import { useSearchButtons } from './services/useSearchButtons'
import { useTabsItems } from './services/useTabsItems'
import { useWebIntl } from '@apps/locales'
import DraftDrawerTable from './components/draftDrawerTable'
import ImportProductModal from './components/importProductModal'
import RemoveImportBatchModal from './components/removeImportBatchModal'
import ProductUpAndDownModal from './components/productUpAndDownModal'
import ExportProductModal from './components/exportProductModal'
import ExportSkuModal from './components/exportSkuModal'
import MemberProductModal from './components/memberProductModal'
import { BookmarkIcon, FolderIcon } from '@linkseeks/icons'
import { history } from '@linkseeks/router-manager'

const Products: React.FC<{}> = () => {
  const translate = useWebIntl()

  const {
    mainTableRef,
    giudeVisible,
    giudeStep,
    inconformityProductIds,
    uppId,
    upModal,
    setUpModal,
    upSelModal,
    setUpSelModal,
    downSelModal,
    setDownSelModal,
    setDraftDrawerVisible,
  } = useProduct()
  const { columns, fetchData } = useProductList()
  const { handleGuideCancel } = useControl()
  const { searchButtons } = useSearchButtons()

  const { tabsItems } = useTabsItems()
  return (
    <PageHeaderWrapper
      extra={
        <Space>
          <Button icon={<BookmarkIcon />} onClick={() => setDraftDrawerVisible(true)}>
            {translate('web.resource.commodity.caogaoxiang')}
          </Button>
          <Button icon={<FolderIcon />} onClick={() => history.push(`/commodityAbility/commodity/archive`)}>
            {translate('web.resource.commodity.guidangshangpin')}
          </Button>
        </Space>
      }
    >
      <StandardFormTable
        type="tabs"
        tabsKey="statusList"
        tabsItems={tabsItems}
        columns={columns}
        actionRef={mainTableRef}
        rowKey="id"
        isRowSelection
        tabsDefaultAll={false}
        searchButtons={searchButtons as any}
        autoScrollX
        request={(params) => fetchData(params)}
      />
      {/* 草稿箱抽屉 */}
      <DraftDrawerTable />

      {/* 导入弹窗 */}
      <ImportProductModal />

      {/* 删除导入批次弹窗 */}
      <RemoveImportBatchModal />

      {/* 商品上下架 */}
      <ProductUpAndDownModal />

      {/* 导出商品二维码 */}
      <ExportProductModal />

      {/* 查看上游商品 */}
      <MemberProductModal />
      {/* <ProductView visible={upModal} setVisible={setUpModal} productId={uppId} /> */}
      <ProductSel visible={upSelModal} setVisible={setUpSelModal} titleKey="upperMemberName" />
      <ProductSel visible={downSelModal} setVisible={setDownSelModal} titleKey="subMemberName" />
      {/* 选择上游商品 */}
      <UpperProductModalTable />
      {/* 商品上架引导 */}
      <PutawayGuide
        visible={giudeVisible}
        width={800}
        currentStep={giudeStep}
        data={inconformityProductIds}
        onCancel={handleGuideCancel}
      />
      {/* 导出SKU级商品 */}
      <ExportSkuModal />
    </PageHeaderWrapper>
  )
}

export default () => (
  <ProductProvider>
    <Products />
  </ProductProvider>
)
