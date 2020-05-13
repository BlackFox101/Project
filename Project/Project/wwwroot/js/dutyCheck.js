let duties = document.querySelectorAll('.duty');
//let persons = document.getElementById('persons').innerHTML; //Количество сотрудников
// на каждый элемент повесить обработчик на стадии перехвата
let isDuty;
for(let i = 0; i < duties.length; i++) {
  duties[i].addEventListener('click', () =>{
    let person = duties[i];
    let id = person.getAttribute('asp-route-id')
    fetch('/Person/EditDuty/' + id, {
      method: 'PUT'
    }).then(response => response.text())
      .then(data => {
        isDuty = JSON.parse(data);
        if(isDuty == 1) {
          person.src = '/images/ok_check.png';
          person.alt = 'ok_check';
        } else {
          person.src = '/images/x_check.png';
          person.alt = 'x_check';
        }
      }).catch(() => console.log('ошибка'));
  })
}

dutiesDate()
function dutiesDate() {
  let uno = new Date(2017, 1, 28);
  let dos = new Date(2016, 1, 28);
  let tres = new Date(2018, 1, 28);
  console.log(uno);
  if( tres > uno && uno > dos) {
    console.log('работает')
  }
}
