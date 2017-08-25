/**
 * @fileoverview Generates a valid browserslist config.
 */

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import * as inquirer from 'inquirer';
import { debug as d } from '../utils/debug';

const debug = d(__filename);

export const generateBrowserslistConfig = async () => {
    debug('Initiating browserslist config generator');
    const browserslistConfig = [];
    const addBrowsersListOptions = [
        { name: 'Use Default browsers', value: 'default' },
        { name: 'Add the last 2 versions of each browser', value: 'last2' },
        { name: 'Add by percentage of usage statistics. (e.g., `>= 5%`)', value: 'usage' },
        { name: 'Add by specific broweser type and version number range. (e.g., `IE 6-8`)', value: 'type' }
    ];
    const browsers = ['Chrome', 'Edge', 'Explorer', 'Firefox', 'Opera', 'Safari'];
    let query;

    const validateVersionInput = (input) => {
        if (!input) {
            return true;
        }

        const versionNumber = parseFloat(input);

        if (isNaN(versionNumber)) {
            return 'Please enter a number.';
        }

        return true;
    };

    const generate = async () => {
        const browsersListQuestions = [
            {
                choices: addBrowsersListOptions,
                message: 'Choose how you want to add the targeted browsers',
                name: 'chooseBy',
                type: 'list'
            },
            {
                default: '5',
                message: 'What\'s the number of the usage percentage in each browser that you want to target?',
                name: 'usagePercentage',
                type: 'input',
                validate: validateVersionInput,
                when: (answers) => {
                    return answers.chooseBy === 'usage';
                }
            },
            {
                choices: browsers,
                message: 'What\'s the browser type that you want to target?',
                name: 'browserType',
                type: 'list',
                when: (answers) => {
                    return answers.chooseBy === 'type';
                }
            },
            {
                message: 'What\'s the start version of the browser? Press enter if there is no minimum version number limit',
                name: 'start',
                type: 'input',
                validate: validateVersionInput,
                when: (answers) => {
                    return answers.chooseBy === 'type';
                }
            },
            {
                message: 'What\'s the end version of the browser? Press enter if there is no maximum version number limit',
                name: 'end',
                type: 'input',
                validate: validateVersionInput,
                when: (answers) => {
                    return answers.chooseBy === 'type';
                }
            },
            {
                message: 'Do you want to keep adding more targeted browsers?',
                name: 'continue',
                type: 'confirm',
                when: (answers) => {
                    return answers.chooseBy !== 'default';
                }
            }
        ];

        const results = await inquirer.prompt(browsersListQuestions);

        switch (results.chooseBy) {
            case 'last2':
                query = 'last 2 versions';
                break;
            case 'usage': {
                const percentage = parseFloat(results.usagePercentage);

                query = `>= ${percentage}%`;
                break;
            }
            case 'type': {
                const startVersion = parseFloat(results.start);
                const endVersion = parseFloat(results.end);

                query = `${results.browserType} `;

                if (startVersion && endVersion) {
                    if (startVersion > endVersion) {
                        throw new Error(`The start version number is larger than the end version number for ${results.browserType}`);
                    }

                    query += startVersion === endVersion ? startVersion : `${startVersion}-${endVersion}`;
                    break;
                }

                if (!startVersion && !endVersion) {
                    throw new Error(`Either the start or the end version number for ${results.browserType} has to be defined.`);
                }

                query += `${startVersion ? '>= ' : '<='} ${startVersion || endVersion}`;
                break;
            }
            default:
                query = '';
        }

        if (query && !browserslistConfig.includes(query)) {
            browserslistConfig.push(query);
        }

        if (results.continue) {
            await generate();
        }
    };

    await generate();

    return browserslistConfig;
};
