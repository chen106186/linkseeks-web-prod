
#执行方法 sh ./pack.sh $1 $3
#$1 为appid
appid=$1
#$2 为版本号
uv=$2
#$3 为机器人 1-30
r=$3
#二维码存放文件夹名
qrcodeDir="qrcodeDir"

#
mkdir -p $qrcodeDir

#preview
miniprogram-ci \
  preview \
  --pp ./dist/weapp/ \
  --pkp ./scripts/uploadKey/private.$appid.key \
  --appid $appid \
  --uv $uv \
  -r $r \
  --enable-es7 true \
  --enable-minify-wxss true \
  --enable-minify-wxml true \
  --enable-minify-js  true \
  --enable-minify true \
  --qrcode-format image \
  --qrcode-output-dest ./$qrcodeDir/x.jpg

ACCESS_KEY_ID="LTAI5t7vVwv2GngM4fU5GWCu"
ACCESS_KEY_SECRET="fJ6vwq2lNSsJ5qjTZm3I0XEv6DYUUh"
ENDPOINT="oss-cn-hangzhou.aliyuncs.com"
BUCKET="lingxi-mini"

# 请替换以下信息为你要上传的文件夹路径和名称
LOCAL_FOLDER="qrcodeDir"
REMOTE_FOLDER="miniprogram/preview"

# 创建远程文件夹（如果不存在）
echo ${ACCESS_KEY_SECRET} | ossutilmac64 mkdir -p oss://${BUCKET}/${REMOTE_FOLDER}

# 上传文件夹
# /Users/ssy/config 是远程m1的配置
ossutilmac64 cp -rf ${LOCAL_FOLDER} oss://${BUCKET}/${REMOTE_FOLDER} -e ${ENDPOINT} -i ${ACCESS_KEY_ID} -k ${ACCESS_KEY_SECRET} --config-file ./scripts/ossconfig
# 这一步去除文件的Content-Disposition http 设置
ossutilmac64 set-meta oss://${BUCKET}/${REMOTE_FOLDER}/ content-type:image/jpg#Content-Disposition:inline --include "*.jpg" --update -r -f --config-file ./scripts/ossconfig

