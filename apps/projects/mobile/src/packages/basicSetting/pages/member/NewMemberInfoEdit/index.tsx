import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect, useRef } from 'react'
import cx from 'classnames'
import {
  getCurrentInstance,
  setNavigationBarTitle,
  showLoading,
  hideLoading,
  pxTransform,
} from '@apps/mobile-services/utils/taro'
import Provinces from '@/components/Provinces'
import ProvincesH5 from '@/components/Provinces/index.h5'
import Select from '@/components/Select'
import Cell from '@/components/Cell'
import SelectH5 from '@/components/Select/index.h5'
import Router from '@/utils/router'
import useStores from '@/store/useStores'
import uploadFileRequest from '@/utils/uploadFileRequest'
import { useIntl } from '@linkseeks/i18n'
import { getOssUrlPath } from '@apps/constants'
import { IS_WEB } from '@/constants'
import {
  View,
  Button,
  Input,
  Form,
  Toast,
  Text,
  Upload,
  Image,
  Icons,
  ScrollView,
  Radio,
  Checkbox,
  NoticeBar,
} from '@apps/mobile-ui'
import {
  getMemberAreaCity,
  getMemberAreaDistrict,
  getMemberAreaProvince,
  getMemberMobileInfoApplyDepositDetail,
  getMemberMobileInfoDepositDetail,
  getMemberMobileInfoDetailUpdateGet,
  postMemberMobileInfoApply,
  postMemberMobileInfoDepositDetailUpdate,
  postMemberMobileInfoDetailUpdate,
} from '@apps/apis'
import styles from './index.module.scss'
const UploadIcon = getOssUrlPath('/miniprogram/assets/images/Upload.png')
const iconRight = getOssUrlPath('/miniprogram/assets/images/icon-right.svg')
const Icon = getOssUrlPath('/miniprogram/assets/question-mark-circle.png')
const TrashIcon = getOssUrlPath('/miniprogram/assets/images/Trash.svg')
const plusIcon = getOssUrlPath('/miniprogram/assets/images/Plus.svg')

