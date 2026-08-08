import React from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { Card, Button, Space } from 'antd'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { useSelfTable } from './model/useSelfTable'
import { PlusCircleOutlined } from '@ant-design/icons'
import { tableListSchema } from './schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import '../../utils/index.less'
import { getPurchaseExpertExtractGetExpertExtractList } from '@apps/apis'
import { AuthButton } from '@apps/components'
const intl = getIntl()

// 评标委员会 招标 @@又名 专家抽取管理
export interface RemarkBidCommitteeProps {}

const fetchTableData = async (params) => {
  const { data } = await getPurchaseExpertExtractGetExpertExtractList(params)
  return data
}

const RemarkBidCommittee: React.FC<RemarkBidCommitteeProps> = (props) => {
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
              schema: tableListSchema,
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
              },
              components: {
                DateRangePickerUnix,
                Submit,
              },
            },
            layouts: {
              order: 2,
              span: 16,
            },
          }}
          formilyChilds={{
            children: (
              <Space>
                <AuthButton type="add" code="add">
                  <Button
                    icon={<PlusCircleOutlined />}
                    type="primary"
                    onClick={() => history.push('/procurementAbility/callForBids/remarkBidCommittee/add')}
                  >
                    {intl.formatMessage({ id: 'table.purchase.added' })}
                  </Button>
                </AuthButton>
              </Space>
            ),
            layouts: {
              span: 8,
            },
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

RemarkBidCommittee.defaultProps = {}

export default RemarkBidCommittee
