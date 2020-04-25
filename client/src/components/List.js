import React, { Component } from "react";
import axios from "axios";
import Message from "./Message";
import Input from "@material-ui/core/Input";

export default class List extends Component {
  state = {
    tweets: [],
    symbol: "",
    isLoading: false,
  };

  componentDidMount() {
    this.getTrending();
  }

  handleChange = (event) => {
    this.setState({ symbol: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.getSymbol(this.state.symbol);
  };

  getSymbol = (symbol) => {
    const url = `/symbol/${symbol}`;
    this.setState({ isLoading: true });
    axios.get(url).then((res) => {
      const tweets = res.data.messages;
      this.setState({ tweets });
    });
    this.setState({ isLoading: false });
  };

  getTrending = () => {
    const url = `/trending`;
    this.setState({ isLoading: true });
    axios.get(url).then((res) => {
      const tweets = res.data.messages;
      this.setState({ tweets });
    });
    this.setState({ isLoading: false });
  };

  render() {
    return (
      <div>
        <form
          style={{ paddingBottom: "1em" }}
          onSubmit={(e) => this.handleSubmit(e)}
          value={this.state.symbol}
        >
          <Input
            placeholder="Stock Symbol"
            type="text"
            name="symbols"
            onChange={this.handleChange}
          />
        </form>
        <div>
          {this.state.tweets.map((t) => (
            <Message key={t.id} message={t} />
          ))}
        </div>
      </div>
    );
  }
}
