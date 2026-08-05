import React, { Fragment } from 'react'
import VideoPlayer from '@/components/VideoPlayer'
import styles from './index.module.less'

interface RemarkItemType {
  id: number
  content: string
  link?: string
  linkType?: string
  type: number
  url?: string
  updateTime?: number
}

interface ScienceTemplatePropsType {
  commodityRemarkList: RemarkItemType[]
}

const ScienceTemplate: React.FC<ScienceTemplatePropsType> = (props) => {
  const { commodityRemarkList } = props

  return (
    <Fragment>
      {commodityRemarkList.map((v, index) => {
        if (v.type === 1) {
          return <div dangerouslySetInnerHTML={{ __html: v.content }} className={styles.content}></div>
        }
        if (v.type === 2) {
          return (
            <a key={`img_list_item_${index}`} href={v.link} target="_blank">
              <img src={v.url} className={styles.img_box} />
            </a>
          )
        }
        if (v.type === 3) {
          const videoJsOptions = {
            controls: true,
            sources: [
              {
                src: v.url,
              },
            ],
          }
          return (
            <div className={styles.video_box}>
              <VideoPlayer key={`video_box_item${index}`} {...videoJsOptions} />
            </div>
          )
        }
      })}
    </Fragment>
  )
}

export default ScienceTemplate
