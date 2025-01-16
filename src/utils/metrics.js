function getMetrics() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours();
    const week = getWeekNumber(now);

    // Average tabs open: based on hour (50-200 range)
    const tabsSeed = hour * now.getMinutes(); // Create more variation within the hour
    const averageTabs = 50 + (tabsSeed % 151); // Ensures range of 50-200

    // Current existential crises: based on week of year (1-10 range)
    const crises = 1 + (week % 10);

    // Coffee dependency: based on day of week
    const coffeeDependency = (day >= 2 && day <= 5) ? "Critical" : "Dirty matcha latte";

    // Unfinished projects: based on day of week
    const unfinishedProjects = (day >= 1 && day <= 5) ? "Yes" : "YES";

    return {
        averageTabs,
        crises,
        coffeeDependency,
        unfinishedProjects
    };
}

// Helper function to get week number (1-52)
function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

module.exports = { getMetrics }; 