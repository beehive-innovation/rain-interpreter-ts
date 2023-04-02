import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../interpreter/types";
import { min } from "../../../lib/Math";

/**
 * @public
 */
export const OpMin: opClosure= (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    const items_ = _inputs.splice(-_operand)
    if (items_.length === _operand) return [min(items_)]
    else throw new Error('Undefined stack variables')
}