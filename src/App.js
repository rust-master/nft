import React from "react";
import "./App.css";
import Web3 from "web3";
import contractJson from "../src/build/contracts/Emoji.json";

class App extends React.Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const webeProvider = new Web3(
      Web3.givenProvider || "http://localhost:7545"
    );
    const accounts = await webeProvider.eth.getAccounts();

    this.setState({ account: accounts[0] });
    console.log("Account: " + this.state.account);

    const netId = await web3.eth.net.getId();
    const deployedNetwork = contractJson.networks[netId];

    if (deployedNetwork) {
      const emojiContract = new web3.eth.Contract(
        contractJson.abi,
        deployedNetwork.address
      );
      this.setState({ contract: emojiContract });

      const totalSupply = await emojiContract.methods.totalSupply().call();
      this.setState({ totalSupply });
      // Load Colors
      for (var i = 1; i <= totalSupply; i++) {
        const emoji = await emojiContract.methods.emojis(i - 1).call();
        this.setState({
          emojis: [...this.state.emojis, emoji],
        });
      }
    } else {
      window.alert("Smart contract not deployed to detected network.");
    }
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.mint = this.mint.bind(this);
    this.state = {
      emojiUnicode: "1F44B",
      emojis: [],
      account: "",
      contract: null,
      totalSupply: 0,
    };
  }

  handleChange = (event) => {
    this.setState({
      emojiUnicode: event.target.value,
    });
  };

  mint = () => {
    this.state.contract.methods
      .mint(this.state.emojiUnicode)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        this.setState({
          colors: [...this.state.colors, this.state.emojiUnicode],
        });
      });
  };

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Emoji Tokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">
                <span id="account">{this.state.account}</span>
              </small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Issue Token</h1>
                <input
                  type="text"
                  name="emojiUnicode"
                  className="form-control mb-1"
                  placeholder="e.g. HTML Code Decimal"
                  onChange={this.handleChange}
                />
                <button
                  onClick={this.mint}
                  type="submit"
                  className="btn btn-block btn-primary"
                >
                  Mint
                </button>
              </div>
            </main>
          </div>
          <hr />
          <div className="row"></div>
          <div className="row text-center">
            {this.state.emojis.map((emoji, key) => {
              return (
                <div key={key} className="col-md-3 mb-3">
                  <div className="token"></div>
                  <div>{String.fromCodePoint("0x" + emoji)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
