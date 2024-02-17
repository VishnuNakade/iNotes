const express = require('express');
const router =express.Router();
const Note=require('../models/Note')

var fetchuser=require('../middlewre/fetchuser');
const { body, validationResult } = require('express-validator');

 // Route 1: Get All The Notes using  : Get "/api/notes/getuser" Login Required
router.get('/fetchallnotes',fetchuser,async(req,res)=>{
    try {
        const notes = await Note.find({user:req.user.id});//id pass karunga with help of fetchuser
        res.json(notes)
        
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error");
    }

})

 // Route 2: Add a New Notes using : POST "/api/notes/addnote" Login Required
 router.post('/addnote',fetchuser,[
    body('title','Enter a valid title').isLength({ min: 3 }),
    body('discription','Enter a valid discription').isLength({ min: 5 }), 
 ],async(req,res)=>{
    const {title,discription, tag}=req.body;
    
    //if there are errors, return bad request and the errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    
  const note = new Note({
    title,discription,tag,user:req.user.id
  })
    const saveNote =await note.save()    
    res.json(saveNote)
} catch (error) {
    console.error(error.message)
    res.status(500).send("Internal server error");
}

})

// Route 3: Updating an existing Note using  : PUT "/api/notes/updatenote" Login Required

router.put('/updatenote/:id',fetchuser,async(req,res)=>{
    const {title,discription, tag}=req.body;
    // Create a new note object
    const newNote ={};
    if(title){newNote.title=title};
    if(discription){newNote.discription=discription};
    if(tag){newNote.tag=tag};

    //Find the note and updated and update it
    let note =await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Note Found")}

    if (note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note= await Note.findByIdAndUpdate(req.params.id,{$set:newNote}, {new:true})
    res.json({note});
 })

 // Route 4: Delete an existing Note using  : DELETE "/api/notes/deletenote" Login Required

router.delete('/deletenote/:id',fetchuser,async(req,res)=>{

   try {
    
  
    //Find the note and delete and delete it
    let note =await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Note Found")}

    //Allow  deletion only if user owns this Note
    if (note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note= await Note.findByIdAndDelete(req.params.id)
    res.json({"Succes":"Note has been deleted",note:note});

} catch (error) {
    console.error(error.message)
    res.status(500).send("Internal server error");
}
 })

module.exports=router