import { BigNumber, ethers } from "ethers";
import { InterpreterData, opClosure } from "../../../../interpreter/types";

/**
 * @public
 */
export const OpAny: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    const items_ = _inputs.splice(-_operand)
    let _check
    let _item
    for (let i = 0; i < _operand; i++) {
        _item = items_.shift()
        if (_item !== undefined) {
            if (_item.gt(0)) {
                _check = _item
                break
            } 
            else _check = ethers.constants.Zero
        } 
        else throw new Error('Undefined stack variables')
    }
    if (_check !== undefined) return [_check]
    else throw new Error('Undefined stack variable')
}