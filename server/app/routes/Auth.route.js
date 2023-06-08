const { Signup, Signin } = require("../controllers/Auth.controller");
const { UserVerification } = require("../middlewares/Auth.middleware");
const router = require("express").Router();

router.post("/signup", Signup);
router.post("/signin", Signin);
router.post('/', UserVerification);

module.exports = router;