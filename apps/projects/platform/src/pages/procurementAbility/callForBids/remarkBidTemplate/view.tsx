import React from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { Card, Button, Space } from 'antd'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { useSelfTable } from './model/useSelfTable'
import { PlusCircleOutlined } from '@ant-design/icons'
import '../../utils/index.less'
import { getPurchaseTemplateGetTemplateList } from '@apps/apis'
import { AuthButton } from '@apps/components'
const intl = getIntl()

// 评标模板 招标

export interface RemarkBidTemplateProps {}

const fetchTableData = async (params) => {
  const { data } = await getPurchaseTemplateGetTemplateList(params)
  return data
}

const RemarkBidTemplate: React.FC<RemarkBidTemplateProps> = (props) => {
  const { columns, ref } = useSelfTable()

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(params) => fetchTableData(params)}
          columns={columns}
          currentRef={ref}
          rowKey={'id'}
          formilyLayouts={{
            justify: 'space-between',
          }}
          formilyProps={{
            ctx: {
              inline: false,
              schema: {
                type: 'object',
                properties: {
                  megaLayout0: {
                    type: 'object',
                    'x-component': 'mega-layout',
                    'x-component-props': {
                      grid: true,
                      columns: 2,
                    },
                    properties: {
                      name: {
                        type: 'string',
                        'x-component-props': {
                          placeholder: intl.formatMessage({ id: 'table.purchase.name' }),
                        },
                        'x-component': 'Search',
                      },
                    },
                  },
                },
              },
            },
            layouts: {
              order: 1,
              span: 4,
            },
          }}
          formilyChilds={{
            children: (
              <Space>
                <AuthButton type="add" code="add">
                  <Button
                    icon={<PlusCircleOutlined />}
                    type="primary"
                    onClick={() => history.push('/procurementAbility/callForBids/remarkBidTemplate/add')}
                  >
                    {intl.formatMessage({ id: 'table.purchase.added' })}
                  </Button>
                </AuthButton>
              </Space>
            ),
            layouts: {
              order: 0,
            },
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

RemarkBidTemplate.defaultProps = {}

export default RemarkBidTemplate
