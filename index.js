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

//Init resources
const GreenhouseController = require("./src/controllers/greenhouse");
const greenhouseAPIController = new GreenhouseController();

const CalendarController = require("./src/controllers/calendar");
const { update } = require('./src/models/user');
const calendarAPIController = new CalendarController();

// Init Routes for DB API
iFarmApi(app);

//MQTT Client "On method"
client.on('connect', () => {
  client.subscribe([topic], () => {
    console.log(`\nSuscrito a '${topic}'`)
  })
})

client.on('message', async (topic, payload) => {
    var dailyData = JSON.parse(payload.toString())
    console.log('Mensaje recibido:', topic, dailyData)

    var req = {'device_id': dailyData.Id.toString()}

    try {
      let greenhousesArray = await greenhouseAPIController.getGreenhouses(req);

      var currGreenhouseID;
      var currGreenhouseObj;

      for (var i = 0; i < greenhousesArray.length; i+=1) {
        var greenhouseObj = { 'humidity': Math.round(dailyData.GroundHumidity),
                              'temperature': Math.round(dailyData.Temperature),
                              'light': Math.round(dailyData.Lighting) }

        let greenhouseId = greenhousesArray[i]._id;
        let greenhouse = greenhouseObj;
        currGreenhouseID = greenhouseId;
        currGreenhouseObj = greenhouseObj;

        let greenhouseUpdateRes = await greenhouseAPIController.updateGreenhouse({ greenhouseId, greenhouse });
        
        console.log()
      }

      const d = new Date();
      
      if (d.getHours()%3 == 0) {
        if (d.getMinutes() == 0){

          let currentDate = d.toISOString().slice(0, 10)
          let hour = d.getHours()
          var filter = { 'date': currentDate.toString(),
                         'greenhouse_id': currGreenhouseID.toString() }

          let currDateObj = await calendarAPIController.getDates(filter);

          currDateObj = currDateObj[0]

          currDateObj.dailyData[hour] = { 'light': currGreenhouseObj.light, 
                                                 'humidity': currGreenhouseObj.humidity, 
                                                 'temperature': currGreenhouseObj.temperature }

          delete Object.assign(currDateObj, {'id': currDateObj._id })._id

          let updatedDateObj = await calendarAPIController.updateDate({dateId: currDateObj.id, date: currDateObj})
        }
      } 

    }
    catch(e) {
      console.log("Error", e);
    }
  })

client.on('connect', () => {
    // client.publish(topic, 'PROBANDO MQTT EN TOPICO CON BROKER LOCAL', { qos: 0, retain: false }, (error) => {
    //     if (error) {
    //         console.error(error)
    //     }
    // })
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