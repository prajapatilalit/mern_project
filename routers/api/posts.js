const express = require("express");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/Users/user");
const Profile = require("../../models/Profile/profile");
const Post = require("../../models/Posts/posts");
const { check, validationResult } = require("express-validator");

//@route    POST api/posts
//@desc     Create a Post
//@access   Private

router.post(
  "/",
  [auth, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avator,
        user: req.user.id,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route    GET api/posts
//@desc     Get Post
//@access   Private

module.exports = router;
