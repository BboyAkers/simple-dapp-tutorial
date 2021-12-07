import MetaMaskOnboarding from '@metamask/onboarding';
/*
The `piggybankContract` is compiled from:

  pragma solidity ^0.4.0;
  contract PiggyBank {

      uint private balance;
      address public owner;

      function PiggyBank() public {
          owner = msg.sender;
          balance = 0;
      }

      function deposit() public payable returns (uint) {
          balance += msg.value;
          return balance;
      }

      function withdraw(uint withdrawAmount) public returns (uint remainingBal) {
          require(msg.sender == owner);
          balance -= withdrawAmount;

          msg.sender.transfer(withdrawAmount);

          return balance;
      }
  }
*/


const initialize = async () => {
  //Created check function to see if the MetaMask extension is installed
  const { isMetaMaskInstalled } = MetaMaskOnboarding;

  //Basic Actions Section
  const onboardButton = document.getElementById('connectButton');
  const getAccountsButton = document.getElementById('getAccounts');
  const getAccountsResult = document.getElementById('getAccountsResult');

  const currentUrl = new URL(window.location.href);
  const forwarderOrigin =
    currentUrl.hostname === 'localhost' ? 'http://localhost:9010' : undefined;
  let onboarding;

  try {
    onboarding = new MetaMaskOnboarding({ forwarderOrigin });
  } catch (error) {
    console.error(error);
  }

  //Changes the onboarding button and start the onboarding procces via 
  const onClickInstall = () => {
    onboardButton.innerText = 'Onboarding in progress';
    onboardButton.disabled = true;
    onboarding.startOnboarding();
  }

  const onClickConnect = async () => {
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      await ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error(error);
    }
  };

  const MetaMaskClientCheck = () => {
    //Now we check to see if MetaMask is installed
    if (!isMetaMaskInstalled()) {

      onboardButton.disabled = false;
      //If it isn't installed we ask the user to click to install it
      onboardButton.innerText = 'Click here to install MetaMask!';
      //We need to Create an 'onClickInstall' function
      onboardButton.onclick = onClickInstall;
    } else {
      //If MetaMask is installed we ask the user to connect to their wallet
      onboardButton.innerText = 'Connect';
      //When the button is clicked we call this function to connect the users MetaMask Wallet
      onboardButton.onclick = onClickConnect;
      //The button is now disabled
      onboardButton.disabled = false;
    }
  };

  // We call the MetaMaskClientCheck function to check if MetaMask is installed
  MetaMaskClientCheck();

  //Eth_Accounts-getAccountsButton
  getAccountsButton.addEventListener('click', async () => {
    //we use eth_accounts because it returns a list of addresses owned by us.
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    //We take the first address in the array of addresses and display it
    getAccountsResult.innerHTML = accounts[0] || 'Not able to get accounts';
  });

}

window.addEventListener('DOMContentLoaded', initialize)

