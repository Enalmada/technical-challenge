require("dotenv-flow").config();
const { exec } = require("child_process");

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Migration file:", function (name) {
    exec(`db-migrate create ${name} --sql-file`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        rl.close();
    });
});

rl.on("close", function () {
    // console.log("\nBYE BYE !!!");
    process.exit(0);
});
