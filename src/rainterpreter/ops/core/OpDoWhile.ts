import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../interpreter/types";
import { callOperand } from "../../../utils";
import { OpCall } from "./OpCall";

/**
 * @public
 */
export const OpDoWhile: opClosure = async(
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): Promise<BigNumber[]> => {
    const _entrypoint = (_operand >> 8) & 15
    const _outputs = _inputs.length
    const _sideStack: BigNumber[] = []
    _sideStack.push(..._inputs)
    let _condition = _inputs[_inputs.length - 1]
    while(_condition.gt(0)) {
        _sideStack.push(...(await OpCall(
            _sideStack.splice(-_inputs.length),
            callOperand(_inputs.length, _outputs, _entrypoint),
            _data
        )))
        _condition = _sideStack[_sideStack.length - 1]
    }
    if (_sideStack.length >= _outputs) return _sideStack.splice(-_outputs)
    else throw new Error('out-of-bound outputs')
}
