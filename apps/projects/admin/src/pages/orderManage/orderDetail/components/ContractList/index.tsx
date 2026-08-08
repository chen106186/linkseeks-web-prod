import React from 'react'
import { FilePdfFilled, FileWordFilled, FileFilled } from '@ant-design/icons'
import styles from './index.less'
import { history } from '@linkseeks/router-manager'
interface ContractItem {
  electronicContractUrl?: string
  electronicContractName?: string
}

interface ContractList {
  dataSource: ContractItem[] | null
}

const IconMap = {
  '.pdf': <FilePdfFilled />,
  '.doc': <FileWordFilled />,
  '.doxc': <FileWordFilled />,
}

const ContractItem: React.FC<ContractItem> = ({ electronicContractUrl, electronicContractName }) => {
  const index1 = electronicContractUrl?.lastIndexOf('.')
  const suffix = electronicContractUrl?.slice(index1) || ''
  const index2 = electronicContractUrl?.lastIndexOf('/') || -1
  // 如果没有文件名，但是有链接就从链接截取文件名
  const fileName = electronicContractName ? electronicContractName : electronicContractUrl?.slice(index2 + 1)

  const handleDownload = (name, url) => {
    history.push(`/api/order/contractTemplate/downloadContract?contractName=${name}&fileUrl=${url}`)
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

const ContractList: React.FC<ContractList> = ({ dataSource }) => {
  if (!Array.isArray(dataSource)) {
    return <div className={styles.noData}>没有相关数据~</div>
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
