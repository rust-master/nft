import React from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.createEmoji = this.createEmoji.bind(this);
    this.state = {
      emojiUnicode: "",
    };
  }

  handleChange = (event) => {
    this.setState({
      emojiUnicode: event.target.value,
    });
  };

  createEmoji = () => {
    const { emojiUnicode } = this.state;
  };

  render() {
    return (
      <div className="App">
        <input
          name="emojiUnicode"
          type="text"
          placeholder="Enter Unicode Emoji"
          onChange={this.handleChange}
        />

        <button onClick={this.createEmoji}>Submit</button>
        <h5>{this.state.emojiUnicode}</h5>
      </div>
    );
  }
}

export default App;
