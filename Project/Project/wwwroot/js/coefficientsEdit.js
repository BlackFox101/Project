let coefficients = document.querySelectorAll('.factor');
let sprintSel = document.querySelector('#sprintSel');

let sprintsHeader = document.querySelector('#sprints-1'); //Заголовок для спринтов
let hoursHeader = document.querySelector('.cell_hour'); //Заголовок для часов
let workHoursHeader = document.querySelector('.cell_work_hour'); //Заголовок для рабочих часов
console.log(sprintsHeader);
console.log(hoursHeader);
console.log(workHoursHeader);

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

let previousSprints = sprintSel.getAttribute('currentSprints');
function initSprints() {
  let currentSprints = sprintSel.getAttribute('currentSprints');
  sprintSel.value = currentSprints;
}

sprintSel.addEventListener('change', () => {
  let sprints = sprintSel.value;
  let id = sprintSel.getAttribute('asp-route-id');
  changeSprints(sprints, id, previousSprints);
})

function changeSprints(currentSprints, id, previous) {
  fetch('/Team/СhangeSprints/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: currentSprints
  }).then(response => response.text())
    .then(answer => {
      sprintSel.value = answer;
    }).catch(() => console.log('Ошибка!'));
  if (previous < currentSprints) {
    console.log('Новый больше');
    //getNewSprint();
  } else {
    console.log('Новый меньше');
    //delSprints();
  }
}

function getNewSprint() {
  /*Создать новые часы по спринтам для сотрудников*/
  //addNewColumns();
  /*Добавить колонки спринтов в таблицу*/
  /*Добавить данные в колонки*/
  // Повесить на input'ы обработчики событий
}

//addNewColumns();
function addNewColumns() {
  //Заголовок спринта
  let temp = sprintsHeader.cloneNode();
  let tempId = Number(sprintSel.value) + 1;
  temp.classList.remove('column-1');
  temp.classList.add('column-' + tempId);
  temp.setAttribute('id', 'sprints-' + tempId);
  document.querySelector('#emptyAboveSum').before(temp);
  temp.innerHTML = 'Спринт ' + tempId;
  //Заголовок часов
  temp = hoursHeader.cloneNode();
  temp.classList.remove('column-1');
  temp.classList.add('column-' + tempId);
  document.querySelector('.cell_sum').before(temp);
  temp.innerHTML = 'Часы';
  //Заголовок рабочих часов
  temp = workHoursHeader.cloneNode();
  temp.classList.remove('column-1');
  temp.classList.add('column-' + tempId);
  document.querySelector('.cell_sum').before(temp);
  temp.innerHTML = 'Рабочие часы';

  /*Создать спринты часов для сотрудников*/
  /*for(let i = 0; i < coefficients.length; i++) {
    fetch('/Team/СhangeSprints/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: currentSprints
    }).then(response => response.text())
      .then(answer => {
        sprintSel.value = answer;
      }).catch(() => console.log('Ошибка!'));
  }*/
}
delSprints(1);
function delSprints(id) {
  /*Удалить часы по спринтам для сотрудников*/
  /*Удалить колонки по спринтам*/
  fetch('/Person/AddSprintHours/' + id, {
    method: 'POST',
  }).then(response => response.text())
    .then(answer => {
      console.log('Пришло:');
      console.log(answer);
    }).catch(() => console.log('Ошибка!'));
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
          method: 'PUT',
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