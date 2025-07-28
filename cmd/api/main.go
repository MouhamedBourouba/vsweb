package main

import (
	"io"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func shell(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error: ", err.Error())
		return
	}
	defer c.Close()

	for {
		mt, message, err := c.ReadMessage()
		if err != nil {
			log.Println("Error reading message: ", err)
			return
		}
		if err := c.WriteMessage(mt, message); err != nil {
			log.Println("Error writing message: ", err)
			return
		}
	}
}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		io.WriteString(w, "hello buddy ur")
	})

	http.HandleFunc("/shell", shell)

	log.Println("Listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
