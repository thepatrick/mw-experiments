import { Request, Response } from 'express';
import express = require('express');

import { sessionAuth } from './middleware/sessionAuth';
import { registerRoutes } from './routes';

const app = express();
const port = 8080; // default port to listen

sessionAuth(app);
registerRoutes(app);

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${ port }`);
});
