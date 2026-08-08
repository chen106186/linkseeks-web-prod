import React, { useRef, useState, useEffect } from 'react'
import { Tooltip, Button, Form, Card, Row, Col, Input, Modal, Tag, message, Select } from '@linkseeks/ui'
import { SaveIcon, PlusIcon, MinusIcon, LinkIcon } from '@linkseeks/icons'
import { history } from '@linkseeks/router-manager'
import { LevelType, PasswordStrength, PageHeaderWrapper, PasswordTooltip } from '@apps/components'
import { PATTERN_MAPS } from '@/constants/regExp'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { ModalFormTable, ModalFormTableRef } from '@apps/components'
import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'
import { omit, getParentTreeTitles } from '@/utils'
import TabTree, { createTreeActions } from '@/components/TabTree'
import { useTreeTabs } from '@/hooks/useTreeTabs'
import { encryptedByAES } from '@linkseeks/crypto'
import {
  GetMemberManageOrgTreeResponse,
  getMemberManageOrgTree,
  getMemberManageRolePage,
  getMemberManageUserGet,
  postMemberManageUserAdd,
  postMemberManageUserUpdate,
} from '@apps/apis'
import styles from './index.less'
import { useTelCode } from '@apps/services'

const titleRender = (title) => {
  if (title === PageStatus.PREVIEW) return '查看用户'
  if (title === PageStatus.ADD) return '新增用户'
  if (title === PageStatus.EDIT) return '编辑用户'
  return ''
}

const fetchOriginTreeData = async (params?) => {
  // 平台后台树
  const res = await getMemberManageOrgTree({ ...params }, { ttl: 10, useCache: true })
  return res
}

const originTreeActions = createTreeActions()

// 默认手机区号
const defaultTelCode = '+86'

