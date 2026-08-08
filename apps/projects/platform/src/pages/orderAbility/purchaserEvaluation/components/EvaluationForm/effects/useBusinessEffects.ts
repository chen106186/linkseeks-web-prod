import { FormEffectHooks, FormPath } from '@apps/formily'

const { onFieldInputChange$, onFieldValueChange$ } = FormEffectHooks

export const useBusinessEffects = (context, actions) => {
  const { setFieldState } = actions

  // 评论图片限制 4 张
  onFieldInputChange$('comments.*.picture').subscribe((fieldState) => {
    const { name, value } = fieldState
    setFieldState(
      FormPath.transform(name, /\d/, ($1) => {
        return `comments.${$1}.picture`
      }),
      (state) => {
        // 禁用掉 或者 editable 设置成 false，删除按钮也会禁用掉的
        // 所以目前先用过 rules 去限制最多可上传多少张
        // state.props['x-component-props'].disabled = value.length >= 4;
      },
    )
  })

  // 评分联动
  onFieldInputChange$('comments.*.star').subscribe((fieldState) => {
    const { name, value } = fieldState
    setFieldState(
      FormPath.transform(name, /\d/, ($1) => {
        return `comments.${$1}.smile`
      }),
      (state) => {
        state.value = value
      },
    )
  })
}
