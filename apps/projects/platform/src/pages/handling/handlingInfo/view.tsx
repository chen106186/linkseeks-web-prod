import React, { useState, useEffect } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Form, Input, Button, Tooltip, Select, message, Upload, Typography, Tabs } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import { usePrompt } from '@linkseeks/router-core'
import { inject } from 'mobx-react'
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
import CategorySelect from '@/components/CategorySelect'
import { yearProcessAmount, plantArea, staffNum } from '@/constants/procurement'
import UploadFiles from '@/pages/transaction/components/uploadFiles'
import { getTopDomainByHost } from '@/utils'
import { getCommodityShopFindByDoorType } from '@apps/apis'
import {
  getCommodityWebMemberProcessWebFindCurrMemberProcess,
  postCommodityWebMemberProcessWebSaveCurrMemberProcess,
} from '@apps/apis'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { useGlobal } from '@apps/container'

interface HandlingInfoPropsType {}
const intl = getIntl()
const { TabPane } = Tabs

const defaultCategoryData = {
  index: 0,
  firstId: 0,
  secondId: 0,
  thirdlyId: 0,
  firstName: '',
  secondName: '',
  thirdlyName: '',
}

const HandlingInfo: React.FC<HandlingInfoPropsType> = (props) => {
  const { siteUrl } = useGlobal()
  const [door, setDoor] = useState<string>('')
  const [resUrl, setResUrl] = useState<string>('')
  const [formIsHalfFilledOut, setFormIsHalfFilledOut] = useState(false)
  usePrompt({
    when: formIsHalfFilledOut,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })
  const [form] = Form.useForm()
  const [allMallList, setAllMallList] = useState([])
  const [selectCityData, setSelectCityData] = useState<any>([])
  const [selectCategoryData, setSelectCategoryData] = useState<any>([defaultCategoryData])
  const [companyPics, setCompanyPics] = useState([]) // 厂房照片
  const [honorPics, setHonorPics] = useState([]) // 资质荣誉
  const [slideshowBOList, setSlideshowBOList] = useState([]) // 首页轮播图
  const [logo, setLogo] = useState<string>('')
  const [shopInfo, setShopInfo] = useState<any>()
  const [shopId, setShopId] = useState<number>()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  /** 上传公司画册 */
  const [file, setFile] = useState<any>([])
  const handleChange = (file) => {
    setFile([...file])
  }
  const fileRemove = (index: number) => {
    console.log(index)
    setFile([])
  }

  useEffect(() => {
    fetchShopInfo()
    fetchAllShop()
  }, [])

  // 根据站点获取商城信息
  const fetchAllShop = () => {
    getCommodityShopFindByDoorType({ doorType: 5 }).then((res) => {
      if (res.code === 1000) {
        setAllMallList(res.data)
      }
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

    getCommodityWebMemberProcessWebFindCurrMemberProcess().then((res) => {
      const data: any = res.data
      if (res.code === 1000) {
        if (data) {
          setShopInfo(data)
          setSelectCityData(initMemberShopArea(data.areaList))
          setSelectCategoryData(initMemberCategory(data.categoryList))
          setLogo(data.logo)
          setCompanyPics(data.companyPics || [])
          setHonorPics(data.honorPics || [])
          setSlideshowBOList(data.slideshowList || [])
          if (data.albumName && data.albumUrl) {
            setFile([
              {
                name: data.albumName,
                url: data.albumUrl,
              },
            ])
          }
          form.setFieldsValue({
            describe: data.describe,
            customerUrl: data.customerUrl,
            logo: data.logo,
            yearProcessAmount: data.yearProcessAmount,
            plantArea: data.plantArea,
            staffNum: data.staffNum,
            categoryBOList: initMemberCategory(data.categoryList),
            areaBOList: initMemberShopArea(data.areaList),
            companyPics: data.companyPics || [],
            honorPics: data.honorPics || [],
            slideshowBOList: data.slideshowList || [],
            ...data.aboutSeo,
          })
        }
      }
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

  const initMemberCategory = (data) => {
    if (!isEmpty(data)) {
      return data.map((item, index) => {
        item.index = index
        return item
      })
    } else {
      return [defaultCategoryData]
    }
  }

  const handleAddNewCategorySelect = (item: any) => {
    const temp = [...selectCategoryData]
    temp.push(item)
    setSelectCategoryData(temp)
    form.setFieldsValue({
      categoryBOList: temp,
    })
  }

  const handleAddNewCitySelect = (item: any) => {
    const temp = [...selectCityData]
    temp.push(item)
    setSelectCityData(temp)
    form.setFieldsValue({
      areaBOList: temp,
    })
  }

  const handleReduceCategorySelect = (index: number) => {
    let temp = JSON.parse(JSON.stringify(selectCategoryData))
    temp = temp.filter((item: any) => item.index !== index)
    setSelectCategoryData(temp)
    form.setFieldsValue({
      categoryBOList: temp,
    })
  }

  const handleReduceCitySelect = (index: number) => {
    let temp = JSON.parse(JSON.stringify(selectCityData))
    temp = temp.filter((item: any) => item.index !== index)
    setSelectCityData(temp)
    form.setFieldsValue({
      areaBOList: temp,
    })
  }

  const handleCityChange = (data: any) => {
    setSelectCityData(data)
    form.setFieldsValue({
      areaBOList: data,
    })
  }

  const handleCategoryChang = (data: any) => {
    setSelectCategoryData(data)
    form.setFieldsValue({
      categoryBOList: data,
    })
  }

  const handleDeleteWorkShopImgItem = (itemInfo: any) => {
    let result = [...companyPics]
    result = result.filter((item) => item !== itemInfo)
    setCompanyPics(result)
    form.setFieldsValue({
      companyPics: result,
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

  const handleDeleteIndexPicsItem = (itemInfo: any) => {
    let result = [...slideshowBOList]
    result = result.filter((item) => item !== itemInfo)
    setSlideshowBOList(result)
    form.setFieldsValue({
      slideshowBOList: result,
    })
  }

  const handleSave = (e: any) => {
    e.preventDefault()
    form.validateFields().then((value: any) => {
      if (!checkareaBOList(value.areaBOList)) {
        return
      }
      const params = {
        aboutSeo: {
          title: value.title,
          description: value.description,
          keywords: value.keywords,
        },
        albumName: !isEmpty(file) ? file[0].name : null,
        albumUrl: !isEmpty(file) ? file[0].url : null,
        areaBOList: value.areaBOList,
        categoryBOList: value.categoryBOList,
        companyPics,
        describe: value.describe,
        honorPics,
        logo: value.logo,
        plantArea: value.plantArea,
        slideshowBOList,
        staffNum: value.staffNum,
        yearProcessAmount: value.yearProcessAmount,
      }

      setConfirmLoading(true)
      postCommodityWebMemberProcessWebSaveCurrMemberProcess(params)
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

  const checkareaBOList = (shopAreas) => {
    console.log(shopAreas, 'shopAreas')
    if (isEmpty(shopAreas)) {
      message.destroy()
      message.error(intl.formatMessage({ id: 'handling.qingxuanzeguishudishi' }))
      return false
    }

    return shopAreas.every((item) => {
      if (isEmpty(item.provinceCode)) {
        message.destroy()
        message.error(intl.formatMessage({ id: 'handling.qingxuanzeguishudishi' }))
        return false
      } else {
        return true
      }
    })
  }

  const checkcategoryBOList = (categoryBOList) => {
    if (isEmpty(categoryBOList)) {
      message.destroy()
      message.error(intl.formatMessage({ id: 'handling.qingxuanzezhuyaojiagongzhong' }))
      return false
    }

    return categoryBOList.every((item) => {
      console.log(item)
      if (isEmpty(item)) {
        message.destroy()
        message.error(intl.formatMessage({ id: 'handling.qingxuanzezhuyaojiagongzhong' }))
        return false
      } else {
        return true
      }
    })
  }

  const handleCopyLinke = (link: string) => {
    if (copy(link)) {
      message.success(intl.formatMessage({ id: 'handling.fuzhichenggong' }))
    }
  }

  /**
   * 添加厂房照片
   *  @param url
   */
  const handleAddworkshopPics = (url: string) => {
    console.log(url, 10086)
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
   * 添加首页轮播图
   * @param url
   */
  const handleAddIndexPics = (url: string) => {
    const params = {
      imgPath: url,
      link: '',
    }
    setSlideshowBOList([...slideshowBOList, params])
    form.setFieldsValue({
      slideshowBOList: [...slideshowBOList, params],
    })
  }

  const handleInputIndexPicsItem = (e: any, index: number) => {
    const { value } = e.target
    const result = [...slideshowBOList]
    result[index].link = value
    console.log(result)
    setSlideshowBOList(result)
    form.setFieldsValue({
      slideshowBOList: result,
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
        ? setResUrl(`${checkUrl(option.url)}.${getTopDomainByHost(siteUrl, true)}/aboutUs/${shopInfo.id}`)
        : setResUrl(`${siteUrl}`)
    }
  }

  return (
    <PageHeaderWrapper
      extra={
        <AuthButton type="custom" code="baocun">
          <Button type="primary" loading={confirmLoading} onClick={handleSave}>
            {intl.formatMessage({ id: 'handling.baocun' })}
          </Button>
        </AuthButton>
      }
    >
      <div className={styles.handling_info}>
        <Form
          form={form}
          className={styles.add_template_form}
          hideRequiredMark={true}
          onValuesChange={handleFormValueChange}
        >
          <Tabs type="card">
            <TabPane tab={intl.formatMessage({ id: 'handling.jibenxinxi' })} key="1" forceRender>
              <Form.Item
                labelAlign="left"
                name="categoryBOList"
                label={
                  <RequireItem label={intl.formatMessage({ id: 'handling.zhuyaojiagongzhonglei' })} isRequire={true} />
                }
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'handling.qingxuanzezhuyaojiagongzhong' }) },
                ]}
              >
                <CategorySelect
                  dataSource={selectCategoryData}
                  onAdded={handleAddNewCategorySelect}
                  onReduce={handleReduceCategorySelect}
                  onChange={handleCategoryChang}
                />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                name="yearProcessAmount"
                label={<RequireItem label={intl.formatMessage({ id: 'handling.nianjiagonge' })} isRequire={true} />}
                rules={[{ required: true, message: intl.formatMessage({ id: 'handling.qingxuanzenianjiagonge' }) }]}
              >
                <Select
                  allowClear
                  value={shopId}
                  className={styles.form_item}
                  placeholder={intl.formatMessage({ id: 'handling.qingxuanzenianjiagonge' })}
                >
                  {yearProcessAmount.map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                labelAlign="left"
                name="plantArea"
                label={<RequireItem label={intl.formatMessage({ id: 'handling.changfangmianji' })} isRequire={true} />}
                rules={[{ required: true, message: intl.formatMessage({ id: 'handling.qingxuanzechangfangmianji' }) }]}
              >
                <Select
                  allowClear
                  value={shopId}
                  className={styles.form_item}
                  placeholder={intl.formatMessage({ id: 'handling.qingxuanzechangfangmianji' })}
                >
                  {plantArea.map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                labelAlign="left"
                name="staffNum"
                label={<RequireItem label={intl.formatMessage({ id: 'handling.yuangongrenshu' })} isRequire={true} />}
                rules={[{ required: true, message: intl.formatMessage({ id: 'handling.qingxuanzeyuangongrenshu' }) }]}
              >
                <Select
                  allowClear
                  value={shopId}
                  className={styles.form_item}
                  placeholder={intl.formatMessage({ id: 'handling.qingxuanzeyuangongrenshu' })}
                >
                  {staffNum.map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                labelAlign="left"
                name="areaBOList"
                label={<RequireItem label={intl.formatMessage({ id: 'handling.guishudishi' })} isRequire={true} />}
                rules={[{ required: true, message: intl.formatMessage({ id: 'handling.qingxuanzeguishudishi' }) }]}
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
                label={<RequireItem label={intl.formatMessage({ id: 'handling.gongsiLOGO' })} isRequire={true} />}
                rules={[{ required: true, message: intl.formatMessage({ id: 'handling.qingshangchuangongsiLOGO' }) }]}
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
                label={<RequireItem label={intl.formatMessage({ id: 'handling.gongsijianjie' })} isRequire={true} />}
                rules={[{ required: true, message: intl.formatMessage({ id: 'handling.qingshurugongsijianjie' }) }]}
              >
                <Input.TextArea
                  rows={5}
                  className={styles.form_item}
                  placeholder={intl.formatMessage({ id: 'handling.qingshurugongsijianjie' })}
                  maxLength={200}
                />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                name="companyPics"
                label={<RequireItem label={intl.formatMessage({ id: 'handling.gongsizhaopian' })} />}
              >
                <div className={styles.form_item_wrap}>
                  <div className={styles.img_list}>
                    {companyPics.map((item, index) => (
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
                    label={intl.formatMessage({ id: 'handling.zizhirongyu' })}
                    brief={
                      <Tooltip placement="top" title={intl.formatMessage({ id: 'handling.rushangbiaozhucezhengshu' })}>
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
                      fileMaxSize={1024}
                      size="106x107"
                      onChange={(url) => handleAddhonorPics(url)}
                    />
                  </div>
                </div>
              </Form.Item>
              <Form.Item
                name="albumName"
                label={<RequireItem label={intl.formatMessage({ id: 'handling.xuanchuanhuace' })} />}
                labelAlign="left"
              >
                <UploadFiles
                  accept=".pdf"
                  size={50}
                  width="575px"
                  fileList={file}
                  onChange={handleChange}
                  onRemove={fileRemove}
                  visible={file.length === 0}
                />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                name="shopId"
                label={<RequireItem label={intl.formatMessage({ id: 'handling.menhulianjie' })} />}
              >
                <Select allowClear value={shopId} className={styles.form_item} onChange={handleMallSelectChange}>
                  {allMallList.map((item) => (
                    <Select.Option key={item.id} value={item.id} url={item.url}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
                {resUrl && (
                  <div className={styles.shop_url}>
                    <span>
                      {intl.formatMessage({ id: 'handling.dangqian' })}
                      {door}
                      {intl.formatMessage({ id: 'handling.lianjie' })}:
                    </span>
                    <label>{resUrl}</label>
                    <CopyOutlined className={styles.copy_icon} onClick={() => handleCopyLinke(resUrl)} />
                  </div>
                )}
              </Form.Item>
            </TabPane>
            <TabPane tab="SEO" key="2" forceRender>
              <Form.Item
                labelAlign="left"
                name="title"
                label={
                  <RequireItem
                    label={intl.formatMessage({ id: 'handling.biaoti' })}
                    isRequire={true}
                    brief={
                      <Tooltip
                        placement="top"
                        title={intl.formatMessage({ id: 'handling.yongyuxianshizaiyemiantitle' })}
                      >
                        <QuestionCircleOutlined />
                      </Tooltip>
                    }
                  />
                }
              >
                <Input
                  placeholder={intl.formatMessage({ id: 'handling.zuichang100gezifu50ge' })}
                  maxLength={100}
                  className={styles.form_item}
                />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                name="description"
                label={
                  <RequireItem
                    label={intl.formatMessage({ id: 'handling.miaoshu' })}
                    isRequire={true}
                    brief={
                      <Tooltip
                        placement="top"
                        title={intl.formatMessage({ id: 'handling.yongyuxianshizaiyemiantitle' })}
                      >
                        <QuestionCircleOutlined />
                      </Tooltip>
                    }
                  />
                }
              >
                <Input.TextArea
                  rows={5}
                  className={styles.form_item}
                  placeholder={intl.formatMessage({ id: 'handling.zuichang200gezifu100ge' })}
                  maxLength={200}
                />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                name="keywords"
                label={
                  <RequireItem
                    label={intl.formatMessage({ id: 'handling.guanjianzi' })}
                    isRequire={true}
                    brief={
                      <Tooltip
                        placement="top"
                        title={intl.formatMessage({ id: 'handling.yongyuxianshizaiyemiantitle' })}
                      >
                        <QuestionCircleOutlined />
                      </Tooltip>
                    }
                  />
                }
              >
                <Input.TextArea
                  rows={5}
                  className={styles.form_item}
                  placeholder={intl.formatMessage({ id: 'handling.zuichang200gezifu100ge' })}
                  maxLength={200}
                />
              </Form.Item>
            </TabPane>
            <TabPane tab={intl.formatMessage({ id: 'handling.shouyelunbotu' })} key="3" forceRender>
              <Form.Item
                labelAlign="left"
                name="slideshowBOList"
                label={<RequireItem label={intl.formatMessage({ id: 'handling.shouyelunbotu' })} />}
              >
                <div>
                  <div className={styles.form_item_wrap}>
                    {slideshowBOList.map((item, index) => (
                      <div className={cx(styles.index_pics_list, styles.form_item)}>
                        <div key={index} className={cx(styles.upload_btn, styles.large, styles.upload)}>
                          <div className={styles.delete_btn} onClick={() => handleDeleteIndexPicsItem(item)}>
                            <DeleteOutlined />
                          </div>
                          <img className={styles.upload_img} src={item.imgPath} />
                        </div>
                        <div className={styles.jump_link}>
                          <Typography.Text type="secondary">
                            {intl.formatMessage({ id: 'handling.tiaozhuanlianjie' })}
                          </Typography.Text>
                          <Input
                            addonBefore={<Typography.Text type="secondary">http://</Typography.Text>}
                            onChange={(value) => handleInputIndexPicsItem(value, index)}
                            value={item.link}
                            placeholder={intl.formatMessage({ id: 'handling.lunbotutiaozhuanlianjie' })}
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
export default HandlingInfo