const AddUser: React.FC = () => {
  const [originVisible, setOriginVisible] = useState(false)
  const modalRef = ModalFormTable.useTableRef()
  const { id, pageStatus } = usePageStatus()
  const [originSelectNode, setOriginSelectNode] = useState<any>()
  const [userForm] = Form.useForm()
  const { telColOptions, getTelPattern } = useTelCode()
  //  密码强度
  const [pwdLevel, setPwdLevel] = useState<LevelType>('low')
  const [password, setPassword] = useState<string>('')
  const isEdit = pageStatus !== PageStatus.PREVIEW
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<any>()
  const orgFieldRef = useRef<number>(0)

  const { treeData: originTreeData } = useTreeTabs({
    fetchMenuData: fetchOriginTreeData,
  })

  useEffect(() => {
    if (id) {
      getMemberManageUserGet({
        userId: id,
      }).then(async (res) => {
        const { data } = res
        fetchOriginTreeData().then(({ data: dataSource }) => {
          const info = {
            ...data,
            orgName: getParentTreeTitles(dataSource, data.orgId),
            // orgNameList: [getParentTreeTitles(dataSource, data.orgId)],
            memberRoleIds: data.memberRoleIds,
            memberRoleNameList: data.memberRoleIds.map((v, i) => {
              return data.memberRoleNames[i]
            }),
          }
          userForm.setFieldsValue(info)
          setFormData(info)
        })
      })
    }
  }, [])

  // 角色确认弹窗
  const roleConfirm = (selectedRows: Record<string, any>[], selectRow: number[]) => {
    if (selectedRows && selectedRows.length > 0) {
      const newRoleNameList = selectedRows
        .filter(
          (obj, index, self) =>
            index === self.findIndex((o) => o.id === obj.id && o.roleName === obj.roleName) &&
            selectRow.includes(obj.id),
        )
        .map((item) => item.roleName)

      const currentRoleNameList = userForm.getFieldValue('memberRoleNameList') || []
      userForm.setFieldValue('memberRoleNameList', Array.from(new Set([...currentRoleNameList, ...newRoleNameList])))
      userForm.setFieldValue('memberRoleIds', selectRow)
    }
    modalRef.current.setVisible(false)
  }

  const handleRoleBtn = () => {
    modalRef.current.setVisible(true)
    const selectRoles = userForm.getFieldValue('memberRoleIds')
    if (selectRoles) {
      modalRef.current.setSelectionKeys(selectRoles)
    }
  }

  // 模拟请求
  const fetchUserList = async (params: any) => {
    const data = await getMemberManageRolePage(params)
    return data.data
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '角色ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      searchField: 'Input',
    },
    {
      title: '描述',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
    },
  ]

  const handleOrigin = () => {
    if (originSelectNode?.id) {
      const selectOrgName = getParentTreeTitles(originTreeData, originSelectNode.id)
      userForm.setFieldValue('orgName', selectOrgName)
      userForm.setFieldValue('orgId', originSelectNode.id)
      setOriginVisible(false)
      // const currentOrgNameList = userForm.getFieldValue('orgNameList') || []
      // const currentOrgIds = userForm.getFieldValue('orgIds') || []

      // if (currentOrgNameList.some((item) => item === selectOrgName)) {
      //   message.info(`${selectOrgName}已选择，请选择其他组织机构`)
      //   return
      // }
      // setOriginVisible(false)
      // if (Array.isArray(currentOrgNameList) && currentOrgNameList.length > 0) {
      //   currentOrgNameList[orgFieldRef.current] = selectOrgName
      // } else {
      //   currentOrgNameList.push(selectOrgName)
      // }

      // if (Array.isArray(currentOrgIds) && currentOrgIds.length > 0) {
      //   currentOrgIds.splice(orgFieldRef.current, 0, originSelectNode.id)
      // } else {
      //   currentOrgIds.push(originSelectNode.id)
      // }

      // userForm.setFieldValue('orgNameList', currentOrgNameList)
      // userForm.setFieldValue('orgIds', currentOrgIds)
    } else {
      message.info(`请选择组织机构`)
    }
  }

  const handlePlateformSelect = (key, node) => {
    setOriginSelectNode({ id: key * 1, name: node._title })
  }

  const openOriginTree = (index?: number) => {
    // orgFieldRef.current = index
    setOriginVisible(true)
  }

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }

  const handleSubmit = () => {
    userForm.validateFields().then(async (values) => {
      if (values.password) {
        values.password = encryptedByAES(values.password)
      }

      const omitValue = omit(values, ['orgName', 'memberRoleNameList'])
      const params = id
        ? {
            ...omitValue,
            userId: Number(id),
          }
        : omitValue

      try {
        setSubmitLoading(true)
        let apiFn: Function = postMemberManageUserAdd
        if (id) {
          apiFn = postMemberManageUserUpdate
        }

        const res = await apiFn(params, { penetrateError: true })
        setSubmitLoading(false)
        if (res.code === 1000) {
          setTimeout(() => {
            history.redirect('/systemManage/authConfig/userSystem')
          }, 300)
        }
      } catch (error) {
        setSubmitLoading(false)
      }
    })
  }

  return (
    <PageHeaderWrapper
      title={titleRender(pageStatus)}
      extra={
        isEdit && (
          <Button
            className={styles['save-icon']}
            icon={<SaveIcon size={16} />}
            type="primary"
            onClick={handleSubmit}
            loading={submitLoading}
          >
            保存
          </Button>
        )
      }
    >
      <Card title="基本信息">
        <Form form={userForm} disabled={!isEdit} {...layout}>
          <Row gutter={120}>
            <Col xl={12} lg={24}>
              <Form.Item
                label="登录账号"
                name="account"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: '请输入登录账号',
                  },
                  {
                    pattern: /^[^\s]{6,20}$/,
                    message: '账号长度为6-20个字符',
                  },
                ]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={24}>
              <Form.Item
                name="idCardNo"
                label="身份证号码"
                labelAlign="left"
                rules={[
                  {
                    pattern: PATTERN_MAPS.identity,
                    message: '请输入正确的身份证号',
                  },
                ]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            {isEdit && !id && (
              <Col xl={12} lg={24}>
                <Tooltip placement="right" title={<PasswordTooltip password={password} />} color="#FFF">
                  <Form.Item
                    name="password"
                    label="登录密码"
                    labelAlign="left"
                    style={{ marginBottom: 0 }}
                    rules={[
                      {
                        required: true,
                        message: '请输入登录密码',
                      },
                      {
                        pattern: PATTERN_MAPS.password,
                        message: '请输入正确的密码',
                      },
                      {
                        validator(_, value) {
                          if (!value || !PATTERN_MAPS.password.test(value) || pwdLevel !== 'low') {
                            return Promise.resolve()
                          }
                          return Promise.reject(new Error('当前密码强度弱，请重新设置密码'))
                        },
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="请输入"
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </Form.Item>
                </Tooltip>
                <Row style={{ marginBottom: 24 }}>
                  <Col span={6}></Col>
                  <Col span={18}>
                    <PasswordStrength value={password} onLevelChange={(level) => setPwdLevel(level)} />
                  </Col>
                </Row>
              </Col>
            )}
            <Col xl={12} lg={24}>
              <Form.Item
                name="email"
                label="邮箱"
                labelAlign="left"
                rules={[
                  {
                    pattern: PATTERN_MAPS.email,
                    message: '请输入正确的邮箱',
                  },
                ]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={120}>
            <Col xl={12} lg={24}>
              <Form.Item
                name="name"
                label="姓名"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: '请输入姓名',
                  },
                ]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={120}>
            <Col xl={12} lg={24}>
              <Form.Item label="手机号" labelAlign="left" style={{ marginBottom: 0 }} required>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Form.Item name="telCode" initialValue={defaultTelCode}>
                    <Select options={telColOptions} style={{ width: 120 }} />
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    dependencies={['telCode']}
                    labelAlign="left"
                    style={{ width: '100%' }}
                    rules={[
                      {
                        required: true,
                        message: '请输入手机号',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value) {
                            return Promise.resolve()
                          }

                          if (getTelPattern(getFieldValue('telCode')).test(value)) {
                            return Promise.resolve()
                          } else {
                            return Promise.reject(new Error('请输入正确的手机号'))
                          }
                        },
                      }),
                    ]}
                  >
                    <Input placeholder="请输入" />
                  </Form.Item>
                </div>
              </Form.Item>
              {/* <Form.Item name="telCode" labelAlign="left" initialValue="+86" hidden>
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item
                name="phone"
                label="手机号"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: '请输入手机号',
                  },
                  {
                    pattern: PATTERN_MAPS.phone,
                    message: '请输入正确的手机号',
                  },
                ]}
              >
                <Input placeholder="请输入" />
              </Form.Item> */}
            </Col>
          </Row>
          <Row gutter={120}>
            <Col xl={12} lg={24}>
              <Form.Item
                name="jobTitle"
                label="职位"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: '请输入职位',
                  },
                ]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={120}>
            <Col xl={12} lg={24}>
              <Form.Item label="所属组织机构" labelAlign="left" name="orgId" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                label="所属组织机构"
                labelAlign="left"
                name="orgName"
                rules={[
                  {
                    required: true,
                    message: '请选择所属组织机构',
                  },
                ]}
              >
                <Input
                  disabled
                  style={{ width: '100%' }}
                  addonAfter={
                    isEdit ? (
                      <Button
                        style={{ margin: '0 -11px' }}
                        type="primary"
                        icon={<LinkIcon size={16} />}
                        onClick={() => openOriginTree()}
                      />
                    ) : null
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          {/* 后续重构再修改成允许关联多个组织机构 */}
          {/* <Row gutter={120}>
            <Col xl={12} lg={24}>
              <Form.Item
                label="所属组织机构"
                labelAlign="left"
                name="orgIds"
                style={{ marginBottom: 0 }}
                rules={[
                  {
                    required: true,
                    message: '请选择所属组织机构',
                  },
                ]}
              >
                <Form.List name="orgNameList">
                  {(fields, { add, remove }) => {
                    return (
                      <>
                        <div className={styles['form-list']}>
                          {fields.map((field) => (
                            <div className={styles['form-list-item']}>
                              <Form.Item {...field} style={{ marginBottom: 0 }}>
                                <Input
                                  disabled
                                  style={{ width: '100%' }}
                                  addonAfter={
                                    isEdit ? (
                                      <Button
                                        style={{ margin: '0 -11px' }}
                                        type="primary"
                                        icon={<LinkIcon size={16} />}
                                        onClick={() => openOriginTree(field.name)}
                                      />
                                    ) : null
                                  }
                                />
                              </Form.Item>
                              {isEdit && (
                                <Button
                                  onClick={() => {
                                    remove(field.name)
                                    const currentOrgIds = userForm.getFieldValue('orgIds') || []
                                    if (currentOrgIds.length > 0) {
                                      userForm.setFieldValue(
                                        'orgIds',
                                        currentOrgIds.filter((_, orgIdIndex) => orgIdIndex !== field.name),
                                      )
                                    }
                                  }}
                                  icon={<MinusIcon size={16} />}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                        {isEdit && (
                          <Form.Item>
                            <Button
                              className={styles['add-btn']}
                              onClick={() => add()}
                              block
                              icon={<PlusIcon size={16} />}
                            >
                              添加组织机构
                            </Button>
                          </Form.Item>
                        )}
                      </>
                    )
                  }}
                </Form.List>
              </Form.Item>
            </Col>
          </Row> */}
          <Row gutter={120}>
            <Col xl={12} lg={24}>
              <Form.Item
                name="memberRoleIds"
                label="关联角色"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: '请选择关联角色',
                  },
                ]}
              >
                <Form.List name="memberRoleNameList">
                  {(fields, { remove }) => {
                    return (
                      <div className={styles['form-tag-list']}>
                        {fields.map((field) => (
                          <Tag
                            closable={isEdit}
                            key={field.name}
                            className={styles['form-tag-list-item']}
                            onClose={(e) => {
                              e.preventDefault()
                              const memberRoleIds = userForm.getFieldValue('memberRoleIds')
                              if (memberRoleIds && Array.isArray(memberRoleIds)) {
                                userForm.setFieldValue(
                                  'memberRoleIds',
                                  memberRoleIds.filter((_, memberRoleIdIndex) => memberRoleIdIndex !== field.name),
                                )
                              }
                              remove(field.name)
                            }}
                          >
                            {userForm.getFieldValue('memberRoleNameList')[field.name]}
                          </Tag>
                        ))}
                      </div>
                    )
                  }}
                </Form.List>
                {isEdit && (
                  <Form.Item>
                    <Button onClick={handleRoleBtn} className={styles['add-btn']} block icon={<PlusIcon size={16} />}>
                      选择
                    </Button>
                  </Form.Item>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <ModalFormTable
        modalTitle="选择角色"
        actionRef={modalRef}
        request={fetchUserList}
        columns={columns}
        isRowSelection
        rowSelectionType="checkbox"
        rowKey="id"
        pagination={false}
        onOk={roleConfirm}
        getCheckboxProps={(record) => {
          return {
            disabled: (formData?.memberRoleIds || []).includes(record.id),
            name: record.name,
          }
        }}
      />

      <Modal
        title="选择组织机构"
        open={originVisible}
        onOk={handleOrigin}
        onCancel={() => setOriginVisible(false)}
        okText="确认"
        cancelText="取消"
        getContainer="#root"
        // destroyOnClose={true}
      >
        <TabTree
          enableSearch
          searchPlaceholder="组织机构名称"
          fetchData={(params) => fetchOriginTreeData(params)}
          treeData={originTreeData}
          handleSelect={(key, node) => handlePlateformSelect(key, node)}
          actions={originTreeActions}
          customKey="id"
          checkStrictly
        />
      </Modal>
    </PageHeaderWrapper>
  )
}

export default AddUser
