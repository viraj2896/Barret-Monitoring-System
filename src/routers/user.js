 const express = require('express')
 const User = require('../models/user')
 const Organization = require('../models/organization')
 const auth = require('../middleware/auth')
 const authAdmin = require('../middleware/authAdmin')
 const jwt = require('jsonwebtoken')
 const session = require('express-session')

 const router = new express.Router()

router.post('/users', async (req, res) => {
  console.log('users',req.body)
    const user = new User(req.body)
    try{
      await user.save()
      const token = await user.generateAuthToken()
      req.session.tk = token
      res.status(201).send({user, token})
    }catch(e){
      console.log(e)
      res.status(400).send(e)
    }
})

/**
 * Admin login
 */

router.post('/admin/login', async (req, res) => {
  try {
      const user = await User.findByCredentials(req.body.email, req.body.password, { role: 'admin' })
      const token = await user.generateAuthToken()
      req.session.tk = token
      res.send({ user, token })
  } catch (e) {
      res.status(400).send()
  }
})

router.post('/users/login', async (req, res) => {
  try {
      const user = await User.findByCredentials(req.body.email, req.body.password)
      const token = await user.generateAuthToken()
      req.session.tk = token
      res.send({ user, token })
  } catch (e) {
      res.status(400).send()
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try{
    req.user.tokens = req.user.tokens.filter(a => a.token !== req.token)
    await req.user.save()
    res.send()
  }catch(e){
    res.status(500).send()
  }
})

router.post('/users/logoutAll', auth, async (req, res) => {
  try{
    req.user.tokens = []
    await req.user.save()
    res.send()
  }catch(e){
    res.status(500).send()
  }
})

router.get('/users', authAdmin, async (req, res) => {
  const users = await User.find({})
  res.send(users)
})

router.get('/users/me', auth, async (req, res) => {
  const user = await req.user.populate('organizations').execPopulate()
  res.send(user)
})

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password']
  const isValidOperarion = updates.every((update) => allowedUpdates.includes(update))
  if(!isValidOperarion) return res.status(404).send({error: "Invalid updates"})
  try{
    const user = req.user
    updates.forEach((a) => req.user[a] = req.body[a])
    await req.user.save()
    res.send(user)
  }catch(e){
    res.status(400).send(e)
  }
})

router.patch('/users/manageOrganizations/:userId', authAdmin, async (req, res) => {
  const user = await User.findById(req.params.userId)
  if(!user) return res.status(404).send({error: "User not found"})

  user.organizations = req.body.organizations
  try{
    await user.save()
    res.send(user)
  }catch(e){
    res.status(400).send(e)
  }
})

router.delete('/users/me', auth, async (req, res) => {
  try{
    await req.user.remove()
    res.send(req.user)
  }catch(e){
    res.status(500).send(e)
  }
})

module.exports = router