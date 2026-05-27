// mongoose
const mongoose=require('mongoose');
const dotenv=require('dotenv').config({quiet:true});

// db url
const Url=process.env.DATABASEURL

// creating a function
const ConnectionDataBase=async()=>{
    try {
        const data=await mongoose.connect(Url,{dbName:process.env.DATABASENAME});
        console.log(`DataBase connection sucessfully to database:${process.env.DATABASENAME}`)
    } catch (error) {
        console.log(`DataBase connection issues to database:${process.env.DATABASENAME}`)
    }
}

// modules exports
const DataBase=ConnectionDataBase()
module.exports=DataBase