import React from 'react'
import { Form, Row, Col } from 'antd'
import { Card } from '@linkseeks/ui'
import { getIntl } from '@linkseeks/i18n'
import UploadFilesString from './uploadFiles'

const intl = getIntl()
interface AttachLayoutProps {
  /** 附件列表 */
  enclosureUrls?: any[]
  /** 获取上传 */
  getEnclosureUrls?: (e?: any) => void
  /** 删除 */
  removeEnclosureUrls?: (e?: number) => void
}

const AttachLayout: React.FC<AttachLayoutProps> = (props: any) => {
  const { enclosureUrls, getEnclosureUrls, removeEnclosureUrls } = props

  return (
    <Card id="attachLayout" title={intl.formatMessage({ id: 'dealAbility.fujian' })}>
      <Row gutter={[48, 24]}>
        <Col span={12}>
          <Form.Item label={intl.formatMessage({ id: 'dealAbility.fujian' })} name="enclosureUrls">
            <UploadFilesString
              accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx"
              size={20}
              fileList={enclosureUrls}
              onChange={(e: any) => getEnclosureUrls(e)}
              onRemove={(e: number) => removeEnclosureUrls(e)}
              disabled={enclosureUrls?.length >= 5}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  )
}
export default AttachLayout
