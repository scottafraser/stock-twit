import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Badge from "@material-ui/core/Badge";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import Avatar from "@material-ui/core/Avatar";
import FavoriteIcon from "@material-ui/icons/Favorite";
import parse from "html-react-parser";

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
  const time = moment(message.created_at).format("h:mma, MMM Do");

  const createTextLinks = (content) => {
    var exp_match = /(\b(https?|):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    var element_content = content.replace(exp_match, "<a href='$1'>$1</a>");
    var new_exp_match = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    var new_content = element_content.replace(
      new_exp_match,
      '$1<a target="blank_" href="http://$2">$2</a>'
    );
    return new_content;
  };

  const body = createTextLinks(message.body);

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
        <Typography component="p">{parse(`${body}`)}</Typography>
      </CardContent>
      <CardContent>
        <Badge
          badgeContent={message.user.like_count}
          max={9999}
          color="primary"
        >
          <FavoriteIcon />
        </Badge>
      </CardContent>
    </Card>
  );
}
