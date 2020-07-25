let coefficients = document.querySelectorAll('.factor');
let sprintSel = document.querySelector('#sprintSel');

let sprintsHeader = document.querySelector('#sprints-1'); //Заголовок для спринтов
let hoursHeader = document.querySelector('.cell_hour'); //Заголовок для часов
let workHoursHeader = document.querySelector('.cell_work_hour'); //Заголовок для рабочих часов
let hoursCell = document.querySelector('#Hours_td-1-0'); //Ячейка часов
let workHoursCell = document.querySelector('#WorkHours-1-0'); //Ячейка рабочих часов

let selTd = document.querySelector('#selDt'); // Ячейка селектора

let load = document.querySelector('#load');
let loadFinish = document.querySelector('#loadFinish');
load.classList.remove('hidden');
loadFinish.classList.remove('hidden');
load.remove();
loadFinish.remove();

const patternFactor = /^[0-9]*[.,]?[0-9]+$/;
const patternHour = /^\d+$/;

let lastSprint = Number(sprintSel.getAttribute('currentSprints'));

editFactor();
editHours(lastSprint, 1);
initSprints();


function initSprints() {
  let currentSprints = sprintSel.getAttribute('currentSprints');
  sprintSel.value = currentSprints;
  getWorkHours(sprintSel.value, 1, 0);
  getSum();
}

sprintSel.addEventListener('change', () => {
  selTd.appendChild(load);
  let sprints = sprintSel.value;
  let id = sprintSel.getAttribute('asp-route-id');
  changeSprints(sprints, id, lastSprint);
  lastSprint = Number(sprintSel.value);
})
function changeSprints(currentSprints, id, last) {
  currentSprints = Number(currentSprints);
  fetch('/Team/ChangeSprints/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: currentSprints
  }).then(response => response.text())
    .then(answer => {
      sprintSel.value = answer;
      if (last < currentSprints) {
        for(let i = last + 1 ; i < currentSprints + 1; i++) {
          addSprint(i);
          console.log('Добавлен ' + i + ' спринт!');
        }
      } else {
        for(let i = last; i > currentSprints ;i--) {
          delSprint(i);
          console.log('Удален ' + i + ' спринт!')
        }
      }
      editHours(currentSprints, last + 1);
      getSum();
      load.remove();
      selTd.appendChild(loadFinish);
      setTimeout(() => {
        loadFinish.remove();
      }, 200);
    }).catch(() => console.log('Ошибка!'));
}

function addSprint(sprintNumber) {
  addNewHeaders(sprintNumber); //Добавить нвоые заголовки спринтам
  addNewSprintHoursInDB(sprintNumber); //Добавить спринт в бд
  addNewHoursInTable(sprintNumber); //Добавить колонку: часы
  addNewWorkHoursInTable(sprintNumber); //Добавить колонку: рабочие часы
  //Повесить на input'ы обработчики событий
}
function delSprint(sprintNumber) {
  delSprintFromTable(sprintNumber); //Удалить колоки спринта
  delSprintFromDB(sprintNumber); //Удалить спринт из бд
}

function addNewHeaders(sprintNumber) {
  //Заголовок спринта
  let tempNode = sprintsHeader.cloneNode();
  changeClassColumn(tempNode, sprintNumber);
  tempNode.setAttribute('id', 'sprints-' + sprintNumber);
  document.querySelector('#emptyAboveSum').before(tempNode);
  tempNode.innerHTML = 'Спринт ' + sprintNumber;

  //Заголовок часов
  tempNode = hoursHeader.cloneNode();
  changeClassColumn(tempNode, sprintNumber);
  document.querySelector('.cell_sum').before(tempNode);
  tempNode.innerHTML = 'Часы';

  //Заголовок рабочих часов
  tempNode = workHoursHeader.cloneNode(true);
  changeClassColumn(tempNode, sprintNumber);
  document.querySelector('.cell_sum').before(tempNode);
  tempNode.innerHTML = 'Рабочие часы';
}
function addNewSprintHoursInDB(sprintNumber) {
  /*Создать спринты часов для сотрудников*/
  for(let i = 0; i < coefficients.length; i++) {
    let person = coefficients[i];
    let id = person.getAttribute('asp-route-id');
    fetch('/Person/AddSprintHours/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: sprintNumber
    }).then(response => response.text())
      .catch(() => console.log('Ошибка!'));
  }
}
function addNewHoursInTable(sprintNumber) {
  for(let i = 0; i < coefficients.length; i++) {
    let temp = hoursCell.cloneNode(true);
    let tempInput = temp.firstChild;
    changeClassColumn(temp, sprintNumber);

    temp.setAttribute('id', 'Hours_td-' + sprintNumber + '-' + i);
    tempInput.setAttribute('id', 'Hours-' + sprintNumber + '-' + i);
    tempInput.setAttribute('asp-route-id', coefficients[i].getAttribute('asp-route-id'));
    tempInput.setAttribute('placeholder', '0');
    tempInput.value = 0;
    document.querySelector('#sumHours-' + i).before(temp);
  }
}
function addNewWorkHoursInTable(sprintNumber) {
  for(let i = 0; i < coefficients.length; i++) {
    let temp = workHoursCell.cloneNode();
    changeClassColumn(temp, sprintNumber);
    temp.setAttribute('id', 'WorkHours-' + sprintNumber + '-' + i);
    document.querySelector('#sumHours-' + i).before(temp);
    temp.innerHTML = 0;
    console.log(temp);
  }
}
function delSprintFromTable(sprintNumber) {
  let delColumn = document.querySelectorAll('.column-'+ sprintNumber);
  for(let i = 0; i < delColumn.length; i++) {
    delColumn[i].remove();
  }
}
function delSprintFromDB(sprintNumber) {
  /*Удалить спирнты сотрудников из бд*/
  for(let i = 0; i < coefficients.length; i++) {
    let person = coefficients[i];
    let id = person.getAttribute('asp-route-id')
    fetch('/Person/DelSprintHours/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: sprintNumber
    }).then(response => response.text())
      .catch(() => console.log('Ошибка!'));
  }
}

