import { Application } from 'express';
import { asyncResponse } from '../middleware/asyncResponse';

export const registerRoutes = (app: Application) => {
  const oidc = app.locals.oidc;

  app.get('/api/v1/whoami', oidc.ensureAuthenticated(), asyncResponse((req, res) => {
    const user = req.userContext ? req.userContext.userinfo : null;
    return user;
  }));

  app.get('/api/v1/group', asyncResponse(async (req, res) => {
    return [];
  }));

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
