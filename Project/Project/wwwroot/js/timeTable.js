let date = new Date(); // Текущая дата
let persons = document.getElementById('persons'); //Количество сотрудников

initYear();//Добавляет текущий год и 2 следующих
function initYear() {
  let currentYear = date.getFullYear();
  for(let i = currentYear; i < currentYear + 3; i++) {
    let newOption = new Option(`${i}`,`${i}`);
    document.querySelector('#yearSel').appendChild(newOption);
  }
}

// Процедура определяющая количество дней в месяце
function daysInMonth(year, month) {
  return 32 - new Date(year, month, 32).getDate();
}
// Процедура определяющая день в месяце
// 6-суббота 0- воскресенье
function firstDayInMonth(year, month, day) {
  return new Date(year, month, day).getDay();
}

//Обработчики событий на смену года и месяца---------------------------------
let yearSel = document.querySelector('#yearSel');
let monthSel = document.querySelector('#monthSel');
yearSel.addEventListener('change', () => {
  intiDate(monthSel.value, document.querySelector('#yearSel').value);
});
monthSel.addEventListener('change', () => {
  intiDate(document.querySelector('#monthSel').value, yearSel.value);
});
//-----------------------------------------------------------------------------;

let previousMonth;
let previousYear;
intiDate();
function intiDate(month, year) {
  let currentMonth;
  let currentYear;
  //---------------------------------------------
  if (month) {
    currentMonth = month;
    console.log('month='+month);
  } else {
    currentMonth = date.getMonth();
    document.getElementById('monthSel').value = currentMonth;
  }
  if (year) {
    currentYear = year;
    console.log('year='+year);
  } else {
    currentYear = date.getFullYear();
  }
  //---------------------------------------------
  if (previousMonth) {
    clearTable(daysInMonth(previousYear, previousMonth));
  }
  previousMonth = currentMonth;
  previousYear = currentYear;
  let daysTr = document.querySelector('#days') //Строка с днями месяца
  let wdTr = document.querySelector('#wd')     //Строка с днями недели
  for(let i = 1; i < daysInMonth(currentYear, currentMonth)+1; i++) {
    let day = document.createElement('td');
    let wd = document.createElement('td');
    let hol = firstDayInMonth(currentYear, currentMonth, i);
    day.innerHTML = i;
    wd.innerHTML = generalDay(hol);
    day.classList.add('col'+i);
    wd.classList.add('col'+i);
    if (hol == 6 || hol == 0) {
      day.classList.add('hol');
      wd.classList.add('hol');
    }
    daysTr.appendChild(day);
    wdTr.appendChild(wd);
  }

  initTable();
  function initTable() {
    for(let i = 0; i < persons.innerHTML; i++) {
      let daysTr = document.getElementById('str-'+(i+1));
      for(let j = 1; j < daysInMonth(currentYear, currentMonth)+1; j++) {
        let day = document.createElement('td');
        let hol = firstDayInMonth(currentYear, currentMonth, j);
        day.innerHTML = '';
        day.classList.add('col'+j);
        if (hol == 6 || hol == 0) {
          day.classList.add('hol');
        }
        daysTr.appendChild(day);
      }
    }
  }
}

function generalDay(hol) {
  switch (hol) {
    case 0:
      return 'вс'; break;
    case 1:
      return 'пн'; break;
    case 2:
      return 'вт'; break;
    case 3:
      return 'ср'; break;
    case 4:
      return 'чт'; break;
    case 5:
      return 'пт'; break;
    case 6:
      return 'сб'; break;
  }
}

function clearTable(monthLength) {
  let col = document.querySelector('.col1');
  if (col) {
    let cols = document.querySelectorAll('.col1');
    for(let i = 1; i < cols.length + 1; i++) {
      for(let j = 1; j < monthLength +1; j++){
        let td = document.querySelector(`.col${j}`);
        td.remove();
      }
    }
  }
}

/*
let selectMonth = document.querySelector('#monthSel').value//Выбранный месяц
let selectYear = document.querySelector('#yearSel').value//Выбранный год
let currentMonth = date.getMonth(); //Текущий месяц
*/
