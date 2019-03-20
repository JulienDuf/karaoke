import { TeamApp } from '../src/team-app';
import * as dotenv from 'dotenv';
import { SongService } from './song.service';
import { RedisService } from './redis.service';

dotenv.config();

async function boostrap() {
    const songService = new SongService('song');
    const redisService = new RedisService();
    const app = new TeamApp({
        appToken: process.env.APP_TOKEN,
        botToken: process.env.BOT_TOKEN
    });
    await app.listen(3000);

    app.appRtmClient.on('message', async (message) => {
        if (!message.channel.startsWith('D')) {
            return;
        }

        const userData = await redisService.get(`${message.user}:responses`);
        if (!userData) {
            const value = [songService.get(0)];
            await redisService.set(`${message.user}:responses`, JSON.stringify(value));
            await app.appRtmClient.sendMessage(value[0], message.channel);
            return;
        }

        const array = JSON.parse(userData) as string[];
        if (songService.validate(message.text, array.length)) {
            array.push(message.text);
            await app.appRtmClient.sendMessage(songService.get(array.length), message.channel);
            array.push(songService.get(array.length));
            await redisService.set(`${message.user}:responses`, JSON.stringify(array));
        } else {
            await redisService.set(`${message.user}:responses`, null);
            await app.appRtmClient.sendMessage('Nope!', message.channel);
        }
    });
}

boostrap();
