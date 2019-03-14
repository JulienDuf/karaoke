import * as express from 'express';
import { RedisService } from '../service/redis.service';
import { SongService } from '../service/song.service';
import { NexmoService } from '../service/nexmo.service';

export class Sms {
    private redisService = new RedisService();
    private songService = new SongService("sms");
    private smsService = new NexmoService();

    public router = express.Router();

    constructor() {
        this.router.get('/', this.recv.bind(this));
    }

    private async recv(req: express.Request, res: express.Response) {
        const data = {
            msisdn: req.query["msisdn"],
            messageId: req.query["messageId"],
            text: req.query["text"],
            type: req.query["type"],
            keyword: req.query["keyword"],
            messageTimestamp: req.query["message-timestamp"]
        };

        const userData = await this.redisService.get(`${data.msisdn}:responses`);
        if (!userData) {
            const value = [this.songService.get(0)];
            await this.redisService.set(`${data.msisdn}:responses`, JSON.stringify(value));
            this.smsService.sendSms({
                text: value[0],
                phone: data.msisdn
            });
            return res.end();
        }

        const array = JSON.parse(userData) as string[];
        if (this.songService.validate(data.text, array.length)) {
            array.push(data.text);
            this.smsService.sendSms({
                text: this.songService.get(array.length),
                phone: data.msisdn
            });
            array.push(this.songService.get(array.length));
            await this.redisService.set(`${data.msisdn}:responses`, JSON.stringify(array));
            return res.end();
        } else {
            await this.redisService.set(`${data.msisdn}:responses`, null);
            this.smsService.sendSms({
                text: 'Nope!',
                phone: data.msisdn
            });
            return res.end();
        }
    }
}
