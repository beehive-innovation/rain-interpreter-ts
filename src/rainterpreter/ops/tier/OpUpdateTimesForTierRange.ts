import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../interpreter/types";
import { updateTimesForTierRange } from "../../../lib/TierReport";

/**
 * @public
 */
export const OpUpdateTimesForTierRange: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    const item2_ = _inputs.pop()
    const item1_ = _inputs.pop()
    if (item1_ && item2_ !== undefined) return [
        updateTimesForTierRange(item1_, item2_, _operand)
    ]
    else throw new Error('Undefined stack variables')
}