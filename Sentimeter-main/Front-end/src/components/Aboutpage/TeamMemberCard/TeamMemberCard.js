import React from "react";
import classes from "./TeamMemberCard.module.css";

const TeamMemberCard = (props) => {
  return (
    <div className={classes.TeamMemberCard}>
      <div className={classes.imageContainer}>
        <img src={`/images/TeamMembers/${props.image}`} alt={props.image.split(".")[0]} />
      </div>
      <h1 className={classes.name}>{props.name}</h1>
      <div className={classes.section}>
        <h3>Resposibilities</h3>
        <div className={classes.dash}></div>
        <ul className={classes.responsibilities}>
          {props.resp.map((resp, index) => (
            <li key={index}>{resp}</li>
          ))}
        </ul>
      </div>
      <div className={classes.section}>
        <h3>A qoute from me</h3>
        <div className={classes.dash}></div>
        <q className={classes.qoute}>{props.qoute}</q>
      </div>
    </div>
  );
};

export default TeamMemberCard;
