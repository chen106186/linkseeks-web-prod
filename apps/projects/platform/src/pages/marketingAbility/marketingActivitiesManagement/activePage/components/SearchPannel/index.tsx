import React from 'react'
import { createFormActions, SchemaForm, LifeCycleTypes } from '@apps/formily'
import { DatePicker } from '@apps/formily'
import schema from './schema'
import VerticalLayout from './layout'
import FormilyCheckBox from '../FormilyCheckBox'
// import FormilyRadio from '@/pages/mobileTemplate/categoryNavigation/components/FormilyRadio';

const actions = createFormActions()

interface Iprops {
  onSubmit?: (values: any) => void
  onFormValueChange?: (values: any) => void
}

const SearchPannel: React.FC<Iprops> = (props: Iprops) => {
  const { onSubmit, onFormValueChange } = props
  const handleSubmit = (values: any) => {
    onSubmit?.(values)
  }
  return (
    <SchemaForm
      components={{ VerticalLayout, FormilyCheckBox, DatePicker }}
      actions={actions}
      schema={schema}
      onSubmit={handleSubmit}
      effects={($, { setFieldState }) => {
        $(LifeCycleTypes.ON_FORM_INPUT_CHANGE).subscribe((state) => {
          onFormValueChange?.(state.values)
        })
      }}
    ></SchemaForm>
  )
}

export default SearchPannel
