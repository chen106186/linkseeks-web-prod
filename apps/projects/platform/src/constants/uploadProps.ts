import { UPLOAD_TYPE } from '@/constants'
import { authService } from '@apps/services'

const { userId, memberId, accessToken } = authService.getAuth() || {}

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
    site: import.meta.env.OUT_SITEID.toString(),
  },
}

export default UploadProps
