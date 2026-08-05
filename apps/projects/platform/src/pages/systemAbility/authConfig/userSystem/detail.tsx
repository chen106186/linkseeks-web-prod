import React, { useRef, useState, useEffect } from 'react'
import { Tooltip, Button, Form, Card, Row, Col, Input, Modal, Tag, message, Select } from '@linkseeks/ui'
import { SaveIcon, PlusIcon, MinusIcon, LinkIcon } from '@linkseeks/icons'
import { ColumnType } from 'antd/lib/table/interface'
import { history } from '@linkseeks/router-manager'
import { LevelType, PasswordStrength, PageHeaderWrapper, PasswordTooltip } from '@apps/components'
import { PATTERN_MAPS } from '@/constants/regExp'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import ModalTable from '@/components/ModalTable'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { omit, getParentTreeTitles } from '@/utils'
import TabTree, { createTreeActions } from '@/components/TabTree'
import { useTreeTabs } from '@/hooks/useTreeTabs'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { encryptedByAES } from '@linkseeks/crypto'
import { useIntl } from '@linkseeks/i18n'
import {
  getMemberOrgTree,
  getMemberRolePageByname,
  getMemberUserGet,
  postMemberUserAdd,
  postMemberUserUpdate,
} from '@apps/apis'
import styles from './index.less'
import { useTelCode } from '@apps/services'

const fetchOriginTreeData = async (params?) => {
  // 平台后台树
  const res = await getMemberOrgTree({ ...params }, { ttl: 10, useCache: true })
  return res
}

const originTreeActions = createTreeActions()

// 默认手机区号
const defaultTelCode = '+86'

