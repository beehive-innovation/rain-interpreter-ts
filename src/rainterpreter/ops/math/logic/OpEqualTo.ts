import { BigNumber, ethers } from "ethers";
import { InterpreterData, opClosure } from "../../../../interpreter/types";

/**
 * @public 
 */
export const OpEqualTo: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    const item2_ = _inputs.pop()
    const item1_ = _inputs.pop()
    if (item1_ && item2_ !== undefined) {
        return [
            item2_.eq(item1_) 
                ? ethers.constants.One
                : ethers.constants.Zero
        ]
    } 
    else throw new Error('Underfined stack variables')
}