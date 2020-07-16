let coefficients = document.querySelectorAll('.factor');
let workHours = document.querySelectorAll('.work_hours');

let load = document.querySelector('#load');
let loadFinish = document.querySelector('#loadFinish');
load.classList.remove("hidden");
loadFinish.classList.remove("hidden");
load.remove();
loadFinish.remove();

for(let i = 0; i < coefficients.length; i++) {
  coefficients[i].addEventListener('change', () =>{
    let person = coefficients[i];
    person.remove();
    document.querySelector('#factor-' + i).appendChild(load);
    let factor = person.value.replace(',', '.');
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
      }).catch(() => console.log('ошибка'));
  })
}

for(let i = 0; i < workHours.length; i++) {
  workHours[i].addEventListener('change', () =>{
    let person = workHours[i];
    person.remove();
    document.querySelector('#hour-' + i).appendChild(load);
    let hours = person.value;
    let id = person.getAttribute('asp-route-id')
    fetch('/Person/EditWorkHours/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: hours
    }).then(response => response.text())
      .then(data => {
        loading(i, person, data, '#hour')
      }).catch(() => console.log('ошибка'));
  })
}
//<img id="loadAnswer" src="~/images/loading.gif" class="icon_width"/>
//<img id="loadFinish" src="~/images/load_finish.png" class="icon_width"/>

function loading(i, person, data, id) {
  load.remove();
  document.querySelector(id + '-' + i).appendChild(loadFinish);
  loadFinish.remove();
  document.querySelector(id + '-' + i).appendChild(person);
  person.value = data;
}