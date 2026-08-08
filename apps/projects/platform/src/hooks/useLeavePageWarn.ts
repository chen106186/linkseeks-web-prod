// 离开页面时，如果有编辑过表单，需要进行提示

import { useState } from 'react'

export const useLeavePageWarn = (initState = false) => {
  const [isEditForm, setIsEditForm] = useState(initState)

  return [isEditForm, setIsEditForm]
}