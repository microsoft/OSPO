---
toc: false
---

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 2rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>

<h2>nothing here yet as this is in progress</h2>

# Title

### Data from a fixed point in time across variou Microsoft run GitHub Organizatins in a flattened CSV file

```
const repos = FileAttachment("./data/all_orgs_merged_20240120.csv").csv();
```


```js
// IMPORT LIBRARIES

import Tabulator from "https://cdn.jsdelivr.net/npm/tabulator-tables/+esm";

import {sql} from "npm:@observablehq/duckdb";

import * as duckdb from "npm:@duckdb/duckdb-wasm";
import {DuckDBClient} from "npm:@observablehq/duckdb";

// IMPORT DATA 
const repos = FileAttachment("./data/microsoft_repos_public_20240318.csv").csv();

```



```js

//  Data utilities for plotting
const color = Plot.scale({
  color: {
    type: "categorical",
    domain: d3.groupSort(repos, (D) => -D.length, (d) => d.owner).filter((d) => d !== "Other"),
    unknown: "var(--theme-foreground-muted)"
  }
});

const colorLanguage = Plot.scale({
  color: {
    type: "categorical",
    domain: d3.groupSort(repos, (D) => -D.length, (d) => d.language).filter((d) => d !== "Other"),
    unknown: "var(--theme-foreground-muted)"
  }
});
```

```js

// CREATING COHORTS 

import {createCohortColumns} from "./components/cohorts.js";

import {repos_cohort_processed_BaseCohorts} from "./components/cohorts.js";

var repos_cohort_processed = repos_cohort_processed_BaseCohorts(repos)

function replaceDotInColNameWithUnderscore(repos_cohort_processed){
  return repos_cohort_processed.map(obj => {
    const newObj = {};
    for (let key in obj) {
      newObj[key.replace(/\./g, '_')] = obj[key];
    }
    return newObj;
  });
}

repos_cohort_processed = replaceDotInColNameWithUnderscore(repos_cohort_processed)

```

##### Processed data with cohorts calculated
```js

display(repos_cohort_processed)


const table_all2 = 
  Inputs.table(repos_cohort_processed, {
   rows:16
  })

```

