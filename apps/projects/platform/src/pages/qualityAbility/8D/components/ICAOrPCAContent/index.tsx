/**
 *  ica审核的内容模块
 * @author: ganke
 */
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import AuditProcess from '@/components/AuditProcess'
import ListLayout from '@/pages/transaction/components/detailLayout/components/listLayout'
import { Button, DatePicker, Input, InputNumber, Space, Switch, Tag, Upload, Form, Table, Badge } from 'antd'
import BasicLayoutCard from '../BasicLayoutCard'
import BasicLayoutUnCard from '../BasicLayoutUnCard'
import { ColumnType } from 'antd/lib/table'
import { DeleteOutlined, EditOutlined, TagsOutlined, UploadOutlined } from '@ant-design/icons'
import { postOrderEightDRectificationEnumOuters } from '@apps/apis'
import { UPLOAD_TYPE } from '@/constants'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import {
  beforeDocUpload,
  groupColumnsDesc,
  initBasicData,
  initProblemData,
  innerColumnsAfter,
  innerColumnsFront,
  messageErr,
  temporaryColumnsDesc,
  userListColumns,
  verifyColumns,
} from './contentFn'
import DrawerTable from '@/components/DrawerTable'
import MellowCard from '@/components/MellowCard'
import { postMemberUserEightList } from '@apps/apis'
import { TableRowSelection } from 'antd/lib/table/interface'
import AddTemaTableModal from '../AddTemaTableModal'
import usePrompt from '@/hooks/usePrompt'
import { authService } from '@apps/services'
import { RangePickerProps } from 'antd/lib/date-picker'
import moment from 'moment'
import style from './index.less'
import deepClone from 'clone'
import { Card } from '@linkseeks/ui'
import { EIGHTD_EX_STATUS_TAG_TYPE, EIGHTD_IN_STATUS_BADGE_TYPE } from '../../constant'
import StatusTag from '@/components/StatusTag'
import TableModal from '@/pages/transaction/components/tableModal'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { querySchema } from './schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { downloadFileByNameAndUrl } from '@apps/utils'

