let coefficients = document.querySelectorAll('.factor');
let workHours = document.querySelectorAll('.work_hours');

let load = document.querySelector('#load');
let loadFinish = document.querySelector('#loadFinish');
load.classList.remove("hidden");
loadFinish.classList.remove("hidden");
load.remove();
loadFinish.remove();

const patternFactor = /^[0-9]*[.,]?[0-9]+$/;
const patternHour = /^[0-9]*[.,]?[0-9]+$/;

for(let i = 0; i < coefficients.length; i++) {
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
        }).catch(() => console.log('ошибка'));
    } else {
      person.classList.add('unvalid');
    }
  })
}

for(let i = 0; i < workHours.length; i++) {
  workHours[i].addEventListener('change', () =>{
    let person = workHours[i];
    person.addEventListener('click', () => {
      person.classList.remove('unvalid');
    })
    let hours = person.value;
    hours = getDesiredFormat(hours);
    if (patternHour.test(hours)) { //Если валидно то отправить
      person.remove();
      document.querySelector('#hour-' + i).appendChild(load);
      let id = person.getAttribute('asp-route-id')
      fetch('/Person/EditWorkHours/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: hours
      }).then(response => response.text())
        .then(data => {
          loading(i, person, data, '#hour');
          person.classList.remove('unvalid');
        }).catch(() => console.log('ошибка'));
    } else {
      person.classList.add('unvalid');
    }
  })
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