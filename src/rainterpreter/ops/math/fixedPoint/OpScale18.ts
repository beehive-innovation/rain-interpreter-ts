import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../../interpreter/types";
import { scale18 } from "../../../../lib/FixedPointMath";

/**
 * @public
 */
export const OpScale18: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    const item_ = _inputs.pop()
    if (item_ !== undefined) return [
        scale18(item_, _operand)
    ] 
    else throw new Error('Undefined stack variable')
}
