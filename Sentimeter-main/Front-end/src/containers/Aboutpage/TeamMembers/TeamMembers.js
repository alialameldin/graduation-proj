import React from "react";
import classes from "./TeamMembers.module.css";
import members from "./data";
import TeamMemberCard from "../../../components/Aboutpage/TeamMemberCard/TeamMemberCard";
import SectionHeader from "../SectionHeader/SectionHeader";

const TeamMembers = (props) => {
  return (
    <div className={classes.section}>
      <SectionHeader>Our Team</SectionHeader>
      <div className={classes.TeamMembers}>
        {members.map((member, index) => (
          <TeamMemberCard key={index} name={member.name} image={member.image} resp={member.responsibilities} qoute={member.qoute} />
        ))}
      </div>
    </div>
  );
};

export default TeamMembers;
