import {handler} from './'

describe('Redirect', () => {
  test('Publication should redirect', () => {
    const event = {}
    let r
    event.Records = []
    event.Records.push({
      cf: {
        request: {
          uri: '/publications-items/details/?id=f9fddd69-2334-6428-811c-ff00004cbded'
        }
      }
    })
    handler(event, {}, (error, result) => {
      r = result
    })
    expect(r.headers.location[0].value).toEqual(`/insights/attorney-authored/implementing-the-volcker-rule-the-covered-fund-restrictions`)
  })

  test('About Should not redirect', () => {
    const event = {}
    let r
    event.Records = []
    event.Records.push({
      cf: {
        request: {
          uri: '/about/'
        }
      }
    })
    handler(event, {}, (error, result) => {
      r = result
    })

    expect(r.uri).toEqual(`/about/index.html`)
  })

  test('Professional regex', () => {
    const event = {}
    let r
    event.Records = []
    event.Records.push({
      cf: {
        request: {
          uri: '/professionals/details/gregnitzkowski'
        }
      }
    })
    handler(event, {}, (error, result) => {
      r = result
    })
    expect(r.headers.location[0].value).toEqual(`/professionals/gregnitzkowski`)
  })

  test('PHOffices', () => {
    const event = {}
    let r
    event.Records = []
    event.Records.push({
      cf: {
        request: {
          uri: '/PHOffices/'
        }
      }
    })
    handler(event, {}, (error, result) => {
      r = result
    })
    expect(r.headers.location[0].value).toEqual(`/offices/`)
  })

  test('Practice Area', () => {
    const event = {}
    let r
    event.Records = []
    event.Records.push({
      cf: {
        request: {
          uri: '/area/Anti-corruption-and-FCPA'
        }
      }
    })
    handler(event, {}, (error, result) => {
      r = result
    })
    expect(r.headers.location[0].value).toEqual(`/practice-areas/anti-corruption-and-fcpa`)
  })

  test('Publications Items', () => {
    const event = {}
    let r
    event.Records = []
    event.Records.push({
      cf: {
        request: {
          uri: '/publications-items'
        }
      }
    })
    handler(event, {}, (error, result) => {
      r = result
    })
    expect(r.headers.location[0].value).toEqual(`/insights`)
  })

  test('Test publication item', () => {
    const event = {}
    let r
    event.Records = []
    event.Records.push({
      cf: {
        request: {
          uri: '/publications-items/details/?id=1bc3e169-2334-6428-811c-ff00004cbded'
        }
      }
    })
    handler(event, {}, (error, result) => {
      r = result
    })
    expect(r.headers.location[0].value).toEqual(`/insights/audio/asia-outbound-real-estate-investment-trends-opportunities-and-strategies-part-ii`)
  })

  test('Test microsite', () => {
    const event = {}
    let r
    event.Records = []
    event.Records.push({
      cf: {
        request: {
          uri: '/holidaymessage2015'
        }
      }
    })
    handler(event, {}, (error, result) => {
      r = result
    })
    expect(r.headers.location[0].value).toEqual(`https://sites.paulhastings.com/Microsites/holidaymessage2015/`)
  })

})
