
import express, { Express, NextFunction, Request, Response } from 'express'
import { Server } from 'http'
import { route } from './route'

export class App {
  public express: Express = express()
  private server?: Server

  public async init(): Promise<void> {
    // Handler設定
    process.on('SIGTERM', this.stopSignalHandler.bind(this))
    process.on('SIGINT', this.stopSignalHandler.bind(this))
    
    // express 設定
    this.express.disable('x-powered-by')

    // リクエストの設定
    this.express.use(express.json())

    // route設定
    this.express.use(route())

    // NotFound Error
    this.express.use(this.notFoundHandler.bind(this))
    this.express.use(this.errorHandler.bind(this))
  }

  public notFoundHandler(req: Request, res: Response): void {
    res.status(404).json({
      result: false
    })
  }

  public errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
    console.error(`ERROR: ${err.stack || err.toString()}`)
    // headersSent: Boolean property that indicates if the app sent HTTP headers for the response.
    if (!res.headersSent) {
      res.status(500).json({
        result: false
      })
    }
  }

  public stopSignalHandler(): void {
    this.shutDown()
  }

  public shutDown(softly = false): void {
    if (this.server) {
      this.server.close()
    } 
  }

  public run(port: number, callback?: () => void): Server {
    this.server = this.express.listen(port, callback)
    return this.server
  }
}