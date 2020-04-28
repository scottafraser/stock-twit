import React from "react";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    bottom: "10px",
    textAlign: "center",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <Typography
      className={classes.root}
      variant="subtitle2"
      gutterBottom
      align="center"
    >
      Scott Fraser Ⓒ 2020 |
      <Link href="https://github.com/scottafraser/stock-twit">GitHub</Link>
    </Typography>
  );
}
