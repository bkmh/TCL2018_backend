import examplesRouter from './api/controllers/examples/router';
import balanceRouter from './api/controllers/balance/router';
import babychainRouter from './api/controllers/babychain/router';

export default function routes(app) {
  app.use('/api/v1/examples', examplesRouter);
  app.use('/api/v1/balance', balanceRouter);
  app.use('/api/v1/babychain', babychainRouter);
}
