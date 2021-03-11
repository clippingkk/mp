declare module '*.png';
declare module '*.css';
declare module '*.styl';

declare var __DEV__: boolean

// graphql.d.ts file
declare module '*.graphql' {
    import {DocumentNode} from 'graphql'

    const value: DocumentNode
    export default value
}

// declare function getCurrentPages;

declare module 'miniapp-color-thief';
