import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../../interpreter/types";
import { scaleN } from "../../../../lib/FixedPointMath";

/**
 * @public
 */
export const OpScaleN: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    const item_ = _inputs.pop()
    if (item_ !== undefined) return [
        scaleN(item_, _operand)
    ] 
    else throw new Error('Undefined stack variable')
}