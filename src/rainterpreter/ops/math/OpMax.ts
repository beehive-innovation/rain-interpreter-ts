import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../interpreter/types";
import { max } from "../../../lib/Math";

/**
 * @public
 */
export const OpMax: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    const items_ = _inputs.splice(-_operand)
    if (items_.length === _operand) return [max(items_)]
    else throw new Error('Undefined stack variables')
}