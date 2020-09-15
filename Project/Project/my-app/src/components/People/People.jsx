import React, {useState, useEffect} from "react";

const PeopleList = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  const delPerson = (id) => {
    console.log('По кнопке кликнули ' + id);
    fetch("api/People/" + id, {
      method: 'DELETE'
    }).then(res => res.json())
      .then(result => setItems(result))
  }

  useEffect(() => {
    fetch("api/People")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [])

  if (error) {
    return <tr><td>Ошибка: {error.message}</td></tr>;
  } else if (!isLoaded) {
    return <tr><td> </td></tr>;
  } else if (items.length === 0) {
    return <tr>
      <td className="center" colSpan="5">Отсутствуют</td>
    </tr>
  } else {
    return (items.map((p, i) => (
        <Person delPerson={delPerson} key={p.id} i={i+1} data={p}/>
      ))
    );
  }
}

const Person = (props) => {
  let title;
  if (props.data.team != null) {
    title = props.data.team.title;
  } else {
    title = 'Отсутсвует';
  }
  return (
    <tr>
      <td className="td_index center">{props.i}.</td>
      <td className="pad_td">{props.data.name}</td>
      <td className="pad_td center">{props.data.position}</td>
      <td className="pad_td center">{title}</td>
      <td className="pad_td center">
        <button className="button_del" onClick={() => {
          props.delPerson(props.data.id);
        }}>
          <img src="../images/del_check.png" className="del" alt="del_check"/>
        </button>
      </td>
    </tr>
  );
}

const People = () => {
  return(
    <div>
      <h2>Все сотрудники:</h2>
      <table className="list_table">
        <thead>
        <tr className="title_tr">
          <th className="th_item center">№</th>
          <th className="pad_th">ФИО</th>
          <th className="pad_th">Должность</th>
          <th className="pad_th">Команда</th>
          <th className="th_item">Удалить</th>
        </tr>
        </thead>
        <tbody>
          <PeopleList />
        </tbody>
      </table>
    </div>
  )
}
export default People;