/* 注册4 */
const NewMemberInfoEdit = () => {
  const intl = useIntl()
  /**
   * @param id id集合
   * @param elements 返回数据
   */
  const { isShop, myTitle, ...paramInfo }: any = getCurrentInstance()?.router?.params
  const {
    userStore: { refreshUserInfo, userInfo },
  } = useStores()
  const [elements, setElements] = useState<any>([])
  const [state, setToggle] = useState(false) // 显示三级联动的

  const [formCollValue, setFormCollValue] = useState<any>({}) // 表单数据收集

  const [uploadData, setUploadData] = useState({})
  const [selectObj, setSelectObj] = useState<any>({}) // 下拉框组
  const [selectElement, setSelectElement] = useState<any>({}) // 下拉框组element
  const [selectKey, setSelectKey] = useState<any>({}) // 下拉框组element
  const [addressVisible, setAddressVisible] = useState<boolean>(false)
  const [selectVisible, setSelectVisible] = useState<boolean>(false)
  const [AddressData, setAddressData] = useState<any>({})
  const strRef = useRef<any>({})
  const [addressKey, setAddressKey] = useState('')
  const [addressText, setAddressText] = useState('') // 回显示地址
  const [btnLoading, setBtnLoading] = useState(false)

  // 上传文件
  const uploadFile = async (result, name) => {
    showLoading()
    const uploadResult = await uploadFileRequest([result[0]])
    hideLoading()
    if (uploadResult.length > 0) {
      formCollValue[name] = uploadResult[0].url
      setFormCollValue(formCollValue)
      uploadData[name] = uploadResult[0].url
      setUploadData({
        ...uploadData,
      })
    }
    return uploadResult
  }

  /* 选中地址回调 */
  const onSelectByAP = (data) => {
    setAddressData(data)
    setAddressText(data.name)
  }

  /* 地址选择 */
  const onAddress = (item) => {
    setAddressVisible(true)
  }

  /* 选中地址回调 */
  const onSelect = (data) => {
    const keyData = AddressData
    setAddressData(data)
    setAddressText(data.name)
    setAddressVisible(false)
  }

  /* 下拉框选中地址 */
  const select = (data) => {
    const _formCollValue = {
      ...formCollValue,
    }
    const _selectObj = {
      ...selectObj,
    }
    _formCollValue[selectKey] = data.value
    _selectObj[selectKey] = data.label
    setSelectObj(_selectObj)
    setFormCollValue(_formCollValue)
  }

  /* 下拉框选中地址 */
  const selectH5 = (data, key) => {
    const _formCollValue = {
      ...formCollValue,
    }
    const _selectObj = {
      ...selectObj,
    }
    _formCollValue[key] = data.value
    _selectObj[key] = data.label
    setSelectObj(_selectObj)
    setFormCollValue(_formCollValue)
  }

  /* 根据返回区号过滤回显地址 */
  const address = async (element: any) => {
    const { provinceCode, cityCode, districtCode } = element.fieldValue
    let provinceName = ''
    let cityName = ''
    let districtName = ''
    if (provinceCode) {
      const provinceRes = await getMemberAreaProvince()
      provinceRes.data.forEach((element: any) => {
        if (element.code === provinceCode) {
          provinceName = element.name
        }
      })
    }
    if (cityCode) {
      const cityRes = await getMemberAreaCity({
        code: provinceCode,
      })
      cityRes.data.forEach((item: any) => {
        if (item.code === cityCode) {
          cityName = item.name
        }
      })
    }
    if (districtCode) {
      const distrRes = await getMemberAreaDistrict({
        code: cityCode,
      })
      distrRes.data.forEach((element: any) => {
        if (element.code === districtCode) {
          districtName = element.name
        }
      })
    }
    setAddressText(provinceName + cityName + districtName)
  }
  const getDetail = () => {
    showLoading()
    let api
    if (isShop) {
      if (Number(paramInfo.status) === 3) {
        api = getMemberMobileInfoDepositDetail(paramInfo)
      } else {
        api = getMemberMobileInfoApplyDepositDetail(paramInfo)
      }
    } else {
      api = getMemberMobileInfoDetailUpdateGet()
    }
    api
      .then((res: any) => {
        hideLoading()
        if (res.code === 1000) {
          let data = res.data
          if (Number(paramInfo.status) === 3) {
            data = res.data.groups
          }
          setElements(data)
          const formValue: {
            [key: string]: any
          } = {}
          const $_tempSelectObj: Record<string, any> = {}
          const $_uploadData: Record<string, any> = {}
          data.forEach((item: { elements: any[] }) => {
            if (item.elements && item.elements.length) {
              item.elements.forEach((ele) => {
                // 地区
                if (ele.fieldType === 'area') {
                  setAddressKey(ele.fieldName)
                  address(ele)
                  setAddressData(ele.fieldValue)
                }
                // 下拉
                if (ele.fieldType === 'select') {
                  if ((ele.fieldValue === 0 || ele.fieldValue) && ele.fieldEnum.length > 0) {
                    ele.fieldEnum.forEach((val) => {
                      if (`${val.value}` === `${ele.fieldValue}`) {
                        $_tempSelectObj[ele.fieldName] = val.label
                      }
                    })
                  }
                }
                //上传
                if (ele.fieldType === 'file') {
                  $_uploadData[ele.fieldName as string] = ele.fieldValue
                }
                //列表类型
                if (ele.fieldType === 'list') {
                  formValue[ele.fieldName as string] = ele?.fieldValue || [{}]
                } else {
                  formValue[ele.fieldName as string] = ele.fieldValue
                }
              })
            }
          })
          setFormCollValue(formValue)
          setSelectObj($_tempSelectObj)
          setUploadData($_uploadData)
          // methods.reset(formValue);
        }
      })
      .catch(() => {
        hideLoading()
      })
  }
  useEffect(() => {
    getDetail()
    setNavigationBarTitle({
      title: `${
        myTitle
          ? decodeURIComponent(myTitle)
          : intl.formatMessage({
              id: 'user.xiugaihuiyuanxinxi',
              defaultMessage: '修改会员信息',
            })
      }`,
    })
  }, [])
  const onSubmit = async () => {
    if (addressKey) {
      formCollValue[addressKey] = {
        provinceCode: AddressData.provinceCode,
        cityCode: AddressData.cityCode,
        districtCode: AddressData.distCode || AddressData.districtCode,
      }
    }
    let api
    if (isShop) {
      if (Number(paramInfo.status) === 3) {
        api = postMemberMobileInfoDepositDetailUpdate({
          ...paramInfo,
          depositDetails: {
            ...formCollValue,
            ...selectObj,
          },
        })
      } else {
        api = postMemberMobileInfoApply({
          ...paramInfo,
          depositDetails: {
            ...formCollValue,
            ...selectObj,
          },
        })
      }
    } else {
      api = postMemberMobileInfoDetailUpdate({
        detail: formCollValue,
      })
    }
    setBtnLoading(true)
    api.then((res) => {
      if (res.code === 1000) {
        Toast.show({
          title: intl.formatMessage({
            id: 'user.xiugaixinxitijiaochenggong',
            defaultMessage: '修改信息提交成功',
          }),
        })
        refreshUserInfo()
        setTimeout(() => {
          if (isShop) {
            Router.redirectTo('members/shop', {
              memberId: paramInfo.upperMemberId,
              roleId: paramInfo.upperRoleId,
            })
          } else {
            Router.navigateBack()
          }
        }, 2000)
      } else {
        Toast.show({
          title: intl.formatMessage({
            id: `${res.code}`,
            defaultMessage: res.message,
          }),
        })
      }
      setBtnLoading(false)
    })
  }

  /* 下拉方法 */
  const handlerSelect = () => {
    setSelectObj({
      ...selectObj,
      [selectElement.fieldName]: strRef.current[0],
    })
    setToggle(!state)
  }
  const selectShow = (element: any) => {
    setSelectElement(element.fieldEnum)
    setSelectKey(element.fieldName)
    setSelectVisible(true)
  }

  /* 输入框 */
  const InputHtml = (element: any, isLong?: boolean, h?: number) => {
    const { fieldRemark, fieldLength, fieldName, fieldLocalName } = element
    return (
      <Input
        placeholder={fieldRemark || `请输入${fieldLocalName}`}
        maxlength={fieldLength}
        value={formCollValue[fieldName]}
        name={fieldName}
        style={{
          fontSize: pxTransform(14),
          margin: pxTransform(0),
          padding: pxTransform(0),
          marginLeft: pxTransform(0),
          borderBottomColor: '#F4F5F7',
        }}
        className={styles['long']}
        type={isLong ? 'number' : 'text'}
        onChange={(e) => {
          setFormCollValue({
            ...formCollValue,
            [fieldName]: e,
          })
        }}
      />
    )
  }
  /* 输入方式 */
  const selectobjKey = (element: any) => {
    let str = ''
    // eslint-disable-next-line array-callback-return
    element.fieldEnum.find((item: any) => {
      if (item.value === element.fieldValue) {
        str = item.label
      }
    })
    return str
  }
  const handleConfirm = (data: any) => {
    console.log(data)
    setAddressVisible(data.Addressvisible)
    setAddressData(data)
    setAddressText(data.provinceName + data.cityName + data.distName)
  }
  /* 取消显示 */
  const Reset = (flag: boolean) => {
    console.log(flag, '状态')
    setAddressVisible(flag)
  }

  /* list类型add */
  const listAdd = (key) => {
    const fromData = {
      ...formCollValue,
    }
    fromData[key].push({})
    setFormCollValue(fromData)
  }

  /* list类型add */
  const listDeleteItem = (key, index) => {
    const fromData = {
      ...formCollValue,
    }
    fromData[key].splice(index, 1)
    setFormCollValue(fromData)
  }
  const RenderNodeContainer = ({ item, children }) => {
    return (
      <View className={styles['warp']} key={item.fieldName}>
        <View className={styles['item']}>
          <Text className={styles['item-title']}>{item.fieldLocalName}</Text>
          {item.fieldRemark != '' && (
            <Image src={Icon} className={styles['iconS']} onClick={() => onTip(item.fieldRemark)} />
          )}
        </View>
        <Form className={styles['form-item']}>{children}</Form>
      </View>
    )
  }
  const nodeInput = (val, parents, index, fieldName) => {
    const fromData = {
      ...formCollValue,
    }
    fromData[parents][index][fieldName] = val
    setFormCollValue(fromData)
  }

  /* 动态渲染表单 list字段 */
  const renderNode = (parents, item, index) => {
    const { fieldType, fieldRemark, fieldName, fieldValue } = item
    switch (fieldType) {
      case 'string':
        return (
          <Input
            placeholder={fieldRemark}
            value={formCollValue[parents]?.[index]?.[fieldName]}
            className={styles['list-input']}
            onChange={(e) => nodeInput(e, parents, index, fieldName)}
          />
        )
      case 'radio':
        return (
          <RenderNodeContainer item={item}>
            <Radio.Group
              onChange={(value: any) => {
                const data = {
                  ...formCollValue,
                }
                data[parents][index][fieldName] = value
                setFormCollValue(data)
              }}
              value={formCollValue[parents]?.[index]?.[fieldName]}
            >
              <View
                style={{
                  width: '100%',
                }}
              >
                {item.fieldEnum.map((items: any) => (
                  <View key={item.value} className={styles['RadioBox']}>
                    <View>{items.label}</View>
                    <Radio value={items.value} />
                  </View>
                ))}
              </View>
            </Radio.Group>
          </RenderNodeContainer>
        )
      default:
        break
    }
  }
  const showHtml = (element: any) => {
    switch (element?.fieldType) {
      case 'select':
        return IS_WEB ? (
          <SelectH5
            SelectList={element.fieldEnum}
            onSelect={(data) => {
              selectH5(data, element?.fieldName)
            }}
          >
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              className={styles['select-item']}
            >
              <Text className={styles['select-item-text']}>{selectObj[element.fieldName] || element.fieldRemark}</Text>
              <Image className={styles['icon-right']} src={iconRight} />
            </View>
          </SelectH5>
        ) : (
          <View
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onClick={() => selectShow(element)}
            className={styles['select-item']}
          >
            <Text className={styles['select-item-text']}>{selectObj[element.fieldName] || element.fieldRemark}</Text>
            <Image className={styles['icon-right']} src={iconRight} />
          </View>
        )
      case 'area':
        return IS_WEB ? (
          <ProvincesH5
            onSelect={(data) => {
              onSelectByAP(data)
            }}
          >
            <View className={styles['select-item']}>
              <Text className={styles['select-item-text']}>{addressText || element.fieldLocalName}</Text>
            </View>
          </ProvincesH5>
        ) : (
          <View className={styles['select-item']} onClick={() => onAddress(element)}>
            <Text className={styles['select-item-text']}>{addressText || element.fieldLocalName}</Text>
          </View>
        )
      case 'checkbox':
        return (
          <Checkbox.Group
            value={formCollValue[element.fieldName] || []}
            // eslint-disable-next-line no-shadow
            onChange={(value) => {
              setFormCollValue({
                ...formCollValue,
                [element.fieldName]: value,
              })
            }}
          >
            {element.fieldEnum.map(
              (item: {
                value: string | number | undefined
                label: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined
              }) => (
                <View key={item.value} className={styles['RadioBox']}>
                  <View>{item.label}</View>
                  <Checkbox value={item.value} />
                </View>
              ),
            )}
          </Checkbox.Group>
        )
      case 'radio':
        return (
          <Radio.Group
            value={formCollValue[element.fieldName]}
            // eslint-disable-next-line no-shadow
            onChange={(value) => {
              setFormCollValue({
                ...formCollValue,
                [element.fieldName]: value,
              })
            }}
          >
            <View
              style={{
                width: '100%',
              }}
            >
              {element.fieldEnum.map((item: any, index: number) => (
                <View key={item.value} className={styles['RadioBox']}>
                  <View>{item.label}</View>
                  <Radio value={item.value} />
                </View>
              ))}
            </View>
          </Radio.Group>
        )
      case 'file':
        return (
          <Upload actions={(e) => uploadFile(e, element.fieldName)} name={element.fieldName} pickerMax={1}>
            {uploadData[element.fieldName] ? (
              <Image className={styles['Img']} src={uploadData[element.fieldName]} mode="aspectFill" />
            ) : (
              <View className={styles['UploadWarp']}>
                <Image src={UploadIcon} />
                <View className={styles['UploadWarpText']}>{element.fieldRemark}</View>
              </View>
            )}
          </Upload>
        )
      case 'string':
        return InputHtml(element)
      case 'number':
        return InputHtml(element)
      case 'list':
        return (
          <>
            {formCollValue[element.fieldName]?.map((_field, _fieldIndex, _fieldArr) => (
              <>
                <View className={styles['item']}>
                  <View className={styles['item-title']}>
                    {element.fieldLocalName}
                    {element.fieldRemark != '' && (
                      <Image src={Icon} className={styles['iconS']} onClick={() => onTip(element.fieldRemark)} />
                    )}
                  </View>
                  {_fieldArr.length === 1 ? null : (
                    <Image
                      src={TrashIcon}
                      className={styles['Icon']}
                      onClick={() => {
                        listDeleteItem(element.fieldName, _fieldIndex)
                      }}
                    />
                  )}
                </View>
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Cell
                    border={false}
                    customStyle={{
                      padding: pxTransform(0),
                    }}
                  >
                    {element.item.configs.map((_item, _index) => (
                      <Cell.Item
                        key={_index}
                        title={_item.fieldType === 'string' ? _item.fieldLocalName : null}
                        value={renderNode(element.fieldName, _item, _fieldIndex)}
                        border
                      />
                    ))}
                  </Cell>
                </View>
              </>
            ))}
            <View
              className={styles['list-add-btn']}
              onClick={() => {
                listAdd(element.fieldName)
              }}
            >
              <Image className={styles['list-add-btnIcon']} src={plusIcon} />
              <Text className={styles['list-add-btnText']}>添加{element.fieldLocalName}</Text>
            </View>
          </>
        )
      default:
        return InputHtml(element, true)
    }
  }
  const onTip = (text: string) => {
    Toast.show({
      title: `${intl.formatMessage({
        id: 'user.qingtianxie',
        defaultMessage: '请填写',
      })}${text}`,
      icon: 'none',
    })
  }
  return (
    <View className={cx(styles['member-edit'], styles['main'])}>
      {userInfo?.outerStatus === 4 && (
        <NoticeBar>
          {intl.formatMessage({
            id: 'user.gongsimingchengxinxitianxie',
            defaultMessage: '公司名称信息填写不通过，请重新提交',
          })}
        </NoticeBar>
      )}
      <ScrollView className={styles['page']} scrollY>
        {elements.map((item: any) => {
          const ele = item
          return (
            <View className={styles['container']} key={item.Tips}>
              <View className={styles['tips']}>
                <Text className={styles['tips-color']}></Text>
                <Text className={styles['tips-text']}>{ele.groupName}</Text>
              </View>
              <View className={styles['from']}>
                {ele.elements.map((items: any) => {
                  const element = items
                  return (
                    <View className={styles['warp']} key={element.fieldName}>
                      {element.fieldType !== 'list' ? (
                        <View className={styles['item']}>
                          <Text className={styles['item-title']}>{element.fieldLocalName}</Text>
                          {element.fieldRemark != '' && (
                            <Image src={Icon} className={styles['iconS']} onClick={() => onTip(element.fieldRemark)} />
                          )}
                        </View>
                      ) : null}
                      {element.fieldType !== 'list' ? (
                        <Form className={styles['form-item']}>{showHtml(element)}</Form>
                      ) : (
                        showHtml(element)
                      )}
                    </View>
                  )
                })}
              </View>
            </View>
          )
        })}
      </ScrollView>
      <View className={styles['submit']}>
        <Button onClick={onSubmit} className={styles['submit-btn']}>
          <Text className={styles['color']}>
            {intl.formatMessage({
              id: 'user.tijiaoshenhe',
              defaultMessage: '提交审核',
            })}
          </Text>
        </Button>
      </View>
      {/* 三级联动 */}
      {!IS_WEB && <Provinces visible={addressVisible} onClose={() => setAddressVisible(false)} onSelect={onSelect} />}
      {/* 下拉框 */}
      {!IS_WEB && (
        <Select
          selectVisible={selectVisible}
          SelectList={selectElement}
          onClose={() => setSelectVisible(false)}
          onSelect={select}
        />
      )}
    </View>
  )
}
export default GlobalWrapper(NewMemberInfoEdit)
