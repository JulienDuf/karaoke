import * as express from 'express';
import { NexmoService } from '../service/nexmo.service';
import { RedisService } from '../service/redis.service';
import { SpeechService } from '../service/speech.service';

export class Call {
    private smsService = new NexmoService();
    private speech = new SpeechService();
    private redisService = new RedisService();

    public router = express.Router();

    constructor() {
        this.router.post('/answer', this.answer.bind(this));
        this.router.post('/record', this.record.bind(this));
        this.router.post('/event', this.event.bind(this));
    }

    private async answer(req: express.Request, res: express.Response) {
        await this.redisService.set(`conversation-${req.body.conversation_uuid}`, req.body.uuid);

        const ncco = [{
            action: 'stream',
            streamUrl: ['https://storage.googleapis.com/csgames-storage/songs/Tequila-1.mp3']
        }, {
            action: 'record',
            eventUrl: [`${process.env.APP_URL}/call/record`],
            endOnSilence: '3'
        }, {
            action: 'stream',
            streamUrl: ['https://storage.googleapis.com/csgames-storage/songs/Tequila-2.mp3']
        }, {
            action: 'record',
            eventUrl: [`${process.env.APP_URL}/call/record`],
            endOnSilence: '3'
        }, {
            action: 'stream',
            streamUrl: ['https://storage.googleapis.com/csgames-storage/songs/Tequila-3.mp3']
        }, {
            action: 'record',
            eventUrl: [`${process.env.APP_URL}/call/record`],
            endOnSilence: '3'
        }, {
            action: 'talk',
            text: '<speak><break time="5s"/>Your flag is <break time="1s"/>' +
                'F <break time="1s"/>' +
                'L <break time="1s"/>' +
                'A <break time="1s"/>' +
                'G <break time="1s"/>' +
                '<say-as interpret-as="spell-out">-</say-as> <break time="1s"/>' +
                'G <break time="1s"/>' +
                'V <break time="1s"/>' +
                'J <break time="1s"/>' +
                'E <break time="1s"/>' +
                'M <break time="1s"/>' +
                'A <break time="1s"/>' +
                'P <break time="1s"/>' +
                'L <break time="1s"/>' +
                'F <break time="1s"/>' +
                'L <break time="1s"/>' +
                'H <break time="1s"/>' +
                'A <break time="1s"/></speak>',
            loop: '2',
            level: '1'
        }];

        res.json(ncco);
    }

    private async record(req: express.Request, res: express.Response) {
        const uuid = await this.redisService.get(`conversation-${req.body.conversation_uuid}`);
        const data = await this.smsService.getRecording(req.body.recording_url);
        const value = (await this.speech.recognize(data)).toLowerCase();
        if (value !== 'tequila') {
            try {
                await this.redisService.scanDel(`call-${uuid}`);
                await this.smsService.updateCall(uuid, { action: 'hangup' });
            } catch (e) {
                console.log(e);
            }
        }
        res.end();
    }

    private async event(req: express.Request, res: express.Response) {
        res.end();
    }
}
