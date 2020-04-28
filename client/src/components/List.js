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
      this.getSymbolCount();
    }
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
    this.setState({ tweets: [], tweetCount: 0 });
    const cleanInput = this.state.input.trim().replace(/( )?:( )?/g, "");
    this.getTweets(cleanInput);
  };

  handleDelete = (symbol) => {
    const deleteArray = this.state.symbolArray.filter(
      (a) => a.symbol !== symbol
    );
    const deleteTweets = this.state.tweets.filter((t) => {});
    this.setState({ symbolArray: deleteArray });
  };

  tweetCall = async (s) => {
    const url = `/symbol/${s}/count/0`;
    axios
      .get(url)
      .then((res) => {
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
      })
      .then(() => {
        this.cleanTweets();
      });
  };

  nextTweetCall = async (s) => {
    const max = 0;
    const url = `/symbol/${s}/count/${max}`;
    axios
      .get(url)
      .then((res) => {
        if (res.data.messages) {
          this.setState({
            tweets: this.appendTweets(res.data.messages),
            tweetCount: this.state.tweets.length + res.data.messages.length,
          });
        }
      })
      .then(() => {
        this.cleanTweets();
      });
  };

  getNextTweets = async () => {
    const maxList = [];
    this.state.symbolArray.forEach((s) => {
      maxList.push(this.nextTweetCall(s.symbol));
    });
  };

  getTweets = async () => {
    // debugger;
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
    const allTweets = this.state.tweets.concat(newData);
    this.setState({ tweetCount: allTweets.length });
    return allTweets;
  };

  cleanTweets = () => {
    let sortList = this.cleanArray(this.state.tweets, "id");
    sortList.slice().sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    this.setState({ tweets: sortList, tweetCount: sortList.length });
    this.getSymbolCount();
  };

  getSymbolCount = () => {
    let array = this.state.tweets.map((x) => {
      return x.symbols;
    });
    let justSymbol = array.flat().map((s) => {
      return s.symbol;
    });
    this.setState({ countList: justSymbol });
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
                countList={this.state.countList}
              />
            )}
          </div>
        </div>
        {this.state.tweetCount > 0 &&
          (this.state.tweets.length
            ? this.state.tweets.map((t) => <Message key={t.id} message={t} />)
            : this.state.noResults && <p>Sorry, no results</p>)}
      </div>
    );
  }
}
