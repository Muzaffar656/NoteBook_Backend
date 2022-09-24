const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require("../middelware/fetchuser");
const { body, validationResult } = require('express-validator');


router.get("/fetchallnotes", fetchuser, async (req, res) => {
  const notes = await Notes.find({ user: req.user.id });
  // console.log(req.user.id)
  res.json(notes);
});

// Router

router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "Enter the title Cannot to Blank"),
    body("description", "Enter the description Cannot to Blank"),
    body("tag",'Enter tag relate with this note')
  ],
  async (req, res) => {
    try {
      const { title, description,tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);


router.put('/updatenote/:id',fetchuser,async(req,res)=>{
  // const {title,description,tag} = req.body;
  // const newNote = {}
  // if(title){newNote.title === title};
  // if(description){newNote.description === description};
  // if(tag){newNote.tag === tag};

  // let note = await Notes.findById(req.params.id)
  // if(!note){return res.status(401).send('not allowed')}
  // if(note.user.toString() !== req.user.id){return res.status(401).send('not allowed to string')}

  // note = await Notes.findByIdAndUpdate(req.params.id,{$set : newNote},{new : true})
  // res.json({note})

  const { title, description, tag } = req.body;
  try {
      // Create a newNote object
      const newNote = {};
      if (title) { newNote.title = title };
      if (description) { newNote.description = description };
      if (tag) { newNote.tag = tag };

      // Find the note to be updated and update it
      let note = await Notes.findById(req.params.id);
      if (!note) { return res.status(404).send("Not Found") }

      if (note.user.toString() !== req.user.id) {
          return res.status(401).send("Not Allowed");
      }
      note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
      res.json({ note });
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
  }

})


router.delete('/deletenote/:id',fetchuser,async(req,res)=>{
  const { title, description, tag } = req.body;
  try {
  

      // Find the note to be updated and update it
      let note = await Notes.findById(req.params.id);
      if (!note) { return res.status(404).send("Not Found") }

      if (note.user.toString() !== req.user.id) {
          return res.status(401).send("Not Allowed");
      }
      note = await Notes.findByIdAndDelete(req.params.id)
      res.json({ "Sucsse":"Notes has been deleted",note:note });
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
  }

})



module.exports = router;
