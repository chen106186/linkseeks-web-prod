import React, { useState, useEffect } from 'react'
import { StandardFormTable } from '@apps/components'
import { getWebIntl } from '@apps/locales'
import { Modal, Form, message } from 'antd'
import copy from 'copy-to-clipboard'
import {
  getCommodityWebShopWebAll,
  getCommodityAdornTopicPageDelete,
  postCommodityAdornTopicPageUpdate,
  GetCommodityAdornTopicPagePageListResponseDetail,
  getCommodityWebStoreWebStoreList,
} from '@apps/apis'
import { getMallLink } from '@apps/utils'
import useEditTable from '@apps/components/src/web/StandardFormTable/hooks/useEditTable'
import { EditFillIcon } from '@linkseeks/icons'
import { WEB } from '@apps/constants'
import { history } from '@linkseeks/router-manager'
const useCpecialPage = () => {
  const tableRef = StandardFormTable.useTableRef()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [shopList, setShopList] = useState<Array<{ label: string; value: number; isSelf: boolean }>>([])
  const [mallList, setMallList] = useState<Array<{ label: string; value: number }>>([])
  const [storeList, setStoreList] = useState<Array<{ label: string; value: number }>>([])
  const translate = getWebIntl()
  const editTableProps = useEditTable({ rowKey: 'id' })
  const [form] = Form.useForm()

  const fetchStoreList = () => {
    getCommodityWebStoreWebStoreList()
      .then((res) => {
        if (res.code === 1000 && res.data) {
          setStoreList(
            res.data.map((item) => ({
              label: item.name,
              value: item.id,
            })),
          )
        }
      })
      .finally(() => {})
  }

  const fetchAllMallList = async () => {
    const params = {
      type: 1,
    }
    const { code, data } = await getCommodityWebShopWebAll(params as any, { ctlType: 'none' })
    if (code === 1000 && data) {
      setMallList(
        data.map((_item) => {
          return {
            label: _item.name,
            value: _item.id,
          }
        }),
      )
    }
  }

  useEffect(() => {
    fetchStoreList()
    fetchAllMallList()
    fetchMallByEnvironment('1')
  }, [])

  const fetchMallByEnvironment = async (environment: string) => {
    const params = {
      type: 1,
      environment,
    }
    const { code, data } = await getCommodityWebShopWebAll(params as any, { ctlType: 'none' })
    if (code === 1000 && data) {
      setShopList(
        data.map((_item) => {
          return {
            label: _item.name,
            value: _item.id,
            isSelf: _item.isSelf,
          }
        }),
      )
    }
  }

  const handleEdit = (record) => {
    editTableProps.handleEdit(record)
    editTableProps.editForm.setFieldsValue(record)
  }

  const handlesaveName = async (record) => {
    const payload = await editTableProps.editForm.validateFields()
    await postCommodityAdornTopicPageUpdate({
      id: record.id,
      name: payload.name,
    })
    editTableProps.setEditKey('')
    tableRef.current.reload()
  }

  /** 删除数据 */
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: translate('web.common.shifouquerenshanchu'),
      centered: true,
      onOk: () => {
        return new Promise((resolve) => {
          getCommodityAdornTopicPageDelete({ id: String(id) })
            .then((res) => {
              if (res.code === 1000) {
                tableRef.current.reload()
              }
            })
            .finally(() => {
              resolve(true)
            })
        })
      },
    })
  }

  /** 复制链接 */
  const handleCopy = (record: GetCommodityAdornTopicPagePageListResponseDetail) => {
    const mallLink = getMallLink(record.shopUrl, record.shopMemberId)
    const cpecialPageLink = `${mallLink}/cpecialPage/${record.id}`
    if (copy(cpecialPageLink)) {
      message.success(translate('web.common.fuzhichenggong'))
    }
  }

  /**
   * 装修
   * @param record
   */
  const handleDesign = (record: GetCommodityAdornTopicPagePageListResponseDetail) => {
    if (record?.shopEnvironment === WEB) {
      history.jump(
        `/marketingAbility/cpecialPageManage/cpecialPage/design/edit?adornId=${record.id}&environment=${record?.shopEnvironment}&shopId=${record?.shopId}`,
      )
    } else {
      history.jump(
        `/marketingAbility/cpecialPageManage/cpecialPage/design/mobile/edit?adornId=${record.id}&environment=${record?.shopEnvironment}&shopId=${record?.shopId}`,
      )
    }
  }

  /**
   * 预览装修
   * @param record
   */
  const handleDesignPreview = (record: GetCommodityAdornTopicPagePageListResponseDetail) => {
    if (record?.shopEnvironment === WEB) {
      history.jump(
        `/marketingAbility/cpecialPageManage/cpecialPage/design?adornId=${record.id}&environment=${record?.shopEnvironment}&shopId=${record?.shopId}`,
      )
    } else {
      history.jump(
        `/marketingAbility/cpecialPageManage/cpecialPage/design/mobile?adornId=${record.id}&environment=${record?.shopEnvironment}&shopId=${record?.shopId}`,
      )
    }
  }

  const columns = StandardFormTable.createColumns<GetCommodityAdornTopicPagePageListResponseDetail>([
    {
      title: translate('web.resource.marketing.yemianid'),
      key: 'id',
      width: 80,
    },
    {
      title: translate('web.resource.marketing.yemianmingcheng'),
      key: 'name',
      searchField: 'Input',
      width: 280,
      editable: true,
      render: (name: string, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
          <EditFillIcon
            color="#91959B"
            size={14}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              handleEdit(record)
            }}
          />
        </div>
      ),
    },
    {
      title: `${translate('web.resource.marketing.shiyongshangcheng')}/${translate('web.resource.mall.store')}`,
      key: 'shopName',
      searchField: {
        type: 'Select',
        name: 'shopId',
      },
      render: (text, record) => {
        return `${text}${record.storeName ? `：${record.storeName}` : ''}`
      },
    },
    {
      title: translate('web.resource.marketing.gengxinshijian'),
      key: 'updateTime',
    },
    {
      title: translate('web.resource.marketing.chuangjianshijian'),
      key: 'createTime',
    },
    {
      title: translate('web.common.control'),
      key: 'ctl',
      width: 230,
      fixed: 'right',
      format: 'Control',
      formatPayload: {
        controlList: [
          {
            children: translate('web.common.save'),
            onClick: handlesaveName,
            show: (record) => editTableProps.validateEditStatus(record.id),
          },
          {
            children: translate('web.common.cancel'),
            onClick: editTableProps.handleCancel,
            show: (record) => editTableProps.validateEditStatus(record.id),
          },
          {
            children: translate('web.resource.marketing.zhuangxiu'),
            onClick: handleDesign,
            key: 'design',
            show: (record) => !editTableProps.validateEditStatus(record.id),
          },
          {
            children: translate('web.common.yulan'),
            onClick: handleDesignPreview,
            key: 'preview',
            show: (record) => !editTableProps.validateEditStatus(record.id),
          },
          {
            children: translate('web.resource.mall.fuzhilianjie'),
            onClick: (record) => handleCopy(record),
            key: 'copy',
            show: (record) => !editTableProps.validateEditStatus(record.id),
          },
          {
            children: translate('web.common.delete'),
            onClick: (record) => handleDelete(record.id),
            key: 'delete',
            danger: true,
            show: (record) => !editTableProps.validateEditStatus(record.id),
          },
        ],
        hiddenBound: 10,
      },
    },
  ])

  return {
    form,
    tableRef,
    editTableProps,
    columns,
    shopList,
    mallList,
    storeList,
    modalVisible,
    setModalVisible,
    fetchMallByEnvironment,
  }
}

export default useCpecialPage
