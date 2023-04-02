import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../interpreter/types";

/**
 * @public
 */
export const OpDebug: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    if (_operand < 2) {
        const _stack: string[] = []
        for (let i = 0; i < _data.stack.length; i++) {
            _stack.push(_data.stack[i].toHexString())
        }
        console.log(_stack)
        return []
    } 
    else throw new Error('out-of-bound debug operand')
}