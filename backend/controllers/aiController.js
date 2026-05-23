import AiInsight from "../models/AiInsight.js";
import Habit from "../models/Habit.js"
import HabitLog from "../models/HabitLog.js"
import { chatCompletion, SYSTEM_PROMPTS } from "../utils/aiService.js";
import { calcStreak, lastNDays } from "../utils/dateHelpers.js"

const buildWeeklyContext = async (userId) => {
    const habits = await Habit.find({
        userId, isArchived:false
    })
    const days = lastNDays(7)
    const logs = await HabitLog.find({
        userId,
        completedDate: {$gte: days[0],  $lte: days[days.length - 1]}
    })

    const perHabit = habits.map((h) => {
        const completed = logs.filter((l) => String(l.habitId) === String(h._id)).length;

        return {
            name: h.name,
            category: h.category,
            frequency: h.frequency,
            completedDays: completed,
            targetDays: h.targetDays,
        };
    });

    return {days, perHabit};
};



export const weeklyReport = async (req, res) => {
    try {
        
        const ctx = await buildWeeklyContext(req.user?._id);
        if(!ctx) {
            return res.json({
                content: "You dont have any active habits yet. Create your first habit to start tracking - I'll generate a weekly report once you have some data!"
            })
        }


        const userMsg = `Here is the user's data for past 7 days (${ctx.days[0]} to ${ctx.days[6]}): \n\n ${ctx.perHabit.map((h) => `-${h.name} (${h.category}, ${h.frequency}) : completed ${h.completedDays} of the past 7 days, target ${h.targetDays}/week`).join("\n")}\n\nPlease write the personalized weekly report now.`;

        const {content} = await chatCompletion({
            system: SYSTEM_PROMPTS.weekly,
            user: userMsg
        });

        await AiInsight.create({
            userId: req.user._id,
            type: "weekly",
            content,
        });

        res.json({content})
    } catch (error) {
        res.status(500).json({message: `error from weeklyReport: ${error.message}`})
    }
} 




export const suggestHabits = async (req, res) => {
    try {
        const {goals, productiveTime, struggles} = req.body;
        const userMsg = `User goals: ${goals || "not provided"}\nMost productive time: ${productiveTime || "not provided"}\nPast struggles" ${struggles || "not provided"}\n\nSuggest 3 personalized habits now. Return JSON only.`;

        const {content} = await chatCompletion({
            system: SYSTEM_PROMPTS.suggestion,
            user: userMsg,
        });

        let suggestions = [];
        try {
            const parsed = JSON.parse(content.replace(/```json|```/g, "").trim());
            suggestions = parsed.suggestions || [];
        } catch {
            suggestions = []
        }

        if(!suggestions.length) {
            suggestions = [
                {
                    name: "10-minute morning walk.",
                    description: "Start the dau with light movement and fresh air.",
                    frequency: "daily",
                    category: "Fitness",
                    icon: "🚶",
                    reason: "Low-friction way to build cosistency early in the day."
                },
                {
                    name: "Read 5 pages.",
                    description: "Start daily reading to build a learnig routne.",
                    frequency: "daily",
                    category: "Learning",
                    icon: "📖",
                    reason: "Compounds into significant knowledge over weeks."
                },
                {
                    name: "2 minutes of mindful breating.",
                    description: "Pause and breath to reset focus and reduce stress.",
                    frequency: "daily",
                    category: "Mindfulness",
                    icon: "🧘‍♂️",
                    reason: "Tiny anchor habit that fits any schedule."
                },
            ]
        }

        await AiInsight.create({
            userId: req.user._id,
            type: "suggestion",
            content: JSON.stringify(suggestions),
            meta: {goals, productiveTime, struggles},
        })
        res.json({suggestions})
        
    } catch (error) {
        res.status(500).json({message: `error from suggestHabits: ${error.message}`})
    }
};



export const recoveryPlan = async(req, res) => {
    try {
        const {habitId} = req.body;
        const habit = await Habit.findOne({
            _id: habitId,
            userId: req.user._id,
        })

        if(!habit) {
            res.status(404).json({message: `Habit not found fot recovery plan!`})
        }

        const logs = await HabitLog.find({
            userId: req.user._id,
            habitId,
        }).sort({completedDate: -1});

        const keys = logs.map((l) => l.completedDate);
        const {current, longest} = calcStreak(keys);

        const userMsg = `Habit: ${habit.name} (${habit.category}).\nDescription: ${habit.description || "none"}.\nCurrent streak: ${current} days. Longest ever: ${longest} days. The user just broke a streak. Write a warm, actionable 3-days recovery plan.`;

        const {content} = await chatCompletion({
            system: SYSTEM_PROMPTS.recovery,
            user: userMsg
        })

        await AiInsight.create({
            userId: req.user._id,
            type: "recovery",
            content,
            meta: {habitId}
        });
        res.json({content})

        
    } catch (error) {
        res.status(500).json({message: `error from recoveryPlan: ${error.message}`})
    }
};



const chatAnalysis = async (req, res) => {
    try {
        const {question} = req.body;
        if(!question) {
            return res.status(400).json({message: `question is required!`})
        }

        const habits = await Habit.find({
            userId: req.user._id,
            isArchived: false,
        })

        const days = lastNDays(30);
        const logs = await HabitLog.find({
            userId: req.user._id,
            completedDate: {$gte: days[0], $lte: days[days.length - 1]},
        });

        const context = habits.map((h) => {
            const hLogs = logs.filter((l) => String(l.habitId) === String(h._id));

            const byDow = [0,0,0,0,0,0,0];
            for(const l of hLogs) {
                const dow = new Date(l.completedDate).getDay();
                byDow[dow] += 1; 
            }

            return `${h.name} (${h.category}): ${hLogs.length}/30 in last 30 days, by weekly [Sun, Mon, Tue, Wed, Thu. Fri, Sat] = ${JSON.stringify(byDow)}`;
        }).join("\n");

        const userMsg = `User question: ${question}"\n\nUser data (last 30 days):\n${context}\n\nAnswer now.`;

        const {content} = await chatCompletion({
            system: SYSTEM_PROMPTS.chat,
            user: userMsg
        })

        await AiInsight.create({
            userId: req.user._id,
            type: "chat",
            content,
            meta: {question}
        })
        res.json({content})
        
    } catch (error) {
        res.status(500).json({message: `error from chatAnalysis: ${error.message}`})
    }
}
