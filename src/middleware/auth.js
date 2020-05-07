const jwt = require('jsonwebtoken')
const User = require('../models/user')
const session = require('express-session')

const auth = async (req, res, next) => {
    try{
        let token = ''
        if(!req.session.tk){
            if(req.header('Authorization')){
                token = req.header('Authorization').replace('Bearer ', '')
            }
        }else{
            token = req.session.tk
        }
        const decoded = jwt.verify(token, 'ironmaidentoken')
        
        const user = await User.findOne({_id: decoded._id, 'tokens.token':token})
        
        if(!user) throw new Error()

        await user.populate('organizations').execPopulate()
        
        req.token = token
        req.user = user 
        req.session.tk = token
        
        next()
    }catch(e){
        res.status(401).send({error: 'Please authenticate.'})
    }
}


module.exports = auth 