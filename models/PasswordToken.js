const knex = require("../database/connection")
const UserModel = require("./User")

class Password {
  async create(email) {
    const user = await UserModel.findByEmail(email)
    if (user != undefined) {
      try {
        const token = Date.now()
        await knex
          .insert({
            user_id: user.id,
            used: 0,
            token: token, // UUID
          })
          .table("passwordtokens")

        return { status: true, token: token }
      } catch (err) {
        return { status: false, err: err }
      }
    } else {
      return {
        status: false,
        err: "O e-mail passado não existe no banco de dados!",
      }
    }
  }

  async validate(token) {
    try{
      const result = await knex.select().where({token: token}).table("passwordtokens");

      if(result.length > 0){

          const tk = result[0];

          return tk.used ? {status: false} : {status: true, token: tk};
         

      }else{
          return {status: false};
      }
  }catch(err){
      console.log(err);
      return {status: false};
  }
  }

  async setUsed(token) {
    await knex.update({used: 1}).where({token: token}).table("passwordtokens")
  }
}

module.exports = new Password()
