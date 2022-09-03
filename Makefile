PRODUCT=immobot
PROJECT=immobot
IMAGE_NAME=${PROJECT}/immo-crawler
IMAGE_VERSION=0.1.0
SERVER_PORT=80

.PHONY=build-docker
build-docker:
	docker build -t "${IMAGE_NAME}:${IMAGE_VERSION}" -t "${IMAGE_NAME}:latest" .

.PHONY=build-docker-compose
build-docker-compose:
	docker build --target crawler -t "${IMAGE_NAME}:${IMAGE_VERSION}" -t "${IMAGE_NAME}:latest" .

.PHONY=serve
serve:build-docker
	docker compose -p ${PRODUCT} up -d

.PHONY=stop
stop:
	docker compose -p ${PRODUCT} down