function editFactor() {
  for(let person = 0; person < coefficients.length; person++) {
    /*Расчитать рабочие часы*/
    coefficients[person].addEventListener('change', () => {
      let inputFactor = coefficients[person];
      inputFactor.addEventListener('click', () => {
        inputFactor.classList.remove('unvalid');
      })
      let factor = inputFactor.value;
      factor = getDesiredFormat(factor);
      if (patternFactor.test(factor)) { //Если валидно то отправить
        inputFactor.remove();
        document.querySelector('#factor-' + person).appendChild(load);
        let id = inputFactor.getAttribute('asp-route-id');
        fetch('/Person/EditFactor/' + id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: factor
        }).then(response => response.text())
          .then(answer => {
            loading(person, inputFactor, answer, '#factor');
            inputFactor.classList.remove('unvalid');
            getWorkHours(sprintSel.value, 1, person);
            getSumWorkHours(person);
            /*Расчитать сумму рабочих часов*/
          }).catch(() => console.log('Ошибка!'));
      } else {
        inputFactor.classList.add('unvalid');
      }
    })
  }
}
function editHours(sprints, defaultSprint) {
  for(let sprint = defaultSprint; sprint <= sprints; sprint++) {
    for(let person = 0; person < coefficients.length; person++) {
      let hourInput = document.querySelector('#Hours-' + sprint + '-' + person)
      hourInput.addEventListener('click', () => {
        hourInput.classList.remove('unvalid');
      })
      let id = hourInput.getAttribute('asp-route-id');
      hourInput.addEventListener('change', () => {
        let data  = {
          Hours: Number(hourInput.value),
          Sprint: sprint
        }
        data = JSON.stringify(data);
        if (patternHour.test(hourInput.value)) {
          hourInput.remove();
          document.querySelector('#Hours_td-' + sprint + '-' + person).appendChild(load);
          fetch('/Person/EditHour/' + id, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
          }).then(response => response.text())
            .then(answer => {
              loading(person, hourInput, answer, '#Hours_td-' + sprint);
              hourInput.classList.remove('unvalid');
              getWorkHours(sprint, sprint, person);
              getSumFromPerson(person);
            }).catch(() => console.log('Ошибка!'));
        } else {
          hourInput.classList.add('unvalid');
        }
      })
    }
  }
}

function loading(i, input, data, id) {
  load.remove();
  document.querySelector(id + '-' + i).appendChild(loadFinish);
  loadFinish.remove();
  document.querySelector(id + '-' + i).appendChild(input);
  input.value = data;
}
function getDesiredFormat(data) {
  let desiredFormat = data.replace(',', '.');
  if (/^\d+\.$/.test(desiredFormat)) {
    desiredFormat = desiredFormat.replace('.', '');
  }
  return desiredFormat;
}
function changeClassColumn(node, id) {
  node.classList.remove('column-1');
  node.classList.add('column-' + id);
}

function getWorkHours(sprints, defaultSprint, defaultPerson) {
  for(let sprint = defaultSprint; sprint <= sprints; sprint++) {
    for(let person = defaultPerson; person < coefficients.length; person++) {
      printWorkHours(sprint, person);
    }
  }
}
function printWorkHours(sprint, person) {
  let factorTd = document.querySelector('#factor-' + person);
  let factor = factorTd.firstChild;
  factor = factor.value;
  let hours = document.querySelector('#Hours-' + sprint + '-' + person).value;
  let id = '#WorkHours-' + sprint + '-' + person;
  workHours(factor, hours, id);
}
function workHours(factor, hours, id) {
  const correctionFactor = 10;
  let workHours = (factor * correctionFactor) * (hours * correctionFactor) / (correctionFactor * correctionFactor);
  document.querySelector(id).innerHTML = workHours;
}

function getSum() {
  for(let person = 0; person < coefficients.length; person++) {
    getSumFromPerson(person);
  }
}
function getSumFromPerson(person) {
  let sumHours = sum(person, '#Hours-');
  let sumWorkHours = sum(person, '#WorkHours-');
  document.querySelector('#sumHours-' + person).innerHTML = sumHours.toString();
  document.querySelector('#sumWorkHours-' + person).innerHTML = sumWorkHours.toString();
}
function getSumWorkHours(person) {
  let sumWorkHours = sum(person, '#WorkHours-');
  document.querySelector('#sumWorkHours-' + person).innerHTML = sumWorkHours.toString();
}
function sum(person, id) {
  const correctionFactor = 10;
  let sum = 0;
  for(let sprint = 1; sprint <= sprintSel.value; sprint++) {
    if (id === '#Hours-') {
      sum = (sum * correctionFactor + Number(document.querySelector(id + sprint + '-' + person).value) * correctionFactor) / correctionFactor;
    } else {
      sum = (sum * correctionFactor + Number(document.querySelector(id + sprint + '-' + person).innerHTML) * correctionFactor) / correctionFactor;
    }
  }
  return sum;
}