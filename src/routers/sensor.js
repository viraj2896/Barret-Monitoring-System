const express = require('express')
const authOrganization = require('../middleware/authOrganization')
const auth = require('../middleware/auth')
const Sensor = require('../models/sensor')
const Room = require('../models/room')
const Gateway = require('../models/gateway')
const Organization = require('../models/organization')

const router = new express.Router()

router.post('/sensor', authOrganization, async (req, res) => {
    const sensor = new Sensor(req.body)
    try{
      await sensor.save();
      res.status(201).send(sensor)
    }catch(e){
      res.status(400).send(e)
    }
})

router.get('/sensor', auth, async (req, res) => {
  try{
    const orgs = req.user.organizations
    const sensors = []
    for(var i in orgs){
      await orgs[i].populate('sensors').execPopulate()
      orgs[i].sensors.forEach(a => a)
      sensors.push(orgs[i].sensors)
    }
    res.send(sensors)
  }catch(e){
    res.status(500).send(e)
  }
})

router.get('/sensor/find/:id', auth, async (req, res) => {
  const _id = req.params.id
  try{
    const sensor = await Sensor.findById(_id)
    if(!req.user.organizations.find(a => a._id == sensor.owner.toString())) return res.status(404).send()
    if(!sensor) return res.status(404).send()
    res.send(sensor)
  }catch(e){
    res.status(500).send(e)
  }
})

router.patch('/sensor/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'position', 'room', 'gateway']
  const isValidOperarion = updates.every((update) => allowedUpdates.includes(update))
  if(!isValidOperarion) return res.status(404).send({error: "Invalid updates"})
  try{
    const sensor = await Sensor.findOne({_id: req.params.id})
    if(!sensor) return res.status(404).send()
    if(!req.user.organizations.find(a => a.id == sensor.owner.toString())) return res.status(404).send()

    updates.forEach(a => sensor[a] = req.body[a])
    await sensor.save()
    res.send(sensor)
  }catch(e){
    res.status(400).send(e)
  }
})

router.delete('/sensor/:id', auth, async (req, res) => {
  const _id = req.params.id
  try{
    const sensor = await Sensor.findOne({_id})
    if(!req.user.organizations.find(a => a.id == sensor.owner.toString())) return res.status(404).send()
    await sensor.delete({_id})
    if(!sensor) return res.status(404).send()
    res.send(sensor)
  }catch(e){
    res.status(500).send(e)
  }
})

module.exports = router