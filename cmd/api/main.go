package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/mouhamedBourouba/vsweb/cmd/api/api"
)

type Server struct {
}

func NewServer() Server {
	return Server{}
}

func (Server) PostApiCompile(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(map[string]any{"success": false, "message": "Method Not Allowed"})
	w.WriteHeader(http.StatusBadRequest)
}

func (Server) GetApiLanguages(w http.ResponseWriter, r *http.Request) {
}

func main() {
	addr := ":8000"
	server := NewServer()
	mux := chi.NewMux()
	handler := api.HandlerFromMux(server, mux)

	httpServer := http.Server{
		Handler: handler,
		Addr:    addr,
	}

	log.Println("Http Server started at", addr)
	log.Fatal(httpServer.ListenAndServe())
}
