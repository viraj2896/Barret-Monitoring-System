const express = require('express')
const authOrganization = require('../middleware/authOrganization')
const auth = require('../middleware/auth')
const Gateway = require('../models/gateway')
const Organization = require('../models/organization')

const router = new express.Router()

router.post('/gateway', authOrganization, async (req, res) => {
    const gateway = new Gateway(req.body)
    try{
      await gateway.save();
      res.status(201).send(gateway)
    }catch(e){
      res.status(400).send(e)
    }
})

router.get('/gateway', auth, async (req, res) => {
  try{
    const orgs = req.user.organizations
    const gateways = []
    for(var i in orgs){
      await orgs[i].populate('gateways').execPopulate()
      orgs[i].gateways.forEach(a => a)
      gateways.push(orgs[i].gateways)
    }
    res.send(gateways)
  }catch(e){
    res.status(500).send(e)
  }
})

router.get('/gateway/find/:id', auth, async (req, res) => {
  const _id = req.params.id
  try{
    const gateway = await Gateway.findById(_id)
    if(!req.user.organizations.find(a => a._id == gateway.owner.toString())) return res.status(404).send()
    if(!gateway) return res.status(404).send()
    res.send(gateway)
  }catch(e){
    res.status(500).send(e)
  }
})

router.patch('/gateway/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'ip']
  const isValidOperarion = updates.every((update) => allowedUpdates.includes(update))
  if(!isValidOperarion) return res.status(404).send({error: "Invalid updates"})
  try{
    const gateway = await Gateway.findOne({_id: req.params.id})
    if(!gateway) return res.status(404).send()
    if(!req.user.organizations.find(a => a._id == gateway.owner.toString())) return res.status(404).send()

    updates.forEach(a => gateway[a] = req.body[a])
    await gateway.save()
    res.send(gateway)
  }catch(e){
    res.status(400).send(e)
  }
})

router.delete('/gateway/:id', auth, async (req, res) => {
  const _id = req.params.id
  try{
    const gateway = await Gateway.findOne({_id})
    console.log()
    if(!req.user.organizations.find(a => a._id == gateway.owner.toString())) return res.status(404).send()
    await gateway.delete({_id})
    if(!gateway) return res.status(404).send()
    res.send(gateway)
  }catch(e){
    res.status(500).send(e)
  }
})

module.exports = router