#!/bin/sh
npm run build
img_name='registry.cn-beijing.aliyuncs.com/letec/authmore-ui'
docker build -f Dockerfile.preview \
-t $img_name .
docker push $img_name