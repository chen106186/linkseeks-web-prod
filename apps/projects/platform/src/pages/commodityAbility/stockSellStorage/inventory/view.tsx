import React, { useState, useEffect, useRef } from 'react'
import { useQuery, useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import { Cascader, Card, Space, Modal, Button, message, Tooltip } from 'antd'
import { SettingOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  getProductInventoryList,
  getProductMaterialGroupTree,
  getProductWarehouseAll,
  postProductInventorySafetyBatchUpdate,
} from '@apps/apis'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { inventorySchema, safetyModalSchema } from './schema'
import styles from './index.less'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { getWebIntl } from '@apps/locales'
const { onFormMount$ } = FormEffectHooks
const translate = getWebIntl()
const formActions = createFormActions()
const modalFormActions = createFormActions()
const Inventory: React.FC<{}> = () => {
  const { goodsNo, code } = useQuery()
  const { pathname } = useLocation()
  const [current, setCurrent] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<number>>([])

  const ref = useRef<any>({})
  const intl = useIntl()

  useEffect(() => {
    if (code) {
      formActions.setFieldValue('goodsNo', code)
    }
  }, [code])

  const handleUpdateSafetyStock = (record) => {
    if (authUrl(pathname, 'edit')) {
      setCurrent(record)
      setModalVisible(true)
    }
  }

  const useAsyncCascader = async (name, service: () => Promise<any[]>) => {
    const { setFieldState } = createFormActions()
    onFormMount$().subscribe(() => {
      service()
        .then((res) => {
          setFieldState(name, (state) => {
            FormPath.setIn(state, 'props.x-component-props.options', res)
          })
        })
        .catch((err) => {
          setFieldState(name, (state) => {
            FormPath.setIn(state, 'props.x-component-props.options', [])
          })
        })
    })
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'stockSellStorage.huohao' }),
      // align: 'center',
      dataIndex: 'materielNo',
      width: 96,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.huopinmingcheng' }),
      dataIndex: 'materielName',
      // align: 'center',
      render: (text: any, record: any) => text,
      width: 192,
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.materialGroup' }),
      dataIndex: 'materielGroup',
      // align: 'center',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.guigexinghao' }),
      dataIndex: 'specifications',
      // align: 'center',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.pinlei' }),
      dataIndex: 'category',
      // align: 'center',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.pinpai' }),
      dataIndex: 'brand',
      // align: 'center',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.danwei' }),
      dataIndex: 'unit',
      // align: 'center',
      width: 80,
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.chengbenjia' }),
      dataIndex: 'costPrice',
      // align: 'center',
      render: (text) => (text !== null ? `${translate('web.common.currencySymbol')}${text}` : ''),
      width: 112,
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.cangku' }),
      dataIndex: 'warehouseName',
      // align: 'center',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.occupiedInventory' }),
      dataIndex: 'occupiedInventory',
      // align: 'center',
      width: 128,
      render: (text) => text ?? 0,
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.inventoryCount' }),
      dataIndex: 'inventoryCount',
      // align: 'center',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.inventoryInStock' }),
      dataIndex: 'inventoryCount',
      // align: 'center',
      render: (text, record) => {
        return Number(record?.occupiedInventory ?? 0) + Number(record?.inventoryCount ?? 0)
      },
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.distributableInventory' }),
      dataIndex: 'distributableInventory',
      // align: 'center',
      width: 128,
      render: (text) => text ?? 0,
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.jine' }),
      dataIndex: 'totalPrice',
      // align: 'center',
      render: (text) => `${translate('web.common.currencySymbol')}${text}`,
      width: 128,
    },
    {
      title: (
        <Space>
          {intl.formatMessage({ id: 'stockSellStorage.anquankucun' })}
          <SettingOutlined />
        </Space>
      ),
      dataIndex: 'safeInventoryCount',
      // align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <div className={styles.safe} onClick={() => handleUpdateSafetyStock(record)}>
          {text}
        </div>
      ),
      width: 128,
    },
  ]

  const fetchListData = (params: any) => {
    const materialGroupId = params.materialGroupId
      ? params.materialGroupId[params.materialGroupId.length - 1]
      : undefined
    return new Promise((resolve, reject) => {
      getProductInventoryList({ materielNo: code, ...params, materialGroupId })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
          reject()
        })
        .catch(() => {
          reject()
        })
    })
  }

  // 获取对应仓库
  const fetchInventory = async () => {
    const { data, code } = await getProductWarehouseAll()
    if (code === 1000) {
      return data.map((v) => ({ label: v.name, value: v.id }))
    }
    return []
  }

  const fetchTreeData = async () => {
    try {
      const { data, code } = await getProductMaterialGroupTree({ rootNodeId: '0' })
      if (code === 1000) {
        return data
      }
      return []
    } catch {
      return []
    }
  }

  // 修改安全库存
  const handleSubmit = async (values) => {
    setConfirmLoading(true)
    const params = {
      ids: selectedRowKeys,
      safetyInvoices: +values.safetyInvoices,
    }
    if (current) {
      params.ids = [current.id]
    } else if (selectedRowKeys.length === 0) {
      message.error('请选择物料选项')
      setConfirmLoading(false)
      setModalVisible(false)
      return
    }
    const res = await postProductInventorySafetyBatchUpdate(params)

    if (res.code === 1000) {
      setModalVisible(false)
      ref.current.reloadCurrent()
    }
    setConfirmLoading(false)
  }

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: any[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }
  const controllerBtns = (
    <EditAuthButton>
      <Button onClick={() => handleUpdateSafetyStock(undefined)} style={{ width: 154 }}>
        {intl.formatMessage({
          id: 'stockSellStorage.piliangtiaozhenganquankucun',
        })}
      </Button>
    </EditAuthButton>
  )

  useEffect(() => {
    if (goodsNo) {
      formActions.setFieldValue('goodsNo', goodsNo)
    }
  }, [goodsNo])

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          columns={columns}
          currentRef={ref}
          tableProps={{
            rowKey: 'id',
            scroll: { x: '100%' },
          }}
          rowSelection={rowSelection}
          fetchTableData={(params: any) => fetchListData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              expressionScope={{
                controllerBtns,
              }}
              components={{ Cascader }}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'materielName', FORM_FILTER_PATH)
                useAsyncSelect('warehouseId', fetchInventory)
                useAsyncCascader('materialGroupId', fetchTreeData)
              }}
              schema={inventorySchema}
            />
          }
        />
      </Card>

      <Modal
        title={intl.formatMessage({
          id: 'stockSellStorage.tiaozhenganquankucun',
        })}
        visible={modalVisible}
        confirmLoading={confirmLoading}
        onOk={() => modalFormActions.submit()}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <NiceForm
          effects={($, { setFieldState }) => {}}
          initialValues={{
            safetyInvoices: current?.safeStock,
          }}
          actions={modalFormActions}
          schema={safetyModalSchema}
          onSubmit={handleSubmit}
        />
      </Modal>
    </PageHeaderWrapper>
  )
}

export default Inventory
