import { Drawer } from '@linkseeks/ui'
import { useProduct } from '../../services/context'
import { useWebIntl } from '@apps/locales'
import { StandardFormTable } from '@apps/components'
import { useDraftList } from '../../services/useDraftList'

const DraftDrawerTable = () => {
  const { draftDrawerVisible, setDraftDrawerVisible, refDraft } = useProduct()
  const { draftColumns, fetchDraftData } = useDraftList()
  const translate = useWebIntl()
  return (
    <Drawer
      title={translate('web.resource.commodity.caogaoxiang')}
      width={1000}
      open={draftDrawerVisible}
      bodyStyle={{ padding: 0 }}
      onClose={() => setDraftDrawerVisible(false)}
    >
      <StandardFormTable
        columns={draftColumns}
        actionRef={refDraft}
        rowKey="id"
        isRowSelection
        autoScrollX
        request={(params) => fetchDraftData(params)}
      />
    </Drawer>
  )
}

export default DraftDrawerTable
