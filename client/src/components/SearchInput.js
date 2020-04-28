import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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
      style={{ paddingBottom: "1em" }}
      onSubmit={(e) => props.handleSubmit(e)}
      value={props.input}
    >
      <Input
        placeholder="Stock Symbol"
        type="text"
        name="symbols"
        onChange={(e) => {
          props.handleChange(e);
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={(e) => props.handleSubmit(e)}
      >
        Search
      </Button>
    </form>
  );
}
