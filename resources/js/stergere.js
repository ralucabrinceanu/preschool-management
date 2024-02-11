window.addEventListener('DOMContentLoaded', function () {
  let deleteBtns = document.querySelectorAll('.stergere')

  for (let btn of deleteBtns) {
    btn.addEventListener('click', function () {
      console.log('ai apasat pe delete')
      rand = this.parentElement.parentElement // tot randul unde se face click
      let id = Number(rand.getElementsByTagName('td')[0].innerHTML) // id
      let tabel = window.location.href.split('viz/')[1]
      // http://localhost:8080/viz/prescolari -> prescolari

      rand.remove()
      fetch(`http://localhost:8080/stergere/${tabel}/${id}`, { method: 'POST' })
    })
  }
})
