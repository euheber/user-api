const UserModel = require("../models/User")
const PasswordModel = require("../models/PasswordToken")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const secret = "asoiuh1r12asedf51"

class UserController {
  async index(req, res) {
    const users = await UserModel.findAll()
    res.json(users)
  }

  async findUser(req, res) {
    const id = req.params.id
    const user = await UserModel.findById(id)
    if (user != undefined) {
      res.json(user)
      res.status(400)
    } else {
      res.status(400)
      res.json({})
    }
  }

  async create(req, res) {
    const { email, name, password } = req.body

    if (email == undefined || email == "" || email == " ") {
      res.status(400)
      res.json({ err: "Email inválido ou em branco" })
      return
    }

    const emailExists = await UserModel.findEmail(email)

    if (emailExists) {
      res.status(406)
      res.json({ err: "O e-mail já está cadastrado!" })
      return
    }

    if (name == undefined) {
      res.status(400)
      res.json({ err: "nome inválido ou em branco" })
      return
    }

    if (password == undefined) {
      res.status(400)
      res.json({ err: "senha inválida ou em branco" })
      return
    }

    res.status(200)
    res.send("tudo certo")
    await UserModel.newUser(name, email, password)
  }

  async edit(req, res) {
    const { id, email, name, role } = req.body

    const result = await UserModel.update(id, email, name, role)
    if (result != undefined) {
      if (result.status) {
        res.status(200)
        res.send("Done")
      } else {
        res.status(406)
        res.json(result)
      }
    } else {
      res.status(400)
      res.json(result)
    }
  }

  async remove(req, res) {
    const id = req.params.id

    const result = await UserModel.delete(id)

    if (result.status) {
      res.status(200)
      res.send("tudo ok")
    } else {
      res.status(406)
      res.send(result.err)
    }
  }

  async recoverPassword(req, res) {
    const email = req.body.email

    const result = await PasswordModel.create(email)

    if (result != undefined) {
      res.status(200)
      res.send(result.token + "")
    } else {
      res.status(406)
      res.send(result.err)
    }
  }

  async changePassword(req, res) {
    const { token, password } = req.body

    const isTokenValid = await PasswordModel.validate(token)
    if (isTokenValid.status) {
      await UserModel.changePassword(
        password,
        isTokenValid.token.user_id,
        isTokenValid.token.token
      )
      res.status(200)
      res.send("Senha alterada")
    } else {
      res.status(406)
      res.send("Token inválido!")
    }
  }

  async login(req, res) {
    const { email, password } = req.body

    const user = await UserModel.findByEmail(email)
    if (user) {
      const result = await bcrypt.compare(password, user.password)

      if (result) {
        const token = jwt.sign({ email: user.email, role: user.role }, secret)
        res.json({ token })
        res.status(200)
      } else {
        res.status(406)
        res.send("Senha incorreta")
      }
    } else {
      res.status(406)
      res.json({ status: false })
    }
  }
}

module.exports = new UserController()
