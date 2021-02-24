const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// @route    POST api/users
// @desc     Register a user
// @access   Public
router.post(
  "/",
  [
    check("name", "Please add name").not().isEmpty(),
    check("email", "Please include valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more charactors"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;
    console.log(name, email, password);
    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({
          msg: "User already exists",
        });
      }

      user = await User.create(req.body);

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).send("server Error");
    }
  }
);

// @route    GET api/users
// @desc     Get a user
// @access   Public
router.get("/", (req, res) => {
  res.send("get a User");
});

module.exports = router;
