import { useIntl } from '@linkseeks/i18n'
import TableModal from '@/pages/customerAbility/components/TableModal'
// import { getMemberCustomerAppraisalItemConfigPage } from '@apps/apis';
import { PlusOutlined } from '@ant-design/icons'
import { ISchema } from '@apps/formily'
import React, { useCallback, useMemo } from 'react'
import useModal from '../../hooks/useModal'

interface Iprops {
  value: any[]
  // handleFetch
  // onOk: (selectRowKeys: string[] | number[], selectRowRecord: any[]) => void;
  // fetchData: (params: any) => Promise<any>,
  editable: boolean
  mutators: {
    change: (params: any[]) => void
  }
}

const DEFAULT_RETURN_DATA = {
  totalCount: 0,
  data: [],
}

const EvaluateProject: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const { value, mutators, editable } = props
  const { visible, toggle } = useModal()

  const intl = useIntl()

  const columns = useMemo(
    () => [
      {
        title: `${intl.formatMessage({
          id: 'member.memberEvaluate.components.EvaluateProject.index.evaluateProject',
        })}`,
        dataIndex: 'name',
      },
      {
        title: `${intl.formatMessage({
          id: 'member.memberEvaluate.components.EvaluateProject.index.evaluateContent',
        })}`,
        dataIndex: 'typeDesc',
      },
    ],
    [],
  )

  const schema: ISchema = useMemo(
    () => ({
      type: 'object',
      properties: {
        layout: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            inline: true,
          },
          properties: {
            name: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: `${intl.formatMessage({
                  id: 'member.memberEvaluate.components.EvaluateProject.index.searchEvaluateProject',
                })}`,
                tip: `${intl.formatMessage({
                  id: 'member.memberEvaluate.components.EvaluateProject.index.enterProjectTwoSearch',
                })}`,
                advanced: false,
              },
            },
          },
        },
      },
    }),
    [],
  )

  const handleOnOk = (selectRowKeys: string[] | number[], selectRowRecord: any[]) => {
    mutators.change(selectRowRecord)
    toggle(false)
  }

  /**
   * 业务组件，未看到复用情况，暂时写死
   */
  const handleFetchData = useCallback(async (params: any): Promise<any> => {
    // const { data, code } = await getMemberCustomerAppraisalItemConfigPage(params);
    // if (code === 1000) {
    //   return data;
    // }
    return DEFAULT_RETURN_DATA as any
  }, [])

  return (
    <div>
      <TableModal
        visible={visible}
        onClose={() => toggle(false)}
        title={`${intl.formatMessage({
          id: 'member.memberEvaluate.components.EvaluateProject.index.chooseEvaluateProject',
        })}`}
        columns={columns}
        schema={schema}
        onOk={handleOnOk}
        fetchData={handleFetchData}
        tableProps={{
          rowKey: (record) => `${record.type}`,
        }}
        mode={'checkbox'}
        value={value}
      />

      <div
        style={{
          display: editable ? 'flex' : 'none',
          cursor: 'pointer',
          width: '100%',
          background: '#fbfbfb',
          padding: '8px 0px',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onClick={() => toggle(true)}
      >
        <PlusOutlined />
        <span style={{ marginLeft: '4px' }}>
          {intl.formatMessage({ id: 'member.memberEvaluate.components.EvaluateProject.index.chooseEvaluateProject' })}
        </span>
      </div>
    </div>
  )
}

EvaluateProject.isFieldComponent = true

export default EvaluateProject
