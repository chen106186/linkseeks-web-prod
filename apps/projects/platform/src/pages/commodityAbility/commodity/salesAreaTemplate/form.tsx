import React, { useEffect, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { useIntl } from '@linkseeks/i18n'
import { Form, Card, Space, Input, Button, RadioGroup, Radio, Cascader } from '@linkseeks/ui'
import { QuestionCircleIcon } from '@linkseeks/icons'
import { history } from '@linkseeks/router-manager'
import {
  postProductCommoditySalesAreaTemplateAdd,
  postProductCommoditySalesAreaTemplateEdit,
  getProductCommoditySalesAreaTemplateDetail,
} from '@apps/apis'
import useAreaCascader from '../services/hooks/useAreaCascader'
import { usePageStatus } from '@/hooks/usePageStatus'

interface IProps {
  /** 操作类型：'add' | 'edit' */
  operateType: 'add' | 'edit'
}

export interface SalesAreaItem {
  id: string
  parentId: string
  name: string
  children: SalesAreaItem[]
}

const SalesAreaTempalteForm: React.FC<IProps> = (props) => {
  const { operateType } = props
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const { areaList } = useAreaCascader()
  const [form] = Form.useForm()
  const intl = useIntl()
  const { id } = usePageStatus()

  const formatToPaths = (treeData: SalesAreaItem[]) => {
    const resultList: Array<string[]> = []

    // 递归处理节点
    function processNode(node, path) {
      const currentPath: string[] = [...path, node.id]
      if (!node.children) {
        resultList.push(currentPath)
      } else {
        for (const child of node.children) {
          processNode(child, currentPath)
        }
      }
    }

    // 对每个根节点调用处理函数
    for (const node of treeData) {
      processNode(node, [])
    }

    return resultList
  }

  const fetchDetail = () => {
    getProductCommoditySalesAreaTemplateDetail({ id }).then((res) => {
      if (res.code === 1000 && res.data) {
        console.log(formatToPaths(res.data.salesAreaList as SalesAreaItem[]), 'formatToList')
        form.setFieldsValue({
          ...res.data,
          salesAreaTreeList: formatToPaths(res.data.salesAreaList as SalesAreaItem[]),
        })
      }
    })
  }

  useEffect(() => {
    if (id) {
      fetchDetail()
    }
  }, [id])

  // 根据值查询对应节点的标签函数
  const findLabelByValue = (tree, value) => {
    // 深度优先搜索
    const dfs = (node) => {
      // 如果当前节点的值等于目标值，则返回当前节点的标签
      if (node.value === value) {
        return node.label
      }
      // 否则，递归搜索当前节点的子节点
      for (const child of node.children) {
        const result = dfs(child)
        // 如果在子节点中找到了目标值对应的标签，则返回结果
        if (result !== null) {
          return result
        }
      }
      // 如果当前节点及其子节点中都没有找到目标值，则返回null
      return null
    }

    // 从根节点开始搜索
    for (const node of tree) {
      const result = dfs(node)
      if (result !== null) {
        return result
      }
    }
    // 如果整棵树都没有找到目标值，则返回null
    return null
  }

  const processData = (data) => {
    const result: SalesAreaItem[] = []
    const map = {}

    // 遍历原始数据
    data.forEach((item) => {
      let level = result
      let idPath = ''

      // 遍历每个编码的路径
      item.forEach((id) => {
        idPath += id
        // 如果当前id不存在于映射中，则创建一个新的节点
        if (!map[idPath]) {
          const parentId = idPath.substring(0, idPath.length - id.length)
          const parentIdSplit = parentId.split('-')
          const newItem = {
            id,
            parentId: parentIdSplit[parentIdSplit.length - 2],
            name: findLabelByValue(areaList, id),
            children: [],
          }
          map[idPath] = newItem
          level.push(newItem)
        }

        // 更新level和idPath以准备处理下一个id
        level = map[idPath].children
        idPath += '-'
      })
    })

    return result
  }

  const handleSave = () => {
    form.validateFields().then((values) => {
      const APIMAP = {
        add: postProductCommoditySalesAreaTemplateAdd,
        edit: postProductCommoditySalesAreaTemplateEdit,
      }
      const params = {
        ...values,
        salesAreaTreeList: processData(values.salesAreaTreeList),
      }
      setSubmitLoading(true)
      APIMAP[operateType](params)
        .then((res) => {
          if (res.code === 1000) {
            history.goBack()
          }
        })
        .finally(() => {
          setSubmitLoading(false)
        })
    })
  }

  return (
    <PageHeaderWrapper
      extra={
        <Button type="primary" loading={submitLoading} onClick={handleSave}>
          {intl.formatMessage({
            id: 'common.button.save',
            defaultMessage: '保存',
          })}
        </Button>
      }
    >
      <Form form={form} labelCol={{ span: 3 }} wrapperCol={{ span: 15 }} labelAlign="left" style={{ display: 'flex' }}>
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          <Card
            title={intl.formatMessage({ id: 'commodity.salesAreaTemplate.title.basic', defaultMessage: '基本信息' })}
          >
            <Form.Item hidden name="id">
              <Input />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({
                id: 'commodity.salesAreaTemplate.columns.name',
                defaultMessage: '模板名称',
              })}
              name="name"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'commodity.salesAreaTemplate.columns.name.required',
                    defaultMessage: '请输入模板名称',
                  }),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({
                id: 'commodity.salesAreaTemplate.columns.remark',
                defaultMessage: '模板备注',
              })}
              name="remark"
            >
              <Input />
            </Form.Item>
          </Card>
          <Card
            title={intl.formatMessage({ id: 'commodity.salesAreaTemplate.title.config', defaultMessage: '区域配置' })}
          >
            <Form.Item
              label={intl.formatMessage({
                id: 'commodity.salesAreaTemplate.columns.mode',
                defaultMessage: '限制模式',
              })}
              name="limitWay"
              initialValue={1}
              tooltip={{
                title: intl.formatMessage({
                  id: 'commodity.salesAreaTemplate.columns.mode.tip',
                  defaultMessage: '可限制指定区域能销售，或指定地区不能销售',
                }),
                icon: <QuestionCircleIcon />,
              }}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'commodity.salesAreaTemplate.columns.mode.required',
                    defaultMessage: '请选择限制方式',
                  }),
                },
              ]}
            >
              <RadioGroup>
                <Radio value={1}>
                  {intl.formatMessage({
                    id: 'commodity.salesAreaTemplate.columns.mode.1',
                    defaultMessage: '只配送选择区域',
                  })}
                </Radio>
                <Radio value={2}>
                  {intl.formatMessage({
                    id: 'commodity.salesAreaTemplate.columns.mode.2',
                    defaultMessage: '不配送选择区域',
                  })}
                </Radio>
              </RadioGroup>
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({
                id: 'commodity.salesAreaTemplate.columns.areaList',
                defaultMessage: '区域选择',
              })}
              name="salesAreaTreeList"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'commodity.salesAreaTemplate.columns.areaList.required',
                    defaultMessage: '请选择区域',
                  }),
                },
              ]}
            >
              <Cascader
                style={{ width: '100%' }}
                options={areaList}
                multiple
                maxTagCount={9999}
                showCheckedStrategy={Cascader.SHOW_PARENT}
                displayRender={(label) => label.join('/')}
              />
            </Form.Item>
          </Card>
        </Space>
      </Form>
    </PageHeaderWrapper>
  )
}

export default SalesAreaTempalteForm
