import { BigNumber, ethers } from "ethers";
import { InterpreterData, opClosure } from "../../../../interpreter/types";

/**
 * @public
 */
export const OpIsZero: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    const item_ = _inputs.pop()
    if (item_ !== undefined) return [
        item_.isZero() 
            ? ethers.constants.One 
            : ethers.constants.Zero
    ] 
    else throw new Error('Undefined stack variable')
}