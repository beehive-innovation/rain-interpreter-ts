import { saturatingMul } from "../../../../lib/SaturatingMath";
import { BigNumber, ethers } from "ethers";
import { InterpreterData, opClosure } from "../../../../interpreter/types";

/**
 * @public 
 */
export const OpSaturatingMul: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    const items_ = _inputs.splice(-_operand)
    let _accumulator = ethers.constants.One
    let _item
    for (let i = 0; i < _operand; i++) {
        _item = items_.shift()
        if (_item !== undefined) _accumulator = saturatingMul(_accumulator, _item)
        else throw new Error('Undefined stack variabble')
    }
    return [_accumulator]
}