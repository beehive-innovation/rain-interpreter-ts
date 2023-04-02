import { BigNumber } from "ethers";
import { RainInterpreterTs } from "../../../interpreter/RainInterpreterTs";
import { InterpreterData, NamespaceType, opClosure } from "../../../interpreter/types";

/**
 * @public
 */
export const OpGet: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    const key = _inputs[0]
    if (_data.namespaceType === NamespaceType.public) {
        const items = RainInterpreterTs.getStorage(
            _data.storage,
            _data.sender,
            '0'
        )
        if (items) {
            const item = items.find(v => v.key.eq(key))
            if (item) return [item.value]
            else return [BigNumber.from(0)]
        }
        return [BigNumber.from(0)]
    }
    else if (_data.namespaceType === NamespaceType.private) {
        if (_data.namespace) {
            const items = RainInterpreterTs.getStorage(
                _data.storage,
                _data.sender,
                _data.namespace
            )
            if (items) {
                const item = items.find(v => v.key.eq(key))
                if (item) return [item.value]
                else return [BigNumber.from(0)]
            }
        }
        return [BigNumber.from(0)]
    }
    else return [BigNumber.from(0)]
}
