import * as speech from "@google-cloud/speech";

export class SpeechService {
    private speech: any;

    constructor() {
        this.speech = new speech.SpeechClient();
    }

    public async recognize(buffer: Buffer) {
        const audioBytes = buffer.toString('base64');

        // The audio file's encoding, sample rate in hertz, and BCP-47 language code
        const audio = {
            content: audioBytes,
        };
        const config = {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'en-US'
        };
        const request = {
            audio: audio,
            config: config,
        };

        // Detects speech in the audio file
        const [response] = await this.speech.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        console.log(`Transcription: ${transcription}`);
        return transcription;
    }
}
