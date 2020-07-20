let coefficients = document.querySelectorAll('.factor');
let sprintSel = document.querySelector('#sprintSel');

let sprintsHeader = document.querySelector('#sprints-1'); //Заголовок для спринтов
let hoursHeader = document.querySelector('.cell_hour'); //Заголовок для часов
let workHoursHeader = document.querySelector('.cell_work_hour'); //Заголовок для рабочих часов
let hoursCell = document.querySelector('#Hours_td-1-0'); //Ячейка часов
let workHoursCell = document.querySelector('#WorkHours-1-0'); //Ячейка рабочих часов

let load = document.querySelector('#load');
let loadFinish = document.querySelector('#loadFinish');
{
  load.classList.remove('hidden');
  loadFinish.classList.remove('hidden');
  load.remove();
  loadFinish.remove();
}

const patternFactor = /^[0-9]*[.,]?[0-9]+$/;
editFactor();
initSprints();

let lastSprint = Number(sprintSel.getAttribute('currentSprints'));

function initSprints() {
  let currentSprints = sprintSel.getAttribute('currentSprints');
  sprintSel.value = currentSprints;
}
sprintSel.addEventListener('change', () => {
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
  delSprintFromDB(sprintNumber);//Удалить спринт из бд
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
    let id = person.getAttribute('asp-route-id')
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
    tempInput.setAttribute('value', 0);
    document.querySelector('#sumHours-' + i).before(temp);
  }
}
function addNewWorkHoursInTable(sprintNumber) {
  for(let i = 0; i < coefficients.length; i++) {
    let temp = workHoursCell.cloneNode();
    changeClassColumn(temp, sprintNumber);
    temp.setAttribute('id', 'WorkHours-' + sprintNumber + '-' + i);
    document.querySelector('#sumHours-' + i).before(temp);
    //console.log(temp);
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

function changeClassColumn(node, id) {
  node.classList.remove('column-1');
  node.classList.add('column-' + id);
}

function editFactor() {
  for(let i = 0; i < coefficients.length; i++) {
    /*Расчитать рабочие часы*/
    coefficients[i].addEventListener('change', () => {
      let person = coefficients[i];
      person.addEventListener('click', () => {
        person.classList.remove('unvalid');
      })
      let factor = person.value;
      console.log(factor);
      factor = getDesiredFormat(factor);
      if (patternFactor.test(factor)) { //Если валидно то отправить
        person.remove();
        document.querySelector('#factor-' + i).appendChild(load);
        let id = person.getAttribute('asp-route-id')
        fetch('/Person/EditFactor/' + id, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: factor
        }).then(response => response.text())
          .then(answer => {
            loading(i, person, answer, '#factor');
            person.classList.remove('unvalid');
            /*Расчитать рабочие часы*/
            /*Расчитать сумму рабочих часов*/
          }).catch(() => console.log('Ошибка!'));
      } else {
        person.classList.add('unvalid');
      }
    })
  }
}
function loading(i, person, data, id) {
  load.remove();
  document.querySelector(id + '-' + i).appendChild(loadFinish);
  loadFinish.remove();
  document.querySelector(id + '-' + i).appendChild(person);
  person.value = data;
}
function getDesiredFormat(data) {
  let desiredFormat = data.replace(',', '.');
  if (/^\d+\.$/.test(desiredFormat)) {
    desiredFormat = desiredFormat.replace('.', '');
  }
  return desiredFormat;
}