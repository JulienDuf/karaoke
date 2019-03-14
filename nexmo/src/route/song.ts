import * as express from 'express';
import { SongService } from '../service/song.service';

export class Song {
    private songService = new SongService("http");

    public router = express.Router();

    constructor() {
        this.router.get('/', this.index.bind(this));
    }

    private async index(req: express.Request, res: express.Response) {
        const userData = req.session.data;
        if (!userData) {
            req.session.data = [this.songService.get(0)];
            res.setHeader("X-Accept-Lyric", req.session.data[0]);
            return res.end();
        }

        const text = req.header("X-Accept-Lyric");
        if (text && this.songService.validate(text, userData.length)) {
            userData.push(text);
            const response = this.songService.get(userData.length);
            userData.push(response);
            res.setHeader("X-Accept-Lyric", response);
            return res.end();
        } else {
            req.session.data = null;
            res.setHeader("X-Refuse-Lyric", "NOPE!");
            return res.end();
        }
    }
}
