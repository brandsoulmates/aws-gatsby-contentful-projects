import {handler} from './'

describe('Redirect', () => {
  test('Publication should redirect', () => {
    const event = {}
    let r
    event.Records = []
    event.Records.push({
      cf: {
        request: {
          uri: '/publications-items/details/?id=c28bbf6e-2334-6428-811c-ff00004cbded'
        }
      }
    })
    handler(event, {}, (error, result) => {
      r = result
    })
    expect(r.headers.location[0].value).toEqual(`/insights/caveat-vendor/ftc-puts-children's-sites-on-notice-is-your-refrigerator-next`)
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

  test('Offices should redirect', () => {
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

})
