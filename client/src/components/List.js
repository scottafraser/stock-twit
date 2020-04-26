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
    isLoading: false,
    noResults: false,
  };

  // componentDidMount() {
  //   // this.getTrending();
  // }

  //   componentDidMount() {
  //   this.interval = setInterval(this.getData, 60000);
  //   this.getData();
  // }

  // componentWillUnmount() {
  //   clearInterval(this.interval);
  // }

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
      if (res.data.messages) {
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
            {this.state.currentSymbol && (
              <Symbols {...this.state.currentSymbol} />
            )}
          </div>
        </div>
        {this.state.tweetCount > 0 && (
          <InfiniteScroll
            dataLength={this.state.tweetCount} //This is important field to render the next data
            next={this.getNext}
            hasMore={true}
            loader={<h4>Loading...</h4>}
          >
            {this.state.tweets.length
              ? this.state.tweets.map((t) => <Message key={t.id} message={t} />)
              : this.state.noResults && <p>Sorry, no results </p>}
          </InfiniteScroll>
        )}
      </div>
    );
  }
}
