import { BigNumber } from "ethers";
import { RainInterpreterTs } from "../../../interpreter/RainInterpreterTs";
import { InterpreterData, NamespaceType, opClosure } from "../../../interpreter/types";

/**
 * @public
 */
export const OpSet: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    const key = _inputs[0]
    const value = _inputs[1]
    if (_data.namespaceType === NamespaceType.public) {
        RainInterpreterTs.addStorage(
            _data.storage,
            _data.sender,
            '0',
            { key, value }
        )
    }
    else if (_data.namespaceType === NamespaceType.private) {
        if (_data.namespace) {
            RainInterpreterTs.addStorage(
                _data.storage,
                _data.sender,
                _data.namespace,
                { key, value }
            )
        }
        else throw new Error('undefined namespace')
    }
    return []
}
