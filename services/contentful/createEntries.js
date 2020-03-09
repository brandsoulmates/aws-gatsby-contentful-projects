import {
  initContentfulClients,
  getSpace
} from './initClient'
import config from '../../config';

const locale = "en-US"

const entriesArr = [
{
  "title": {
    [locale]: "Peter T. Brejcha"
  }, 
  "cellData1": {
    [locale]: "Peter T. Brejcha"
  },
  "cellData2": {
    [locale]: "Assistant General Counsel"
  },
  "cellData3": {
    [locale]: "Los Angeles"
  }
},
{
"title": {
  [locale]: "Thomas P Brown"
}, 
"cellData1":{
  [locale]: "Thomas P Brown"
}, "cellData2": {
  [locale]: "Partner, Litigation Department"
}, "cellData3": {
  [locale]: "San Francisco"
}
},
{
"title": {
  [locale]: "Barbara B Brown"
}, 
"cellData1":{
  [locale]: "Barbara B Brown"
}, "cellData2": {
  [locale]: "Partner, Employment Law Department"
}, "cellData3": {
  [locale]: "Washington, D.C."
}
},
{
"title": {
  [locale]: "Paul W Cane Jr."
}, 
"cellData1":{
  [locale]: "Paul W Cane Jr."
}, "cellData2": {
  [locale]: "Senior Counsel, Employment Law Department"
}, "cellData3": {
  [locale]: "San Francisco"
}
},
{
"title": {
  [locale]: "Scott Carlton"
}, 
"cellData1":{
  [locale]: "Scott Carlton"
}, "cellData2": {
  [locale]: "Of Counsel, Litigation Department"
}, "cellData3": {
  [locale]: "Los Angeles"
}
},
{
"title": {
  [locale]: "Samuel W Cooper"
}, 
"cellData1":{
  [locale]: "Samuel W Cooper"
}, "cellData2": {
  [locale]: "Partner, Litigation Department"
}, "cellData3": {
  [locale]: "Houston"
}
},
{
"title": {
  [locale]: "Eric W Dittmann"
}, 
"cellData1":{
  [locale]: "Eric W Dittmann"
}, "cellData2": {
  [locale]: "Partner, Litigation Department"
}, "cellData3": {
  [locale]: "New York"
}
},
{
"title": {
  [locale]: "Nathaniel B Edmonds"
}, 
"cellData1":{
  [locale]: "Nathaniel B Edmonds"
}, "cellData2": {
  [locale]: "Partner, Litigation Department"
}, "cellData3": {
  [locale]: "Washington, D.C."
}
},
{
"title": {
  [locale]: "Kenneth W Gage"
}, 
"cellData1":{
  [locale]: "Kenneth W Gage"
}, "cellData2": {
  [locale]: "Partner, Employment Law Department"
}, "cellData3": {
  [locale]: "New York, Chicago"
}
},
{
"title": {
  [locale]: "Jennifer B Hildebrandt"
}, 
"cellData1":{
  [locale]: "Jennifer B Hildebrandt"
}, "cellData2": {
  [locale]: "Partner, Corporate Department"
}, "cellData3": {
  [locale]: "Los Angeles"
}
},
{
"title": {
  [locale]: "Randall V Johnston"
}, 
"cellData1":{
  [locale]: "Randall V Johnston"
}, "cellData2": {
  [locale]: "Associate, Litigation Department"
}, "cellData3": {
  [locale]: "New York"
}
},
{
"title": {
  [locale]: "Eric R Keller"
}, 
"cellData1":{
  [locale]: "Eric R Keller"
}, "cellData2": {
  [locale]: "Partner, Tax Department"
}, "cellData3": {
  [locale]: "Washington, D.C."
}
},
{
"title": {
  [locale]: "Stephen Kinnaird"
}, 
"cellData1":{
  [locale]: "Stephen Kinnaird"
}, "cellData2": {
  [locale]: "Partner, Litigation Department"
}, "cellData3": {
  [locale]: "Washington, D.C."
}
},
{
"title": {
  [locale]: "Jodi A Kleinick"
}, 
"cellData1":{
  [locale]: "Jodi A Kleinick"
}, "cellData2": {
  [locale]: "Partner, Litigation Department"
}, "cellData3": {
  [locale]: "New York"
}
},
{
"title": {
  [locale]: "Nicole Dania Lueddeke"
}, 
"cellData1":{
  [locale]: "Nicole Dania Lueddeke"
}, "cellData2": {
  [locale]: "Associate, Litigation Department"
}, "cellData3": {
  [locale]: "Los Angeles"
}
},
{
"title": {
  [locale]: "Jason D McCoy"
}, 
"cellData1":{
  [locale]: "Jason D McCoy"
}, "cellData2": {
  [locale]: "Associate, Real Estate Department"
}, "cellData3": {
  [locale]: "Atlanta"
}
},
{
"title": {
  [locale]: "Anand B Patel"
}, 
"cellData1":{
  [locale]: "Anand B Patel"
}, "cellData2": {
  [locale]: "Associate, Litigation Department"
}, "cellData3": {
  [locale]: "Washington, D.C."
}
},
{
"title": {
  [locale]: "Charles A Patrizia"
}, 
"cellData1":{
  [locale]: "Charles A Patrizia"
}, "cellData2": {
  [locale]: "Partner, Litigation Department"
}, "cellData3": {
  [locale]: "Washington, D.C."
}
},
{
"title": {
  [locale]: "Joseph R Profaizer"
}, 
"cellData1":{
  [locale]: "Joseph R Profaizer"
}, "cellData2": {
  [locale]: "Partner, Litigation Department"
}, "cellData3": {
  [locale]: "Washington, D.C."
}
},
{
"title": {
  [locale]: "Neil J Schumacher"
}, 
"cellData1":{
  [locale]: "Neil J Schumacher"
}, "cellData2": {
  [locale]: "Of Counsel, Litigation Department"
}, "cellData3": {
  [locale]: "Washington, D.C."
}
},
{
"title": {
  [locale]: "Patrick W Shea"
}, 
"cellData1":{
  [locale]: "Patrick W Shea"
}, "cellData2": {
  [locale]: "Partner, Employment Law Department"
}, "cellData3": {
  [locale]: "New York"
}
},
{
"title": {
  [locale]: "Peter M Stone"
}, 
"cellData1":{
  [locale]: "Peter M Stone"
}, "cellData2": {
  [locale]: "Partner, Litigation Department"
}, "cellData3": {
  [locale]: "Palo Alto"
}
},
{
"title": {
  [locale]: "Carson H Sullivan"
}, 
"cellData1":{
  [locale]: "Carson H Sullivan"
}, "cellData2": {
  [locale]: "Partner, Employment Law Department"
}, "cellData3": {
  [locale]: "Washington, D.C."
}
},
{
"title": {
  [locale]: "Igor V Timofeyev"
}, 
"cellData1":{
  [locale]: "Igor V Timofeyev"
}, "cellData2": {
  [locale]: "Partner, Litigation Department"
}, "cellData3": {
  [locale]: "Washington, D.C."
}
},
{
"title": {
  [locale]: "Sean D Unger"
}, 
"cellData1":{
  [locale]: "Sean D Unger"
}, "cellData2": {
  [locale]: "Partner, Litigation Department"
}, "cellData3": {
  [locale]: "San Francisco"
}
},
{
"title": {
  [locale]: "Bruce M Wexler"
}, 
"cellData1":{
  [locale]: "Bruce M Wexler"
}, "cellData2": {
  [locale]: "Partner, Litigation Department"
}, "cellData3": {
  [locale]: "New York"
}
},
{
"title": {
  [locale]: "Jeffrey D Wohl"
}, 
"cellData1":{
  [locale]: "Jeffrey D Wohl"
}, "cellData2": {
  [locale]: "Partner, Employment Law Department"
}, "cellData3": {
  [locale]: "San Francisco"
}
},
{
"title": {
  [locale]: "Jennifer St. John Yount"
}, 
"cellData1":{
  [locale]: "Jennifer St. John Yount"
}, "cellData2": {
  [locale]: "Partner, Corporate Department"
}, "cellData3": {
  [locale]: "New York"
}
},
{
"title": {
  [locale]: "Jill E.C. Yung"
}, 
"cellData1":{
  [locale]: "Jill E.C. Yung"
}, "cellData2": {
  [locale]: "Partner, Real Estate Department"
}, "cellData3": {
  [locale]: "San Francisco"
}
}
]

const createAndPublishEntry = async ({environment, contentTypeId, entryId, entryFieldsObj}) => {
  try {
    let entry = await environment.createEntryWithId(contentTypeId, entryId, {
      fields: entryFieldsObj
    })
    let publishedEntry = await entry.publish();
    console.log(`Entry ${publishedEntry.sys.id} created and published.`);
    return `Entry ${publishedEntry.sys.id} created and published.`

  } catch(e){
    console.error(e)
  }
}

const createEntries = async (environment, contentTypeId, entriesArr) => {
  try {
    let time = new Date().getTime()
    let entries = await Promise.all(entriesArr.map((entryFieldsObj, i) =>
      createAndPublishEntry({environment, contentTypeId, entryId: `${contentTypeId}${time}_${i+1}`, entryFieldsObj})
      ))
      return entries;

  } catch(e){
    console.e
  }
}

const initSpaceAndCreateEntries = async () => {
  initContentfulClients()

  try {
    const space = await getSpace('cma')
    const environment = await space.getEnvironment('dev');
    let res = await createEntries(environment, 'componentRow', entriesArr);
    return res;

  } catch(e) {
    console.error(e);
  }
}



initSpaceAndCreateEntries();