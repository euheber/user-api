const jwt = require("jsonwebtoken")

const secret = 'asoiuh1r12asedf51'

module.exports = function(req, res, next) {
    const authToken = req.headers['authorization']

    if(authToken != undefined){ 
        const bearer = authToken.split(' ')
        const token = bearer[1]

        const result = jwt.verify(token, secret)

        console.log(result);
        next()
    } else { 
        res.status(403)
        res.send("Você não está autenticado")
        return
    }
}