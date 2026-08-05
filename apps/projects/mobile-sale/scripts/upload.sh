
#执行方法 sh ./pack.sh $1 $2 $3
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

#upload
miniprogram-ci \
  upload \
  --pp ./dist/weapp/ \
  --pkp ./scripts/uploadKey/private.$appid.key \
  --appid $appid \
  --uv $uv \
  -r $r \
  --enable-es7 true \
  --enable-minify-wxss true \
  --enable-minify-wxml true \
  --enable-minify-js  true \
  --enable-minify true
