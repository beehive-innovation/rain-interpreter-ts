import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../interpreter/types";

/**
 * @public
 */
export const OpExplode32: opClosure = (
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): BigNumber[] => {
    const maxUint32 = '0xffffffff'
    return [
        _inputs[0].and(maxUint32),
        (_inputs[0].shr(0x20)).and(maxUint32),
        (_inputs[0].shr(0x40)).and(maxUint32),
        (_inputs[0].shr(0x60)).and(maxUint32),
        (_inputs[0].shr(0x80)).and(maxUint32),
        (_inputs[0].shr(0xa0)).and(maxUint32),
        (_inputs[0].shr(0xc0)).and(maxUint32),
        (_inputs[0].shr(0xe0)).and(maxUint32),
    ]
}