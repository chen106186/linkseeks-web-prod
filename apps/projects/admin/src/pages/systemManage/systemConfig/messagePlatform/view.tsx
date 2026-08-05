import React, { useState, useEffect, Fragment, useCallback } from 'react'
import { Card, Modal, message, Row, Col, Select, Form, Input, Table, Popconfirm, Button } from '@linkseeks/ui'
import { PlusOutlined } from '@ant-design/icons'
import { ChevronUpFillIcon, ChevronDownFillIcon } from '@linkseeks/icons'
import { ColumnType } from 'antd/lib/table/interface'
import { PageHeaderWrapper } from '@apps/components'
import cx from 'classnames'
import {
  getSupportSmsGetSmsConfigList,
  postSupportSmsUpdateSmsConfigStatus,
  getSupportSmsGetParamCode,
  postSupportSmsSaveOrUpdateSmsConfig,
  postSupportSmsDeleteSmsConfig,
  postSupportSmsDeleteSmsTemplate,
  postSupportSmsSaveOrUpdateSmsTemplate,
  getSupportSmsGetModuleCode,
  getSupportSmsGetSmsTemplateList,
  getMemberRealNameConfigGetConfigList,
  getMemberRealNameConfigGetParamCode,
  postMemberRealNameConfigSaveOrUpdateConfig,
  postMemberRealNameConfigDeleteConfig,
  getManageLocationConfigGetConfigList,
  postManageLocationConfigSaveOrUpdateConfig,
  postSupportCustomerServiceConfigSaveOrUpdateConfig,
  getSupportCustomerServiceConfigGetConfigList,
  postSupportCustomerServiceConfigUpdateStatus,
  postSupportFileGetFileConfigList,
  postSupportFileStatus,
  getSupportFileGetParamCode,
  postSupportFileUpdateConfig,
  postSupportFileDeleteParamCode,
} from '@apps/apis'
import type {
  GetSupportSmsGetSmsTemplateListResponseDetail,
  GetManageLocationConfigGetConfigListResponse,
  GetSupportCustomerServiceConfigGetConfigListResponse,
} from '@apps/apis'
import { encryptedByAES } from '@linkseeks/crypto'
import styles from './index.less'
import isEmpty from 'lodash/isEmpty'
import { useLanguage } from '@apps/domains'
import CustomerService from './customerService'

const { TextArea } = Input

interface Item {
  key: string
  value: string
  description: string
}

interface SmsConfigType {
  id: number
  code: string
  value: string
  remark: string
  serviceType: number
}

interface OptionType {
  label: string
  value: string
}

const layout: any = {
  colon: false,
  labelCol: { style: { width: '100px' } },
  labelAlign: 'left',
}

const defaultSmsConfigList = [
  {
    id: 1,
    config: {},
    serviceType: 2,
    status: false,
  },
  {
    id: 2,
    config: {},
    serviceType: 1,
    status: false,
  },
]

const defaultRealNameConfigList: any = [
  {
    id: 1,
    config: {},
    serviceType: 1,
    status: true,
  },
]

const defaultLocationConfigList: any = [
  {
    serviceType: 1,
    appKey: '',
    status: true,
  },
]
const defaultCustomerConfigList: any = [
  {
    serviceType: 1,
    appKey: '',
    status: false,
  },
]
const SMS_TITLE_MAP = {
  1: '腾讯云短信平台',
  2: '阿里云短信平台',
}

const REALNAME_TITLE_MAP = {
  1: '百度云实名认证',
}

const LOCATION_TITLE_MAP = {
  1: '腾讯地理位置服务',
}
const CUSTOMER_TITLE_MAP = {
  1: '网易七鱼客服',
}
type TAB_ACTIVE_KEY = 'message' | 'verified' | 'location' | 'customer' | 'oss'

