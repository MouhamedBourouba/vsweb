package main

import (
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"strings"

	"github.com/creack/pty"
	"github.com/gorilla/websocket"
	"github.com/mouhamedBourouba/go-file-service/fileserver"
)

// Todo: make shit secure
// type DockerClient struct {
// }
//
// func createTerminalInContainer() (*os.File, error) {
// 	dc, err := client.NewClientWithOpts(client.FromEnv)
// 	if err != nil {
// 		return nil, err
// 	}
//
// 	defer dc.Close()
//
// 	return nil, nil
// }

// Todo: no
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func handleConnection(terminalFile *os.File, c *websocket.Conn) {
	go func() {
		buf := make([]byte, 1024)
		for {
			n, err := terminalFile.Read(buf)
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

		// log.Println("Payload: ", string(message))
		if strings.HasPrefix(string(message), "/resize") {
			// Todo: extract a function to parse the /resize command
			commandParts := strings.Split(string(message), " ")
			if len(commandParts) != 3 {
				// Todo: handle error
				log.Println("Malformated request")
				continue
			}

			rows, err := strconv.Atoi(commandParts[1])
			if err != nil {
				// Todo: handle error
				log.Println("Malformated request")
				continue
			}

			cols, err := strconv.Atoi(commandParts[2])
			if err != nil {
				// Todo: handle error
				log.Println("Malformated request")
				continue
			}

			pty.Setsize(terminalFile, &pty.Winsize{
				Rows: uint16(rows),
				Cols: uint16(cols),
			})

			continue
		}

		terminalFile.Write(message)
	}
}

func shellHandler(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error: ", err.Error())
		return
	}

	cmd := exec.Command("./third-party/busybox", "ash")
	terminalFile, err := pty.Start(cmd)
	if err != nil {
		log.Println("pty error: ", err.Error())
		return
	}

	defer func() {
		_ = terminalFile.Close()
		_ = c.Close()
	}()

	handleConnection(terminalFile, c)
}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		io.WriteString(w, "hello buddy ////")
	})

	http.HandleFunc("/shell", shellHandler)

	fs := fileserver.New(
		fileserver.WithDataDir("./data"),
		fileserver.WithLogger(log.Default()))
	http.Handle("/fs/", http.StripPrefix("/fs/", fs))

	log.Println("Listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