const AddUser: React.FC<{}> = () => {
  const [originVisible, setOriginVisible] = useState(false)
  const [roleVisible, setRoleVisible] = useState(false)
  const ref = useRef<any>({})
  const { id, pageStatus } = usePageStatus()
  const [originSelectNode, setOriginSelectNode] = useState<any>()
  const { run } = useHttpRequest<any>((id ? postMemberUserUpdate : postMemberUserAdd) as any)
  const [userForm] = Form.useForm()
  const { telColOptions, getTelPattern } = useTelCode()
  //  密码强度
  const [pwdLevel, setPwdLevel] = useState<LevelType>('low')
  const [password, setPassword] = useState<string>('')
  const isEdit = pageStatus !== PageStatus.PREVIEW
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [roleSelection, roleSelectCtl] = useRowSelectionTable({
    extendsSelection: {
      getCheckboxProps: (record) => ({
        disabled: (userForm.getFieldValue('memberRoleIds') || []).includes(record.id),
        name: record.name,
      }),
    },
  })
  const orgFieldRef = useRef<number>(0)
  const intl = useIntl()

  const titleRender = (title) => {
    if (title === PageStatus.PREVIEW) {
      return `${intl.formatMessage({
        id: 'authConfig.lookUser',
        defaultMessage: '查看用户',
      })}`
    }
    if (title === PageStatus.ADD) {
      return `${intl.formatMessage({
        id: 'authConfig.addUser',
        defaultMessage: '新增用户',
      })}`
    }
    if (title === PageStatus.EDIT) {
      return `${intl.formatMessage({
        id: 'authConfig.editUser',
        defaultMessage: '编辑用户',
      })}`
    }
    return ''
  }

  const { treeData: originTreeData } = useTreeTabs({
    fetchMenuData: fetchOriginTreeData,
  })

  useEffect(() => {
    if (id) {
      getMemberUserGet({
        userId: id,
      }).then(async (res) => {
        const { data } = res
        fetchOriginTreeData().then(({ data: dataSource }) => {
          userForm.setFieldsValue({
            ...data,
            orgName: getParentTreeTitles(dataSource, data.orgId),
            // orgIds: [data.orgId],
            // orgNameList: [getParentTreeTitles(dataSource, data.orgId)],
            memberRoleIds: data.memberRoleIds,
            memberRoleNameList: data.memberRoleIds.map((v, i) => {
              return data.memberRoleNames[i]
            }),
          })
        })
      })
    }
  }, [])

  // 角色确认弹窗
  const roleConfirm = () => {
    setRoleVisible(false)
    if (roleSelectCtl.selectRow && roleSelectCtl.selectRow.length > 0) {
      const newRoleNameList = roleSelectCtl.selectRow
        .filter(
          (obj, index, self) =>
            index === self.findIndex((o) => o.id === obj.id && o.roleName === obj.roleName) &&
            roleSelectCtl.selectedRowKeys.includes(obj.id),
        )
        .map((item) => item.roleName)

      const currentRoleNameList = userForm.getFieldValue('memberRoleNameList') || []

      userForm.setFieldValue('memberRoleNameList', Array.from(new Set([...currentRoleNameList, ...newRoleNameList])))
      userForm.setFieldValue('memberRoleIds', roleSelectCtl.selectedRowKeys)
    }
  }
  const handleSelectCancel = () => {
    setRoleVisible(false)
  }

  const handleRoleBtn = () => {
    setRoleVisible(true)
    const selectRoles = userForm.getFieldValue('memberRoleIds')
    if (selectRoles) {
      roleSelectCtl.setSelectedRowKeys(selectRoles)
    }
  }

  const fetchUserList = async (params: any) => {
    const data = await getMemberRolePageByname({ ...params, typeEnum: 0 })
    return data.data
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({
        id: 'authConfig.roleID',
        defaultMessage: '角色ID',
      }),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: intl.formatMessage({
        id: 'authConfig.roleName',
        defaultMessage: '角色名称',
      }),
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: intl.formatMessage({
        id: 'authConfig.describe',
        defaultMessage: '描述',
      }),
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
      //   message.info(
      //     `${selectOrgName}${intl.formatMessage({
      //       id: 'authConfig.org.select.tip',
      //       defaultMessage: '已选择，请选择其他组织机构',
      //     })}`,
      //   )
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
      message.info(intl.formatMessage({ id: 'authConfig.org.select', defaultMessage: '请选择组织机构' }))
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
    userForm
      .validateFields()
      .then(async (values) => {
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
          const { code, message: msg } = await run(params)
          if (code === 1000) {
            setTimeout(() => {
              history.goBack(-1)
            }, 300)
          }
          setSubmitLoading(false)
        } catch (error) {
          setSubmitLoading(false)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getPlaceholder = (label: string) => {
    return `${intl.formatMessage({
      id: 'common.form.input.placeholder',
      defaultMessage: '请输入',
    })}${label}`
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
            {intl.formatMessage({
              id: 'common.button.save',
              defaultMessage: '保存',
            })}
          </Button>
        )
      }
    >
      <Card
        title={intl.formatMessage({
          id: 'customerAbility.memberInspection.common.schema.add.baseInfo',
          defaultMessage: '基本信息',
        })}
      >
        <Form form={userForm} disabled={!isEdit} {...layout}>
          <Row gutter={120}>
            <Col xl={12} lg={24}>
              <Form.Item
                label={intl.formatMessage({
                  id: 'authConfig.loginAccount',
                  defaultMessage: '登录账号',
                })}
                name="account"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: getPlaceholder(
                      intl.formatMessage({
                        id: 'authConfig.loginAccount',
                        defaultMessage: '登录账号',
                      }),
                    ),
                  },
                  {
                    pattern: /^[^\s]{6,20}$/,
                    message: intl.formatMessage({
                      id: 'common.form.account.pattern.length',
                      defaultMessage: '账号长度为6-20个字符',
                    }),
                  },
                ]}
              >
                <Input
                  placeholder={getPlaceholder(
                    intl.formatMessage({
                      id: 'authConfig.loginAccount',
                      defaultMessage: '登录账号',
                    }),
                  )}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={24}>
              <Form.Item
                name="idCardNo"
                label={intl.formatMessage({ id: 'authConfig.indentifyCode', defaultMessage: '身份证号码' })}
                labelAlign="left"
                rules={[
                  {
                    pattern: PATTERN_MAPS.identity,
                    message: intl.formatMessage({
                      id: 'authConfig.pattern.idCardNo',
                      defaultMessage: '请输入正确的身份证号',
                    }),
                  },
                ]}
              >
                <Input
                  placeholder={getPlaceholder(
                    intl.formatMessage({ id: 'authConfig.indentifyCode', defaultMessage: '身份证号码' }),
                  )}
                />
              </Form.Item>
            </Col>
            {isEdit && !id && (
              <Col xl={12} lg={24}>
                <Tooltip placement="right" title={<PasswordTooltip password={password} />} color="#FFF">
                  <Form.Item
                    name="password"
                    label={intl.formatMessage({ id: 'authConfig.loginPsw', defaultMessage: '登录密码' })}
                    labelAlign="left"
                    style={{ marginBottom: 0 }}
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'supplier.profile.passwrod.required',
                          defaultMessage: '登录密码',
                        }),
                      },
                      {
                        pattern: PATTERN_MAPS.password,
                        message: intl.formatMessage({ id: 'authConfig.input8Psw' }),
                      },
                      {
                        validator(_, value) {
                          if (!value || !PATTERN_MAPS.password.test(value) || pwdLevel !== 'low') {
                            return Promise.resolve()
                          }
                          return Promise.reject(
                            new Error(
                              intl.formatMessage({
                                id: 'authConfig.pwd.strength.tip',
                                defaultMessage: '当前密码强度弱，请重新设置密码',
                              }),
                            ),
                          )
                        },
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder={intl.formatMessage({
                        id: 'supplier.profile.passwrod.required',
                        defaultMessage: '登录密码',
                      })}
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
                label={intl.formatMessage({ id: 'authConfig.email', defaultMessage: '邮箱' })}
                labelAlign="left"
                rules={[
                  {
                    pattern: PATTERN_MAPS.email,
                    message: intl.formatMessage({ id: 'authConfig.correntEmail', defaultMessage: '请输入正确的邮箱' }),
                  },
                ]}
              >
                <Input
                  placeholder={intl.formatMessage({
                    id: 'common.form.input.placeholder',
                    defaultMessage: '请输入',
                  })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={120}>
            <Col xl={12} lg={24}>
              <Form.Item
                name="name"
                label={intl.formatMessage({ id: 'authConfig.personName', defaultMessage: '姓名' })}
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: getPlaceholder(
                      intl.formatMessage({ id: 'authConfig.personName', defaultMessage: '姓名' }),
                    ),
                  },
                ]}
              >
                <Input
                  placeholder={getPlaceholder(
                    intl.formatMessage({ id: 'authConfig.personName', defaultMessage: '姓名' }),
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={120}>
            <Col xl={12} lg={24}>
              <Form.Item
                label={intl.formatMessage({ id: 'authConfig.tel', defaultMessage: '手机号' })}
                labelAlign="left"
                style={{ marginBottom: 0 }}
                required
              >
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
                        message: getPlaceholder(intl.formatMessage({ id: 'authConfig.tel', defaultMessage: '手机号' })),
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value) {
                            return Promise.resolve()
                          }

                          if (getTelPattern(getFieldValue('telCode')).test(value)) {
                            return Promise.resolve()
                          } else {
                            return Promise.reject(
                              new Error(
                                intl.formatMessage({
                                  id: 'accountSetting.inputCorrentPhoneNumble',
                                  deaultMessage: '请填写正确的手机号',
                                }),
                              ),
                            )
                          }
                        },
                      }),
                    ]}
                  >
                    <Input
                      placeholder={getPlaceholder(
                        intl.formatMessage({ id: 'authConfig.tel', defaultMessage: '手机号' }),
                      )}
                    />
                  </Form.Item>
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={120}>
            <Col xl={12} lg={24}>
              <Form.Item
                name="jobTitle"
                label={intl.formatMessage({ id: 'authConfig.zhiwei', defaultMessage: '职位' })}
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: getPlaceholder(intl.formatMessage({ id: 'authConfig.zhiwei', defaultMessage: '职位' })),
                  },
                ]}
              >
                <Input
                  placeholder={getPlaceholder(intl.formatMessage({ id: 'authConfig.zhiwei', defaultMessage: '职位' }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={120}>
            <Col xl={12} lg={24}>
              <Form.Item labelAlign="left" name="orgId" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({ id: 'authConfig.belongOrigan', defaultMessage: '所属组织机构' })}
                labelAlign="left"
                name="orgName"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'common.text.pleaseSelect' }),
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
          {/* <Row gutter={120}>
            <Col xl={12} lg={24}>
              <Form.Item
                label={intl.formatMessage({ id: 'authConfig.belongOrigan', defaultMessage: '所属组织机构' })}
                labelAlign="left"
                name="orgIds"
                style={{ marginBottom: 0 }}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'common.text.pleaseSelect' }),
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
                              {intl.formatMessage({ id: 'authConfig.orgIds.add', defaultMessage: '添加组织机构' })}
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
                label={intl.formatMessage({ id: 'authConfig.relatePerson', defaultMessage: '关联角色' })}
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'common.text.pleaseSelect' }),
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
                      {intl.formatMessage({ id: 'common.button.select', defaultMessage: '选择' })}
                    </Button>
                  </Form.Item>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <ModalTable
        modalTitle={intl.formatMessage({
          id: 'authConfig.chooseRole',
          defaultMessage: '选择角色',
        })}
        resetModal={{
          destroyOnClose: true,
        }}
        visible={roleVisible}
        confirm={roleConfirm}
        cancel={handleSelectCancel}
        columns={columns}
        rowSelection={roleSelection}
        currentRef={ref}
        fetchTableData={(params: any) => fetchUserList(params)}
        tableProps={{ rowKey: 'id' }}
        formilyProps={{
          layouts: {
            order: 3,
          },
          ctx: {
            schema: {
              type: 'object',
              properties: {
                roleName: {
                  type: 'Search',
                  'x-component-props': {
                    placeholder: intl.formatMessage({
                      id: 'authConfig.inputRoleName',
                      defaultMessage: '请输入角色名称',
                    }),
                  },
                },
              },
            },
          },
        }}
      />

      <Modal
        title={intl.formatMessage({
          id: 'authConfig.chooseOrganization',
          defaultMessage: '选择组织机构',
        })}
        open={originVisible}
        onOk={handleOrigin}
        onCancel={() => setOriginVisible(false)}
        okText={intl.formatMessage({ id: 'authConfig.confirm', defaultMessage: '确认' })}
        cancelText={intl.formatMessage({ id: 'authConfig.cancel', defaultMessage: '取消' })}
        getContainer="#root"
      >
        <TabTree
          enableSearch
          searchPlaceholder={intl.formatMessage({
            id: 'authConfig.OrganizationName',
            defaultMessage: '组织机构名称',
          })}
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
