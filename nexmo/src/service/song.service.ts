import * as songData from "../data/song";

export class SongService {
    private song = songData.song.split(" ");

    public validate(data: string, index: number): boolean {
        if (index > this.song.length - 1) {
            return false;
        }
        return this.song[index].toLowerCase() === data.toLowerCase();
    }

    public get(index: number): string {
        if (index > this.song.length - 1) {
            return null;
        }
        return this.song[index];
    }
}
