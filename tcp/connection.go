package main

import (
	"bufio"
	"fmt"
	"net"
	"strings"
)

func HandleConnection(c net.Conn) {
	index := 0
	for {
		_, err := c.Write([]byte(Service.GetNextWord(index) + "\n"))
		if err != nil {
			fmt.Println(err)
			return
		}

		index++
		netData, err := bufio.NewReader(c).ReadString('\n')
		if err != nil {
			fmt.Println(err)
			return
		}
		temp := strings.TrimSpace(netData)
		if !Service.Validate(temp, index) {
			break
		}
		index++
	}
	c.Close()
}