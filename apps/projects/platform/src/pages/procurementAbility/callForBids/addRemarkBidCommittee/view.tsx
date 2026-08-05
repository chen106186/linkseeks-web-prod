import React, { useState, useEffect } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { Button, Card, Space, Col, Row, Drawer, message } from 'antd'
import { createFormActions, Submit } from '@apps/formily'
import { LinkOutlined, PlusOutlined, SaveOutlined, ThunderboltFilled } from '@ant-design/icons'
import NiceForm from '@/components/NiceForm'
import './index.less'
import { conditionSchema, formSchema, selectExpertSchema } from './schema'
import { ArrayTable } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import Search from '@/components/NiceForm/components/Search'
import DrawerTable from '@/components/DrawerTable'
import {
  buildColumns,
  expertColumns,
  initConditionData,
  selectExpertColumns,
  selectItemColumns,
  transformAreaField,
  transformSelectExpertField,
} from './constant'
import { selectBidSchema } from './schema/modal'
import { formatTimeString, omit } from '@/utils'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import { ExpertTypeMap, SpecialityTypeMap } from '@/constants/procurement'
import {
  getPurchaseExpertExtractGetExpertExtract,
  getPurchaseExpertGetExpertList,
  getPurchaseInviteTenderGetInviteTender,
  postPurchaseExpertExtractSaveOrUpdateExpertExtract,
  postPurchaseExpertGetBatchExpertList,
  postPurchaseInviteTenderGetEvaluationTenderList,
} from '@apps/apis'
const intl = getIntl()
export interface AddRemarkBidCommitteeProps {}

// 页面表单全部提交
const addSchemaAction = createFormActions()

// 组件条件表单
const addConditionSchemaAction = createFormActions()

