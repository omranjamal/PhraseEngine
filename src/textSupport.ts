import factories from './factories';
import mapFilter from './mapFilter';
import { PhraseNode, InitPacketInterface, EvalPacketInterface } from './Node';


export default mapFilter(factories, [
    'if',
    'text',
    'maybe',
    'either',
    'select',
    'spaceless',
    'unless',
    'data',
    '#text',
    'ref',
    'br'
]);