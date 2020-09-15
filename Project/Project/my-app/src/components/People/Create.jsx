import React, {useEffect, useState} from "react";
import {Button, TextField, FormControl, Select, MenuItem, InputLabel, Box} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '20px',
  },
  marginBottom: {
    marginBottom: '10px'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '15ch',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const CreatePerson = () => {
  const classes = useStyles();
  const [person, setPerson] = React.useState('');
  const [teams, setTeams] = useState([]);
  const handleChange = (event) => {
    setPerson(event.target.value);
  };

  useEffect(() => {
    fetch("api/Team")
      .then(res => res.json())
      .then(result => setTeams(result))
  }, [])

  const addPerson = (event) => {
    const formData = new FormData(document.getElementById('form'));
    fetch('api/People', {
      method: 'POST',
      body: formData
    }).then(response => response.text())
      .then(data => {
        let out = JSON.parse(data);
      }).catch(() => console.log('ошибка'));
  }

  let history = useHistory();
  //const addPerson = () => history.push("/Person/Create");

  return (
    <div>
      <form id="form" className={classes.root} noValidate autoComplete="off">
        <Box width="35%"><TextField
          id="outlined-full-width"
          label="Имя"
          style={{margin: 8}}
          placeholder="ФИО"
          helperText=""
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        /></Box>
        <TextField
          id="outlined-full-width"
          label="Должность"
          style={{margin: 8}}
          placeholder="Разработчик"
          helperText=""
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
        <Box className={classes.marginBottom}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Команда</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={person}
              onChange={handleChange}
              label="Team"
            >
              <MenuItem value="">
                <em>Отсутсвует</em>
              </MenuItem>
              {(teams.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.title}</MenuItem>
              )))}
            </Select>
          </FormControl>
        </Box>
        <Button onClick={addPerson} variant="contained" >Добавить</Button>
      </form>
    </div>
  )
}

export default CreatePerson;