/**
 *  业务8D流转
 * @author: ganke
 */
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import AuditProcess from '@/components/AuditProcess'
import ListLayout from '@/pages/transaction/components/detailLayout/components/listLayout'
import { Button, DatePicker, Input, Space, Upload, Switch, Form, Table } from 'antd'
import BasicLayoutCard from '../BasicLayoutCard'
import BasicLayoutUnCard from '../BasicLayoutUnCard'
import { ColumnType } from 'antd/lib/table'
import { UPLOAD_TYPE } from '@/constants'
import { ConsoleSqlOutlined, DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons'
import { getIntl } from '@linkseeks/i18n'
import { beforeDocUpload, messageErr, userListColumns } from '../ICAOrPCAContent/contentFn'
import DrawerTable from '@/components/DrawerTable'
import { postMemberUserEightList } from '@apps/apis'
import { TableRowSelection } from 'antd/lib/table/interface'
import moment from 'moment'
import style from './index.less'
import usePrompt from '@/hooks/usePrompt'
import { RangePickerProps } from 'antd/lib/date-picker'
import { Card } from '@linkseeks/ui'
import { authService } from '@apps/services'
import deepClone from 'clone'
import TableModal from '@/pages/transaction/components/tableModal'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { querySchema } from '../ICAOrPCAContent/schema'
import { downloadFileByNameAndUrl } from '@apps/utils'

export interface MeasureContentType {
  message?: any
  shouldCorrectiveActionVerifyUrlsBtn?: boolean
  shouldpreventionUrlsBtn?: boolean
  shouldCorrectiveActionUrlsBtn?: boolean // 附件
  shouldShowAction?: boolean // 是否显示永久纠正措施的添加
  shouldShowpRevention?: boolean // 是否显示预防的添加
  canEdit?: boolean // 是否可以编辑
}

const MeasureContent = (props: MeasureContentType, ref) => {
  const { TextArea } = Input
  const [form] = Form.useForm()
  const {
    message = {},
    shouldCorrectiveActionVerifyUrlsBtn,
    shouldpreventionUrlsBtn,
    shouldCorrectiveActionUrlsBtn,
    shouldShowAction,
    shouldShowpRevention,
    canEdit = false,
  } = props
  const intl = getIntl()
  const { handleLeave } = usePrompt()
  const [loading, setLoading] = useState(false)
  const [temaMemberModal, setTemaMemberModal] = useState(false) // 显示小组成员弹窗
  const [selectRowVOSItem, setSelectRowVOSItem] = useState<any>({}) // 选中更换的实施人列
  const [CorrectiveActionDom, setCorrectiveActionDom] = useState([]) // 永久纠正措施附件dom
  const [correctiveActionVerifyDom, setcorrectiveActionVerifyDom] = useState([]) // 永久纠正措施附件验证dom
  const [preventionDom, setPreventionDom] = useState([]) // 预防措施dom
  const [correctiveActionUrls, setCorrectiveActionUrls] = useState<any>([]) // 永久纠正措施附件
  const [correctiveActionVerifyUrls, setCorrectiveActionVerifyUrls] = useState<any>([]) // 永久纠正措施附件验证附件
  const [preventionUrls, setPreventionUrls] = useState<any>([]) // 预防措施附件
  const [preventionDetail, setPreventionDetail] = useState('') // 预防措施详述
  const [temaList, setTemaList] = useState<any>([])
  const [correctiveAction, setCorrectiveAction] = useState<any>([]) // 永久纠正措施
  const [prevention, setPrevention] = useState<any>([]) // 预防
  const userInfo = authService.getAuth()
  const onDownload = (file: any) => {
    // contract/contractTemplate/downloadContract
    downloadFileByNameAndUrl(file.url, file.name)
  }

  const rowSelection: TableRowSelection<any> = {
    type: 'radio',
    onChange: (selectedRowKeys, selectedRows) => {
      setTemaList(selectedRows)
    },
  }

  const handleChange = ({ file }, type: string) => {
    let arr: any = []
    handleLeave(true)
    if (type === 'correctiveActionUrls') {
      arr = correctiveActionUrls || []
    }
    if (type === 'correctiveActionVerifyUrls') {
      arr = correctiveActionVerifyUrls || []
    }
    if (type === 'preventionUrls') {
      arr = preventionUrls || []
    }
    setLoading(true)
    if (file.response) {
      if (file.response.code === 1000) {
        arr.push({
          name: file.name,
          url: file.response.data,
        })
        setLoading(false)
      }
    }
    console.log(arr)
    const arrDesc = [...arr]
    if (type === 'correctiveActionUrls') {
      setCorrectiveActionUrls(arrDesc)
    }
    if (type === 'correctiveActionVerifyUrls') {
      setCorrectiveActionVerifyUrls(arrDesc)
    }
    if (type === 'preventionUrls') {
      setPreventionUrls(arrDesc)
    }
  }
  const fnDeleteFirs = (configobj, confitItem, type) => {
    const desc = [...configobj]
    desc.forEach((item, index) => {
      if (item.url === confitItem.url) {
        desc.splice(index, 1)
      }
    })
    if (type === 'correctiveActionUrls') {
      setCorrectiveActionUrls(desc)
    }
    if (type === 'correctiveActionVerifyUrls') {
      setCorrectiveActionVerifyUrls(desc)
    }
    if (type === 'preventionUrls') {
      setPreventionUrls(desc)
    }
  }
  /**
   * 修改日期
   */
  const fnChangeData = (time: any, dateString, index: any, keyName: string) => {
    if (keyName === 'carryOutDate') {
      const correctiveActionDesc = form.getFieldsValue().correctiveAction
      const preventionDesc = form.getFieldsValue().prevention
      correctiveActionDesc[index].carryOutDate = moment(dateString)
      setPrevention(preventionDesc)
      setCorrectiveAction(correctiveActionDesc)
    }
    // item[keyName] = dateString;

    // correctiveActionDesc.splice(index, 1);
  }

  const fnResetCorrectiveAction = () => {
    const correctiveActiondesc = [
      // 永久纠正措施附件
      {
        label: intl.formatMessage({ id: 'eightD.fujian', defaultMessage: '附件' }),
        extra: (
          <div>
            <Space>
              {correctiveActionUrls?.map((item: any) => (
                <Button type="link" key={item.id} className={style.deleteIconWarp}>
                  <span
                    onClick={() => {
                      onDownload(item)
                    }}
                  >{`${item.name}`}</span>
                  {shouldCorrectiveActionUrlsBtn && (
                    <DeleteOutlined
                      className={style.deleteIcon}
                      onClick={() => {
                        fnDeleteFirs(correctiveActionUrls, item, 'correctiveActionUrls')
                      }}
                    />
                  )}
                </Button>
              ))}
            </Space>
            {shouldCorrectiveActionUrlsBtn && (
              <div>
                <Upload
                  action="/api/support/file/upload"
                  data={{ fileType: UPLOAD_TYPE }}
                  showUploadList={false}
                  accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx"
                  beforeUpload={beforeDocUpload}
                  onChange={(res) => {
                    handleChange(res, 'correctiveActionUrls')
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
    setCorrectiveActionDom(correctiveActiondesc)

    const correctiveActionVerifyDesc = [
      // 永久纠正措施附件验证
      {
        label: intl.formatMessage({ id: 'eightD.fujian', defaultMessage: '附件' }),
        extra: (
          <div>
            <Space>
              {correctiveActionVerifyUrls?.map((item: any) => (
                <Button type="link" key={item.id} className={style.deleteIconWarp}>
                  <span
                    onClick={() => {
                      onDownload(item)
                    }}
                  >{`${item.name}`}</span>
                  {shouldCorrectiveActionVerifyUrlsBtn && (
                    <DeleteOutlined
                      className={style.deleteIcon}
                      onClick={() => {
                        fnDeleteFirs(correctiveActionVerifyUrls, item, 'correctiveActionVerifyUrls')
                      }}
                    />
                  )}
                </Button>
              ))}
            </Space>
            {shouldCorrectiveActionVerifyUrlsBtn && (
              <div>
                <Upload
                  action="/api/support/file/upload"
                  data={{ fileType: UPLOAD_TYPE }}
                  showUploadList={false}
                  accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx"
                  beforeUpload={beforeDocUpload}
                  onChange={(res) => {
                    handleChange(res, 'correctiveActionVerifyUrls')
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
    setcorrectiveActionVerifyDom(correctiveActionVerifyDesc)

    const preventionDesc = [
      // 预防措施
      {
        label: intl.formatMessage({ id: 'eightD.fujian', defaultMessage: '附件' }),
        extra: (
          <div>
            <Space>
              {preventionUrls?.map((item: any) => (
                <Button type="link" key={item.id} className={style.deleteIconWarp}>
                  <span
                    onClick={() => {
                      onDownload(item)
                    }}
                  >{`${item.name}`}</span>
                  {shouldpreventionUrlsBtn && (
                    <DeleteOutlined
                      className={style.deleteIcon}
                      onClick={() => {
                        fnDeleteFirs(preventionUrls, item, 'preventionUrls')
                      }}
                    />
                  )}
                </Button>
              ))}
            </Space>
            {shouldpreventionUrlsBtn && (
              <div>
                <Upload
                  action="/api/support/file/upload"
                  data={{ fileType: UPLOAD_TYPE }}
                  showUploadList={false}
                  accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx"
                  beforeUpload={beforeDocUpload}
                  onChange={(res) => {
                    handleChange(res, 'preventionUrls')
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
    setPreventionDom(preventionDesc)
  }

  const fnChangeInput = (e: any, type: string, item: any, shouldReset?: boolean) => {
    item[type] = e.target.value
    console.log(correctiveAction)
    setCorrectiveAction(deepClone(correctiveAction))
  }

  /**
   *
   * @param item 选中的对象
   * @param keyName 储存修改的字段
   */
  const fnChangeName = (index: any, keyName: string, type: string) => {
    const select = {
      index,
      keyName,
      type,
    }
    setSelectRowVOSItem(select)
    setTemaMemberModal(true)
  }

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current < moment().startOf('day')
  }

  /**
   *
   * @param selectItem 删除小组小城
   */
  const fnDeleteItemGroup = (index: any) => {
    const correctiveActionDesc = form.getFieldsValue().correctiveAction
    const preventionDesc = form.getFieldsValue().prevention
    correctiveActionDesc.splice(index, 1)
    setPrevention(preventionDesc)
    setCorrectiveAction(correctiveActionDesc)
  }

  const configGroup = {
    title: intl.formatMessage({ id: 'eightD.caozuo', defaultMessage: '操作' }),
    render: (text: any, record: any, index) => {
      return (
        <Button
          onClick={() => {
            fnDeleteItemGroup(index)
          }}
          type="link"
        >
          {intl.formatMessage({ id: 'eightD.shanchu', defaultMessage: '删除' })}
        </Button>
      )
    },
  }

  // 永久纠正措施
  const permanentColumns = [
    {
      title: intl.formatMessage({ id: 'eightD.xuhao', defaultMessage: '序号' }),
      render: (text, record, index) => {
        return <span>{index + 1}</span>
      },
    },
    {
      title: (
        <span className={canEdit ? style.hasRequired : ''}>
          {intl.formatMessage({ id: 'eightD.yongjiujiuzhengcuoshi', defaultMessage: '永久纠正措施' })}
        </span>
      ),
      key: 'measure',
      dataIndex: 'measure',
      render: (text, record) => {
        // name="measure"
        return (
          <Form.Item name={[record?.name, 'measure']} rules={[{ required: true, message: '请输入' }]}>
            <Input bordered={canEdit} readOnly={!canEdit} />
          </Form.Item>
        )
      },
    },
    {
      title: (
        <span className={canEdit ? style.hasRequired : ''}>
          {intl.formatMessage({ id: 'eightD.shishiren', defaultMessage: '实施人' })}
        </span>
      ),
      key: 'carryOutName',
      dataIndex: 'carryOutName',
      render: (text, record, index) => {
        return (
          <div className={style.editOutlinedwarp}>
            {canEdit && (
              <EditOutlined
                onClick={() => {
                  fnChangeName(index, 'carryOutName', 'correctiveAction')
                }}
              />
            )}

            <Form.Item
              name={[record?.name, 'carryOutName']}
              rules={[
                { required: true, message: intl.formatMessage({ id: 'eightD.qingxuanze', defaultMessage: '请选择' }) },
              ]}
            >
              <Input
                // readOnly
                bordered={false}
                readOnly
                placeholder={intl.formatMessage({
                  id: 'eightD.qingxuanzeshishifuzhairen',
                  defaultMessage: '请选择实施负责人',
                })}
              />
            </Form.Item>
          </div>
        )
      },
    },
    {
      title: (
        <span className={canEdit ? style.hasRequired : ''}>
          {intl.formatMessage({ id: 'eightD.shishiriqi', defaultMessage: '实施日期' })}
        </span>
      ),
      key: 'carryOutDate',
      dataIndex: 'carryOutDate',
      render: (text, record, index, des) => {
        console.log(text, record, index, des)
        return canEdit ? (
          <Form.Item
            name={[record?.name, 'carryOutDate']}
            rules={[
              { required: true, message: intl.formatMessage({ id: 'eightD.qingshuru', defaultMessage: '请输入' }) },
            ]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              disabledDate={disabledDate}
              onChange={(e, dateString) => {
                fnChangeData(e, dateString, index, 'carryOutDate')
              }}
            />
          </Form.Item>
        ) : (
          <div>{moment(correctiveAction[index].carryOutDate).format('YYYY-MM-DD')}</div>
        )
      },
    },
    {
      title: (
        <span className={canEdit ? style.hasRequired : ''}>
          {intl.formatMessage({ id: 'eightD.cuoshishishijianduxiaoguo', defaultMessage: '措施实施监督效果' })}
        </span>
      ),
      key: 'supervisionEffect',
      dataIndex: 'supervisionEffect',
      render: (text, record) => {
        return (
          <Form.Item
            name={[record?.name, 'supervisionEffect']}
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
          {intl.formatMessage({ id: 'eightD.jianduren', defaultMessage: '监督人' })}
        </span>
      ),
      key: 'controlName',
      dataIndex: 'controlName',
      render: (text, record, index) => {
        return (
          <div className={style.editOutlinedwarp}>
            {canEdit && (
              <EditOutlined
                onClick={() => {
                  fnChangeName(index, 'controlName', 'correctiveAction')
                }}
              />
            )}
            <Form.Item
              name={[record?.name, 'controlName']}
              rules={[
                { required: true, message: intl.formatMessage({ id: 'eightD.qingxuanze', defaultMessage: '请选择' }) },
              ]}
            >
              <Input
                // readOnly
                bordered={false}
                readOnly
                placeholder={intl.formatMessage({
                  id: 'eightD.qingxuanzejiandufuzhairen',
                  defaultMessage: '请选择监督负责人',
                })}
              />
            </Form.Item>
          </div>
        )
      },
    },
    {
      title: (
        <span className={canEdit ? style.hasRequired : ''}>
          {intl.formatMessage({ id: 'eightD.wanchengriqi', defaultMessage: '完成日期' })}
        </span>
      ),
      key: 'completionDate',
      dataIndex: 'completionDate',
      render: (text, record, index, des) => {
        console.log(text, record, index, des)
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
          <div>{moment(correctiveAction[index].completionDate).format('YYYY-MM-DD')}</div>
        )
      },
    },
    // shouldShowAction && configGroup
  ]

  const fnGetPermanentColumns = () => {
    if (shouldShowAction) {
      return [...permanentColumns, configGroup]
    }
    return [...permanentColumns]
  }
  // 永久纠正措施验证
  const permanentCodeColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'eightD.xuhao', defaultMessage: '序号' }),
      render: (text, record, index) => {
        return <span>{index + 1}</span>
      },
    },
    {
      title: intl.formatMessage({ id: 'eightD.yongjiujiuzhengcuoshi', defaultMessage: '永久纠正措施' }),
      key: 'measure',
      dataIndex: 'measure',
      render: (text, record) => {
        return (
          <Form.Item name={[record?.name, 'measure']}>
            <Input bordered={false} readOnly placeholder="-" />
          </Form.Item>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'eightD.shishiren', defaultMessage: '实施人' }),
      key: 'carryOutName',
      dataIndex: 'carryOutName',
      render: (text, record) => {
        return (
          <Form.Item name={[record?.name, 'carryOutName']}>
            <Input bordered={false} readOnly placeholder="-" />
          </Form.Item>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'eightD.shishiriqi', defaultMessage: '实施日期' }),
      key: 'carryOutDate',
      dataIndex: 'carryOutDate',
      render: (text, record, index, des) => {
        return (
          <div>
            {correctiveAction[index]?.carryOutDate
              ? moment(correctiveAction[index]?.carryOutDate).format('YYYY-MM-DD')
              : ''}
          </div>
        )
      },
    },
    {
      title: (
        <span className={canEdit ? style.hasRequired : ''}>
          {intl.formatMessage({ id: 'eightD.cuoshiyanzheng', defaultMessage: '措施验证' })}
        </span>
      ),
      key: 'verificationEffect',
      dataIndex: 'verificationEffect',
      render: (text, record) => {
        return (
          <Form.Item
            name={[record?.name, 'verificationEffect']}
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
        <span className={canEdit ? style.hasRequired : '-'}>
          {intl.formatMessage({ id: 'eightD.yanzhengren', defaultMessage: '验证人' })}
        </span>
      ),
      key: 'verifyName',
      dataIndex: 'verifyName',
      render: (text, record, index) => {
        return (
          <div className={style.editOutlinedwarp}>
            {canEdit && (
              <EditOutlined
                onClick={() => {
                  fnChangeName(index, 'verifyName', 'correctiveAction')
                }}
              />
            )}
            <Form.Item
              name={[record?.name, 'verifyName']}
              rules={[
                { required: true, message: intl.formatMessage({ id: 'eightD.qingxuanze', defaultMessage: '请选择' }) },
              ]}
            >
              <Input
                bordered={false}
                readOnly
                placeholder={intl.formatMessage({
                  id: 'eightD.qingxuanzeyanzhengfuzhairen',
                  defaultMessage: '请选择验证负责人',
                })}
              />
            </Form.Item>
          </div>
        )
      },
    },
    {
      title: (
        <span className={canEdit ? style.hasRequired : ''}>
          {intl.formatMessage({ id: 'eightD.yanzhengriqi', defaultMessage: '验证日期' })}
        </span>
      ),
      key: 'verifyDate',
      dataIndex: 'verifyDate',
      render: (text, record, index, des) => {
        console.log(text, record, index, des)
        return canEdit ? (
          <Form.Item
            name={[record?.name, 'verifyDate']}
            rules={[
              { required: true, message: intl.formatMessage({ id: 'eightD.qingshuru', defaultMessage: '请输入' }) },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" disabledDate={disabledDate} />
          </Form.Item>
        ) : (
          <div>{moment(correctiveAction[index].verifyDate).format('YYYY-MM-DD')}</div>
        )
      },
    },
  ]

  const fnDeletePrevent = (index) => {
    const preventionDesc = form.getFieldsValue().prevention
    preventionDesc.splice(index, 1)
    setPrevention(deepClone(preventionDesc))
  }

  const fnChangeResult = (e, item: any) => {
    item.result = e ? 1 : 0
    setPrevention(deepClone(prevention))
  }

  const preventColumnsConfig = {
    title: intl.formatMessage({ id: 'eightD.caozuo', defaultMessage: '操作' }),
    render: (text, record, index) => {
      console.log(text)
      return (
        <Button
          type="link"
          onClick={() => {
            fnDeletePrevent(index)
          }}
        >
          {intl.formatMessage({ id: 'eightD.shanchu', defaultMessage: '删除' })}
        </Button>
      )
    },
  }
  const fnGetConfig = () => {
    if (!canEdit) {
      return { width: 1 }
    }
    return preventColumnsConfig
  }
  // 预防
  const preventColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'eightD.xuhao', defaultMessage: '序号' }),
      render: (text, record, index) => {
        return <span>{index + 1}</span>
      },
    },
    {
      title: (
        <span className={canEdit ? style.hasRequired : ''}>
          {intl.formatMessage({ id: 'eightD.jianchaxiangguanwenjiangengxin', defaultMessage: '检查相关文件更新' })}
        </span>
      ),
      key: 'content',
      dataIndex: 'content',
      render: (text, record) => {
        return (
          <Form.Item
            name={[record?.name, 'content']}
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
          {intl.formatMessage({ id: 'eightD.wenjiangengxinjieguo', defaultMessage: '文件更新结果' })}
        </span>
      ), // 文件更新结果1:是;2:否
      key: 'result',
      dataIndex: 'result',
      render: (text, record, index) => {
        return canEdit ? (
          <Form.Item name={[record?.name, 'result']}>
            <Switch />
          </Form.Item>
        ) : (
          <div>
            {prevention[index].result === 1
              ? intl.formatMessage({ id: 'eightD.shi', defaultMessage: '是' })
              : intl.formatMessage({ id: 'eightD.fou', defaultMessage: '否' })}
          </div>
        )
      },
    },
    {
      title: (
        <span className={canEdit ? style.hasRequired : ''}>
          {intl.formatMessage({ id: 'eightD.fuzhairen', defaultMessage: '负责人' })}
        </span>
      ),
      key: 'carryOutName',
      dataIndex: 'carryOutName',
      render: (text, record, index) => {
        return (
          <div className={style.editOutlinedwarp}>
            {canEdit && (
              <EditOutlined
                onClick={() => {
                  fnChangeName(index, 'carryOutName', 'prevention')
                }}
              />
            )}

            <Form.Item
              name={[record?.name, 'carryOutName']}
              rules={[
                { required: true, message: intl.formatMessage({ id: 'eightD.qingxuanze', defaultMessage: '请选择' }) },
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
          {intl.formatMessage({ id: 'eightD.wanchengriqi', defaultMessage: '完成日期' })}
        </span>
      ),
      key: 'preventCompletionDate',
      dataIndex: 'preventCompletionDate',
      render: (text, record, index, des) => {
        console.log(text, record, index, des)
        return canEdit ? (
          <Form.Item
            name={[record?.name, 'preventCompletionDate']}
            rules={[
              { required: true, message: intl.formatMessage({ id: 'eightD.qingshuru', defaultMessage: '请输入' }) },
            ]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              disabledDate={disabledDate}
              onChange={(e, dateString) => {
                fnChangeData(e, dateString, record, 'preventCompletionDate')
              }}
            />
          </Form.Item>
        ) : (
          <div>{moment(prevention[index].preventCompletionDate).format('YYYY-MM-DD')}</div>
        )
      },
    },
    fnGetConfig(),
  ]

  const fetchMemberUserList = async () => {
    try {
      const userIds = []
      const { type, keyName } = selectRowVOSItem
      const selectMessage = form.getFieldsValue()[type]
      const keyNameId = keyName.replace('Name', 'UserId')
      selectMessage?.map((item: any) => {
        if (item[keyNameId]) {
          userIds.push(item[keyNameId])
        }
      })
      const res = await postMemberUserEightList({
        userIds,
      })
      if (res.code === 1000) {
        return res.data
      }
      return { totalCount: 0, data: [] }
    } catch (error) {}
  }
  // 弹窗回调
  const addMemberHandler = (_selectRow: number[] | string[], selectedRows: { [key: string]: any }[]) => {
    const { index, keyName, type } = selectRowVOSItem
    const selectMessage = form.getFieldsValue()[type]
    selectMessage[index][keyName] = selectedRows[0].name
    setTemaMemberModal(false)
    switch (keyName) {
      case 'verifyName': {
        selectMessage[index].verifyUserId = selectedRows[0].userId
        setCorrectiveAction(selectMessage)
        return
      }
      case 'controlName': {
        selectMessage[index].controlUserId = selectedRows[0].userId
        setCorrectiveAction(selectMessage)
        return
      }
      case 'carryOutName': {
        selectMessage[index].carryOutUserId = selectedRows[0].userId
        if (type === 'correctiveAction') {
          setCorrectiveAction(selectMessage)
        } else {
          setPrevention(selectMessage)
        }

        return
      }
    }
  }

  // 预防
  const fnAddPrevention = () => {
    const preventionDesc = form.getFieldsValue().prevention
    const correctiveActionDesc = form.getFieldsValue().correctiveAction
    const obj = {
      content: '',
      result: '',
      carryOutName: '',
      preventCompletionDate: '',
    }
    preventionDesc.push(obj)
    handleLeave(true)
    setPrevention(preventionDesc)
    setCorrectiveAction(correctiveActionDesc)
  }

  // 永久纠正措施添加
  const fnAddCorrectiveAction = () => {
    const correctiveActionDesc = form.getFieldsValue().correctiveAction
    const preventionDesc = form.getFieldsValue().prevention
    const obj = {
      measure: '',
      carryOutName: '',
      carryOutDate: '',
      supervisionEffect: '',
      verificationEffect: '',
      controlName: '',
      completionDate: '',
    }
    correctiveActionDesc.push(obj)
    handleLeave(true)
    setPrevention(preventionDesc)
    setCorrectiveAction(correctiveActionDesc)
  }

  useEffect(() => {
    if (message.id) {
      const correctiveActionDesc = message.correctionInformation?.correctiveAction?.map((item: any, index: number) => {
        item.supervisionEffect = item.effect
        item.completionDate = moment(item.completionDate)
        item.carryOutDate = moment(item.carryOutDate)
        item.verifyDate = moment(item.verifyDate)
        const correctiveActionVerify = message.correctionInformation.correctiveActionVerify[index]
        if (correctiveActionVerify) {
          correctiveActionVerify.verificationEffect =
            message.correctionInformation?.correctiveActionVerify[index].effect
          correctiveActionVerify.completionDate = moment(item.completionDate)
          correctiveActionVerify.carryOutDate = moment(item.carryOutDate)
          correctiveActionVerify.verifyDate = moment(item.verifyDate)
        }
        return { ...item, ...message.correctionInformation?.correctiveActionVerify[index] }
      })
      // console.log(message.correctionInformation?.prevention, 'correctiveActionDesccorrectiveActionDesccorrectiveActionDesc')
      const preventionDesc =
        message.correctionInformation?.prevention?.map((item) => {
          item.preventCompletionDate = item.completionDate ? moment(item.completionDate) : ''
          return item
        }) || []
      setCorrectiveActionUrls(message.correctionInformation?.correctiveActionUrls)
      setCorrectiveActionVerifyUrls(message.correctionInformation?.correctiveActionVerifyUrls)
      setPreventionUrls(message.correctionInformation?.preventionUrls)
      setPreventionDetail(message.correctionInformation?.preventionDetail)
      setCorrectiveAction(correctiveActionDesc || []) // 因为后台分成两个对象, 前端使用一个对象
      setPrevention(preventionDesc || [])
      const obj = {
        preventionDetail: message.correctionInformation?.preventionDetail || '',
      }
      form.setFieldsValue(obj)
    }
  }, [message])

  useEffect(() => {
    if (message.id) {
      fnResetCorrectiveAction()
    }
  }, [correctiveActionUrls, correctiveActionVerifyUrls, preventionUrls])

  useEffect(() => {
    // const { correctiveAction, prevention } = form.getFieldsValue();
    // console.log(correctiveAction, prevention , 'correctiveAction, prevention correctiveAction, prevention correctiveAction, prevention ')
    const data = {
      correctiveAction,
      prevention,
    }
    console.log(data, 'datadatadata')
    form.setFieldsValue(data)
  }, [correctiveAction, prevention])

  /**
   * 获取永久预防措施或者永久措施
   */
  const fnGetObj = (correctiveAction, key: string) => {
    const desc = correctiveAction.map((item) => {
      item.effect = item[key]
      return item
    })
    return desc
  }

  useImperativeHandle(ref, () => ({
    // correctiveAction 永久纠正措施||验证
    // prevention 预防措施
    fnCallBlackPCA() {
      form.validateFields()
      console.log(form.getFieldsValue())
      const { correctiveAction, prevention, preventionDetail } = form.getFieldsValue()
      let canSubu = true
      if (correctiveAction.length === 0) {
        messageErr(intl.formatMessage({ id: 'eightD.yongjiucuoshibunengweikong', defaultMessage: '永久措施不能为空' }))
        canSubu = false
      } else if (prevention.length === 0) {
        messageErr(intl.formatMessage({ id: 'eightD.yufangfanganbunengweikong', defaultMessage: '预防方案不能为空' }))
        canSubu = false
      }

      const correctiveActionArr = [
        'carryOutName',
        'measure',
        'carryOutDate',
        'supervisionEffect',
        'controlName',
        'completionDate',
        'verificationEffect',
        'verifyName',
        'verifyDate',
      ]
      correctiveAction.forEach((item: any) => {
        correctiveActionArr.forEach((key) => {
          if (!item[key]) {
            console.log(key)
            canSubu = false
          }
        })
        item.carryOutDate = moment(item.carryOutDate).format('YYYY-MM-DD')
        item.completionDate = moment(item.completionDate).format('YYYY-MM-DD')
        item.verifyDate = moment(item.verifyDate).format('YYYY-MM-DD')
      })
      const preventionArr = ['content', 'carryOutName', 'preventCompletionDate']
      prevention.forEach((item: any) => {
        preventionArr.forEach((key) => {
          if (!item[key]) {
            console.log(key)
            canSubu = false
          }
        })
        item.result = item.result ? 1 : 2
        item.completionDate = moment(item.preventCompletionDate).format('YYYY-MM-DD')
      })
      if (!preventionDetail) {
        canSubu = false
      }
      if (!canSubu) {
        return false
      }
      const obj = {
        correctiveActionUrls, //  永久纠正措施附件
        correctiveActionVerifyUrls, // 永久纠正措施附件验证附件
        preventionUrls, // 预防措施附件
        correctiveAction: fnGetObj(correctiveAction, 'supervisionEffect'), // 永久纠正措施
        prevention, // 预防措施
        correctiveActionVerify: fnGetObj(correctiveAction, 'verificationEffect'), // 永久纠正预防措施
        preventionDetail, // 预防措施详述
      }
      handleLeave(false)
      return obj
    },
  }))

  return (
    <div className={style.measureWarp}>
      <Form form={form} scrollToFirstError>
        <div style={{ marginTop: '16px' }} id="permanent">
          <Card
            id="permanent"
            title={intl.formatMessage({ id: 'eightD.yongjiujiuzhengcuoshi', defaultMessage: '永久纠正措施' })}
          >
            <Form.List name="correctiveAction" rules={[]}>
              {(fields, { add, remove }, { errors }) => (
                <Table
                  rowKey={(record) => record.id}
                  columns={fnGetPermanentColumns()}
                  dataSource={fields}
                  pagination={false}
                />
              )}
            </Form.List>
            {shouldShowAction && (
              <div>
                <Button block onClick={fnAddCorrectiveAction}>
                  {intl.formatMessage({ id: 'eightD.tianjia', defaultMessage: '添加' })}
                </Button>
              </div>
            )}
            <div style={{ marginTop: '16px' }}>
              <BasicLayoutUnCard effectBlock={CorrectiveActionDom} />
            </div>
          </Card>
        </div>
        <div style={{ marginTop: '16px' }}>
          <Card
            id="permanentCode"
            title={intl.formatMessage({
              id: 'eightD.yongjiujiuzhengcuoshiyanzheng',
              defaultMessage: '永久纠正措施验证',
            })}
          >
            <Form.List name="correctiveAction" rules={[]}>
              {(fields, { add, remove }, { errors }) => (
                <Table
                  rowKey={(record) => record.id}
                  columns={permanentCodeColumns}
                  dataSource={fields}
                  pagination={false}
                />
              )}
            </Form.List>
            <div style={{ marginTop: '16px' }}>
              <BasicLayoutUnCard effectBlock={correctiveActionVerifyDom} />
            </div>
          </Card>
        </div>
        <div style={{ marginTop: '16px' }}>
          <Card id="prevent" title={intl.formatMessage({ id: 'eightD.yufang', defaultMessage: '预防' })}>
            <Form.List name="prevention" rules={[]}>
              {(fields, { add, remove }, { errors }) => (
                <Table rowKey={(record) => record.id} columns={preventColumns} dataSource={fields} pagination={false} />
              )}
            </Form.List>
            {shouldShowpRevention && (
              <div>
                <Button block onClick={fnAddPrevention}>
                  {intl.formatMessage({ id: 'eightD.tianjia', defaultMessage: '添加' })}
                </Button>
              </div>
            )}
            <div style={{ marginTop: '16px' }}>
              {/* {
                canEdit ? ( */}
              <Form.Item
                label={intl.formatMessage({ id: 'eightD.yufangcuoshixiangshu', defaultMessage: '预防措施详述' })}
                labelCol={{ span: 2 }}
                labelAlign="left"
                name="preventionDetail"
                rules={[
                  {
                    required: canEdit,
                    message: intl.formatMessage({ id: 'eightD.qingshuru', defaultMessage: '请输入' }),
                  },
                ]}
                className={style.textAreaWarp}
              >
                {/* <TextArea style={{width: '70%'}} rows={4} placeholder="预防措施详述" /> */}
                <TextArea
                  style={{ width: '100%' }}
                  autoSize={!canEdit}
                  rows={canEdit ? 4 : 1}
                  disabled={!canEdit}
                  bordered={canEdit}
                  placeholder={
                    canEdit
                      ? intl.formatMessage({ id: 'eightD.yufangcuoshixiangshu', defaultMessage: '预防措施详述' })
                      : ''
                  }
                />
              </Form.Item>
              {/* ) : preventionDetail
              } */}
              <BasicLayoutUnCard effectBlock={preventionDom} />
            </div>
          </Card>
        </div>
        <TableModal
          modalType="Drawer"
          rowKey="userId"
          visible={temaMemberModal}
          tableProps={{
            rowKey: 'userId',
          }}
          mode="radio"
          customKey="userId"
          title={intl.formatMessage({ id: 'eightD.xuanzeshishiren', defaultMessage: '选择实施人' })}
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
export default forwardRef(MeasureContent)
