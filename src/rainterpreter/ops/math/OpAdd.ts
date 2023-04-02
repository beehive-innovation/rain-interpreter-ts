import { BigNumber, ethers } from "ethers";
import { InterpreterData, opClosure } from "../../../interpreter/types";

/**
 * @public
 */
export const OpAdd: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    let _item
    let _accumulator = ethers.constants.Zero
    for (let i = 0; i < _operand; i++) {
        _item = _inputs.pop()
        if (_item !== undefined) {
            _accumulator = _accumulator.add(_item)
            if (_accumulator.gt(ethers.constants.MaxUint256)) {
                throw new Error('max numeric range overflow')
            }
        } 
        else throw new Error('Undefined stack variables')
    }
    return [_accumulator]
}