import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../interpreter/types";

/**
 * @public
 */
export const OpReadMemory: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    if (_operand & 1) return [
        BigNumber.from(_data.stateConfig.constants[_operand >> 1])
    ]
    else return [_data.stack[_operand >> 1]]
}