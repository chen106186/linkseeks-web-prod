import { downloadFileByNameAndUrl } from '@apps/utils'

/* 下载合同  */
export const Download = (name, contractUrl) => {
  downloadFileByNameAndUrl(contractUrl, name)
}
