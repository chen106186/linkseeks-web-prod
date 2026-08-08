// blocks/cameraBinding.tsx
import { Button, Select, Input, Space, Tag, Spin, message, Empty, Form, Image } from '@linkseeks/ui'
import { useEffect, useState, useCallback } from 'react'
import { PlusOutlined, DeleteOutlined, ReloadOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { SingleCardUpload } from '@apps/components'
import {
  getCommodityWebCameraBindListByCommodity,
  postCommodityWebCameraBind,
  getCommodityWebCameraAvailableList,
  postCommodityWebCameraUnbind,
  postCommodityWebCameraCheckConnection,
} from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'

const CAMERA_STATUS_MAP = {
  0: { text: '未检测', color: 'default' },
  1: { text: '在线', color: 'green' },
  2: { text: '离线', color: 'red' },
  3: { text: '异常', color: 'orange' },
}

const CameraBinding = () => {
  const { id: commodityId } = usePageStatus()
  const formInstance = Form.useFormInstance()

  const [cameraList, setCameraList] = useState([])
  const [availableCameras, setAvailableCameras] = useState([])
  const [cameraLoading, setCameraLoading] = useState(false)
  const [showAddCamera, setShowAddCamera] = useState(false)
  const [newCameraId, setNewCameraId] = useState(undefined)
  const [newDirectionName, setNewDirectionName] = useState('')
  const [newSortOrder, setNewSortOrder] = useState(0)
  const [newCoverUrl, setNewCoverUrl] = useState('')
  const [addCameraLoading, setAddCameraLoading] = useState(false)

  const [formId, setFormId] = useState(commodityId)

  useEffect(() => {
    if (formInstance) {
      const id = formInstance.getFieldValue('id')
      if (id) {
        setFormId(id)
      }
    }
  }, [formInstance])

  const currentCommodityId = formId || commodityId

  const loadCameraList = useCallback(async () => {
    if (!currentCommodityId) return
    try {
      setCameraLoading(true)
      const res = await getCommodityWebCameraBindListByCommodity({
        commodityId: String(currentCommodityId),
      })
      const cameras = (res?.data || []).map((camera) => ({
        ...camera,
        coverUrl: camera.coverUrl || '',
      }))
      setCameraList(cameras)
    } catch (error) {
      console.error('加载摄像头列表失败:', error)
      message.error('加载摄像头列表失败')
    } finally {
      setCameraLoading(false)
    }
  }, [currentCommodityId])

  const loadAvailableCameras = useCallback(async () => {
    try {
      const res = await getCommodityWebCameraAvailableList()
      setAvailableCameras(
        (res?.data || []).map((item) => ({
          label: item.name,
          value: item.id,
        })),
      )
    } catch (error) {
      console.error('加载可用摄像头列表失败:', error)
    }
  }, [])

  useEffect(() => {
    if (currentCommodityId) {
      loadCameraList()
      loadAvailableCameras()
    }
  }, [currentCommodityId, loadCameraList, loadAvailableCameras])

  const handleBindCamera = async () => {
    if (!newCameraId) {
      message.warning('请选择摄像头')
      return
    }
    if (!newCoverUrl) {
      message.warning('请上传摄像头封面')
      return
    }
    try {
      setAddCameraLoading(true)
      await postCommodityWebCameraBind({
        commodityId: Number(currentCommodityId),
        cameraId: newCameraId,
        directionName: newDirectionName,
        sortOrder: newSortOrder || 0,
        coverUrl: newCoverUrl,
      })
      message.success('绑定成功')
      setShowAddCamera(false)
      setNewCameraId(undefined)
      setNewDirectionName('')
      setNewSortOrder(0)
      setNewCoverUrl('')
      await loadCameraList()
      await loadAvailableCameras()
    } catch (error) {
      console.error('绑定摄像头失败:', error)
      message.error('绑定摄像头失败')
    } finally {
      setAddCameraLoading(false)
    }
  }

  const handleUnbindCamera = async (id) => {
    try {
      await postCommodityWebCameraUnbind({ id })
      message.success('解绑成功')
      await loadCameraList()
      await loadAvailableCameras()
    } catch (error) {
      console.error('解绑摄像头失败:', error)
      message.error('解绑摄像头失败')
    }
  }

  const handleCheckConnection = async (cameraId) => {
    try {
      const res = await postCommodityWebCameraCheckConnection({ id: cameraId })
      if (res?.data) {
        message.success('摄像头连接正常')
      } else {
        message.error('摄像头连接异常')
      }
      await loadCameraList()
    } catch (error) {
      console.error('检测连接状态失败:', error)
      message.error('检测连接状态失败')
    }
  }

  if (!currentCommodityId) {
    return null
  }

  return (
    <div
      style={{
        marginBottom: 24,
        padding: '16px',
        backgroundColor: '#fff',
        borderRadius: '4px',
        border: '1px solid #f0f0f0',
      }}
    >
      <div
        style={{
          fontSize: '16px',
          fontWeight: 500,
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <VideoCameraOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
        摄像头管理
      </div>

      {cameraLoading && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Spin />
        </div>
      )}

      {!cameraLoading && (
        <div style={{ marginBottom: '16px' }}>
          {cameraList.length > 0 ? (
            <div style={{ border: '1px solid #e8e8e8', borderRadius: '4px', overflow: 'hidden' }}>
              {cameraList.map((camera, index) => (
                <div
                  key={camera.id}
                  style={{
                    padding: '16px',
                    borderBottom: index < cameraList.length - 1 ? '1px solid #f0f0f0' : 'none',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    {/* 封面图片 - 只读展示 */}
                    <div style={{ width: '120px', flexShrink: 0 }}>
                      {camera.coverUrl ? (
                        <Image
                          src={camera.coverUrl}
                          alt="摄像头封面"
                          width={120}
                          height={80}
                          style={{ objectFit: 'cover', borderRadius: '4px' }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 120,
                            height: 80,
                            border: '1px dashed #d9d9d9',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#fafafa',
                          }}
                        >
                          <span style={{ fontSize: '12px', color: '#999' }}>暂无封面</span>
                        </div>
                      )}
                    </div>

                    {/* 摄像头信息 */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <VideoCameraOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                        <span style={{ fontWeight: 500, marginRight: '12px', fontSize: '15px' }}>
                          {camera.cameraName}
                        </span>
                        {camera.directionName && <Tag color="blue">{camera.directionName}</Tag>}
                        <Tag color={CAMERA_STATUS_MAP[camera.cameraStatus]?.color || 'default'}>
                          {CAMERA_STATUS_MAP[camera.cameraStatus]?.text || '未知'}
                        </Tag>
                      </div>
                      <Space size="small">
                        <Button
                          size="small"
                          icon={<ReloadOutlined />}
                          onClick={() => handleCheckConnection(camera.cameraId)}
                        >
                          检测连接
                        </Button>
                        <Button
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleUnbindCamera(camera.id)}
                        >
                          解绑
                        </Button>
                      </Space>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty description="暂未绑定摄像头" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
      )}

      {!showAddCamera ? (
        <Button type="dashed" onClick={() => setShowAddCamera(true)} icon={<PlusOutlined />} block>
          新增摄像头
        </Button>
      ) : (
        <div
          style={{
            border: '1px solid #1890ff',
            borderRadius: '4px',
            padding: '16px',
            backgroundColor: '#e6f7ff',
          }}
        >
          <div
            style={{
              marginBottom: '12px',
              fontWeight: 500,
              color: '#1890ff',
              fontSize: '14px',
            }}
          >
            <PlusOutlined style={{ marginRight: '8px' }} />
            新增摄像头绑定
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '4px', fontSize: '13px' }}>
                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                选择摄像头
              </div>
              <Select
                placeholder="请选择要绑定的摄像头"
                style={{ width: '100%' }}
                value={newCameraId}
                onChange={setNewCameraId}
                options={availableCameras}
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
              />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '4px', fontSize: '13px' }}>方位名称</div>
              <Input
                placeholder="如：正面、侧面、背面"
                value={newDirectionName}
                onChange={(e) => setNewDirectionName(e.target.value)}
              />
            </div>

            <div style={{ width: '100px' }}>
              <div style={{ marginBottom: '4px', fontSize: '13px' }}>排序号</div>
              <Input
                type="number"
                placeholder="0"
                value={newSortOrder}
                onChange={(e) => setNewSortOrder(Number(e.target.value))}
              />
            </div>

            <div style={{ width: '120px' }}>
              <div style={{ marginBottom: '4px', fontSize: '13px' }}>
                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                封面图片
              </div>
              <SingleCardUpload maxSize={2} value={newCoverUrl} onChange={setNewCoverUrl} />
            </div>
          </div>

          <div>
            <Space>
              <Button
                type="primary"
                onClick={handleBindCamera}
                loading={addCameraLoading}
                disabled={!newCameraId || !newCoverUrl}
                icon={<PlusOutlined />}
              >
                确认绑定
              </Button>
              <Button
                onClick={() => {
                  setShowAddCamera(false)
                  setNewCameraId(undefined)
                  setNewDirectionName('')
                  setNewSortOrder(0)
                  setNewCoverUrl('')
                }}
              >
                取消
              </Button>
            </Space>
          </div>
        </div>
      )}
    </div>
  )
}

export default CameraBinding
