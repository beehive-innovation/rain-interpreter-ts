import { BigNumber, ethers } from "ethers";
import { InterpreterData, opClosure } from "../../../interpreter/types";

/**
 * @public
 */
export const OpMul: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    let _accumulator = ethers.constants.One
    let _item
    for (let i = 0; i < _operand; i++) {
        _item = _inputs.pop()
        if (_item !== undefined) {
            _accumulator = _accumulator.mul(_item)
            if (_accumulator.gt(ethers.constants.MaxUint256)) {
                throw new Error('max numeric range overflow')
            }
        }  
        else throw new Error('Undefined stack variables')
    }
    return [_accumulator]
}