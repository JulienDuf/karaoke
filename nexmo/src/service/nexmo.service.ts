import * as Nexmo from "nexmo";
import { promisify } from 'util';
import { Subject, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

export class NexmoService {
    private nexmo: any;
    private sms: { text: string; phone: string }[] = [];
    private smsStream$: Subject<void> = new Subject<void>();
    private smsSubscription$: Subscription;

    constructor() {
        this.nexmo = new Nexmo({
            apiKey: process.env.NEXMO_API_KEY,
            apiSecret: process.env.NEXMO_API_SECRET,
            applicationId: process.env.NEXMO_APPLICATION_ID,
            privateKey: process.env.NEXMO_PRIVATE_KEY,
            options: {
                debug: process.env.NEXMO_API_DEBUG
            }
        });
    }

    // Send an sms to number (Use E.164 format)
    public sendSms(message: { text: string, phone: string }) {
        this.sms.push(message);

        if (this.smsSubscription$) {
            return;
        }

        this.smsSubscription$ = this.smsStream$
            .pipe(delay(1000))
            .subscribe(() => {
                const sms = this.sms.pop();
                if (!sms) {
                    this.smsSubscription$.unsubscribe();
                    this.smsSubscription$ = null;
                    return;
                }

                this.sendOneSms(sms);
            });
    }

    private sendOneSms(sms: { text: string, phone: string }) {
        try {
            this.nexmo.message.sendSms(process.env.NEXMO_FROM_NUMBER, sms.phone, sms.text, {},
                (err, apiResponse) => {
                    if (err) {
                        console.log("Nexmo failed to send sms. Reason:\n" + err);
                    } else if (apiResponse.messages[0].status !== "0") {
                        console.log(apiResponse);
                    }
                    this.smsStream$.next();
                });
        } catch (err) {
            console.log("Nexmo failed to send sms. Reason:\n" + err);
            this.smsStream$.next();
        }
    }

    public async getRecording(url: string) {
        await promisify(this.nexmo.files.save.bind(this.nexmo.files))(url, "test.wav");
        return promisify(this.nexmo.files.get.bind(this.nexmo.files))(url);
    }

    public async updateCall(uuid: string, data: any) {
        return promisify(this.nexmo.calls.update.bind(this.nexmo.calls))(uuid, data);
    }

    public async sendText(uuid: string, data: any) {
        return promisify(this.nexmo.calls.talk.start.bind(this.nexmo.calls.talk))(uuid, data);
    }
}
