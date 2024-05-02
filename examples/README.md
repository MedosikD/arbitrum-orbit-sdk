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

1. Install orbit-sdk

```bash
yarn add @arbitrum/orbit-sdk viem@^1.20.0
```

2. Clone repository / go to create-rollup-custom-fee-token / create .env file

```bash
git clone https://github.com/MedosikD/arbitrum-orbit-sdk.git && cd ./arbitrum-orbit-sdk/examples/create-rollup-custom-fee-token && cp .env.example .env
```

3. Open file uisng vim/nano and fill all variables

4. Install yarn dependencies

```bash
yarn install
```

5. Run the script

```bash
yarn dev
```

## Generate

# Arbitrum Orbit SDK

> [!WARNING]
> Disclaimer: This project is an Alpha release and should not be used in a production environment. We are working on getting it ready for mainnet deployments, meanwhile please use it at your own discretion.

TypeScript SDK for building [Arbitrum Orbit](https://arbitrum.io/orbit) chains.
