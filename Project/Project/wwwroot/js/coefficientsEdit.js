let coefficients = document.querySelectorAll('.edit');

for(let i = 0; i < coefficients.length; i++) {
  coefficients[i].addEventListener('change', () =>{
    let person = coefficients[i];
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
        person.value = data;
      }).catch(() => console.log('ошибка'));
  })
}
