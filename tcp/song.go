package main

import "strings"

var song = []string{
	"Every night in my dreams",
	"I see you, I feel you",
	"That is how I know you go on",
	"Far across the distance",
	"And spaces between us",
	"You have come to show you go on",
	"Near, far, wherever you are",
	"I believe that the heart does go on",
	"Once more you open the door",
	"And you're here in my heart",
	"And my heart will go on and on",
	"Love can touch us one time",
	"And last for a lifetime",
	"And never let go till we're gone",
	"Love was when I loved you",
	"One true time I hold to",
	"In my life we'll always go on",
	"Near, far, wherever you are",
	"I believe that the heart does go on",
	"Once more you open the door",
	"And you're here in my heart",
	"And you're here in my heart",
	"You're here, there's nothing I fear",
	"And I know that my heart will go on",
	"We'll stay forever this way",
	"You are safe in my heart and",
	"My heart will go on and on flag-thankyoujackforthisgreatmoment",
}

type SongService struct {
	words []string
}

var Service = SongService{
	words: []string{},
}

func InitSongService() {
	for _, line := range song {
		Service.words = append(Service.words, strings.Split(line, " ")...)
	}
}

func (ctx *SongService) Validate(text string, index int) bool {
	if index >= len(ctx.words) {
		return false
	}

	text = strings.ToLower(text)
	songWord := strings.ToLower(ctx.words[index])

	return text == songWord
}

func (ctx *SongService) GetNextWord(index int) string {
	if index >= len(ctx.words) {
		return ""
	}

	return ctx.words[index]
}
