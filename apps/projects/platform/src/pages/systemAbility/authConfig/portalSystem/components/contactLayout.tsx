import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Form, FormInstance, Input, Modal, Row, Select } from 'antd'
import { Card as CardLayout } from '@linkseeks/ui'
import { LinkOutlined } from '@ant-design/icons'
import AreaSelect from '@/components/AddressSelect/components/AreaSelect'
import TabTree, { createTreeActions } from '@/components/AntTree'
import { useTreeTabs } from '@/hooks/useTreeTabs'
import { getMemberOrgNonStoreTree } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { Context } from '../add'
import { getParentTreeTitles } from '@/utils'
import { PATTERN_MAPS } from '@/constants/regExp'
import { validatorByte } from '@/utils/regExp'
import { getTelCodeOptions } from '@apps/services'

const intl = getIntl()
const originTreeActions = createTreeActions()

interface ContactProps {
  /** form 实例 */
  form?: FormInstance
}

const ContactLayout: React.FC<ContactProps> = (props) => {
  const { form } = props
  const [originVisible, setOriginVisible] = useState(false)
  const [originSelectNode, setOriginSelectNode] = useState<any>()
  const [telCode, setTelCode] = useState<any[]>([])
  const context = useContext(Context)

  const fetchOriginTreeData = async (params?) => {
    // 平台后台树
    const res = await getMemberOrgNonStoreTree({}, { ttl: 10, useCache: true })
    return res
  }

  const { treeData: originTreeData } = useTreeTabs({
    fetchMenuData: fetchOriginTreeData,
  })
  const fetchTelCode = async () => {
    const data = await getTelCodeOptions()
    setTelCode(data)
  }

  const handlePlateformSelect = (key, node) => {
    setOriginSelectNode({ id: key * 1, name: node._title })
  }

  const handleOrigin = () => {
    setOriginVisible(false)
    setOriginVisible(false)
    if (originSelectNode?.id) {
      form.setFieldsValue({
        orgName: originTreeActions.getParentPath(originSelectNode.id),
        orgId: originSelectNode.id,
      })
    }
  }

  const openOriginTree = () => {
    setOriginVisible(true)
  }

  useEffect(() => {
    fetchTelCode()
    if (context) {
      fetchOriginTreeData().then(({ data: dataSource }) => {
        const areaSelect = [
          { name: context.provinceName, code: context.provinceCode },
          { name: context.cityName, code: context.cityCode },
          { name: context.districtName, code: context.districtCode },
          { name: context.streetName, code: context.streetCode },
        ]
        form.setFieldsValue({
          orgName: getParentTreeTitles(dataSource, context.org.id),
          orgId: context.org.id,
          areaSelect: areaSelect,
        })
      })
    }
  }, [context])

  return (
    <CardLayout id="contactLayout" title="联系信息">
      <Row gutter={[48, 24]}>
        <Col span={12}>
          <Form.Item
            label={intl.formatMessage({ id: 'portalSystem.mendiandizhi', defaultMessage: '门店地址' })}
            name="areaSelect"
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'portalSystem.qingxuanzeshengshiqu',
                  defaultMessage: '请选择省/市/区',
                }),
              },
            ]}
          >
            <AreaSelect />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'portalSystem.xiangxidizhi', defaultMessage: '详细地址' })}
            name="address"
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'portalSystem.qingtianxiexiangxidizhi',
                  defaultMessage: '请填写详细地址，路名、门牌号等',
                }),
              },
              { validator: (rule, value, callback) => validatorByte(rule, value, callback, 60) },
            ]}
          >
            <Input.TextArea
              autoSize
              placeholder={intl.formatMessage({
                id: 'portalSystem.qingtianxiexiangxidizhi',
                defaultMessage: '请填写详细地址，路名、门牌号等',
              })}
            />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'portalSystem.lianxirenxingming', defaultMessage: '联系人姓名' })}
            name="contactName"
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'portalSystem.qingshurulianxirenxingming',
                  defaultMessage: '请输入联系人姓名',
                }),
              },
              { validator: (rule, value, callback) => validatorByte(rule, value, callback, 16) },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({
                id: 'portalSystem.qingshurulianxirenxingming',
                defaultMessage: '请输入联系人姓名',
              })}
            />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'portalSystem.lianxidianhua', defaultMessage: '联系电话' })}
            required
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="telCode"
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'portalSystem.qingxuanzequhao', defaultMessage: '请选择区号' }),
                    },
                  ]}
                >
                  <Select
                    placeholder={intl.formatMessage({
                      id: 'portalSystem.qingxuanzequhao',
                      defaultMessage: '请选择区号',
                    })}
                  >
                    {telCode.map((item) => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'portalSystem.qingshurushoujihaoma',
                        defaultMessage: '请输入手机号码',
                      }),
                    },
                    {
                      pattern: PATTERN_MAPS.phone,
                      message: intl.formatMessage({
                        id: 'portalSystem.shoujihaomageshibuzheng',
                        defaultMessage: '手机号码格式不正确',
                      }),
                    },
                  ]}
                >
                  <Input
                    placeholder={intl.formatMessage({
                      id: 'portalSystem.qingshurushoujihaoma',
                      defaultMessage: '请输入手机号码',
                    })}
                    type="number"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={intl.formatMessage({ id: 'portalSystem.youxiang', defaultMessage: '邮箱' })}
            name="email"
            rules={[
              {
                pattern: PATTERN_MAPS.email,
                message: intl.formatMessage({
                  id: 'portalSystem.youxianggeshibuzhengque',
                  defaultMessage: '邮箱格式不正确',
                }),
              },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({ id: 'portalSystem.qingshuruyouxiang', defaultMessage: '请输入邮箱' })}
            />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'portalSystem.youbian', defaultMessage: '邮编' })}
            name="postalCode"
            rules={[{ validator: (rule, value, callback) => validatorByte(rule, value, callback, 12) }]}
          >
            <Input
              placeholder={intl.formatMessage({ id: 'portalSystem.qingshuruyoubian', defaultMessage: '请输入邮编' })}
            />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'portalSystem.zhiwei', defaultMessage: '职位' })}
            name="position"
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'portalSystem.qingshuruzhiwei', defaultMessage: '请输入职位' }),
              },
              { validator: (rule, value, callback) => validatorByte(rule, value, callback, 20) },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({ id: 'portalSystem.qingshuruzhiwei', defaultMessage: '请输入职位' })}
            />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'portalSystem.suoshuzuzhijigou', defaultMessage: '所属组织机构' })}
            name="orgName"
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'portalSystem.qingxuanzesuoshuzuzhiji',
                  defaultMessage: '请选择所属组织机构',
                }),
              },
            ]}
          >
            <Input.Search
              onSearch={() => openOriginTree()}
              placeholder={intl.formatMessage({
                id: 'portalSystem.qingxuanzesuoshuzuzhiji',
                defaultMessage: '请选择所属组织机构',
              })}
              readOnly
              enterButton={
                <Button
                  style={{ backgroundColor: '#00a98f' }}
                  type="primary"
                  icon={<LinkOutlined style={{ marginRight: 4 }} />}
                >
                  {intl.formatMessage({ id: 'portalSystem.xuanze', defaultMessage: '选择' })}
                </Button>
              }
            />
          </Form.Item>
          <Form.Item
            hidden
            label="所属组织机构"
            name="orgId"
            rules={[{ required: true, message: '请选择所属组织机构' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Modal
        title={intl.formatMessage({ id: 'authConfig.chooseOrganization' })}
        visible={originVisible}
        onOk={handleOrigin}
        onCancel={() => setOriginVisible(false)}
        okText={intl.formatMessage({ id: 'authConfig.confirm' })}
        cancelText={intl.formatMessage({ id: 'authConfig.cancel' })}
        getContainer="#root"
      >
        <TabTree
          fetchData={(params) => fetchOriginTreeData(params)}
          treeData={originTreeData}
          handleSelect={(key, node) => handlePlateformSelect(key, node)}
          actions={originTreeActions}
          customKey="id"
          customTitle="name"
        />
      </Modal>
    </CardLayout>
  )
}
export default ContactLayout
