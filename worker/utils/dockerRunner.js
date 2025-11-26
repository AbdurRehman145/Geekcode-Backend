const { exec } = require('child_process');
const path = require('path');

const getDockerImage = (language) => {
    const images = {
        'Python': 'python:3.9-slim',
        'Javascript': 'node:16-slim',
        'Cpp': 'gcc:9'
    };
    return images[language] || 'ubuntu:20.04';
};

const getFileName = (language) => {
    const extensions = {
        'Python': 'solution.py',
        'Javascript': 'solution.js',
        'Cpp': 'solution.cpp'
    };
    return extensions[language] || 'solution.txt';
};

const buildDockerCommand = (language, tempDir, fileName) => {
    const dockerImage = getDockerImage(language);
    const cleanTempDir = tempDir.replace(/\\/g, '/');
    
    const commands = {
        'Python': `docker run --rm -v "${cleanTempDir}:/app" -w /app ${dockerImage} python ${fileName}`,
        'Javascript': `docker run --rm -v "${cleanTempDir}:/app" -w /app ${dockerImage} node ${fileName}`,
        'Cpp': `docker run --rm -v "${cleanTempDir}:/app" -w /app ${dockerImage} bash -c "g++ -o solution ${fileName} && ./solution"`
    };
    
    return commands[language] || `docker run --rm -v "${cleanTempDir}:/app" -w /app ${dockerImage} cat ${fileName}`;
};

const executeWithTimeout = (command, timeout) => {
    return new Promise((resolve, reject) => {
        console.log(`Executing: ${command}`);
        
        const process = exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`Execution error: ${error.message}`);
                console.log(`Stderr: ${stderr}`);
                reject(new Error(`${error.message}\nStderr: ${stderr}`));
            } else {
                console.log(`Stdout: ${stdout}`);
                resolve({ stdout, stderr });
            }
        });

        const timer = setTimeout(() => {
            process.kill('SIGKILL');
            reject(new Error('timeout'));
        }, timeout);

        // Clear timeout if process completes normally
        process.on('exit', () => clearTimeout(timer));
    });
};

module.exports = {
    getFileName,
    buildDockerCommand,
    executeWithTimeout
};