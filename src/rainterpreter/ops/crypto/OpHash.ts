import { BigNumber } from "ethers";
import { solidityKeccak256 } from "ethers/lib/utils";
import { InterpreterData, opClosure } from "../../../interpreter/types";

/**
 * @public
 */
export const OpHash: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    const _items: string[] = []
    for (let i = 0; i < _inputs.length; i++) {
        _items.push(_inputs[i].toHexString())
    }
    return [
        BigNumber.from(
            solidityKeccak256(
                ["uint256[]"],
                [_items]
            )
        )
    ]
    
}
