const express = require('express')
const ejs = require('ejs')
const mysql = require('mysql')

app = express()
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use('/resources', express.static(__dirname + '/resources'))

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'schnappi_bd',
  password: 'root',
})

app.get('/', function (req, res) {
  res.render('pages/index')
})

con.connect(function (err) {
  if (err) throw err
  console.log('Database is connected successfully !')
})

app.get('/viz/:tabel', function (req, res, next) {
  tabel = req.params.tabel
  filtru = req.query.filtru
  titlu = tabel.toUpperCase()[0] + tabel.slice(1)

  query = `SELECT * FROM ${tabel}`

  if (filtru) {
    filtru = con.escapeId(filtru)
    filtru = filtru.toLowerCase().split(' ').join().replace(',', '_')
    query += ` ORDER BY ${filtru}`
  }

  con.query(query, function (err, rows) {
    console.log(query)
    if (rows.length > 0) {
      coloane = Object.keys(rows[0])
      for (var i = 0; i < coloane.length; i++) {
        coloane[i] = coloane[i].charAt(0).toUpperCase() + coloane[i].slice(1)
        if (coloane[i].includes('_')) {
          coloane[i] = coloane[i].split('_').join(' ')
        }
      }

      switch (tabel) {
        case 'prescolari':
          rows.forEach((row) => {
            row.data_nastere = row.data_nastere.toISOString().split('T')[0]
          })
          break

        case 'inventare':
          rows.forEach((row) => {
            row.data_inventar = row.data_inventar.toISOString().split('T')[0]
          })
          break

        case 'inscrieri':
          rows.forEach((row) => {
            row.data_inscriere = row.data_inscriere.toISOString().split('T')[0]
          })
          break

        case 'livrari':
          rows.forEach((row) => {
            row.data_livrare = row.data_livrare.toISOString().split('T')[0]
          })
          break

        case 'repartizare_sali':
          rows.forEach((row) => {
            row.data_inceput = row.data_inceput.toISOString().split('T')[0]
            row.data_sfarsit = row.data_sfarsit.toISOString().split('T')[0]
          })
          break

        default:
        //
      }
    }
    res.render('pages/afisare', {
      titlu: titlu,
      coloane: coloane,
      valori: rows,
    })
  })
})

app.post('/viz/:titlu', function (req, res, next) {
  const { titlu } = req.params
  let coloane
  let rows

  const keyDictionary = {
    idechipament: 'id_echipament',
    idfurnizor: 'id_furnizor',
    idinscriere: 'id_inscriere',
    idinventar: 'id_inventar',
    idlivrare: 'id_livrare',
    idpost: 'id_post',
    idprescolar: 'id_prescolar',
    idrepartizare: 'id_repartizare',
    idsala: 'id_sala',
    idserviciu: 'id_serviciu',
    idangajat: 'id_angajat',
    datainventar: 'data_inventar',
    datainscriere: 'data_inscriere',
    datalivrare: 'data_livrare',
    datainceput: 'data_inceput',
    datasfarsit: 'data_sfarsit',
    datanastere: 'data_nastere',
    telefonparinte: 'telefon_parinte',
    emailparinte: 'email_parinte',
    nevoispeciale: 'nevoi_speciale',
  }

  query = `UPDATE ${titlu} SET `

  chei = Object.keys(req.body)
  const mappedKeys = chei.map((key) => keyDictionary[key] || key)
  valori = Object.values(req.body)

  for (let i = 0; i < mappedKeys.length; i++) {
    if (valori[i] == '') query = query + `${mappedKeys[i]} = null, `
    else query = query + `${mappedKeys[i]} = '${valori[i]}', `
  }
  query = query.slice(0, -2)
  query = query + ` WHERE ${mappedKeys[0]} = '${valori[0]}'`

  con.query(query, function (err) {
    if (err) console.log(err)
    let selectQuery = `SELECT * FROM ${titlu}`
    con.query(selectQuery, function (err, rows) {
      if (rows.length > 0) {
        coloane = Object.keys(rows[0])
        for (var i = 0; i < coloane.length; i++) {
          coloane[i] = coloane[i].charAt(0).toUpperCase() + coloane[i].slice(1)
          if (coloane[i].includes('_')) {
            coloane[i] = coloane[i].split('_').join(' ')
          }
        }

        switch (tabel) {
          case 'prescolari':
            rows.forEach((row) => {
              row.data_nastere = row.data_nastere.toISOString().split('T')[0]
            })
            break

          case 'inventare':
            rows.forEach((row) => {
              row.data_inventar = row.data_inventar.toISOString().split('T')[0]
            })
            break

          case 'inscrieri':
            rows.forEach((row) => {
              row.data_inscriere = row.data_inscriere
                .toISOString()
                .split('T')[0]
            })
            break

          case 'livrari':
            rows.forEach((row) => {
              row.data_livrare = row.data_livrare.toISOString().split('T')[0]
            })
            break

          case 'repartizare_sali':
            rows.forEach((row) => {
              row.data_inceput = row.data_inceput.toISOString().split('T')[0]
              row.data_sfarsit = row.data_sfarsit.toISOString().split('T')[0]
            })
            break

          default:
          //
        }
      }
      res.render('pages/afisare', {
        titlu: titlu,
        coloane: coloane, // aici era mappedKeys
        valori: rows,
      })
    })
  })
})

