import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../../interpreter/types";
import { saturatingSub } from "../../../../lib/SaturatingMath";

/**
 * @public
 */
export const OpSaturatingSub: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    const items_ = _inputs.splice(-_operand)
    let _accumulator = items_.shift()
    let _item
    if (_accumulator !== undefined) {
        for (let i = 1; i < _operand; i++) {
            _item = items_.shift()
            if (_item !== undefined) _accumulator = saturatingSub(_accumulator, _item)
            else throw new Error('Undefined stack variables')
        }
        return [_accumulator]
    }
    else throw new Error('Undefined stack variables')
}