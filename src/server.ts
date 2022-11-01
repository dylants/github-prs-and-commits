import express from 'express';
import config from '../config';

const app = express();

/* ------------------------------------------ *
 * APIs
 * ------------------------------------------ */
const apiRouter = express.Router();

require('./routes')(apiRouter);
app.use('/api', apiRouter);

// send a 404 for any unmatched API route
app.use('/api/*', (req, res) => res.status(404).end());

/* ------------------------------------------ *
 * Start Express
 * ------------------------------------------ */
app.listen(config.port, () => {
  console.log(`Express server listening on port ${config.port}`);
});
