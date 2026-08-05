import React, { useState, useEffect } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Form, Input, Button, Tooltip, Select, message, Upload, Typography, Tabs, Image } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import { usePrompt } from '@linkseeks/router-core'
import { QuestionCircleOutlined, DeleteOutlined, CopyOutlined, UploadOutlined, LinkOutlined } from '@ant-design/icons'
import CitySelect from '@/components/CitySelect'
import { RequireItem } from '@apps/components'
import { UploadImage } from '@apps/components'
import copy from 'copy-to-clipboard'
import cx from 'classnames'
import styles from './index.less'
import { authService } from '@apps/services'
import { isEmpty } from 'lodash'
import { UPLOAD_TYPE } from '@/constants'
import { getTopDomainByHost } from '@/utils'
import { getCommodityShopFindByDoorType } from '@apps/apis'
import {
  getCommodityWebMemberPurchaseWebFindCurrMemberPurchase,
  postCommodityWebMemberPurchaseWebSaveCurrMemberPurchase,
} from '@apps/apis'
import { AuthButton } from '@apps/components'
import { downloadFileByNameAndUrl, getEnv } from '@apps/utils'

interface PurchasInfoPropsType {}

const { TabPane } = Tabs

const intl = getIntl()

const PurchasInfo: React.FC<PurchasInfoPropsType> = (props) => {
  const [resUrl, setResUrl] = useState<string>('')
  const [door, setDoor] = useState<string>('')
  const [formIsHalfFilledOut, setFormIsHalfFilledOut] = useState(false)
  usePrompt({
    when: formIsHalfFilledOut,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })
  const [form] = Form.useForm()
  const [allMallList, setAllMallList] = useState<any[]>([])
  const [selectCityData, setSelectCityData] = useState<any>([])
  const [companyPics, setCompanyPics] = useState<string[]>([]) // 厂房照片
  const [honorPics, setHonorPics] = useState<string[]>([]) // 资质荣誉
  const [advertPics, setAdvertPics] = useState<string[]>([]) // 采购门户广告图
  const [slideshowList, setSlideshowList] = useState<any[]>([]) // 首页轮播图
  const [logo, setLogo] = useState<string>('')
  const [shopInfo, setShopInfo] = useState<any>()
  const [shopId, setShopId] = useState<number>()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  /** 上传公司画册 */
  const [file, setFile] = useState<any>({})
  const [fileLoading, setFileLoading] = useState<boolean>(false)
  const beforeDocUpload = (file: any) => {
    const isLt50M = file.size / 1024 / 1024 < 50
    if (!isLt50M) {
      message.error(intl.formatMessage({ id: 'detail.purchase.placeholder19' }))
    }
    return isLt50M
  }
  const handleChange = ({ file }) => {
    setFileLoading(true)
    if (file.response) {
      if (file.response.code !== 1000) {
        setFileLoading(false)
        return
      }
      setFileLoading(false)
      setFile({
        albumName: file.name,
        albumUrl: file.response.data,
      })
    }
  }
  const fileRemove = () => {
    setFile({})
  }

  useEffect(() => {
    fetchShopInfo()
    fetchAllShop()
  }, [])

  // 根据站点获取商城信息
  const fetchAllShop = () => {
    getCommodityShopFindByDoorType({ doorType: '3' })
      .then((res) => {
        if (res.code === 1000) {
          setAllMallList(res.data)
        }
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  /**
   * 获取店铺信息
   */
  const fetchShopInfo = () => {
    const { memberId, memberRoleId } = authService.getAuth() || {}
    const param: any = {
      memberId,
      roleId: memberRoleId,
    }

    getCommodityWebMemberPurchaseWebFindCurrMemberPurchase()
      .then((res) => {
        const data: any = res.data
        if (res.code === 1000) {
          if (data) {
            setShopInfo(res.data)
            setSelectCityData(initMemberShopArea(data.areaList))
            setLogo(data.logo)
            setCompanyPics(data.companyPics || [])
            setHonorPics(data.honorPics || [])
            setSlideshowList(data.slideshowList || [])
            setAdvertPics(data.advertPics || [])
            if (data.albumName && data.albumUrl) {
              setFile({
                albumName: data.albumName,
                albumUrl: data.albumUrl,
              })
            }
            form.setFieldsValue({
              describe: data.describe,
              logo: data.logo,
              areaList: initMemberShopArea(data.areaList),
              companyPics: data.companyPics || [],
              honorPics: data.honorPics || [],
              slideshowList: data.slideshowList || [],
              advertPics: data.advertPics || [],
            })
          }
        }
      })
      .catch((error) => {
        console.warn(error)
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
    form.setFieldValue('areaList', temp)
  }

  const handleCityChange = (data: any) => {
    setSelectCityData(data)
    setTimeout(() => {
      form.setFieldValue('areaList', data)
    }, 200)
  }

  const handleDeleteWorkShopImgItem = (itemInfo: any) => {
    let result = [...companyPics]
    result = result.filter((item) => item !== itemInfo)
    setCompanyPics(result)
    form.setFieldValue('companyPics', result)
  }

  const handleDeleteHonorPicsItem = (itemInfo: any) => {
    let result = [...honorPics]
    result = result.filter((item) => item !== itemInfo)
    setHonorPics(result)
    form.setFieldValue('honorPics', result)
  }

  const handleDeleteAdvertPicsItem = (itemInfo: any) => {
    let result = [...advertPics]
    result = result.filter((item) => item !== itemInfo)
    setAdvertPics(result)
    form.setFieldValue('advertPics', result)
  }

  const handleDeleteIndexPicsItem = (itemInfo: any) => {
    let result = [...slideshowList]
    result = result.filter((item) => item !== itemInfo)
    setSlideshowList(result)
    form.setFieldValue('slideshowList', result)
  }

  const handleSave = (e: any) => {
    e.preventDefault()
    console.log(form.getFieldsValue())
    form.validateFields().then((value: any) => {
      if (!checkareaList(value.areaList)) {
        return
      }
      setConfirmLoading(true)
      const params = {
        advertPics,
        albumName: !isEmpty(file) ? file.albumName : null,
        albumUrl: !isEmpty(file) ? file.albumUrl : null,
        areaBOList: value.areaList,
        companyPics,
        describe: value.describe,
        honorPics,
        logo: value.logo,
        slideshowList,
      }

      postCommodityWebMemberPurchaseWebSaveCurrMemberPurchase(params)
        .then((res) => {
          if (res.code === 1000) {
            fetchShopInfo()
            setFormIsHalfFilledOut(false)
          }
          setConfirmLoading(false)
        })
        .catch(() => {
          setConfirmLoading(false)
        })
    })
  }

  const checkareaList = (shopAreas) => {
    if (isEmpty(shopAreas)) {
      message.destroy()
      message.error(intl.formatMessage({ id: 'detail.purchase.message63' }))
      return false
    }

    return shopAreas.every((item) => {
      if (isEmpty(item.provinceCode)) {
        message.destroy()
        message.error(intl.formatMessage({ id: 'detail.purchase.message63' }))
        return false
      } else {
        return true
      }
    })
  }

  const handleCopyLinke = (link: string) => {
    if (copy(link)) {
      message.success(intl.formatMessage({ id: 'detail.purchase.message64' }))
    }
  }

  /**
   * 添加厂房照片
   *  @param url
   */
  const handleAddworkshopPics = (url: string) => {
    setCompanyPics([...companyPics, url])
    form.setFieldsValue({
      companyPics: [...companyPics, url],
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

  /**
   * 采购门户广告图
   * @param url
   */
  const handleAddadvertPics = (url: string) => {
    setAdvertPics([...advertPics, url])
    form.setFieldsValue({
      advertPics: [...advertPics, url],
    })
  }

  /**
   * 添加首页轮播图
   * @param url
   */
  const handleAddIndexPics = (url: string) => {
    const params = {
      imgPath: url,
      link: '',
    }
    setSlideshowList([...slideshowList, params])
    form.setFieldsValue({
      slideshowList: [...slideshowList, params],
    })
  }

  const handleInputIndexPicsItem = (e: any, index: number) => {
    const { value } = e.target
    const result = [...slideshowList]
    result[index].link = value
    setSlideshowList(result)
    form.setFieldsValue({
      slideshowList: result,
    })
  }

  const handleFormValueChange = () => {
    setFormIsHalfFilledOut(true)
  }

  /** 获取店铺链接 */
  const checkUrl = (url) => {
    if (url && typeof url === 'string') {
      if (url.indexOf('/') === 0) {
        return url.replace('/', '').trim()
      } else {
        return `${url}`.trim()
      }
    }
  }

  const handleMallSelectChange = (val, option) => {
    setDoor(option.children)
    if (option.url) {
      checkUrl(option.url)
        ? !isEmpty(shopInfo)
          ? setResUrl(
              `${checkUrl(option.url)}.${getTopDomainByHost(getEnv('SITE_URL')!, false)}/shopIndex/${
                shopInfo?.id || ''
              }`,
            )
          : setResUrl(`${checkUrl(option.url)}.${getTopDomainByHost(getEnv('SITE_URL')!, true)}`)
        : setResUrl(`${getEnv('SITE_URL')}`)
    }
  }

  return (
    <PageHeaderWrapper
      extra={
        <AuthButton type="custom" code="save">
          <Button type="primary" loading={confirmLoading} onClick={handleSave}>
            {intl.formatMessage({ id: 'detail.purchase.save' })}
          </Button>
        </AuthButton>
      }
    >
      <div className={styles.handling_info}>
        <Form
          form={form}
          className={styles.add_template_form}
          onValuesChange={handleFormValueChange}
          requiredMark={false}
        >
          <Tabs type="card">
            <TabPane tab={intl.formatMessage({ id: 'detail.purchase.basicLayout' })} key="1" forceRender>
              <Form.Item
                labelAlign="left"
                name="areaList"
                wrapperCol={{ span: 12 }}
                label={
                  <RequireItem label={intl.formatMessage({ id: 'detail.purchase.areaBOList' })} isRequire={true} />
                }
                rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message63' }) }]}
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
                name="logo"
                label={<RequireItem label={intl.formatMessage({ id: 'detail.purchase.message66' })} isRequire={true} />}
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({ id: 'detail.purchase.message67' })}${intl.formatMessage({
                      id: 'detail.purchase.message66',
                    })}`,
                  },
                ]}
              >
                <UploadImage
                  imgUrl={logo}
                  fileMaxSize={50}
                  size="275*50"
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
                name="describe"
                label={<RequireItem label={intl.formatMessage({ id: 'detail.purchase.message68' })} isRequire={true} />}
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({ id: 'detail.purchase.message22' })}${intl.formatMessage({
                      id: 'detail.purchase.message68',
                    })}`,
                  },
                ]}
              >
                <Input.TextArea
                  rows={5}
                  className={styles.form_item}
                  placeholder={`${intl.formatMessage({ id: 'detail.purchase.message22' })}${intl.formatMessage({
                    id: 'detail.purchase.message68',
                  })}`}
                  maxLength={200}
                />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                name="companyPics"
                label={<RequireItem label={intl.formatMessage({ id: 'detail.purchase.message69' })} />}
              >
                <div className={styles.form_item_wrap}>
                  <div className={styles.img_list}>
                    {companyPics.map((item, index) => (
                      <div key={index} className={cx(styles.upload_btn, styles.large, styles.upload)}>
                        <div className={styles.delete_btn} onClick={() => handleDeleteWorkShopImgItem(item)}>
                          <DeleteOutlined />
                        </div>
                        <div className={styles.upload_img}>
                          <Image width="100%" height="100%" src={item} />
                        </div>
                      </div>
                    ))}
                    <UploadImage
                      imgUrl={''}
                      large={true}
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
                    label={intl.formatMessage({ id: 'detail.purchase.message70' })}
                    brief={
                      <Tooltip placement="top" title={intl.formatMessage({ id: 'detail.purchase.message71' })}>
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
                        <div className={styles.upload_img}>
                          <Image width="100%" height="100%" src={item} />
                        </div>
                      </div>
                    ))}
                    <UploadImage
                      imgUrl={''}
                      large={true}
                      fileMaxSize={1024}
                      size="106x107"
                      onChange={(url) => handleAddhonorPics(url)}
                    />
                  </div>
                </div>
              </Form.Item>
              <Form.Item
                labelAlign="left"
                name="advertPics"
                label={<RequireItem label={intl.formatMessage({ id: 'detail.purchase.message72' })} />}
              >
                <div className={styles.form_item_wrap}>
                  <div className={styles.img_list}>
                    {advertPics.map((item, index) => (
                      <div key={index} className={cx(styles.upload_btn, styles.large, styles.upload)}>
                        <div className={styles.delete_btn} onClick={() => handleDeleteAdvertPicsItem(item)}>
                          <DeleteOutlined />
                        </div>
                        <div className={styles.upload_img}>
                          <Image width="100%" height="100%" src={item} />
                        </div>
                      </div>
                    ))}
                    <UploadImage
                      imgUrl={''}
                      large={true}
                      fileMaxSize={1024}
                      size="106x107"
                      onChange={(url) => handleAddadvertPics(url)}
                    />
                  </div>
                </div>
              </Form.Item>
              <Form.Item
                labelAlign="left"
                name="albumName"
                label={<RequireItem label={intl.formatMessage({ id: 'detail.purchase.message73' })} />}
                className={styles.revise_style}
              >
                <div className={styles.upload_data}>
                  {Object.keys(file).length > 0 && (
                    <div className={styles.upload_item}>
                      <div className={styles.upload_left}>
                        <LinkOutlined style={{ marginRight: '5px' }} />
                        <Typography.Link onClick={() => downloadFileByNameAndUrl(file.url, file.name)}>
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
                    accept=".pdf"
                    beforeUpload={beforeDocUpload}
                    onChange={handleChange}
                  >
                    <Button loading={fileLoading} icon={<UploadOutlined />}>
                      {intl.formatMessage({ id: 'detail.purchase.uploadFile' })}
                    </Button>
                    <div style={{ marginTop: '8px' }}>{intl.formatMessage({ id: 'detail.purchase.message74' })}</div>
                  </Upload>
                )}
              </Form.Item>
              <Form.Item
                labelAlign="left"
                name="shopId"
                label={<RequireItem label={intl.formatMessage({ id: 'detail.purchase.message75' })} />}
              >
                <Select allowClear value={shopId} className={styles.form_item} onChange={handleMallSelectChange}>
                  {allMallList &&
                    allMallList.length > 0 &&
                    shopInfo?.id &&
                    allMallList.map((item) => (
                      <Select.Option key={item.id} value={item.id} url={item.url}>
                        {item.name}
                      </Select.Option>
                    ))}
                </Select>
                {resUrl && shopInfo?.id && (
                  <div className={styles.shop_url}>
                    <span>
                      {intl.formatMessage({ id: 'detail.purchase.label18' })}
                      {door}
                      {intl.formatMessage({ id: 'detail.purchase.label19' })}:
                    </span>
                    <label>{resUrl}</label>
                    <CopyOutlined className={styles.copy_icon} onClick={() => handleCopyLinke(resUrl)} />
                  </div>
                )}
              </Form.Item>
            </TabPane>
            <TabPane tab={intl.formatMessage({ id: 'detail.purchase.message76' })} key="2" forceRender>
              <Form.Item
                labelAlign="left"
                name="slideshowList"
                label={<RequireItem label={intl.formatMessage({ id: 'detail.purchase.message76' })} />}
              >
                <div>
                  <div className={styles.form_item_wrap}>
                    {slideshowList.map((item, index) => (
                      <div className={cx(styles.index_pics_list, styles.form_item)}>
                        <div key={index} className={cx(styles.upload_btn, styles.large, styles.upload)}>
                          <div className={styles.delete_btn} onClick={() => handleDeleteIndexPicsItem(item)}>
                            <DeleteOutlined />
                          </div>
                          <div className={styles.upload_img}>
                            <Image width="100%" height="100%" src={item.imgPath} />
                          </div>
                        </div>
                        <div className={styles.jump_link}>
                          <Typography.Text type="secondary">
                            {intl.formatMessage({ id: 'detail.purchase.message77' })}：
                          </Typography.Text>
                          <Input
                            addonBefore={<Typography.Text type="secondary">http://</Typography.Text>}
                            onChange={(value) => handleInputIndexPicsItem(value, index)}
                            value={item.link}
                            placeholder={`${intl.formatMessage({
                              id: 'detail.purchase.message76',
                            })}${intl.formatMessage({ id: 'detail.purchase.message77' })}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <UploadImage
                    imgUrl={''}
                    large={true}
                    fileMaxSize={1024}
                    size="xxxxx"
                    onChange={(url) => handleAddIndexPics(url)}
                  />
                </div>
              </Form.Item>
            </TabPane>
          </Tabs>
        </Form>
      </div>
    </PageHeaderWrapper>
  )
}
export default PurchasInfo
