const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema =new mongoose.Schema({
    email:{
        type:String,
        requried:[true,"Email is required for creating a user"],
        trim:true,
        lowercase:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
             "InValid Email Address"
            ],
            unique:[true, "Email already Exist"]
    },
    name:{
        type: String,
        required:[true, "Name is required For creating an Account" ]
    },
    password:{
        type:String,
        required:[true,"Password is required for creating an account"],
        minlength: [6,"Password Must contains 6 character"],
        select:false
    }
    
},
{
    timestamps:true
})

userSchema.pre("save",async function(next) {
    if(!this.isModifed("password")){
        return next()
    }

    const hash = await bcrypt.hash(this.password,10)
    this.password = hash
    return next()

})

userSchema.method.camparePassword = async function (password) {

    return await bcrypt.compare(password,this.password)

}

const userModel = mongoose.model("user",userSchema)

module.exports = userModel