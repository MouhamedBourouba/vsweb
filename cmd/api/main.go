package main

import (
	"encoding/json"
	"log"
	"net/http"
)

func main() {
	addr := ":8000"

	http.HandleFunc("/api/compile", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
		} else {
			json.NewEncoder(w).Encode(map[string]any{"success": false, "message": "Method Not Allowed"})
			w.WriteHeader(http.StatusBadRequest)
		}
	})

	log.Println("Http Server started at", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}
