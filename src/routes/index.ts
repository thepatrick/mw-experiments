import { Application } from 'express';
import { asyncResponse, AsyncResponseError } from '../middleware/asyncResponse';

import pgPromise = require('pg-promise');
import { DatabasePoolType, sql } from 'slonik';
import { withDatabaseConnection } from '../middleware/withDatabaseConnection';
import { isEmpty, isString } from 'lodash';
import { UNPROCESSABLE_ENTITY } from 'http-status-codes';

export const registerRoutes = (app: Application, pool: DatabasePoolType) => {
  const oidc = app.locals.oidc;

  const pgp = pgPromise();
  const db = pgp({
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT || '', 10),
    user: process.env.PGUSER,
  });

  app.get('/api/v1/whoami', oidc.ensureAuthenticated(), asyncResponse((req, res) => {
    const user = req.userContext ? req.userContext.userinfo : null;
    return user;
  }));

  app.get('/api/v1/group', asyncResponse(withDatabaseConnection(pool, async (req, res, connection) => {
    const groups = await connection.any(
      sql`SELECT id, group_id, brand FROM groups ORDER BY brand`,
    );

    return groups;
  })));

  function isNonEmptyString(s: string) {
    return isString(s) && !isEmpty(s);
  }

  app.post('/api/v1/group', asyncResponse(withDatabaseConnection(pool, async (req, res, connection) => {
    if (!isNonEmptyString(req.body.groupId) ||
      !isNonEmptyString(req.body.brand)) {
      throw new AsyncResponseError('Missing group ID _or_ brand', UNPROCESSABLE_ENTITY);
    }
    const id = await connection.oneFirst(
      sql`
        INSERT INTO groups (group_id, brand)
        VALUES ( ${req.body.groupId}, ${req.body.brand} )
        RETURNING id;
      `,
    );

    return { id };
  })));

  app.get('/api/v1/group/:group', asyncResponse(async (req, res) => {
    return {};
  }));

  // define a secure route handler for the login page that redirects to /guitars
  app.get('/login', oidc.ensureAuthenticated(), (req, res) => {
    res.redirect('/api/v1/group');
  });

  // define a route to handle logout
  app.get('/logout', (req: any, res) => {
    req.logout();
    res.redirect('/');
  });

  // define a route handler for the default home page
  app.get('/', (req, res) => {
    res.send('Hello world. (Maybe try /api/v1/group');
  });

};
