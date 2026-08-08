import React, { useContext, useEffect, useRef, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Button, Card, Form, Input, message, Modal, Space, Tooltip } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { EditOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { StatusAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { createFormActions, FormEffectHooks, ISchema } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { repositSchema } from '../schema'
import { searchBrandOptionEffect, searchCustomerCategoryOptionEffect } from '../effects'
// import { treeReduction } from '@/utils'
import ModalForm from '@/components/ModalForm'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import {
  getProductFreightSpaceList,
  postProductFreightSpaceStopStart,
  postProductFreightSpaceUpdateBatch,
  postProductFreightSpaceUpdateInventory,
} from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { treeReduction } from '@/utils'
import { useWebIntl } from '@apps/locales'
// table编辑控件
const EditableContext = React.createContext<any>({})
interface EditableRowProps {
  index: number
}
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  console.log(0)
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}
interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: string
  record: any
  handleSave: (record: any) => void
  formItemProps: any
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  formItemProps = {},
  handleSave,
  ...restProps
}) => {
  const intl = useIntl()
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<any>({})
  const form = useContext(EditableContext)

  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    if (record?.isSync) {
      return
    }
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }
  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0, width: record.width || 80 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'transaction_components.cixiangweibitianxiang' }),
          },
          {
            pattern: /^\d+(\.\d{1,2})?$/,
            message: intl.formatMessage({ id: 'repositories.zhifubilijinxianliangwei' }),
          },
        ]}
      >
        <Input type="number" ref={inputRef} onBlur={save} onPressEnter={save} {...formItemProps} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
        {!record?.isSync && <EditOutlined />}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

const formActions = createFormActions()
const modalSchemaAction = createFormActions()

const help = (text: string, desc?: string) => (
  <>
    {text}&nbsp;
    <Tooltip title={desc}>
      <QuestionCircleOutlined />
    </Tooltip>
  </>
)

const fetchData = async (params: any) => {
  if (params?.category) {
    formActions.getFieldState('category', (state) => {
      let categorys = treeReduction(state.props['x-component-props'].dataoption)
      params.category = categorys[Number(params.category)]['name']
    })
  }
  if (params?.brand) {
    formActions.getFieldState('brand', (state) => {
      let brands = state.props['x-component-props']?.dataoption
      params.brand = brands.filter((i) => i.id === params.brand)[0].name
    })
  }
  const res = await getProductFreightSpaceList(params)
  return res.data
}

