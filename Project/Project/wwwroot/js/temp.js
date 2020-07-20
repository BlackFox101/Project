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

/*function editFactor() {
  for(let i = 0; i < coefficients.length; i++) {
    // ????????? ??????? ????
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
      if (patternFactor.test(factor)) { //???? ??????? ?? ?????????
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
            // ????????? ??????? ????
            printWorkHours(answer, hours1[i].value, '#workHours1-' + i);
            printWorkHours(answer, hours2[i].value, '#workHours2-' + i);
            printWorkHours(answer, hours3[i].value, '#workHours3-' + i);
            // ????????? ????? ??????? ?????
            printSumHours('workHours', i);
          }).catch(() => console.log('??????!'));
      } else {
        person.classList.add('unvalid');
      }
    })
  }
}*/

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
      if (patternHour.test(hour)) { //???? ??????? ?? ?????????
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
            // ????????? ????? ?????
            printSumHours('hours', i);
            // ????????? ????? ??????? ?????
            printSumHours('workHours', i);
          }).catch(() => console.log('??????!'));
      } else {
        person.classList.add('unvalid');
      }
    })
  }
}

/*function loading(i, person, data, id) {
  load.remove();
  document.querySelector(id + '-' + i).appendChild(loadFinish);
  loadFinish.remove();
  document.querySelector(id + '-' + i).appendChild(person);
  person.value = data;
}*/

/*function getDesiredFormat(data) {
  let desiredFormat = data.replace(',', '.');
  desiredFormat = desiredFormat.replace(/[^\d\.]/g, '');
  return desiredFormat;
}*/

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


/*
<td id="hour1-@k" class="center cell_hour"><input id="hours1-@k" colId="1" pattern="^[0-9]+$" asp-route-id="@person.Id" placeholder="@person.Hours1" value="@person.Hours1" class="edit hours1 center" /></td>
<td id="workHours1-@k" class="center cell_work_hour"></td>

<td id="hour2-@k" class="center cell_hour"><input id="hours2-@k" colId="2" pattern="^[0-9]+$" asp-route-id="@person.Id" placeholder="@person.Hours2" value="@person.Hours2" class="edit hours2 center" /></td>
<td id="workHours2-@k" class="center cell_work_hour"></td>

<td id="hour3-@k" class="center cell_hour"><input id="hours3-@k" colId="3" pattern="^[0-9]+$" asp-route-id="@person.Id" placeholder="@person.Hours3" value="@person.Hours3" class="edit hours3 center" /></td>
<td id="workHours3-@k" class="center cell_work_hour"></td>*/

/*<th class="th_item center cell_hour">????</th>
  <th class="th_item center cell_work_hour">??????? ????</th>
<th class="th_item center cell_hour">????</th>
  <th class="th_item center cell_work_hour">??????? ????</th>
<th class="th_item center cell_hour">????</th>
  <th class="th_item center cell_work_hour">??????? ????</th>

<th class="th_item center cell_sum">????? ?????</th>
<th class="th_item center cell_sum">????? ??????? ?????</th>*/
