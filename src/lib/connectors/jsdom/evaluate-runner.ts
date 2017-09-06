import * as vm from 'vm';

import * as jsdom from 'jsdom/lib/old-api';
import * as jsdomutils from 'jsdom/lib/jsdom/living/generated/utils';

const run = (data) => {
    const { source, url } = data;
    const result = {
        error: null,
        evaluate: 'result'
    };

    jsdom.env({
        done: async (error, window) => {
            if (error) {
                result.error = error;

                return process.send(result);
            }

            try {
                const script: vm.Script = new vm.Script(source);
                const evaluteResult = await script.runInContext(jsdomutils.implForWrapper(window.document)._global);

                result.evaluate = evaluteResult;
            } catch (err) {
                result.error = err;
            }

            return process.send(result);
        },
        features: {
            FetchExternalResources: ['script', 'link', 'img'],
            ProcessExternalResources: ['script'],
            SkipExternalResources: false
        },
        url
    });
};

process.on('message', run);
