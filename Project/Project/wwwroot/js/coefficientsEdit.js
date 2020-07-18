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
          // Расчитать сумму

        }).catch(() => console.log('Ошибка!'));
    } else {
      person.classList.add('unvalid');
    }
  })
}

editHours(hours1,1);
editHours(hours2,2);
editHours(hours3,3);

function editHours(hours, number) {
  let cellId = '#hour' + number
  for(let i = 0; i < hours.length; i++) {
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
        if (/^0/.test(hour)) {
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
            printWorkHours(coefficients[i].value, answer, '#workHours1-' + i);
            printWorkHours(coefficients[i].value, answer, '#workHours2-' + i);
            printWorkHours(coefficients[i].value, answer, '#workHours3-' + i);
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

//console.log(document.querySelector('#hour1-0').innerHTML)

//printSumHours(1)

function printSumHours(str) {
  let sumHours = 0;
  let id;
  for(let column = 1; column < 4; column++) {
    id = '#hour' + column + '-' + str;
    sumHours = sumHours + Number(document.querySelector(id).innerHTML);
  }
  id = '';
  document.querySelector(id).innerHTML = sumHours;
}

/*
function printSumWorkHours(str) {
  let sumWorkHours = 0;
  let id = '';
  for(let column = 0; column < 3; column++) {
    id = '#workHours' + column + '-' + str;
    sumWorkHours = sumWorkHours + Number(document.querySelector(id).innerHTML);
  }
  id = '';
  document.querySelector(id).innerHTML = sumWorkHours;
}*/
