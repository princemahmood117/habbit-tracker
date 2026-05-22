import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";
import { todayKey } from "../utils/dateHelpers.js";


export const markComplete = async (req, res) => {

    try {
        const {habitId, date} = req.body;
        const completedDate = date || todayKey();
        const habit = await Habit.findOne({
            _id : habitId,
            userId : req.user._id
        })

        if(!habit) {
            res.status(404).json({message: `Habit not found!`})
        }
        const log = await HabitLog.findOneAndUpdate({
            userId: req.user._id,
            habitId,
            completedDate
        },
        {
            $setOnInsert : {
                userId: req.user._id,
                habitId,
                completedDate
            }
        },
        {
            upsert: true,
            new: true
        }
    );
    res.status(201).json(log)
        
    } catch (error) {
        res.status(500).json({message: `error from markComplete: ${error}`})
    }
} 




export const unMarkComplete = async (req, res) => {

    try {
        const {habitId, date} = req.body;
        const completedDate = date || todayKey();

        await HabitLog.findOneAndDelete({
            userId : req.user._id,
            habitId,
            completedDate
        })
        res.json({message: "Unmarked!"})
        
    } catch (error) {
        res.status(500).json({message: `error from unMarkComplete: ${error}`})
    }
} 




export const getToday = async (req, res) => {

    try {
        
        const logs =await HabitLog.find({
            userId : req.user._id,
            completedDate: todayKey()
        })
        res.json(logs)
    } catch (error) {
        res.status(500).json({message: `error from getToday: ${error}`})
    }
} 




export const getRange = async (req, res) => {

    try {

        const {start,end} = req.query;
        const logs = await HabitLog.find({
            userId : req.user._id,
            completedDate: {$gte: start, $lte:end}  // Find dates between start and end
        })
        res.json(logs)
    } catch (error) {
        res.status(500).json({message: `error from getRange: ${error}`})
    }
} 



// getHeatmap
export const getHeatmap = async (req, res) => {

    try {
        
    } catch (error) {
        res.status(500).json({message: `error from getHeatmap: ${error}`})
    }
} 




export const markComplete = async (req, res) => {

    try {
        
    } catch (error) {
        res.status(500).json({message: `error from markComplete: ${error}`})
    }
} 




export const markComplete = async (req, res) => {

    try {
        
    } catch (error) {
        res.status(500).json({message: `error from markComplete: ${error}`})
    }
} 




export const markComplete = async (req, res) => {

    try {
        
    } catch (error) {
        res.status(500).json({message: `error from markComplete: ${error}`})
    }
} 


