# Celswap Interface

An open source interface for Celswap -- a protocol for decentralized exchange of Ethereum tokens.

- Website: [celswap.org](https://celswap.org/)
- Interface: [app.celswap.org](https://app.celswap.org)


## Accessing the Celswap Interface

To access the Celswap Interface, use an IPFS gateway link from the
 visit [app.celswap.org](https://app.celswap.org).

### First, Install Dependencies and build uniswap-sdk package

```bash
yarn
yarn build
yarn link
```

### Install Celswap Dependencies 

```bash
yarn
yarn start
```

### Run

```bash
yarn start
```

### Configuring the environment (optional)

To have the interface default to a different network when a wallet is not connected:

1. Make a copy of `.env` named `.env.local`
2. Change `REACT_APP_NETWORK_ID` to `"{YOUR_NETWORK_ID}"`
3. Change `REACT_APP_NETWORK_URL` to e.g. `"https://{YOUR_NETWORK_ID}.infura.io/v3/{YOUR_INFURA_KEY}"` 

Note that the interface only works on Ropsten and Kovan testnets 
