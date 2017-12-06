//-------------------------------<MODULES>--------------------------------
const Koa = require('koa')
const Router = require('koa-router')
const Sequelize = require('sequelize')
const views = require('koa-views')
const static = require('koa-static')
const logger = require('koa-logger')
const bodyparser = require('koa-bodyparser')
const onerror = require('koa-onerror')
const path = require('path')
const env = process.env.NODE_ENV || 'development'
const config = require(__dirname + '/config.json')[env]
const port = process.env.PORT || config.port
//------------------------------</MODULES>--------------------------------

//--------------------------------<CONFIG>--------------------------------
const app = new Koa()
const router = new Router()
onerror(app)
app.use(logger())
app.use(static(__dirname + '/public'))
app.use(views(path.join(__dirname, '/views'), {
  options: {settings: {views: path.join(__dirname, 'views')}},
  map: {'njk': 'nunjucks'},
  extension: 'njk'
}))
app.use(bodyparser())

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: console.log,
    operatorsAliases: false,
    freezeTableName: true
  }
);
sequelize.authenticate()
.then(() => console.log(
  `Connection with the ${config.dialect} database established.`
))
.catch(err => console.log(
  `Unable to connect to the ${config.dialect} database: `, err
));
//-------------------------------</CONFIG>--------------------------------

//---------------------------------<MODEL>--------------------------------
var User = sequelize.define('user',
{
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  fullname: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

User.sync({force: true})
  .then(() => console.log('All models were mapped successfully.'))
  .catch(err => console.log('Unable to map the models. ', err));
//--------------------------------</MODEL>--------------------------------

//-----------------------------<CONTROLLER>-------------------------------
router.get('/testdb', ctx => {
  User.create({
    username: 'user',
    fullname: 'user',
    email: 'user@ya.ru',
    password: 'u'
  });
  User.create({
    fullname: 'admin',
    username: 'admin',
    email: 'admin@ya.ru',
    password: 'a'
  });
  ctx.redirect('/');
});

router.use((ctx, next) => {
  return next().catch(err => {
    ctx.status = err.status || 500;
    return ctx.render('pages/error404', {
      message: err.message,
      error: err
    });
  })
});

app.use(async ctx => {
  await ctx.render('pages/error404')
});

router.get('/', async ctx => {
  await ctx.render('pages/home')
})

app.use(router.routes(), router.allowedMethods())

app.listen(port, 8000)
//----------------------------</CONTROLLER>-------------------------------
