import Habit from "../models/Habit.js";


const getHabits = async (req, res) => {
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


const createHabit = async (req, res) => {
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


const updateHabit = async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({message : `error from updateHabit catch ${error.message}`})
    }
}