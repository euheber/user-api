const express = require("express")
const router = express.Router();
const HomeController = require("../controllers/HomeController");
const UserControler = require("../controllers/UserController")

router.get('/', HomeController.index);
router.get("/users", UserControler.index)
router.get("/user/:id", UserControler.findUser)
router.post("/user", UserControler.create)
router.put("/user", UserControler.edit)
router.delete("/user/:id", UserControler.remove)
router.post("/recoverpassword", UserControler.recoverPassword)
router.post("/changepassword", UserControler.changePassword)
router.post("/login", UserControler.login)

//  '$2b$10$b2Vf4ItgPBPozbJxAHw93ubKKZyMo/.DoQCSuppsnqIxl1YDWQ2eW'
//  '$2b$10$b2Vf4ItgPBPozbJxAHw93ubKKZyMo/.DoQCSuppsnqIxl1YDWQ2eW'
module.exports = router;