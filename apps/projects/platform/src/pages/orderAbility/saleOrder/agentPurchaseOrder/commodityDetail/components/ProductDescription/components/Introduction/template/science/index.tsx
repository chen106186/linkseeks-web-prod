/*
 * 科技类商品描述模板
 * @Author: ghua
 * @Date: 2020-08-01 10:59:17
 * @Last Modified by: ghua
 * @Last Modified time: 2020-09-09 11:07:52
 */

import React, { Fragment, useState, useEffect } from 'react'
import VideoPlayer from '../../../../../../../components/VideoPlayer'
import styles from './index.less'

interface ImageItem {
  link: string
  linkType: number
  url: string
  imageType: number
}

interface ScienceTemplatePropsType {
  id: number
  imageList: ImageItem[]
  video: string[]
  word: string[]
}

const ScienceTemplate: React.FC<ScienceTemplatePropsType> = (props) => {
  const { imageList, video } = props
  const [normalImgList, setNormalImgList] = useState<ImageItem[]>([])
  const [qualityImgList, setQualityImgList] = useState<ImageItem[]>([])
  const [reportImgList, setReportImgList] = useState<ImageItem[]>([])

  const initGroupImgList = () => {
    const tempNormalImgList: ImageItem[] = []
    const tempQualityImgList: ImageItem[] = []
    const tempReportImgList: ImageItem[] = []
    imageList &&
      imageList.forEach((imgItem) => {
        switch (imgItem.imageType) {
          case 1:
            tempNormalImgList.push(imgItem)
            break
          case 2:
            tempQualityImgList.push(imgItem)
            break
          case 3:
            tempReportImgList.push(imgItem)
            break
          default:
            tempNormalImgList.push(imgItem)
            break
        }
      })
    setNormalImgList(tempNormalImgList)
    setQualityImgList(tempQualityImgList)
    setReportImgList(tempReportImgList)
  }

  useEffect(() => {
    if (imageList && imageList.length > 0) {
      initGroupImgList()
    }
  }, [imageList])

  return (
    <Fragment>
      <div className={styles.video_box}>
        {video &&
          video.map((video, index) => {
            const videoJsOptions = {
              controls: true,
              sources: [
                {
                  src: video,
                },
              ],
            }
            return video ? <VideoPlayer key={`video_box_item${index}`} {...videoJsOptions} /> : null
          })}
      </div>
      <div className={styles.img_list}>
        {normalImgList &&
          normalImgList.map((imgItem, index) =>
            imgItem?.link ? (
              <a key={`img_list_item_${index}`} href={imgItem.link} target="_blank">
                <img src={imgItem.url} />
              </a>
            ) : (
              <img key={`img_list_item_${index}`} src={imgItem.url} />
            ),
          )}
        {qualityImgList &&
          qualityImgList.map((imgItem, index) =>
            imgItem?.link ? (
              <a key={`img_list_item_${index}`} id="quality" href={imgItem.link} target="_blank">
                <img src={imgItem.url} />
              </a>
            ) : (
              <img id="quality" key={`img_list_item_${index}`} src={imgItem.url} />
            ),
          )}
        {reportImgList &&
          reportImgList.map((imgItem, index) =>
            imgItem?.link ? (
              <a key={`img_list_item_${index}`} id="report" href={imgItem.link} target="_blank">
                <img src={imgItem.url} />
              </a>
            ) : (
              <img id="report" key={`img_list_item_${index}`} src={imgItem.url} />
            ),
          )}
      </div>
    </Fragment>
  )
}

export default ScienceTemplate
