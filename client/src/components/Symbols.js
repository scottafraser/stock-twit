import React, { Component } from "react";
import Container from "@material-ui/core/Container";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";

export default class Symbols extends Component {
  state = { history: [] };
  render(props) {
    return (
      <Container>
        {props && (
          <Chip avatar={<Avatar>{props.symbol}</Avatar>} label={props.title} />
        )}
      </Container>
    );
  }
}
