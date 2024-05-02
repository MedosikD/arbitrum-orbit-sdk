## Dependencies

1. Ubuntu 22.04
2. [Docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-22-04)
3. [Docker Compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-22-04)
4. Nodejs v18 or greater, NPM and Yarn

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
npm install --global yarn
```

## Deploy Orbit Chain

1. Clone repository and enter it

```bash
git clone https://github.com/MedosikD/arbitrum-orbit-sdk.git && cd ./arbitrum-orbit-sdk
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

# Arbitrum Orbit SDK

> [!WARNING]
> Disclaimer: This project is an Alpha release and should not be used in a production environment. We are working on getting it ready for mainnet deployments, meanwhile please use it at your own discretion.

TypeScript SDK for building [Arbitrum Orbit](https://arbitrum.io/orbit) chains.
