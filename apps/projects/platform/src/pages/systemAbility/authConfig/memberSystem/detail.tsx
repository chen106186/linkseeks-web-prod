import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Row, Col, Button, Space, Tabs, Checkbox, Badge, Card, Tag } from 'antd'
import { history } from '@linkseeks/router-manager'
import { useIntl, getIntl } from '@linkseeks/i18n'
import NiceForm from '@/components/NiceForm'
import TabTree, { createTreeActions } from '@/components/TabTree'
import {
  getMemberRoleAuthTree,
  getMemberOrgTree,
  postMemberRoleAdd,
  postMemberRoleUpdate,
  getMemberRoleGet,
  // getMemberRoleAuthButton,
  // getMemberRoleAuthButtonCheck,
} from '@apps/apis'
// import styled from './index.less'
// import { useTreeData } from '@/hooks/useTreeData'
import { createFormActions } from '@apps/formily'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { PageHeaderWrapper } from '@apps/components'
// import ReturnEle from '@/components/ReturnEle'
// import { useLeavePage } from '@/hooks/useLeavePage'
import { useMap } from '@linkseeks/hooks'
// import FieldHeader from '@/components/FieldHeader'
// import OrgModal from './components/orgModal'
// import { PlusOutlined } from '@ant-design/icons'
import { useTreeTabs } from '@/hooks/useTreeTabs'
import RoleInfo from './components/roleInfo'
import RoleAuthTree from './components/roleAuthTree'
import { RoleAuthTreeContext, RoleAuthTreeProvider } from './services/contexts'
import useRoleSubmit from './services/hooks/useRoleSubmit'
// import { LineCard, LineTitle } from '@apps/components/src/web'
const intl = getIntl()
const pageTitles = [
  `${intl.formatMessage({ id: 'authConfig.add' })}`,
  `${intl.formatMessage({ id: 'authConfig.edit' })}`,
  `${intl.formatMessage({ id: 'authConfig.previewLook' })}`,
]

const TabFormErrors = (props) => {
  return (
    <Badge dot={props.dot} offset={[5, -5]}>
      {props.children}
    </Badge>
  )
}

const TabsItem = Tabs.TabPane

const menuActions = createFormActions()

const treeActions = createTreeActions()

const fetchOrgsTreeData = async () => {
  const res = await getMemberOrgTree()
  return res
}

const getTreeNode = (treeData: any, targetNodeId: any) => {
  if (!Array.isArray(treeData)) {
    return null
  }
  let result = {
    id: '',
    title: '',
  }
  for (let i = 0; i < treeData.length; i++) {
    const item = treeData[i]
    if (item.id === targetNodeId) {
      return item
    }

    if (item.children) {
      result = getTreeNode(item.children, targetNodeId)
    }
  }
  return result
}

/**
 * 系统-权限管理-角色管理 编辑、详情共用页面
 * */

