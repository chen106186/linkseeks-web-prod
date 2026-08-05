import React, { useEffect, useState, useContext } from 'react'
import { Modal, Form, Input, Button, Upload, message } from 'antd'
import { UploadOutlined, LinkOutlined, DeleteOutlined } from '@ant-design/icons'
import UploadProps from '@/constants/uploadProps'
import style from './index.less'
import { BidDetailContext } from '../components/context'
import { isEmpty, sumBy } from 'lodash'
import { postPurchaseConfirmQuotedPriceSubmitContrastPrice } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'

const { TextArea } = Input

const intl = getIntl()
export interface IProps {
  id: number
  turn: number
  visible: boolean
  handleConfirm: () => void
  onCancel: () => void
}

const BidModal: React.FC<IProps> = (props: any) => {
  const [form] = Form.useForm()
  const { id, turn, visible, handleConfirm, onCancel } = props
  const [files, setFiles] = useState([])
  const [loading, setloading] = useState(false)
  const [priceParityInfos, setPriceParityInfos] = useState<any>([])
  const dataSource = useContext(BidDetailContext)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  /**判断文件类型和大小 */
  const beforeDocUpload = (file: any) => {
    const isLt20M = file.size / 1024 / 1024 < 20
    if (!isLt20M) {
      message.error(intl.formatMessage({ id: 'detail.purchase.message21' }))
    }
    return isLt20M
  }
  // 上传回调
  const handleChange = ({ file }) => {
    const arr: any = files
    setloading(true)
    if (file.response) {
      if (file.response.code === 1000) {
        arr.push({
          name: file.name,
          url: file.response.data,
        })
        setloading(false)
      }
    }
    setFiles([...arr])
  }
  // 删除附件
  const removeFiles = (index: any) => {
    const arr = [...files]
    arr.splice(index, 1)
    setFiles(arr)
  }

  useEffect(() => {
    if (dataSource.length > 0) {
      const arr: any = dataSource[0].company || []
      const params: any = []
      arr.forEach((it: any, idx: number) => {
        let item = {
          awardCount: it.awardCount,
          id: it.id,
          memberId: it.memberId,
          memberName: it.memberName,
          memberRoleId: it.memberRoleId,
          minimum: it.minimum,
          ranking: it.ranking,
          subtotal: it.subtotal,
          sumPrice: it.sumPrice,
          awardInfoResponses: [],
        }
        let awardInfoResponses = []
        dataSource.forEach((item: any, index: number) => {
          let cItem = {
            brand: item.brand,
            category: item.category,
            goodsId: item.goodsId,
            unit: item.unit,
            model: item.model,
            name: item.name,
            number: item.number,
            purchaseCount: item.purchaseCount,
            awardTaxProbability: item.company[idx].awardTaxProbability,
            taxPrice: item.company[idx].taxPrice,
            taxProbability: item.company[idx].taxProbability,
            taxUnitPrice: item.company[idx].taxUnitPrice,
            isPrize: item.company[idx].isPrize,
            isTax: item.company[idx].isTax,
            id: item.company[idx].itemId,
          }
          awardInfoResponses.push(cItem)
        })
        item.awardInfoResponses = awardInfoResponses
        params.push(item)
      })
      console.log(params, 'params')
      setPriceParityInfos(params)
    }
    console.log(dataSource, 'dataSource')
  }, [visible])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const params = {
        id,
        turn,
        awardComments: values.awardComments,
        urls: files,
        priceParityInfos,
      }
      if (isEmpty(priceParityInfos)) {
        message.warning(intl.formatMessage({ id: 'detail.purchase.message82' }))
        return
      }
      for (let i = 0; i < dataSource.length; i++) {
        const count = sumBy(dataSource[i].company, 'awardTaxProbability')
        console.log(count, dataSource[i])
        if (count > 100 || count < 100) {
          message.warning(`${dataSource[i].number}${intl.formatMessage({ id: 'detail.purchase.message83' })}`)
          return
        }
      }
      setConfirmLoading(true)
      postPurchaseConfirmQuotedPriceSubmitContrastPrice({ ...params }, { ctlType: 'none' }).then((res) => {
        if (res.code !== 1000) {
          message.error(intl.formatMessage({ id: res.code }))
          setConfirmLoading(false)
          return
        }
        setConfirmLoading(false)
        handleConfirm()
      })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  return (
    <Modal
      title={intl.formatMessage({ id: 'detail.purchase.submit' })}
      visible={visible}
      width={600}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      onOk={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="awardComments" label={intl.formatMessage({ id: 'detail.purchase.signUpIdea' })}>
          <TextArea />
        </Form.Item>
        <Form.Item label={intl.formatMessage({ id: 'detail.purchase.file' })} name="upload">
          <div className={style.upload_data}>
            {files.length > 0 &&
              files.map((v, index) => (
                <div key={index} className={style.upload_item}>
                  <div className={style.upload_left}>
                    <LinkOutlined />
                    <span>{v.name}</span>
                  </div>
                  <div className={style.upload_right} onClick={() => removeFiles(index)}>
                    <DeleteOutlined />
                  </div>
                </div>
              ))}
          </div>
          <Upload
            {...UploadProps}
            showUploadList={false}
            accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx"
            beforeUpload={beforeDocUpload}
            onChange={handleChange}
          >
            <Button loading={loading} icon={<UploadOutlined />}>
              {intl.formatMessage({ id: 'detail.purchase.uploadFile' })}
            </Button>
            <div style={{ marginTop: '8px' }}>{intl.formatMessage({ id: 'detail.purchase.placeholder2' })}</div>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default BidModal
