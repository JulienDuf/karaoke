import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Index } from './route';
import { Call } from './route/call';
import { Sms } from './route/sms';

export class Application {
    public app: express.Application;

    public static bootstrap(): Application {
        return new Application();
    }

    constructor() {
        this.app = express();

        this.config();
        this.routes();
    }

    private config() {
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, '../public')));
        this.app.use(cors());
    }

    public routes() {
        const index: Index = new Index();
        const sms = new Sms();
        const call = new Call();
        this.app.use("/", index.router);
        this.app.use("/sms", sms.router);
        this.app.use("/call", call.router);

        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            let err = new Error('Not Found');
            next(err);
        });

        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || 404);
            res.send({
                message: err.message,
                error: {}
            });
        });
    }
}
