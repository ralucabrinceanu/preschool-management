window.addEventListener('DOMContentLoaded', function () {
  const editModalBtn = document.querySelectorAll('#openEditModal')
  const table = document.querySelector('tbody')

  // i-ul va fi indicele de linie (butonul)
  // j-ul va fi indicele de coloane (header)
  editModalBtn.forEach(function (btn, i) {
    btn.addEventListener('click', function () {
      const modal = btn.nextElementSibling
      console.log(modal)
      const form = modal.querySelector('form')
      console.log(form)

      const existingFields = form.querySelectorAll('.form-group')
      existingFields.forEach((field) => {
        field.remove()
      })

      const headers = Array.from(document.querySelectorAll('th'))
      const tableHeaders = headers.slice(0, -2) // remove 'editare' and 'stergere'

      tableHeaders.forEach((header, j) => {
        let input
        let label

        let formGroup = document.createElement('div')
        formGroup.classList.add('form-group')

        const row = table.querySelectorAll('tr')[i]
        const col = row.querySelectorAll('td')[j]
        const value = col.textContent

        switch (header.textContent.trim()) {
          case 'Data inventar':
          case 'Data inscriere':
          case 'Data livrare':
          case 'Data inceput':
          case 'Data sfarsit':
          case 'Data nastere': {
            label = document.createElement('label')
            label.textContent = header.textContent
            input = document.createElement('input')
            input.type = 'date'
            input.classList.add('form-control')
            input.name = header.textContent.toLowerCase().replace(/\s/g, '')
            break
          }

          case 'Email parinte':
          case 'Email': {
            label = document.createElement('label')
            label.textContent = header.textContent
            input = document.createElement('input')
            input.type = 'email'
            input.classList.add('form-control')
            input.name = header.textContent.toLowerCase().replace(/\s/g, '')
            break
          }

          case 'Telefon':
          case 'Telefon parinte': {
            label = document.createElement('label')
            label.textContent = header.textContent
            input = document.createElement('input')
            input.type = 'tel'
            input.classList.add('form-control')
            input.name = header.textContent.toLowerCase().replace(/\s/g, '')
            input.pattern = '0[0-9]{9}'
            break
          }

          case 'Id angajat':
          case 'Id echipament':
          case 'Id furnizor':
          case 'Id inscriere':
          case 'Id inventar':
          case 'Id livrare':
          case 'Id post':
          case 'Id prescolar':
          case 'Id repartizare':
          case 'Id sala':
          case 'Id serviciu': {
            label = document.createElement('label')
            label.textContent = header.textContent
            input = document.createElement('input')
            input.type = 'number'
            input.classList.add('form-control-plaintext')
            input.name = header.textContent.toLowerCase().replace(/\s/g, '')
            input.readOnly = true
            break
          }

          default: {
            label = document.createElement('label')
            label.textContent = header.textContent
            input = document.createElement('input')
            input.type = 'text'
            input.classList.add('form-control')
            input.name = header.textContent.toLowerCase().replace(/\s/g, '')

            if (!isNaN(Number(header.textContent))) {
              input.type = 'number'
            } else {
              input.type = 'text'
            }
          }
        }
        // assign initial value to input
        input.value = value
        // append label and input to form
        formGroup.appendChild(label)
        formGroup.appendChild(input)
        form.appendChild(formGroup)
      })
    })
  })
})
