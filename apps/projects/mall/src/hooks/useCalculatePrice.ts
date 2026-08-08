export type PriceItemType = {
  range: string
  min: string
  max: string
  price: number
}

const useCalculatePrice = () => {
  const getMaxCountRange = (priceRange: PriceItemType[], count: number) => {
    const priceList = [...priceRange]
    const newList = priceList.sort((a, b) => (a.min > b.max ? 1 : -1))
    const result = newList.sort((a, b) => (Number(b.max) < Number(count) && Number(count) < Number(a.min) ? 1 : -1))
    return result[0]
  }

  /**
   * 根据购买数量获取价格区间单价
   */
  const getPriceRangeByCount = (
    priceRange: PriceItemType[],
    count: number,
    parameter: number = 1,
    useParameter: boolean = true,
  ) => {
    let price = 0
    if (!priceRange) {
      return 0
    }

    if (priceRange.length <= 1) {
      price = priceRange[0]?.price
    } else {
      const temp = priceRange.filter((item: any) => {
        return Number(count) >= Number(item.min) && Number(count) <= Number(item.max)
      })

      if (temp.length === 0) {
        const maxItem = getMaxCountRange(priceRange, count)
        price = maxItem.price
      } else {
        price = temp[0]?.price
      }
    }

    if (useParameter && parameter) {
      price = price * parameter
    }

    return price
  }

  return {
    getPriceRangeByCount,
  }
}

export default useCalculatePrice
