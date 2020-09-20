#!/usr/bin/env node
'use strict';
const meow = require('meow');
const chalk = require('chalk');
const axios = require('axios');

const cli = meow(`
    Usage 
      $ cc <currency> <cost>
      
      Options
        --help              -h
        --dollar            -d
        --euro              -e
        --sterlin           -s       
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
        sterlin: {
            type: 'boolean',
            alias: 's'
        }
    }
});

const apiURl = 'https://api.exchangeratesapi.io/latest';
const apiErr = `${chalk.red('[!]')} `;

(function control() {
    const flag = cli.flags;

    if (flag.dollar || flag.euro || flag.sterlin) {
        convert();
    } else {
        board();
    }
})();

function board() {
    axios
        .get(`${apiURl}?base=TRY`,)
        .then((res) => {
            const data = res.data.rates;
            const custom = `${chalk.bold('RATES')}:\n${chalk.greenBright('USD')}: ${data.USD}\n${chalk.greenBright('EUR')}: ${data.EUR}\n${chalk.greenBright('GBP')}: ${data.GBP}\n\n${chalk.blueBright('INFORMATION:')} now based currency TRY\n${chalk.bgBlue(chalk.black(`Fetching date: ${res.data.date}`))}`;
            console.log(custom);
        })
        .catch(err => {
            console.log(apiErr + err);
        });
}

function convert() {
    const currency = Object.keys(cli.flags).find(key => cli.flags[key] === true);
    if (currency == "dollar") {
        axios
            .get(`${apiURl}?base=USD`)
            .then((res) => {
                console.log(`${chalk.blue('[!]')} Result: ${cli.input[0] * res.data.rates.TRY}`)
            })
            .catch((err) => {
                console.log(apiErr + err);
            })
    } else if (currency == "euro") {
        axios
            .get(`${apiURl}?base=EUR`)
            .then((res) => {
                console.log(`${chalk.blue('[!]')} Result: ${cli.input[0] * res.data.rates.TRY}`)
            })
            .catch((err) => {
                console.log(apiErr + err);
            })
    } else if (currency == "sterlin") {
        axios
            .get(`${apiURl}?base=GBP`)
            .then((res) => {
                console.log(`${chalk.blue('[!]')} Result: ${cli.input[0] * res.data.rates.TRY}`)
            })
            .catch((err) => {
                console.log(apiErr + err);
            })
    } else {
        console.log(apiErr + 'Invalid flag or input.');
    }
}