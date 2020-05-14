let date = new Date(); // Текущая дата
const persons = document.getElementById('persons').innerHTML; //Количество сотрудников
//let duties = document.getElementById('duties').innerHTML; // Дежуства

initYear();//Добавляет текущий год и 2 следующих
function initYear() {
  let currentYear = date.getFullYear();
  for(let i = currentYear; i < currentYear + 3; i++) {
    let newOption = new Option(`${i}`,`${i}`);
    document.querySelector('#yearSel').appendChild(newOption);
  }
}

//Обработчики событий на смену года и месяца---------------------------------
let yearSel = document.querySelector('#yearSel');
let monthSel = document.querySelector('#monthSel');
yearSel.addEventListener('change', () => {
  initDate(monthSel.value, document.querySelector('#yearSel').value);
});
monthSel.addEventListener('change', () => {
  initDate(document.querySelector('#monthSel').value, yearSel.value);
});
//-----------------------------------------------------------------------------;

let previousMonth;
let previousYear;
initDate();
function initDate(month, year) {
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
    clearTable(getDaysInMonth(previousYear, previousMonth));
  }
  previousMonth = currentMonth;
  previousYear = currentYear;
  let daysTrElement = document.querySelector('#days') //Строка с днями месяца
  let wdTrElement = document.querySelector('#wd')     //Строка с днями недели
  for(let i = 1; i < getDaysInMonth(currentYear, currentMonth)+1; i++) {
    let day = document.createElement('td');
    let wedDay = document.createElement('td');
    let isHol = getFirstDayInMonth(currentYear, currentMonth, i);
    day.innerHTML = i;
    wedDay.innerHTML = generalDay(isHol);
    day.classList.add('col'+i);
    wedDay.classList.add('col'+i);
    if (isHol == 6 || isHol == 0) {
      day.classList.add('hol');
      wedDay.classList.add('hol');
    }
    daysTrElement.appendChild(day);
    wdTrElement.appendChild(wedDay);
  }

  initTable();
  function initTable() {
    for(let i = 0; i < persons; i++) {
      let daysTrElement = document.getElementById('str-'+(i+1));
      for(let j = 1; j < getDaysInMonth(currentYear, currentMonth)+1; j++) {
        let day = document.createElement('td');
        let isHol = getFirstDayInMonth(currentYear, currentMonth, j);
        day.innerHTML = '';
        day.classList.add('col'+j);
        if (isHol == 6 || isHol == 0) {
          day.classList.add('hol');
        }
        daysTrElement.appendChild(day);
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

// Процедура определяющая количество дней в месяце
function getDaysInMonth(year, month) {
  return 32 - new Date(year, month, 32).getDate();
}
// Процедура определяющая день в месяце
// 6-суббота 0- воскресенье
function getFirstDayInMonth(year, month, day) {
  return new Date(year, month, day).getDay();
}
