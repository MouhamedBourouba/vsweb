run:
	@go run cmd/api/main.go

build:
	@go build -o build/api cmd/api/main.go

air:
	@air --build.cmd "make build" --build.bin "build/api"

.PHONY: build run
