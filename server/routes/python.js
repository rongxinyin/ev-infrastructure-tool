const express = require('express');
const { runPythonScript } = require('../controllers/pythonController');

const router = express.Router();

router.post('/process', runPythonScript);

module.exports = router;
