compiler:
	@go build -o build/compiler cmd/compiler/main.go

air:
	@air --build.cmd "make build" --build.bin "build/compiler"

docker:
	docker build -f ./deploy/dockerfile .


.PHONY: build run docker
