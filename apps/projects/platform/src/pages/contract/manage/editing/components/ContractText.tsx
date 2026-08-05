import React, { useState, useEffect, forwardRef } from 'react'
import { Button, Select, Form, Checkbox, message, Upload } from 'antd'

import styles from '../index.less'
import { UPLOAD_TYPE } from '@/constants'
import { FileWordFilled } from '@ant-design/icons'
import {
  getContractContractTemplateGet,
  getContractContractTemplatePage,
  postContractSignatureContractCreate,
} from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { downloadFileByNameAndUrl } from '@apps/utils'
const intl = getIntl()
const ContractText = (props: any) => {
  const { currentRef, ctText, memberId, roleId, basicsVO, currency, purchaseMate, picker, Price } = props
  const [TemplatePage, setTemplatePage] = useState<any>([])
  const [Templatel, setTemplatel] = useState<any>({})
  const [checkNick, setCheckNick] = useState(true)
  const [, setRefresh] = useState<boolean>(false)
  /* 第四个tab */
  const onCheckboxChange = (e: { target: { checked: boolean } }) => {
    setCheckNick(e.target.checked)
  }
  const getCommodity = (e) => {
    getContractContractTemplateGet({ id: e }).then((res) => {
      setTemplatel(res.data)
    })
  }
  /* 获取合同详情数据 */
  const contractTemplate = () => {
    const data: any = {
      current: 1,
      pageSize: 99,
    }
    getContractContractTemplatePage(data)
      .then((res) => {
        console.log(res)
        const list = []
        res.data.data.find((item: any) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          item.version != null ? item.version : ''
          if (item.state == 1) {
            list.push({
              label: item.name + item.version,
              value: item.id,
              id: item.id,
            })
          }
        })
        setTemplatePage(list)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  useEffect(() => {
    currentRef.current = {
      get: () =>
        new Promise((resolve: any) => {
          const contractText = {
            id: Templatel.T_emplateId ? Templatel.T_emplateId : 0,
            templateId: Templatel.templateId ? Templatel.templateId : Templatel.id,
            isUseElectronicContract: checkNick ? 1 : 0,
            contractName: Templatel.fileName,
            contractUrl: Templatel.fileUrl || Templatel.contractUrl || Templatel.fileExampleUrl,
          }
          resolve(contractText)
        }),
    }
  })
  useEffect(() => {
    contractTemplate()
  }, [])
  useEffect(() => {
    if (ctText != null) {
      ctText.fileName = ctText.contractName
      ctText.T_emplateId = ctText.id
      ctText.id = ctText.templateId
      setCheckNick(ctText.isUseElectronicContract ? true : false)
      setTemplatel(ctText)
      console.log(ctText, 1313131)
    }
  }, [ctText])
  /**判断文件类型和大小 */
  const beforeDocUpload = (file: any) => {
    const isLt20M = file.size / 1024 / 1024 < 20
    if (!isLt20M) {
      message.error(intl.formatMessage({ id: 'contract.shangchuanwenjiandaxiaobuchao' }))
    }
    return isLt20M
  }
  // 上传回调
  const handleChange = ({ fileList }) => {
    if (fileList[0].response) {
      console.log(fileList[0].name, fileList[0].response.data)
      if (fileList[0].response.code === 1000) {
        Templatel.fileName = fileList[0].name
        Templatel.contractUrl = fileList[0].response.data
        setTemplatel({ ...Templatel })
        setRefresh(true)
      }
    }
  }
  /* 生成电子合同 */
  const generate = async () => {
    const purchaseMaterielList = (await purchaseMate.current.length) != 0 ? await purchaseMate.current.get() : []
    if (!Templatel.id) {
      message.info(intl.formatMessage({ id: 'contract.qingxianxuanzehetongmoban' }))
    } else if (!purchaseMaterielList?.data?.list?.length) {
      message.warning('请选择采购物料')
    } else {
      const param = {
        contractTemplateId: Templatel.id,
        memberId,
        roleId,
        purchaseMaterielList: purchaseMaterielList?.data?.list,
        basicsVO: { ...basicsVO, ...currency, ...picker, totalAmount: Price },
      }
      postContractSignatureContractCreate(param).then((res) => {
        console.log(res)
        if (res.code == 1000) {
          const Temp = Templatel
          Temp.contractName = res.data.contractName
          Temp.fileName = res.data.contractName
          Temp.name = res.data.contractName
          Temp.fileUrl = res.data.contractUrl
          setTemplatel(Temp)
          setRefresh(true)
        }
      })
    }
  }

  /**下载 */
  const onDownload = () => {
    downloadFileByNameAndUrl(Templatel.url, Templatel.name)
  }

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <Form.Item label={intl.formatMessage({ id: 'contract.hetongmuban' })} labelAlign="left" labelCol={{ span: 2 }}>
        <Select
          value={Templatel.id}
          style={{ width: 600 }}
          options={TemplatePage}
          placeholder={intl.formatMessage({ id: 'contract.qingxuanzehetongmuban' })}
          onChange={(e) => getCommodity(e)}
        ></Select>

        <Button type="link" onClick={() => generate()}>
          {intl.formatMessage({ id: 'contract.shengchenghetong' })}
        </Button>
      </Form.Item>
      {Object.keys(Templatel).length != 0 && (
        <Form.Item label={intl.formatMessage({ id: 'contract.hetongwenben' })} labelAlign="left" labelCol={{ span: 2 }}>
          <div className={styles.upload_item} style={{ width: 680 }}>
            <div className={styles.upload_left} style={{ width: 600 }} onClick={() => onDownload()}>
              <FileWordFilled />
              <span>{Templatel.fileName}</span>
            </div>
            <Upload
              action="/api/support/file/upload"
              data={{ fileType: UPLOAD_TYPE }}
              showUploadList={false}
              beforeUpload={beforeDocUpload}
              onChange={handleChange}
              accept=".doc,.docx"
              maxCount={1}
            >
              <div className={styles.uploadIconBtn}>
                <Button type="link">{intl.formatMessage({ id: 'contract.shangchuanhetong' })}</Button>
              </div>
            </Upload>
          </div>
        </Form.Item>
      )}
      <Form.Item label={intl.formatMessage({ id: 'contract.dianzihetong' })} labelAlign="left" labelCol={{ span: 2 }}>
        <Checkbox checked={checkNick} onChange={onCheckboxChange}>
          {intl.formatMessage({ id: 'contract.shiyongdianzihetong' })}
        </Checkbox>
      </Form.Item>
    </div>
  )
}

export default forwardRef(ContractText)
