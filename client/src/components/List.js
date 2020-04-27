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
    verifiedSymbolList: [],
    countArray: [],
    isLoading: false,
    noResults: false,
    cursor: {},
  };

  // componentDidMount() {
  //   this.setState({ verifiedSymbolList: [] });
  // }

  componentDidUpdate() {
    let verified = this.state.verifiedSymbolList;
    let symbols = this.state.symbolArray;
    if (symbols.length !== verified.length) {
      this.setState({ symbolArray: this.cleanArray(verified, "symbol") });
    }
    this.cleanTweets();
  }

  cleanArray = (arr, comp) => {
    arr.reduce((acc, current) => {
      const x = acc.find((item) => item[comp] === current[comp]);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    return arr;
  };

  handleChange = (event) => {
    this.setState({ input: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ isLoading: true, tweets: [], verifiedSymbolList: [] });
    const cleanInput = this.state.input.trim().replace(/( )?:( )?/g, "");
    this.getTweets(cleanInput);
  };

  handleDelete = (symbol) => {
    const deleteArray = this.state.symbolArray.filter(
      (a) => a.symbol !== symbol
    );
    this.setState({ symbolArray: deleteArray });
  };

  tweetCall = async (s) => {
    const max = this.state.cursor.max ? this.state.cursor.max : 0;
    const url = `/symbol/${s}/count/${max}`;
    axios.get(url).then((res) => {
      if (res.data.messages) {
        this.setState({
          tweets: this.appendTweets(res.data.messages),
          tweetCount: this.state.tweets.length + res.data.messages.length,
          cursor: res.data.cursor,
          verifiedSymbolList: this.state.verifiedSymbolList.concat(
            res.data.symbol
          ),
        });
      }
    });
  };

  nextTweetCall = async (s) => {
    const max = this.state.cursor.max ? this.state.cursor.max : 0;
    const url = `/symbol/${s}/count/${max}`;
    axios.get(url).then((res) => {
      if (res.data.messages) {
        this.setState({
          tweets: this.appendTweets(res.data.messages),
          tweetCount: this.state.tweets.length + res.data.messages.length,
          cursor: res.data.cursor,
        });
      }
    });
  };

  getNextTweets = async () => {
    const maxList = [];
    this.state.symbolArray.forEach((s) => {
      maxList.push(this.nextTweetCall(s.symbol));
    });
  };

  getTweets = async () => {
    debugger;
    let list = this.state.symbolArray;
    let input = this.state.input;
    const searched = list.some((el) => el.symbol === input.toUpperCase());
    if (!searched) {
      this.tweetCall(this.state.input);
    }
    if (list.length > 0) {
      this.getNextTweets();
    }
  };

  getNext = () => {
    this.getTweetsFromSymbolList();
  };

  appendTweets = (newData) => {
    const oldData = this.state.tweets;
    const allTweets = oldData.concat(newData);
    this.setState({ tweetCount: allTweets.length });
    return allTweets;
  };

  // these are not tested
  cleanTweets = () => {
    let sortList = this.cleanArray(this.state.tweets, "id");
    sortList.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    this.setState({ tweets: sortList });
    this.countTweets();
  };

  // these are not tested
  countTweets = () => {
    var countArray = this.state.symbolArray;
    this.state.tweets.map((t) => {
      countArray = countArray.map((s) => {
        console.log(t, s);
        if (t.symbols.includes(s)) {
          s.count = s.count++;
        }
      });
      this.setState({ countArray: countArray });
    });
  };

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
            next={() => this.getTweets()}
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
