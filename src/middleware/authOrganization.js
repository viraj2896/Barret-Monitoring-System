const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authOrganization = async (req, res, next) => {
    try{
        const owner = req.body.owner || req.params.owner
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'ironmaidentoken')
        
        const user = await User.findOne({_id: decoded._id, 'tokens.token':token})
        if(!user) throw new Error()

        if(!user.organizations.find(a => a == owner)) throw new Error()
        
        req.token = token
        req.user = user
        req.organizationId = owner
        next()
    }catch(e){
        res.status(401).send({error: 'Please authenticate.'})
    }
}


module.exports = authOrganization 