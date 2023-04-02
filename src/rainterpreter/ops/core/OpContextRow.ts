import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../interpreter/types";

/**
 * @public
 */
export const OpContextRow: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    const _row = _inputs[0].toNumber()
    const _col = _operand
    if (_data.context[_col][_row]) return [_data.context[_col][_row]]
    else throw new Error('undefined context')
}
