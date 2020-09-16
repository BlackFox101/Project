import React, {useEffect, useState} from "react";


const TeamList = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  const delTeam = (id) => {
    fetch("api/Team/" + id, {
      method: 'DELETE'
    }).then(res => res.json())
      .then(result => setItems(result))
  }

  useEffect(() => {
    fetch("api/Team")
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
    return <tr><td colSpan="3" className="center">Загрузка..</td></tr>;
  } else if (items.length === 0) {
    return (
      <tr>
        <td colSpan="3" className="center">Отсутствуют</td>
      </tr>
    )
  } else {
    return (items.map((p, i) => (
        <TeamItem delTeam={delTeam} key={p.id} i={i+1} data={p}/>
      ))
    );
  }
}

const TeamItem = (props) => {
  return (
    <tr>
      <td className="td_index center">{props.i}.</td>
      <td className="pad_td center">{props.data.title}</td>
      <td className="pad_td center">
        <button className="button_del" onClick={() => {
          props.delTeam(props.data.id);
        }}>
          <img src="../images/del_check.png" className="del" alt="del_check"/>
        </button>
      </td>
    </tr>
  )
}


const Team = () => {
  return (
    <div>
      <h2>Все команды</h2>
      <table className="list_table">
        <thead>
          <tr className="title_tr">
            <th className="th_item center">№</th>
            <th className="pad_th">Название</th>
            <th className="th_item">Удалить</th>
          </tr>
        </thead>
        <tbody>
          <TeamList />
        </tbody>
      </table>
    </div>
  )
}

export default Team;