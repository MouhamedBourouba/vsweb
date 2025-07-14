run:
	@go run cmd/api/main.go

build:
	@go build -o build/api cmd/api/main.go

.PHONY: build run
