import React, { useRef, useState } from 'react'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { getSchema } from '../common/searchTableSchema'
import { Button, Card, Cascader, message, Modal, Popconfirm, Space, Spin } from 'antd'
import { getColumn } from '../common/columns'
import { createFormActions } from '@apps/formily'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import type { GetProductMaterielGetToBeAddMaterielListRequest } from '@apps/apis'
import {
  getProductMaterielGetSubMaterielList,
  getProductMaterielGetToBeAddMaterielList,
  getProductMaterialProcessIsExistMaterialProcess,
  postProductMaterielDeleteBatchMateriel,
  postProductMaterielSubmit,
  getProductMaterielExportMaterielTemplate,
} from '@apps/apis'
import type { SearchParams } from '../materialQuery/view'
import { EMPTY, fetchBrand, fetchCategoryData, fetchTreeData, useAsyncCascader } from '../common/useGetTableSearchData'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { Link } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
import TableModal from '@/pages/customerAbility/components/TableModal'
import { purchaseSchema } from './schema/purchase'
import { useIntl } from '@linkseeks/i18n'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import type { DownloadFileResponseType } from '@/components/UploadModal'
import UploadModal from '@/components/UploadModal'

/**
 * 物料查询
 */
const formActions = createFormActions()
const CREATE_URL = '/commodityAbility/material/materialPendingAdd/add'

