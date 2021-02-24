const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Contact = require("../models/Contact");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

// @route    GET api/contacts
// @desc     Get all users contacts
// @access   Private

router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
});

// @route    POST api/contacts
// @desc     Add new contact
// @access   Private

router.post(
  "/",
  auth,
  [check("name", "Name is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;
    try {
      let newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });

      await newContact.save();
      res.json(newContact);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("server Error");
    }
  }
);

// @route    PUT api/contacts/:id
// @desc     update contact
// @access   Private

router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  //Build contact object
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: "contact not found" });

    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );

    res.json(contact);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server Error");
  }
});

// @route    DELETE api/contacts/:id
// @desc     delete contact
// @access   Private

router.delete("/:id", auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: "contact not found" });

    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Contact.findByIdAndRemove(req.params.id);

    res.json({ msg: "contact remove" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server Error");
  }
});

module.exports = router;
