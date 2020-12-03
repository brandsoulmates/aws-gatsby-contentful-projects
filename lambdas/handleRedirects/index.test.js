import {handler} from './'

describe('Redirect', () => {
  test('Publication should redirect', () => {
    const event = {}
    let r
    event.Records = []
    event.Records.push({
      cf: {
        request: {
          uri: '/publication-items/details/?id=f4fddd69-2334-6428-811c-ff00004cbded'
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

})
