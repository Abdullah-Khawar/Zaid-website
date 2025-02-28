const express = require('express');
const router = express.Router();
const getUserGrowthByYearAndMonth = require('../utils/getUserGrowthByYearAndMonth');
const users = require('../data/users');

router.get('/user-growth', (req, res) => {
    const userGrowthData = getUserGrowthByYearAndMonth(users);
    res.json(userGrowthData);
});

module.exports = router;
