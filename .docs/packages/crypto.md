# Crypto - 项目加解密

项目采用 AES(CBC 模式) 加密算法，以及部分 base64 编码。

## 使用方式

```js
import Crypto, { decodeURLBase64, encodeURLBase64 } from '@linkseeks/crypto'

const crypto = new Crypto()
const str = 'linkseeks'
crypto.base64.encrypt(str) // 加密
crypto.base64.decrypt(str) // 解密
crypto.aes.encrypt(str) // 加密
crypto.aes.decrypt(str) // 解密

// 若使用url参数传递，则需要使用encodeURLBase64和decodeURLBase64进行编码和解码
const str = 'linkseeks'
encodeURLBase64(str) // 编码
decodeURLBase64(str) // 解码
```
