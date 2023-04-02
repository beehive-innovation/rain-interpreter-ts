import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../interpreter/types";
import { callOperand } from "../../../utils";
import { OpCall } from "./OpCall";

/**
 * @public
 */
export const OpLoopN: opClosure = async(
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): Promise<BigNumber[]> => {
    const _n = _operand >> 12
    const _entrypoint = (_operand >> 8) & 15
    const _outputs = (_operand >> 4) & 15
    const _sideStack: BigNumber[] = []
    _sideStack.push(..._inputs)
    for (let i = 0; i < _n; i++) {
        _sideStack.push(...(await OpCall(
            _sideStack.splice(-_inputs.length),
            callOperand(_inputs.length, _outputs, _entrypoint),
            _data
        )))
    }
    if (_sideStack.length >= _outputs) return _sideStack.splice(-_outputs)
    else throw new Error('out-of-bound outputs')
}