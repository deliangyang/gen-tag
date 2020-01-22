const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const moment = require('moment');
require('shelljs/global');

const WORK_DIR = '/Users/ydl/work/company/api-site';
const TAG_PREFIX = 'yuechang';

const init = () => {
    console.log(
        chalk.green(
            figlet.textSync("GEN TAG", {
                font: "Ghost",
                horizontalLayout: "default",
                verticalLayout: "default"
            })
        )
    );
};

const askQuestions = () => {
    const questions = [
        {
            type: "input",
            name: "version",
            message: "What is the version of the tag?"
        },
        {
            type: "list",
            name: "branch",
            message: "What is the branch of the tag?",
            choices: ["audit", "stable",],
        },
        {
            type: "input",
            name: "comment",
            message: "What is the comment of the tag?"
        },
    ];
    return inquirer.prompt(questions);
};

const success = (branch, tag, comment) => {
    if (!which('git')) {
        echo('Sorry, this script requires git');
        exit(1);
    }
    let command = `
        cd ${WORK_DIR}
        git checkout ${branch}
        git pull
        git tag -a ${tag} -m "${comment}"
        git push origin ${tag}
        cd -
    `;
    exec(command);
    console.log(
        chalk.white.bgGreen.bold(`Done! tag created at ${tag}`)
    );
};

const renderTag = (branch, version) => {
    let _today = moment();
    return [
        TAG_PREFIX,
        branch,
        version,
        _today.format('YYYYMMDDHHmm'),
    ].join('-');
};

const run = async () => {
    init();
    const answers = await askQuestions();
    const {version, branch, comment} = answers;
    const tag = renderTag(branch, version);
    success(branch, tag, comment);
};

run();
