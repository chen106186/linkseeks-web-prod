import React, { useState, Fragment, useMemo } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { Space, Upload, Input, Select, message, Dropdown, Tooltip, Empty, Modal } from 'antd'
import { PageHeaderWrapper, StandardTree } from '@apps/components'
import { Card, Button } from '@linkseeks/ui'
import { Pagination } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { useWebIntl } from '@apps/locales'
import { getOssUrlPath } from '@apps/constants'
import { LinkIcon, PackupIcon, PlusCircleIcon, SyncIcon, MoreHorizontalIcon } from '@linkseeks/icons'
import styles from './index.less'
import { UPLOAD_TYPE } from '@/constants'
import { postManageMaterialLibraryAdd, postManageMaterialLibraryBatchDel } from '@apps/apis'
import Zip from './img/Zip.png'
import Doc from './img/Doc.png'
import Xlsx from './img/Excel.png'
import PDF from './img/PDF.png'
import PPT from './img/PPT.png'
import Others from './img/Others.png'
import { MaterialProvider, useMaterialContext } from './services/context'
import useMaterial from './services/hooks/useMaterial'
import MenuModal from './services/components/MenuModal'
import FileMoveModal from './services/components/FileMoveModal'
import useNodeTools from './services/hooks/useNodeTools'
import useNodeClick from './services/hooks/useNodeClick'
// import useNodeDrag from './services/hooks/useNodeDrag'
import SearchResultModal from './services/components/SearchResultModal'
import { linkCopyFun } from './services/utils'

const { Option } = Select
const chebox = getOssUrlPath('/Images/xuanzhong.png')

type fromIpors = {
  name: string // 名字
  type: any // 类型
  current: number // 当前页
  pageSize: number // 页大小
}

export const fileTypeDom = (item) => {
  const { url } = item
  const extension = url.split('.').pop().toLowerCase()
  const fileTypeList = [
    {
      type: /^(webp|jpg|png|jpeg|JPG|PNG|JPEG|WEBP)$/,
      vNode: <img className={styles.Img} src={item.url} alt="" />,
    },
    {
      type: /^(doc|docx)$/,
      vNode: <img src={Doc} alt="" />,
    },
    {
      type: /^(xls|xlsx)$/,
      vNode: <img src={Xlsx} alt="" />,
    },
    {
      type: /^(zip|rar)$/,
      vNode: <img src={Zip} alt="" />,
    },
    {
      type: /^(mp4)$/,
      vNode: <video src={item.url} />,
    },
    {
      type: /^(ppt|pptx)$/,
      vNode: <img src={PPT} alt="" />,
    },
    {
      type: /^(pdf|pdfx)$/,
      vNode: <img src={PDF} alt="" />,
    },
  ]
  const checkFile = fileTypeList.find((i: any) => i.type.test(extension))

  if (checkFile) {
    return checkFile.vNode
  }
  return <img src={Others} alt="" />
}

