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
    input: "",
    symbolArray: [],
    isLoading: false,
    noResults: false,
    cursor: {},
  };

  handleChange = (event) => {
    this.setState({ input: event.target.value });
  };

  checkSearched = (s) => {
    console.log(s);
    console.log(this.state.symbolArray);
    return this.state.symbolArray.includes(s);
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.getTweets(this.state.input);
  };

  handleSymbolList = (s) => {
    if (this.state.symbolArray.length === 0) {
      const array = [s];
      this.setState({
        symbolArray: array,
      });
    } else if (!this.checkSearched(s)) {
      console.log("here");
      const newArray = this.state.symbolArray.concat(s);
      this.setState({ symbolArray: newArray });
    }
  };

  handleDelete = (symbol) => {
    const deleteArray = this.state.symbolArray.filter(
      (a) => a.symbol !== symbol
    );
    this.setState({ symbolArray: deleteArray });
  };

  tweetCall = (s) => {
    const max = this.state.cursor.max ? this.state.cursor.max : 0;
    const url = `/symbol/${s}/count/${max}`;
    axios.get(url).then((res) => {
      if (res.data.messages) {
        this.handleSymbolList(res.data.symbol);
        this.setState({
          tweets: this.appendTweets(res.data.messages),
          tweetCount: this.state.tweets.length + res.data.messages.length,
          cursor: res.data.cursor,
        });
      }
    });
  };

  getManyTweets = () => {
    this.tweetCall(this.state.input);
    const maxList = [];
    this.state.symbolArray.forEach((s) => {
      if (!this.state.symbolArray.includes(s)) {
        maxList.push(this.tweetCall(s.symbol));
      }
    });
  };

  getTweets = () => {
    let list = this.state.symbolArray;
    if (list.length > 0) {
      this.getManyTweets();
    } else {
      this.tweetCall(this.state.input);
    }
  };

  appendTweets = (newData) => {
    const oldData = this.state.tweets;
    const allTweets = oldData.concat(newData);
    this.setState({ tweetCount: allTweets.length });
    return allTweets;
  };

  // these are not tested
  // cleanTweets = () => {
  //   let sortList = [...new Set(this.state.tweets)];
  //   sortList.sort((a, b) => {
  //     return new Date(b.created_at) - new Date(a.created_at);
  //   });
  //   this.setState({ tweets: sortList });
  //   this.countTweets();
  // };

  // these are not tested
  // countTweets = () => {
  //   var countArray = this.state.symbolArray;
  //   this.state.tweets.map((t) => {
  //     countArray = countArray.map((s) => {
  //       console.log(t, s);
  //       if (t.symbols.includes(s)) {
  //         s.count = s.count++;
  //       }
  //   });
  //     this.setState({ symbolArray: countArray });
  //   });
  // };

  // getTrending = () => {
  //   const url = `/trending`;
  //   this.setState({ isLoading: true });
  //   axios.get(url).then((res) => {
  //     const tweets = res.data.messages;
  //     this.setState({ tweets });
  //   });
  //   this.setState({ isLoading: false });
  // };

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
            // next={() => this.getTweets()}
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
