import * as express from 'express';
import { RedisService } from '../service/redis.service';
import { SongService } from '../service/song.service';
import { NexmoService } from '../service/nexmo.service';

export class Call {
    private redisService = new RedisService();
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
            action: 'stream',
            streamUrl: ['https://storage.googleapis.com/csgames-storage/songs/Tequila-1.mp3']
        }, {
            action: 'record',
            eventUrl: ['https://24baa8bd.ngrok.io/call/record'],
            endOnSilence: '2'
        }, {
            action: 'stream',
            streamUrl: ['https://storage.googleapis.com/csgames-storage/songs/Tequila-2.mp3']
        }, {
            action: 'record',
            eventUrl: ['https://24baa8bd.ngrok.io/call/record'],
            endOnSilence: '2'
        }, {
            action: 'stream',
            streamUrl: ['https://storage.googleapis.com/csgames-storage/songs/Tequila-3.mp3']
        }, {
            action: 'record',
            eventUrl: ['https://24baa8bd.ngrok.io/call/record'],
            endOnSilence: '2'
        }];

        res.json(ncco);
    }

    private async record(req: express.Request, res: express.Response) {
        console.log(req.body);
        this.smsService.saveRecording(req.body.recording_url, req.body.recording_uuid);
        res.end();
    }

    private async event(req: express.Request, res: express.Response) {
        console.log(req.body);
        res.end();
    }
}
