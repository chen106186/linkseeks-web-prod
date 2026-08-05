/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-26 14:21:57
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 18:20:04
 * @Description: 新增会员角色 Drawer
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Drawer, Button } from 'antd'
import { DatePicker } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import {
  getMemberSupplierAbilityInfoMembertypeList,
  getMemberSupplierAbilityInfoRoleList,
  getMemberSupplierAbilityInfoUpperMemberInfo,
} from '@apps/apis'
import { GlobalConfig } from '@/global/config'
import schema from './schema'

const formActions = createFormActions()
const { onFieldValueChange$, onFieldInputChange$, onFormInputChange$, onFormInit$ } = FormEffectHooks

interface IProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * Form 确认事件
   */
  onSubmit: (values: any) => void
  /**
   * 抽屉关闭事件
   */
  onClose: () => void
}

const mockMemberData = [
  {
    memberName: '18800000035',
    memberId: 236,
  },
  {
    memberName: '万宜贸易',
    memberId: 123,
  },
]

const AddRoleDrawer: React.FC<IProps> = (props: IProps) => {
  const { visible, onSubmit, onClose } = props

  const intl = useIntl()

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const getMemberSuppliertype = (memberId?: number) => {
    return new Promise((resolve, reject) => {
      getMemberSupplierAbilityInfoMembertypeList({
        memberId: memberId ? `${memberId}` : '',
      })
        .then((res) => {
          if (res.code === 1000) {
            const options = res.data.map((item) => ({ label: item.memberTypeName, value: item.memberType }))
            resolve(options)
          }
          reject()
        })
        .catch(() => {
          reject()
        })
    })
  }

  // const useAsyncDataSource = (name, service) => {
  //   const { dispatch, setFieldState } = createFormActions();
  //   const linkage = useLinkageUtils();
  //   onFormInit$().subscribe(() => {
  //     setFieldState(name, state => {
  //       FormPath.setIn(state, 'props.x-props.hasFeedback', true);
  //     });
  //     linkage.loading(name);
  //     service().then(res => {
  //       linkage.loaded(name);
  //       linkage.enum(name, res);
  //       // 请求结束可以dispatch一个自定义事件收尾，方便后续针对该事件做联动
  //       dispatch('requestAsyncDataSource', {
  //         name,
  //         payload: res
  //       });
  //     });
  //   });
  // };

  const getRoleByMemberType = (memberType: number, memberId?: number) => {
    return new Promise((resolve, reject) => {
      getMemberSupplierAbilityInfoRoleList({
        memberType: `${memberType}`,
        memberId: memberId ? `${memberId}` : '',
      })
        .then((res) => {
          if (res.code === 1000) {
            const { roles = [], checkIds = [] } = res.data
            const options = roles.map((item) => ({
              label: item.roleName,
              value: item.roleId,
              disabled: checkIds.find((id) => id === item.roleId),
            }))
            resolve(options)
          }
          reject()
        })
        .catch(() => {
          reject()
        })
    })
  }

  const handleSubmit = (values: any) => {
    if (onSubmit) {
      onSubmit(values)
    }
  }

  return (
    <Drawer
      title={intl.formatMessage({ id: 'member.memberQuery.components.AddRoleDrawer.title' })}
      width={600}
      onClose={handleClose}
      visible={visible}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={handleClose} style={{ marginRight: 16 }}>
            {intl.formatMessage({ id: 'member.actions.cancel' })}
          </Button>
          <Button onClick={() => formActions.submit()} type="primary">
            {intl.formatMessage({ id: 'member.actions.confirm' })}
          </Button>
        </div>
      }
    >
      <NiceForm
        previewPlaceholder="' '"
        components={{
          DatePicker,
        }}
        effects={($, { setFieldState, getFieldValue }) => {
          const linkage = useLinkageUtils()

          onFieldInputChange$('memberType').subscribe((fieldState) => {
            const roleIdValue = getFieldValue('roleId')
            const upperMemberIdValue = getFieldValue('upperMemberId')
            if (roleIdValue) {
              linkage.value('roleId', undefined)
              setTimeout(() => {
                formActions.clearErrors('roleId')
              }, 0)
            }
            setFieldState('roleId', (state) => {
              FormPath.setIn(state, 'props.x-props.hasFeedback', true)
            })
            linkage.loading('roleId')
            getRoleByMemberType(+fieldState.value, +upperMemberIdValue)
              .then((res) => {
                linkage.enum('roleId', res)
              })
              .finally(() => {
                linkage.loaded('roleId')
              })
          })

          onFieldInputChange$('upperMemberId').subscribe((fieldState) => {
            const memberTypeValue = getFieldValue('memberType')
            const roleIdValue = getFieldValue('roleId')
            if (memberTypeValue) {
              linkage.value('memberType', undefined)
              setTimeout(() => {
                formActions.clearErrors('memberType')
              }, 0)
            }
            if (roleIdValue) {
              linkage.value('roleId', undefined)
              setTimeout(() => {
                formActions.clearErrors('roleId')
              }, 0)
            }

            // 清空选项
            linkage.enum('memberType', [])
            linkage.enum('roleId', [])

            linkage.loading('memberType')
            getMemberSuppliertype(+fieldState.value)
              .then((res) => {
                linkage.enum('memberType', res)
              })
              .finally(() => {
                linkage.loaded('memberType')
              })
          })

          onFormInit$().subscribe(() => {
            const initMemberType = () => {
              setFieldState('memberType', (state) => {
                FormPath.setIn(state, 'props.x-props.hasFeedback', true)
              })
              linkage.loading('memberType')
              getMemberSuppliertype().then((res) => {
                linkage.loaded('memberType')
                linkage.enum('memberType', res)
              })
            }

            // 如果【PAAS-站点管理】未勾选【SAAS多租户部署】，隐藏上级会员名称选择框
            if (!GlobalConfig.global.siteInfo.enableMultiTenancy) {
              linkage.hide('upperMemberId')
              initMemberType()
            } else {
              getMemberSupplierAbilityInfoUpperMemberInfo().then((res) => {
                if (res.code === 1000) {
                  // show = true 展示对应的上级会员下拉
                  // 否则，初始会员类型数据
                  if (res.data.show) {
                    linkage.show('upperMemberId')
                    linkage.enum(
                      'upperMemberId',
                      res.data.upperMemberList.map((item) => ({ label: item.memberName, value: item.memberId })),
                    )
                  } else {
                    initMemberType()
                  }
                } else {
                  initMemberType()
                }
              })
            }
          })
        }}
        actions={formActions}
        schema={schema}
        onSubmit={(values) => handleSubmit(values)}
      />
    </Drawer>
  )
}

export default AddRoleDrawer
