VERSION=$1
ACCESS_KEY_ID="LTAI5t7vVwv2GngM4fU5GWCu"
ACCESS_KEY_SECRET="fJ6vwq2lNSsJ5qjTZm3I0XEv6DYUUh"
ENDPOINT="oss-cn-hangzhou.aliyuncs.com"
BUCKET="lingxi-mini"

# 请替换以下信息为你要上传的文件夹路径和名称
LOCAL_FOLDER="scripts/${VERSION}"
REMOTE_FOLDER="miniprogram/locales/${VERSION}"

# 创建远程文件夹（如果不存在）
echo ${ACCESS_KEY_SECRET} | ossutilmac64 mkdir -p oss://${BUCKET}/${REMOTE_FOLDER}

# 上传文件夹
ossutilmac64 cp -rf ${LOCAL_FOLDER} oss://${BUCKET}/${REMOTE_FOLDER} -e ${ENDPOINT} -i ${ACCESS_KEY_ID} -k ${ACCESS_KEY_SECRET} --config-file ./scripts/ossconfig

echo "文件夹上传成功！"
