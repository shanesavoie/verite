import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { NextPage } from "next"
import React from "react"
import ConnectWallet from "../components/dapp/ConnectWallet"
import Dapp from "../components/dapp/Dapp"
import Layout from "../components/dapp/Layout"

const DappPage: NextPage = () => {
  const { active } = useWeb3React<Web3Provider>()

  // The first next thing we need to do is ask the user to connect the wallet.
  // When the wallet gets connected, we are going to save the users's address
  // in the component's state. So if it hasn't been saved yet, we show the
  // ConnectWallet component.
  //
  // Note that we pass it a callback that is going to be called when the user
  // clicks a button. This callback just calls the _connectWallet method.
  if (active) {
    return <Dapp />
  } else {
    return (
      <Layout>
        <ConnectWallet />
      </Layout>
    )
  }
}

export default DappPage