// 新增评标委员会 包含新增和编辑 @又名新增专家抽取
const AddRemarkBidCommittee: React.FC<AddRemarkBidCommitteeProps> = (props) => {
  const [formLoading, setFormLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [initFormValue, setInitFormValue] = useState<any>({})
  const [initConditionFormValue, setInitConditionFormValue] = useState<any>({})

  const [projectVisible, setProjectVisible] = useState(false)
  const [conditionVisible, setConditionVisible] = useState(false)
  const [expertVisible, setExpertVisible] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false) // 查看评标专家弹框
  const [preViewRow, setPreviewRow] = useState<any>({})
  const [selectRow, setSelectRow] = useState<any[]>([]) // 选择评标项目抽屉的行数据
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([])

  const [selectExpertRow, setSelectExpertRow] = useState<any[]>([]) // 选择评标专家抽屉的行数据
  const [selectedExpertRowKeys, setSelectedExpertRowKeys] = useState<Array<string>>([])

  const { id, code, pageStatus } = usePageStatus()

  useEffect(() => {
    // 初始抽取条件表格
    addSchemaAction &&
      addSchemaAction.setFieldValue &&
      addSchemaAction.setFieldValue('expertExtractQueryList', initConditionData)
  }, [])

  useEffect(() => {
    if (id) {
      getPurchaseExpertExtractGetExpertExtract({ id }).then((res) => {
        const { code, data }: any = res
        if (code === 1000) {
          data.createTime = formatTimeString(data['createTime'])
          data.remarkTime = `${formatTimeString(data['inviteTender']['evaluationStartTime'])} ~ ${formatTimeString(
            data['inviteTender']['evaluationEndTime'],
          )}`
          data.code = data['inviteTender']['code']
          data.projectName = data['inviteTender']['projectName']
          data.openTenderTime = formatTimeString(data['inviteTender']['openTenderTime'])
          data.status = data.status
            ? intl.formatMessage({ id: 'table.purchase.yifasong' })
            : intl.formatMessage({ id: 'table.purchase.daifasong' })
          setInitFormValue(transformAreaField(data, 'render'))
        }
      })
    }
  }, [id])

  // 招标查询跳转
  useEffect(() => {
    if (code) {
      getPurchaseInviteTenderGetInviteTender({ inviteTenderId: code }).then((res) => {
        const { code: _code, data }: any = res
        let initRender: any = {}
        if (_code === 1000) {
          initRender.createTime = formatTimeString(data['createTime'])
          initRender.remarkTime = `${formatTimeString(data['evaluationStartTime'])} ~ ${formatTimeString(
            data['evaluationEndTime'],
          )}`
          initRender.code = data['code']
          initRender.projectName = data['projectName']
          initRender.openTenderTime = formatTimeString(data['openTenderTime'])
          // initRender.status = data.status ? intl.formatMessage({ id: 'table.purchase.daifasong' }) : intl.formatMessage({ id: 'table.purchase.yifasong' })
          initRender.status = intl.formatMessage({ id: 'table.purchase.daifasong' })
          initRender.expertExtractQueryList = initConditionData
          initRender.inviteTender = { id: code }
          setInitFormValue(initRender)
        }
      })
    }
  }, [code])

  const conditionColumns = buildColumns.concat([
    {
      dataIndex: 'ctl',
      title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
      align: 'center',
      render: (t, r) =>
        pageStatus !== PageStatus.PREVIEW && (
          <>
            <Button type="link" onClick={() => editCondition(t, r)}>
              {intl.formatMessage({ id: 'table.purchase.bianjizujiantiao' })}
            </Button>
          </>
        ),
    },
  ])

  const memberColumns = expertColumns.concat([
    {
      dataIndex: 'ctl',
      title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
      align: 'center',
      render: (t, r) =>
        pageStatus !== PageStatus.PREVIEW ? (
          <>
            <Button type="link" onClick={() => handlePreview(r)}>
              {intl.formatMessage({ id: 'table.purchase.zhakan' })}
            </Button>
            <Button type="link" onClick={() => removeExpert(r)}>
              {intl.formatMessage({ id: 'table.purchase.shanchu' })}
            </Button>
          </>
        ) : (
          <Button type="link" onClick={() => handlePreview(r)}>
            {intl.formatMessage({ id: 'table.purchase.zhakan' })}
          </Button>
        ),
    },
  ])

  const handlePreview = (record) => {
    setPreviewRow({ ...record })
    setPreviewVisible(true)
  }

  const removeExpert = (record) => {
    const hasExpertList = addSchemaAction.getFieldValue('expertExtractRecordList')
    const temp = hasExpertList.filter((item) => item.expert.id !== record.expert.id)
    addSchemaAction.setFieldValue('expertExtractRecordList', [...temp])
  }

  const handleSubmit = async (value) => {
    console.log(value)
    setBtnLoading(true)
    const inviteTenderId = value['inviteTender']['id']
    let _value = omit(value, [
      'code',
      'createTime',
      'openTenderTime',
      'projectName',
      'remarkTime',
      'status',
      'inviteTender',
    ])
    _value.inviteTender = { id: inviteTenderId }
    _value.expertExtractRecordList = value?.expertExtractRecordList?.length
      ? value.expertExtractRecordList.map((item) => {
          if (pageStatus === PageStatus.ADD) {
            return {
              expert: { id: item.expert.id },
              source: item.source,
              status: item.status,
            }
          } else {
            return {
              id: item.id,
              expert: { id: item.expert.id },
              source: item.source,
              status: item.status,
            }
          }
        })
      : []
    _value.expertExtractQueryList = value.expertExtractQueryList.map((item) => omit(item, ['excludeArea', 'needArea']))
    if (_value.expertExtractRecordList?.length) {
      postPurchaseExpertExtractSaveOrUpdateExpertExtract(_value).then((res) => {
        setBtnLoading(false)
        if (res.code === 1000) {
          history.goBack()
        }
      })
    } else {
      setBtnLoading(false)
      return message.error(intl.formatMessage({ id: 'table.purchase.qingxuanzezhuanjia' }))
    }
  }

  const handleClick = () => {
    setProjectVisible(true)
  }

  const editCondition = (t, r) => {
    setInitConditionFormValue(r)
    addConditionSchemaAction.setFieldValue('currentIndex', r.currentIndex)
    setConditionVisible(true)
  }

  const clickPreviewDetail = () => {
    history.push(
      `/procurementAbility/callForBids/callForBidsSearch/detail?id=${
        addSchemaAction.getFieldValue('inviteTender')['id']
      }`,
    )
  }

  const conditionExtractExpret = async () => {
    const expertExtractQueryList = addSchemaAction.getFieldValue('expertExtractQueryList')
    const { code, data } = await postPurchaseExpertGetBatchExpertList(expertExtractQueryList)
    if (code === 1000) {
      const fixedData = data.map((item) => ({
        id: item.id,
        source: item.source,
        status: 1,
        expert: { ...item },
      }))
      console.log(fixedData, 'fff')
      addSchemaAction.setFieldValue('expertExtractRecordList', fixedData)
    }
  }

  const addd = <span>{intl.formatMessage({ id: 'table.purchase.tianjiapingbiaonei' })}</span>

  const selectButton =
    pageStatus !== PageStatus.PREVIEW ? (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="connectBtn" onClick={handleClick}>
          <LinkOutlined style={{ marginRight: 4 }} />
          {intl.formatMessage({ id: 'table.purchase.xuanze' })}
        </div>
      </div>
    ) : null

  const JumpDetails = () => (
    <a target="_blank" onClick={clickPreviewDetail}>
      {initFormValue?.code || initFormValue?.inviteTender?.code}
    </a>
  )

  const selectExpertButton = pageStatus !== PageStatus.PREVIEW && (
    <Space size={16} style={{ marginBottom: 16 }}>
      <Button onClick={conditionExtractExpret} icon={<ThunderboltFilled />}>
        {intl.formatMessage({ id: 'table.purchase.antiaojianchouqu' })}
      </Button>
      <Button onClick={() => setExpertVisible(true)} icon={<PlusOutlined />}>
        {intl.formatMessage({ id: 'table.purchase.xuanzepingbiaozhuan' })}
      </Button>
    </Space>
  )

  const fetchData = (params: any) => {
    return new Promise((resolve, reject) => {
      postPurchaseInviteTenderGetEvaluationTenderList(
        {
          ...params,
        },
        { ctlType: 'none' },
      ).then((res) => {
        resolve(res.data)
      })
    })
  }

  const fetchExpertData = (params: any) => {
    return new Promise((resolve, reject) => {
      getPurchaseExpertGetExpertList({ ...params, status: true }, { ctlType: 'none' }).then((res) => {
        resolve(res.data)
      })
    })
  }

  const rowSelection: any = {
    type: 'radio',
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectRow(selectedRows)
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  const rowExpertSelection: any = {
    type: 'checkbox',
    selectedRowKeys: selectedExpertRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectExpertRow(selectedRows)
      setSelectedExpertRowKeys(selectedRowKeys)
    },
  }

  const onConfirm = () => {
    setProjectVisible(false)
    addSchemaAction.setFieldValue('inviteTender', { id: selectRow[0]['id'] })
    addSchemaAction.setFieldValue('status', selectRow[0]['inviteTenderInStatusValue'])
    addSchemaAction.setFieldValue('code', selectRow[0]['code'])
    addSchemaAction.setFieldValue('projectName', selectRow[0]['projectName'])
    addSchemaAction.setFieldValue('openTenderTime', formatTimeString(selectRow[0]['openTenderTime']))
    addSchemaAction.setFieldValue(
      'remarkTime',
      `${formatTimeString(selectRow[0]['evaluationStartTime'])} ~ ${formatTimeString(
        selectRow[0]['evaluationEndTime'],
      )}`,
    )
    addSchemaAction.setFieldValue('createTime', formatTimeString(selectRow[0]['createTime']))
  }

  const onExpertConfirm = () => {
    setExpertVisible(false)
    addSchemaAction.setFieldValue('expertExtractRecordList', transformSelectExpertField(selectExpertRow))
  }

  const handleSave = (row) => {
    return new Promise((resolve, reject) => {
      const newData = [...addSchemaAction.getFieldValue('expertExtractQueryList')]
      console.log(row, newData)
      const index = newData.findIndex((item) => row.currentIndex === item.currentIndex)
      const item = newData[index]
      newData.splice(index, 1, {
        ...item,
        ...row,
      })
      addSchemaAction.setFieldValue('expertExtractQueryList', newData)
      resolve({ item, newData })
    })
  }

  const onConditonClick = () => {
    addConditionSchemaAction.validate().then((res) => {
      if (res['errors']['length'] === 0) {
        addConditionSchemaAction.submit((v) => {
          handleSave(transformAreaField(v, 'submit'))
          setConditionVisible(false)
        })
      }
    })
  }

  const cancelCondition = () => {
    setConditionVisible(false)
  }

  return (
    <PageHeaderWrapper
      style={{ margin: 0 }}
      title={
        pageStatus === PageStatus.ADD
          ? intl.formatMessage({ id: 'table.purchase.xinzengzhuanjiachou' })
          : pageStatus === PageStatus.EDIT
          ? intl.formatMessage({ id: 'table.purchase.bianjizhuanjiachou' })
          : intl.formatMessage({ id: 'table.purchase.zhakanzhuanjiachou' })
      }
      extra={
        pageStatus === PageStatus.PREVIEW
          ? []
          : [
              <Button
                key="1"
                onClick={() => addSchemaAction.submit()}
                loading={btnLoading}
                type="primary"
                icon={<SaveOutlined />}
              >
                {intl.formatMessage({ id: 'table.purchase.baocun' })}
              </Button>,
            ]
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
            JumpDetails,
          }}
          effects={($, ctx) => {
            $('onFormMount').subscribe(() => {})
          }}
          expressionScope={{
            addd,
            selectButton,
            conditionColumns,
            selectExpertButton,
            memberColumns,
          }}
        />
      </Card>

      {/* 选择评标项目抽屉 */}
      <DrawerTable
        drawerTitle={intl.formatMessage({ id: 'table.purchase.xuanzepingbiaoxiang' })}
        confirm={onConfirm}
        cancel={() => setProjectVisible(false)}
        visible={projectVisible}
        columns={selectItemColumns}
        rowSelection={rowSelection}
        fetchTableData={(params: any) => fetchData(params)}
        formilyProps={{
          ctx: {
            schema: selectBidSchema,
            components: {
              DateRangePickerUnix,
              ModalSearch: Search,
              Submit,
            },
            effects: ($, actions) => {
              actions.reset()
              useStateFilterSearchLinkageEffect($, actions, 'inviteTenderCode', FORM_FILTER_PATH)
            },
          },
        }}
        tableProps={{
          rowKey: 'id',
        }}
      />

      {/* 组件条件 */}
      <Drawer
        width={600}
        title={intl.formatMessage({ id: 'table.purchase.zujiantiaojian' })}
        onClose={cancelCondition}
        visible={conditionVisible}
      >
        <NiceForm
          loading={formLoading}
          previewPlaceholder=" "
          editable={pageStatus !== PageStatus.PREVIEW}
          value={initConditionFormValue}
          effects={($, ctx) => {}}
          actions={addConditionSchemaAction}
          schema={conditionSchema}
        />
        <div style={{ height: 56, width: '100%' }}></div>
        <Row className="footer">
          <Col span={24}>
            <Space size={[16, 0]}>
              <Button type="primary" onClick={onConditonClick}>
                {intl.formatMessage({ id: 'table.purchase.baocun' })}
              </Button>
              <Button onClick={() => setConditionVisible(false)}>
                {intl.formatMessage({ id: 'table.purchase.quxiao' })}
              </Button>
            </Space>
          </Col>
        </Row>
      </Drawer>

      {/* 选择评标专家 */}
      <DrawerTable
        drawerTitle={intl.formatMessage({ id: 'table.purchase.xuanzepingbiaozhuan' })}
        confirm={onExpertConfirm}
        cancel={() => setExpertVisible(false)}
        visible={expertVisible}
        columns={selectExpertColumns}
        rowSelection={rowExpertSelection}
        fetchTableData={(params: any) => fetchExpertData(params)}
        formilyProps={{
          ctx: {
            schema: selectExpertSchema,
            components: { ModalSearch: Search, Submit },
            effects: ($, actions) => {
              actions.reset()
              useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
            },
          },
        }}
        tableProps={{
          rowKey: 'id',
        }}
      />

      {/* 查看评标专家 */}
      <Drawer
        width={400}
        title={intl.formatMessage({ id: 'table.purchase.zhakanpingbiaozhuan' })}
        onClose={() => setPreviewVisible(false)}
        visible={previewVisible}
      >
        <Row className="card-list">
          <Col span={6} className="card-list_title">
            {intl.formatMessage({ id: 'table.purchase.pingbiaozhuanjiabian' })}:
          </Col>
          <Col>{preViewRow?.id}</Col>
        </Row>
        <Row className="card-list">
          <Col span={6} className="card-list_title">
            {intl.formatMessage({ id: 'table.purchase.zhuanjiazhuanyelei' })}:
          </Col>
          <Col>{preViewRow?.expert?.speciality ? SpecialityTypeMap[preViewRow.expert.speciality] : null}</Col>
        </Row>
        <Row className="card-list">
          <Col span={6} className="card-list_title">
            {intl.formatMessage({ id: 'table.purchase.zhuanjiazigezheng' })}:
          </Col>
          <Col>{preViewRow?.expert?.qualification}</Col>
        </Row>
        <Row className="card-list">
          <Col span={6} className="card-list_title">
            {intl.formatMessage({ id: 'table.purchase.zhuanjiazhuanjiazhi' })}:
          </Col>
          <Col>{preViewRow?.expert?.title}</Col>
        </Row>
        <Row className="card-list">
          <Col span={6} className="card-list_title">
            {intl.formatMessage({ id: 'table.purchase.congshinianxian' })}:
          </Col>
          <Col>{preViewRow?.expert?.years}</Col>
        </Row>
        <Row className="card-list">
          <Col span={6} className="card-list_title">
            {intl.formatMessage({ id: 'table.purchase.suoshuhangye' })}:
          </Col>
          <Col>{preViewRow?.expert?.trade}</Col>
        </Row>
        <Row className="card-list">
          <Col span={6} className="card-list_title">
            {intl.formatMessage({ id: 'table.purchase.suozaidiqu' })}:
          </Col>
          <Col>{`${preViewRow?.expert?.provinceName}/${preViewRow?.expert?.cityName}/${preViewRow?.expert?.areaName}`}</Col>
        </Row>
        <Row className="card-list">
          <Col span={6} className="card-list_title">
            {intl.formatMessage({ id: 'table.purchase.gongzuodanwei' })}:
          </Col>
          <Col>{preViewRow?.expert?.unit}</Col>
        </Row>
        <Row className="card-list">
          <Col span={6} className="card-list_title">
            {intl.formatMessage({ id: 'table.purchase.zhuanjialeixing' })}:
          </Col>
          <Col>{preViewRow?.expert?.type ? ExpertTypeMap[preViewRow.expert.type] : null}</Col>
        </Row>
      </Drawer>
    </PageHeaderWrapper>
  )
}

AddRemarkBidCommittee.defaultProps = {}

export default AddRemarkBidCommittee
