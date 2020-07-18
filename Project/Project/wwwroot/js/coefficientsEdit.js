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
        .then(data => {
          loading(i, person, data, '#factor');
          person.classList.remove('unvalid');
          // Расчитать рабочие часы
        }).catch(() => console.log('ошибка'));
    } else {
      person.classList.add('unvalid');
    }
  })
}

editHours(hours1, '#hour1', 1);
editHours(hours2, '#hour2', 2);
editHours(hours3, '#hour3', 3);

function editHours(hours, cellId, number) {
  for(let i = 0; i < hours.length; i++) {
    hours[i].addEventListener('change', () =>{
      let person = hours[i];
      person.addEventListener('click', () => {
        person.classList.remove('unvalid');
      })
      let hour = person.value;
      hour = getDesiredFormat(hour);
      hour = Math.round(hour);
      if (patternHour.test(hour)) { //Если валидно то отправить
        if (/^0/.test(hour)) {
          hour = hour.replace('0', '');
        }
        person.remove();
        document.querySelector(cellId + '-' + i).appendChild(load);
        let id = person.getAttribute('asp-route-id')
        fetch('/Person/EditWorkHours'+ number + '/' + id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: hour
        }).then(response => response.text())
          .then(data => {
            loading(i, person, data, cellId);
            person.classList.remove('unvalid');
            // Расчитать рабочие часы
          }).catch(() => console.log('ошибка'));
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
  desiredFormat = desiredFormat.replace(/[^\d\.]/g, '')
  return desiredFormat;
}

function printWorkHours(factor, hours, id) {
  let workHours = factor * hours;
  document.querySelector(id).innerHTML = workHours;
}