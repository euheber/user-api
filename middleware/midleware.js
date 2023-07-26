const jwt = require("jsonwebtoken")

const secret = "asoiuh1r12asedf51"

module.exports = function (req, res, next) {
  const authToken = req.headers["authorization"]
  if(authToken != undefined){
    const bearer = authToken.split(' ');
    const token = bearer[1];

    try{
        const decoded = jwt.verify(token,secret);
        
        if(decoded.role){
            next();
        }else{
            res.status(403);
            res.send("Você não tem permissão para isso!");
            return;
        }
    }catch(err){
        res.status(403);
        res.send("Você não está autenticado");
        return;
    }
}else{
    res.status(403);
    res.send("Você não está autenticado");
    return;
}
}
