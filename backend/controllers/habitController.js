import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";


// GET HABIT
export const getHabits = async (req, res) => {
    try {
        const {includeArchived} = req.query;
        console.log('include archived : ', includeArchived);

        const filter = {userId: req.user._id};
        console.log("filter : ", filter);

        if(includeArchived !== "true") {
            filter.isArchived = false
        }
        const habits = await Habit.find(filter).sort({order: 1, createdAt: 1})
        res.json(habits)
        
    } catch (error) {
        res.status(500).json({message : `error from gethabits catch ${error.message}`})
    }
}

// CREATE HABIT
export const createHabit = async (req, res) => {
    try {
        const {name, description, category, frequency, targetDays, color, icon } = req.body;

        if(!name) { 
            res.status(400).json({message : `Habit name is required!`})
        }

        const count = await Habit.countDocuments({userId: req.user._id});
        console.log("count: ", count);

        const habit = await Habit.create({
            userId : req.user._id,
            name,
            description,
            category,
            frequency,
            targetDays,
            color,
            icon,
            order: count,
        });
        res.status(201).json(habit)
        
    } catch (error) {
        res.status(500).json({message : `error from createHabit catch ${error.message}`})
    }
};


// UPDATE HABIT
export const updateHabit = async (req, res) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,  // habit id
            userId: req.user._id // user_id of that habit ("this habit belongs to this user")
        });
        if(!habit) {
            return res.status(404).json({message: "Habit not found to update!"})
        }

        const fields = [
            "name",
            "description",
            "category",
            "frequency",
            "targetDays",
            "color",
            "icon",
            "order"
        ];
        for(const f of fields) {
            if(req.body[f] !== undefined) {  // if 'req.body.name is not undefined' || if 'req.body.description is not undefined' (for all iteration)
                habit[f] = req.body[f]   // set, habit.name = req.body.name || set, habit.description = req.body.description  (for all iteration)
            }

            await habit.save();
            res.json(habit)
        }
        
    } catch (error) {
        res.status(500).json({message : `error from updateHabit catch ${error.message}`})
    }
};


// DELETE HABIT
export const deleteHabit = async(req, res) => {
    try {
        const habit = await Habit.findOneAndDelete({
            _id : req.params.id,
            userId : req.user._id
        })
        if(!habit) {
            return res.status(404).json({message: "Habit not found to delete!"})
        }
        await HabitLog.deleteMany({
            habitId : habit._id,
            userId : req.user._id
        })
        res.json({message: "Habit deleted successfully!"})
        
    } catch (error) {
        res.status(500).json({message : `error from deleteHabit catch ${error.message}`})
    }
};


// ARCHIVE HABIT 
export const archiveHabit = async (req, res) => {
    try {
        const habit = await Habit.findOne({
            _id : req.params.id,
            userId : req.user._id
        })

        if(!habit) {
            return res.status(404).json({message: "Habit not found to archive!"})
        }
        habit.isArchived = !habit.isArchived;
        await habit.save();
        res.json(habit)
        
    } catch (error) {
        res.status(500).json({message : `error from archiveHabit catch ${error.message}`})
    }
};


// REORDER HABITS 
const reorderHabits = async (req, res) => {
    try {
        const {order} = req.body;   // array of habit ids
        if(!Array.isArray(order)) {
            return res.status(404).json({message: "Order must be an array!"})
        }

        await Promise.all(
            order.map((id,index) => (
                Habit.updateOne({
                    _id : id,
                    userId : req.user._id, 
                },
                {
                    $set : {
                        order : index
                    }
                },
            )
            ))
        )
        res.json({message: "Reorderd data!"})
        
    } catch (error) {
        res.status(500).json({message : `error from reorderHabits catch ${error.message}`})
    }
}

//habit controller


