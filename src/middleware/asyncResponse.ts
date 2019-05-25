import { Request, Response } from 'express';

export const asyncResponse: (
  fn: (req: Request, res: Response) => Promise<unknown>) => ((req: Request, res: Response) => void
) =
  fn => async (req, res) => {
    try {
      res.send(await fn(req, res));
    } catch (err) {
      res.send({ error: err.message });
    }
  };
