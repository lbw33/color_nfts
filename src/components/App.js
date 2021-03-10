import React, { Component } from 'react';
import Navbar from './Navbar'
import Web3 from 'web3';
import Color from '../abis/Color.json'
import './styles/App.css';

class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      colors: []
    }    
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying Metamask.')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId() 
    const networkData = Color.networks[networkId] 
    if(networkData) {
    const abi = Color.abi
    const address = networkData.address
    const contract = new web3.eth.Contract(abi, address)
    this.setState({ contract })
    const totalSupply = await contract.methods.totalSupply().call()
    this.setState({ totalSupply }) 
    for(let i = 1; i <= totalSupply; i++) {
      let color = await contract.methods.colors(i - 1).call()
      this.setState({ colors: [...this.state.colors, color] })
    }
    } else {
      window.alert('Smart Contract has not been deployed to the detected network.')
    }
  }

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  mint = (color) => {
    this.state.contract.methods.mint(color).send({ from: this.state.account })
    .once('receipt', (receipt) => { 
      this.setState({
        colors: [this.state.colors, color] 
      })
    })
  }

  render() {
    return (
      <div>
      <Navbar account={ this.state.account } />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
               <h1>Issue Token</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const color = this.color.value
                  this.mint(color)
                }}>
                  <input 
                    type='text' 
                    className='form-control mb-1'
                    placeholder='e.g. #FFFFFF'
                    ref={(input) => {this.color = input}} 
                    />
                  <input 
                    type='submit' 
                    className='btn btn-block btn-primary' 
                    value='Mint' 
                  />
                </form>
              </div>
            </main>
          </div>
          <hr />
          <div className='row text-center'>
          { this.state.colors.map((color, key) => {
            return(
              <div key={key} className="col-md-3 mb-3">
              <div className='token' style={{ backgroundColor: color}}></div>
              <div>{color}</div>
            </div>
            )
          })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
