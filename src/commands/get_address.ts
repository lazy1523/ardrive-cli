import { cliWalletDao } from '..';
import { CLICommand, ParametersHelper } from '../CLICommand';
import { SeedPhraseParameter, WalletFileParameter } from '../parameter_declarations';

/* eslint-disable no-console */

new CLICommand({
	name: 'get-address',
	parameters: [WalletFileParameter, SeedPhraseParameter],
	async action(options) {
		const parameters = new ParametersHelper(options, cliWalletDao);
		const address = parameters.getWalletAddress();
		console.log(address);
		process.exit(0);
	}
});
