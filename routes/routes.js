const express = require("express")
const router = express.Router();
const HomeController = require("../controllers/HomeController");
const UserControler = require("../controllers/UserController")
const adminAuth = require("../middleware/midleware")


router.get('/', HomeController.index);
router.get("/users", adminAuth, UserControler.index)
router.get("/user/:id", UserControler.findUser)
router.post("/user", UserControler.create)
router.put("/user", UserControler.edit)
router.delete("/user/:id", UserControler.remove)
router.post("/recoverpassword", UserControler.recoverPassword)
router.post("/changepassword", UserControler.changePassword)
router.post("/login", UserControler.login)


module.exports = router;