const { spawn } = require('child_process');

const runPythonScript = (req, res) => {
    const inputData = JSON.stringify(req.body);
    const pythonProcess = spawn('python3', ['../python-backend/scripts/process-empl-data.py', inputData]);

    pythonProcess.stdout.on('data', (data) => {
        res.status(200).json(JSON.parse(data.toString()));
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.status(500).json({ error: 'Internal Server Error' });
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
    });
};

module.exports = { runPythonScript };
