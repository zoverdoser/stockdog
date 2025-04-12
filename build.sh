#!/bin/sh

IMAGE_NAME="stockdog-web-image"

if [ $(docker images -q $IMAGE_NAME) ]; then
  docker rmi $IMAGE_NAME;
fi

docker build -t $IMAGE_NAME .