import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../../interpreter/types";
import { IOrderBookV1__factory } from "../../../../typechain";
import { paddedUInt160, paddedUInt256 } from "../../../../utils";

/**
 * @public
 */
export const OpIOrderBookV1VaultBalance: opClosure = async(
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): Promise<BigNumber[]> => {
    const id = paddedUInt256(_inputs[3])
    const token = paddedUInt160(_inputs[2])
    const owner = paddedUInt160(_inputs[1])
    const address = paddedUInt160(_inputs[0])
    const blockTag = _data.blockNumber
    const voidSigner = _data.voidSigner
    try {
        const iOrderbookV1Contract = IOrderBookV1__factory.connect(
            address,
            voidSigner
        )
        return [
            await iOrderbookV1Contract.vaultBalance(owner, token, id, { blockTag })
        ]
    }
    catch(err) {
        throw new Error(`something went wrong, reason: ${err}`)
    }
}