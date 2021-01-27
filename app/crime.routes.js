const express = require('express')
const router = express.Router()

const http = require('../lib/middleware/http')

router.get('/', async (req, res) => {
  let crimeCategories = []

  try {
    const request = await http.get('crime-categories')
    crimeCategories = request.data.map(category => { return { value: category.url, text: category.name } })
  } catch (e) {
    // TODO: could render to an error page and make this less verbose in logs
    console.log(e)
  }
  res.render('crime', { crimeCategories })
})

router.post('/results', async (req, res) => {
  const { data } = res.locals
  const lookup = await http.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      address: data.address,
      key: process.env.GOOGLE_MAPS_API_KEY
    }
  })
  const { lat, lng } = lookup.data.results[0].geometry.location

  const neighbourHoodLookup = await http.get(`locate-neighbourhood?q=${lat},${lng}`)
  const neighbourHood = neighbourHoodLookup.data

  let crimes = []

  try {
    const crimeLookup = await http.get('crimes-no-location', {
      params: {
        category: data.crimeCategory,
        force: neighbourHood.force,
        date: `${data['crime-date-year']}-${data['crime-date-month']}`
      }
    })

    crimes = crimeLookup.data.map(crime => {
      return [
        { html: `<a href="/crime/results/${crime.persistent_id}">${crime.category}</a>` },
        { text: `${crime.outcome_status.category} - (${crime.outcome_status.date})` }
      ]
    })
  } catch (e) {
    // TODO: could make this less verbose in logs
    console.log(e)
  }

  console.log(res.locals)
  res.render('crime-results', { crimes, neighbourHood: neighbourHood.force })
})

module.exports = router
