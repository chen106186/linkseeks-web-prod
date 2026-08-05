/*
 * @Description: 考评项目Field组件
 */
import React from 'react'
import { SchemaField, FormPath, useFormEffects, FormEffectHooks } from '@apps/formily'
import { toArr } from '@apps/formily'
import { SchemaMarkupField as Field } from '@apps/formily'
import TagsPane from '../../../components/TagsPane'
import TagsPaneVirtualField from '../../../components/TagsPaneField'

const { onFormChange$ } = FormEffectHooks

const parseChildrenErrors = (errors: any, target: string) => {
  return errors.filter(({ path }) => {
    return FormPath.parse(path).includes(target)
  })
}

export type AssessmentProjectValueType = {
  /**
   * 组名
   */
  groupName: string
  /**
   * 数据
   */
  data: Record<string, any>[]
}[]

interface SupplierAssessmentProjectFieldProps {}

const SupplierAssessmentProjectField = (props) => {
  const { value, schema, path } = props
  const componentProps: SupplierAssessmentProjectFieldProps = schema.getExtendsComponentProps() || {}

  // console.log('propspropsprops', props);

  // useFormEffects(({ hasChanged }) => {
  //   onFormChange$().subscribe(formState => {
  //     console.log('formStateformStateformState', formState)
  //     const errorsChanged = hasChanged(formState, 'errors')
  //     console.log('errorsChangederrorsChanged', parseChildrenErrors(formState.errors, path))
  //     if (errorsChanged) {
  //       // setFieldState({
  //       //   childrenErrors: parseChildrenErrors(formState.errors, path)
  //       // })
  //     }
  //   })
  // })

  return (
    <div>
      <TagsPane>
        {(toArr(value) as unknown as AssessmentProjectValueType).map((item, index) => (
          <TagsPane.Pane name={item.groupName} key={`${index}`} forceRender>
            <SchemaField path={FormPath.parse(path).concat(index)} schema={schema.items} />
          </TagsPane.Pane>
        ))}
      </TagsPane>
      {/* <TagsPaneVirtualField
        tags={[
          {
            key: 'test1',
            name: 'test1',
          },
          {
            key: 'test2',
            name: 'test2',
          },
        ]}
      ></TagsPaneVirtualField> */}
    </div>
  )
}

SupplierAssessmentProjectField.isFieldComponent = true

export default SupplierAssessmentProjectField
