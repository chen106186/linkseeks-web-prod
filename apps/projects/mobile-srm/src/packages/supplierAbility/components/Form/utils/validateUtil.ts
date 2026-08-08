import type { RuleObject, StoreValue, RuleError, AggregationRule } from '../typings'

/**
 * 简易的检验
 * @param name 字段名称
 * @param value 值
 * @param rules 规则数组
 * @returns
 */
export function validateRules(name: string, value: StoreValue, rules: RuleObject[]): Promise<RuleError[]> {
  const rulePromises: Promise<string>[] = rules
    .map((rule) => {
      if (
        rule.required &&
        (!Array.isArray(value) ? value === undefined || value === null || value === '' : !value.length)
      ) {
        return Promise.resolve(rule.message as string)
      }
      if (rule.pattern && value && !rule.pattern.test(value)) {
        return Promise.resolve(rule.message as string)
      }
      if (rule.validator) {
        return (async () => {
          try {
            await rule.validator?.(rule, value, () => {})
            return Promise.resolve()
          } catch (error) {
            return Promise.resolve(error?.message)
          }
        })()
      }
    })
    .filter(Boolean) as Promise<string>[]
  let summaryPromise: Promise<RuleError[]>

  summaryPromise = Promise.all(rulePromises).then((res) => {
    // 没有内容表示校验通过
    const filtered = res.filter(Boolean)
    if (!filtered.length) {
      return Promise.resolve([])
    }
    return Promise.reject({
      errors: res,
      name,
      rules,
    })
  })
  // summaryPromise.catch(e => e);
  return summaryPromise
}

export async function validateFields(value: StoreValue, fieldRules: Map<string, RuleObject[]>): Promise<RuleError[]> {
  const errors: RuleError[] = []
  for (const [name, rules] of fieldRules) {
    // value中不存在相应的name，跳过检查
    if (!(name in value)) {
      continue
    }
    try {
      await validateRules(name, value[name], rules)
    } catch (error) {
      errors.push(error)
    }
  }
  return errors
}
