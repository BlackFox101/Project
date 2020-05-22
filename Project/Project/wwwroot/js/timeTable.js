let date = new Date(); // Текущая дата
let persons = document.getElementById('persons'); //Количество сотрудников
console.log(persons);
let firstPersonInDuty = Number(persons.getAttribute('FirstPersonInDuty'));
persons = Number(persons.getAttribute('persons'));
//console.log(firstPersonInDuty);
//console.log(persons);
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
let currentMonth;
let currentYear;
initDate();
function initDate(month, year) {
  //---------------------------------------------
  if (month) {
    currentMonth = Number(month);
    console.log('month='+month);
  } else {
    currentMonth = date.getMonth();
    document.getElementById('monthSel').value = currentMonth;
  }
  if (year) {
    currentYear = Number(year);
    console.log('year='+year);
  } else {
    currentYear = date.getFullYear();
  }
  //---------------------------------------------
  if (previousMonth) {
    clearTable(getDaysInMonth(previousYear, previousMonth));
  }
  previousMonth = monthSel.value;
  previousYear = yearSel.value;
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
  if (persons != 0) {
    puttingVacation();
    puttingDuties();
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

function puttingVacation() {
  let vacations = document.querySelector('#vacations');
  for(let i = 1; i < persons + 1; i++) {
    let str = document.querySelector('#str-'+i);
    let vacPerson = vacations.querySelector('#person-'+i);
    let vac = vacPerson.querySelectorAll('.vacs-' + i);
    for(let j = 0; j < vac.length; j++) {
      let startDate = vac[j].getAttribute('startdate');
      let endDate = vac[j].getAttribute('enddate');
      startDate = new Date(startDate.replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1'));
      endDate = new Date(endDate.replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1'));
      let startDay = startDate.getDate();
      let endDay = endDate.getDate();
      if (currentMonth == startDate.getMonth()) {
        if (currentMonth == endDate.getMonth()) {
          for (let k = startDay; k < endDay + 1; k++) {
            let dayVac = str.querySelector('.col' + k);
            dayVac.classList.add('vac');
          }
        } else {
          for (let k = startDay; k < getDaysInMonth(currentYear, currentMonth) + 1; k++) {
            let dayVac = str.querySelector('.col' + k);
            dayVac.classList.add('vac');
          }
        }
      } else if(currentMonth > startDate.getMonth() && currentMonth == endDate.getMonth()) {
        for (let k = 1; k < endDay + 1; k++) {
          let dayVac = str.querySelector('.col' + k);
          dayVac.classList.add('vac');
        }
      }
    }
  }
}

function puttingDuties() {
  let date = document.querySelector('#dutyStartDate');
  const dutyStartDate = new Date(date.getAttribute('date').replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1'));
  let dateEnd = new Date(document.querySelector('#yearSel').value, 11, 31);
  dateEnd.setDate(dateEnd.getDate() + 1);
  let dutyDays = 0; //Считает сколько дней с даты начала дежурств до 31 декабря выбранного года
  let dutyDuration = Number(document.getElementById('duties').innerHTML); // Длительность дежуств
  let temp = true;
  let vacation =  false;
  console.log(firstPersonInDuty + ' дежурит первый');
  console.log(dutyStartDate + ' - дата начала дежурств');
  for(let i = dutyStartDate; i < dateEnd; ) {
    let tempIndex = getFormatDate(i);
    let tempDate = getFormatDate(new Date(date.getAttribute('date').replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1')));
    let vacations = document.querySelector('#vacations');
    for(let j = 1; (j < persons + 1 && i < dateEnd); ) {
      if (tempIndex == tempDate && temp) { //Если первый день дежурств то присваивам первого человека
        j = firstPersonInDuty;
        temp = false;
      }
      let vacPerson = vacations.querySelector('#person-'+j);
      let vac = vacPerson.querySelectorAll('.vacs-' + j);
      let str = document.querySelector('#str-'+j);
      vacation = false;
      for (let l = 1; (l < dutyDuration + 1 && i < dateEnd);) {
        vacation = false;
        for(let k = 0; k < vac.length; k++) {
          let startDate = vac[k].getAttribute('startdate');
          startDate = new Date(startDate.replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1'));
          let endDate = vac[k].getAttribute('enddate');
          endDate = new Date(endDate.replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1'));
          let tempDateIndex = i;
          if (tempDateIndex >= startDate && tempDateIndex <= endDate) {
            vacation = true;
          }
        }
        if (i.getDay() == 6 || i.getDay() == 0) {
          i.setDate(i.getDate() + 1);
          dutyDays++;
          console.log('выходной');
        } else if (vacation) {
          console.log('у чувака', j,'отпуск');
          vacation = false;
          break;
        } else {
          if (i.getMonth() == currentMonth) {
            let dayDej = str.querySelector('.col' + i.getDate());
            dayDej.classList.add('dej');
          }
          console.log('Дежурит: ', j);
          l++
          i.setDate(i.getDate() + 1);
          dutyDays++;
        }
        console.log('дата: ' + i);
      }
      j++;
    }
  }
  console.log(persons + ' сотрудника');
  console.log(dutyDays + ' рабочих дня');
  console.log(firstPersonInDuty + ' дежурит первый');
  console.log(dutyStartDate + ' - дата начала дежурств');
  console.log(dutyDuration + ' дней дежурят')
}

/*if (i.getMonth() == currentMonth) {
  let dayDej = str.querySelector('.col' + i.getDate());
  dayDej.classList.add('dej');
}*/

//Возвращает дату в строку форматом 'dd.mm.yyyy'
function getFormatDate(date) {
  let dd = date.getDate();
  if (dd < 10) dd = '0' + dd;

  let mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  let yy = date.getFullYear() % 100;
  if (yy < 10) yy = '0' + yy;

  return dd + '.' + mm + '.' + yy;
}

//dutiesDate()
function dutiesDate() {
  let uno = new Date(2017, 1, 28);
  let dos = new Date(2016, 1, 28);
  let tres = new Date(2018, 1, 28);
  console.log(uno);
  if( tres > uno && uno > dos) {
    console.log('работает')
  }
}

/*let dutyDuration = Number(document.getElementById('duties').innerHTML); // Длительность дежуств
let day = 1;
while(day < getDaysInMonth(currentYear, currentMonth)+1) {
  for(let i = 1; (i < persons + 1 && day < getDaysInMonth(currentYear, currentMonth)+1); ) {
    let str = document.querySelector('#str-' + i);
    for (let j = 1; (j < dutyDuration + 1 && day < getDaysInMonth(currentYear, currentMonth)+1);) {
      let dayDej = str.querySelector('.col' + day);
      if (!(dayDej.classList.contains('hol') || dayDej.classList.contains('vac'))) {
        dayDej.classList.add('dej');
        j++;
      } else if (dayDej.classList.contains('vac')) {
        j++;
      }
      day++;
      if (dayDej.classList.contains('vac')) {
        day--;
      }
    }
    i++;
  }
}*/
