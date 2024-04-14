# Audiobook Marketplace for NEAR Blockchain

## Description
This project is an audiobook marketplace built on the NEAR Blockchain. Where users can add their own audiobooks by filling form that contains Title Description Image Link Audio Link and Price. Users can update their profile picture. Other users can Buy and Sell their books. And a Login Management System. 

## Functions
User must connect their near wallet

Signup or Register:- 
User cannot proceed without signing up

Signin or Login:-
User should signup before signing in

Profile:-
User can add books (audioUrl must be valid), Sell and Edit or cancel the listing.
User can update their profile picture.
Play your audiobooks

Home:-
All the collections shown only if it is listed for selling and owner cannot buy their own listed audiobook

## Getting Started
To get a local copy up and running follow these simple steps.

### Prerequisites
- Node.js installed
- yarn or npm package manager

### Installation
1. Clone the repository
   ```sh
   git clone https://github.com/CodeDialect/audiobooks-near.git
   ```
   
   1.1 Install CLI Tools or install it to your system directly
      ```bash
      yarn global add near-cli assemblyscript asbuild
      ```
   1.2 Login the Near Account
      ```bash
      yarn near login
      ```
   1.3 Create a subaccount for contract deployment or deploy logged one
      ```bash
      yarn near create-account yourcontract.myaccount.testnet --masterAccount myaccount.testnet --initialBalance 5
      ```
   1.4 Compile
      ```bash
      yarn asb
      ```
   1.5 Deploy the contract or [use contract mentioned at step 2.1]
      ```bash
      yarn near deploy yourcontract.myaccount.testnet build/release/audiobooks.wasm
      ```
2. Navigate to the frontend directory
    ```bash
   cd frontend
     ```
   2.1 Edit Enviornment Variable [.env.example]
    
   rename the .env.example to: 
   ```bash 
   .env 
   ```
   Update .env [as deployed contract in the step 1 or use my already deployed: contract.audiobooks.testnet]
   ```bash 
   REACT_APP_CONTRACT_ADDRESS= contract.myaccount.testnet 
   REACT_APP_ENV= testnet
   ```

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
