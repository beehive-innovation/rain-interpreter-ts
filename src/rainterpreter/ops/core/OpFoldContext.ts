import { BigNumber } from "ethers";
import { callOperand } from "../../../utils";
import { OpCall } from "./OpCall";
import { InterpreterData, opClosure } from "../../../interpreter/types";

/**
 * @public
 */
export const OpFoldContext: opClosure = async(
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): Promise<BigNumber[]> => {
    const _inputSize = _operand >> 12
    const _width = (_operand >> 8) & 15
    const _foldColumn = (_operand >> 4) & 15
    const _sourceIndex = _operand & 15
    const _side_stack = [..._inputs]
    const _callInputs = _inputSize + _width
    for (let i = 0; i < _data.context[_foldColumn].length; i++) {
        for (let j = 0; j < _width; j++) _side_stack.push(
            _data.context[_foldColumn + j][i]
        )
        const _callOperand = callOperand(
            _callInputs,
            _inputSize,
            _sourceIndex
        )
        _side_stack.push(
            ...await OpCall(
                _side_stack.splice(-_callInputs),
                _callOperand,
                _data
            )
        )
    }
    if (_side_stack.length >= _inputSize) 
        return _side_stack.splice(-_inputSize)
    else throw new Error('out-of-bound outputs')
}