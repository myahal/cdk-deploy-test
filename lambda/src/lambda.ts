import serverlessExpress from '@vendia/serverless-express';
import { App } from "./app";

const app = new App()
let serverlessExpressInstance: any

async function setup(event: unknown, context: unknown) {
  await app.init()

  serverlessExpressInstance = serverlessExpress({app: app.express})
  return serverlessExpressInstance(event, context)
}

function handler(event: unknown, context: unknown) {
  if(serverlessExpressInstance) return serverlessExpressInstance(event, context)

  return setup(event, context)
}

exports.handler = handler