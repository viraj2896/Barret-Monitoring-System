const express = require('express')
const authOrganization = require('../middleware/authOrganization')
const auth = require('../middleware/auth')
const Room = require('../models/room')
const Organization = require('../models/organization')

const router = new express.Router()

router.post('/room', authOrganization, async (req, res) => {
    const room = new Room(req.body)
    try{
      await room.save();
      res.status(201).send(room)
    }catch(e){
      res.status(400).send(e)
    }
})

router.get('/room', auth, async (req, res) => {
  try{
    const orgs = req.user.organizations
    const rooms = []
    for(var i in orgs){
      await orgs[i].populate('rooms').execPopulate()
      orgs[i].rooms.forEach(a => a)
      rooms.push(orgs[i].rooms)
    }
    res.send(rooms)
  }catch(e){
    res.status(500).send(e)
  }
})

router.get('/room/find/:id', auth, async (req, res) => {
  const _id = req.params.id
  try{
    const room = await Room.findById(_id)
    if(!req.user.organizations.find(a => a._id == room.owner.toString())) return res.status(404).send()
    if(!room) return res.status(404).send()
    res.send(room)
  }catch(e){
    res.status(500).send(e)
  }
})

router.patch('/room/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'width', 'length']
  const isValidOperarion = updates.every((update) => allowedUpdates.includes(update))
  if(!isValidOperarion) return res.status(404).send({error: "Invalid updates"})
  try{
    const room = await Room.findOne({_id: req.params.id})
    if(!room) return res.status(404).send()
    if(!req.user.organizations.find(a => a.id == room.owner.toString())) return res.status(404).send()

    updates.forEach(a => room[a] = req.body[a])
    await room.save()
    res.send(room)
  }catch(e){
    res.status(400).send(e)
  }
})

router.delete('/room/:id', auth, async (req, res) => {
  const _id = req.params.id
  try{
    const room = await Room.findOne({_id})
    if(!req.user.organizations.find(a => a.id == room.owner.toString())) return res.status(404).send()
    await room.delete({_id})
    if(!room) return res.status(404).send()
    res.send(room)
  }catch(e){
    res.status(500).send(e)
  }
})

module.exports = router