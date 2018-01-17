import test from 'ava';
import chalk from 'chalk';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';
import * as table from 'text-table';

const logging = { log() { } };
const common = { reportSummary() { } };

proxyquire('../../../src/lib/formatters/summary/summary', {
    '../../utils/logging': logging,
    '../utils/common': common
});

import summary from '../../../src/lib/formatters/summary/summary';
import * as problems from './fixtures/list-of-problems';

test.beforeEach((t) => {
    sinon.spy(logging, 'log');
    sinon.spy(common, 'reportSummary');

    t.context.logger = logging;
    t.context.common = common;
});

test.afterEach.always((t) => {
    t.context.logger.log.restore();
    t.context.common.reportSummary.restore();
});

test(`Summary formatter doesn't print anything if no values`, (t) => {
    summary.format(problems.noproblems);

    t.is(t.context.logger.log.callCount, 0);
});

test(`Summary formatter prints a table and a summary for all resources combined`, (t) => {
    const log = t.context.logger.log;
    const comm = t.context.common;
    const tableData = [];

    summary.format(problems.summaryProblems);

    tableData.push([chalk.cyan('random-rule2'), chalk.red(`1 error`)]);
    tableData.push([chalk.cyan('random-rule'), chalk.yellow(`4 warnings`)]);

    const tableString = table(tableData);

    t.is(log.args[0][0], tableString);
    t.true(comm.reportSummary.calledOnce);
});
