//Server Constants
const express = require('express');
const app = express();
const port = 3000
const cors = require('cors');
const path = require('path');
const { config } = require('./config');

//Auth
const passport = require('passport');
const boom = require("@hapi/boom")

//MQTT Constants
const mqtt = require('mqtt')
const host = 'broker.emqx.io'
const mqtt_port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const connectUrl = `mqtt://${host}:${mqtt_port}`
const topic = '/nodejs/mqtt/ifarm'

const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'emqx',
    password: 'public',
    reconnectPeriod: 1000,
  })


const iFarmApi = require('./src/routes/index');

const {
    logErrors,
    wrapErrors,
    errorHandler 
} = require('./src/utils/middleware/errorHandlers')

const notFoundHandler = require('./src/utils/middleware/notFoundHandler');
const user = require('./src/models/user');

//Const init
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/api/assets', express.static(path.join(__dirname, './public')));


// Init Routes for DB API
iFarmApi(app);

//MQTT Client "On method"
client.on('connect', () => {
  client.subscribe([topic], () => {
    console.log(`\nSuscrito a '${topic}'`)
  })
})

client.on('message', (topic, payload) => {
    console.log('Mensaje recibido:', topic, payload.toString())
  })

client.on('connect', () => {
    client.publish(topic, 'PROBANDO MQTT EN TOPICO CON BROKER LOCAL', { qos: 0, retain: false }, (error) => {
        if (error) {
            console.error(error)
        }
    })
})

app.get('/', (req, res) => {
  res.send('Backend para la aplicación de iFarm')
})

//Google Oauth
app.get("/auth/google-oauth", passport.authenticate("google-oauth", {
  scope: ['email', 'profile', 'openid']
}));

app.get("/auth/google-oauth/callback", passport.authenticate("google-oauth",{session: false}),
  function(req, res, next){
    if(!req.user){
      next(boom.unauthorized());
    }

    const {token, ...user} = req.user;

    res.cookie("token", token, {
      httpOnly: !config.dev,
      secure: !config.dev
    });
    }
);

//Handlers
app.use(notFoundHandler);
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, config.host, function() {

    console.log(`\nEjecutando localmente en ${config.host}:${config.port}`);
});