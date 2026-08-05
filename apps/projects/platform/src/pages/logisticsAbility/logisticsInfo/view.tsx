import React, { useState, useEffect } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Form, Input, Button, Tooltip, Select, message, Upload, Typography, Tabs, Badge } from 'antd'
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
import InputSelect from './components/InputSelect'
import { getTopDomainByHost } from '@/utils'
import { getCommodityShopFindByDoorType } from '@apps/apis'
import { AuthButton } from '@apps/components'
import {
  getCommodityWebMemberLogisticsWebFindCurrMemberLogistics,
  postCommodityWebMemberLogisticsWebSaveCurrMemberLogistics,
} from '@apps/apis'
import { useGlobal } from '@apps/container'
import { downloadFileByNameAndUrl } from '@apps/utils'
const intl = getIntl()
interface LogisticsInfoPropsType {}

const { TabPane } = Tabs

const TabFormErrors = (props) => {
  return (
    <Badge size="small" count={props.dot} offset={[6, -5]}>
      {props.children}
    </Badge>
  )
}

const LogisticsInfo: React.FC<LogisticsInfoPropsType> = (props) => {
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
  const [storeUrl, setStoreUrl] = useState<string>('')
  const [selectCityData, setSelectCityData] = useState<any>([])
  const [companyPics, setCompanyPics] = useState([]) // 厂房照片
  const [honorPics, setHonorPics] = useState([]) // 资质荣誉
  const [slideshowBOList, setSlideshowBOList] = useState([]) // 首页轮播图
  const [promotionPic, setPromotionPic] = useState<string>('')
  const [logo, setLogo] = useState<string>('')
  const [shopInfo, setShopInfo] = useState<any>()
  const [shopId, setShopId] = useState<number>()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [mainBusiness, setMainBusiness] = useState<Array<string>>([''])
  const [badge, setbadge] = useState<any>([0, 0, 0])

  const getError = (num: number, idx: number) => {
    const data = [...badge]
    data[idx] = num
    setbadge(data)
  }

  /** 上传公司画册 */
  const [file, setFile] = useState<any>({})
  const [fileLoading, setFileLoading] = useState<boolean>(false)
  const beforeDocUpload = (file: any) => {
    const isLt50M = file.size / 1024 / 1024 < 50
    if (!isLt50M) {
      message.error(intl.formatMessage({ id: 'logistics.shangchuanwenjiandaxiaobuchao' }))
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
    getCommodityShopFindByDoorType({ doorType: 4 }).then((res) => {
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

    getCommodityWebMemberLogisticsWebFindCurrMemberLogistics(param).then((res) => {
      const data: any = res.data
      if (res.code === 1000) {
        if (data) {
          setShopInfo(data)
          setSelectCityData(initMemberShopArea(data.areaList))
          setLogo(data.logo)
          setCompanyPics(data.companyPics || [])
          setHonorPics(data.honorPics || [])
          setPromotionPic(data.promotionPic || '')
          setSlideshowBOList(data.slideshowList || [])
          setMainBusiness(data.mainBusiness || [])
          if (data.albumName && data.albumUrl) {
            setFile({
              albumName: data.albumName,
              albumUrl: data.albumUrl,
            })
          }
          form.setFieldsValue({
            describe: data.describe,
            customerUrl: data.customerUrl,
            logo: data.logo,
            areaBOList: initMemberShopArea(data.areaList),
            mainBusiness: data.mainBusiness || [],
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

  const handleAddNewInputSelect = (item: any) => {
    const temp = [...mainBusiness]
    temp.push(item)
    setMainBusiness(temp)
    form.setFieldsValue({
      mainBusiness: temp,
    })
  }

  const handleReduceInputSelect = (index: number) => {
    let temp = [...mainBusiness]
    temp = temp.filter((_it: any, idx: number) => idx !== index)
    setMainBusiness(temp)
    form.setFieldsValue({
      mainBusiness: temp,
    })
  }

  const handleInputChange = (data: any) => {
    setMainBusiness(data)
    form.setFieldsValue({
      mainBusiness: data,
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

  const getNumber = (arr: string[]) => {
    let count: number = 0
    arr.forEach((item) => {
      if (!item) {
        count += 1
      }
    })
    return count
  }

  const handleSave = (e: any) => {
    e.preventDefault()
    form
      .validateFields()
      .then((value: any) => {
        if (!checkmainBusiness(value.mainBusiness)) {
          return
        }
        if (!checkareaBOList(value.areaBOList)) {
          return
        }
        setConfirmLoading(true)
        const params = {
          aboutSeo: {
            title: value.title,
            description: value.description,
            keywords: value.keywords,
          },
          albumName: !isEmpty(file) ? file.albumName : null,
          albumUrl: !isEmpty(file) ? file.albumUrl : null,
          areaBOList: value.areaBOList,
          companyPics,
          describe: value.describe,
          honorPics,
          logo: value.logo,
          mainBusiness: value.mainBusiness,
          slideshowBOList,
        }
        postCommodityWebMemberLogisticsWebSaveCurrMemberLogistics(params)
          .then((res) => {
            if (res.code === 1000) {
              setbadge([0, 0, 0])
              fetchShopInfo()
              setFormIsHalfFilledOut(false)
            }
            setConfirmLoading(false)
          })
          .catch(() => {
            setConfirmLoading(false)
          })
      })
      .catch((err) => {
        const { mainBusiness, areaBOList, logo, describe, title, description, keywords } = err.values
        if (!mainBusiness || !areaBOList || !logo || !describe) {
          getError(getNumber([mainBusiness, areaBOList, logo, describe]), 0)
        } else if (!title || !description || !keywords) {
          getError(getNumber([title, description, keywords]), 1)
        }
      })
  }

  const checkareaBOList = (shopAreas) => {
    if (isEmpty(shopAreas)) {
      message.destroy()
      message.error(intl.formatMessage({ id: 'logistics.qingxuanzeguishudishi' }))
      return false
    }

    return shopAreas.every((item) => {
      if (isEmpty(item.provinceCode)) {
        message.destroy()
        message.error(intl.formatMessage({ id: 'logistics.qingxuanzeguishudishi' }))
        return false
      } else {
        return true
      }
    })
  }

  const checkmainBusiness = (shopMainBusiness) => {
    if (isEmpty(shopMainBusiness)) {
      message.destroy()
      message.error(intl.formatMessage({ id: 'logistics.qingshuruzhuyingyewu' }))
      return false
    }

    return shopMainBusiness.every((item) => {
      if (isEmpty(item)) {
        message.destroy()
        message.error(intl.formatMessage({ id: 'logistics.qingshuruzhuyingyewu' }))
        return false
      } else {
        return true
      }
    })
  }

  const handleCopyLinke = (link: string) => {
    if (copy(link)) {
      message.success(intl.formatMessage({ id: 'logistics.fuzhichenggong' }))
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
            {intl.formatMessage({ id: 'logistics.baocun' })}
          </Button>
        </AuthButton>
      }
    >
      <div className={styles.logistics_info}>
        <Form
          form={form}
          className={styles.add_template_form}
          hideRequiredMark={true}
          onValuesChange={handleFormValueChange}
        >
          <Tabs type="card">
            <TabPane
              tab={<TabFormErrors dot={badge[0]}>{intl.formatMessage({ id: 'logistics.jibenxinxi' })}</TabFormErrors>}
              key="1"
              forceRender
            >
              <Form.Item
                labelAlign="left"
                name="mainBusiness"
                label={<RequireItem label={intl.formatMessage({ id: 'logistics.zhuyingyewu' })} isRequire={true} />}
                rules={[{ required: true, message: intl.formatMessage({ id: 'logistics.qingshuruzhuyingyewu' }) }]}
              >
                <InputSelect
                  dataSource={mainBusiness}
                  onAdded={handleAddNewInputSelect}
                  onReduce={handleReduceInputSelect}
                  onChange={handleInputChange}
                />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                name="areaBOList"
                label={<RequireItem label={intl.formatMessage({ id: 'logistics.guishudishi' })} isRequire={true} />}
                rules={[{ required: true, message: intl.formatMessage({ id: 'logistics.qingxuanzeguishudishi' }) }]}
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
                label={<RequireItem label={intl.formatMessage({ id: 'logistics.gongsiLOGO' })} isRequire={true} />}
                rules={[{ required: true, message: intl.formatMessage({ id: 'logistics.qingshangchuangongsiLOGO' }) }]}
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
                label={<RequireItem label={intl.formatMessage({ id: 'logistics.gongsijianjie' })} isRequire={true} />}
                rules={[{ required: true, message: intl.formatMessage({ id: 'logistics.qingshurugongsijianjie' }) }]}
              >
                <Input.TextArea
                  rows={5}
                  className={styles.form_item}
                  placeholder={intl.formatMessage({ id: 'logistics.qingshurugongsijianjie' })}
                  maxLength={200}
                />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                name="companyPics"
                label={<RequireItem label={intl.formatMessage({ id: 'logistics.gongsizhaopian' })} />}
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
                    label={intl.formatMessage({ id: 'logistics.zizhirongyu' })}
                    brief={
                      <Tooltip placement="top" title={intl.formatMessage({ id: 'logistics.rushangbiaozhucezhengshu' })}>
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
                labelAlign="left"
                name="albumName"
                label={<RequireItem label={intl.formatMessage({ id: 'logistics.xuanchuanhuace' })} />}
                className={styles.revise_style}
              >
                <div className={styles.upload_data}>
                  {Object.keys(file).length > 0 && (
                    <div className={styles.upload_item}>
                      <div className={styles.upload_left}>
                        <LinkOutlined style={{ marginRight: '5px' }} />
                        <Typography.Link onClick={() => downloadFileByNameAndUrl(file.albumURL, file.albumName)}>
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
                      {intl.formatMessage({ id: 'logistics.shangchuanwenjian' })}
                    </Button>
                    <div style={{ marginTop: '8px' }}>
                      {intl.formatMessage({ id: 'logistics.yicishangchuanyigewenjian' })}
                    </div>
                  </Upload>
                )}
              </Form.Item>
              <Form.Item
                labelAlign="left"
                name="shopId"
                label={<RequireItem label={intl.formatMessage({ id: 'logistics.menhulianjie' })} />}
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
                      {intl.formatMessage({ id: 'logistics.dangqian' })}
                      {door}
                      {intl.formatMessage({ id: 'logistics.lianjie' })}:
                    </span>
                    <label>{resUrl}</label>
                    <CopyOutlined className={styles.copy_icon} onClick={() => handleCopyLinke(resUrl)} />
                  </div>
                )}
              </Form.Item>
            </TabPane>
            <TabPane tab={<TabFormErrors dot={badge[1]}>SEO</TabFormErrors>} key="2" forceRender>
              <Form.Item
                labelAlign="left"
                name="title"
                label={
                  <RequireItem
                    label={intl.formatMessage({ id: 'logistics.biaoti' })}
                    isRequire={true}
                    brief={
                      <Tooltip
                        placement="top"
                        title={intl.formatMessage({ id: 'logistics.yongyuxianshizaiyemiantitle' })}
                      >
                        <QuestionCircleOutlined />
                      </Tooltip>
                    }
                  />
                }
              >
                <Input
                  placeholder={intl.formatMessage({ id: 'logistics.zuichang100gezifu50ge' })}
                  maxLength={100}
                  className={styles.form_item}
                />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                name="description"
                label={
                  <RequireItem
                    label={intl.formatMessage({ id: 'logistics.miaoshu' })}
                    isRequire={true}
                    brief={
                      <Tooltip
                        placement="top"
                        title={intl.formatMessage({ id: 'logistics.yongyuxianshizaiyemiantitle' })}
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
                  placeholder={intl.formatMessage({ id: 'logistics.zuichang200gezifu100ge' })}
                  maxLength={200}
                />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                name="keywords"
                label={
                  <RequireItem
                    label={intl.formatMessage({ id: 'logistics.guanjianzi' })}
                    isRequire={true}
                    brief={
                      <Tooltip
                        placement="top"
                        title={intl.formatMessage({ id: 'logistics.yongyuxianshizaiyemiantitle' })}
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
                  placeholder={intl.formatMessage({ id: 'logistics.zuichang200gezifu100ge' })}
                  maxLength={200}
                />
              </Form.Item>
            </TabPane>
            <TabPane tab={intl.formatMessage({ id: 'logistics.shouyelunbotu' })} key="3" forceRender>
              <Form.Item
                labelAlign="left"
                name="slideshowBOList"
                label={<RequireItem label={intl.formatMessage({ id: 'logistics.shouyelunbotu' })} />}
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
                            {intl.formatMessage({ id: 'logistics.tiaozhuanlianjie' })}
                          </Typography.Text>
                          <Input
                            addonBefore={<Typography.Text type="secondary">http://</Typography.Text>}
                            onChange={(value) => handleInputIndexPicsItem(value, index)}
                            value={item.link}
                            placeholder={intl.formatMessage({ id: 'logistics.lunbotutiaozhuanlianjie' })}
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

          {/* <Form.Item
            label={<RequireItem label="" />}
          >
            <Button loading={confirmLoading} type="primary" style={{ marginRight: 16 }} onClick={handleSave}>保存</Button>
          </Form.Item> */}
        </Form>
      </div>
    </PageHeaderWrapper>
  )
}
export default LogisticsInfo
