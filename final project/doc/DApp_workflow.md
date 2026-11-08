# Workflow of DApp

npm run dev
    ↓
Vite development server
    ↓
index.html
    ↓
src/main.jsx
    ↓
src/App.jsx
    ├── useRegistry() returns { connect }
    │			↓
    ├── App.jsx gets the connect function
    │        		↓
    ├── onClick={connect} attaches it to the button
    │         		↓
    ├── Clicking the button executes connect()
    ↓
src/useRegistry.js (when User interacts)
    ↓
Ethers.js
    ├── Ethers.js connect browser to public Sepolia RPC endpoint using JsonRpcProvider(READ_RPC_URL)
    │			↓
    ├── verify connection using provider.getNetwork()
    │			↓
    ├── Ethers.js create a read-only read-only contract object using new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
    │          ├── get CONTRACT_ADDRESS and CONTRACT_AB from src/contract.js
    │          └── contract object has method for calling actual Solidity code: contract[method](...args)
    │			↓
    └── wait for MetaMask signing → Sepolia contract transactions

## Example: When User interact with DApp element in browser:

User submits form
    ↓
React handler → useRegistry.send(...)
    ↓
Ethers.js creates a MetaMask provider and gets the signer
    ↓
Ethers.js uses the contract address + ABI to encode the call
    ↓
MetaMask asks for approval, signs, and submits the transaction
    ↓
Sepolia executes the deployed contract
    ↓
Ethers.js waits for the receipt and decodes emitted events
    ↓
Frontend reads updated data through Ethers
    ↓
React updates the screen

---
# remarks:

## React detect state changes and update the browser

state changes
    ↓
React renders the component again
    ↓
browser screen updates

## window.ethereum

window.ethereum object is from browser extension
