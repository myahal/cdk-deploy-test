import { App } from './app'

const app = new App()
app.init().then(() => {
  const port = Number(process.env.SERVER_PORT ?? "3000")
  app.run(port, function() {
    console.log(`App listen on port ${port}`)
  })
}).catch((e: unknown) => {
  console.error(e)
})