import React from "react";

const Person = (props) => {
  return (
    <tr>
      <td className="center">{props.id}</td>
      <td className="pad_td">{props.name}</td>
    </tr>
  );
}

const People = (props) => {

  let peopleElements = props.people
    .map(p => <Person key={p.Id} id={p.Id} name={p.Name}/>);

  return (
    <table>
      <thead>
        <tr className="title_tr">
          <th className="th_item center">Id</th>
          <th className="pad_th">Name</th>
        </tr>
      </thead>
      <tbody>
        {peopleElements}
      </tbody>
    </table>
  )
}

export default People;