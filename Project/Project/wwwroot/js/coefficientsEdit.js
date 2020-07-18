let coefficients = document.querySelectorAll('.factor');
let hours1 = document.querySelectorAll('.hours1');
let hours2 = document.querySelectorAll('.hours2');
let hours3 = document.querySelectorAll('.hours3');

let load = document.querySelector('#load');
let loadFinish = document.querySelector('#loadFinish');
load.classList.remove("hidden");
loadFinish.classList.remove("hidden");
load.remove();
loadFinish.remove();

const patternFactor = /^[0-9]*[.,]?[0-9]+$/;
const patternHour = /^\d+$/;

editFactor();

editHours(hours1,1);
editHours(hours2,2);
editHours(hours3,3);

for(let i = 0; i < coefficients.length; i++) {
  printSumHours('hours', i);
}

function editFactor() {
  for(let i = 0; i < coefficients.length; i++) {
    // Расчитать рабочие часы
    printWorkHours(coefficients[i].value, hours1[i].value, '#workHours1-' + i);
    printWorkHours(coefficients[i].value, hours2[i].value, '#workHours2-' + i)
    printWorkHours(coefficients[i].value, hours3[i].value, '#workHours3-' + i)
    coefficients[i].addEventListener('change', () => {
      let person = coefficients[i];
      person.addEventListener('click', () => {
        person.classList.remove('unvalid');
      })
      let factor = person.value;
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
            // Расчитать рабочие часы
            printWorkHours(answer, hours1[i].value, '#workHours1-' + i);
            printWorkHours(answer, hours2[i].value, '#workHours2-' + i);
            printWorkHours(answer, hours3[i].value, '#workHours3-' + i);
            // Расчитать сумму рабочих часов
            printSumHours('workHours', i);
          }).catch(() => console.log('Ошибка!'));
      } else {
        person.classList.add('unvalid');
      }
    })
  }
}

function editHours(hours, number) {
  let cellId = '#hour' + number;
  for(let i = 0; i < hours.length; i++) {
    printSumHours('workHours', i);
    hours[i].addEventListener('change', () =>{
      let person = hours[i];
      person.addEventListener('click', () => {
        person.classList.remove('unvalid');
      })
      let hour = person.value;
      if (hour == '') {
        hour = '0';
      }
      hour = getDesiredFormat(hour);
      hour = Math.round(hour);
      if (patternHour.test(hour)) { //Если валидно то отправить
        if (/^0\d/.test(hour)) {
          hour = hour.replace('0', '');
        }
        person.remove();
        document.querySelector(cellId + '-' + i).appendChild(load);
        let id = person.getAttribute('asp-route-id');
        let data = {
          Hours: hour,
          Number: number
        };
        data = JSON.stringify(data);
        fetch('/Person/EditWorkHours/' + id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(data)
        }).then(response => response.text())
          .then(answer => {
            loading(i, person, answer, cellId);
            person.classList.remove('unvalid');
            let colId = person.getAttribute('colId');
            printWorkHours(coefficients[i].value, answer, '#workHours' + colId + '-' + i);
            // Расчитать сумму часов
            printSumHours('hours', i);
            // Расчитать сумму рабочих часов
            printSumHours('workHours', i);
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
  desiredFormat = desiredFormat.replace(/[^\d\.]/g, '');
  return desiredFormat;
}

function printWorkHours(factor, hours, id) {
  const correctionFactor = 10;
  let workHours = (factor * correctionFactor) * (hours * correctionFactor) / (correctionFactor * correctionFactor);
  document.querySelector(id).innerHTML = workHours;
}

function printSumHours(colHour, str) {
  const correctionFactor = 10;
  let sumHours = 0;
  let id;
  for(let column = 1; column < 4; column++) {
    id = '#'+ colHour + column + '-' + str;
    if (colHour == 'hours') {
      sumHours = (sumHours * correctionFactor + Number(document.querySelector(id).value) * correctionFactor) / correctionFactor;
    } else {
      sumHours = (sumHours * correctionFactor + Number(document.querySelector(id).innerHTML) * correctionFactor) / correctionFactor;
    }
  }
  if (colHour == 'hours') {
    id = '#sumHours-' + str;
  } else {
    id = '#sumWorkHours-' + str;
  }
  document.querySelector(id).innerHTML = sumHours;
}