import { UPLOAD_TYPE } from '@/constants'
import { GlobalConfig } from '@/global/config'
import { getAuth } from '@/utils/auth'

const { userId, memberId, accessToken } = getAuth() || {}

const UploadProps: any = {
  action: '/api/support/file/upload',
  data: {
    fileType: UPLOAD_TYPE,
  },
  headers: {
    userId,
    memberId,
    accessToken,
    source: '1',
    environment: '1',
    site: GlobalConfig.global.siteInfo.id.toString(),
  },
}

export default UploadProps
