import { CLICommand } from '../CLICommand';
import { CommonContext } from '../CLICommand/common_context';
import {
	BoostParameter,
	DriveNameParameter,
	DrivePasswordParameter,
	DryRunParameter,
	SeedPhraseParameter,
	WalletFileParameter
} from '../parameter_declarations';
import { JWKWallet, Wallet } from '../wallet_new';
import { arDriveFactory, cliWalletDao } from '..';
import { FeeMultiple } from '../types';
import { PrivateDriveKeyData } from '../ardrive';

/* eslint-disable no-console */

new CLICommand({
	name: 'create-drive',
	parameters: [
		WalletFileParameter,
		SeedPhraseParameter,
		DriveNameParameter,
		DrivePasswordParameter,
		BoostParameter,
		DryRunParameter
	],
	async action(options) {
		const context = new CommonContext(options, cliWalletDao);
		const wallet: Wallet = await context.getWallet();

		const ardrive = arDriveFactory({
			wallet: wallet,
			feeMultiple: options.boost as FeeMultiple,
			dryRun: options.dryRun
		});
		const createDriveResult = await (async function () {
			if (await context.getIsPrivate()) {
				const newDriveData = await PrivateDriveKeyData.from(
					options.drivePassword,
					(wallet as JWKWallet).getPrivateKey()
				);
				return ardrive.createPrivateDrive(options.driveName, newDriveData);
			} else {
				return ardrive.createPublicDrive(options.driveName);
			}
		})();
		console.log(JSON.stringify(createDriveResult, null, 4));

		process.exit(0);
	}
});
