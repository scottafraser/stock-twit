import React, { Component } from "react";
import axios from "axios";
import Message from "./Message";
import Input from "@material-ui/core/Input";
import Symbols from "./Symbols";
import "../App.css";

export default class List extends Component {
  state = {
    tweets: [],
    input: "",
    currentSymbol: null,
    isLoading: false,
  };

  componentDidMount() {
    this.getTrending();
  }

  handleChange = (event) => {
    this.setState({ input: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.getSymbol(this.state.input);
  };

  getSymbol = (symbol) => {
    const url = `/symbol/${symbol}`;
    this.setState({ isLoading: true });
    axios.get(url).then((res) => {
      this.setState({
        tweets: res.data.messages,
        currentSymbol: res.data.symbol,
      });
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
        <div className="search-field">
          <form
            style={{ paddingBottom: "1em" }}
            onSubmit={(e) => this.handleSubmit(e)}
            value={this.state.input}
          >
            <Input
              placeholder="Stock Symbol"
              type="text"
              name="symbols"
              onChange={this.handleChange}
            />
          </form>
          <div>
            {this.state.currentSymbol && (
              <Symbols {...this.state.currentSymbol} />
            )}
          </div>
        </div>
        <div>
          {this.state.tweets
            ? this.state.tweets.map((t) => <Message key={t.id} message={t} />)
            : "No Results"}
        </div>
      </div>
    );
  }
}
