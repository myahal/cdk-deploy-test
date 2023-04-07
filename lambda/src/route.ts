import { Request, Response, Router } from "express";
import { DateTime } from 'luxon';

export const route = (): Router => {
  const router = Router()

  router.get('/api/hello', helloHandler)


  return router
}

async function helloHandler(req: Request, res: Response): Promise<void> {
  const dt = DateTime.local().setZone('Asia/Tokyo')
  res.json({
    now: dt.toISODate()
  })
}