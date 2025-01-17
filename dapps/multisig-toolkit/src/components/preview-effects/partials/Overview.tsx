// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useSuiClientContext } from '@mysten/dapp-kit';
import { DryRunTransactionBlockResponse, GasCostSummary } from '@mysten/sui.js/src/client';
import { ReactNode } from 'react';

import { ObjectLink } from '../ObjectLink';
import { onChainAmountToFloat } from '../utils';

const calculateGas = (gas: GasCostSummary, gasPrice: string): string => {
	return (
		onChainAmountToFloat(
			(
				BigInt(gasPrice) +
				BigInt(gas.computationCost) +
				BigInt(gas.nonRefundableStorageFee) +
				BigInt(gas.storageCost) -
				BigInt(gas.storageRebate)
			).toString(),
			9,
		)?.toString() || '-'
	);
};

export function Overview({ output }: { output: DryRunTransactionBlockResponse }) {
	const { network } = useSuiClientContext();
	const metadata: Record<string, ReactNode> = {
		network,
		status:
			output.effects.status?.status === 'success'
				? '✅ Transaction dry run executed succesfully!'
				: output.effects.status?.status === 'failure'
				? '❌ Transaction failed to execute!'
				: null,

		sender: (
			<span className="flex gap-2 items-center">
				<ObjectLink
					owner={{
						AddressOwner: output.input.sender,
					}}
				/>
			</span>
		),
		epoch: output.effects.executedEpoch,
		gas: calculateGas(output.effects.gasUsed, output.input.gasData.price) + ' SUI',
	};

	return (
		<div className="border p-3 w-full rounded">
			{Object.entries(metadata).map(([key, value]) => (
				<div key={key} className="flex items-center gap-3 ">
					<span className="capitalize">{key}: </span>
					{value}
				</div>
			))}
		</div>
	);
}
