#!/usr/bin/env node
const meow = require('meow');
const chalk = require('chalk');
const axios = require('axios');
const cc = require('.');

const cli = meow(`
    ${chalk.blueBright('Usage:')} 
      $ cc ${chalk.yellow('<currency> <cost>')}
      
    ${chalk.blue('Options:')}
      --help              -h
      --dollar            -d
      --euro              -e
      --sterling          -s       
`, {
    flags: {
        help: {
            type: 'boolean',
            alias: 'h'
        },
        dollar: {
            type: 'boolean',
            alias: 'd'
        },
        euro: {
            type: 'boolean',
            alias: 'e'
        },
        sterling: {
            type: 'boolean',
            alias: 's'
        }
    }
});

const apiURl = 'https://api.exchangeratesapi.io/latest';
const apiErr = chalk.red('[!] ');
const apiSuc = chalk.blue('[✓] ');

(function control() {
    const flag = cli.flags;

    if (flag.dollar || flag.euro || flag.sterling) {
        convert();
    } else {
        board();
    }
})();

function fetch(param) {
    const base = param || "EUR";
    return new Promise(resolve => {
        axios
            .get(`${apiURl}?base=${base}`)
            .then(res => resolve(res.data))
            .catch(err => console.log(apiErr + err));
    })
}

async function board() {
    const data = {
        USD: (await fetch('USD')).rates.TRY,
        EUR: (await fetch('EUR')).rates.TRY,
        GBP: (await fetch('GBP')).rates.TRY,
        DATE: (await fetch()).date
    };
    const custom = `${chalk.bold('RATES')}:\n ${chalk.greenBright('USD')}: ${data.USD}\n ${chalk.greenBright('EUR')}: ${data.EUR}\n ${chalk.greenBright('GBP')}: ${data.GBP}\n\n${chalk.blueBright('INFORMATION:')} now based currency TRY\n${chalk.bgBlue(chalk.black(`Fetching date: ${data.DATE}`))}`;
    console.log(custom);
}

async function convert() {
    const currency = Object.keys(cli.flags).find(key => cli.flags[key] === true);
    if (currency == "dollar") {
        console.log(`${apiSuc}Result: ${cli.input[0] * (await fetch('USD')).rates.TRY}`);
    } else if (currency == "euro") {
        console.log(`${apiSuc}Result: ${cli.input[0] * (await fetch('EUR')).rates.TRY}`);
    } else if (currency == "sterling") {
        console.log(`${apiSuc}Result: ${cli.input[0] * (await fetch('GBP')).rates.TRY}`);
    } else {
        console.log(apiErr + 'Invalid flag or input.');
    }
}