## Dependencies

1. Ubuntu 22.04
2. [Docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-22-04)
3. [Docker Compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-22-04)
4. Nodejs v18 or greater, NPM and Yarn:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
npm install --global yarn
```

## Deploy Orbit Chain

1. Clone repository and enter it. All steps are done in home ~ directory.

```bash
cd ~ && git clone https://github.com/MedosikD/arbitrum-orbit-sdk.git && cd ./arbitrum-orbit-sdk
```

2. Install Orbit SDK, enter script folder and create .env file

```bash
yarn add @arbitrum/orbit-sdk viem@^1.20.0 && cd ./examples/create-rollup-custom-fee-token && cp .env.example .env
```

3. Open .env file uisng vim/nano and pass all variables

4. Install yarn dependencies

```bash
yarn install
```

5. Run the script

```bash
yarn dev
```

6. Save deployment transaction hash

## Generate config files

1. Enter script directory and create .env file

```bash
cd ../prepare-node-config/ && cp .env.example .env
```

2. Open .env file uisng vim/nano and pass all variables. ORBIT_DEPLOYMENT_TRANSACTION_HASH is a has you saved from previous step.

3. Run the script. Two files will be created - nodeConfig.json and orbitSetupScriptConfig.json.

```bash
yarn dev
```

4. Change localhost to das-server in nodeConfig.json

```bash
sed -i 's/localhost/das-server/g' nodeConfig.json
```

## Run the Orbit node.

1. Clone repository

```bash
cd ~ && git clone https://github.com/OffchainLabs/orbit-setup-script.git && cd orbit-setup-script
```

2. Change localhost to server IP in all config files. If you are deploying locally skip this step and procced with step 3.
   Set only SERVER_IP to actuall IP address.

```bash
find ./docker-compose/ -type f -exec sed -i 's/localhost/SERVER_IP/g' {} \; -print && sed -i 's/127.0.0.1/0.0.0.0/g' docker-compose.yaml
```

3. Move nodeConfig.json and orbitSetupScriptConfig.json to config folder.

```bash
mv ../arbitrum-orbit-sdk/examples/prepare-node-config/nodeConfig.json ./config/ && mv ../arbitrum-orbit-sdk/examples/prepare-node-config/orbitSetupScriptConfig.json ./config/
```

4. Install yarn dependencies

```bash
yarn install
```

5. Laucnh nodes in docker

```bash
docker compose up -d
```

6. Verify if everything is working by accessing your explorer on IP address in browser.

7. Finish setting up your chain
   We will use a Hardhat script that handles the following tasks:
   7.1 Fund the batch-poster and validator (staker) accounts on your underlying L2 chain.
   7.2 Deposit ETH into your account on the chain using your chain's newly deployed bridge.
   7.3 Deploy your Token Bridge contracts on both L2 and local Orbit chains.
   7.4 Configure parameters on the chain.
   To run this script, issue the following command (Arbitrum Sepolia):

```bash
PRIVATE_KEY="0xYourPrivateKey" L2_RPC_URL="https://sepolia-rollup.arbitrum.io/rpc" L3_RPC_URL="http://localhost:8449" yarn run setup
```

Replace OxYourPrivateKey with the private key of the Owner account you used to deploy your chain's contracts, and replacing http://localhost:8449 with the RPC URL of your chain's node.

8. PRIVATE_KEY="12ea838dea72a68eb19c8e46170ce8db19733ecfb0ea571bfa04bcab00fa7f71" L2_RPC_URL="<https://sepolia-rollup.arbitrum.io/rpc>" L3_RPC_URL="http://135.181.215.113:8449" yarn run setup
