import React, {useEffect, useState} from "react";

const PersonDetails = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [item, setItem] = useState([]);
  let id = window.location.pathname.split('/');
  id = id[3];

  useEffect(() => {
    fetch("api/People/" + id)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItem(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [])
  if (error) {
    return <dl>
      <dt>Ошибка: {error.message}</dt>
    </dl>;
  } else if (!isLoaded) {
    return <dl>
      <dt>Загрузка..</dt>
    </dl>;
  } else {
    return (
      <div>
        <dl className="dl-horizontal">
          <dt>Имя</dt>
          <dd>
            {item.name}
            <a>
              <img src="../images/settings.png" className="settings" alt="settings"/>
            </a>
          </dd>
          <dt>Должность</dt>
          <dd>{item.position}</dd>
          <dt>Команда</dt>
          <dd>{(item.team != null) ? item.team.title : 'Отсутвует'}</dd>
          <dt><a>Отпуска</a></dt>
        </dl>
      </div>
    );
  }
}

export default PersonDetails;