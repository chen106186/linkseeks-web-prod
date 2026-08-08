import React from 'react'
import { Col, Form, Input, Row, Space } from 'antd'
import { Card as CardLayout } from '@linkseeks/ui'
import UploadFiles from '@/pages/transaction/components/uploadFiles'
import { getIntl } from '@linkseeks/i18n'
interface AttachmentLayoutProps {
  /** 附件列表 */
  enclosureUrls?: any[]
  /** 获取上传 */
  getEnclosureUrls?: (e?: any) => void
  /** 删除 */
  removeEnclosureUrls?: (e?: number) => void
}

const AttachmentLayout: React.FC<AttachmentLayoutProps> = (props: any) => {
  const intl = getIntl()
  const { enclosureUrls, getEnclosureUrls, removeEnclosureUrls } = props
  return (
    <CardLayout
      id="attachment"
      title={intl.formatMessage({ id: 'quality.fujian', defaultMessage: '附件' })}
      bodyStyle={{ paddingBottom: '0px' }}
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item name="urls">
            <UploadFiles
              accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx"
              size={20}
              fileList={enclosureUrls}
              onChange={(e: any) => getEnclosureUrls(e)}
              onRemove={(e: number) => removeEnclosureUrls(e)}
            />
          </Form.Item>
        </Col>
      </Row>
    </CardLayout>
  )
}
export default AttachmentLayout
