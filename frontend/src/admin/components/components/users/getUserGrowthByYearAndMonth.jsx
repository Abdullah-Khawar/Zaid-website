
export const getUserGrowthByYearAndMonth = (users) => {
    const growthByYear = {};

    users.forEach(user => {
        const date = new Date(user.createdAt);
        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: 'short' });

        if (!growthByYear[year]) {
            growthByYear[year] = {};
        }
        if (!growthByYear[year][month]) {
            growthByYear[year][month] = 0;
        }

        growthByYear[year][month] += 1;
    });

    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return Object.keys(growthByYear).map(year => ({
        year,
        months: monthOrder.map(month => ({
            month,
            users: growthByYear[year][month] || 0
        }))
    })).sort((a, b) => b.year - a.year);
};
