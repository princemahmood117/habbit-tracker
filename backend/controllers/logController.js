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



export const markComplete = async (req, res) => {

    try {
        
    } catch (error) {
        res.status(500).json({message: `error from markComplete: ${error}`})
    }
} 


