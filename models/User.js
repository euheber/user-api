const knex = require("../database/connection")
const bcrypt = require("bcrypt")


class User {
  async update(id, email, name, role) {
    const user = await this.findById(id)

    if (user) {
      const editUser = {}

      if (email != undefined) {
        if (email != user.email) {
          const result = await this.findEmail(email)
          if (result == false) {
            editUser.email = email
          } else {
            return { status: false, err: "O e-mail já está cadastrado" }
          }
        }
      }

      if (name != undefined) {
        editUser.name = name
      }

      if (role != undefined) {
        editUser.role = role
      }

      try {
        await knex.update(editUser).where({ id: id }).from("users")

        return { status: true }
      } catch (err) {
        return { status: false, err: err }
      }
    } else {
      return { status: false, err: "O usuário não existe!" }
    }
  }

  async findAll() {
    try {
      const result = await knex
        .select(["id", "name", "email", "role"])
        .table("users")
      return result
    } catch (err) {
      console.log(err)
      return []
    }
  }

  async findById(id) {
    try {
      const result = await knex
        .select(["id", "name", "email", "role"])
        .where({ id: id })
        .table("users")
      if (result.length > 0) {
        return result[0]
      } else {
        return undefined
      }
    } catch (e) {
      console.log(e)
      return undefined
    }
  }

  async newUser(name, email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10)
      await knex
        .insert({ name, email, password: hashedPassword, role: 0 })
        .table("users")
    } catch (erro) {
      console.log(erro)
    }
  }

  async findEmail(email) {
    try {
      const result = await knex
        .select("*")
        .where({ email: email })
        .from("users")
      if (result.length > 0) {
        return true
      } else {
        return false
      }
    } catch (e) {
      console.log(e)
    }
  }

  async findByEmail(email){
    try{
        const result = await knex.select(["id","email","password","role","name"]).where({email:email}).table("users");

        if(result.length > 0){
            return result[0];
        }else{
            return undefined;
        }

    }catch(err){
        console.log(err);
        return undefined;
    }
}

  async delete(id) {
    const user = await this.findById(id)
    if (user) {
      try {
        await knex.delete().where({ id: id }).table("users")
        return { status: true}
      } catch (e) {
        return { status: false, err: e }
      }
    } else {
      return { status: false, err: "Usuario não existe" }
    }
  }


  async changePassword(password, id, token){ 
    const hashedPassword = await bcrypt.hash(password, 10)

    await knex.update({password:hashedPassword}).where({id:id}).table("users")
  }
}

module.exports = new User()
