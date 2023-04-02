import { BigNumber } from "ethers";
import { RainInterpreterTs } from "../../../interpreter/RainInterpreterTs";
import { InterpreterData, opClosure } from "../../../interpreter/types";

/**
 * @public
 */
export const OpCall: opClosure = async(
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): Promise<BigNumber[]> => {
    const _interpreter = new RainInterpreterTs(
        _data.interpreterAddress,
        _data.provider,
        _data.opConfigs,
        _data.overrides,
        [_data.stateConfig],
        _data.storage
    )
    _interpreter.state.stack.push(..._inputs)
    const _entrypoint = _operand >> 8
    const _outputs = (_operand >> 4) & 15
    const _result = await _interpreter.run(
        _data.sender,
        _data,
        {
            namespaceType: _data.namespaceType,
            block: _data.block,
            entrypoint: _entrypoint,
        }
    )
    if (_result.finalStack.length >= _outputs) 
        return _result.finalStack.splice(-_outputs)
    else throw new Error('out-of-bound outputs')
}