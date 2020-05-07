const express = require('express')
const authAdmin = require('../middleware/authAdmin')
const auth = require('../middleware/auth')
const Organization = require('../models/organization')
const User = require('../models/user')

const router = new express.Router()

router.post('/organizations', authAdmin, async (req, res) => {
    const organization = new Organization(req.body)
    try{
      await organization.save();
      req.user.organizations.push(organization)      
      await req.user.save()
      res.status(201).send(organization)
    }catch(e){
      res.status(400).send(e)
    }
})

router.get('/organizations/all', authAdmin, async (req, res) => {
  try{
    const organization = await Organization.find({})
    res.send(organization)
  }catch(e){
    res.status(500).send(e)
  }
})

router.get('/organizations/:id', authAdmin, async (req, res) => {
  const _id = req.params.id
  try{
    const organization = await Organization.findOne({_id})
    if(!organization) return res.status(404).send()
    res.send(organization)
  }catch(e){
    res.status(500).send(e)
  }
})

router.get('/organizations', auth, async (req, res) => {
  try{
    const user = await req.user
    await user.populate('organizations').execPopulate()
    res.send(user.organizations)
  }catch(e){
    res.status(500).send(e)
  }
})

router.patch('/organizations/:id', authAdmin, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name']
  const isValidOperarion = updates.every((update) => allowedUpdates.includes(update))
  if(!isValidOperarion) return res.status(404).send({error: "Invalid updates"})

  try{
    const organization = await Organization.findOne({_id: req.params.id})
    if(!organization) return res.status(404).send()

    updates.forEach((update) => organization[update] = req.body[update])
    await organization.save()
    res.send(organization)
  }catch(e){
    res.status(400).send(e)
  }
})

router.delete('/organizations/:id', authAdmin, async (req, res) => {
  const _id = req.params.id
  try{
    const organization = await Organization.findOneAndDelete({_id})
    if(!organization) return res.status(404).send()
    res.send(organization)
  }catch(e){
    res.status(500).send(e)
  }
})

module.exports = router