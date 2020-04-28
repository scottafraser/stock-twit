import React from "react";
import Emoji from "./Emoji";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    height: "20em",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "left",
    flexDirection: "column",
  },
});

export default function Intro() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h3" component="h2" gutterBottom>
        Hi There! <Emoji symbol="👋" />
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Search the StockTwits API Try searching codes like AMZN, AAPL, GOOG...
      </Typography>
    </div>
  );
}