const MemberDetail: React.FC<{}> = () => {
  const intl = useIntl()
  const [nodeRecord, setNodeRecord] = useState<any>(null)
  const [orgModalVisible, setOrgModalVisible] = useState(false)
  const [treeExtraMaps, { set: setButtonAuth, get: getButtonAuth }] = useMap<any, any>()
  const { treeData: plateformTreeData, handleSelect: handleSyncSelect } = useTreeTabs({
    fetchMenuData: fetchOrgsTreeData,
  })
  const { handleSubmit } = useRoleSubmit()
  const actionRef = useRef<any>({})
  const formInitValue = nodeRecord ? getButtonAuth(nodeRecord.key) : {}
  const [errors, setErrors] = useState<boolean>(false)
  const [formValue, setFormValue] = useState<any>(null)
  // 储存的数据权限选项
  const [authInfos, setAuthInfos] = useState<any>({})
  const [plateformTreeList, setplateformTreeList] = useState<any>([])
  // 存储默认勾选的id
  const [checkIds, setcheckIds] = useState<any>({})
  const modalRef = useRef<any>({})
  // 存储右边点击选中的数据权限id
  // const [dataId, setdataId] = useState<any>([])
  // const disabledCheckAuthConfig = useMemo(() => {
  //   if (nodeRecord && authInfos[nodeRecord.id]) {
  //     return authInfos[nodeRecord.id] as {
  //       hasDataAuth: number
  //       dataAuthConfig: number
  //       orgIds: any[]
  //     }
  //   } else {
  //     return { hasDataAuth: 0, dataAuthConfig: 0, orgIds: [] }
  //   }
  // }, [authInfos, nodeRecord])
  const { pageStatus, id } = usePageStatus()

  // 编辑和预览模式下需回显数据
  // const fetchRoleMenuDetail = () => {
  //   getMemberRoleGet({ memberRoleId: id }, { useCache: true, ttl: 10 * 1000 }).then((res) => {
  //     const { data } = res
  //     setcheckIds({ ...data.checkIds })
  //     treeActions.setSelectKeys(data.checkIds)
  //     setFormValue(data)
  //   })
  // }

  // useEffect(() => {
  //   if (!id) return
  //   fetchRoleMenuDetail()
  // }, [])

  useEffect(() => {
    if (formInitValue) {
      // if (actionRef.current.setSelected) {
      //   actionRef.current.setSelected();
      // }
    }
  }, [getButtonAuth, nodeRecord])

  // // 提交
  // const handleSubmit = () => {
  //   menuActions
  //     .submit()
  //     .then(async ({ values }) => {
  //       setErrors(false)
  //       // 如果未点击过操作权限tab, 则无法获取到actionRef实例, 需补充手动补充回显的ids, 新增的时候如果未设置按钮，则返回空数组
  //       const buttonCheckIds = actionRef.current.selected || (formValue && formValue.ids) || []
  //       // 获取选中的树状 id
  //       const treeCheckIds = treeActions.getSelectKeys()
  //       // 把后台返回的数据处理成一个数组
  //       const cheIds = []
  //       for (let i in checkIds) {
  //         cheIds.push(checkIds[i])
  //       }
  //       // console.log(cheIds, 'cheIds', treeCheckIds, checkIds)
  //       // 判断后台返回的选中id 是否和和当前选中id是一样
  //       const flag = treeCheckIds.join(',') === cheIds.join(',') ? true : false
  //       // 如果后台返回的选中的id 和 当前选中id 是一样 则午休修改 提交一个空数据过去
  //       const publicarr = []
  //       let list = []
  //       if (!flag) {
  //         // 如果后台返回的id 不匹配 当前选中的 id 把这个id设置为不选中
  //         for (let i = 0; i < cheIds.length; i++) {
  //           if (treeCheckIds.indexOf(cheIds[i]) === -1) {
  //             publicarr.push({
  //               menuId: cheIds[i],
  //               checked: false,
  //             })
  //           }
  //         }
  //         // 如果选中选中id 不匹配后台返回选中id 把这个id 设置为选中
  //         for (let i = 0; i < treeCheckIds.length; i++) {
  //           if (cheIds.indexOf(treeCheckIds[i]) === -1) {
  //             publicarr.push({
  //               menuId: treeCheckIds[i],
  //               checked: true,
  //             })
  //           }
  //         }
  //       }
  //       // 如果点击了 就给他重新更新一下
  //       if (dataId.length != 0) {
  //         for (let i = 0; i < dataId.length; i++) {
  //           publicarr.push({
  //             menuId: dataId[i],
  //             checked: true,
  //           })
  //         }
  //       }

  //       // 数组对象去掉重复 如果 dataid 和 publicarr 有值才去去重复
  //       list = publicarr.filter((element, index, self) => {
  //         return self.findIndex((x) => x.menuId === element.menuId) === index
  //       })

  //       const publicParams = {
  //         ...values,
  //         imFlag: !!values.imFlag,
  //         auth:
  //           flag && dataId.length < 0
  //             ? []
  //             : list.map((v) => ({
  //                 menuId: v.menuId,
  //                 buttonIds:
  //                   Object.keys(authInfos).length != 0 && authInfos[v.menuId] ? authInfos[v.menuId].buttonIds : [],
  //                 checked: v.checked,
  //                 hasDataAuth:
  //                   Object.keys(authInfos).length != 0 && authInfos[v.menuId] ? authInfos[v.menuId]?.hasDataAuth : 0,
  //                 orgIds: Object.keys(authInfos).length != 0 && authInfos[v.menuId] ? authInfos[v.menuId]?.orgIds : [],
  //               })),
  //       }
  //       console.log(publicParams, 'publicParams')
  //       delete publicParams.checkIds

  //       let res
  //       if (pageStatus === PageStatus.EDIT) {
  //         res = await postMemberRoleUpdate({
  //           memberRoleId: id,
  //           ...publicParams,
  //         })
  //       } else {
  //         res = await postMemberRoleAdd({
  //           ...publicParams,
  //         })
  //       }
  //       const { code, message } = res
  //       if (code === 1000) {
  //         // 重新加载全局回显数据
  //         fetchRoleMenuDetail()
  //       }
  //       // fix： 这里是无论什么操作都返回上一页，不利于用户体验，在操作权限功能的时候
  //       // resetMenu(); // 重置一下数据树 不然重新选择回和上一次数据树一致
  //       // history.goBack(-1);
  //     })
  //     .catch((err) => {
  //       // console.log(err);
  //       if (Array.isArray(err)) {
  //         setErrors(true)
  //       }
  //     })
  // }

  // 数据权限按钮控制
  const onDataAuthChange = (e) => {
    // @fix 20230823-数据权限暂时不做
    // // 如果id 不存在就存储进去
    // if (!dataId.includes(nodeRecord.id)) {
    //   dataId.push(nodeRecord.id)
    //   setdataId(dataId)
    // }
    // setAuthInfos({
    //   ...authInfos,
    //   [nodeRecord.id]: Object.assign({ ...authInfos[nodeRecord.id] }, { hasDataAuth: e.target.checked ? 1 : 0 }),
    // })
  }

  const extraButtons = (
    <Space>
      <Button type="primary" disabled={pageStatus === PageStatus.PREVIEW} onClick={handleSubmit}>
        {intl.formatMessage({ id: 'common.button.save' })}
      </Button>
    </Space>
  )

  // const mapkey = (plateformTreeData: any, selectKeys: any, plateformTreeDataList = []) => {
  //   plateformTreeData.map((item: any) => {
  //     if (selectKeys.includes(item.id)) {
  //       plateformTreeDataList.push({
  //         id: item.id,
  //         title: item.title,
  //       })
  //       if (item.children.length > 0) {
  //         const arr = mapkey(item.children, selectKeys, plateformTreeDataList)
  //         plateformTreeDataList = [...arr]
  //       }
  //     } else {
  //       const arr = mapkey(item.children, selectKeys, plateformTreeDataList)
  //       plateformTreeDataList = [...arr]
  //     }
  //   })
  //   return plateformTreeDataList
  // }
  // const handleOrgSuccess = (selectKeys) => {
  //   // console.log(selectKeys, 'selectKeys')
  //   if (!dataId.includes(nodeRecord.id)) {
  //     dataId.push(nodeRecord.id)
  //     setdataId(dataId)
  //   }
  //   // console.log(dataId)
  //   setAuthInfos({
  //     ...authInfos,
  //     [nodeRecord.id]: Object.assign({ ...authInfos[nodeRecord.id] }, { orgIds: selectKeys }),
  //   })
  //   let plateformTreeDataList = mapkey(plateformTreeData, selectKeys, [])
  //   setplateformTreeList(plateformTreeDataList)
  //   setOrgModalVisible(false)
  // }
  // const handleOrgCancel = () => {
  //   setOrgModalVisible(false)
  // }

  // const handleOpenOrg = () => {
  //   setOrgModalVisible(true)
  // }

  return (
    <PageHeaderWrapper className="addRepository" title={pageTitles[pageStatus]} extra={extraButtons}>
      <Card>
        <Tabs type="card" className="black-tabs">
          <TabsItem
            tab={<TabFormErrors dot={errors}>{intl.formatMessage({ id: 'authConfig.baseInfo' })}</TabFormErrors>}
            key="1"
            forceRender
          >
            <RoleInfo />
          </TabsItem>
          <TabsItem tab={intl.formatMessage({ id: 'authConfig.operationAuthority' })} key="2" forceRender>
            <RoleAuthTree />
            {/* <Row justify="space-between">
              <Col span={16}>
							<RoleAuthTree />
              </Col>
              <Col span={7}>
								<LineCard headTitle={intl.formatMessage({ id: 'authConfig.dataAccess' })}></LineCard>
                {nodeRecord && (
                  <>
                    <Checkbox
                      checked={!!disabledCheckAuthConfig.hasDataAuth}
                      onChange={(e) => onDataAuthChange(e)}
                      disabled={pageStatus === PageStatus.PREVIEW || !disabledCheckAuthConfig.dataAuthConfig}
                    >
                      {intl.formatMessage({ id: 'authConfig.ifHasDataAccess' })}
                    </Checkbox>
                    <div style={{ marginTop: 16 }}>
                      <p style={{ color: '#909399' }}>
                        {intl.formatMessage({ id: 'authConfig.OrganizationAuthorization' })}
                      </p>
                      {plateformTreeList.map((v) => {
                        return (
                          <div className="org-tag-container" key={v.id}>
                            <Tag color={'#F4F5F7'} className="org-tag">
                              {v.title}
                            </Tag>
                          </div>
                        )
                      })}

                      <Button
                        block
                        type="dashed"
                        onClick={handleOpenOrg}
                        disabled={pageStatus === PageStatus.PREVIEW || !disabledCheckAuthConfig.dataAuthConfig}
                      >
                        <PlusOutlined /> {intl.formatMessage({ id: 'authConfig.orientation' })}
                      </Button>
                    </div>
                  </>
                )}
              </Col>
            </Row> */}
          </TabsItem>
        </Tabs>
        {/* <OrgModal
          handleSyncSelect={handleSyncSelect}
          plateformTreeData={plateformTreeData}
          fetchOrgsTreeData={fetchOrgsTreeData}
          selectKeys={disabledCheckAuthConfig.orgIds}
          visible={orgModalVisible}
          onSuccess={handleOrgSuccess}
          onCancel={handleOrgCancel}
          modalRef={modalRef}
        /> */}
      </Card>
    </PageHeaderWrapper>
  )
}

export default () => (
  <RoleAuthTreeProvider>
    <MemberDetail />
  </RoleAuthTreeProvider>
)
