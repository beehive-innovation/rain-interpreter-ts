import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../../interpreter/types";

/**
 * @public 
 */
export const OpEagerIf: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    const false_ = _inputs.pop()
    const true_ = _inputs.pop()
    const condition_ = _inputs.pop()
    if (false_ && true_ && condition_ !== undefined) return [
        condition_.gt(0) 
            ? true_
            : false_
    ]
    else throw new Error('Undefined stack variables')
}