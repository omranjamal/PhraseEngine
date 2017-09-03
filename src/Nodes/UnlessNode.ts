import { PhraseNode, InitPacketInterface, EvalPacketInterface } from '../Node';
import { IfNode } from './IfNode';
import peek from '../peek';
import mapFilter from '../mapFilter';
import factories from '../factories';
import expressionStack, { isOperator } from '../expressionStack';

export class UnlessNode extends IfNode {
    protected validateNodeName(name: string): boolean {
        return name === 'unless';
    }

    protected evalLogic(packet: EvalPacketInterface): boolean {
        return !super.evalLogic(packet);
    }
}