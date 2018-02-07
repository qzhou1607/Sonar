/**
 * @fileoverview \`typescript-config-is-valid\` warns again providing an invalid typescript configuration file \`tsconfig.json\`
 */
import * as ajv from 'ajv';
import * as _ from 'lodash';

import { Category } from '../../enums/category';
import { RuleContext } from '../../rule-context';
import { IRule, IRuleBuilder, ITypeScriptConfigInvalid, ITypeScriptConfigInvalidSchema, TypeScriptConfig } from '../../types';
import { debug as d } from '../../utils/debug';

const debug: debug.IDebugger = d(__filename);

/*
 * ------------------------------------------------------------------------------
 * Public
 * ------------------------------------------------------------------------------
 */

const rule: IRuleBuilder = {
    create(context: RuleContext): IRule {
        const prettyfy = (error: Array<ajv.ErrorObject>, config: TypeScriptConfig): string => {
            let result: string;

            switch (error.keyword) {
                case 'additionalProperties':
                    // result = generateAdditionalPropertiesError(error, config);
                    result = error.message;
                    break;
                default:
                    result = error.message;
                    break;
            }
            console.log(error);

            return result;
        };

        const invalidJSONFile = async (typeScriptConfigInvalid: ITypeScriptConfigInvalid) => {
            const { error, resource } = typeScriptConfigInvalid;

            debug(`Validating rule typescript-config-is-valid`);

            await context.report(resource, null, error.message);
        };

        const invalidSchema = async (fetchEnd: ITypeScriptConfigInvalidSchema) => {
            const { config, errors, resource } = fetchEnd;

            debug(`Validating rule typescript-config-is-valid`);

            const grouped: _.Dictionary<Array<ajv.ErrorObject>> = _.groupBy(errors, 'dataPath');

            const promises = _.map(grouped, (values) => {
                return context.report(resource, null, prettyfy(values, config));
            });

            await Promise.all(promises);

            // for (const error of errors) {
            //     await context.report(resource, null, prettyfy(error, config));
            // }
        };

        return {
            'invalid-json::typescript-config': invalidJSONFile,
            'invalid-schema::typescript-config': invalidSchema
        };
    },
    meta: {
        docs: {
            category: Category.interoperability,
            description: `\`typescript-config-is-valid\` warns again providing an invalid typescript configuration file \`tsconfig.json\``
        },
        recommended: false,
        schema: [],
        worksWithLocalFiles: true
    }
};

module.exports = rule;
