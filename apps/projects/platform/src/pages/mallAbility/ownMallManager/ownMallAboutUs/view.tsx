import { useEffect, useState, useRef } from 'react'
import { Form, Button, Select, Input, Tooltip, Row, Col, message } from 'antd'
import { RequireItem } from '@apps/components'
import { Card } from '@linkseeks/ui'
import { useIntl, getIntl } from '@linkseeks/i18n'
import { usePrompt } from '@linkseeks/router-core'
import { CopyOutlined, SaveOutlined } from '@ant-design/icons'
import { validatorByte } from '@/utils/regExp'
import { PageHeaderWrapper } from '@apps/components'
import copy from 'copy-to-clipboard'
import CitySelect from '@/components/CitySelect'
import ImgUpload, { imgUploadRefProps } from '@/components/ImgUpload'
import UploadFiles from '@/pages/transaction/components/uploadFiles'
import { useLocalStore, observer } from 'mobx-react'
import { store } from '@/store'
import {
  getCommodityWebMemberSelfWebFindCurrMemberSelf,
  postCommodityWebMemberSelfWebSaveCurrMemberSelf,
  getCommodityWebShopWebFindWebEnterpriseSelfShop,
} from '@apps/apis'
import styles from './index.less'
import { getMallLink } from '@apps/utils'
import isEmpty from 'lodash/isEmpty'
import { useGlobal } from '@apps/container'

const layout: any = {
  colon: false,
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  labelAlign: 'left',
}

const otherLayout: any = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
}

const tabLink = [
  { key: '1', label: getIntl().formatMessage({ id: 'own.about.tab.item_1' }) },
  { key: '2', label: getIntl().formatMessage({ id: 'own.about.tab.item_2' }) },
  { key: '3', label: getIntl().formatMessage({ id: 'own.about.tab.item_3' }) },
  { key: '4', label: getIntl().formatMessage({ id: 'own.about.tab.item_4' }) },
]

const handleCopyLinke = (link: string) => {
  if (copy(link)) {
    message.success(getIntl().formatMessage({ id: 'shop.option.copy.success' }))
  }
}

