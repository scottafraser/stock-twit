import React, { Component } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Message from "./Message";
import Input from "@material-ui/core/Input";
import Symbols from "./Symbols";
import "../App.css";

export default class List extends Component {
  state = {
    tweets: [],
    tweetCount: 0,
    input: "",
    currentSymbol: null,
    symbolArray: [],
    isLoading: false,
    noResults: false,
  };

  handleChange = (event) => {
    this.setState({ input: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.getTweets(this.state.input);
  };

  handleSymbolList = () => {
    const input = this.state.input;
    if (this.state.symbolArray.length === 0) {
      this.setState({ symbolArray: [input] });
    } else if (!this.state.symbolArray.includes(input)) {
      const newList = this.state.symbolArray.concat(input);
      this.setState({ symbolArray: newList });
    }
  };

  handleDelete = (symbol) => {
    const deleteArray = this.state.symbolArray.filter((a) => a !== symbol);
    this.setState({ symbolArray: deleteArray });
  };

  getTweets = (symbol) => {
    const url = `/symbol/${symbol}`;
    this.setState({ isLoading: true });
    axios.get(url).then((res) => {
      if (res.data.messages) {
        this.handleSymbolList();
        let count = res.data.messages.length;
        this.setState({
          tweets: res.data.messages,
          tweetCount: count,
          currentSymbol: res.data.symbol,
          cursor: res.data.cursor,
        });
      } else {
        this.setState({ noResults: true });
      }
    });
    this.setState({ isLoading: false });
  };

  appendTweets = (newData) => {
    const oldData = this.state.tweets;
    const allTweets = oldData.concat(newData);
    this.setState({ tweetCount: allTweets.length });
    return allTweets;
  };

  getNext = () => {
    if (this.state.currentSymbol) {
      const url = `/next/${this.state.currentSymbol.symbol}/count/${this.state.cursor.max}/`;
      this.setState({ isLoading: true });
      axios.get(url).then((res) => {
        this.setState({
          tweets: this.appendTweets(res.data.messages),
          tweetCount: this.state.tweetCount,
          cursor: res.data.cursor,
        });
      });
      this.setState({ isLoading: false });
    }
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
            {this.state.symbolArray.length > 0 && (
              <Symbols
                list={this.state.symbolArray}
                handleDelete={this.handleDelete}
              />
            )}
          </div>
        </div>
        {this.state.tweetCount > 0 && (
          <InfiniteScroll
            dataLength={this.state.tweetCount}
            next={this.getNext}
            hasMore={true}
            loader={<h4>Loading...</h4>}
          >
            {this.state.tweets.length
              ? this.state.tweets.map((t) => <Message key={t.id} message={t} />)
              : this.state.noResults && <p>Sorry, no results</p>}
          </InfiniteScroll>
        )}
      </div>
    );
  }
}