app.get('/add/:tabel', function (req, res) {
  const { tabel } = req.params
  titlu = tabel.toUpperCase()[0] + tabel.slice(1)
  con.query(`SELECT * FROM ${tabel}`, function (err, rows) {
    coloane = Object.keys(rows[0])
    console.log(coloane)
    for (var i = 0; i < coloane.length; i++) {
      coloane[i] = coloane[i].charAt(0).toUpperCase() + coloane[i].slice(1)

      if (coloane[i].includes('_')) {
        coloane[i] = coloane[i].split('_').join(' ')
      }
    }
    res.render('pages/adaugare', {
      titlu: titlu,
      coloane: coloane,
      valori: rows,
    })
  })
})

app.post('/inreg/:tabel', function (req, res) {
  const { tabel } = req.params

  query = `INSERT INTO ${tabel} VALUES(`

  valori = Object.values(req.body)

  for (let i = 0; i < valori.length; i++) {
    if (valori[i] == '') query = query + 'null, '
    else query = query + `'${valori[i]}', `
  }
  query = query.slice(0, -2)
  query = query + ');'

  con.query(query, function (err) {
    if (err) console.log(err)
    res.redirect(`/viz/${tabel}`)
  })
})

app.post('/stergere/:tabel/:id', function (req, res) {
  const { tabel } = req.params
  let idDictionary = {
    angajati: 'angajat',
    echipamente: 'echipament',
    furnizori: 'furnizor',
    inscrieri: 'inscriere',
    inventare: 'inventar',
    livrari: 'livrare',
    posturi: 'post',
    repartizare_sali: 'repartizare',
    sali: 'sala',
    servicii: 'serviciu',
    prescolari: 'prescolar',
  }

  con.query(
    `DELETE FROM ${tabel} WHERE id_${idDictionary[tabel]} = ${req.params.id}`,
    function (err) {}
  )
})

app.get('/cerinta/c', function (req, res) {
  query = `select p.id_prescolar, concat(p.nume, " ", p.prenume) as "prescolar", 
	s.denumire_serv, a.id_angajat, concat(a.nume, " ", a.prenume) as "angajat",
    pst.denumire_post
  from inscrieri i
  inner join prescolari p on i.id_prescolar = p.id_prescolar
  inner join servicii s on i.id_serviciu = s.id_serviciu
  inner join angajati a on i.id_angajat = a.id_angajat
  inner join posturi pst on a.id_post = pst.id_post
  where p.nevoi_speciale = 1 and lower(s.denumire_serv) = "baschet";`

  con.query(query, function (req, rows) {
    coloane = Object.keys(rows[0])
    for (var i = 0; i < coloane.length; i++) {
      coloane[i] = coloane[i].charAt(0).toUpperCase() + coloane[i].slice(1)

      if (coloane[i].includes('_')) {
        coloane[i] = coloane[i].split('_').join(' ')
      }
    }
    res.render('pages/cerinta-c', {
      coloane: coloane,
      valori: rows,
    })
  })
})

app.get('/cerinta/d', function (req, res) {
  query = `SELECT i.id_prescolar, CONCAT(p.nume, " ", p.prenume) AS "prescolar", COUNT(i.id_prescolar) AS "nr servicii"
  FROM inscrieri i
  INNER JOIN prescolari p ON p.id_prescolar = i.id_prescolar
  GROUP BY (i.id_prescolar)
  HAVING COUNT(i.id_prescolar) >= 3;`

  con.query(query, function (err, rows) {
    coloane = Object.keys(rows[0])
    for (var i = 0; i < coloane.length; i++) {
      coloane[i] = coloane[i].charAt(0).toUpperCase() + coloane[i].slice(1)

      if (coloane[i].includes('_')) {
        coloane[i] = coloane[i].split('_').join(' ')
      }
    }
    res.render('pages/cerinta-d', {
      coloane: coloane,
      valori: rows,
    })
  })
})

app.listen(8080, () => {
  console.log('Serverul a pornit !')
})
