const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/Users/user");
const Profile = require("../../models/Profile/profile");

//@route    GET api/profile/me
//@desc     Get current user profile
//@access   Private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "There is no profil of this user" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("sever error");
  }
});

module.exports = router;
