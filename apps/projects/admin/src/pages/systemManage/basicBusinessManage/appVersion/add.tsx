import React, { useEffect, useState } from 'react'
import NiceForm from '@/components/NiceForm'
import ReturnEle from '@/components/ReturnEle'
import { usePageStatus } from '@/hooks/usePageStatus'
import { PageHeaderWrapper } from '@apps/components'
import { Button, Card, message, Tooltip } from 'antd'
import { history } from '@linkseeks/router-manager'
import schema from './schema'
import { Radio } from '@apps/formily'
import FormilyUploadFiles from '@/components/UploadFiles/FormilyUploadFiles'
import { createFormActions } from '@apps/formily'
import Editor from './components/Editor'
import moment, { Moment } from 'moment'
import {
  getManageAppVersionFind,
  GetManageAppVersionFindResponse,
  postManageAppVersionAdd,
  postManageAppVersionUpdate,
} from '@apps/apis'
import { omit } from '@/utils'
import { BraftEditor } from '@apps/components'
import { QuestionCircleOutlined } from '@ant-design/icons'

const formActions = createFormActions()

type SubmitData = {
  content: any
  version: string
  releaseTime: string
  type: 1 | 2
  installPack: {
    name: string
    url: string
    status?: 'uploading' | 'done'
  }[]
}

type InitialValueData = Omit<GetManageAppVersionFindResponse, 'installPack'> & {
  installPack: {
    name: string
    url: string
  }[]
}

function range(start: number, end: number) {
  const result: number[] = []
  for (let i = start; i < end; i++) {
    result.push(i)
  }
  return result
}

const AppVersionAdd = () => {
  const { id, preview } = usePageStatus()
  const isEdit = id && !preview
  const isAdd = !id && !preview
  const isView = id && preview
  const currentDay = moment()
  const [initialValue, setInitialValue] = useState<InitialValueData>({
    releaseTime: currentDay.format('YYYY-MM-DD HH:mm:ss'),
  } as unknown as InitialValueData)
  const lastDay = moment().subtract(1, 'day')

  /** 查看或修改时获取数据 */
  useEffect(() => {
    if (!id) {
      return
    }
    async function getInitialValue() {
      const { data, code } = await getManageAppVersionFind({ id })
      if (code === 1000) {
        const editorState = (data.content && BraftEditor.createEditorState(data.content)) || ''
        setInitialValue({
          ...data,
          content: editorState,
          installPack: [
            {
              name: data.installPack.split('/').at(-1)!,
              url: data.installPack,
            },
          ],
        })
      }
    }
    getInitialValue()
  }, [])

  const onSubmit = async (values: SubmitData) => {
    const conent = values.content.toHTML()
    const installPack = values.installPack
    const fileIsUploading = installPack.some((_item) => _item?.status === 'uploading')
    if (fileIsUploading) {
      message.error('文件正在上传中。。。，请稍后再试')
      return
    }

    const service = isAdd ? postManageAppVersionAdd : postManageAppVersionUpdate

    const postData = {
      content: conent,
      ...omit(values, ['content', 'installPack']),
      installPack: values.installPack.at(0)?.url,
    }
    const { data, code } = await service(postData)
    if (code === 1000) {
      history.goBack()
      return
    }
  }

  const createRichTextUtils = () => {
    return {
      text(...args) {
        return React.createElement('span', {}, ...args)
      },
      help(text, offset = 3) {
        return React.createElement(
          Tooltip,
          { title: text },
          <QuestionCircleOutlined style={{ margin: '0 3px', cursor: 'default', marginLeft: offset }} />,
        )
      },
      tips(text, tips) {
        return React.createElement(
          Tooltip,
          { title: tips },
          <span style={{ margin: '0 3px', cursor: 'default' }}>{text}</span>,
        )
      },
    }
  }

  const disabledDate = (current: Moment) => {
    return current < lastDay.endOf('day')
  }

  const disabledTime = (current) => {
    if (!moment().isSame(current, 'day')) {
      return {}
    }
    return {
      disabledHours: () => range(0, 24).splice(0, currentDay.get('hour')),
      disabledMinutes: () => range(0, 60).splice(0, currentDay.get('minute')),
      disabledSeconds: () => range(0, 60).splice(0, currentDay.get('second')),
    }
  }

  return (
    <PageHeaderWrapper
      title={isAdd ? '新增版本' : isEdit ? '编辑版本' : '查看版本'}
      extra={!isView && <Button onClick={() => formActions.submit()}>保存</Button>}
    >
      <Card>
        <NiceForm
          editable={isAdd || isEdit}
          value={initialValue}
          expressionScope={{
            disabledDate,
            disabledTime,
            ...createRichTextUtils(),
          }}
          actions={formActions}
          schema={schema}
          onSubmit={onSubmit}
          components={{
            Radio,
            RadioGroup: Radio.Group,
            Editor,
            FormilyUploadFiles,
          }}
        ></NiceForm>
      </Card>
    </PageHeaderWrapper>
  )
}

export default AppVersionAdd
