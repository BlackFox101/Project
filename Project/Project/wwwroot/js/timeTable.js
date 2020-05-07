/*let persons = document.querySelectorAll('.persons_Team');
console.log(persons);
console.log('Кол-во человек ' + persons.length);*/
let date = new Date();

initYear();
function initYear() {
  let currentYear = date.getFullYear();
  for(let i = currentYear; i < currentYear + 3; i++) {
    let newOption = new Option(`${i}`,`${i}`);
    document.querySelector('#yearSel').appendChild(newOption);
  }
}
let yearSel = document.querySelector('#yearSel');
let monthSel = document.querySelector('#monthSel');

yearSel.addEventListener('change', () => {
  console.log('year='+document.querySelector('#yearSel').value)
});
monthSel.addEventListener('change', () => {
  console.log('month='+document.querySelector('#monthSel').value)
});

// Процедура определяющая количество дней в месяце
function daysInMonth(year, month) {
  return 32 - new Date(year, month, 32).getDate();
}
// Процедура определяющая день в месяце
// 1-понедельник 0- воскресенье
function firstDayInMonth(year, month, day) {
  return new Date(year, month, day).getDay();
}

intiDate();
function intiDate() {
  let daysTr = document.querySelector('#days') //Строка с днями месяца
  let wdTr = document.querySelector('#wd')     //Строка с днями недели
  let currentMonth = date.getMonth();
  let currentYear = date.getFullYear();
  //Устанавливается текущий месяц
  document.getElementById('monthSel').value = currentMonth;
  //let month = currentDate.getMonth() //месяц от 0 до 11, 0 - январь
  for(let i = 1; i < daysInMonth(currentYear, currentMonth)+1; i++) {
    let day = document.createElement('td');
    let wd = document.createElement('td');
    let hol = firstDayInMonth(currentYear, currentMonth, i);
    day.innerHTML = i;
    wd.innerHTML = generalDay(hol);
    day.classList.add(i);
    wd.classList.add(i);
    if (hol == 6 || hol == 0) {
      day.classList.add('hol');
      wd.classList.add('hol');
    }
    daysTr.appendChild(day);
    wdTr.appendChild(wd);
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
/*
let selectMonth = document.querySelector('#monthSel').value//Выбранный месяц
let selectYear = document.querySelector('#yearSel').value//Выбранный год
let currentMonth = date.getMonth(); //Текущий месяц
*/
