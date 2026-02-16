const express = require("express");
const app = express();
app.get("/",(req,res)=>{
    res.send("HI i am a roooot");
});
app.listen(3000,()=>{
    console.log("server is listing to the port");
})