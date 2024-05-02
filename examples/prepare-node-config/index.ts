import { writeFile } from 'fs/promises';
import { Chain, createPublicClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import {
  ChainConfig,
  PrepareNodeConfigParams,
  createRollupPrepareTransaction,
  createRollupPrepareTransactionReceipt,
  prepareNodeConfig,
} from '@arbitrum/orbit-sdk';
import { getParentChainLayer } from '@arbitrum/orbit-sdk/utils';
import { config } from 'dotenv';
config();

function getRpcUrl(chain: Chain) {
  return chain.rpcUrls.default.http[0];
}

if (typeof process.env.ORBIT_DEPLOYMENT_TRANSACTION_HASH === 'undefined') {
  throw new Error(`Please provide the "ORBIT_DEPLOYMENT_TRANSACTION_HASH" environment variable`);
}

if (typeof process.env.BATCH_POSTER_PRIVATE_KEY === 'undefined') {
  throw new Error(`Please provide the "BATCH_POSTER_PRIVATE_KEY" environment variable`);
}

if (typeof process.env.VALIDATOR_PRIVATE_KEY === 'undefined') {
  throw new Error(`Please provide the "VALIDATOR_PRIVATE_KEY" environment variable`);
}

// set the parent chain and create a public client for it
const parentChain = arbitrumSepolia;
const parentChainPublicClient = createPublicClient({
  chain: parentChain,
  transport: http(),
});

if (
  getParentChainLayer(parentChainPublicClient.chain.id) == 1 &&
  typeof process.env.ETHEREUM_BEACON_RPC_URL === 'undefined'
) {
  throw new Error(
    `Please provide the "ETHEREUM_BEACON_RPC_URL" environment variable necessary for L2 Orbit chains`,
  );
}

async function main() {
  // tx hash for the transaction to create rollup
  const txHash = process.env.ORBIT_DEPLOYMENT_TRANSACTION_HASH as `0x${string}`;

  // get the transaction
  const tx = createRollupPrepareTransaction(
    await parentChainPublicClient.getTransaction({ hash: txHash }),
  );

  // get the transaction receipt
  const txReceipt = createRollupPrepareTransactionReceipt(
    await parentChainPublicClient.getTransactionReceipt({ hash: txHash }),
  );

  // get the chain config from the transaction inputs
  const chainConfig: ChainConfig = JSON.parse(tx.getInputs()[0].config.chainConfig);

  // get the core contracts from the transaction receipt
  const coreContracts = txReceipt.getCoreContracts();

  // prepare the node config
  const nodeConfigParameters: PrepareNodeConfigParams = {
    chainName: process.env.CHAIN_NAME as '${string}',
    chainConfig,
    coreContracts,
    batchPosterPrivateKey: process.env.BATCH_POSTER_PRIVATE_KEY as `0x${string}`,
    validatorPrivateKey: process.env.VALIDATOR_PRIVATE_KEY as `0x${string}`,
    parentChainId: parentChain.id,
    parentChainRpcUrl: getRpcUrl(parentChain),
  };

  // For L2 Orbit chains settling to Ethereum mainnet or testnet
  if (getParentChainLayer(parentChainPublicClient.chain.id) === 1) {
    nodeConfigParameters.parentChainBeaconRpcUrl = process.env.ETHEREUM_BEACON_RPC_URL;
  }

  const nodeConfig = prepareNodeConfig(nodeConfigParameters);

  await writeFile('node-config.json', JSON.stringify(nodeConfig, null, 2));
  console.log(`Node config written to "node-config.json"`);


  // get utils address from nodeConfig info-json string
  const infoJson = JSON.parse(nodeConfig.chain?.['info-json'] as string);
  const validatorUtils = infoJson[0]?.rollup?.['validator-utils'];

  const orbitSetupScript = {
    chainInfo: {
      networkFeeReceiver: chainConfig.arbitrum.InitialChainOwner,
      infrastructureFeeCollector: chainConfig.arbitrum.InitialChainOwner,
      staker: process.env.VALIDATOR_ADDRESS,
      batchPoster: process.env.BATCH_POSTER_ADDRESS,
      chainOwner: chainConfig.arbitrum.InitialChainOwner,
      chainId: chainConfig.chainId,
      chainName: nodeConfigParameters.chainName,
      minL2BaseFee: 100000000,
      parentChainId: parentChain.id,
      'parent-chain-node-url': process.env.ETHEREUM_BEACON_RPC_URL,
      utils: validatorUtils,
      rollup: coreContracts.rollup,
      inbox: coreContracts.inbox,
      nativeToken: coreContracts.nativeToken,
      outbox: coreContracts.outbox,
      rollupEventInbox: coreContracts.rollupEventInbox,
      challengeManager: coreContracts.challengeManager,
      adminProxy: coreContracts.adminProxy,
      sequencerInbox: coreContracts.sequencerInbox,
      bridge: coreContracts.bridge,
      upgradeExecutor: coreContracts.upgradeExecutor,
      validatorUtils: coreContracts.validatorUtils,
      validatorWalletCreator: coreContracts.validatorWalletCreator,
      deployedAtBlockNumber: coreContracts.deployedAtBlockNumber,
    },
  }
  await writeFile('orbitSetupScriptConfig.json', JSON.stringify(orbitSetupScript, null, 2));
  console.log(`Script config written to "orbitSetupScriptConfig.json"`);
}

main();
