import * as path from 'path';

import * as ajv from 'ajv';

import { IFetchEnd, Parser, TypeScriptConfig, ITypeScriptConfigInvalid, ITypeScriptConfigParse, ITypeScriptConfigInvalidSchema } from '../../types';
import { Sonarwhal } from '../../sonarwhal';
import { loadJSONFile } from '../../utils/misc';


export default class TypeScriptConfigParser extends Parser {
    private configFound: boolean = false;
    private schema: any;

    public constructor(sonarwhal: Sonarwhal) {
        super(sonarwhal);


        this.schema = loadJSONFile(path.join(__dirname, 'schema', 'tsConfigSchema.json'));
        sonarwhal.on('fetch::end', this.parseTypeScript.bind(this));
        sonarwhal.on('targetfetch::end', this.parseTypeScript.bind(this));
        sonarwhal.on('scan::end', this.parseEnd.bind(this));
    }

    private async parseEnd() {
        if (!this.configFound) {
            await this.sonarwhal.emit('notfound::typescript-config');
        }
    }

    private async validateSchema(config: TypeScriptConfig, resource: string) {
        const x: ajv.Ajv = new ajv({ // eslint-disable-line new-cap
            allErrors: true,
            schemaId: 'id'
        });

        x.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
        const validate = x.compile(this.schema);

        const valid = validate(config);

        if (!valid) {
            const event: ITypeScriptConfigInvalidSchema = {
                config,
                errors: validate.errors,
                resource
            };

            await this.sonarwhal.emitAsync('invalid-schema::typescript-config', event);
        }

        return valid;
    }

    private async parseTypeScript(fetchEnd: IFetchEnd) {
        const resource = fetchEnd.resource;

        if (!resource.includes('tsconfig-test.json')) {
            return;
        }

        this.configFound = true;
        let config: TypeScriptConfig;

        try {
            config = JSON.parse(fetchEnd.response.body.content);

            // Validate schema.
            const valid = await this.validateSchema(config, resource);

            if (!valid) {
                return;
            }

            const event: ITypeScriptConfigParse = {
                config,
                resource
            };

            await this.sonarwhal.emit('parse::typescript-config', event);
        } catch (err) {
            const errorEvent: ITypeScriptConfigInvalid = {
                error: err,
                resource
            };

            await this.sonarwhal.emit('invalid-json::typescript-config', errorEvent);
        }
    }
}
