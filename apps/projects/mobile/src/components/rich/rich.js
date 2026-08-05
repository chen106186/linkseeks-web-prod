Component({
  properties: {
    html: {
      type: String,
      value: '',
    },
  },

  data: {
    editorCtx: null,
  },

  methods: {
    // 编辑器初始化
    onEditorReady() {
      wx.createSelectorQuery()
        .in(this)
        .select('#innerEditor')
        .context((res) => {
          const ctx = res.context
          this.setData({ editorCtx: ctx })

          // 追加 3 行空白段落（<p><br></p>）用于撑底
          const paddingHtml = '<p><br></p><p><br></p><p><br></p>'

          if (this.properties.html) {
            const mergedHtml = this.properties.html + paddingHtml
            ctx.setContents({
              html: mergedHtml,
            })
          } else {
            ctx.setContents({
              html: paddingHtml,
            })
          }
        })
        .exec()
    },

    // 手动触发保存
    emitContent() {
      this.data.editorCtx?.getContents({
        success: (res) => {
          let html = res.html

          // 移除结尾的多余空段落 <p><br></p>
          html = html.replace(/(<p><br><\/p>\s*)+$/g, '')

          this.triggerEvent('richchange', { html })
        },
      })
    },

    // 加粗
    formatBold() {
      this.data.editorCtx?.format('bold')
    },

    // 标题 H2
    formatHeader() {
      this.data.editorCtx?.format('header', 2)
    },

    // 正文
    formatText() {
      this.data.editorCtx?.format('header', 0)
    },

    // 居中
    formatCenter() {
      this.data.editorCtx?.format('align', 'center')
    },

    // 选择图片触发 richupload 事件
    insertImage() {
      this.triggerEvent('richupload')
    },

    // 父组件上传完调用此方法插入图片
    insertImageFromParent(url) {
      if (!this.data.editorCtx || !url) return
      this.data.editorCtx.insertImage({
        src: url,
        width: '100%',
      })
    },
  },
})
