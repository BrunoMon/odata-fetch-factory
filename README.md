
# @BrunoMon/odata-fetch-factory

![npm](https://img.shields.io/npm/v/@brunomon/odata-fetch-factory?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/BrunoMon/odata-fetch-factory)
![GitHub](https://img.shields.io/github/license/brunomon/odata-fetch-factory)

fetch function setted for odata V4 endpoint

## Install

```
$ npm install @brunomon/odata-fetch-factory
```

## Usage

```js

import {
    ODataFetchFactory,
    ODataEntity
} from "@brunomon/odata-fetch-factory";


const myOdataService = ODataFetchFactory({
    fetch: fetch,
    domain: "http://myDomain/myOdataService"
});

const cities = ODataEntity(myOdataService, "cities")

cities.get({
    filter: "State eq 'Florida'",
    orderby: "Name"
}).then(data => {
    console.log(data)
}).catch(err=>{
    console.log(err)
})

cities.post({
    Name: "Miami",
    State: "Florida"
}).then(data => {
    console.log(data)
}).catch(err=>{
    console.log(err)
})

cities.put({
    Id: 5,
    Name: "Miami",
    state:"Florida"
}).then(data => {
    console.log(data)
}).catch(err=>{
    console.log(err)
})

cities.patch({
    Id: 5,
    state:"Texas"
}).then(data => {
    console.log(data)
}).catch(err=>{
    console.log(err)
})

cities.delete({
    Id: 5
}).then(data => {
    console.log(data)
}).catch(err=>{
    console.log(err)
})

```