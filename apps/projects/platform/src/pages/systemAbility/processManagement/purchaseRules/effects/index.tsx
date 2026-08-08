import React, { useEffect } from 'react'
import { ISchemaFormActions } from '@apps/formily'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { getContractSelectListContractTemplate } from '@apps/apis'

export const createAddContractTemplateEffect = (context: ISchemaFormActions) => {
  const fetchListContractTemplateAll = async () => {
    const { data } = await getContractSelectListContractTemplate()
    context.setFieldState('electronicContractId', (state) => {
      state.contractTemplateLists = data
    })
    return data.map((v) => ({
      value: v.id,
      label: v.name,
    }))
  }

  useAsyncSelect('electronicContractId', fetchListContractTemplateAll)
}

export const useUnitPreview = (initValue, context) => {
  useEffect(() => {
    context.setFieldValue('isElectronicContract', initValue?.isElectronicContract ? true : false)
    context.setFieldValue('isTacitlyApprove', initValue?.isTacitlyApprove)
  }, [initValue])
}
