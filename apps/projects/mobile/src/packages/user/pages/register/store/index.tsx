import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { View, Text, Image, Input, Radio, Checkbox, Upload, Toast, Icons } from '@apps/mobile-ui'
import { setNavigationBarTitle, pxTransform } from '@apps/mobile-services/utils/taro'
import { useSafeArea } from '@apps/mobile-services'
import { getAsyncStorage, setAsyncStorage } from '@apps/mobile-services/utils/storage'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import uploadFileRequest from '@/utils/uploadFileRequest'
import Cell from '@/components/Cell'
import Provinces from '@/components/Provinces'
import ProvincesH5 from '@/components/Provinces/index.h5'
import Select from '@/components/Select'
import SelectH5 from '@/components/Select/index.h5'
import { IS_WEB } from '@/constants'
import { REGISTER_DATA, IDS_DATA, REGISTER_STORE_DATA } from '@/constants/storage'
import { getMemberMobileRegisterDetail } from '@apps/apis'
import Progress from '../components/progress'
import { onSubmit } from '../utils'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { getOssUrlPath } from '@apps/constants'
const Icon = getOssUrlPath('/miniprogram/assets/question-mark-circle.png')
const UploadIcon = getOssUrlPath('/miniprogram/assets/images/Upload.png')
const TrashIcon = getOssUrlPath('/miniprogram/assets/images/Trash.svg')
const plusIcon = getOssUrlPath('/miniprogram/assets/images/Plus.svg')
const Store = () => {
  const intl = useIntl()
  const { safeBottomHeight } = useSafeArea()
  const [elements, setElements] = useState<any>([])
  const [visible, setVisible] = useState<boolean>(false) // 显示地址
  const [selectVisible, setSelectVisible] = useState<boolean>(false) // 显示下拉
  const [selectList, setSelectList] = useState<any>([]) // 点击对应
  const [form, setForm] = useState<any>({}) // 提交数据
  const [selectKey, setSelectKey] = useState<string>('')
  const [selectKeyData, setSelectJeyData] = useState({}) // 下拉框值
  const [uploadData, setUploadData] = useState({}) // 上传图片选中
  const [addressData, setAddressData] = useState({}) // 处理过的下拉选中
  const [addKey, setAddKey] = useState('')
  const [submitData, setSubmitData] = useState({})
  const _setStoreForm = (data) => {
    setForm(data)
    setAsyncStorage(REGISTER_STORE_DATA, data)
  }
  /* 提交事件 */
  const submit = async () => {
    for (let key in submitData) {
      if (!form[key]) {
        Toast.show({
          title: `请输入${submitData[key]}`,
          icon: 'none',
        })
        return
      }
    }
    const param = await getAsyncStorage(REGISTER_DATA)
    const id = await getAsyncStorage(IDS_DATA)
    const data = Object.assign(param, id)
    onSubmit(data, form)
  }
  /* 获取表单动态内容 */
  const getFrom = async () => {
    const param = await getAsyncStorage(IDS_DATA)
    const resStore = await getAsyncStorage(REGISTER_STORE_DATA)
    const res = await getMemberMobileRegisterDetail({
      roleId: param.memberRoleId,
    })
    if (res.code === 1000) {
      setElements(res.data)
      const formValue: {
        [key: string]: any
      } = {}
      const selectData = {
        ...selectKeyData,
      }
      const uploadKey = uploadData
      const addressKey = addressData
      const submitObj = {}
      res.data.map((item: { elements: any[] }) => {
        if (item.elements && item.elements.length) {
          item.elements.map((ele) => {
            // 输入框
            if (ele.fieldEmpty === 0) {
              submitObj[ele.fieldName] = ele.fieldLocalName
            }
            // 下拉框
            if (ele.fieldType == 'select') {
              const _fieldEnum = ele.fieldEnum.find((item) => item.value === resStore?.[ele.fieldName])
              selectData[ele.fieldName as string] = _fieldEnum?.label || ele?.fieldValue || ''
            }
            // 上传
            if (ele.fieldType === 'file') {
              uploadKey[ele.fieldName as string] = resStore?.[ele.fieldName] || ele?.fieldValue || ''
            }
            // 地址
            if (ele.fieldType === 'area') {
              addressKey[ele.fieldName as string] = resStore?.[ele.fieldName]?.name || ele?.fieldValue || ''
            }
            //列表类型
            if (ele.fieldType === 'list') {
              formValue[ele.fieldName as string] = resStore?.[ele.fieldName] || ele?.fieldValue || [{}]
            } else {
              // 其他类型统一设置
              formValue[ele.fieldName as string] = resStore?.[ele.fieldName] || ele?.fieldValue || ''
            }
          })
        }
      })
      setAddressData(addressKey)
      setSubmitData(submitObj)
      setUploadData(uploadKey)
      _setStoreForm(formValue)
      setSelectJeyData(selectData)
    }
  }
  const onTip = (text: string) => {
    if (text) {
      Toast.show({
        title: `${intl.formatMessage({
          id: 'user.qingtianxie',
          defaultMessage: '请填写',
        })}${text}`,
        icon: 'none',
      })
    }
  }
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'user.zhanghaozhuce', defaultMessage: '帐号注册' }) })
    getFrom()
  }, [])
  // 图片上传
  const uploadFile = async (result, name) => {
    const uploadResult = await uploadFileRequest([result[0]])
    const data = {
      ...form,
    }
    data[name] = uploadResult[0].url
    _setStoreForm(data)
    const uploadKey = {
      ...uploadData,
    }
    uploadKey[name] = uploadResult[0].url
    setUploadData({
      ...uploadKey,
    })
    return uploadResult
  }
  /* 处理多情况下拉内容 */
  const renderSelect = (item) => {
    setSelectList(item.fieldEnum)
    setSelectKey(item.fieldName)
    setSelectVisible(true)
  }
  /* 给from设置值 */
  const setKey = (val, key) => {
    const formData = {
      ...form,
    }
    formData[key] = val
    _setStoreForm(formData)
  }
  /* 地址选择 */
  const onAddress = (item) => {
    setVisible(true)
    setAddKey(item.fieldName)
  }

  /* list类型add */
  const listAdd = (key) => {
    const formData = {
      ...form,
    }
    formData[key].push({})
    _setStoreForm(formData)
  }

  /* list类型add */
  const listDeleteItem = (key, index) => {
    const formData = {
      ...form,
    }
    formData[key].splice(index, 1)
    _setStoreForm(formData)
  }
  const RenderNodeContainer = ({ item, children }) => {
    return (
      <View
        key={item.fieldLocalName}
        className={cx(
          styles['field'],
          ['area', 'select'].includes(item.fieldType) ? styles['flex'] : styles['list-container'],
        )}
      >
        <View className={styles['fieldLocal']} onClick={() => onTip(item.fieldRemark)}>
          <View className={styles['fieldLocalName']}>{item.fieldLocalName}</View>
          {item.fieldRemark != '' && <Image src={Icon} className={styles['Icon']} />}
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          {children}
        </View>
      </View>
    )
  }
  const nodeInput = (val, parents, index, fieldName) => {
    const formData = {
      ...form,
    }
    formData[parents][index][fieldName] = val
    _setStoreForm(formData)
  }

  /* 动态渲染表单 list字段 */
  const renderNode = (parents, item, index) => {
    const { fieldType, fieldRemark, fieldName, fieldValue } = item
    switch (fieldType) {
      case 'string':
        return (
          <Input
            placeholder={fieldRemark}
            value={form[parents]?.[index]?.[fieldName]}
            className={styles['list-input']}
            onChange={(e) => nodeInput(e, parents, index, fieldName)}
          />
        )
      case 'checkbox':
        return (
          <RenderNodeContainer item={item}>
            <Checkbox.Group
              onChange={(value: any) => {
                const data = {
                  ...form,
                }
                const selectValues = value ? value.filter((_item) => !!_item && typeof _item === 'number') : []
                data[parents][index][fieldName] = selectValues
                _setStoreForm(data)
              }}
              value={form[parents]?.[index]?.[fieldName] || []}
            >
              <View className={styles['group-wrap']}>
                {item.fieldEnum.map((items: any) => (
                  <View key={item.value} className={styles['RadioBox']}>
                    <View>{items.label}</View>
                    <Checkbox value={items.value} />
                  </View>
                ))}
              </View>
            </Checkbox.Group>
          </RenderNodeContainer>
        )
      case 'radio':
        return (
          <RenderNodeContainer item={item}>
            <Radio.Group
              onChange={(value: any) => {
                const data = {
                  ...form,
                }
                data[parents][index][fieldName] = value
                _setStoreForm(data)
              }}
              value={form[parents]?.[index]?.[fieldName]}
            >
              <View className={styles['group-wrap']}>
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

  /* 动态渲染表单 */
  const reactNode = (item: any) => {
    const { fieldType, fieldRemark, fieldName, fieldValue, fieldLocalName } = item
    switch (fieldType) {
      case 'select':
        return IS_WEB ? (
          <SelectH5
            SelectList={item.fieldEnum}
            onSelect={(data) => {
              selectH5(data, fieldName)
            }}
          >
            <View className={cx(styles['formBox'], styles['picker'])}>
              {selectKeyData[fieldName] || fieldRemark}
              <View className={styles['formBox-arrow']}>
                <Icons name="ChevronRight" size={14} color="#C0C4CC" />
              </View>
            </View>
          </SelectH5>
        ) : (
          <View className={cx(styles['formBox'], styles['picker'])} onClick={() => renderSelect(item)}>
            {selectKeyData[fieldName] || fieldRemark}
            <View className={styles['formBox-arrow']}>
              <Icons name="ChevronRight" size={14} color="#C0C4CC" />
            </View>
          </View>
        )
      case 'radio':
        return (
          <Radio.Group
            onChange={(value: any) => {
              const data = {
                ...form,
              }
              data[fieldName] = value
              _setStoreForm(data)
            }}
            value={form[fieldName]}
          >
            <View className={styles['group-wrap']}>
              {item.fieldEnum.map((items: any) => (
                <View key={item.value} className={styles['RadioBox']}>
                  <View>{items.label}</View>
                  <Radio value={items.value} />
                </View>
              ))}
            </View>
          </Radio.Group>
        )
      case 'checkbox':
        return (
          <Checkbox.Group
            onChange={(value) => {
              const data = {
                ...form,
              }
              data[fieldName] = value
              _setStoreForm(data)
            }}
            value={form[fieldName]}
          >
            <View className={styles['group-wrap']}>
              {item.fieldEnum.map((items: any) => (
                <View key={item.value} className={styles['RadioBox']}>
                  <View>{items.label}</View>
                  <Checkbox value={items.value} />
                </View>
              ))}
            </View>
          </Checkbox.Group>
        )
      case 'number':
        return (
          <Input
            placeholder={fieldRemark}
            value={form[fieldName]}
            type={fieldType === 'number' || fieldType === 'string' ? 'text' : 'number'}
            className={styles['string-input']}
            onChange={(e) => setKey(e, fieldName)}
          />
        )
      case 'string':
        return (
          <Input
            placeholder={fieldRemark}
            value={form[fieldName]}
            className={styles['string-input']}
            onChange={(e) => setKey(e, fieldName)}
          />
        )
      case 'area':
        return IS_WEB ? (
          <ProvincesH5
            onSelect={(data) => {
              onSelectByAP(data, item?.fieldName)
            }}
          >
            <View className={cx(styles['formBox'], styles['picker'])}>
              {addressData[fieldName] || fieldRemark || fieldLocalName}
              <View className={styles['formBox-arrow']}>
                <Icons name="ChevronRight" size={14} color="#C0C4CC" />
              </View>
            </View>
          </ProvincesH5>
        ) : (
          <View className={cx(styles['formBox'], styles['picker'])} onClick={() => onAddress(item)}>
            {addressData[fieldName] || fieldRemark || fieldLocalName}
            <View className={styles['formBox-arrow']}>
              <Icons name="ChevronRight" size={14} color="#C0C4CC" />
            </View>
          </View>
        )
      case 'file':
        return (
          <Upload actions={(e) => uploadFile(e, fieldName)} pickerMax={1}>
            {uploadData[fieldName] ? (
              <Image className={styles['Img']} src={uploadData[fieldName]} mode="aspectFill" />
            ) : (
              <View className={styles['UploadWarp']}>
                <Image src={UploadIcon} />
                <View className={styles['UploadWarpText']}>{fieldRemark}</View>
              </View>
            )}
          </Upload>
        )
      case 'list':
        return (
          <>
            {form[fieldName]?.map((_field, _fieldIndex, _fieldArr) => (
              <>
                <View
                  className={styles['fieldLocal']}
                  style={{
                    flexDirection: 'row',
                  }}
                  onClick={() => onTip(fieldRemark)}
                >
                  <View
                    className={styles['fieldLocalName']}
                    style={{
                      flex: 1,
                    }}
                  >
                    {item.fieldLocalName + `${_fieldIndex + 1}`}
                    {fieldRemark != '' && <Image src={Icon} className={styles['Icon']} />}
                  </View>
                  {_fieldArr.length === 1 ? null : (
                    <Image
                      src={TrashIcon}
                      className={styles['Icon']}
                      onClick={() => {
                        listDeleteItem(fieldName, _fieldIndex)
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
                    {item.configs.map((_item, _index) => (
                      <Cell.Item
                        key={_index}
                        title={_item.fieldType === 'string' ? _item.fieldLocalName : null}
                        value={renderNode(fieldName, _item, _fieldIndex)}
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
                listAdd(fieldName)
              }}
            >
              <Image className={styles['list-add-btnIcon']} src={plusIcon} />
              <Text className={styles['list-add-btnText']}>添加{item.fieldLocalName}</Text>
            </View>
          </>
        )
    }
  }
  /* 选中地址回调 */
  const onSelect = (data) => {
    const keyData = {
      ...addressData,
    }
    keyData[addKey] = data.name
    const formData = {
      ...form,
    }
    formData[addKey] = {
      provinceCode: data.provinceCode,
      cityCode: data.cityCode,
      districtCode: data.distCode,
      name: data.name,
    }
    setAddressData({
      ...keyData,
    })
    _setStoreForm({
      ...formData,
    })
    setVisible(false)
  }
  /* 选中地址回调 */
  const onSelectByAP = (data, key: string) => {
    const formData = {
      ...form,
    }
    const keyData = {
      ...addressData,
    }
    keyData[key] = data.name
    formData[key] = {
      provinceCode: data.provinceCode,
      cityCode: data.cityCode,
      districtCode: data.distCode,
      name: data.name,
    }
    setAddressData({
      ...keyData,
    })
    _setStoreForm({
      ...formData,
    })
    setVisible(false)
  }
  /* 下拉框选中地址 */
  const select = (data) => {
    const formData = {
      ...form,
    }
    const keyData = {
      ...selectKeyData,
    }
    formData[selectKey] = data.value
    keyData[selectKey] = data.label
    _setStoreForm(formData)
    setSelectJeyData(keyData)
  }

  /* 下拉框选中地址 */
  const selectH5 = (data, key) => {
    const formData = {
      ...form,
    }
    const keyData = {
      ...selectKeyData,
    }
    formData[key] = data.value
    keyData[key] = data.label
    _setStoreForm(formData)
    setSelectJeyData(keyData)
  }
  return (
    <View
      className={styles['containers']}
      style={{
        paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(16),
      }}
    >
      <View className={styles['warp']}>
        <Progress setp={4} />
        <View className={styles['InfoName']}>
          <Text className={styles['final-step']}>
            {intl.formatMessage({
              id: 'user.finalstep',
              defaultMessage: '最后一步',
            })}
          </Text>
          <Text className={styles['store-title']}>
            {intl.formatMessage({
              id: 'user.qingninjixuwanshanzhuce',
              defaultMessage: '请您继续完善注册资料',
            })}
          </Text>
        </View>
        <View className={styles['from']}>
          {elements.map((item: any) => (
            <View key={item.Tips} className={styles['List']}>
              <View className={styles['Itemtitle']}>
                <Text className={styles['TipsColor']}></Text>
                <Text>{item.groupName}</Text>
              </View>
              {item?.elements.map((key: any) => (
                <View
                  key={key.fieldLocalName}
                  className={cx(styles['field'], ['area', 'select'].includes(key.fieldType) ? styles['flex'] : '')}
                >
                  {key.fieldType !== 'list' ? (
                    <View className={styles['fieldLocal']} onClick={() => onTip(key.fieldRemark)}>
                      <View className={styles['fieldLocalName']}>{key.fieldLocalName}</View>
                      {key.fieldRemark != '' && <Image src={Icon} className={styles['Icon']} />}
                    </View>
                  ) : null}
                  {key.fieldType !== 'list' ? (
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      {reactNode(key)}
                    </View>
                  ) : (
                    reactNode(key)
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
      <View className={styles['myfoot']}>
        <View className={styles['btn']} onClick={submit}>
          {intl.formatMessage({
            id: 'user.tijiaoshenhe',
            defaultMessage: '提交审核',
          })}
        </View>
      </View>
      <View className={styles['goBack']} onClick={() => Router.navigateBack()}>
        {intl.formatMessage({
          id: 'common.returnToPreviousStep',
          defaultMessage: '返回上一步',
        })}
      </View>
      {/* 三级联动 */}
      {!IS_WEB && (
        <Provinces
          onClose={() => {
            setVisible(false)
          }}
          visible={visible}
          onSelect={onSelect}
        />
      )}
      {/* 下拉框 */}
      {!IS_WEB && (
        <Select
          selectVisible={selectVisible}
          SelectList={selectList}
          onClose={() => setSelectVisible(false)}
          onSelect={select}
        />
      )}
    </View>
  )
}
export default GlobalWrapper(Store)
