compiler:
	@go build -o build/compiler cmd/compiler/main.go

buid/api: cmd/api/main.go
	@go build -o build/api cmd/api/main.go

air:
	@air --build.cmd "make api" --build.bin "build/api"

docker:
	docker build -f ./deploy/dockerfile .
