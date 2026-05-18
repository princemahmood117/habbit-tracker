import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// create user model with user information
const userSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
        trim : true    
    },
    email: {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true    
    },
    password: {
        type : String,
        required : true,
        minlength : 6
    },
    avatar : {
        type : String,
        default : ""
    },
    morningMotivation : {
        type : Boolean,
        default : false
    },
},

    {
        timestamps : true
    }
);

// hash password
userSchema.pre("save", async function () {
    if(!this.isModified("password")) {
        return
    };
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// match hashed password with plain password
userSchema.methods.matchPassword = async function(plain) {
    return await bcrypt.compare(plain, this.password)
}

userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export default mongoose.model("User", userSchema);