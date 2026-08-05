import React, { useState, useEffect } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { Button, Card, Col, Row, Space } from 'antd'
import { createFormActions } from '@apps/formily'
import { LinkOutlined } from '@ant-design/icons'
import NiceForm from '@/components/NiceForm'
import './index.less'
import { formSchema } from './schema'
import { ArrayTable } from '@apps/formily'
import DrawerTable from '@/components/DrawerTable'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Search from '@/components/NiceForm/components/Search'
import Submit from '@/components/NiceForm/components/Submit'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { unixChangeRender } from '../addNewBid/constant'
import { omit } from '@/utils'
import { getPurchaseExpertGetExpert, postPurchaseExpertSaveOrUpdateExpert } from '@apps/apis'
import { getMemberManageUsersPage } from '@apps/apis'

export interface AddRemarkBidExpertProps {}
const intl = getIntl()
const addSchemaAction = createFormActions()

// 新增评标专家库. 包含新增和编辑
const AddRemarkBidExpert: React.FC<AddRemarkBidExpertProps> = (props) => {
  const [formLoading, setFormLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [initFormValue, setInitFormValue] = useState<any>({})

  const [visible, setVisible] = useState(false)
  const [selectRow, setSelectRow] = useState<any[]>([]) // 抽屉选择的行数据
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([])

  const { id, preview, pageStatus } = usePageStatus()

  useEffect(() => {
    if (id) {
      getPurchaseExpertGetExpert({ id }).then((res) => {
        if (res.code === 1000) {
          let value: any = { ...res.data }
          value['address'] = [
            {
              provinceCode: value.provinceCode,
              province: value.provinceName,
              cityCode: value.cityCode,
              city: value.cityName,
              areaCode: value.areaCode,
              area: value.areaName,
            },
          ]
          ;(value.createTime = unixChangeRender(value.createTime)),
            (value.updateTime = unixChangeRender(value.updateTime))
          setInitFormValue(value)
        }
      })
    }
  }, [id])

  const handleSubmit = async (value) => {
    setBtnLoading(true)
    let params = {
      ...value,
      ...value['address'][0],
      provinceName: value['address'][0]['province'],
      cityName: value['address'][0]['city'],
      areaName: value['address'][0]['area'],
    }
    postPurchaseExpertSaveOrUpdateExpert(
      omit(params, ['address', 'area', 'city', 'province', 'createTime', 'status', 'updateTime']),
    )
      .then((res) => {
        if (res.code === 1000) {
          history.goBack()
        }
      })
      .finally(() => setBtnLoading(false))
  }

  const handleSelectExpert = () => {
    setVisible(true)
  }

  const selectButton = pageStatus !== PageStatus.PREVIEW && (
    <div className="connectBtn" onClick={handleSelectExpert}>
      <LinkOutlined style={{ marginRight: 4 }} />
      {intl.formatMessage({ id: 'table.purchase.xuanze' })}
    </div>
  )

  const fetchData = (params: any) => {
    return new Promise((resolve, reject) => {
      getMemberManageUsersPage({ ...params, status: 1 }).then((res) => {
        resolve(res.data)
      })
    })
  }

  const columns: any[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.xuhao' }),
      dataIndex: 'userId',
      key: 'userId',
      render: (t, r, i) => ++i,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.xingming' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.shoujihao' }),
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.suoshujigou' }),
      dataIndex: 'orgName',
      key: 'orgName',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.zhiwei' }),
      dataIndex: 'jobTitle',
      key: 'jobTitle',
    },
  ]

  const rowSelection: any = {
    type: 'radio',
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectRow(selectedRows)
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  const onConfirm = () => {
    setVisible(false)
    addSchemaAction.setFieldValue('name', selectRow[0]['name'])
    addSchemaAction.setFieldValue('userOrgName', selectRow[0]['orgName'])
    addSchemaAction.setFieldValue('userJobTitle', selectRow[0]['jobTitle'])
    addSchemaAction.setFieldValue('phone', selectRow[0]['phone'])
    addSchemaAction.setFieldValue('expertUserId', selectRow[0]['userId'])
  }

  return (
    <PageHeaderWrapper
      style={{ margin: 0 }}
      title={
        pageStatus === PageStatus.ADD
          ? intl.formatMessage({ id: 'table.purchase.xinjianpingbiaozhuan' })
          : pageStatus === PageStatus.EDIT
          ? intl.formatMessage({ id: 'table.purchase.bianjipingbiaozhuan' })
          : intl.formatMessage({ id: 'table.purchase.zhakanpingbiaozhuan' })
      }
    >
      <Card>
        <NiceForm
          loading={formLoading}
          previewPlaceholder=" "
          editable={pageStatus !== PageStatus.PREVIEW}
          value={initFormValue}
          actions={addSchemaAction}
          schema={formSchema}
          onSubmit={handleSubmit}
          components={{
            ArrayTable,
          }}
          effects={($, ctx) => {
            $('onFormMount').subscribe(() => {})
          }}
          expressionScope={{
            selectButton,
          }}
        />
        <Row>
          <Col span={8} offset={4}>
            <Space size={[16, 0]}>
              <Button type="primary" loading={btnLoading} onClick={() => addSchemaAction.submit()}>
                {intl.formatMessage({ id: 'table.purchase.baocun' })}
              </Button>
              <Button onClick={() => history.goBack()}>{intl.formatMessage({ id: 'table.purchase.quxiao' })}</Button>
            </Space>
          </Col>
        </Row>
      </Card>
      {/* 选择专家抽屉 */}
      <DrawerTable
        drawerTitle={intl.formatMessage({ id: 'table.purchase.xuanzezhuanjia' })}
        confirm={onConfirm}
        cancel={() => setVisible(false)}
        visible={visible}
        columns={columns}
        rowSelection={rowSelection}
        fetchTableData={(params: any) => fetchData(params)}
        formilyProps={{
          ctx: {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  'x-component': 'ModalSearch',
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruxingming' }),
                    align: 'flex-left',
                  },
                },
                [FORM_FILTER_PATH]: {
                  type: 'object',
                  'x-component': 'flex-layout',
                  'x-component-props': {
                    rowStyle: {
                      flexWrap: 'wrap',
                      width: '100%',
                      justifyContent: 'flex-start',
                      style: {
                        marginRight: 0,
                      },
                    },
                    colStyle: {
                      marginTop: 20,
                    },
                  },
                  properties: {
                    orgName: {
                      type: 'string',
                      'x-component-props': {
                        placeholder: intl.formatMessage({ id: 'table.purchase.qingshurusuoshu1' }),
                      },
                    },
                    jobTitle: {
                      type: 'string',
                      'x-component-props': {
                        placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruzhiwei' }),
                      },
                    },
                    submit: {
                      'x-component': 'Submit',
                      'x-mega-props': {
                        span: 1,
                      },
                      'x-component-props': {
                        children: intl.formatMessage({ id: 'table.purchase.chaxun' }),
                      },
                    },
                  },
                },
              },
            },
            components: { ModalSearch: Search, Submit },
            effects: ($, actions) => {
              actions.reset()
              useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
            },
          },
        }}
        resetDrawer={{
          destroyOnClose: true,
        }}
        tableProps={{
          rowKey: 'userId',
        }}
      />
    </PageHeaderWrapper>
  )
}

AddRemarkBidExpert.defaultProps = {}

export default AddRemarkBidExpert
