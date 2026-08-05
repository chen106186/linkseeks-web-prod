export { default as FormItem } from './FormItem'

export const required = (msg: string = "") => {
  return (
    {
      required: true,
      message: msg
    }
  )
}