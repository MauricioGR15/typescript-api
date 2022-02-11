import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {Routes} from "./routes";
import {User} from "./entity/User";
import { port } from "./config";
import * as morgan from 'morgan';
import { validationResult } from "express-validator";


function handleError(err, req, res, next) {
    res.status(err.statusCode || 500).send({message: err.message});
}


// create express app
const app = express();
app.use(morgan('tiny'))
app.use(bodyParser.json());

// register express routes from defined application routes
Routes.forEach(route => {
    (app as any)[route.method](route.route, ...route.validation, async (req: Request, res: Response, next: Function) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            const result = await (new (route.controller as any))[route.action](req, res, next);
            res.json(result);
        } catch (error) {
            next(error); // Pass the error to the next middleware, and will handle the error
        }

    });
});

// setup express app here
// ...

// start express server
app.use(handleError);

export default app;