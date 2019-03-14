import * as express from 'express';
import { RedisService } from '../service/redis.service';
import { SongService } from '../service/song.service';
import { NexmoService } from '../service/nexmo.service';

export class Call {
    private redisService = new RedisService();
    private songService = new SongService();
    private smsService = new NexmoService();

    public router = express.Router();

    constructor() {
        this.router.post('/answer', this.answer.bind(this));
        this.router.post('/record', this.record.bind(this));
        this.router.post('/event', this.event.bind(this));
    }

    private async answer(req: express.Request, res: express.Response) {
        const from = req.body.from as string;
        const fromSplitIntoCharacters = from.split('').join(' ');

        const ncco = [{
            action: "connect",
            endpoint: [
                {
                    type: "websocket",
                    uri: "wss://5c4baccd.ngrok.io",
                    "content-type": "audio/l16;rate=16000",
                    headers: {
                        phone: fromSplitIntoCharacters
                    }
                }
            ]
        }, {
            action: 'stream',
            streamUrl: ['https://storage.googleapis.com/csgames-storage/songs/Tequila.mp3']
        }];

        res.json(ncco);
    }

    private async record(req: express.Request, res: express.Response) {
        console.log(req.body);
        res.end();
    }

    private async event(req: express.Request, res: express.Response) {
        console.log(req.body);
        res.end();
    }
}
