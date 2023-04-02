import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../../interpreter/types";
import { ISaleV2__factory } from "../../../../typechain";
import { paddedUInt160 } from "../../../../utils";

/**
 * @public
 */
export const OpISaleV2Token: opClosure = async(
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): Promise<BigNumber[]> => {
    const address = paddedUInt160(_inputs[0])
    const blockTag = _data.blockNumber
    const voidSigner = _data.voidSigner
    try {
        const iSaleV2Contract = ISaleV2__factory.connect(
            address,
            voidSigner
        )
        return [
            BigNumber.from(await iSaleV2Contract.token({ blockTag }))
        ]
    }
    catch(err) {
        throw new Error(`something went wrong, reason: ${err}`)
    }
}