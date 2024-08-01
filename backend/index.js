
const path = require('path');
const dotenv = require("dotenv");
dotenv.config({
    path: path.resolve(__dirname, '../.env'), // Adjust this path according to your folder structure
  });
const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);
const User = require("./models/user.model");
const Note = require("./models/note.model");


const express = require("express");
const cors = require("cors");

const app = express();

const jwt = require("jsonwebtoken");

const {authenticateToken} = require("./utilities");


app.use(express.json());

app.use (
    cors({
        origin:"*"
    })
)

// app.get("/", (req, res) => {
//     res.json({data:"hello world"})
// })


// create Account
app.post("/create-account" , async (req, res) =>{
    
    const {fullName , email , password} = req.body;
    
    if(!fullName){
        return res.status(400).json({error:"Please enter your name"})
    }
    if(!email){
        return res.status(400).json({error:"Please enter your email"})
    }
    if(!password){
        return res.status(400).json({error:"Please enter your password"})
    }

    const isUser = await User.findOne({email :email});

    if(isUser){
        return res.status(400).json({error:"User already exists"})
    }

    const user = new User({
        fullName,
        email,
        password
    })

    await user.save();

    const accessToken = jwt.sign({user} , process.env.ACCESS_TOKEN_SECRET , {expiresIn:"3600m"})

    return res.json ({
        error:false , 
        user ,
        accessToken ,
        message:"Registration successful"
    })
})

app.post("/login", async (req , res)=>{
    
    const {email , password} = req.body;

    if(!email){
        return res.status(400).json({error:"Please enter your email"})
    }
    if(!password){
        return res.status(400).json({error:"Please enter your password"})
    }

    const userInfo = await User.findOne({email :email});
    if(!userInfo){
        return res.status(400).json({error:"User does not exist"})
    }

    if( userInfo.email == email && userInfo.password == password){
        
        const user = { user: userInfo};

        const accessToken = jwt.sign(user , process.env.ACCESS_TOKEN_SECRET , {expiresIn:"3600m"})   
        
        return res.json({
            error:false ,
            message:"Login Successful",
            email ,
            accessToken
        })
    }else {
        return res.status(400).json({
            error:true ,
            message:"Login Failed"
        })
    }

})


// Add note
app.post("/add-note", authenticateToken, async (req, res) => {

    const {title , content , tags}= req.body;
    const {user} = req.user;
    
    if(!title){
        return res.status(400).json({error:true, message:"Please enter a title"})
    }

    if(!content){
        return res.status(400).json({error:true, message:"Please enter the content"})
    }

    try {
        const note = new Note ({
            title ,
            content ,
            tags ,
            userId: user._id
        })

        await note.save()

        return res.json({
            error:false ,
            note ,
            message:"Note added Successfully"
        })
    } catch (error) {
        return res.status(500).json({error:true, message:error.message})
    }

 })

// Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {

    const noteId = req.params.noteId;
    const {title , content , tags , isPinned}= req.body;
    const {user} = req.user;
    if(!title && !content && !tags ){

        return res
        .status(400)
        .json({error:true, message:"Please provide at least one field to update"})
    
    }

    try {
        const note = await Note.findOne({_id:noteId , userId:user._id});

        if(!note){
            return res.status(404).json({error:true, message:"Note not found"})
        }
        note.title = title || note.title;
        note.content = content || note.content;
        note.tags = tags || note.tags;
        note.isPinned = isPinned || note.isPinned;
        await note.save();
        return res.json({
            error:false,
            note,
            message:"Note updated successfully"
        })
    } catch (error) {
        return res.status(500).json({error:true, message:error.message})
    }

})


// Get all notes
app.get("/get-all-notes" , authenticateToken, async (req, res) => {
    
    const {user} = req.user;

    try {
        const notes = await Note.find({userId:user._id}).sort({isPinned : -1});
        return res.json({
            error:false,
            notes,
            message:"Notes fetched successfully"
        })

    } catch (error) {
        return res.status(500).json({error:true, message:error.message})
    }
})

//delete note
app.delete("/delete-note/:noteId" , authenticateToken, async (req, res) => {

    const noteId = req.params.noteId;
    const {user} = req.user;

    try {
        
        const note = await Note.findOne({_id:noteId , userId:user._id});
        if(!note){
            return res.status(404).json({error:true, message:"Note not found"})
        }
        await Note.deleteOne({_id:noteId , userId:user._id});
        return res.json({
            error:false,
            message:"Note deleted successfully"
        })
    } catch (error) {
        
        return res.status(500).json({error:true, message:error.message})
    }
})


// Update isPinned

// app.put("/update-note-pinned/:noteId" , authenticateToken, async (req, res) => {

//     const noteId = req.params.noteId;
//     const { isPinned}= req.body;
//     const {user} = req.user;

//     if(isPinned === undefined){

//         return res
//         .status(400)
//         .json({error:true, message:"Please provide at least one field to update"})
    
//     }

//     try {
//         const note = await Note.findOne({_id:noteId , userId:user._id});

//         if(!note){
//             return res.status(404).json({error:true, message:"Note not found"})
//         }
        
//         note.isPinned = isPinned 
//         await note.save();
//         return res.json({
//             error:false,
//             note,
//             message:"Note updated successfully"
//         })
//     } catch (error) {
//         return res.status(500).json({error:true, message:error.message})
//     }

// })

app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;

    if (isPinned === undefined) {
        return res
            .status(400)
            .json({ error: true, message: "Please provide the 'isPinned' field to update" });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        note.isPinned = isPinned;
        await note.save();
        
        return res.json({
            error: false,
            note,
            message: "Note updated successfully"
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
});


// Get all notes
app.get("/get-all-note" , authenticateToken, async (req, res) => {
    
    const {user} = req.user;

    console.log(user._id)

    try {
        const notes = await Note.find({userId:user._id});
        return res.json({
            error:false,
            notes,
            message:"Notes fetched successfully"
        })

    } catch (error) {
        return res.status(500).json({error:true, message:error.message})
    }

 })


// get user
app.get("/get-user", authenticateToken , async (req , res)=>{
    const {user} = req.user;
    

    const isUser = await User.findOne({ _id:user._id});
    

    if(!isUser){
        return res.status(404).json({error:true, message:"User not found"})
    }
    return res.json({error:false, user , message:"User fetched successfully"})
})

// content search 
app.get("/search-notes/" , authenticateToken , async (req , res)=>{

    const {user} = req.user;
    const {query} = req.query;

    if(!query){

        return res
           .status(400)
           .json({error:true, message:"Please provide at least one field to search"})
    }

    try {
        const matchingNotes = await Note.find(
            {
                userId:user._id,
                $or:[
                    {title:{$regex: new RegExp(query, "i")}},
                    {content:{$regex: new RegExp(query, "i")}},
                ],
            }

            
        )

        return res.json ( {
            error:false , 
            notes:matchingNotes , 
            message:"Notes fetched successfully"
        })
    } catch (error) {

        return res.status(500).json({error:true, message:error.message})
        
    }


})

const staticPath = path.join(__dirname, "..", "frontend", "notes-app", "dist");
app.use(express.static(staticPath));

// Catch-All Route for Frontend
app.get("*", (req, res) => {
  res.sendFile(path.resolve(staticPath, "index.html"), (err) => {
    if (err) {
      console.error("Error sending index.html:", err);
      res.status(500).send("An error occurred while serving the application.");
    }
  });
});

const port = process.env.PORT || 8000;

app.listen(port , () => {
    console.log(`server is running on port http://localhost:${port}`)
});

module.exports = app;