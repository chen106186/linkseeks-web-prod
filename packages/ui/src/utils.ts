export const getStringValue = (props) => {
  const { value, fieldNames = {}, options } = props
  const labelKey = fieldNames.label || 'label'
  const valueKey = fieldNames.value || 'value'
  if (!value || !options) {
    return ''
  }
  if (typeof value === 'number') {
    const results = options.find((v) => v[valueKey] === value)
    if (results) {
      return results[labelKey]
    } else {
      return value
    }
  } else if (Array.isArray(value)) {
    return options
      .filter((v) => value.includes(v[valueKey]))
      .map((v) => v[labelKey])
      .join(',')
  } else if (typeof value === 'object') {
    return value.label || ''
  }
}