export interface ICAOrPCAContentType {
  children?: React.ReactNode
  message?: any
  shouldurlsBtn?: boolean // 附件是否显示上传btn
  shoulddescriptionUrlsBtn?: boolean // 临时遏制措施附件是否显示上传btn
  shouldrootCauseUrlsBtn?: boolean // 根本原因附件是否显示上传btn
  canEdit?: boolean
  shouldShowAddVOs?: boolean
  showAddTeamBtn?: boolean // 是否有添加小组成员按钮
  showICaOrPca?: string // pca || ics
  hiddenConfig?: boolean
  onlyOut?: boolean // 流转状态只有外部
  isCoordination?: boolean //是否为8d协同
}
const { TextArea } = Input
const ICAOrPCAContent = (props: ICAOrPCAContentType, ref) => {
  const {
    children,
    message = {},
    onlyOut = false,
    hiddenConfig = false,
    shouldurlsBtn = false,
    shoulddescriptionUrlsBtn = false,
    shouldrootCauseUrlsBtn = false,
    canEdit = false,
    shouldShowAddVOs,
    showAddTeamBtn = false,
    showICaOrPca = 'ics',
    isCoordination = false,
  } = props
  const intl = getIntl()
  const [form] = Form.useForm()
  const { handleLeave } = usePrompt()
  const [basicData, setBasicData] = useState([]) // 基础信息
  const [problemData, setProblemData] = useState([]) // 问题描述
  const [attachment, setAttachment] = useState([]) // 附件信息
  const [temporaryAttachment, setTemporaryAttachment] = useState([]) // 临时遏制措施措施描述
  const [rootCauseDom, setRootCauseDom] = useState([]) // 临时遏制措施措施描述
  const [innerVerifySteps, setInnerVerifySteps] = useState() // 内部流转---ica
  const [innerVerifyCurrent, setInnerVerifyCurrent] = useState(0) // 内部流转状态---ica
  const [outerVerifySteps, setOutererifySteps] = useState() // 外部流转
  const [outerVerifyCurrent, setOuterVerifyCurrent] = useState(0) // 外部状态
  const [loading, setloading] = useState(false) // 附件上传加载中
  const [temaMemberModal, setTemaMemberModal] = useState(false) // 显示小组成员弹窗
  const [selectRowVOSItem, setSelectRowVOSItem] = useState<any>({}) // 选中更换的实施人列
  const [urls, setUrls] = useState<any>([]) // 附件
  const [descriptionUrls, setDescriptionUrls] = useState<any>([]) // 临时遏制措施附件
  const [rootCauseUrls, setRootCauseUrls] = useState<any>([]) // 根本原因附件
  const [measuresVOS, setMeasuresVOS] = useState<any>([]) // 临时遏制措施内容
  const [containmentDescription, setContainmentDescription] = useState<any>() // 遏制措施描述
  const [rootCause, setRootCause] = useState<any>() // 根本原因
  const [temaList, setTemaList] = useState<any>([]) //小组成员
  const [selectedRowsTema, setSelectedRowsTema] = useState<any>({})

  const userInfo = authService.getAuth()

  // 重置上面几内容
  const fnInitEnclosure = () => {
    if (message.urls) {
      setUrls([...message.urls])
    }
    if (message.correctionInformation?.descriptionUrls) {
      setDescriptionUrls([...message.correctionInformation?.descriptionUrls])
    }
    if (message.correctionInformation?.rootCauseUrls) {
      setRootCauseUrls([...message.correctionInformation?.rootCauseUrls])
    }
    if (message.correctionInformation?.measuresVOS) {
      message.correctionInformation?.measuresVOS?.map((item) => {
        item.completionDate = moment(item.completionDate)
      })
      const data = {
        rootCause: message.correctionInformation.rootCause,
        containmentDescription: message.correctionInformation.containmentDescription,
      }
      form.setFieldsValue(data)
      setMeasuresVOS([...message.correctionInformation?.measuresVOS])
    }
  }
  const onDownload = (file: any) => {
    downloadFileByNameAndUrl(file.url, file.name)
  }

  /**
   * 重置基础信息
   */
  const fnInitBasicData = () => {
    const basicDataDesc = initBasicData(message, isCoordination)
    setBasicData(basicDataDesc)
  }
  /**
   * 重置问题描述
   */
  const fnInitProblemData = () => {
    const problemDataDesc = initProblemData(message)
    setProblemData(problemDataDesc)
  }

  const handleChange = ({ file }, type: string) => {
    let arr: any = []
    switch (type) {
      case 'urls': {
        arr = urls
        break
      }
      case 'descriptionUrls': {
        arr = descriptionUrls
        break
      }
      case 'rootCauseUrls': {
        arr = rootCauseUrls
        break
      }
    }
    setloading(true)
    if (file.response) {
      if (file.response.code === 1000) {
        handleLeave(true)
        arr.push({
          name: file.name,
          url: file.response.data,
        })
        setloading(false)
      }
    }
    const arrDesc = [...arr]
    switch (type) {
      case 'urls': {
        setUrls(arrDesc)
        break
      }
      case 'descriptionUrls': {
        setDescriptionUrls(arrDesc)
        break
      }
      case 'rootCauseUrls': {
        setRootCauseUrls(arrDesc)
      }
    }
  }

  const fnDeleteFirs = (configobj, confitItem, type) => {
    const desc = [...configobj]
    desc.forEach((item, index) => {
      if (item.url === confitItem.url) {
        desc.splice(index, 1)
      }
    })
    switch (type) {
      case 'urls': {
        setUrls(desc)
        break
      }
      case 'descriptionUrls': {
        setDescriptionUrls(desc)
        break
      }
      case 'rootCauseUrls': {
        setRootCauseUrls(desc)
      }
    }
  }

  /**
   * 重置附件信息
   */
  const fnInitAttachment = () => {
    const attachmentDesc = [
      {
        label: intl.formatMessage({ id: 'eightD.fujian', defaultMessage: '附件' }),
        extra: (
          <div>
            <Space>
              {urls?.map((item: any) => (
                <Button type="link" key={item.id} className={style.deleteIconWarp}>
                  <span
                    onClick={() => {
                      onDownload(item)
                    }}
                  >{`${item.name}`}</span>
                  {shouldurlsBtn && (
                    <DeleteOutlined
                      className={style.deleteIcon}
                      onClick={() => {
                        fnDeleteFirs(urls, item, 'urls')
                      }}
                    />
                  )}
                </Button>
              ))}
            </Space>
            {shouldurlsBtn && (
              <div>
                <Upload
                  action="/api/support/file/upload"
                  data={{ fileType: UPLOAD_TYPE }}
                  showUploadList={false}
                  accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx"
                  beforeUpload={beforeDocUpload}
                  onChange={(res) => {
                    handleChange(res, 'urls')
                  }}
                >
                  <Button loading={loading} icon={<UploadOutlined />}>
                    {intl.formatMessage({ id: 'transaction_components.shangchuanwenjian' })}
                  </Button>
                </Upload>
              </div>
            )}
          </div>
        ),
        colon: true,
        hiddenLabel: true,
      },
    ]
    setAttachment([...attachmentDesc])
  }

  const fnInitTemporaryAttachment = () => {
    const problemDescribeDesc = [
      {
        label: intl.formatMessage({ id: 'eightD.fujian', defaultMessage: '附件' }),
        extra: (
          <div>
            <Space>
              {descriptionUrls?.map((item: any) => (
                <Button className={style.deleteIconWarp} type="link" key={item.id}>
                  <span
                    onClick={() => {
                      onDownload(item)
                    }}
                  >{`${item.name}`}</span>
                  {shoulddescriptionUrlsBtn && (
                    <DeleteOutlined
                      className={style.deleteIcon}
                      onClick={() => {
                        fnDeleteFirs(descriptionUrls, item, 'descriptionUrls')
                      }}
                    />
                  )}
                </Button>
              ))}
            </Space>
            {shoulddescriptionUrlsBtn && (
              <div>
                <Upload
                  action="/api/support/file/upload"
                  data={{ fileType: UPLOAD_TYPE }}
                  showUploadList={false}
                  accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx"
                  beforeUpload={beforeDocUpload}
                  onChange={(res) => {
                    handleChange(res, 'descriptionUrls')
                  }}
                >
                  <Button loading={loading} icon={<UploadOutlined />}>
                    {intl.formatMessage({ id: 'transaction_components.shangchuanwenjian' })}
                  </Button>
                </Upload>
              </div>
            )}
          </div>
        ),
      },
    ]

    const rootCauseDesc = [
      {
        label: intl.formatMessage({ id: 'eightD.fujian', defaultMessage: '附件' }),
        extra: (
          <div>
            <Space>
              {rootCauseUrls.map((item: any) => (
                <Button className={style.deleteIconWarp} type="link" key={item.id}>
                  <span
                    onClick={() => {
                      onDownload(item)
                    }}
                  >{`${item.name}`}</span>
                  {shouldrootCauseUrlsBtn && (
                    <DeleteOutlined
                      className={style.deleteIcon}
                      onClick={() => {
                        fnDeleteFirs(rootCauseUrls, item, 'rootCauseUrls')
                      }}
                    />
                  )}
                </Button>
              ))}
            </Space>
            {shouldrootCauseUrlsBtn && (
              <div>
                <Upload
                  action="/api/support/file/upload"
                  data={{ fileType: UPLOAD_TYPE }}
                  showUploadList={false}
                  accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx"
                  beforeUpload={beforeDocUpload}
                  onChange={(res) => {
                    handleChange(res, 'rootCauseUrls')
                  }}
                >
                  <Button loading={loading} icon={<UploadOutlined />}>
                    {intl.formatMessage({ id: 'transaction_components.shangchuanwenjian' })}
                  </Button>
                </Upload>
              </div>
            )}
          </div>
        ),
      },
    ]

    setTemporaryAttachment([...problemDescribeDesc])
    setRootCauseDom([...rootCauseDesc])
  }

  const fnInitouters = () => {
    postOrderEightDRectificationEnumOuters({}, { ctlType: 'none' }).then((res) => {})
  }

  const fnInitInnerVerifySteps = () => {
    let states = message.icaLogStates
    if (showICaOrPca === 'pca' || !message.icaApprovalStatus) {
      states = message.pcaLogStates
    }
    const Desc = states.map((item: any, index: number) => {
      const obj = {
        step: item.state,
        stepName: item.roleName,
        roleName: item.stateName,
      }
      if (item.isExecute) {
        setInnerVerifyCurrent(item.state)
      }
      return obj
    })
    setInnerVerifySteps(Desc)
    // pcaLogStates
    const DescOuter = message.interiorLogStates?.map((item: any, index: number) => {
      const obj = {
        step: item.state,
        stepName: item.roleName,
        roleName: item.stateName,
      }
      if (item.isExecute) {
        setOuterVerifyCurrent(item.state)
      }
      return obj
    })
    setOutererifySteps(DescOuter || [])
  }
  const fnGetIntervalArr = (arr, begin, end) => {
    const arrDesc = [...arr]
    const callBlackArr = arrDesc.splice(begin, end)
    return callBlackArr
  }
  const fnGetExternalEightLogVOS = (e) => {
    // 外部单据流转记录 ,ExternalEightLogVO
    const showList = fnGetIntervalArr(
      message?.externalEightLogVOS,
      (e.current - 1) * e.pageSize || 0,
      e.current * e.pageSize,
    )
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = {
          totalCount: message?.externalEightLogVOS.length || [],
          data: showList || [],
        }
        resolve(data)
      }, 100)
    })
  }
  const fnGetInternalEightLogVOS = (e) => {
    // 内部单据流转记录 ,InternalEightLogVO
    return new Promise((resolve, reject) => {
      const showList = fnGetIntervalArr(
        message?.internalEightLogVOS,
        (e.current - 1) * e.pageSize || 0,
        e.current * e.pageSize,
      )
      setTimeout(() => {
        const data = {
          totalCount: onlyOut ? 0 : message?.internalEightLogVOS.length || 0,
          data: onlyOut ? [] : showList || [],
        }
        resolve(data)
      }, 100)
    })
  }

  const outerColumns: ColumnType<any>[] = [
    ...verifyColumns,
    {
      title: intl.formatMessage({ id: 'eightD.zhuangtai', defaultMessage: '状态' }),
      key: 'stateName',
      dataIndex: 'stateName',
      render: (text: any, record: any) => {
        return (
          <StatusTag
            type={'default'}
            style={{
              background: EIGHTD_EX_STATUS_TAG_TYPE[record.state]?.bgColor,
              color: EIGHTD_EX_STATUS_TAG_TYPE[record.state]?.color,
            }}
            title={text}
          />
        )
        //   <Badge
        //   color={EIGHTD_IN_STATUS_BADGE_TYPE[record.state] ?? 'orange'}
        //   text={text}
        // />
      },
    },
  ]
  const innerColumns = [
    ...innerColumnsFront,
    {
      title: intl.formatMessage({ id: 'eightD.zhuangtai', defaultMessage: '状态' }),
      key: 'stateName',
      dataIndex: 'stateName',
      render: (text: any, record: any) => {
        return <Badge color={EIGHTD_IN_STATUS_BADGE_TYPE[record.state] ?? 'orange'} text={text} />
      },
    },
    ...innerColumnsAfter,
  ]
  const fnCanConfig = (configItem: any) => {
    const userIdArr =
      message.qualityOrderProductVOS?.map((item) => {
        if (item.roleType !== userInfo.memberRoleType) {
          return item.userId
        }
      }) || []
    if (userIdArr.indexOf(configItem.userId) > -1 || !showAddTeamBtn) {
      return true
    }
    return false
  }
  /**
   *
   * @param selectItem 删除小组小城
   */
  const fnDeleteItemGroup = (selectItem: any) => {
    let indexNumber = 0
    temaList.forEach((item, index: number) => {
      if (item.userId === selectItem.userId) {
        indexNumber = index
      }
    })
    temaList.splice(indexNumber, 1)
    setTemaList([...temaList])
  }

  const configGroup = {
    title: intl.formatMessage({ id: 'eightD.caozuo', defaultMessage: '操作' }),
    render: (text: any, record: any) => {
      return (
        !fnCanConfig(record) && (
          <Button
            onClick={() => {
              fnDeleteItemGroup(record)
            }}
            type="link"
          >
            {intl.formatMessage({ id: 'eightD.shanchu', defaultMessage: '删除' })}
          </Button>
        )
      )
    },
  }
  const fnGetRolyType = () => {
    const coordination = {
      title: intl.formatMessage({ id: 'eightD.gongyingshangkejian', defaultMessage: '供应商可见' }),
      key: 'isVisible',
      dataIndex: 'isVisible',
      component: 'Switch',
      editable: true,
      editProps: {
        disabled: !showAddTeamBtn, // 没有添加按钮的时候 不能编辑
      },
    }
    // if (showAddTeamBtn){
    //   return coordination;
    // }
    return coordination
  }
  // 小组成员
  const groupColumns: any[] = [
    ...groupColumnsDesc,
    {
      title: intl.formatMessage({ id: 'eightD.shuoming', defaultMessage: '说明' }),
      key: 'legend',
      dataIndex: 'legend',
      component: 'TextArea',
      editable: true,
      // editProps: {
      //   disabled: !showAddTeamBtn // 没有添加按钮的时候 不能编辑
      // }
    },
    {
      title: intl.formatMessage({ id: 'eightD.zuchang', defaultMessage: '组长' }),
      key: 'isGroupLeader',
      dataIndex: 'isGroupLeader',
      component: 'Switch',
      editable: true,
      // editProps: {
      //   disabled: !showAddTeamBtn // 没有添加按钮的时候 不能编辑
      // }
    },
    userInfo.memberRoleType === 2 && fnGetRolyType(),
    // {
    //   title: '供应商可见',
    //   key: 'isVisible',
    //   dataIndex: 'isVisible',
    //   // component: 'Switch',
    //   // editable: true,
    //   render: (value) => value == 1 ? '是' : '否'
    // },
    showAddTeamBtn && configGroup,
  ]

  const fnChangeMeasuresVOSName = (index: any, keyName: string) => {
    const select = {
      index,
      keyName,
    }
    setSelectRowVOSItem(select)
    setTemaMemberModal(true)
  }

  // 删除某一条临时措施
  const fnDelectVOS = (index) => {
    measuresVOS.splice(index, 1)
    setMeasuresVOS([...measuresVOS])
  }

  /**
   * 修改日期
   */
  const fnChangeData = (time: any, dateString: string, item: any, keyName: string) => {
    item[keyName] = dateString
  }

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current < moment().startOf('day')
  }

  const configDom = {
    title: intl.formatMessage({ id: 'eightD.caozuo', defaultMessage: '操作' }),
    render: (text, record, index) => {
      return (
        <Button
          disabled={!canEdit}
          type="link"
          onClick={() => {
            fnDelectVOS(index)
          }}
        >
          {intl.formatMessage({ id: 'eightD.shanchu', defaultMessage: '删除' })}
        </Button>
      )
    },
  }

  // 可编辑的临时措施
  const temporaryColumnsEdailDesc = () => {
    const desc = [
      {
        title: intl.formatMessage({ id: 'eightD.xuhao', defaultMessage: '序号' }),
        render: (text, record, index) => {
          return <span>{index + 1}</span>
        },
      },
      {
        title: (
          <span className={canEdit ? style.hasRequired : ''}>
            {intl.formatMessage({ id: 'eightD.jianchahuanjie', defaultMessage: '检查环节' })}
          </span>
        ),
        key: 'link',
        dataIndex: 'link',
        render: (text, record) => {
          return (
            <Form.Item
              name={[record?.name, 'link']}
              rules={[
                { required: true, message: intl.formatMessage({ id: 'eightD.qingshuru', defaultMessage: '请输入' }) },
              ]}
            >
              <Input bordered={canEdit} readOnly={!canEdit} />
            </Form.Item>
          )
        },
      },
      {
        title: (
          <span className={canEdit ? style.hasRequired : ''}>
            {intl.formatMessage({ id: 'eightD.zhijianshuliang', defaultMessage: '质检数量' })}
          </span>
        ),
        key: 'qualityQuantity',
        dataIndex: 'qualityQuantity',
        render: (text, record) => {
          return (
            <Form.Item
              name={[record?.name, 'qualityQuantity']}
              rules={[
                {
                  validator: (_, value) => {
                    const _pattern = /^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/
                    if (!value) {
                      return Promise.reject(
                        new Error(
                          intl.formatMessage({ id: 'quality.qingshurubuliangshuliang', defaultMessage: '请输入' }),
                        ),
                      )
                    }
                    if (!_pattern.test(value)) {
                      return Promise.reject(
                        new Error(
                          intl.formatMessage({
                            id: 'quality.yaoqiudayu0qiexiaoyu',
                            defaultMessage: '要求大于0且小于或等于送检数量,最多保留3位小数',
                          }),
                        ),
                      )
                    }
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <InputNumber bordered={canEdit} readOnly={!canEdit} />
            </Form.Item>
          )
        },
      },
      {
        title: (
          <span className={canEdit ? style.hasRequired : ''}>
            {intl.formatMessage({ id: 'eightD.buliangpinshuliang', defaultMessage: '不良品数量' })}
          </span>
        ),
        key: 'defectiveQuantity',
        dataIndex: 'defectiveQuantity',
        render: (text, record) => {
          return (
            <Form.Item
              name={[record?.name, 'defectiveQuantity']}
              rules={[
                {
                  validator: (_, value) => {
                    const _pattern = /^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/
                    if (!value) {
                      return Promise.reject(
                        new Error(
                          intl.formatMessage({ id: 'quality.qingshurubuliangshuliang', defaultMessage: '请输入' }),
                        ),
                      )
                    }
                    if (!_pattern.test(value)) {
                      return Promise.reject(
                        new Error(
                          intl.formatMessage({
                            id: 'quality.yaoqiudayu0qiexiaoyu',
                            defaultMessage: '要求大于0且小于或等于送检数量,最多保留3位小数',
                          }),
                        ),
                      )
                    }
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <InputNumber min={0} precision={3} bordered={canEdit} readOnly={!canEdit} />
            </Form.Item>
          )
        },
      },
      {
        title: (
          <span className={canEdit ? style.hasRequired : ''}>
            {intl.formatMessage({ id: 'eightD.chulicuoshi', defaultMessage: '处理措施' })}
          </span>
        ),
        key: 'treatmentMeasures',
        dataIndex: 'treatmentMeasures',
        render: (text, record) => {
          return (
            <Form.Item
              name={[record?.name, 'treatmentMeasures']}
              rules={[
                { required: true, message: intl.formatMessage({ id: 'eightD.qingshuru', defaultMessage: '请输入' }) },
              ]}
            >
              <Input bordered={canEdit} readOnly={!canEdit} />
            </Form.Item>
          )
        },
      },
      {
        title: (
          <span className={canEdit ? style.hasRequired : ''}>
            {intl.formatMessage({ id: 'eightD.shishifuzhairen', defaultMessage: '实施负责人' })}
          </span>
        ),
        key: 'name',
        dataIndex: 'name',
        render: (text, record, index) => {
          return (
            <div className={style.editOutlinedwarp}>
              {canEdit && (
                <EditOutlined
                  onClick={() => {
                    fnChangeMeasuresVOSName(index, 'name')
                  }}
                />
              )}

              <Form.Item
                name={[record?.name, 'name']}
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'eightD.qingshuru', defaultMessage: '请输入' }) },
                ]}
              >
                <Input
                  bordered={false}
                  readOnly
                  placeholder={intl.formatMessage({ id: 'eightD.qingxuanzefuzhairen', defaultMessage: '请选择负责人' })}
                />
              </Form.Item>
            </div>
          )
        },
      },
      {
        title: (
          <span className={canEdit ? style.hasRequired : ''}>
            {intl.formatMessage({ id: 'eightD.yaoqiuwanchengriqi', defaultMessage: '要求完成日期' })}
          </span>
        ),
        key: 'completionDate',
        dataIndex: 'completionDate',
        render: (text, record, index) => {
          return canEdit ? (
            <Form.Item
              name={[record?.name, 'completionDate']}
              rules={[
                { required: true, message: intl.formatMessage({ id: 'eightD.qingshuru', defaultMessage: '请输入' }) },
              ]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                disabledDate={disabledDate}
                onChange={(e, dateString) => {
                  fnChangeData(e, dateString, record, 'completionDate')
                }}
              />
            </Form.Item>
          ) : (
            <div>{moment(measuresVOS[index].completionDate).format('YYYY-MM-DD')}</div>
          )
        },
      },
      // !hiddenConfig && configDom
    ]
    if (canEdit) {
      desc.push(configDom)
    }
    return desc
  }

  // 临时遏制措施
  const temporaryColumns = temporaryColumnsEdailDesc()
  // 添加临时措施
  const fnAddMeasuresVOS = () => {
    handleLeave(true)
    const { measuresVOS } = form.getFieldsValue()
    measuresVOS.push({
      id: measuresVOS.length + 1,
      link: '',
      qualityQuantity: '',
      defectiveQuantity: '',
      treatmentMeasures: '',
      name: '',
      completionDate: '',
    })
    setMeasuresVOS(measuresVOS)
  }

  const fnInitTemaList = (qualityOrderProductVOS) => {
    qualityOrderProductVOS?.map((item) => {
      item.isGroupLeader = item.isGroupLeader === 1
      item.isVisible = item.isVisible === 1
      item.disabled = fnCanConfig(item)
    })
    return qualityOrderProductVOS ?? []
  }

  useEffect(() => {
    if (message.id) {
      fnInitBasicData() // 基础信息
      fnInitProblemData() // 重置问题描述
      fnInitouters() // 内部流转
      fnInitInnerVerifySteps() // 流转
      fnInitEnclosure() // 重置附件文件信息
      setContainmentDescription(message.correctionInformation?.containmentDescription) // 遏制措施描述
      setRootCause(message.correctionInformation?.rootCause) // 根本原因
      setTemaList(() => fnInitTemaList(message.qualityOrderProductVOS)) //小组成员
    }
  }, [message])

  useEffect(() => {
    fnInitAttachment() // 重置附件信息
  }, [urls])

  useEffect(() => {
    fnInitTemporaryAttachment() // 遏制措施描述
  }, [descriptionUrls, rootCauseUrls])

  const rowSelection: TableRowSelection<any> = {
    type: 'radio',
    onChange: (selectedRowKeys, selectedRows) => {
      // setTemaList(selectedRows);
      setSelectedRowsTema(selectedRows)
    },
  }

  const fetchMemberUserList = async (searchPar) => {
    try {
      const userIds = []
      measuresVOS?.map((item: any) => {
        if (item.userId) {
          userIds.push(item.userId)
        }
      })
      const res = await postMemberUserEightList({
        userIds,
        ...searchPar,
      })
      if (res.code === 1000) {
        return res.data
      }
      return { totalCount: 0, data: [] }
    } catch (error) {}
  }

  const addMemberHandler = (_selectRow: number[] | string[], selectedRows: { [key: string]: any }[]) => {
    handleLeave(true)
    const { index, keyName } = selectRowVOSItem
    const { measuresVOS } = form.getFieldsValue()
    measuresVOS[index][keyName] = selectedRows[0].name
    measuresVOS[index].userId = selectedRows[0].userId
    setTemaMemberModal(false)
    setMeasuresVOS(measuresVOS)
  }

  useImperativeHandle(ref, () => ({
    fnCallBlack() {
      temaList?.map((item) => {
        // 后台接收的问题 不能布尔 只能重置一下给他吧
        item.isGroupLeader = item.isGroupLeader ? '1' : '2' // 是否组长 1是 2否
        item.isVisible = item.isVisible ? '1' : '2' // 是否供应商 1是 2否
      })
      form.validateFields()
      const { measuresVOS, containmentDescription, rootCause } = form.getFieldsValue()
      let canSubu = true
      if (measuresVOS.length === 0) {
        messageErr(intl.formatMessage({ id: 'eightD.qingtianjialinshiezhicuo', defaultMessage: '请添加临时遏制措施' }))
        canSubu = false
      }
      const preventionArr = [
        'link',
        'qualityQuantity',
        'defectiveQuantity',
        'treatmentMeasures',
        'name',
        'completionDate',
      ]
      measuresVOS.forEach((item: any) => {
        preventionArr.forEach((key) => {
          if (!item[key]) {
            canSubu = false
          }
        })
      })
      if (!containmentDescription || !rootCause) {
        canSubu = false
      }
      if (!canSubu) {
        return false
      }
      const obj = {
        qualityOrderProductVOS: temaList, // 小组成员信息
        measuresVOS, // 临时遏制措施
        containmentDescription, // 遏制措施描述
        descriptionUrls, // 遏制措施描述附件
        rootCause, // 根本原因
        rootCauseUrls, // 根本原因附件
      }
      handleLeave(false)
      return obj
    },
  }))

  /**
   *
   * @param val 添加小组成员确定
   */
  const fnConfirmTemalist = (val: any) => {
    const qualityOrderProductVOS = message.qualityOrderProductVOS || []
    const temaListDesc = [...qualityOrderProductVOS, ...val]
    setTemaList(temaListDesc)
  }
  /**
   *
   */
  const handleChangeTemalist = (selectyItem: any, selectKey: string) => {
    if (!showAddTeamBtn) {
      return
    }
    if (fnCanConfig(selectyItem)) {
      return
    }
    temaList.forEach((item) => {
      if (item.roleType !== userInfo.memberRoleType) {
        return
      }
      if (item.userId === selectyItem.userId) {
        item[selectKey] = selectyItem[selectKey]
      } else if (selectKey === 'isGroupLeader') {
        item.isGroupLeader = false
      }
    })
    setTemaList(deepClone(temaList))
  }

  useEffect(() => {
    const { rootCause, containmentDescription } = form.getFieldsValue()
    const data = {
      measuresVOS,
      rootCause,
      containmentDescription,
    }
    form.setFieldsValue(data)
  }, [measuresVOS])

  return (
    <div className={style.measureWarp}>
      <Form form={form} scrollToFirstError>
        <AuditProcess
          id="circulation"
          initRadioValue="outer"
          outerVerifyCurrent={outerVerifyCurrent}
          innerVerifyCurrent={onlyOut ? 0 : innerVerifyCurrent}
          innerVerifySteps={onlyOut ? [] : innerVerifySteps} //
          outerVerifySteps={outerVerifySteps} //
          circulationIcon={true}
          innerColumns={innerColumns}
          outerColumns={outerColumns}
          fetchInnerList={fnGetInternalEightLogVOS}
          fetchOuterList={fnGetExternalEightLogVOS}
        />
        <div style={{ marginTop: '16px' }} id="basis">
          <BasicLayoutCard
            effect={basicData}
            CardTitle={intl.formatMessage({ id: 'eightD.jichuxinxi', defaultMessage: '基础信息' })}
          />
        </div>
        <div style={{ marginTop: '16px' }} id="problem">
          <BasicLayoutCard
            effect={problemData}
            CardTitle={intl.formatMessage({ id: 'eightD.wentimiaoshu', defaultMessage: '问题描述' })}
          />
        </div>
        {/* {
          urls.length > 0 && ( */}
        <div style={{ marginTop: '16px' }} id="attachment">
          <BasicLayoutCard
            effectBlock={attachment}
            CardTitle={intl.formatMessage({ id: 'eightD.fujian', defaultMessage: '附件' })}
          />
        </div>
        {/* )
        } */}
        <div id="group">
          <MellowCard
            title={intl.formatMessage({ id: 'eightD.xiaozuchengyuan', defaultMessage: '小组成员' })}
            id="teamMembers"
          >
            <AddTemaTableModal
              showAddTeamBtn={showAddTeamBtn}
              columns={groupColumns}
              dataSource={temaList}
              confirm={fnConfirmTemalist}
              handleChange={handleChangeTemalist}
              rowKey="index"
            />
          </MellowCard>
        </div>
        <div style={{ marginTop: '16px' }}>
          <Card
            id="temporary"
            title={intl.formatMessage({ id: 'eightD.linshiezhicuoshi', defaultMessage: '临时遏制措施' })}
          >
            <Form.List name="measuresVOS" rules={[]}>
              {(fields, { add, remove }, { errors }) => (
                <Table columns={temporaryColumns} dataSource={fields} pagination={false} />
              )}
            </Form.List>
            {shouldShowAddVOs && (
              <div>
                <Button block onClick={fnAddMeasuresVOS}>
                  {intl.formatMessage({ id: 'eightD.tianjia', defaultMessage: '添加' })}
                </Button>
              </div>
            )}
            <div style={{ marginTop: '16px' }}>
              <Form.Item
                label={intl.formatMessage({ id: 'eightD.ezhicuoshimiaoshu', defaultMessage: '遏制措施描述' })}
                name="containmentDescription"
                labelCol={{ span: 2 }}
                labelAlign="left"
                rules={[
                  {
                    required: canEdit,
                    message: intl.formatMessage({ id: 'eightD.qingshuru', defaultMessage: '请输入' }),
                  },
                ]}
                className={style.textAreaWarp}
              >
                {/* <TextArea rows={4} placeholder="遏制措施描述" /> */}
                <TextArea
                  rows={canEdit ? 4 : 1}
                  autoSize={!canEdit}
                  disabled={!canEdit}
                  bordered={canEdit}
                  placeholder={
                    canEdit
                      ? intl.formatMessage({ id: 'eightD.ezhicuoshimiaoshu', defaultMessage: '遏制措施描述' })
                      : ''
                  }
                />
              </Form.Item>

              <BasicLayoutUnCard effectBlock={temporaryAttachment} />
            </div>
          </Card>
        </div>
        {/* //       canEdit ? <Form.Item name="rootCause" rules={[{ required: true, message: '请输入' }]}><TextArea rows={4} placeholder="根本原因" /> </Form.Item> : rootCause */}
        <div style={{ marginTop: '16px' }} id="atAll">
          <Card title={intl.formatMessage({ id: 'eightD.genbenyuanyin', defaultMessage: '根本原因' })}>
            <Form.Item
              label={intl.formatMessage({ id: 'eightD.genbenyuanyin', defaultMessage: '根本原因' })}
              name="rootCause"
              labelCol={{ span: 2 }}
              labelAlign="left"
              rules={[
                {
                  required: canEdit,
                  message: intl.formatMessage({ id: 'eightD.qingshuru', defaultMessage: '请输入' }),
                },
              ]}
              className={style.textAreaWarp}
            >
              <TextArea
                rows={canEdit ? 4 : 1}
                autoSize={!canEdit}
                disabled={!canEdit}
                bordered={canEdit}
                placeholder={
                  canEdit ? intl.formatMessage({ id: 'eightD.genbenyuanyin', defaultMessage: '根本原因' }) : ''
                }
              />
            </Form.Item>

            <BasicLayoutUnCard effectBlock={rootCauseDom} />
          </Card>
        </div>

        {children}

        {/* 选择供应会员 */}
        <TableModal
          modalType="Drawer"
          rowKey="userId"
          visible={temaMemberModal}
          tableProps={{
            rowKey: 'userId',
          }}
          mode="radio"
          customKey="userId"
          title={intl.formatMessage({ id: 'quality.xuanzegongyingshang', defaultMessage: '选择实施人' })}
          schema={querySchema}
          columns={userListColumns}
          fetchData={fetchMemberUserList}
          onClose={() => setTemaMemberModal(false)}
          onOk={addMemberHandler}
          effects={($, actions) => {
            actions.reset()
            useStateFilterSearchLinkageEffect($, actions, 'org', FORM_FILTER_PATH)
          }}
        />
      </Form>
    </div>
  )
}
export default forwardRef(ICAOrPCAContent)
