const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/Users/user");
const Profile = require("../../models/Profile/profile");
const { check, validationResult } = require("express-validator");

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

//@route    POST api/profile
//@desc     Create user profile
//@access   Private

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkdin,
    } = req.body;

    //Build profile object

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    //build social object

    profileFields.social = {};
    if (youtube) profileFields.youtube = youtube;
    if (twitter) profileFields.twitter = twitter;
    if (facebook) profileFields.facebook = facebook;
    if (instagram) profileFields.instagram = instagram;
    if (linkdin) profileFields.linkdin = linkdin;

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      //create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

//@route    GET api/profile
//@desc     Get all user profile
//@access   Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

//@route    GET api/profile/user/:user_id
//@desc     Get Profile by user id
//@access   Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      res.status(400).send({ msg: "Profile Not Found" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == ObjectId) {
      res.status(400).send({ msg: "Profile Not Found" });
    }
    return res.status(500).send("Server Error");
  }
});

//@route    Delete api/profile
//@desc     Delete Profile, user & posts
//@access   Private

router.delete("/", auth, async (req, res) => {
  try {
    //@To-do remove posts

    // remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    // remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User Deleted" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

//@route    PUT api/profile/experience
//@desc     Update user experience
//@access   Private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "title is required").not().isEmpty(),
      check("company", "company is required").not().isEmpty(),
      check("from", "from is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      to,
      from,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      to,
      from,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route    Delete api/profile/experience/:exp_id
//@desc     delete user experience
//@access   Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;