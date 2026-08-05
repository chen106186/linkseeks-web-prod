import { useIntl } from '@linkseeks/i18n'
import TableLayout from '@/components/TableLayout'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { FormEffectHooks } from '@apps/formily'
import { Badge, Tag } from 'antd'
import { InnerStatusColor, OuterStatusColor } from '../../common/tagColor'
import {
  getMarketingPlatformActivitySignupGetActivityTypeList,
  getMarketingPlatformActivitySignupGetInnerStatusList,
  getMarketingPlatformActivitySignupGetOuterStatusList,
  getMarketingPlatformActivitySignupPage,
} from '@apps/apis'
import { PATTERN_MAPS } from '@/constants/regExp'
const { onFormMount$ } = FormEffectHooks
import { customAuthUrl as AuthUrl } from '@apps/domains'

const Search = () => {
  const intl = useIntl()
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'paltformSign.activityID' }),
      key: 'activityId',
      dataIndex: 'activityId',
    },
    {
      title: `${intl.formatMessage({ id: 'paltformSign.theNameOfTheEvent' })}`,
      key: 'activityName',
      dataIndex: 'activityName',
      render: (text, record) => (
        <DetailAuthButton>
          <EyeAuthButton
            type={AuthUrl('detail') ? 'link' : 'button'}
            url={`/marketingAbility/paltformSign/search/detail?activityId=${record.activityId}&signUpId=${record.id}&preview=true`}
          >
            {text}
          </EyeAuthButton>
        </DetailAuthButton>
      ),
    },
    {
      title: `${intl.formatMessage({ id: 'paltformSign.theActivityType' })}`,
      key: 'activityType',
      dataIndex: 'activityType',
      render: (_text, record) => <>{record.activityTypeName}</>,
    },
    {
      title: `${intl.formatMessage({ id: 'paltformSign.activitiesStartTime' })}`,
      key: 'startTime',
      dataIndex: 'startTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: `${intl.formatMessage({ id: 'paltformSign.activityOverTime' })}`,
      key: 'endTime',
      dataIndex: 'endTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: `${intl.formatMessage({ id: 'paltformSign.startTimeSigningUp' })}`,
      key: 'signUpStartTime',
      dataIndex: 'signUpStartTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: `${intl.formatMessage({ id: 'paltformSign.endTimeSigningUp' })}`,
      key: 'signUpEndTime',
      dataIndex: 'signUpEndTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: `${intl.formatMessage({ id: 'paltformSign.externalState' })}`,
      key: 'outerStatus',
      dataIndex: 'outerStatus',
      render: (_, record) => <Tag color={OuterStatusColor(_)}>{record.outerStatusName}</Tag>,
    },
    {
      title: `${intl.formatMessage({ id: 'paltformSign.internalState' })}`,
      key: 'innerStatus',
      dataIndex: 'innerStatus',
      render: (text, record) => <Badge status={InnerStatusColor(text)} text={record.innerStatusName} />,
    },
  ]

  const useStateEffects = () => {
    const linkage = useLinkageUtils()
    onFormMount$().subscribe(() => {
      /** 活动类型 */
      getMarketingPlatformActivitySignupGetActivityTypeList()
        .then((res) => {
          const _enum = res.data.map((item) => {
            return { label: item.name, value: item.status }
          })
          linkage.enum('activityType', _enum)
        })
        .catch((err) => {
          console.warn(err)
        })
      /** 外部状态 */
      getMarketingPlatformActivitySignupGetOuterStatusList()
        .then((res) => {
          const _enum = res.data.map((item) => {
            return { label: item.name, value: item.status }
          })
          linkage.enum('outerStatus', _enum)
        })
        .catch((err) => {
          console.warn(err)
        })
      /** 内部状态 */
      getMarketingPlatformActivitySignupGetInnerStatusList()
        .then((res) => {
          const _enum = res.data.map((item) => {
            return { label: item.name, value: item.status }
          })
          linkage.enum('innerStatus', _enum)
        })
        .catch((err) => {
          console.warn(err)
        })
    })
  }

  return (
    <TableLayout
      columns={columns}
      effects="activityName"
      rowKey="activityId"
      fetch={getMarketingPlatformActivitySignupPage}
      useStateEffects={useStateEffects}
      schema={{
        type: 'object',
        properties: {
          megalayout: {
            type: 'object',
            'x-component': 'flex-layout',
            'x-component-props': {
              rowStyle: {
                justifyContent: 'space-between',
              },
            },
            properties: {
              activityName: {
                type: 'string',
                'x-component': 'Search',
                'x-component-props': {
                  placeholder: `${intl.formatMessage({ id: 'selfManagement.theNameOfTheEvent' })}`,
                  align: 'flex-left',
                },
              },
            },
          },
          [FORM_FILTER_PATH]: {
            type: 'object',
            'x-component': 'flex-layout',
            'x-component-props': {
              rowStyle: {
                justifyContent: 'flex-start',
                flexWrap: 'nowrap',
              },
              colStyle: {
                //改变间隔
                marginRight: 0,
              },
            },
            properties: {
              PRO_LAYOUT: {
                type: 'object',
                'x-component': 'flex-layout',
                'x-mega-props': {
                  span: 5,
                },
                'x-component-props': {
                  inline: true,
                  rowStyle: {
                    justifyContent: 'flex-start',
                    flexWrap: 'nowrap',
                  },
                  colStyle: {
                    //改变间隔
                    marginRight: 20,
                  },
                },
                properties: {
                  id: {
                    type: 'number',
                    'x-component-props': {
                      placeholder: `${intl.formatMessage({ id: 'selfManagement.activityID' })}`,
                      style: {
                        width: 160,
                      },
                    },
                  },
                  '[startTime,endTime]': {
                    type: 'daterange',
                    'x-component-props': {
                      placeholder: [
                        `${intl.formatMessage({ id: 'paltformSign.theStartTime' })}`,
                        `${intl.formatMessage({ id: 'paltformSign.theEndOfTime' })}`,
                      ],
                      style: {
                        width: 240,
                      },
                    },
                  },
                  activityType: {
                    type: 'string',
                    'x-component-props': {
                      placeholder: `${intl.formatMessage({ id: 'paltformSign.theActivityType' })}`,
                      style: {
                        width: 160,
                      },
                    },
                    enum: [],
                  },
                  outerStatus: {
                    type: 'string',
                    'x-component-props': {
                      placeholder: `${intl.formatMessage({ id: 'paltformSign.externalState' })}`,
                      style: {
                        width: 160,
                      },
                    },
                    enum: [],
                  },
                  innerStatus: {
                    type: 'string',
                    'x-component-props': {
                      placeholder: `${intl.formatMessage({ id: 'paltformSign.internalState' })}`,
                      style: {
                        width: 160,
                      },
                    },
                    enum: [],
                  },
                },
              },
              sumbit: {
                'x-component': 'Submit',
                'x-mega-props': {
                  span: 1,
                },
                'x-component-props': {
                  children: `${intl.formatMessage({ id: 'paltformSign.theQuery' })}`,
                },
              },
            },
          },
        },
      }}
    />
  )
}
export default Search
