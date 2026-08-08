import React from 'react'
import { FilePdfFilled, FileWordFilled, FileFilled } from '@ant-design/icons'
import styles from './index.less'
import { getIntl } from '@linkseeks/i18n'

interface ContractItemType {
  electronicContractUrl?: string
  electronicContractName?: string
}

interface ContractListType {
  dataSource: ContractItemType[]
}

const IconMap = {
  '.pdf': <FilePdfFilled />,
  '.doc': <FileWordFilled />,
  '.doxc': <FileWordFilled />,
}
const intl = getIntl()
const ContractItem: React.FC<ContractItemType> = ({ electronicContractUrl, electronicContractName }) => {
  const index1 = electronicContractUrl.lastIndexOf('.')
  const suffix = electronicContractUrl.slice(index1)
  const index2 = electronicContractUrl.lastIndexOf('/')
  // 如果没有文件名，但是有链接就从链接截取文件名
  const fileName = electronicContractName ? electronicContractName : electronicContractUrl.slice(index2 + 1)

  const handleDownload = (name, url) => {
    // window.location.href = `/api/order/contractTemplate/downloadContract?contractName=${name}&fileUrl=${url}`
    window.location.href = url
  }

  return (
    <li className={styles['contractList-item']} onClick={() => handleDownload(fileName, electronicContractUrl)}>
      <a>
        <div className={styles['contractList-item-icon']}>{IconMap[suffix] || <FileFilled />}</div>
        <div className={styles['contractList-item-name']} title={fileName}>
          {fileName}
        </div>
      </a>
    </li>
  )
}

const ContractList: React.FC<ContractListType> = ({ dataSource }) => {
  if (!Array.isArray(dataSource)) {
    return (
      <div className={styles.noData}>{intl.formatMessage({ id: 'transaction_components.meiyouxiangguanshuju' })}</div>
    )
  }

  return (
    <ul className={styles.contractList}>
      {dataSource.map((item, index) => (
        <ContractItem
          key={index}
          electronicContractUrl={item.electronicContractUrl}
          electronicContractName={item.electronicContractName}
        />
      ))}
    </ul>
  )
}

export default ContractList
