package main

import (
	"fmt"
	"math/rand"
	"net"
	"time"
)

func main() {
	InitSongService()
	l, err := net.Listen("tcp4", ":2010")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer l.Close()
	rand.Seed(time.Now().Unix())

	for {
		c, err := l.Accept()
		if err != nil {
			fmt.Println(err)
			return
		}
		go HandleConnection(c)
	}
}