const MessagePlatform: React.FC<{}> = () => {
  const [paramsForm] = Form.useForm()
  const [templateForm] = Form.useForm()
  const [locationForm] = Form.useForm()
  const [customerForm] = Form.useForm()

  const [addParamsVisible, setAddParamsVisible] = useState(false)
  const [addTemplateVisible, setAddTemplateVisible] = useState(false)
  const [templateData, setTemplateData] = useState<Record<number, GetSupportSmsGetSmsTemplateListResponseDetail[]>>({})
  const [aliTemplateData, setAliTemplateData] = useState<GetSupportSmsGetSmsTemplateListResponseDetail[]>([])
  const [formData, setFormData] = useState<any>(null)
  const [txCollapse, setTxCollapse] = useState<boolean>(true)
  const [aliCollapse, setAliCollapse] = useState<boolean>(true)
  const [ossCollapse, setOssCollapse] = useState<number>()
  const [baiduRealNameCollapse, setBaiduRealNameCollapse] = useState<boolean>(false)
  const [paramCodes, setParamCodes] = useState<OptionType[]>([])
  const [modeCodes, setModeCodes] = useState<any[]>([])
  const [smsConfigList, setSmsConfigList] = useState<any[]>([])
  const [realNameConfigList, setRealNameConfigList] = useState<any[]>(defaultRealNameConfigList)
  const [locationConfigList, setLocationConfigList] =
    useState<GetManageLocationConfigGetConfigListResponse>(defaultLocationConfigList)
  const [customerConfigList, setCustomerConfigList] =
    useState<GetSupportCustomerServiceConfigGetConfigListResponse>(defaultCustomerConfigList)
  const [ossConfigList, setOssConfigList] = useState<any[]>([])

  const [activeTabKey, setActiveTabKey] = useState<TAB_ACTIVE_KEY>('message')
  const [confirmLoading, setComfirmLoading] = useState<boolean>(false)
  const [locationSubmitLoading, setLocationSubmitLoading] = useState<boolean>(false)
  const [customeSubmitLoading, setCustomeSubmitLoading] = useState<boolean>(false)

  const { languageList } = useLanguage()

  const fetchConfigList = useCallback(async () => {
    const CONFIG_API = {
      message: getSupportSmsGetSmsConfigList,
      verified: getMemberRealNameConfigGetConfigList,
      location: getManageLocationConfigGetConfigList,
      customer: getSupportCustomerServiceConfigGetConfigList,
      oss: postSupportFileGetFileConfigList,
    }
    if (CONFIG_API[activeTabKey]) {
      const res = await CONFIG_API[activeTabKey]({}, { ctlType: 'none' })
      if (res.code === 1000 && res.data && res.data.length > 0) {
        switch (activeTabKey) {
          case 'message':
            if (res.data && res.data.length > 0) {
              setSmsConfigList([])
              const newSmsConfigList = res.data.map((item) => {
                if (smsConfigList.length > 0) {
                  return {
                    ...item,
                    collapse: smsConfigList.find((child) => child.serviceType === item.serviceType)?.collapse,
                  }
                } else {
                  return {
                    ...item,
                    collapse: item.status ? false : true,
                  }
                }
              })
              setSmsConfigList(newSmsConfigList)
              reloadTplTable(res.data.map((item) => item.serviceType))
            }
            break
          case 'verified':
            setRealNameConfigList(
              realNameConfigList.map((item) => {
                const findItem = res.data.find((child) => child.serviceType === item.serviceType)
                if (findItem) {
                  return findItem
                }
                return item
              }),
            )
            break
          case 'location':
            const configList = locationConfigList.map((item) => {
              const findItem = res.data.find((child) => child.serviceType === item.serviceType)
              if (findItem) {
                return findItem
              }
              return item
            }) as GetManageLocationConfigGetConfigListResponse
            if (configList.length > 0 && configList[0].appKey) {
              locationForm.setFieldValue('appKey', configList[0].appKey)
            }
            setLocationConfigList(configList)
            break
          case 'customer':
            const customerList = customerConfigList.map((item) => {
              const findItem = res.data.find((child) => child.serviceType === item.serviceType)
              if (findItem) {
                return findItem
              }
              return item
            }) as GetSupportCustomerServiceConfigGetConfigListResponse
            if (customerList.length > 0 && customerList[0].appKey) {
              customerForm.setFieldValue('appKey', customerList[0].appKey)
            }
            setCustomerConfigList(customerList)
            break
          case 'oss':
            setOssConfigList(res.data)
            break
          default:
            break
        }
      }
    }
  }, [activeTabKey, smsConfigList, realNameConfigList])

  useEffect(() => {
    fetchConfigList()
  }, [activeTabKey])

  // 重置表格数据
  const reloadCommonTable = () => {
    fetchConfigList()
  }

  const reloadTplTable = async (serviceTypeList: number[]) => {
    const tempTemplateData: Record<number, GetSupportSmsGetSmsTemplateListResponseDetail[]> = {}
    for (const serviceType of serviceTypeList) {
      const res = await getSupportSmsGetSmsTemplateList({
        serviceType: String(serviceType),
        current: '1',
        pageSize: '99',
      })
      const { data } = res
      tempTemplateData[serviceType] = data.data
    }
    setTemplateData(tempTemplateData)
  }

  // 提交表单
  const onPublicFinish = (values) => {
    const params = {
      ...values,
    }
    const SAVE_API = {
      message: postSupportSmsSaveOrUpdateSmsConfig,
      verified: postMemberRealNameConfigSaveOrUpdateConfig,
      oss: postSupportFileUpdateConfig,
    }
    if (SAVE_API[activeTabKey]) {
      setComfirmLoading(true)
      if (activeTabKey === 'oss') {
        params.fileClientType = values.serviceType
      }
      SAVE_API[activeTabKey](params)
        .then(() => {
          paramsForm.resetFields()
          setAddParamsVisible(false)
          reloadCommonTable()
          setComfirmLoading(false)
        })
        .catch(() => {
          setComfirmLoading(false)
        })
    }
  }

  const onTplFinish = (values) => {
    const params = formData
      ? {
          ...values,
          id: formData.id,
        }
      : values
    postSupportSmsSaveOrUpdateSmsTemplate(params).then(() => {
      templateForm.resetFields()
      setAddTemplateVisible(false)
      reloadTplTable([values?.serviceType])
    })
  }

  // 点击弹窗确认触发
  const handleAddParamsOk = () => {
    paramsForm.submit()
  }
  const handleAddTemplateOk = () => {
    templateForm.submit()
  }

  // type = 1为公共参数，type = 2 为模板删除
  const handleDelete = async (type: number, record: any) => {
    if (type === 1) {
      const CONFIG_DELETE_API = {
        message: postSupportSmsDeleteSmsConfig,
        verified: postMemberRealNameConfigDeleteConfig,
        oss: postSupportFileDeleteParamCode,
      }
      if (CONFIG_DELETE_API[activeTabKey]) {
        const param: any = {
          code: record?.code,
        }
        if (activeTabKey === 'oss') {
          param.fileClientType = record?.serviceType
        } else {
          param.serviceType = record?.serviceType
        }
        await CONFIG_DELETE_API[activeTabKey](param)
        reloadCommonTable()
      }
    } else {
      await postSupportSmsDeleteSmsTemplate({ id: record?.id })
      reloadTplTable([1, 2])
    }
  }

  const publicColumns: ColumnType<any>[] = [
    {
      title: '参数代码',
      dataIndex: 'code',
      key: 'code',
      width: '10%',
      align: 'center',
    },
    {
      title: '参数值',
      dataIndex: 'value',
      key: 'value',
      width: '28%',
      align: 'center',
    },
    {
      title: '参数描述',
      dataIndex: 'remark',
      key: 'remark',
      width: '42%',
      align: 'center',
    },
    {
      title: '操作',
      key: 'ctl',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          <>
            <Button style={{ paddingLeft: 0 }} type="link" onClick={() => handleModify(record, 'CM')}>
              修改
            </Button>
            <Popconfirm title="确定要删除？" okText="是" cancelText="否" onConfirm={() => handleDelete(1, record)}>
              <Button style={{ paddingLeft: 0 }} type="link">
                删除
              </Button>
            </Popconfirm>
          </>
        )
      },
    },
  ]
  const templateColumns: ColumnType<GetSupportSmsGetSmsTemplateListResponseDetail>[] = [
    {
      title: '适用场景',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '模板ID/CODE',
      key: 'templateId',
      dataIndex: 'templateId',
      align: 'center',
    },
    {
      title: '关联语言',
      key: 'language',
      dataIndex: 'language',
      align: 'center',
    },
    {
      title: '模板内容',
      key: 'templateContent',
      dataIndex: 'templateContent',
      align: 'center',
    },
    {
      title: '操作',
      key: 'ctl1',
      dataIndex: 'operation',
      render: (text: any, record) => {
        return (
          <>
            <Button type="link" onClick={() => handleModify(record, 'TP')}>
              修改
            </Button>
            <Popconfirm title="确定要删除？" okText="是" cancelText="否" onConfirm={() => handleDelete(2, record)}>
              <Button type="link">删除</Button>
            </Popconfirm>
          </>
        )
      },
    },
  ]

  // 唤起弹窗
  const handleAddCommonConfig = async (serviceType: string) => {
    setFormData(null)
    const PARAM_CODE_API = {
      message: getSupportSmsGetParamCode,
      verified: getMemberRealNameConfigGetParamCode,
      oss: getSupportFileGetParamCode,
    }

    if (PARAM_CODE_API[activeTabKey]) {
      const params: Record<string, string> = {}
      if (activeTabKey === 'oss') {
        params.fileClientType = serviceType
      } else {
        params.serviceType = serviceType
      }
      const { code, data, message: msg } = await PARAM_CODE_API[activeTabKey](params)
      if (code === 1000) {
        setAddParamsVisible(true)
        paramsForm.setFieldValue('serviceType', serviceType)
        setParamCodes(
          data.map((v) => ({
            label: v.value,
            value: v.key,
          })),
        )
      } else {
        message.error(msg)
      }
    }
  }

  const handleAddTemplateConfig = (serviceType: number) => {
    setFormData(null)
    templateForm.setFieldValue('serviceType', serviceType)
    handleModelOpen()
  }

  const handleModify = (record, params: string) => {
    // 通过传入的params字符串判断是修改那种类型的数据
    setFormData(record)
    templateForm.setFieldValue('serviceType', record?.serviceType)
    if (params === 'CM') {
      setAddParamsVisible(true)
      paramsForm.setFieldsValue(record)
    } else {
      handleModelOpen()
      templateForm.setFieldsValue(record)
    }
  }

  const handleModelOpen = async () => {
    const { code, data } = await getSupportSmsGetModuleCode()
    if (code === 1000) {
      setModeCodes(
        data.map((v) => ({
          label: v.value,
          value: v.key,
        })),
      )
      setAddTemplateVisible(true)
    }
  }

  const CollapseStyle: React.CSSProperties = {
    height: 0,
    overflow: 'hidden',
    padding: 0,
  }

  /**
   * 启用/停用事件
   * @param serviceType 服务商类型: 1-腾讯云，2-阿里云
   * @param status true: 启用；false：禁用
   */
  const handleChangeConfigStatus = (serviceType: number, status: boolean) => {
    const currentConfig = smsConfigList.find((item) => item.serviceType === serviceType)
    if (currentConfig) {
      if (status) {
        // 启用短信平台时，需要校验必须至少有一个公共参数配置，不允许公共参数配置完全为空。否则提示【启用短信平台前，请先新增公共参数配置】
        if (isEmpty(currentConfig.config)) {
          message.destroy()
          message.error('启用短信平台前，请先新增公共参数配置')
          return
        }
        Modal.confirm({
          title: '启用新的短信平台可能会造成旧的短信平台停用，确认要把启用当前带短信平台？',
          onOk: () => {
            updateConfigStatus(serviceType)
          },
        })
      } else {
        updateConfigStatus(serviceType)
      }
    }
  }

  /**
   * 启用/停用事件
   * @param status true: 启用；false：禁用
   */
  const handleChangeOssConfigStatus = (fileClientType: number, status: boolean) => {
    const currentConfig = ossConfigList.find((item) => item.fileClientType === fileClientType)
    if (currentConfig) {
      if (status) {
        // 启用短信平台时，需要校验必须至少有一个公共参数配置，不允许公共参数配置完全为空。否则提示【启用短信平台前，请先新增公共参数配置】
        if (isEmpty(currentConfig.config)) {
          message.destroy()
          message.error('启用OSS平台前，请先新增公共参数配置')
          return
        }
        Modal.confirm({
          title: '启用新的OSS平台可能会造成旧的OSS平台停用，确认要把启用当前带OSS平台？',
          onOk: () => {
            updateOSSConfigStatus(fileClientType)
          },
        })
      } else {
        updateOSSConfigStatus(fileClientType)
      }
    }
  }

  /**
   * 更新短信平台启用停用状态
   * @param serviceType 服务商类型: 1-腾讯云，2-阿里云
   */
  const updateConfigStatus = (serviceType: number) => {
    return new Promise((resolve) => {
      postSupportSmsUpdateSmsConfigStatus({ serviceType }).then((res) => {
        if (res.code !== 1000) {
          message.destroy()
          message.error(res.message)
        } else {
          reloadCommonTable()
        }
        resolve(true)
      })
    })
  }

  /**
   * 更新OSS平台启用停用状态
   * @param serviceType 服务商类型: 1-腾讯云，2-阿里云
   */
  const updateOSSConfigStatus = (fileClientType: number) => {
    return new Promise((resolve) => {
      postSupportFileStatus({ fileClientType }).then((res) => {
        if (res.code !== 1000) {
          message.error(res.message)
        } else {
          reloadCommonTable()
        }
        resolve(true)
      })
    })
  }

  /**
   * 更新七鱼启用停用状态
   * @param serviceType 服务商类型: 1-网易七鱼
   */
  const updateCustomerConfigStatus = (serviceType: any, status: boolean) => {
    return new Promise((resolve) => {
      postSupportCustomerServiceConfigUpdateStatus({ serviceType, status }).then((res) => {
        if (res.code !== 1000) {
          message.error(res.message)
        } else {
          reloadCommonTable()
        }
        resolve(true)
      })
    })
  }
  /**
   * 格式化公共参数配置表格数据
   */
  const formaConfigTableData = (value: Record<string, string> | {}, serviceType: number) => {
    if (value && Object.keys(value).length > 0) {
      const result: SmsConfigType[] = []
      Object.keys(value).forEach((key, index) => {
        result.push({
          id: index,
          code: key,
          value: value[key].split('|')[0],
          remark: value[key].split('|')[1],
          serviceType,
        })
      })
      return result
    }
    return []
  }

  /**
   * 格式化模板参数配置表格数据
   */
  const formaTemplateConfigTableData = (value: any[], serviceType: number) => {
    if (value && value.length > 0) {
      return value.map((item) => ({
        ...item,
        serviceType,
      }))
    }
    return []
  }

  /**
   * 保存定位信息
   */
  const handlePostionSubmit = () => {
    locationForm.validateFields().then((values) => {
      setLocationSubmitLoading(true)
      postManageLocationConfigSaveOrUpdateConfig(values).then((res) => {
        setLocationSubmitLoading(false)
        if (res.code !== 1000) {
          message.destroy()
          message.error(res.message)
        } else {
          reloadCommonTable()
        }
      })
    })
  }
  /**
   * 保存七鱼信息
   */
  const handleCustomerSubmit = () => {
    customerForm.validateFields().then((values) => {
      setCustomeSubmitLoading(true)
      postSupportCustomerServiceConfigSaveOrUpdateConfig(values).then((res) => {
        setCustomeSubmitLoading(false)
        if (res.code !== 1000) {
          message.destroy()
          message.error(res.message)
        } else {
          reloadCommonTable()
        }
      })
    })
  }

  const items = [
    {
      key: 'message',
      label: '短信平台参数',
    },
    {
      key: 'verified',
      label: '实名认证参数',
    },
    {
      key: 'location',
      label: '地理位置参数',
    },
    {
      key: 'customer',
      label: '在线客服',
    },
    {
      key: 'oss',
      label: '对象存储服务OSS',
    },
  ]

  return (
    <PageHeaderWrapper items={items} isTabs onTabChange={(key) => setActiveTabKey(key as TAB_ACTIVE_KEY)}>
      {activeTabKey === 'message' && (
        <Fragment>
          {smsConfigList.map((item) => (
            <Card
              key={item.id}
              title={
                <div
                  className={styles['card-title']}
                  onClick={() => {
                    setSmsConfigList(
                      smsConfigList.map((_item) => {
                        if (_item.serviceType === item.serviceType) {
                          return { ..._item, collapse: !_item.collapse }
                        } else {
                          return _item
                        }
                      }),
                    )
                  }}
                >
                  {!item.collapse ? (
                    <ChevronDownFillIcon className={styles['card-title-icon']} size={16} />
                  ) : (
                    <ChevronUpFillIcon className={styles['card-title-icon']} size={16} />
                  )}
                  <span>{item.configName}</span>
                  <div className={cx(styles['card-title-status'], item.status ? styles.use : styles.stop)}>
                    <div className={styles['card-title-status-circle']}></div>
                    <span className={styles['card-title-status-text']}>{item.status ? '已启用' : '停用中'}</span>
                  </div>
                </div>
              }
              extra={
                item.status ? (
                  <Button danger type="primary" onClick={() => handleChangeConfigStatus(item.serviceType, false)}>
                    停用
                  </Button>
                ) : (
                  <Button type="primary" onClick={() => handleChangeConfigStatus(item.serviceType, true)}>
                    启用
                  </Button>
                )
              }
              bordered={false}
              style={{
                marginBottom: 16,
                paddingBottom: 16,
              }}
              bodyStyle={item.collapse ? CollapseStyle : {}}
            >
              <Row gutter={[36, 36]} className="member-menu-box">
                <Col span={24}>
                  <h6 className="mb-30">公共参数配置</h6>
                  <Table
                    rowKey="id"
                    columns={publicColumns}
                    dataSource={formaConfigTableData(item.config, item.serviceType)}
                    pagination={false}
                  />
                  <Button
                    onClick={() => handleAddCommonConfig(String(item.serviceType))}
                    icon={<PlusOutlined />}
                    style={{ marginBottom: 16, marginTop: 16, width: '100%' }}
                  >
                    新增参数配置
                  </Button>
                </Col>
                <Col span={24}>
                  <h6 className="mb-30">模板参数配置</h6>
                  <Table
                    rowKey="id"
                    columns={templateColumns}
                    dataSource={formaTemplateConfigTableData(templateData[item.serviceType] || [], item.serviceType)}
                    pagination={false}
                  />
                  <Button
                    onClick={() => handleAddTemplateConfig(item.serviceType)}
                    icon={<PlusOutlined />}
                    style={{ marginBottom: 16, marginTop: 16, width: '100%' }}
                  >
                    新增模板参数
                  </Button>
                </Col>
              </Row>
            </Card>
          ))}
          <Modal
            title={`${formData ? '修改' : '新增'}模板参数`}
            open={addTemplateVisible}
            onOk={handleAddTemplateOk}
            onCancel={() => {
              templateForm.resetFields()
              setAddTemplateVisible(false)
            }}
            okText="确认"
            cancelText="取消"
            forceRender
          >
            <Form form={templateForm} name="add_template" onFinish={onTplFinish} {...layout}>
              <Form.Item name="serviceType" label="服务商类型" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                name="code"
                label="适用场景"
                rules={[
                  {
                    required: true,
                    message: '请选择适用场景',
                  },
                ]}
              >
                <Select options={modeCodes} placeholder="请选择适用场景" />
              </Form.Item>
              <Form.Item
                name="templateId"
                label="模板ID/CODE"
                rules={[
                  {
                    required: true,
                    message: '输入参数代码!',
                  },
                ]}
              >
                <Input placeholder="输入模板ID/CODE" />
              </Form.Item>
              <Form.Item
                name="language"
                label="关联语言"
                rules={[
                  {
                    required: true,
                    message: '选择关联语言!',
                  },
                ]}
              >
                <Select
                  placeholder="请选择关联语言"
                  options={
                    languageList && languageList.length > 0
                      ? languageList.map((item) => ({
                          label: `${item.language}（${item.key}）`,
                          value: item.key,
                        }))
                      : []
                  }
                />
              </Form.Item>
              <Form.Item
                name="templateContent"
                label="模板内容"
                rules={[
                  {
                    required: true,
                    message: '输入模板内容!',
                  },
                ]}
              >
                <TextArea rows={4} maxLength={256} placeholder="最长256个字符" />
              </Form.Item>
            </Form>
          </Modal>
        </Fragment>
      )}
      {activeTabKey === 'verified' && (
        <Fragment>
          {realNameConfigList.map((item) => (
            <Card
              key={item.id}
              title={
                <div
                  className={styles['card-title']}
                  onClick={() => {
                    setBaiduRealNameCollapse(!baiduRealNameCollapse)
                  }}
                >
                  {baiduRealNameCollapse ? (
                    <ChevronDownFillIcon className={styles['card-title-icon']} size={16} />
                  ) : (
                    <ChevronUpFillIcon className={styles['card-title-icon']} size={16} />
                  )}
                  <span>{REALNAME_TITLE_MAP[item.serviceType]}</span>
                  <div className={cx(styles['card-title-status'], item.status ? styles.use : styles.stop)}>
                    <div className={styles['card-title-status-circle']}></div>
                    <span className={styles['card-title-status-text']}>{item.status ? '已启用' : '停用中'}</span>
                  </div>
                </div>
              }
              bordered={false}
              bodyStyle={baiduRealNameCollapse ? CollapseStyle : {}}
              style={{
                marginBottom: 16,
              }}
            >
              <Row gutter={[36, 36]} className="member-menu-box">
                <Col span={24}>
                  <Table
                    rowKey="id"
                    columns={publicColumns}
                    dataSource={formaConfigTableData(item.config, item.serviceType)}
                    pagination={false}
                  />
                  <Button
                    onClick={() => handleAddCommonConfig(String(item.serviceType))}
                    icon={<PlusOutlined />}
                    style={{ marginBottom: 16, marginTop: 16, width: '100%' }}
                  >
                    新增参数配置
                  </Button>
                </Col>
              </Row>
            </Card>
          ))}
        </Fragment>
      )}
      {activeTabKey === 'location' && (
        <Fragment>
          <Form form={locationForm} {...layout}>
            {locationConfigList.map((item) => (
              <Card
                key={item.serviceType}
                title={LOCATION_TITLE_MAP[item.serviceType]}
                bordered={false}
                extra={
                  <Button type="primary" loading={locationSubmitLoading} onClick={handlePostionSubmit}>
                    保存
                  </Button>
                }
                style={{
                  marginBottom: 16,
                  paddingBottom: 16,
                }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="serviceType" initialValue={item.serviceType} hidden>
                      <Input placeholder="请输入" />
                    </Form.Item>
                    <Form.Item
                      name="appKey"
                      label="定位应用ID"
                      initialValue={item.appKey}
                      rules={[
                        {
                          required: true,
                          message: '请输入定位应用ID',
                        },
                      ]}
                    >
                      <Input placeholder="请输入" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            ))}
          </Form>
        </Fragment>
      )}
      {/* 客服 */}
      {activeTabKey === 'customer' && <CustomerService />}
      {activeTabKey === 'oss' && (
        <Fragment>
          {ossConfigList.map((item) => (
            <Card
              key={item.id}
              title={
                <div
                  className={styles['card-title']}
                  onClick={() => {
                    if (item.fileClientType !== ossCollapse) {
                      setOssCollapse(item.fileClientType)
                    } else {
                      setOssCollapse(undefined)
                    }
                  }}
                >
                  {item.fileClientType === ossCollapse ? (
                    <ChevronDownFillIcon className={styles['card-title-icon']} size={16} />
                  ) : (
                    <ChevronUpFillIcon className={styles['card-title-icon']} size={16} />
                  )}
                  <span>{item.configName}</span>
                  <div className={cx(styles['card-title-status'], item.status ? styles.use : styles.stop)}>
                    <div className={styles['card-title-status-circle']}></div>
                    <span className={styles['card-title-status-text']}>{item.status ? '已启用' : '停用中'}</span>
                  </div>
                </div>
              }
              extra={
                item.status ? (
                  <Button danger type="primary" onClick={() => handleChangeOssConfigStatus(item.fileClientType, false)}>
                    停用
                  </Button>
                ) : (
                  <Button type="primary" onClick={() => handleChangeOssConfigStatus(item.fileClientType, true)}>
                    启用
                  </Button>
                )
              }
              bordered={false}
              style={{
                marginBottom: 16,
                paddingBottom: 16,
              }}
              bodyStyle={item.fileClientType !== ossCollapse ? CollapseStyle : {}}
            >
              <Row gutter={[36, 36]} className="member-menu-box">
                <Col span={24}>
                  <h6 className="mb-30">公共参数配置</h6>
                  <Table
                    rowKey="id"
                    columns={publicColumns}
                    dataSource={formaConfigTableData(item.config, item.fileClientType)}
                    pagination={false}
                  />
                  <Button
                    onClick={() => handleAddCommonConfig(String(item.fileClientType))}
                    icon={<PlusOutlined />}
                    style={{ marginBottom: 16, marginTop: 16, width: '100%' }}
                  >
                    新增参数配置
                  </Button>
                </Col>
              </Row>
            </Card>
          ))}
          <Modal
            title={`${formData ? '修改' : '新增'}模板参数`}
            open={addTemplateVisible}
            onOk={handleAddTemplateOk}
            onCancel={() => {
              templateForm.resetFields()
              setAddTemplateVisible(false)
            }}
            okText="确认"
            cancelText="取消"
            forceRender
          >
            <Form form={templateForm} name="add_template" onFinish={onTplFinish} {...layout}>
              <Form.Item name="serviceType" label="服务商类型" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                name="code"
                label="适用场景"
                rules={[
                  {
                    required: true,
                    message: '请选择适用场景',
                  },
                ]}
              >
                <Select options={modeCodes} placeholder="请选择适用场景" />
              </Form.Item>
              <Form.Item
                name="templateId"
                label="模板ID/CODE"
                rules={[
                  {
                    required: true,
                    message: '输入参数代码!',
                  },
                ]}
              >
                <Input placeholder="输入模板ID/CODE" />
              </Form.Item>
              <Form.Item
                name="language"
                label="关联语言"
                rules={[
                  {
                    required: true,
                    message: '选择关联语言!',
                  },
                ]}
              >
                <Select
                  placeholder="请选择关联语言"
                  options={
                    languageList && languageList.length > 0
                      ? languageList.map((item) => ({
                          label: `${item.language}（${item.key}）`,
                          value: item.key,
                        }))
                      : []
                  }
                />
              </Form.Item>
              <Form.Item
                name="templateContent"
                label="模板内容"
                rules={[
                  {
                    required: true,
                    message: '输入模板内容!',
                  },
                ]}
              >
                <TextArea rows={4} maxLength={128} placeholder="最长128个字符" />
              </Form.Item>
            </Form>
          </Modal>
        </Fragment>
      )}
      <Modal
        title={`${formData ? '修改' : '新增'}参数配置`}
        open={addParamsVisible}
        onOk={handleAddParamsOk}
        confirmLoading={confirmLoading}
        onCancel={() => {
          paramsForm.resetFields()
          setAddParamsVisible(false)
        }}
        okText="确认"
        cancelText="取消"
        forceRender
      >
        <Form form={paramsForm} name="add_config" onFinish={onPublicFinish} {...layout}>
          <Form.Item name="serviceType" label="服务商类型" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="参数代码"
            rules={[
              {
                required: true,
                message: '输入参数代码!',
              },
            ]}
          >
            <Select options={paramCodes} placeholder="输入参数代码" />
          </Form.Item>
          <Form.Item
            name="value"
            label="参数值"
            rules={[
              {
                required: true,
                message: '输入参数值!',
              },
            ]}
          >
            <Input placeholder="输入参数值" />
          </Form.Item>
          <Form.Item
            name="remark"
            label="参数描述"
            rules={[
              {
                required: true,
                message: '输入参数描述!',
              },
            ]}
          >
            <TextArea rows={4} placeholder="最长128个字符" maxLength={128} />
          </Form.Item>
        </Form>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default MessagePlatform
