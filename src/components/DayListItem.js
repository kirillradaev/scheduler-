import React from "react";
import "components/DayListItem.scss";
import classNames from "classnames";

export default function DayListItem(props) {
  const dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": !props.spots
  })

  return (
    <li className ={dayClass} onClick={() => props.setDay && props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      {formatSpots(props.spots)}
    </li>
  );
}

function formatSpots(spots) {
   if(spots === 0) {
     return (
     <h3 className="text--light">no spots remaining</h3>)
   }else if(spots === 1) {
    return (
    <h3 className="text--light">1 spot remaining</h3>)
  }else {
    return (
    <h3 className="text--light">{spots} spots remaining</h3>)
  }
}

