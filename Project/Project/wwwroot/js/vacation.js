let vacations = document.querySelectorAll('.vacations');
let tbody = document.querySelector('#team_det');

let vacDt = document.querySelector('#vacDt');
let load = document.querySelector('#load');
let loadFinish = document.querySelector('#loadFinish');
load.classList.remove('hidden');
loadFinish.classList.remove('hidden');
load.remove();
loadFinish.remove();

editVacation()
function editVacation() {
  for (let vacation = 0; vacation < vacations.length; vacation++) {
    let vac = vacations[vacation];
    vac.addEventListener('change', () => {
      vacDt.appendChild(load);
      let reason = document.querySelector('#reason-' + (vacation+1)).value;
      let startDate = document.querySelector('#startDate-' + (vacation+1)).value;
      let endDate = document.querySelector('#endDate-' + (vacation+1)).value;
      let idVacation = vac.getAttribute('asp-route-id');
      let data = {
        Reason: reason,
        StartDate: startDate,
        EndDate: endDate
      }
      data = JSON.stringify(data);
      fetch('/Person/EditVacation/' + idVacation, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
      }).then(response => response.text())
        .then(answer => {
          load.remove();
          vacDt.appendChild(loadFinish);
          setTimeout(() => {
            loadFinish.remove();
          }, 200);
        }).catch(() => console.log('ошибка'));
    })
  }
}