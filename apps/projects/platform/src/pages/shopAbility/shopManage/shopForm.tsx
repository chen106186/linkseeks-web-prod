import React, { useState, useEffect } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Form, Input, Button, Tooltip, Select, message, Upload, Typography } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { QuestionCircleOutlined, DeleteOutlined, CopyOutlined, UploadOutlined, LinkOutlined } from '@ant-design/icons'
import CitySelect from '@/components/CitySelect'
import { RequireItem } from '@apps/components'
import { downloadFileByNameAndUrl, getMallLink } from '@apps/utils'
import {
  postCommodityWebStoreWebSaveCurrMemberShop,
  getCommodityShopShopList,
  GetCommodityShopShopListResponseDetail,
} from '@apps/apis'
import { UploadImage } from '@apps/components'
import copy from 'copy-to-clipboard'
import cx from 'classnames'
import { isEmpty } from 'lodash'
import { UPLOAD_TYPE } from '@/constants'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { usePageStatus } from '@/hooks/usePageStatus'
import { SHOP_TYPE_ENUM } from '@apps/constants'
import useStore from '../services/hooks/useStore'
import styles from './index.less'

const ShopForm: React.FC = () => {
  const { id } = usePageStatus()
  const { getStoreDetail } = useStore()
  const [resUrl, setResUrl] = useState<string>('')
  const [formIsHalfFilledOut, setFormIsHalfFilledOut] = useState(false)
  const [form] = Form.useForm()
  const [allMallList, setAllMallList] = useState<GetCommodityShopShopListResponseDetail[]>([])
  const [selectCityData, setSelectCityData] = useState<any>([])
  const [workshopPics, setWorkshopPics] = useState<string[]>([]) // 厂房照片
  const [honorPics, setHonorPics] = useState<string[]>([]) // 资质荣誉
  const [logo, setLogo] = useState<string>('')
  const [shopInfo, setShopInfo] = useState<any>()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const intl = useIntl()

  usePrompt({
    when: formIsHalfFilledOut,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })

  /** 上传公司画册 */
  const [file, setFile] = useState<any>({})
  const [fileLoading, setFileLoading] = useState<boolean>(false)
  const beforeDocUpload = (file: any) => {
    const isLt50M = file.size / 1024 / 1024 < 50
    const PDFList = ['application/pdf']
    const isPDF = PDFList.includes(file.type)
    if (!isLt50M) {
      message.error(intl.formatMessage({ id: 'shop.form.upload.size.limit' }))
    }

    if (!isPDF) {
      message.error(intl.formatMessage({ id: 'shop.form.upload.type.required' }))
    }
    return isLt50M && isPDF
  }
  const handleChange = ({ file }) => {
    if (file.response) {
      setFileLoading(true)
      if (file.response.code !== 1000) {
        setFileLoading(false)
        return
      }
      setFileLoading(false)
      setFile({
        albumName: file.name,
        albumUrl: file.response.data,
      })
    } else {
      setFileLoading(false)
    }
  }
  const fileRemove = () => {
    setFile({})
  }

  useEffect(() => {
    if (id) {
      fetchShopInfo()
    }
    fetchAllShop()
  }, [])

  // 根据站点获取商城信息
  const fetchAllShop = () => {
    const params: any = {
      current: '1',
      pageSize: '20', // 页面不需要分页，但是接口是分页的
      isSelf: false,
      type: `${SHOP_TYPE_ENUM.ENTERPRISE}`,
      environment: '1',
    }
    getCommodityShopShopList(params).then((res) => {
      if (res.code === 1000) {
        setAllMallList(res.data?.data || [])
      }
    })
  }

  /**
   * 获取店铺信息
   */
  const fetchShopInfo = () => {
    getStoreDetail(Number(id)).then((data) => {
      setShopInfo(data)
      setSelectCityData(initMemberShopArea(data.areaList))
      setLogo(data.logo)
      setWorkshopPics(data.workshopPics || [])
      setHonorPics(data.honorPics || [])

      if (data.albumName && data.albumUrl) {
        setFile({
          albumName: data.albumName,
          albumUrl: data.albumUrl,
        })
      }
      form.setFieldsValue({
        describe: data.describe,
        logo: data.logo,
        name: data.name,
        areaList: initMemberShopArea(data.areaList),
        workshopPics: data.workshopPics || [],
        honorPics: data.honorPics || [],
        phone: data.phone || '',
        address: data.address || '',
        lng: data.lng || '',
        lat: data.lat || '',
      })
    })
  }

  const initMemberShopArea = (data) => {
    if (!isEmpty(data)) {
      return data.map((item, index) => {
        item.index = index
        return item
      })
    } else {
      return []
    }
  }

  const handleAddNewCitySelect = (item: any) => {
    const temp = [...selectCityData]
    temp.push(item)
    setSelectCityData(temp)
    form.setFieldsValue({
      areaList: temp,
    })
  }

  const handleReduceCitySelect = (index: number) => {
    let temp = JSON.parse(JSON.stringify(selectCityData))
    temp = temp.filter((item: any) => item.index !== index)
    setSelectCityData(temp)
    form.setFieldsValue({
      areaList: temp,
    })
  }

  const handleCityChange = (data: any) => {
    setSelectCityData(data)
    form.setFieldsValue({
      areaList: data,
    })
  }

  const handleDeleteWorkShopImgItem = (itemInfo: any) => {
    let result = [...workshopPics]
    result = result.filter((item) => item !== itemInfo)
    setWorkshopPics(result)
    form.setFieldsValue({
      workshopPics: result,
    })
  }

  const handleDeleteHonorPicsItem = (itemInfo: any) => {
    let result = [...honorPics]
    result = result.filter((item) => item !== itemInfo)
    setHonorPics(result)
    form.setFieldsValue({
      honorPics: result,
    })
  }

  const handleSave = (e: any) => {
    e.preventDefault()
    form.validateFields().then((value: any) => {
      if (!checkMemberShopAreas(value.areaList)) {
        return
      }
      setConfirmLoading(true)
      const params = {
        name: value.name,
        albumName: !isEmpty(file) ? file.albumName : null,
        albumUrl: !isEmpty(file) ? file.albumUrl : null,
        describe: value.describe,
        honorPics,
        logo: value.logo,
        storeAreas: value.areaList,
        workshopPics,
        customerUrl: value.customerUrl,
        phone: value.phone,
        address: value.address,
      }
      postCommodityWebStoreWebSaveCurrMemberShop(params)
        .then((res) => {
          if (res.code === 1000) {
            setFormIsHalfFilledOut(false)
            history.goBack()
          }
          setConfirmLoading(false)
        })
        .catch(() => {
          setConfirmLoading(false)
        })
    })
  }

  const checkMemberShopAreas = (shopAreas) => {
    if (isEmpty(shopAreas)) {
      message.destroy()
      message.error(intl.formatMessage({ id: 'shop.form.memberShopAreas.required' }))
      return false
    }

    return shopAreas.every((item) => {
      if (isEmpty(item.provinceCode)) {
        message.destroy()
        message.error(intl.formatMessage({ id: 'shop.form.memberShopAreas.required' }))
        return false
      } else {
        return true
      }
    })
  }

  const handleCopyLinke = (link: string) => {
    if (copy(link)) {
      message.success(intl.formatMessage({ id: 'shop.option.copy.success' }))
    }
  }

  /**
   * 添加厂房照片
   *  @param url
   */
  const handleAddworkshopPics = (url: string) => {
    setWorkshopPics([...workshopPics, url])
    form.setFieldsValue({
      workshopPics: [...workshopPics, url],
    })
  }

  /**
   * 添加荣誉图片
   * @param url
   */
  const handleAddhonorPics = (url: string) => {
    setHonorPics([...honorPics, url])
    form.setFieldsValue({
      honorPics: [...honorPics, url],
    })
  }

  const handleFormValueChange = () => {
    setFormIsHalfFilledOut(true)
  }

  const handleMallSelectChange = async (val, option) => {
    if (shopInfo) {
      const mallLink = getMallLink(option.url)
      let url = ''
      switch (option.type) {
        case 1:
          url = `${mallLink}/shop/${shopInfo.id}`
          break
        case 2:
          url = `${mallLink}/shop/${shopInfo.id}/integral`
          break
      }
      setResUrl(url)
    }
  }

  const getShopUrl = (malInfo: GetCommodityShopShopListResponseDetail) => {
    const mallLink = getMallLink(malInfo.url)
    if (shopInfo) {
      return `${mallLink}/shop/${shopInfo.id}`
    }
    return ''
  }

  return (
    <PageHeaderWrapper
      extra={
        <Button loading={confirmLoading} type="primary" style={{ marginRight: 16 }} onClick={handleSave}>
          {intl.formatMessage({ id: 'common.button.save' })}
        </Button>
      }
    >
      <div className={styles.shop_info}>
        <Form
          form={form}
          className={styles.add_template_form}
          requiredMark={false}
          onValuesChange={handleFormValueChange}
          wrapperCol={{
            span: 14,
          }}
        >
          <Form.Item
            labelAlign="left"
            name="name"
            label={<RequireItem label={intl.formatMessage({ id: 'shop.form.label.name' })} isRequire={true} />}
            rules={[{ required: true, message: intl.formatMessage({ id: 'shop.form.name.required' }) }]}
          >
            <Input
              className={styles.form_item}
              placeholder={intl.formatMessage({ id: 'shop.form.name.required' })}
              maxLength={20}
            />
          </Form.Item>
          <Form.Item
            labelAlign="left"
            name="logo"
            label={<RequireItem label={intl.formatMessage({ id: 'shop.form.label.logo' })} isRequire={true} />}
            rules={[{ required: true, message: intl.formatMessage({ id: 'shop.form.logo.required' }) }]}
          >
            <UploadImage
              imgUrl={logo}
              accept={'.jpg,.png,.jpeg'}
              fileMaxSize={50}
              size="275*275"
              onChange={(val) => {
                setLogo(val)
                form.setFieldsValue({
                  logo: val,
                })
              }}
            />
          </Form.Item>
          <Form.Item
            labelAlign="left"
            name="areaList"
            label={
              <RequireItem label={intl.formatMessage({ id: 'shop.form.label.memberShopAreas' })} isRequire={true} />
            }
            rules={[{ required: true, message: intl.formatMessage({ id: 'shop.form.memberShopAreas.required' }) }]}
          >
            <CitySelect
              selectData={selectCityData}
              onAdd={handleAddNewCitySelect}
              onReduce={handleReduceCitySelect}
              onChange={handleCityChange}
            />
          </Form.Item>
          <Form.Item
            labelAlign="left"
            name="describe"
            label={<RequireItem label={intl.formatMessage({ id: 'shop.form.label.describe' })} isRequire={true} />}
            rules={[{ required: true, message: intl.formatMessage({ id: 'shop.form.describe.required' }) }]}
          >
            <Input.TextArea
              rows={5}
              className={styles.form_item}
              placeholder={intl.formatMessage({ id: 'shop.form.describe.required' })}
              maxLength={200}
            />
          </Form.Item>
          <Form.Item
            labelAlign="left"
            name="workshopPics"
            label={<RequireItem label={intl.formatMessage({ id: 'shop.form.label.workshopPics' })} />}
          >
            <div className={styles.form_item_wrap}>
              <div className={styles.img_list}>
                {workshopPics.map((item, index) => (
                  <div key={index} className={cx(styles.upload_btn, styles.large, styles.upload)}>
                    <div className={styles.delete_btn} onClick={() => handleDeleteWorkShopImgItem(item)}>
                      <DeleteOutlined />
                    </div>
                    <div className={styles.upload_img} style={{ backgroundImage: `url(${item})` }} />
                  </div>
                ))}
                <UploadImage
                  imgUrl={''}
                  large={true}
                  accept={'.jpg,.png,.jpeg'}
                  fileMaxSize={1024}
                  size="600x400"
                  onChange={(url) => handleAddworkshopPics(url)}
                />
              </div>
            </div>
          </Form.Item>
          <Form.Item
            labelAlign="left"
            name="honorPics"
            label={
              <RequireItem
                label={intl.formatMessage({ id: 'shop.form.label.honorPics' })}
                brief={
                  <Tooltip placement="top" title={intl.formatMessage({ id: 'shop.form.label.honorPics.tip' })}>
                    <QuestionCircleOutlined />
                  </Tooltip>
                }
              />
            }
          >
            <div className={styles.form_item_wrap}>
              <div className={styles.img_list}>
                {honorPics.map((item, index) => (
                  <div key={index} className={cx(styles.upload_btn, styles.large, styles.upload)}>
                    <div className={styles.delete_btn} onClick={() => handleDeleteHonorPicsItem(item)}>
                      <DeleteOutlined />
                    </div>
                    <img className={styles.upload_img} src={item} />
                  </div>
                ))}
                <UploadImage
                  imgUrl={''}
                  large={true}
                  accept={'.jpg,.png,.jpeg'}
                  fileMaxSize={1024}
                  size="106x107"
                  onChange={(url) => handleAddhonorPics(url)}
                />
              </div>
            </div>
          </Form.Item>
          <Form.Item
            labelAlign="left"
            name="albumName"
            label={<RequireItem label={intl.formatMessage({ id: 'shop.form.label.albumName' })} />}
            className={styles.revise_style}
          >
            <div className={styles.upload_data}>
              {Object.keys(file).length > 0 && (
                <div className={styles.upload_item}>
                  <div className={styles.upload_left}>
                    <LinkOutlined style={{ marginRight: '5px' }} />
                    <Typography.Link onClick={() => downloadFileByNameAndUrl(file.albumUrl, file.albumName)}>
                      {file.albumName}
                    </Typography.Link>
                  </div>
                  <div className={styles.upload_right} onClick={fileRemove}>
                    <DeleteOutlined />
                  </div>
                </div>
              )}
            </div>
            {Object.keys(file).length === 0 && (
              <Upload
                action="/api/support/file/upload"
                data={{ fileType: UPLOAD_TYPE }}
                showUploadList={false}
                // accept='.pdf'
                beforeUpload={beforeDocUpload}
                onChange={handleChange}
              >
                <Button loading={fileLoading} icon={<UploadOutlined />}>
                  {intl.formatMessage({ id: 'shop.form.label.upload' })}
                </Button>
                <div style={{ marginTop: '8px' }}>{intl.formatMessage({ id: 'shop.form.label.upload.tip' })}</div>
              </Upload>
            )}
          </Form.Item>
          <Form.Item
            labelAlign="left"
            label={<RequireItem label={intl.formatMessage({ id: 'shop.form.label.shopLink' })} />}
          >
            {allMallList.map(
              (item) =>
                getShopUrl(item) && (
                  <div className={styles.shop_url}>
                    <span>{item.name}:</span>
                    <label>{getShopUrl(item)}</label>
                    <CopyOutlined className={styles.copy_icon} onClick={() => handleCopyLinke(getShopUrl(item))} />
                  </div>
                ),
            )}
          </Form.Item>
          <Form.Item
            labelAlign="left"
            name="phone"
            label={<RequireItem label={intl.formatMessage({ id: 'shop.form.label.phone' })} />}
          >
            <Input allowClear autoComplete="off" maxLength={16} className={styles.form_item} />
          </Form.Item>
          <Form.Item
            labelAlign="left"
            name="address"
            label={<RequireItem label={intl.formatMessage({ id: 'shop.form.label.address' })} />}
          >
            <Input allowClear autoComplete="off" maxLength={120} className={styles.form_item} />
          </Form.Item>
        </Form>
      </div>
    </PageHeaderWrapper>
  )
}

export default ShopForm
