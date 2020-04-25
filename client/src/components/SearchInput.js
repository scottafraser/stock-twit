import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export default function SearchInput({ ...props }) {
  const classes = useStyles();

  return (
    <form
      className={classes.root}
      noValidate
      autoComplete="off"
      onSubmit={(e) => props.handleSubmit(e)}
      value={this.props.symbol}
    >
      <Input
        placeholder="Stock Symbol"
        type="text"
        name="symbols"
        onChange={props.handleChange}
      />
    </form>
  );
}
