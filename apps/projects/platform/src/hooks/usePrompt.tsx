import { useState } from 'react'
import { usePrompt } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'

export default function usePromptCustomer() {
  const [isFormChange, setIsFormChange] = useState<boolean>(false)

  const intl = useIntl()

  usePrompt({ when: isFormChange, message: intl.formatMessage({ id: 'common.tip.save.confirm' }) })

  const handleLeave = (isFormChange = true) => {
    setIsFormChange(isFormChange)
  }

  return {
    handleLeave,
  }
}
