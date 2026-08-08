import React, { useEffect, useState } from 'react'
import { Form, Radio, Button, Table, Input, InputNumber, Cascader, Spin } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { PlusOutlined } from '@ant-design/icons'
import style from './index.less'
import DrawerWrite from '../modal/drawerWrite'
import UploadImport from '@/components/UploadImport'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import AnchorModal from '../modal'
import { getIntl } from '@linkseeks/i18n'
import { getOssUrlPath } from '@apps/constants'

const intl = getIntl()
const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 24 },
  labelAlign: 'left',
}

interface Iprops {
  currentRef: any
  fetchdata: { [key: string]: any }
  onBadge?: Function
}
const BUTTONTEXT = {
  1: intl.formatMessage({ id: 'detail.purchase.modalTitle28' }),
  2: intl.formatMessage({ id: 'detail.purchase.modalTitle9' }),
}

const Material: React.FC<Iprops> = (props: any) => {
  const [form] = Form.useForm()
  const { currentRef, fetchdata, onBadge } = props
  /** 表单表头 */
  const [flag, setFlag] = useState<boolean>(false)
  const [edit, setEdit] = useState<any>({})
  const [dataSource, setDataSource] = useState<any>([])
  const [eidtIndex, setEditIndex] = useState<number | null>()
  const [isPreview, setIsPreview] = useState<boolean>(false)

  /** 删除列表 */
  const handleRemove = (index: number) => {
    const data = [...dataSource]
    data.splice(index, 1)
    setDataSource(data)
  }

  /** 编辑列表 */
  const handleEdit = (data, index, preview?) => {
    setEditIndex(index)
    setEdit(data)
    setFlag(true)
    setIsPreview(preview)
  }

  const columns: ColumnType<Object>[] = [
    {
      title: intl.formatMessage({ id: 'detail.purchase.materialCode' }),
      key: 'number',
      dataIndex: 'number',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.materialName' }),
      key: 'name',
      dataIndex: 'name',
      render: (text: any, record: any, index: number) => (
        <EyeAuthButton type="button" handleClick={() => handleEdit(record, index, true)}>
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.materialGroup' }),
      key: 'materialGroup',
      dataIndex: 'materialGroup',
      render: (text: any, record: any, index: number) => {
        return text ? text : record?.goodsGroup
      },
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.nameCode' }),
      key: 'model',
      dataIndex: 'model',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.customerCategory' }),
      key: 'category',
      dataIndex: 'category',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.brand' }),
      key: 'brand',
      dataIndex: 'brand',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.unitName' }),
      key: 'unit',
      dataIndex: 'unit',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.purchaseCount' }),
      key: 'purchaseCount',
      dataIndex: 'purchaseCount',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.option' }),
      key: 'operate',
      dataIndex: 'operate',
      render: (_text: any, record: any, index: number) => (
        <>
          <Button type="link" onClick={() => handleEdit(record, index)}>
            {intl.formatMessage({ id: 'detail.purchase.edit' })}
          </Button>
          <Button onClick={() => handleRemove(index)} type="link">
            {intl.formatMessage({ id: 'detail.purchase.detele' })}
          </Button>
        </>
      ),
    },
  ]
  /** RADIO选择 1: 选择货品添加，2: 导入货品生成 */
  const [materielMode, setMaterielMode] = useState<number>(0)
  const checkRadio = (e) => {
    const { value } = e.target
    setFlag(false)
    setMaterielMode(value)
  }
  /** 打开添加方式 */
  const handleAddmode = () => {
    setFlag(true)
    setEdit({})
    setEditIndex(null)
  }
  /** 关闭 */
  const handleClose = () => {
    setFlag(false)
    setIsPreview(false)
  }
  /** 添加列表 */
  const fetchTableList = (data: any) => {
    console.log(data)
    if (Object.keys(data).length > 0) {
      if (eidtIndex || eidtIndex === 0) {
        dataSource[eidtIndex] = data
        setDataSource([...dataSource])
      } else {
        setDataSource([...dataSource, data])
      }
      setFlag(false)
    }
  }
  /** 导入列表 */
  const fetchData = (data: any) => {
    if (Object.keys(data).length > 0) {
      setDataSource([...dataSource, ...data])
    }
  }

  useEffect(() => {
    currentRef.current = {
      get: () =>
        new Promise((resolve: any) => {
          form
            .validateFields()
            .then((res) => {
              resolve({
                state: true,
                name: 'material',
                data: {
                  materielMode: res.materielMode,
                  materiels: dataSource,
                },
              })
              onBadge(0, 1)
            })
            .catch((error) => {
              if (error && error.errorFields) {
                onBadge(error.errorFields.length, 1)
              }
            })
        }),
    }
  })

  useEffect(() => {
    /**编辑回显数据 */
    if (Object.keys(fetchdata).length > 0) {
      form.setFieldsValue({
        materielMode: fetchdata.materielMode,
      })
      setMaterielMode(fetchdata.materielMode)
      setDataSource(fetchdata.materiels)
    }
  }, [fetchdata])

  return (
    <>
      <Form {...layout} form={form}>
        <Form.Item
          label={intl.formatMessage({ id: 'detail.purchase.modalTitle3' })}
          name="materielMode"
          rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message12' }) }]}
        >
          <Radio.Group onChange={checkRadio}>
            <Radio value={1}>{intl.formatMessage({ id: 'detail.purchase.modalTitle28' })}</Radio>
            {/* <Radio value={2}>导入货品生成</Radio> */}
          </Radio.Group>
        </Form.Item>
        {materielMode >= 1 && (
          <>
            <Button
              type="dashed"
              block
              onClick={handleAddmode}
              style={{
                marginBottom: '24px',
              }}
            >
              <PlusOutlined />
              {BUTTONTEXT[materielMode]}
            </Button>
            <Table columns={columns} dataSource={dataSource} rowClassName={style.editableRow} />
          </>
        )}
        {materielMode === 1 && (
          <AnchorModal
            dataSource={dataSource}
            preview={isPreview}
            edit={edit}
            visible={flag}
            onClose={handleClose}
            onConfirm={fetchTableList}
          />
        )}
        {materielMode === 2 && (
          <UploadImport
            visible={flag}
            title="导入"
            downLink={getOssUrlPath('/irregular/采购需求单导入12ce2f3f6f7e4dfa8d8a7bc4cdf66f1d.xlsx')}
            checkfetch="/api/purchase/purchase/inquiry/import/excel/check"
            importfetch="/api/purchase/purchase/inquiry/import/excel"
            fetchData={fetchData}
            onClose={() => setFlag(false)}
          />
        )}
      </Form>
    </>
  )
}
export default Material
