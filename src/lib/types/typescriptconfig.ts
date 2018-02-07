import * as ajv from 'ajv';

import { IEvent } from './events';

export enum TypeScriptJSXEnum {
    preserve = 'preserve',
    react = 'react',
    reactNative = 'react-native'
}

export enum TypeScriptLibEnum {
    es5 = 'es5',
    es6 = 'es6',
    es2015 = 'es2015',
    es7 = 'es7',
    es2016 = 'es2016',
    es2017 = 'es2017',
    es2018 = 'es2018',
    esnext = 'esnext',
    dom = 'dom',
    domIterable = 'dom.iterable',
    webworker = 'webworker',
    scripthost = 'scripthost',
    es2015Core = 'es2015.core',
    es2015Collection = 'es2015.collection',
    es2015Generator = 'es2015.generator',
    es2015Iterable = 'es2015.iterable',
    es2015Promise = 'es2015.promise',
    es2015Proxy = 'es2015.proxy',
    es2015Reflect = 'es2015.reflect',
    es2015Symbol = 'es2015.symbol',
    es2015SymbolWellknown = 'es2015Symbol.wellknown',
    es2016ArrayInclude = 'es2016.array.include',
    es2017Object = 'es2017.object',
    es2017Sharedmemory = 'es2017.sharedmemory',
    es2017Typedarrays = 'es2017.typedarrays',
    esnextArray = 'esnext.array',
    esnextAsynciterable = 'esnext.asynciterable',
    esnextPromise = 'esnext.promise'
}

/**
 * Target values.
 * Note: This values in the config file are case insentive.
 */
export enum TypeScriptTargetEnum {
    es3 = 'es3',
    es5 = 'es5',
    es6 = 'es6',
    es2015 = 'es2015',
    es2016 = 'es2016',
    es2017 = 'eses2017',
    esnext = 'esnext'
}

/**
 * Module values.
 * Note: This values in the config file are case insentive.
 */
export enum TypeScriptModuleEnum {
    commonjs = 'commonjs',
    amd = 'amd',
    umd = 'umd',
    system = 'system',
    es3 = 'es3',
    es5 = 'es5',
    es6 = 'es6',
    es2015 = 'es2015',
    es2016 = 'es2016',
    es2017 = 'es2017',
    esnext = 'esnext',
    none = 'none'
}

/**
 * Moduel resolution values.
 * Note: This values in the config file can have the first character
 * in upper case (Classic, Node).
 */
export enum TypeScriptModuleResolutionEnum {
    classic = 'classic',
    node = 'node'
}

/**
 * New line values.
 * Note: This values in the config file are case insentive.
 */
export enum TypeScriptNewLineEnum {
    CRLF = 'CRLF',
    LF = 'LF'
}

export type TypeScriptPaths = {
    [key: string]: Array<string>;
};

export type TypeScriptPlugin = {
    name: string;
};

export type TypeScriptCompilerOptions = {
    allowJs: boolean;
    allowSyntheticDefaultImports: boolean;
    charset: string;
    declaration: boolean;
    declarationDir: string;
    diagnostics: boolean;
    emitBOM: boolean;
    inlineSourceMap: boolean;
    inlineSources: boolean;
    jsx: TypeScriptJSXEnum;
    reactNamespace: string;
    listFiles: boolean;
    mapRoot: string;
    module: TypeScriptModuleEnum;
    newLine: TypeScriptNewLineEnum;
    noEmit: boolean;
    noEmitHelpers: boolean;
    noEmitOnError: boolean;
    noImplicitAny: boolean;
    noImplicitThis: boolean;
    noUnusedLocals: boolean;
    noUnusedParameters: boolean;
    noLib: boolean;
    noResolve: boolean;
    noStrictGenericChecks: boolean;
    skipDefaultLibCheck: boolean;
    skipLibCheck: boolean;
    outFile: string;
    outDir: string;
    preserveConstEnums: boolean;
    preserveSymlinks: boolean;
    pretty: boolean;
    removeComments: boolean;
    rootDir: string;
    isolatedModules: boolean;
    sourceMap: boolean;
    sourceRoot: string;
    suppressExcessPropertyErrors: boolean;
    suppressImplicitAnyIndexErrors: boolean;
    stripInternal: boolean;
    target: TypeScriptTargetEnum;
    watch: boolean;
    experimentalDecorators: boolean;
    emitDecoratorMetadata: boolean;
    moduleResolution: TypeScriptModuleResolutionEnum;
    allowUnusedLabels: boolean;
    noImplicitReturns: boolean;
    noImplicitUseStrict: boolean;
    noFallthroughCasesInSwitch: boolean;
    allowUnreachableCode: boolean;
    forceConsistentCasingInFileNames: boolean;
    baseUrl: string;
    paths: TypeScriptPaths;
    plugins: Array<TypeScriptPlugin>;
    rootDirs: Array<string>;
    typeRoots: Array<string>;
    types: Array<string>;
    traceResolution: boolean;
    listEmittedFiles: boolean;
    lib: Array<TypeScriptLibEnum>;
    strictNullChecks: boolean;
    maxNodeModuleJsDepth: number;
    importHelpers: boolean;
    jsxFactory: string;
    alwaysStrict: boolean;
    strict: boolean;
    downlevelIteration: boolean;
    checkJs: boolean;
    strictFunctionTypes: boolean;
    strictPropertyInitialization: boolean;
    esModuleInterop: boolean;
};

export type TypeScriptTypeAcquisition = {
    enable: boolean;
    include: Array<string>;
    exclude: Array<string>;
};

export type TypeScriptConfig = {
    compilerOptions: TypeScriptCompilerOptions;
    compileOnSave: boolean;
    extends: string;
    files: Array<string>;
    include: Array<string>;
    exclude: Array<string>;
    typeAcquisition: TypeScriptTypeAcquisition;
};

export interface ITypeScriptConfigInvalid extends IEvent {
    error: Error;
}

export interface ITypeScriptConfigInvalidSchema extends IEvent {
    config: TypeScriptConfig;
    errors: Array<ajv.ErrorObject>;
}

/** The object emitted by the `typescript-config` parser */
export interface ITypeScriptConfigParse extends IEvent {
    /** The typescript config parsed */
    config: any;
}
