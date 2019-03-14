import * as express from 'express';

export class Index {
    public router = express.Router();

    constructor() {
        this.router.get('/', this.index.bind(this));
    }

    private async index(req: express.Request, res: express.Response) {
        return res.send('OK');
    }
}
