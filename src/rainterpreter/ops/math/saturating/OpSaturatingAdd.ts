import { saturatingAdd } from "../../../../lib/SaturatingMath";
import { BigNumber, ethers } from "ethers";
import { InterpreterData, opClosure } from "../../../../interpreter/types";

/**
 * @public
 */
export const OpSaturatingAdd: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    const items_ = _inputs.splice(-_operand)
    let _accumulator = ethers.constants.Zero
    let _item
    for (let i = 0; i < _operand; i++) {
        _item = items_.shift()
        if (_item !== undefined) _accumulator = saturatingAdd(_accumulator, _item)
        else throw new Error('Undefined stack variables')
    }
    return [_accumulator]
}