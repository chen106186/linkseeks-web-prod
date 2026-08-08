import React, { forwardRef, Fragment, useState, useEffect } from 'react'
import { Select } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import cx from 'classnames'
import style from './index.less'
import { isEmpty } from 'lodash'
import { getProductPlatformGetCategoryTree } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

const { Option } = Select
interface CategorySelectPropsType {
  dataSource: Array<{
    firstId: number
    firstName: string
    secondId: number
    secondName: string
    thirdlyId: number
    thirdlyName: string
    index: number
  }>
  onAdded?: Function
  onReduce?: Function
  onChange?: Function
}

const CategoryCascader: React.FC<CategorySelectPropsType> = (props) => {
  const intl = useIntl()
  const { dataSource, onAdded, onReduce, onChange } = props
  const [firstData, setFirstData] = useState<any[]>([])
  const [secondData, setSecondData] = useState({})
  const [thirdlyData, setThirdlyData] = useState({})

  useEffect(() => {
    fetchCategoryList()
  }, [])

  const getFirstById = (id: number) => {
    let result = 0
    firstData &&
      firstData.map((item) => {
        if (item.value === id) {
          result = item
        }
      })
    return result
  }

  const getSecondById = (id: number, firstId: string) => {
    let result = 0
    !isEmpty(secondData) &&
      secondData[firstId].map((item) => {
        if (item.value === id) {
          result = item
        }
      })
    return result
  }

  const getThirdlyById = (id: number, secondId: string) => {
    let result = 0
    !isEmpty(thirdlyData) &&
      thirdlyData[secondId].map((item) => {
        if (item.value === id) {
          result = item
        }
      })
    return result
  }

  const fetchCategoryList = () => {
    getProductPlatformGetCategoryTree().then((res) => {
      initCategoryData(res.data)
    })
  }

  const initCategoryData = (categoryList: any) => {
    if (!categoryList) {
      return
    }
    const tmpFirstData: any[] = []
    const tempSecondData = {}
    const tempThirdlyData = {}
    for (const item of categoryList) {
      tmpFirstData.push({
        lable: item.name,
        value: Number(item.id),
      })
      if (item.children) {
        const tempSecondList: any = []
        for (const secondItem of item.children) {
          tempSecondList.push({
            lable: secondItem.name,
            value: Number(secondItem.id),
          })
          if (secondItem.children) {
            const tempThirdlyList: any = []
            for (const thirdlyItem of secondItem.children) {
              tempThirdlyList.push({
                lable: thirdlyItem.name,
                value: Number(thirdlyItem.id),
              })
            }
            tempThirdlyData[secondItem.id] = tempThirdlyList
          }
        }
        tempSecondData[item.id] = tempSecondList
      }
    }
    setFirstData(tmpFirstData)
    setSecondData(tempSecondData)
    setThirdlyData(tempThirdlyData)
  }

  const handleFirstChange = (value: number, index: number) => {
    const newData = JSON.parse(JSON.stringify(dataSource))
    const firstById: any = getFirstById(value)
    newData.map((item: any) => {
      if (item.index === index) {
        item.firstId = value
        item.firstName = firstById.lable
        if (!isEmpty(secondData[firstById.value])) {
          item.secondId = secondData[firstById.value][0].value
          item.secondName = secondData[firstById.value][0].lable
        } else {
          item.secondId = undefined
          item.secondName = ''
        }
        if (!isEmpty(thirdlyData[secondData[firstById.value][0].value])) {
          item.thirdlyId = thirdlyData[secondData[firstById.value][0].value][0].value
          item.thirdlyName = thirdlyData[secondData[firstById.value][0].value][0].lable
        } else {
          item.thirdlyId = undefined
          item.thirdlyName = ''
        }
      }
      return item
    })
    onChange?.(newData)
  }

  const onSecondChange = (value: number, firstId: string, index: number) => {
    const newData = JSON.parse(JSON.stringify(dataSource))
    const secondById: any = getSecondById(value, firstId)
    newData.map((item: any) => {
      if (item.index === index) {
        item.secondId = secondById.value
        item.secondName = secondById.lable
        if (!isEmpty(thirdlyData[secondById.value])) {
          item.thirdlyId = thirdlyData[secondById.value][0].value
          item.thirdlyName = thirdlyData[secondById.value][0].lable
        } else {
          item.thirdlyId = undefined
          item.thirdlyName = ''
        }
      }
      return item
    })
    onChange?.(newData)
  }

  const onThirdlyChange = (value: number, secondId: string, index: number) => {
    const newData = JSON.parse(JSON.stringify(dataSource))
    const thirdlyById: any = getThirdlyById(value, secondId)
    newData.map((item: any) => {
      if (item.index === index) {
        item.thirdlyId = thirdlyById.value
        item.thirdlyName = thirdlyById.lable
      }
      return item
    })
    onChange?.(newData)
  }

  const handleAddNewSelect = () => {
    onAdded?.({
      index: dataSource[dataSource.length - 1].index + 1,
      firstId: 0,
      secondId: 0,
      thirdlyId: 0,
      firstName: '',
      secondName: '',
      thirdlyName: '',
    })
  }

  const handleReduceSelect = (index: number) => {
    if (dataSource.length > 1) {
      onReduce?.(index)
    }
  }

  return (
    <Fragment>
      {dataSource &&
        dataSource.map((item: any, index) => (
          <div className={style.category_select_line} key={`dataSourceItem-${index}`}>
            <Select
              style={{ width: 180 }}
              value={item.firstId ? item.firstId : undefined}
              onChange={(value) => handleFirstChange(value, item.index)}
              placeholder={intl.formatMessage({ id: 'components.qingxuanze' })}
            >
              {firstData.map((item) => (
                <Option value={item.value} key={item.value}>
                  {item.lable}
                </Option>
              ))}
            </Select>
            <Select
              style={{ marginLeft: 16, width: 180 }}
              value={item.secondId ? item.secondId : undefined}
              onChange={(value) => onSecondChange(value, item.firstId, item.index)}
              placeholder={intl.formatMessage({ id: 'components.qingxuanze' })}
            >
              {item.firstId && !isEmpty(secondData)
                ? secondData[item.firstId] &&
                  secondData[item.firstId].map((item: any) => (
                    <Option value={item.value} key={item.value}>
                      {item.lable}
                    </Option>
                  ))
                : null}
            </Select>
            <Select
              style={{ marginLeft: 16, marginRight: 24, width: 180 }}
              value={item.thirdlyId ? item.thirdlyId : undefined}
              onChange={(value) => onThirdlyChange(value, item.secondId, item.index)}
              placeholder={intl.formatMessage({ id: 'components.qingxuanze' })}
            >
              {item.secondId && !isEmpty(thirdlyData)
                ? thirdlyData[item.secondId] &&
                  thirdlyData[item.secondId].map((item: any) => (
                    <Option value={item.value} key={item.value}>
                      {item.lable}
                    </Option>
                  ))
                : null}
            </Select>
            {index === dataSource.length - 1 && (
              <div className={cx(style.opration_btn, style.add)} onClick={() => handleAddNewSelect()}>
                <PlusOutlined />
              </div>
            )}
            <div className={style.opration_btn} onClick={() => handleReduceSelect(item.index)}>
              <MinusOutlined />
            </div>
          </div>
        ))}
    </Fragment>
  )
}

const CategorySelect: React.FC<CategorySelectPropsType> = forwardRef((props) => {
  const { dataSource, onAdded, onReduce, onChange } = props
  return (
    <div className={style.category_select}>
      <CategoryCascader dataSource={dataSource} onAdded={onAdded} onReduce={onReduce} onChange={onChange} />
    </div>
  )
})

CategorySelect.displayName = 'CategorySelect'
export default CategorySelect
