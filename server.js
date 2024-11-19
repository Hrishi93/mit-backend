const express= require('express');
const mongoose = require('mongoose'); // TPM - Connect with DB using BE
const cors = require('cors');

//pluggings
port = 5008;
DB = "mongodb://localhost:27017/employeeDB" ;

//mv
const app=express();

//JSON BI MV
app.use(express.json());
// cors MV
app.use(cors());


//Establish Connection With DB
//Connection URL - DB - Collection - Data (Document - BSON)
mongoose.connect(DB).then( ()=>{
    console.log("Connected to MongoDB");
}).catch( (error)=>{
    console.log(`Connection Failed : ${error}`);
});


//crate the collection - Schema for Employee  - structure for employee
// id , name , password , mail

const userSchema = new mongoose.Schema(
    {
        name :{
            type : String,
            required : true
        },

        password : {
            type : String,
            required : true
        },
        mail :{
            type : String,
            required : true
        }
    },
    {timestamps:true}
);

//on the basis of userSchema want to create collection in DB
//const Employee = mongoose.model('employee' , userSchema);
const User = mongoose.model('user', userSchema);

app.get('/', (req, res)=>{
    res.send('Welcome on Employee Portal');
});

//CRUD Operation on Collection users
//1. Create
app.post('/createuser', async(req, res)=>{
    try{
        const bodyData = req.body;
        const user = new User(bodyData);
        const userData = await user.save();
        res.send(userData);
    }catch(error){
        res.status(400).send(error);
    }
});

//2. Read ALL
app.get('/getusers', async(req, res)=>{
    try{
        const userData = await User.find();
        res.send(userData);
    }catch(error){
        res.status(400).send(error);
    }
});

//3. Read One
app.get('/getuser/:id', async(req, res)=>{
    try{
        const id = req.params.id;
        const userData= await User.findById({_id : id});
        res.send(userData)
    }catch(error){
        res.status(400).send(error);
    }
});


//4. Update
app.put('/updateuser/:id', async(req, res)=>{
    try{
        const id = req.params.id;
        const userData = await User.findByIdAndUpdate({_id : id} , req.body, {new:true});
        res.send(userData);
    }catch(error){
        res.status(400).send(error)
    }
});

//5. delete
app.delete('/deleteuser/:id', async(req, res)=>{
    try{
        const id = req.params.id;
        const userData= await User.findByIdAndDelete({_id : id});
        res.send(userData);
    }catch(error){
        res.status(400).send(error);
    }
});


app.listen(port, ()=>{
    console.log(`Server is running on URL : http://localhost:${port}/`)
})