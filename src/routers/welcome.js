const express = require('express')
const session = require('express-session')
const auth = require('../middleware/auth')
const hbs = require('hbs')
const User = require('../models/user')
const Organization = require('../models/organization')
const Room = require('../models/room')
const Gateway = require('../models/gateway')
const Sensor = require('../models/sensor')

const router = new express.Router()

router.get('/', async (req, res) => {
    res.render('signin', {
      title: 'Login',
      name: 'Davi Carvalho'
    })
  })

router.get('/signup', async (req, res) => {
  res.render('signup')
})

router.get('/admin/login', async (req, res) => {
  res.render('adminlogin')
})
  
router.get('/welcome', auth, async (req, res) => {
  try {
    res.render('welcome', {
      name: 'Davi Carvalho',
      organizations: req.user.organizations
    })
  } catch (e) {
    res.status(400).send()
  }
})

router.post('/welcome', auth, async (req, res) => {
  try {
    res.render('welcome', {
      title: 'Welcome',
      name: 'Davi Carvalho',
      organizations: req.user.organizations
    })
  } catch (e) {
    res.status(400).send()
  }
})

// router.get('/charts', auth, async (req, res) => {
//   try {
//     res.render('lineChart')
//   } catch (e) {
//     res.status(400).send()
//   }
// })

router.get('/admindash', auth, async (req, res) => {
  try {
    const users = await User.find({})
    res.render('admindash', {
      users: users
    })
  } catch (e) {
    res.status(400).send()
  }
})

router.post('/userdash', auth, async (req, res) => {
  try {
    res.render('userdash', {
      organizations: req.user.organizations
    })
  } catch (e) {
    res.status(400).send()
  }
})

router.get('/dashorgs', auth, async (req, res) => {
  try {
    const userorgs = await User.findOne({_id: req.query.id});
    var organizationsarr = [];
    userorgs.organizations.map(async function(d){
      const orgs = await Organization.findOne({_id: d._id})
      organizationsarr.push(orgs)
    })
    res.render('dashorgs', {
      organizations: organizationsarr
    })
  } catch (e) {
    res.status(400).send()
  }
})

router.get('/pages/organizations/:id', auth, async (req, res) => {
  try{
    const user = req.user
    const organization = await Organization.findById(req.params.id)
    res.render('organizations', {
      user: user,
      organization: organization
    })
  }catch(e){
    res.status(500).send(e)
  }
})

router.get('/pages/rooms/:id', auth, async (req, res) => {
  try{
    const rooms = await Room.find({owner: req.params.id})
    res.render('rooms', {
      rooms: rooms
    })
  }catch(e){
    res.status(500).send(e)
  }
})

router.get('/dashrooms', auth, async (req, res) => {
  try{
    const rooms = await Room.find({owner: req.query.id})
    
    var newArr = [];
    
    for(var i=0; i<rooms.length; i++){
      var newObj = {};
      newObj.roomId = rooms[i]._id;
      var sensor = await Sensor.findOne({room: rooms[i]._id});
      newObj.sensorId = sensor._id;
      newObj.sensorName = sensor.name;
      newObj.name = rooms[i].name;
      newArr.push(newObj);
    }

    res.render('dashrooms', {
      rooms: newArr
    })
  }catch(e){
    console.log(e)
    res.status(500).send(e)
  }
})

router.get('/dashsensors', auth, async (req, res) => {
  try{
    const sensors = await Sensor.find({room: req.query.id})
    res.render('dashsensors', {
      sensors: sensors,
    })
  }catch(e){
    console.log(e)
    res.status(500).send(e)
  }
})

router.get('/charts', auth, async (req, res) => {
  try{
    const sensors = await Sensor.findOne({_id: req.query.id})
    const room = await Room.findOne({_id: req.query.roomId});
    res.render('linechart', {
      sensors: sensors,
      room: room.name
    })
  }catch(e){
    console.log(e)
    res.status(500).send(e)
  }
})

router.get('/pages/gateways/:id', auth, async (req, res) => {
  try{
    const gateways = await Gateway.find({owner: req.params.id})
    res.render('gateways', {
      gateways: gateways
    })
  }catch(e){
    res.status(500).send(e)
  }
})

router.get('/pages/sensors/:organizationsId', auth, async (req, res) => {
  try{
    const sensors = await Sensor.find({owner: req.params.organizationsId})
    for(var i in sensors){
      await sensors[i].populate('room').execPopulate()
      await sensors[i].populate('gateway').execPopulate()
    } 
    res.render('sensors', {
      sensors: sensors
    })
  }catch(e){
    console.log(e)
    res.status(500).send(e)
  }
})

router.get('/pages/organizationsForm', auth, async (req, res) => {
  try{
    res.render('organizationsForm')
  }catch(e){
    res.status(500).send(e)
  }
})

router.get('/pages/organizationsForm/:id', auth, async (req, res) => {
  try{
    const organization = await Organization.findById(req.params.id)
    res.render('organizationsForm', {
      organization: organization
    })
  }catch(e){
    res.status(500).send(e)
  }
})
router.get('/pages/alertsForm', auth, async (req, res) => {
  try{
    res.render('alertsForm')
  }catch(e){
    res.status(500).send(e)
  }
})
router.get('/pages/userdash', auth, async (req, res) => {
  try{
    res.render('userdash')
  }catch(e){
    res.status(500).send(e)
  }
})

router.get('/pages/alertsForm/:id', auth, async (req, res) => {
  try{
    const alert = await Alert.findById(req.params.id)
    res.render('alertsForm', {
      alert: alert
    })
  }catch(e){
    res.status(500).send(e)
  }
})

router.get('/pages/sensorsForm/:organizationId', auth, async (req, res) => {
  try{
    const organization = await Organization.findById(req.params.organizationId)
    await organization.populate('rooms').execPopulate()
    await organization.populate('gateways').execPopulate()
    if(req.params.id){
      const sensor = await Sensor.findById(req.params.id)
    }
    res.render('sensorsForm', {
      organization: organization
    })
  }catch(e){
    res.status(500).send(e)
  }
})

router.get('/pages/sensorsForm/:organizationId/:id', auth, async (req, res) => {
  try{
    const organization = await Organization.findById(req.params.organizationId)
    await organization.populate('rooms').execPopulate()
    await organization.populate('gateways').execPopulate()
    const sensor = await Sensor.findById(req.params.id)
    if(req.params.id){
      const sensor = await Sensor.findById(req.params.id)
    }
    res.render('sensorsForm', {
      organization: organization,
      sensor: sensor
    })
  }catch(e){
    res.status(500).send(e)
  }
})

module.exports = router