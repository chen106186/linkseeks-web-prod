export const FILTER_TYPE_LIMIT = [
  'txt',
  'doc',
  'docx',
  'jpg',
  'png',
  'gif',
  'mp4',
  'avi',
  'wmv',
  'wma',
  'xls',
  'xlsx',
  'ppt',
  'pdf',
  'zip',
  'rar',
  'jpeg',
  'webp',
]

export const defaultConfig = {
  name: 'file',
  action: '/api/support/file/upload',
  accept: FILTER_TYPE_LIMIT.map((v) => '.' + v).join(','),
  data: {
    fileType: 1,
  },
}
