import { Button } from 'antd'
import { Input, Select, SchemaMarkupField as Field, FormButtonGroup } from '@apps/formily'
import { useLocation } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
import { useState, useEffect } from 'react'
import {
  postMemberMemberRoleConfigUpdate,
  getMemberMemberRoleConfigGetMemberRoleTypeList,
  getMemberMemberRoleConfigGetMemberRoleTagList,
  getMemberMemberRoleConfigGetMemberTypeList,
} from '@apps/apis'
import DetailPage from '@/components/DetailPage'
import NiceForm from '@/components/NiceForm'

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
}

const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 12,
  },
}

interface OptionsType {
  /**
   * 枚举值
   */
  value: number
  /**
   * 枚举名称
   */
  label: string
}

interface IProps {
  isPreview?: boolean
}

const MemberForm = (props: IProps) => {
  const { isPreview = false } = props
  const { state } = useLocation()
  const [memberRoleTypeList, setMemberRoleTypeList] = useState<OptionsType[]>([])
  const [memberRoleTagList, setMemberRoleTagList] = useState<OptionsType[]>([])
  const [memberTypeList, setMemberTypeList] = useState<OptionsType[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchOptions = async () => {
    getMemberMemberRoleConfigGetMemberRoleTagList().then((res) => {
      setMemberRoleTagList(
        res.data.map((item) => ({
          label: item.configEnumName,
          value: item.configEnum,
        })),
      )
    })
    getMemberMemberRoleConfigGetMemberTypeList().then((res) => {
      setMemberTypeList(
        res.data.map((item) => ({
          label: item.configEnumName,
          value: item.configEnum,
        })),
      )
    })
    getMemberMemberRoleConfigGetMemberRoleTypeList().then((res) => {
      setMemberRoleTypeList(
        res.data.map((item) => ({
          label: item.configEnumName,
          value: item.configEnum,
        })),
      )
    })
  }

  useEffect(() => {
    fetchOptions()
  }, [])

  const onFinish = async (values) => {
    try {
      setLoading(true)
      const res = await postMemberMemberRoleConfigUpdate(values)
      if (res.code !== 1000) {
        setLoading(false)
      } else {
        history.goBack()
      }
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <DetailPage title={isPreview ? '查看会员角色' : '编辑会员角色'}>
      <div className="common-wrapper">
        <NiceForm
          editable={!isPreview}
          defaultValue={{
            ...state,
            roleName: state?.memberRoleName,
            roleTagEnum: state?.roleTag,
            roleTypeEnum: state?.roleType,
            memberTypeEnum: state?.memberType,
          }}
          {...layout}
          onSubmit={onFinish}
          components={{ Input, Select }}
        >
          <Field
            type="string"
            title="会员角色"
            name="roleName"
            x-rules={[
              { required: true, message: '请输入会员角色' },
              { max: 16, message: '最多输入16个字符' },
            ]}
            x-component="Input"
          />
          <Field
            type="string"
            enum={memberRoleTagList}
            title="角色标签"
            x-rules={{ required: true, message: '请选择角色标签' }}
            name="roleTagEnum"
            x-component="Select"
          />
          <Field
            type="string"
            enum={memberRoleTypeList}
            title="角色类型"
            x-rules={{ required: true, message: '请选择角色类型' }}
            name="roleTypeEnum"
            x-component="Select"
            editable={state?.status === 0}
          />
          <Field
            type="string"
            enum={memberTypeList}
            title="会员类型"
            x-rules={{ required: true, message: '请选择会员类型' }}
            name="memberTypeEnum"
            x-component="Select"
          />
          <FormButtonGroup {...tailLayout.wrapperCol}>
            <Button type="primary" htmlType="submit" disabled={isPreview} loading={loading}>
              提交
            </Button>
            ​
          </FormButtonGroup>
        </NiceForm>
      </div>
    </DetailPage>
  )
}

export default MemberForm