const OwnMallAboutUs = () => {
  const { siteId } = useGlobal()

  const workshopImgRef = useRef<imgUploadRefProps>()
  const honorImgRef = useRef<imgUploadRefProps>()

  const [form] = Form.useForm()

  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [isFormChange, setIsFormChange] = useState<boolean>(false)
  const [albumUrls, setAlbumUrls] = useState<any[]>([])
  const [allMallList, setAllMallList] = useState<any[]>([])
  const [selectCityData, setSelectCityData] = useState<any>([])
  const [mallUrl, setMallUrl] = useState<string>()
  const intl = useIntl()

  usePrompt({
    when: isFormChange,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })

  const getAlbumUrls = (data) => {
    setAlbumUrls(data)
    form.setFieldsValue({
      albumUrls: data,
    })
  }

  const removeAlbumUrls = (index) => {
    const files = [...albumUrls]
    files.splice(index, 1)
    setAlbumUrls(files)
    form.setFieldsValue({
      albumUrls: files,
    })
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

  // 额外处理商城链接
  const selectMall = (url: string) => {
    const mallLink = getMallLink(url, form.getFieldValue('memberId'))
    setMallUrl(mallLink)
    form.setFieldsValue({
      url,
    })
  }

  // 提交
  const onSave = () => {
    form.validateFields().then((values) => {
      const { albumUrls, ...rest } = values
      const params = {
        ...rest,
        albumName: albumUrls?.[0]?.name,
        albumUrl: albumUrls?.[0]?.url,
      }
      setSaveLoading(true)
      postCommodityWebMemberSelfWebSaveCurrMemberSelf(params)
        .then((res) => {
          if (res.code === 1000) {
            setIsFormChange(false)
          }
        })
        .finally(() => {
          setSaveLoading(false)
        })
    })
  }

  // 根据站点获取自营商城
  const getAllMallList = () => {
    getCommodityWebShopWebFindWebEnterpriseSelfShop({ siteId: String(siteId) }).then((res) => {
      if (res.code === 1000) {
        const data = res.data.map((item) => {
          return {
            label: item.name,
            value: item.id,
            url: item.url,
            type: item.type,
          }
        })
        setAllMallList(data)
        selectMall(data[0].url)
      }
    })
  }

  const initAreaList = (data) => {
    if (!isEmpty(data)) {
      return data.map((item, index) => {
        item.index = index
        return item
      })
    } else {
      return []
    }
  }

  // 获取自营商城关于我们详情
  const getAboutUsInfo = () => {
    getCommodityWebMemberSelfWebFindCurrMemberSelf().then((res) => {
      const { code, data } = res
      if (code === 1000 && data) {
        const { albumName, albumUrl, honorPics, workshopPics, ...rest } = data
        const newAlbumUrls = albumName && albumUrl ? [{ name: albumName, url: albumUrl }] : []

        workshopPics && workshopImgRef.current?.setData(workshopPics)
        honorPics && honorImgRef.current?.setData(honorPics)
        form.setFieldsValue({
          ...rest,
          albumUrls: newAlbumUrls,
        })

        setIsFormChange(false)
        setAlbumUrls(newAlbumUrls)
        setSelectCityData(initAreaList(rest.areaList))
        getAllMallList()
      }
    })
  }

  useEffect(() => {
    getAboutUsInfo()
  }, [])

  return (
    <PageHeaderWrapper
      items={tabLink}
      extra={
        <Button key="1" type="primary" icon={<SaveOutlined />} onClick={onSave} loading={saveLoading}>
          {intl.formatMessage({ id: 'common.button.save' })}
        </Button>
      }
    >
      <Form {...layout} form={form} onValuesChange={() => setIsFormChange(true)}>
        <Card id="1" title={intl.formatMessage({ id: 'own.about.tab.item_1' })} style={{ marginBottom: 16 }}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="memberId" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                name="describe"
                label={intl.formatMessage({ id: 'shop.form.label.describe' })}
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'shop.form.describe.required' }) },
                  { validator: (r, v, c) => validatorByte(r, v, c, 400) },
                ]}
              >
                <Input.TextArea rows={3} placeholder={intl.formatMessage({ id: 'purchase.zuichang400gezifu200ge' })} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="areaList"
                label={intl.formatMessage({ id: 'own.about.form.memberShopAreas' })}
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'own.about.form.memberShopAreas.required' }) },
                ]}
              >
                <CitySelect
                  selectData={selectCityData}
                  onAdd={handleAddNewCitySelect}
                  onReduce={handleReduceCitySelect}
                  onChange={handleCityChange}
                  showUnderAddBtn={true}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.formatMessage({ id: 'own.about.form.mall.link' })}>
                <Form.Item name="shopId">
                  <Select
                    placeholder={intl.formatMessage({ id: 'own.about.form.mall.link.select' })}
                    allowClear
                    options={allMallList}
                    onChange={(value, option) => selectMall(option.url)}
                  />
                </Form.Item>
                <Form.Item name="url">
                  <div className={styles.mallLink}>
                    <span>{intl.formatMessage({ id: 'own.about.form.mall.link.current' })}: </span>
                    <span className={styles.link} title={mallUrl}>
                      {mallUrl || '-'}
                    </span>
                    {mallUrl && (
                      <Tooltip title={intl.formatMessage({ id: 'common.button.copay' })}>
                        <CopyOutlined className={styles.copy_icon} onClick={() => handleCopyLinke(mallUrl)} />
                      </Tooltip>
                    )}
                  </div>
                </Form.Item>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label={<RequireItem label={intl.formatMessage({ id: 'shop.form.label.phone' })} />}
                rules={[
                  {
                    max: 20,
                    message: `${intl.formatMessage({ id: 'common.text.most' })}20${intl.formatMessage({
                      id: 'common.unit.individual.character',
                    })}`,
                  },
                ]}
              >
                <Input placeholder={intl.formatMessage({ id: 'shop.form.label.phone.placeholder' })} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                label={<RequireItem label={intl.formatMessage({ id: 'shop.form.label.address' })} />}
                rules={[{ validator: (r, v, c) => validatorByte(r, v, c, 100) }]}
              >
                <Input placeholder={intl.formatMessage({ id: 'shop.form.label.address.placeholder' })} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card id="2" title={intl.formatMessage({ id: 'own.about.tab.item_2' })} style={{ marginBottom: 16 }}>
          <Form.Item name="workshopPics" label={intl.formatMessage({ id: 'own.about.tab.item_2' })} {...otherLayout}>
            <ImgUpload
              ref={workshopImgRef}
              maxCount={10}
              maxSize={1}
              fileType={['image/jpeg', 'image/png', 'image/jpg']}
              imgSizeText="1200x800"
            />
          </Form.Item>
        </Card>
        <Card id="3" title={intl.formatMessage({ id: 'own.about.tab.item_3' })} style={{ marginBottom: 16 }}>
          <Form.Item name="honorPics" label={intl.formatMessage({ id: 'own.about.tab.item_3' })} {...otherLayout}>
            <ImgUpload
              ref={honorImgRef}
              maxCount={10}
              maxSize={1}
              fileType={['image/jpeg', 'image/png', 'image/jpg']}
              imgSizeText="1200x800"
            />
          </Form.Item>
        </Card>
        <Card id="4" title={intl.formatMessage({ id: 'own.about.tab.item_4' })} style={{ marginBottom: 16 }}>
          <Form.Item
            name="albumUrls"
            label={intl.formatMessage({ id: 'own.about.tab.item_4' })}
            {...otherLayout}
            wrapperCol={{ span: 12 }}
          >
            <UploadFiles
              accept=".pdf"
              size={50}
              fileList={albumUrls}
              onChange={getAlbumUrls}
              onRemove={removeAlbumUrls}
              visible={albumUrls.length === 0}
            />
          </Form.Item>
        </Card>
      </Form>
    </PageHeaderWrapper>
  )
}

export default observer(OwnMallAboutUs)
