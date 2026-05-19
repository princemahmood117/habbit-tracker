import mongoose from "mongoose";


// basically storing -- “Which user completed which habit on which date?”

const habitLogSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        index : true,
    },
    habitId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Habit",
        required : true,
        index : true,
    },
    completedDate : {    /// YYYY-MM-DD
        type : String,
        required : true,
    },
    notes : {
        type : String,
        default : ""
    },
},
{timestamps : true}
);

//  the user cannot accidently check the same habit twice for a day
habitLogSchema.index({
    userId: 1, habitId: 1,completedDate: 1
},
{unique : true}
);

export default mongoose.model("HabitLog", habitLogSchema)