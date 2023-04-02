import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../interpreter/types";
import { saturatingDiff } from "../../../lib/TierwiseCombine";


/**
 * @public
 */
export const OpSaturatingDiff: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    const item2_ = _inputs.pop()
    const item1_ = _inputs.pop()
    if (item1_ && item2_ !== undefined) return [
        saturatingDiff(item1_, item2_)
    ]
    else throw new Error('Undefined stack variables')
}