import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../../interpreter/types";
import { fixedPointMul } from "../../../../lib/FixedPointMath";

/**
 * @public
 */
export const OpScale18Mul: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    const item2_ = _inputs.pop()
    const item1_ = _inputs.pop()
    if (item1_ && item2_ !== undefined) return [
        fixedPointMul(item1_, item2_, _operand)
    ]
    else throw new Error('Undefined stack variables')
}