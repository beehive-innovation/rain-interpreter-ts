import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../interpreter/types";

/**
 * @public
 */
export const OpEnsure: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    for (let i = 0; i < _inputs.length; i++) {
        if (_inputs[i].isZero()) throw new Error('execution reverted')
    }
    return []
}