const MaterialQuery = (props) => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const ref_up = useRef<any>({})
  const schema = getSchema({ showStatus: false })
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState([])
  const [isLoading, setIsLoading] = useState([])

  const [selectRow, selectRowFns] = useRowSelectionTable({
    customKey: 'id',
  })

  const modalIns = useRef(null)

  const handleDelete = async (_row) => {
    if (isLoading.includes(_row.id)) {
      return
    }
    setDeleteLoading((prev) => prev.concat(_row.id))
    try {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { selectedRowKeys, selectRow } = selectRowFns
      const { code } = await postProductMaterielDeleteBatchMateriel({ idList: [_row.id] })
      if (code === 1000) {
        selectRowFns.setSelectedRowKeys(selectedRowKeys.filter((_item) => _item !== _row.id))
        selectRowFns.setSelectRow(selectRow.filter((_item) => _item.id !== _row.id))
        formActions.submit()
      }
    } finally {
      setDeleteLoading((prev) => prev.filter((_item) => _item !== _row.id))
    }
  }

  const handleJumpAddProcess = () => {
    modalIns.current?.destroy()
    history.push('/systemAbility/processManagement/materialManageProcess')
  }

  const handleSubmit = async (_row) => {
    if (deleteLoading.includes(_row.id)) {
      return
    }
    setIsLoading((prev) => prev.concat(_row.id))
    try {
      const materialGroupId = _row.materialGroup?.id ? { materialGroupId: _row.materialGroup?.id } : {}
      const processRes = await getProductMaterialProcessIsExistMaterialProcess({
        materialId: _row.id,
        processType: _row.interiorState === 1 ? `1` : `2`,
        ...materialGroupId,
      } as any)

      if (processRes.code !== 1000 || !processRes.data) {
        modalIns.current = Modal.warning({
          title: intl.formatMessage({
            id: 'material.pendingAdd.list.submit.tips',
            defaultMessage: '提交提醒',
          }),
          content: (
            <div>
              {intl.formatMessage({
                id: 'material.unconfig.process',
                defaultMessage: '当前还未创建审核工作流, 请在',
              })}
              <a onClick={handleJumpAddProcess}>
                {intl.formatMessage({
                  id: 'material.exam.rule.config',
                  defaultMessage: '物料审核流程规则配置',
                })}
              </a>
              {intl.formatMessage({
                id: 'material.unconfig.process.setting',
                defaultMessage: '设置',
              })}
            </div>
          ),
          onOk() {
            console.log('OK')
          },
        })
        return
      }
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { selectedRowKeys, selectRow } = selectRowFns
      const { code } = await postProductMaterielSubmit({ id: _row.id })
      if (code === 1000) {
        selectRowFns.setSelectedRowKeys(selectedRowKeys.filter((_item) => _item !== _row.id))
        selectRowFns.setSelectRow(selectRow.filter((_item) => _item.id !== _row.id))
        formActions.submit()
      }
    } catch (e) {
    } finally {
      setIsLoading((prev) => prev.filter((_item) => _item !== _row.id))
    }
  }
  const columns = getColumn({
    detailUrl: '/commodityAbility/material/materialPendingAdd/detail',
    extraColumn: [
      {
        title: intl.formatMessage({ id: 'material.operation', defaultMessage: '操作' }),
        render: (text, record) => {
          const isSubmitting = isLoading.includes(record.id)
          const isDeleting = deleteLoading.includes(record.id)
          return (
            <Space>
              <EditAuthButton>
                <Link to={`/commodityAbility/material/materialPendingAdd/edit?id=${record.id}`}>
                  {intl.formatMessage({
                    id: 'material.pendingAdd.list.edit',
                    defaultMessage: '修改',
                  })}
                </Link>
              </EditAuthButton>
              <AuthButton type="custom" code="delete">
                <Popconfirm
                  title={intl.formatMessage({
                    id: 'material.group.delete.tips',
                    defaultMessage: '确定要删除吗？',
                  })}
                  onConfirm={() => handleDelete(record)}
                  okText={intl.formatMessage({
                    id: 'material.group.delete.confirm',
                    defaultMessage: '是',
                  })}
                  cancelText={intl.formatMessage({
                    id: 'material.group.delete.cancel',
                    defaultMessage: '否',
                  })}
                >
                  <Spin spinning={isDeleting}>
                    <a>{intl.formatMessage({ id: 'material.group.delete', defaultMessage: '删除' })}</a>
                  </Spin>
                </Popconfirm>
              </AuthButton>
              <AuthButton type="custom" code="submit">
                <Spin spinning={isSubmitting}>
                  <a onClick={() => handleSubmit(record)}>
                    {intl.formatMessage({ id: 'material.submit', defaultMessage: '提交' })}
                  </a>
                </Spin>
              </AuthButton>
            </Space>
          )
        },
      },
    ],
  })

  const supplierColumns = [
    {
      title: intl.formatMessage({ id: 'material.supplier.name', defaultMessage: '供应商名称' }),
      dataIndex: 'memberName',
    },
    {
      title: intl.formatMessage({ id: 'material.name', defaultMessage: '物料名称' }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({ id: 'material.type', defaultMessage: '规格型号' }),
      dataIndex: 'type',
    },
    {
      title: intl.formatMessage({ id: 'material.category', defaultMessage: '品类' }),
      dataIndex: 'category',
      render: (text, record) => {
        return record.customerCategory?.name
      },
    },
    {
      title: intl.formatMessage({ id: 'material.brand', defaultMessage: '品牌' }),
      dataIndex: 'brand',
      render: (_text, record) => {
        return record.brand?.name
      },
    },
  ]

  const handleOpenModal = () => {
    setVisible(true)
  }

  const [importModal, setImportModal] = useState(false)
  const controllerBtns = () => {
    return (
      <Space>
        <AddAuthButton>
          <Link to={CREATE_URL}>
            <Button type="primary">
              {intl.formatMessage({ id: 'material.pendingAdd.add', defaultMessage: '新增' })}
            </Button>
          </Link>
        </AddAuthButton>
        <AuthButton type="custom" code="deleteBatch">
          <Button
            loading={loading}
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            onClick={handleBatchDelete}
          >
            {intl.formatMessage({
              id: 'material.pendingAdd.batchDelete',
              defaultMessage: '批量删除',
            })}
          </Button>
        </AuthButton>
        <Button style={{ margin: '0 16px' }} onClick={() => setImportModal(true)}>
          {intl.formatMessage({ id: 'commodity.products.controllerBtns.button.3' })}
        </Button>
        <AuthButton type="custom" code="good">
          <Button onClick={handleOpenModal}>
            {intl.formatMessage({
              id: 'material.pendingAdd.purchaseSelection',
              defaultMessage: '采购选品',
            })}
          </Button>
        </AuthButton>
      </Space>
    )
  }

  const handleBatchDelete = async () => {
    const selectedRowKeys = selectRowFns.selectedRowKeys
    if (selectedRowKeys.length === 0) {
      message.info(
        intl.formatMessage({
          id: 'material.unSelected.delete',
          defaultMessage: '请选择删除的物料',
        }),
      )
      return
    }
    setLoading(true)
    try {
      const { code } = await postProductMaterielDeleteBatchMateriel({ idList: selectedRowKeys })
      if (code === 1000) {
        selectRowFns.setSelectedRowKeys([])
        selectRowFns.setSelectRow([])
        ref.current.reloadCurrent()
      }
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (values: SearchParams) => {
    const { materialGroupId, customerCategoryId, ...rest } = values

    const formatMaterialGroupId =
      materialGroupId && materialGroupId.length > 0 ? { materialGroupId: materialGroupId?.pop() } : {}

    const formatCategoryId =
      customerCategoryId && customerCategoryId.length > 0 ? { customerCategoryId: customerCategoryId?.pop() } : {}

    const result = { ...rest, ...formatMaterialGroupId, ...formatCategoryId }
    ref.current.reload(result)
  }

  const fetchListData = async (params: GetProductMaterielGetToBeAddMaterielListRequest) => {
    try {
      const { data, code } = await getProductMaterielGetToBeAddMaterielList(params)
      if (code === 1000) {
        return data
      }
      return EMPTY
    } catch (e) {
      return EMPTY
    }
  }

  const handleFetchData = async (params: any) => {
    try {
      const { data, code } = await getProductMaterielGetSubMaterielList(params)
      if (code === 1000) {
        return data
      }
      return EMPTY
    } catch (e) {
      return EMPTY
    }
  }

  const handleOnOk = (_selectRow, selectedRowRecord) => {
    const target = selectedRowRecord[0]
    history.push('/commodityAbility/material/materialPendingAdd/add', {
      query: {
        type: 'sourceData',
      },
      dataSource: {
        code: target.code,
        memberId: target.memberId,
        memberName: target.memberName,
        memberRoleId: target.memberRoleId,
        memberRoleName: target.memberRoleName,
        goodsNo: target.code,
        unitId: target.unitId,
        name: target.name,
        goodsId: target.id,
        type: target.type,
        referenceBrand: target.brand?.name,
        goodsPic: target.goodsPic?.map((_item) => {
          return {
            name: _item,
            url: _item,
          }
        }),
      },
    })
  }

  const onClose = () => {
    ref.current.reload()
    setImportModal(false)
  }
  const fetchDownloadFile = async () => {
    const ret = await getProductMaterielExportMaterielTemplate(
      {},
      {
        responseType: 'blob',
        getResponse: true,
      },
    )
    return ret as unknown as DownloadFileResponseType
  }
  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
            // rowSelection: selectRow
            rowSelection: selectRow,
          }}
          keepAlive={false}
          columns={columns}
          currentRef={ref}
          fetchTableData={fetchListData}
          controlRender={
            <NiceForm
              components={{ controllerBtns, Cascader }}
              schema={schema}
              actions={formActions}
              onSubmit={handleSearch}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'code', FORM_FILTER_PATH)
                useAsyncCascader('materialGroupId', fetchTreeData)
                useAsyncCascader('customerCategoryId', fetchCategoryData)
                useAsyncSelect('brandId', fetchBrand, ['name', 'id'])
              }}
            />
          }
        />
      </Card>
      <TableModal
        modalType="Drawer"
        visible={visible}
        onClose={() => setVisible(false)}
        title={intl.formatMessage({
          id: 'material.supplier.material.select',
          defaultMessage: '采购选品',
        })}
        columns={supplierColumns}
        schema={purchaseSchema}
        onOk={handleOnOk}
        fetchData={handleFetchData}
        tableProps={{
          rowKey: (record) => `${record.memberId}_${record.roleId}_${record.id}`,
        }}
        components={{ Cascader }}
        effects={($, actions) => {
          useStateFilterSearchLinkageEffect($, actions, 'userName', FORM_FILTER_PATH)
          useAsyncCascader('categoryId', fetchCategoryData)
          useAsyncSelect('brandId', fetchBrand, ['name', 'id'])
        }}
        mode={'radio'}
        // value={checkedValue}
      />
      <UploadModal
        visible={importModal}
        onClose={onClose}
        fileTitle={'物料资料'}
        ref={ref_up}
        fetchDownloadFile={fetchDownloadFile}
        modalName={'物料导入'}
        uploadProps={{
          action: '/api/product/materiel/importMateriel',
        }}
        utf
        // mode={'radio'}
        // value={checkedValue}
      />
    </PageHeaderWrapper>
  )
}

export default MaterialQuery
