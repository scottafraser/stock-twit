import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "left",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
    textTransform: "uppercase",
  },
}));

export default function Symbols(props) {
  const classes = useStyles();

  const handleDelete = (s) => {
    props.handleDelete(s.symbol);
  };

  const countMatch = (s) => {
    return props.countList.filter(function (x) {
      return x === s;
    }).length;
  };

  return (
    <div className={classes.root}>
      {props.list.map((s, i) => (
        <Chip
          label={s.symbol + " " + countMatch(s.symbol)}
          onDelete={() => handleDelete(s)}
          key={s.symbol + i}
        />
      ))}
    </div>
  );
}
