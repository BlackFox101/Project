let dels = document.querySelectorAll('.del_vacation');
// на каждый элемент повесить обработчик
let tbody = document.querySelector('#team_det')
for(let i = 0; i < dels.length; i++) {
  dels[i].addEventListener('click', () =>{
    let person = dels[i];
    let idStr = person.getAttribute('id');
    let idVacation = person.getAttribute('asp-route-id')
    fetch('/Person/DelVacation/' + idVacation, {
      method: 'PUT'
    }).then(response => response.text())
      .then(data => {
        console.log(JSON.parse(data));
        let tr = document.querySelector('#vac-' + idStr);
        tr.remove();
        dels = document.querySelectorAll('.del_vacation');
        console.log(dels);
        if(dels.length == 0) {
          let trEmpty = document.createElement("tr");
          let tdEmpty = document.createElement("td");
          tbody.appendChild(trEmpty);
          trEmpty.appendChild(tdEmpty);
          tdEmpty.innerHTML = 'Отсутствуют';
          tdEmpty.setAttribute('colspan', 5);
        }
      }).catch(() => console.log('ошибка'));
  })
}
