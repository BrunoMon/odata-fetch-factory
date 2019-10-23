
# @BrunoMon/odata-fetch-factory

[![GitHub issues](https://img.shields.io/github/issues/BrunoMon/odataFetchFactory)](https://github.com/BrunoMon/odataFetchFactory/issues)
![npm](https://img.shields.io/npm/v/@brunomon/odataFetchFactory?style=flat-square)
![GitHub](https://img.shields.io/github/license/brunomon/odataFetchFactory)

fetch function setted for odata endpoint

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
})

cities.post({
    Name: "Miami",
    State: "Florida"
})

cities.put({
    Id: 5,
    Name: "Miami",
    state:"Florida"
})

cities.patch({
    Id: 5,
    state:"Texas"
})

cities.delete({
    Id: 5
})

```