const redis = require('redis');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Models
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');

// Utils
const { getFileName, buildDockerCommand, executeWithTimeout } = require('./utils/dockerRunner');

// Language Generators
const preparePythonCode = require('./generators/pythonGenerator');
const prepareJavascriptCode = require('./generators/javascriptGenerator');
const prepareCppCode = require('./generators/cppGenerator');

class CodeExecutionWorker {
    constructor(){
        this.redisClient = redis.createClient();

        this.redisClient.on('error', (err) => {
            console.log(`Redis client error: ${err}`);
        });

        this.redisClient.on('connect', () => {
            console.log('Worker connected to Redis');
        });

        this.redisClient.connect();

        mongoose.connect('mongodb://localhost:27017/Geekcode');

        this.tempDir = path.join(__dirname, 'temp');
        if(!fs.existsSync(this.tempDir)){
            fs.mkdirSync(this.tempDir);
        }
    }

    async start(){
        if (!this.redisClient.isOpen) {
            await this.redisClient.connect();
            console.log("Worker connected to Redis");
        }
        console.log("Worker started and waiting for jobs");

        while(true){
            try{
                const submissionId = await this.redisClient.blPop('jobQueue', 0);
                if(submissionId && submissionId.element){
                    console.log(`Received job: ${submissionId.element}`);
                    await this.processSubmission(submissionId.element);
                }
            } catch(err) {
                console.log(`Error in worker loop: ${err.message}`)
                await this.sleep(5000);
            }
        }
    }

    async processSubmission(submissionId){
        try{
            await Submission.findByIdAndUpdate(submissionId, { status: 'Processing' });
            
            const submission = await Submission.findById(submissionId);
            if(!submission) throw new Error("Submission not found");
            
            const problem = await Problem.findById(submission.problemId);
            if(!problem) throw new Error("Problem not found");

            const result = await this.executeCode(submission, problem);

            await Submission.findByIdAndUpdate(submissionId, {
                status: result.status,
                output: result.output
            });

        }catch(err) {
            console.log(`Error processing submission: ${err.message}`);
            await Submission.findByIdAndUpdate(submissionId, {
                status: 'Error',
                output: [err.message]
            })
        }
    }

    async executeCode(submission, problem){
        const {language, code} = submission;
        const {testCases} = problem;

        try {
            let allPassed = true;
            let outputs = [];

            for(let i = 0; i < testCases.length; i++){
                const testCase = testCases[i];
                console.log(`Running test case ${i+1}/${testCases.length}`);

                const result = await this.runSingleTest(code, language, testCase, problem);
                
                let parsedOutput;
                if (result.status === 'passed' && typeof result.output === 'string' && result.output.includes(',')) {
                    parsedOutput = result.output.split(',').map(item => {
                        const trimmed = item.trim();
                        const num = parseInt(trimmed);
                        return isNaN(num) ? trimmed : num;
                    });
                } else if (result.status === 'passed' && typeof result.output === 'string' && !isNaN(result.output)) {
                    parsedOutput = [parseInt(result.output)];
                } else {
                    parsedOutput = result.output;
                }
                
                outputs.push(parsedOutput);

                if(result.status !== 'passed'){
                    allPassed = false;
                    if(result.status === 'timeout'){
                        return { status: "Time Limit Exceeded", output: outputs };
                    } else {
                        return { status: "Wrong Answer", output: outputs }
                    }
                }
            }

            return { status: 'Accepted', output: outputs }
        } catch(err) {
            console.log(`Execute code error: ${err.message}`);
            return { status: 'Error', output: [err.message] }
        }
    }

    async runSingleTest(code, language, testCase, problem) {
        const filename = getFileName(language);
        const filePath = path.join(this.tempDir, filename);

        try {
            const modifiedCode = this.prepareCodeForExecution(code, language, testCase.input, problem.functionMetadata);
            fs.writeFileSync(filePath, modifiedCode);
            
            const dockerCmd = buildDockerCommand(language, this.tempDir, filename);
            const result = await executeWithTimeout(dockerCmd, 50000); // 5s timeout
            
            const actualOutput = result.stdout.trim();
            const expectedOutput = testCase.output.toString().trim();

            if(actualOutput === expectedOutput) {
                return { status: 'passed', output: actualOutput };
            } else {
                return { status: 'failed', output: `Expected: ${expectedOutput}, Got: ${actualOutput}` };
            }
        } catch(err) {
            console.log(`Test execution error: ${err.message}`);
            if(err.message.includes('timeout')) {
                return { status: 'timeout', output: 'Time Limit Exceeded' };
            }
            return { status: 'error', output: `Execution Error: ${err.message}` };
        } finally {
            this.cleanupFiles([filePath]);
        }
    }

    prepareCodeForExecution(code, language, input, functionMetadata) {
        switch(language) {
            case 'Python': return preparePythonCode(code, input, functionMetadata);
            case 'Javascript': return prepareJavascriptCode(code, input, functionMetadata);
            case 'Cpp': return prepareCppCode(code, input, functionMetadata);
            default: throw new Error(`Unsupported language: ${language}`);
        }
    }

    cleanupFiles(filePaths) {
        filePaths.forEach(filePath => {
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (err) {
                console.log(`Cleanup error for ${filePath}: ${err.message}`);
            }
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

const worker = new CodeExecutionWorker();
worker.start().catch(console.error);

module.exports = CodeExecutionWorker;