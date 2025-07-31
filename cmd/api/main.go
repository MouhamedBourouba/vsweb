package main

import (
	"io"
	"log"
	"net/http"
	"os/exec"

	"github.com/creack/pty"
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

	cmd := exec.Command("./third-party/busybox", "ash")

	ptty, err := pty.Start(cmd)
	if err != nil {
		log.Println("pty error: ", err.Error())
		return
	}

	defer func() {
		_ = ptty.Close()
		_ = c.Close()
	}()

	go func() {
		buf := make([]byte, 1024)
		for {
			n, err := ptty.Read(buf)
			if err != nil {
				return
			}
			c.WriteMessage(websocket.TextMessage, buf[:n])
		}
	}()

	for {
		_, message, err := c.ReadMessage()
		if err != nil {
			return
		}
		ptty.Write(message)

	}

	// for {
	// 	mt, message, err := c.ReadMessage()
	// 	if err != nil {
	// 		log.Println("Error reading message: ", err)
	// 		return
	// 	}
	//
	// 	if err := c.WriteMessage(mt, message); err != nil {
	// 		log.Println("Error writing message: ", err)
	// 		return
	// 	}
	// }
}

type WebsocketTerminal struct {
	conn *websocket.Conn
}

func (this WebsocketTerminal) Read(p []byte) (n int, err error) {
	_, messageReader, err := this.conn.NextReader()
	if err != nil {
		return 0, err
	}
	return messageReader.Read(p)
}

func (this WebsocketTerminal) Write(p []byte) (n int, err error) {
	println("Writen: ", "`", string(p), "`")
	return len(p), nil
}

func New(conn *websocket.Conn) WebsocketTerminal {
	return WebsocketTerminal{conn: conn}
}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		io.WriteString(w, "hello buddy ////")
	})

	http.HandleFunc("/shell", shell)

	log.Println("Listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
