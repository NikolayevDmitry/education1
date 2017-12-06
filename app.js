//-------------------------------<MODULES>--------------------------------
const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const static = require('koa-static')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const path = require('path')

const config = {port : 8000}
//------------------------------</MODULES>--------------------------------

//--------------------------------<CONFIG>--------------------------------
const app = new Koa()
const router = new Router()
const port = process.env.PORT || config.port
onerror(app)
app.use(bodyparser())
app.use(static('__dirname + /public'))
app.use(logger())
app.use(views(path.join(__dirname, '/views'), {
  options: {settings: {views: path.join(__dirname, 'views')}},
  map: {'njk': 'nunjucks'},
  extension: 'njk'
}))

//-------------------------------</CONFIG>--------------------------------

//---------------------------------<MODEL>--------------------------------
//--------------------------------</MODEL>--------------------------------

//-----------------------------<CONTROLLER>-------------------------------
router.get('/users/:id', (ctx, next) => {
  ctx.body = "Hello user number " + ctx.params.id
 })

router.get('/', (ctx, next) => {
  ctx.body = "Hello world"
})

app.use(router.routes())

app.listen(port, 8000)
//----------------------------</CONTROLLER>-------------------------------
