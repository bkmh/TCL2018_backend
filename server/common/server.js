/**
 * Copyright 2018 (주)KT All Rights Reserved.
 *
 *
 */

import Express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as os from 'os';
import cookieParser from 'cookie-parser';
import swaggerify from './swagger';
import l from './logger';

const bc = require('../blockchain/bc-client');
const couch = require('../couchdb/cocuch-client');
const config = require('../blockchain/configuration/config');

const app = new Express();

export default class ExpressServer {
  constructor() {
    const root = path.normalize(`${__dirname}/../..`);
    app.set('appPath', `${root}client`);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(Express.static(`${root}/public`));

    if (config.startChannelNetwork) {
      bc.channelSetUp(path.join('configuration', config.startChannelNetwork))
        .then(() => {
          couch.dbSetUp();
        })
        .catch(err => {
          l.error(err.stack ? err.stack : err);
        });
    }
  }

  router(routes) {
    swaggerify(app, routes);
    return this;
  }

  listen(port = process.env.PORT) {
    const welcome = p => () => l.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${p}}`);
    http.createServer(app).listen(port, welcome(port));
    return app;
  }
}
