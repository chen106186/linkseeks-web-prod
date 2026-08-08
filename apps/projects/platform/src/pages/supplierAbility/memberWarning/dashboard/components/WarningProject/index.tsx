import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import CustomizeCard from '../CustomizeCard'
import { Row, Col } from 'antd'
import ProjectItem from './projectItem'

type ProjectItemType = React.ComponentProps<typeof ProjectItem>

interface Iprops {
  dataSource: ProjectItemType[]
}

const WarningProject: React.FC<Iprops> = (props: Iprops) => {
  const { dataSource } = props
  const intl = useIntl()
  return (
    <CustomizeCard title={intl.formatMessage({ id: 'member.memberWarning.common.columns.queryColumns.warnProject' })}>
      <Row gutter={[8, 8]}>
        {dataSource?.map((_item) => {
          return (
            <Col span={12} key={`${_item.name}-${_item.count}`}>
              <ProjectItem
                name={`${intl.formatMessage({
                  id: 'member.memberWarning.dashboard.components.Record.recordList.contractExpired',
                })}`}
                count={3}
              />
            </Col>
          )
        })}
      </Row>
    </CustomizeCard>
  )
}

export default WarningProject