const Materialmanagement: React.FC = () => {
  const intl = useIntl()
  const translate = useWebIntl()
  const {
    treeRef,
    menuForm,
    operateType,
    selectMaterialList,
    setSelectMaterialList,
    refreshData,
    setOperateType,
    setMenuModalVisible,
    setMoveModalVisible,
    setSearchResultVisible,
    setGlobalSearchValue,
    updateMaterial,
  } = useMaterialContext()
  const { saveLoading, addDirectory, updateDirectory } = useMaterial(treeRef)
  const { renderTools } = useNodeTools()
  const { handleClick } = useNodeClick()
  // const { onAllowDrop, onDragDrop } = useNodeDrag()

  const renderHeadTools = () => {
    const handleAddMenu = () => {
      setOperateType('Add')
      menuForm.resetFields()
      setMenuModalVisible(true)
    }

    const refresh = () => {
      treeRef.current.refreshTreeData()
    }

    const handleExpandAll = () => {
      treeRef.current.handleExpandAll()
    }

    return (
      <Space>
        <Tooltip title={translate('web.resource.system.tianjiamulu')}>
          <Button type="normal" className={styles['head-icon']} onClick={handleAddMenu}>
            <PlusCircleIcon onClick={handleAddMenu} size={18} className={styles['plus-icon']} />
          </Button>
        </Tooltip>
        <Tooltip title={translate('web.resource.system.shuaxinmulu')}>
          <Button type="normal" className={styles['head-icon']} onClick={refresh}>
            <SyncIcon size={16} />
          </Button>
        </Tooltip>
        <Tooltip title={translate('web.resource.system.shouqimulu')}>
          <Button type="normal" className={styles['head-icon']} onClick={handleExpandAll}>
            <PackupIcon size={16} />
          </Button>
        </Tooltip>
      </Space>
    )
  }

  /*提交数据 */
  const [searchForm, setSearchForm] = useState<fromIpors>({
    name: '', // 名字
    type: '', // 类型
    current: 1, // 当前页
    pageSize: 50, // 页大小
  })

  // 下拉
  const handleChange = (value) => {
    const data = { ...searchForm }
    data.type = value !== '0' ? value : undefined
    setSearchForm({ ...data })
  }
  // 点击选中的
  const setfalg = (item: any, index: number) => {
    const list = [...(selectMaterialList?.data || [])]
    list[index]['cheboxUrl'] = !list[index]['cheboxUrl'] ? chebox : ''
    const flag = list.some((i) => i['cheboxUrl'])
    setSelectMaterialList({
      totalCount: selectMaterialList?.totalCount || 0,
      data: list,
    })
  }

  /**
   * 上传大小限制
   * */
  const beforeDocUpload = (file: any) => {
    const isLt50M = file.size / 1024 / 1024 < 50
    if (!isLt50M) {
      message.error(translate('web.common.shangchuangbuchaoguo', { size: '50M' }))
    }
    return isLt50M
  }
  /**
   * 新增
   * */
  const handleFrontUrl = async ({ fileList }) => {
    if (fileList[0].response) {
      if (fileList[0].response.code === 1000) {
        let fileType: any = 3
        const isJpgOrPng =
          fileList[0].type === 'image/jpeg' || fileList[0].type === 'image/png' || fileList[0].type === 'image/jpg'
        if (isJpgOrPng) {
          fileType = 1
        }
        switch (fileList[0].type) {
          case 'video/mp4':
            fileType = 2
            break
        }
        if (treeRef.current.selectNode?.id) {
          const res = await postManageMaterialLibraryAdd({
            parentId: Number(treeRef.current.selectNode.id),
            name: fileList[0].name,
            url: fileList[0].response.data,
            type: fileType,
          })
          if (res.code === 1000) {
            if (selectMaterialList) {
              updateMaterial(String(treeRef.current.selectNode.id))
            }
          }
        }
      } else {
        message.error(fileList[0].response.message)
      }
    }
    if (fileList[0].status !== 'done') {
      return
    }
  }
  /**
   * 删除
   * */
  const del = async () => {
    Modal.confirm({
      title: translate('web.resource.system.shifoushanchuxuanzhongdewenjian'),
      onOk: async () => {
        const idList: number[] = []
        selectMaterialList?.data.find((item: any) => {
          if (item.cheboxUrl) {
            idList.push(item.id)
          }
        })
        const res = await postManageMaterialLibraryBatchDel({ idList: idList })
        if (res.code === 1000) {
          if (treeRef.current.selectNode?.id) {
            updateMaterial(String(treeRef.current.selectNode.id))
          }
        }
      },
    })
  }

  /**
   * 搜索
   * */
  const search = () => {
    if (treeRef.current.selectNode?.id) {
      updateMaterial(String(treeRef.current.selectNode.id), searchForm)
    }
  }

  /**
   * 设置搜索值
   * */
  const setvalue = (e, name) => {
    const value = e.target.value
    searchForm[name] = value
    setSearchForm({ ...searchForm })
  }

  const handlePaginationChange = (current: number, pageSize: number) => {
    searchForm.current = current === 0 ? 1 : current
    searchForm.pageSize = pageSize
    setSearchForm({ ...searchForm })
    if (treeRef.current.selectNode?.id) {
      updateMaterial(String(treeRef.current.selectNode.id), searchForm)
    }
  }

  const download = (url, fileName) => {
    const x = new XMLHttpRequest()
    x.open('GET', url, true)
    x.responseType = 'blob'
    x.onload = function () {
      const _url = window.URL.createObjectURL(x.response)
      const a = document.createElement('a')
      a.href = _url
      a.download = fileName
      a.click()
    }
    x.send()
  }

  const handleOk = (name: string) => {
    switch (operateType) {
      case 'Add':
      case 'AddChild':
        const parentId = operateType === 'AddChild' ? Number(treeRef.current.selectNode?.id || 0) : 0
        addDirectory({
          name,
          parentId,
          type: 4,
        }).then(() => {
          setMenuModalVisible(false)
          treeRef.current.refreshTreeData()
        })
        break
      case 'EditMenu':
        if (treeRef.current.selectNode) {
          updateDirectory({
            id: Number(treeRef.current.selectNode.id),
            name,
          }).then(() => {
            setMenuModalVisible(false)
            treeRef.current.refreshTreeData()
          })
        }
        break
      default:
        break
    }
  }

  const handleGlobalSearch = (value: string) => {
    if (value) {
      setGlobalSearchValue(value)
      setSearchResultVisible(true)
    }
  }

  const showControlButtons = useMemo(() => {
    if (selectMaterialList && selectMaterialList.data && selectMaterialList.data.length > 0) {
      return selectMaterialList.data.some((item) => item['cheboxUrl'])
    }
    return false
  }, [selectMaterialList])

  return (
    <PageHeaderWrapper
      extra={
        <Input.Search
          allowClear
          onSearch={handleGlobalSearch}
          placeholder={translate('web.resource.system.quanjusousuo')}
        />
      }
    >
      <StandardTree
        request={() => refreshData()}
        height="78vh"
        enableSearch
        searchPlaceholder={translate('web.resource.system.sousuowenjianjia')}
        treeRef={treeRef}
        treeClassName={styles['material-tree']}
        title={translate('web.resource.system.xuanzemulu')}
        // onAllowDrop={onAllowDrop}
        // onDragDrop={onDragDrop}
        headTools={renderHeadTools}
        renderTools={renderTools}
        handleNodeClick={handleClick}
        autoHideTools
      >
        <Card style={{ marginLeft: 16, flex: 1, width: 0 }}>
          {selectMaterialList && (
            <Fragment>
              <div className={styles.head}>
                <div className={styles.left}>
                  <Upload
                    action="/api/support/file/upload"
                    data={{ fileType: UPLOAD_TYPE }}
                    showUploadList={false}
                    beforeUpload={beforeDocUpload}
                    onChange={handleFrontUrl}
                    maxCount={1}
                    accept=".jpeg,.jpg,.png,.gif,.bmp,.tiff,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt,.csv,.rar,.zip"
                  >
                    <Button type="primary">
                      <UploadOutlined /> {intl.formatMessage({ id: 'components.shangchuanwenjian' })}
                    </Button>
                  </Upload>
                  {showControlButtons && (
                    <Space>
                      <Button
                        className={styles.del}
                        onClick={() => {
                          setMoveModalVisible(true)
                        }}
                      >
                        {translate('web.common.move')}
                      </Button>
                      <Button className={styles.del} onClick={del}>
                        {intl.formatMessage({ id: 'saleOrder.delete' })}
                      </Button>
                    </Space>
                  )}
                </div>
                <div className={styles.right}>
                  <Space>
                    <Input
                      style={{ width: 240 }}
                      placeholder={translate('web.common.search')}
                      allowClear
                      onChange={(e) => setvalue(e, 'name')}
                    />
                    <Select defaultValue={translate('web.common.all')} style={{ width: 120 }} onChange={handleChange}>
                      <Option value="0">{translate('web.common.all')}</Option>
                      <Option value="1">{translate('web.common.tupian')}</Option>
                      <Option value="2">{translate('web.common.shipin')}</Option>
                      <Option value="3">{translate('web.common.wenjian')}</Option>
                    </Select>
                    <Button type="primary" onClick={search}>
                      {translate('web.common.chaxun')}
                    </Button>
                  </Space>
                </div>
              </div>
              <div className={styles.list}>
                {selectMaterialList.data &&
                  selectMaterialList.data.length > 0 &&
                  selectMaterialList.data.map((item: any, index: number) => (
                    <div className={styles.listWarp} key={item.id || index}>
                      <div className={styles.listItem}>
                        <div className={[styles.Imgbox, item.cheboxUrl ? styles.ImgboxAtive : ''].join(' ')}>
                          {fileTypeDom(item)}
                          <div className={styles.checkboxWrap} onClick={() => setfalg(item, index)}>
                            {item.cheboxUrl && (
                              <img className={styles.cheboxUrl} src={item.cheboxUrl} alt={item.name} />
                            )}
                          </div>
                          <div className={styles.iFunctions}>
                            <LinkIcon size={14} onClick={() => linkCopyFun(item.url)} />
                            <Dropdown
                              menu={{
                                items: [
                                  {
                                    key: 'download',
                                    label: (
                                      <span onClick={() => download(item.url, item.name)}>
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

                {selectMaterialList.data.length <= 0 && (
                  <div className={styles.noData}>
                    <Empty />
                  </div>
                )}
              </div>
              <div className={styles.Pagination}>
                <Pagination
                  total={selectMaterialList.totalCount}
                  pageSize={searchForm.pageSize}
                  onChange={handlePaginationChange}
                  current={searchForm.current}
                />
              </div>
            </Fragment>
          )}
        </Card>
      </StandardTree>
      <MenuModal confirmLoading={saveLoading} onOk={handleOk} />
      <FileMoveModal />
      <SearchResultModal />
    </PageHeaderWrapper>
  )
}

export default () => (
  <MaterialProvider>
    <Materialmanagement />
  </MaterialProvider>
)
