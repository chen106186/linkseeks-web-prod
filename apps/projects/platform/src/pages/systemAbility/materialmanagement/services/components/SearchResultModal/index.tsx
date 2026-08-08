import React, { useEffect, useState } from 'react'
import { Dropdown, Empty, Modal, Pagination } from 'antd'
import { useWebIntl } from '@apps/locales'
import { LinkIcon, MoreHorizontalIcon, FolderRemoveIcon } from '@linkseeks/icons'
import { downloadFileByNameAndUrl } from '@apps/utils'
import { getManageMaterialLibraryPage, GetManageMaterialLibraryPageResponseDetail } from '@apps/apis'
import { useMaterialContext } from '../../context'
import { fileTypeDom } from '../../../view'
import { linkCopyFun } from '../../utils'
import styles from '../../../index.less'

interface IProps {}

const SearchResultModal: React.FC<IProps> = (props) => {
  const { treeRef, globalSearchValue, setGlobalSearchValue, searchResultVisible, setSearchResultVisible } =
    useMaterialContext()
  const translate = useWebIntl()
  const [dataSource, setDataSource] = useState<GetManageMaterialLibraryPageResponseDetail[]>([]) // 列表数据
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(50)

  const fetchFileList = (page?: number, size?: number) => {
    getManageMaterialLibraryPage({
      current: String(page || current),
      pageSize: String(size || pageSize),
      name: globalSearchValue,
    }).then((res) => {
      if (res.code === 1000) {
        setDataSource(res.data.data)
      }
    })
  }

  useEffect(() => {
    if (globalSearchValue && searchResultVisible) {
      fetchFileList()
    }
  }, [globalSearchValue, searchResultVisible])

  const handlePaginationChange = (page: number, size: number) => {
    setCurrent(page)
    setPageSize(size)
    fetchFileList(page, size)
  }

  const handlePositionFile = (node: any, e) => {
    setSearchResultVisible(false)
    treeRef.current?.setExpandKeys(node.parentId)
    treeRef.current?.setSelectKeys([node.parentId])
    treeRef.current?.setSelectNode(node)
    treeRef.current?.setAutoExpandParent(true)
    treeRef.current.handleNodeClick({ id: node.parentId } as any, e)
  }

  return (
    <Modal
      open={searchResultVisible}
      title={translate('web.resource.mall.sousuojieguo')}
      width={730}
      onCancel={() => {
        setSearchResultVisible(false)
      }}
      footer={
        <div>
          <Pagination total={10} pageSize={10} size="small" onChange={handlePaginationChange} current={1} />
        </div>
      }
    >
      <div className={styles.list}>
        {dataSource.map((item: any, index: number) => (
          <div className={styles.listWarp} key={item.id || index}>
            <div className={styles.listItem}>
              <div className={[styles.Imgbox, item.cheboxUrl ? styles.ImgboxAtive : ''].join(' ')}>
                {fileTypeDom(item)}
                <div className={styles.iFunctions}>
                  <FolderRemoveIcon size={14} onClick={(e) => handlePositionFile(item, e)} />
                  <LinkIcon size={14} className={styles.moreIcon} onClick={() => linkCopyFun(item.url)} />
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'download',
                          label: (
                            <span onClick={() => downloadFileByNameAndUrl(item.url, item.name)}>
                              {translate('web.common.download')}
                            </span>
                          ),
                        },
                      ],
                    }}
                  >
                    <MoreHorizontalIcon className={styles.moreIcon} size={16} />
                  </Dropdown>
                </div>
              </div>
              <div className={styles.ImgText}>{item.name}</div>
            </div>
          </div>
        ))}

        {dataSource.length <= 0 && (
          <div className={styles.noData}>
            <Empty />
          </div>
        )}
      </div>
    </Modal>
  )
}

export default SearchResultModal
