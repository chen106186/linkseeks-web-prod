export const diffLocale = (originLocale, targetLocale) => {
  const results: any = {}
  for (const key in originLocale) {
    const item = originLocale[key]

    const target = targetLocale[key]
    if (!target) {
      results[key] = item
    }
  }

  return results
}
