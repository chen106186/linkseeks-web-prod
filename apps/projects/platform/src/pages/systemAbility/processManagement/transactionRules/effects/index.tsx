import { ISchemaFormActions } from '@apps/formily'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { getContractSelectListContractTemplate } from '@apps/apis'

export const createAddContractTemplateEffect = (context: ISchemaFormActions) => {
  const fetchListContractTemplateAll = async () => {
    const { data } = await getContractSelectListContractTemplate()
    context.setFieldState('contractTempleId', (state) => {
      state.contractTemplateLists = data
    })
    return data.map((v) => ({
      value: v.id,
      label: v.name,
    }))
  }

  useAsyncSelect('contractTempleId', fetchListContractTemplateAll)
}
