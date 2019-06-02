#!/bin/sh
npm run build
img_name='jameszbl/authmore-ui'
docker build -f Dockerfile.preview \
-t $img_name .
docker push $img_name
