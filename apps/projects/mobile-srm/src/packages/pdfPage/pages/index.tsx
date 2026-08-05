import { View } from '@apps/mobile-ui'
import 'pdfh5/css/pdfh5.css'
import React from 'react'
import { getStorageSync } from '@apps/mobile-services/utils/taro'

try {
  // 缓存中的pdfUrl
  let PDFurl = getStorageSync('pdfUrl')
  if (PDFurl) {
    if (process.env.TARO_ENV === 'h5') {
      // 因为小程序引入报错，所以按需加载 npm i pdfh5
      let Pdfh5 = require('pdfh5')
      //实例化
      this.pdfh5 = new Pdfh5('#Pdf', {
        pdfurl: PDFurl,
      })
    }
  }
} catch (e) {
  // Do something when catch error
}

;<View className="PdfCss" id="Pdf"></View>
