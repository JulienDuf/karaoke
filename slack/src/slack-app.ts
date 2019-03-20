import * as express from 'express';
import { promisify } from "util";

export abstract class SlackApp {
    private app: express.Application;

    protected constructor() {
        this.init();
    }

    public async listen(port: number): Promise<void> {
        return promisify<number, void>(this.app.listen)(port);
    }

    protected init() {
        this.app = express();
    }
}
