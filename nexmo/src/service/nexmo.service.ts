import * as Nexmo from "nexmo";
import { promisify } from 'util';

export class NexmoService {
    private nexmo: any;

    constructor() {
        this.nexmo = new Nexmo({
            apiKey: process.env.NEXMO_API_KEY,
            apiSecret: process.env.NEXMO_API_SECRET,
            applicationId: "be31e48b-47d9-403c-80a2-23a4c6d01589",
            privateKey: "/home/julien/git/karaoke/nexmo/private.key",
            options: {
                debug: process.env.NEXMO_API_DEBUG
            }
        });
    }

    public sendSms(sms: { text: string, phone: string }) {
        try {
            this.nexmo.message.sendSms(process.env.NEXMO_FROM_NUMBER, sms.phone, sms.text, {},
                (err, apiResponse) => {
                    if (err) {
                        console.log("Nexmo failed to send sms. Reason:\n" + err);
                    } else if (apiResponse.messages[0].status !== "0") {
                        console.log(apiResponse);
                    }
                });
        } catch (err) {
            console.log("Nexmo failed to send sms. Reason:\n" + err);
        }
    }

    public async getRecording(url: string) {
        return promisify(this.nexmo.files.get.bind(this.nexmo.files))(url);
    }

    public async updateCall(uuid: string, data: any) {
        return promisify(this.nexmo.calls.update.bind(this.nexmo.calls))(uuid, data);
    }

    public async sendText(uuid: string, data: any) {
        return promisify(this.nexmo.calls.talk.start.bind(this.nexmo.calls.talk))(uuid, data);
    }
}
