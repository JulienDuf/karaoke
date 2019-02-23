import * as Nexmo from "nexmo";

export class NexmoService {
    private nexmo: any;

    constructor() {
        this.nexmo = new Nexmo({
            apiKey: process.env.NEXMO_API_KEY,
            apiSecret: process.env.NEXMO_API_SECRET,
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
}
