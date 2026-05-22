import {format, subDays, startOfWeek, endOfWeek, eachDayOfInterval} from "date-fns"

export const toDateKey = (date) => format(date, "yyyy-MM-dd");
console.log("toDateKey: ", toDateKey);

export const todayKey = () => toDateKey(new Date())


// last 90 days function
export const last90Days = () => {
    const end = new Date()      // today
    const start = subDays(end, 89);   // today + previous 89 days = total 90 days
    return eachDayOfInterval({start, end}).map(toDateKey) // generates ALL dates between start and end,then each date is made in "yyyy-MM-dd" format
}


export const currentWeekKeys = () => {
    const now = new Date();
    const start = startOfWeek(now, {weekStartsOn:1});
    const end = endOfWeek(now, {weekStartsOn:1});
    return eachDayOfInterval({start, end}).map(toDateKey);
}

export const lastNDays = (n) => {
    const end = new Date();
    const start = subDays(end, n - 1);
    return eachDayOfInterval({start,end}).map(toDateKey)
}


// for streak calculation
export const calcStreak = (sortedDateKeys) => {

    // sorted date: newest first , unique
    if(!sortedDateKeys.length) return {current: 0, longest: 0};

    const set = new Set(sortedDateKeys); // convert the array into Set, because set.has() is much faster than array-searching

    const today = todayKey();
    const yesterDay = toDateKey(subDays(new Date(), 1))

    let current = 0;
    let cursor = new Date();

    // if habit is not completed today and yesterday, set current = 0 (streak is broken)
    if(!set.has(today) && !set.has(yesterDay)) {
        current = 0;
    }
    // today missing but yesterday completed, then streak will continue
    else {
        if(!set.has(today)) cursor = subDays(cursor,1);  // cursor is yesterday
        
        while(set.has(toDateKey(cursor))) {
            current += 1;
            cursor = subDays(cursor,1) // cursor goes yesterday
        }
    }

    // longest streak
    const sortedAsc = [...sortedDateKeys].sort();
    let longest = 0;
    let run = 0;
    let prev = null;

    for(const k of sortedAsc) {
        if(prev) {
            const d = new Date(k);
            const p = new Date(prev);

            const diff = Math.round((d-p)/(1000*60*60*24));

            if(diff === 1) run += 1;   // if days are consecutive, run = run + 1
            else run = 1;
        }
        else {
            run = 1;
        }

        if(run > longest) longest = run;  // tracks maximum streak found
        prev = k;
    }
    return {current, longest}
}