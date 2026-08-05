import { tabLink } from '@apps/components/src/web/PageHeaderWrapper'
import { useState } from 'react'

function useAnchor(initValue: tabLink[]) {
  const [anchors, setAnchors] = useState<tabLink[]>(initValue)

  function update(data: tabLink[]) {
    setAnchors([...anchors, ...data])
  }

  function delUpdate(data: any[]) {
    for (const d in data) {
      anchors.pop()
    }
    setAnchors([...anchors, ...data])
  }

  return {
    anchors,
    update,
    delUpdate,
  }
}

export default useAnchor