const Repositories: React.FC<{}> = () => {
  const intl = useIntl()
  const { pathname } = useLocation()
  const ref = useRef<any>({})
  const modalRef = useRef<any>({})
  const [rowSelection, RowCtl] = useRowSelectionTable({ customKey: 'id' })
  const { run, loading } = useHttpRequest(postProductFreightSpaceUpdateBatch as any, { ctlType: 'none' } as any)
  const translate = useWebIntl()

  const columns: any[] = [
    {
      title: intl.formatMessage({ id: 'repositories.columns.id' }),
      dataIndex: 'id',
      key: 'id',
      width: 80,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({ id: 'repositories.columns.name' }),
      dataIndex: 'name',
      key: 'name',
      width: 320,
      render: (text: any, record: any) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/commodityAbility/repositories/manage/detail?id=${record.id}&preview=1`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: translate('web.resource.commodity.name'),
      dataIndex: 'productName',
      key: 'productName',
      width: 200,
    },
    {
      title: translate('web.resource.commodity.guishusku'),
      dataIndex: 'productSkuName',
      key: 'productSkuName',
      width: 200,
    },
    {
      title: intl.formatMessage({ id: 'repositories.columns.category' }),
      dataIndex: 'category',
      key: 'category',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'repositories.columns.brand' }),
      dataIndex: 'brand',
      key: 'brand',
      width: 96,
    },
    {
      title: intl.formatMessage({ id: 'repositories.columns.unit' }),
      dataIndex: 'unit',
      key: 'unit',
      width: 64,
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.occupiedInventory' }),
      dataIndex: 'occupiedInventory',
      key: 'occupiedInventory',
      width: 96,
      render: (text) => text ?? 0,
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.inventoryCount' }),
      dataIndex: 'inventory',
      key: 'inventory',
      formItem: 'input',
      editable: true,
      width: 200,
    },
    {
      title: intl.formatMessage({ id: 'repositories.columns.alreadyInventory' }),
      dataIndex: 'alreadyInventory',
      key: 'alreadyInventory',
      width: 96,
    },
    {
      title: (
        <span>
          {translate('web.resource.commodity.shangyoushanpingkucun')}&ensp;
          <Tooltip title={translate('web.resource.commodity.shangyouTip')}>
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
      ),
      width: 112,
      dataIndex: 'upperStockCount',
      key: 'upperStockCount',
      render: (text) => text || '-',
    },
    // {
    //   title: intl.formatMessage({ id: 'repositories.isSync' }),
    //   dataIndex: 'isSync',
    //   key: 'isSync',
    //   width: 128,
    //   render: (text) =>
    //     text
    //       ? intl.formatMessage({ id: 'repositories.isSync.true' })
    //       : intl.formatMessage({ id: 'repositories.isSync.false' }),
    // },
    {
      title: intl.formatMessage({ id: 'repositories.columns.status' }),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      fixed: 'right',
      render: (text: any, record: any) => (
        <AuthButton type="custom" code="state">
          <StatusAuthButton handleConfirm={() => handleModify(record)} fieldNames="state" record={record} />
        </AuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'repositories.columns.option' }),
      dataIndex: 'option',
      width: 128,
      fixed: 'right',
      render: (text: any, record: any) => {
        return (
          <>
            {record.state === 1 ? (
              <EditAuthButton>
                <Button type="link" onClick={() => handleAdjust(record)}>
                  {intl.formatMessage({ id: 'repositories.columns.option.button' })}
                </Button>
              </EditAuthButton>
            ) : (
              ''
            )}
          </>
        )
      },
    },
  ]

  const modalSchema: ISchema = {
    type: 'object',
    properties: {
      NO_SUBMIT: {
        type: 'object',
        'x-component': 'mega-layout',
        'x-component-props': {
          labelAlign: 'left',
          labelCol: 6,
        },
        properties: {
          type: {
            type: 'radio',
            required: true,
            enum: [
              {
                label: intl.formatMessage({ id: 'repositories.modalSchema.type.1' }),
                value: 1,
              },
              {
                label: intl.formatMessage({ id: 'repositories.modalSchema.type.2' }),
                value: 2,
              },
            ],
            default: 1,
            'x-linkages': [
              {
                type: 'value:visible',
                target: 'inventoryAmount',
                condition: '{{$value === 1}}',
              },
              {
                type: 'value:visible',
                target: 'inventoryRate',
                condition: '{{$value === 2}}',
              },
            ],
          },
          inventoryAmount: {
            type: 'number',
            title: help(
              intl.formatMessage({ id: 'repositories.modalSchema.inventoryAmount' }),
              intl.formatMessage({ id: 'repositories.modalSchema.inventoryAmount.tip' }),
            ),
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'repositories.modalSchema.inventoryAmount.placeholder' }),
              style: { width: '100%' },
            },
            'x-rules': [
              {
                required: true,
                message: intl.formatMessage({ id: 'repositories.modalSchema.inventoryAmount.message.1' }),
              },
              {
                pattern: /^\d+(\.\d{1,3})?$/,
                message: intl.formatMessage({ id: 'repositories.modalSchema.inventoryAmount.message.1' }),
              },
            ],
          },
          inventoryRate: {
            type: 'string',
            title: help(
              intl.formatMessage({ id: 'repositories.modalSchema.inventoryRate' }),
              intl.formatMessage({ id: 'repositories.modalSchema.inventoryRate.tip' }),
            ),
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'repositories.modalSchema.inventoryRate.placeholder' }),
              style: { width: '100%' },
              suffix: '%',
            },
            'x-rules': [
              {
                required: true,
                message: intl.formatMessage({ id: 'repositories.modalSchema.inventoryRate.message.1' }),
              },
              {
                pattern: /^[+-]?\d*(\.\d{0,3})?$/,
                message: intl.formatMessage({ id: 'repositories.modalSchema.inventoryRate.message.2' }),
              },
            ],
          },
        },
      },
    },
  }

  const handleModify = async (record) => {
    // 通过传入的params字符串判断是修改那种类型的数据
    await postProductFreightSpaceStopStart({
      id: record.id,
      state: record.state === 1 ? 0 : 1,
    })
    ref.current.reloadCurrent()
  }

  const handleAdjust = (record: any) => {
    history.push(`/commodityAbility/repositories/manage/adjustRepository?id=${record.id}&isSync=${record.isSync}`)
  }

  const handleToAdd = () => {
    history.push(`/commodityAbility/repositories/manage/add`)
  }

  const handleBatchAdd = () => {
    history.push(`/commodityAbility/repositories/manage/batchAddRepository`)
  }

  const handleBatchEdit = () => {
    const _flag = RowCtl.selectedRowKeys.map((item) => item.isSync).filter((item) => item === true).length > 0
    if (_flag) {
      return message.error(intl.formatMessage({ id: 'repositories.editMessage' }))
    }
    modalRef.current.setVisible(true)
  }

  const handleSubmit = async (value) => {
    if (!RowCtl.selectedRowKeys.length) {
      return message.error(intl.formatMessage({ id: 'repositories.error' }))
    }
    const { code } = await run({
      ...value,
      inventory: value?.type === 1 ? value?.inventoryAmount || 0 : value?.inventoryRate,
      idList: RowCtl.selectedRowKeys,
    })
    if (code === 1000) {
      modalRef.current.setVisible(false)
      RowCtl.setSelectedRowKeys([])
      setTimeout(() => {
        ref.current.reloadCurrent()
      }, 600)
    }
  }

  const handleConfirm = () => {
    Modal.confirm({
      content: intl.formatMessage({ id: 'repositories.confirm.hint' }),
      onOk() {
        modalSchemaAction.submit()
      },
      onCancel() {
        modalRef.current.setVisible(false)
      },
    })
  }

  const handleFormatter = (value) => {
    // value => `${value}%`
    console.log(value)
  }

  const handleParser = (value) => {
    console.log(value)
  }

  const handleSave = (row) => {
    console.log(row)
    const { id, inventory } = row
    // // 执行修改库存
    postProductFreightSpaceUpdateInventory({
      id,
      inventory,
    }).then((res) => {
      if (res.code === 1000) {
        ref.current.reloadCurrent()
      }
    })
  }

  const editColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        formItemProps: col.formItemProps,
        handleSave: handleSave,
      }),
    }
  })

  const editComponents = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const controllerBtns = (
    <Space>
      <AddAuthButton>
        <Button type="primary" onClick={handleToAdd} icon={<PlusOutlined />}>
          {intl.formatMessage({ id: 'repositories.controllerBtns.button.1' })}
        </Button>
      </AddAuthButton>
      <AuthButton type="custom" code="batchAddRepository">
        <Button onClick={handleBatchAdd}>{intl.formatMessage({ id: 'repositories.controllerBtns.button.2' })}</Button>
      </AuthButton>

      <AuthButton type="custom" code="batchEdit">
        <Button onClick={handleBatchEdit}>{intl.formatMessage({ id: 'repositories.controllerBtns.button.3' })}</Button>
      </AuthButton>
    </Space>
  )

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          columns={editColumns}
          currentRef={ref}
          tableProps={{ rowKey: 'id', components: editComponents, scroll: { x: '100%' } }}
          rowSelection={rowSelection}
          fetchTableData={(params: any) => fetchData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              expressionScope={{
                controllerBtns,
              }}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
                FormEffectHooks.onFieldChange$('brand').subscribe((state) => {
                  searchBrandOptionEffect(actions, 'brand')
                })
                FormEffectHooks.onFieldChange$('category').subscribe((state) => {
                  searchCustomerCategoryOptionEffect(actions, 'category')
                })
              }}
              schema={repositSchema}
            />
          }
        />
      </Card>
      <ModalForm
        modalTitle={intl.formatMessage({ id: 'repositories.modalForm' })}
        previewPlaceholder=" "
        currentRef={modalRef}
        schema={modalSchema}
        actions={modalSchemaAction}
        onSubmit={handleSubmit}
        confirm={handleConfirm}
        modalProps={{
          confirmLoading: loading,
        }}
        effects={($, ctx) => {
          $('onFieldInit', 'type').subscribe(() => {
            setTimeout(() => {
              ctx.setFieldValue('type', 1)
            }, 500)
          })
        }}
        expressionScope={{
          handleParser,
          handleFormatter,
        }}
      />
    </PageHeaderWrapper>
  )
}

export default Repositories
