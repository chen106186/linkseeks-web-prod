import TabTree, { createTreeActions } from '@/components/TabTree'
import { Button, Drawer, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import './index.global.less'

export interface OrgModalProps {
  visible: boolean
  handleSyncSelect: any
  plateformTreeData: any
  fetchOrgsTreeData: any
  selectKeys: any[]
  onSuccess(selectKeys: any[])
  onCancel()
  modalRef: any
}

const syncTreeActions = createTreeActions()

const OrgModal: React.FC<OrgModalProps> = (props) => {
  const intl = useIntl()
  const { visible, onSuccess, onCancel, plateformTreeData, handleSyncSelect, fetchOrgsTreeData, selectKeys } = props

  const [resetSearch, setResetSearch] = useState(false)
  const [customPlateformExpandkeys, setCustomPlateformExpandkeys] = useState<any>()

  const handleSuccess = () => {
    onSuccess(syncTreeActions.getSelectKeys())
  }

  useEffect(() => {
    syncTreeActions.setSelectKeys(selectKeys)
  }, [selectKeys, syncTreeActions])
  return (
    <Drawer visible={visible} closable={false} placement="right" width={600} forceRender>
      <TabTree
        fetchData={(params) => fetchOrgsTreeData()}
        treeData={plateformTreeData}
        handleSelect={handleSyncSelect}
        actions={syncTreeActions}
        customKey="id"
        enableSearch
        searchPlaceholder={intl.formatMessage({ id: 'authConfig.OrganizationName' })}
        checkStrictly
        resetSearch={resetSearch}
        customExpandkeys={customPlateformExpandkeys}
        checkable={true}
      />
      <Row justify="end">
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          {intl.formatMessage({ id: 'authConfig.close' })}
        </Button>
        <Button onClick={handleSuccess} type="primary">
          {intl.formatMessage({ id: 'authConfig.confirm' })}
        </Button>
      </Row>
    </Drawer>
  )
}

OrgModal.defaultProps = {}

export default OrgModal
