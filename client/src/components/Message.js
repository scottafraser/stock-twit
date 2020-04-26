import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginBottom: "1em",
  },
  title: {
    fontSize: 14,
  },
});

export default function SimpleCard({ message }) {
  const classes = useStyles();
  const time = moment(message.created_at).format("h:mm a, MMM Do YY");

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar
            aria-label="recipe"
            className={classes.avatar}
            src={message.user.avatar_url}
          />
        }
        title={message.user.name}
        subheader={time}
      />
      <CardContent style={{ paddingTop: "0px" }}>
        <Typography component="h6">{message.body}</Typography>
        {/* <Typography className={classes.pos} color="textSecondary">
          adjective
        </Typography>
        <Typography variant="body2" component="p">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography> */}
      </CardContent>
      {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
}
