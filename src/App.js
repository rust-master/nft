import React from "react";
import "./App.css";
import Web3 from "web3";
import contractJson from "../src/build/contracts/Emoji.json";

import { withStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
  root1: {
    backgroundColor: "#fff",
    maxWidth: 200,
    marginTop: 20,
    marginLeft: 80,
  },
  Typo1: {
    color: "#266AFB",
    fontWeight: "bold",
    textAlign: "left",
  },
});

class App extends React.Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }
  componentDidMount() {
    document.body.style.backgroundColor = "#d9ecec";
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
    try {
      String.fromCodePoint("0x" + this.state.emojiUnicode);
      this.state.contract.methods
        .mint(this.state.emojiUnicode)
        .send({ from: this.state.account })
        .once("receipt", (receipt) => {
          this.setState({
            emojis: [...this.state.emojis, this.state.emojiUnicode],
          });
        });
    } catch (e) {
      alert("Enter Correct Code");
    }
  };

  render() {
    const { classes } = this.props;

    let placeholder;
    let ListTemplate;

    try {
      placeholder = String.fromCodePoint("0x" + this.state.emojiUnicode);
    } catch (e) {
      alert("Enter Correct Code");
    }

    ListTemplate = this.state.emojis.map((emoji, key) => (
      <Card className={classes.root1}>
        <CardContent>
          <div key={key} className="col-md-3 mb-3">
            <div className="token">{String.fromCodePoint("0x" + emoji)}</div>
          </div>
          <Typography
            gutterBottom
            variant="h6"
            component="h5"
            className={classes.Typo1}
          >
            <h6 style={{ color: "#0073f8", textAlign: "center" }}>
              Emoji Code: {"0x" + emoji}
            </h6>
          </Typography>
        </CardContent>
      </Card>
    ));

    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: "5px" }}
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
            <main
              role="main"
              style={{ marginLeft: "40%" }}
              className="col-lg-12 d-flex text-center"
            >
              <div className="content mr-auto ml-auto">
                <h1>Issue Token</h1>
                <input
                  type="text"
                  name="emojiUnicode"
                  className="form-control mb-1"
                  placeholder="e.g. 2764"
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
          <div className="row">
            <div style={{ marginLeft: "10px" }}>
              Placeholder Emoji: {placeholder}{" "}
            </div>
          </div>
          <div className="row text-center">{ListTemplate}</div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);
