import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss";

export default function DayListItem(props) {
  const clickHandler = () => {
    props.setDay(props.name);
  };

  const DayListClass = classNames({
    "day-list__item": true,
    " day-list__item--selected": props.name === props.day,
    " day-list__item--full": props.spots === 0,
  });

  const formatSpots = () => {
    if (props.spots > 1) {
      return `${props.spots} spots remaining`;
    }

    if (props.spots === 1) {
      return `${props.spots} spot remaining`;
    }

    if (props.spots < 1) {
      return `no spots remaining`;
    }
  };
  return (
    <li data-testid="day" className={DayListClass} onClick={clickHandler}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots()}</h3>
    </li>
  );
}
