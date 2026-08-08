import React from 'react'
import { Modal, Anchor } from 'antd'
import cx from 'classnames'
import cloneDeep from 'lodash/cloneDeep'
import styles from './index.module.less'

export interface CustomerAttributeValueList {
  id: React.Key
  value?: string
  checked?: boolean
  disabled?: boolean
}
export interface CustomerAttribute {
  id: number
  value?: string
  checked?: boolean
  name: string
}
export type ModalSkuList = {
  id: number
  customerAttribute: CustomerAttribute
  customerAttributeValueList: CustomerAttributeValueList[]
  selectData?: any
}
export interface SkuModelProps {
  isModalVisible: boolean
  modalSkuList: ModalSkuList[]
  selectDataObj: any
  tempObj: any
  skuIdObj: any
  handleOk: () => void
  setSelectDataObj: (flag: any) => void
  setModalSkuList: (flag: []) => void
  setIsModalVisible: (flag: boolean) => void
}
const { Link } = Anchor
const classNames = cx.bind(styles)

export default (props: SkuModelProps) => {
  const {
    isModalVisible = false,
    setIsModalVisible,
    modalSkuList,
    setModalSkuList,
    selectDataObj,
    setSelectDataObj,
    tempObj,
    skuIdObj,
    handleOk,
  } = props

  /* 弹窗左侧样式 */
  const getLeftStyle = (item: any) => {
    return classNames({
      [styles.left_item]: true,
      [styles.left_active]: item?.checked,
    })
  }

  /* 弹窗右侧样式 */
  const getRightStyle = (item: any, pid: number, vid: any) => {
    return classNames({
      [styles.right_item_value_item]: true,
      [styles.right_value_disabled]: item?.disabled,
      [styles.right_value_active]: !item?.disabled && item?.checked,
    })
  }

  /* 点击左侧事件 */
  const onSelectGroup = (index: number, list: ModalSkuList[]) => {
    const _list = JSON.parse(JSON.stringify(list))
    const _index = _list.findIndex((item: any) => item.customerAttribute?.checked)
    if (_index !== -1) {
      _list[_index].customerAttribute.checked = false
    }
    _list[index].customerAttribute.checked = true
    setModalSkuList(_list)
  }

  /* 点击右侧事件 */
  const onSelectValue = (groupIndex: number, index: number, parentId: number, id: any) => {
    const list = cloneDeep(modalSkuList)
    if (list[groupIndex].customerAttributeValueList[index].disabled) return
    /**
     * selectObj
     * 格式：{'parentId': valueId,'195': 300}
     */
    const selectObj = cloneDeep(selectDataObj)
    /* 同一类型规格，只能单选 */
    let tempIndex: number | undefined = undefined
    modalSkuList[groupIndex].customerAttributeValueList.forEach((item: CustomerAttributeValueList, idx: number) => {
      /* 若同组有checked为true,则设为false，没有则设为true */
      if (item.checked) {
        tempIndex = idx
        list[groupIndex].customerAttributeValueList[idx].checked = false
        list[groupIndex].selectData = undefined
        delete selectObj[parentId]
      }
      /* 判断点击事件为双击还是切换另外一个值 */
      if (tempIndex !== index) {
        //切换值
        list[groupIndex].customerAttributeValueList[index].checked = true
        list[groupIndex].selectData = list[groupIndex].customerAttributeValueList[index].value
        selectObj[parentId] = id
      }
    })
    /* 找出所选项 */
    let unDisabledData: any = {}
    /* 每点击一次，初始化disabled为fasle */
    setInitialDisabled(list)
    const selectDataKey = Object.keys(selectObj)
    if (selectDataKey?.length > 0) {
      let tempDataObj = cloneDeep(skuIdObj)
      for (const key in selectObj) {
        /* 重置数组,否则会出现多次push的情况 */
        unDisabledData = cloneDeep(tempObj)
        /* tempDataObj[key]为valueId的数组 */
        tempDataObj[key].forEach((item: any, i: number) => {
          /* 在tempDataObj组合内找到已选项 */
          if (item == selectObj[key]) {
            for (const _key in tempObj) {
              unDisabledData[_key].push(tempDataObj[_key][i])
            }
          }
        })

        list.forEach((item: ModalSkuList) => {
          item.customerAttributeValueList.forEach((_item: CustomerAttributeValueList) => {
            if (
              unDisabledData[item.customerAttribute.id].indexOf(_item.id) == -1 &&
              item.customerAttribute.id + '' != key
            ) {
              _item.disabled = true
            }
          })
        })
      }
    }
    setSelectDataObj(selectObj)
    onSelectGroup(groupIndex, list)
  }

  /* 初始化每一项disabled为fasle */
  const setInitialDisabled = (list: ModalSkuList[]) => {
    list.forEach((item) => {
      item.customerAttributeValueList.forEach((_item: CustomerAttributeValueList) => {
        _item.disabled = false
      })
    })
  }
  return (
    <Modal
      title="选择属性"
      width={1000}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={() => setIsModalVisible(false)}
      wrapClassName={styles.sku_modal}
    >
      <div id="modalContatiner" className={styles.modal_content}>
        <div className={styles.modal_left}>
          <Anchor
            onClick={(e) => e.preventDefault()}
            affix={false}
            // offsetTop={10}
            getContainer={() => document.querySelector('#modalContatiner') as HTMLElement}
          >
            {modalSkuList.map((item, index: number) => (
              <div
                key={item.id}
                className={getLeftStyle(item.customerAttribute)}
                onClick={() => onSelectGroup(index, modalSkuList)}
              >
                <Link
                  href={`#${item.customerAttribute.id}`}
                  title={item.customerAttribute?.name}
                  className={styles.left_item_name}
                />
                <div className={styles.left_item_value}>{item?.selectData && <>({item.selectData})</>}</div>
              </div>
            ))}
          </Anchor>
        </div>
        <div className={styles.modal_right}>
          {modalSkuList.map((item, index) => (
            <div id={item.customerAttribute.id.toString()} key={item.id} className={styles.right_item}>
              <div className={styles.right_item_title}>{item.customerAttribute?.name}</div>
              <div className={styles.right_item_value}>
                {item.customerAttributeValueList?.length > 0 &&
                  item.customerAttributeValueList.map((_item: CustomerAttributeValueList, idx: number) => (
                    <div
                      key={_item.id}
                      className={getRightStyle(_item, item.customerAttribute.id, _item.id)}
                      onClick={() => onSelectValue(index, idx, item.customerAttribute.id, _item.id)}
                    >
                      {_item?.value}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
