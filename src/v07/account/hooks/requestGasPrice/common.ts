import { PublicClient } from "viem";
import { RequestGasPriceFunc } from "../types";
import { JsonRpcProvider } from "ethers";
import { packGas } from "../../../entryPoint";


export const withEthClient = (
  ethClient: PublicClient | JsonRpcProvider,
): RequestGasPriceFunc => {
  if (ethClient instanceof JsonRpcProvider) {
    return async () => {
      const feeData = await ethClient.getFeeData();
      if (!feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas) {
        const gasFees = packGas(
          feeData.gasPrice || 0n,
          feeData.gasPrice || 0n,
        );
        return {
          gasFees
        };
      }
      const gasFees = packGas(
        feeData.maxFeePerGas,
        feeData.maxPriorityFeePerGas,
      );

      return {
        gasFees
      };
    };
  }

  return async () => {
    const block = await ethClient.getBlock();
    if (!block.baseFeePerGas) {
      const gp = await ethClient.getGasPrice();
      const gasFees = packGas(
        gp,
        gp,
      );
      return {
        gasFees
      };
    }

    const maxPriorityFeePerGas = await ethClient.estimateMaxPriorityFeePerGas();
    const maxFeePerGas = block.baseFeePerGas * 2n + maxPriorityFeePerGas;
    const gasFees = packGas(
      maxFeePerGas,
      maxPriorityFeePerGas,
    );
    return {
      gasFees
    };
  };
};
