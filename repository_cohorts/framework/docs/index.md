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


# !!! THIS PAGE IS IN PROGRESS !!!

### Data from a fixed point in time across various Microsoft run GitHub Organizatins 

Data is loaded from a CSV file and is not updated post 2024-03-19.

This is provided as an example of the repository cohorts concept on real data.


```js
// IMPORT LIBRARIES

import Tabulator from "https://cdn.jsdelivr.net/npm/tabulator-tables/+esm";

import {sql} from "npm:@observablehq/duckdb";

import * as duckdb from "npm:@duckdb/duckdb-wasm";
import {DuckDBClient} from "npm:@observablehq/duckdb";

// IMPORT DATA 
const repos = FileAttachment("./data/microsoft_repos_public_20240319.csv").csv();

```
### Data transformation steps

```
const repos = FileAttachment("./data/microsoft_repos_public_20240319.csv)").csv();
```

Unprocessesd raw data

```js
display(repos)
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

// rename column names
import { renameKeys} from "./components/cohorts.js";

const changeKeyNamesObject = {
    "FullName": "full_name",
    "OwnerLogin":"owner" ,
    "Size":"size" ,
    "StargazersCount": "stargazers_count" ,
    "OpenIssuesCount": "open_issues_count",
    "ForksCount":"forks_count" ,
    "SubscribersCount":"subscribers_count",
    "Homepage": "homepage" ,
    "HasIssues": "has_issues",
    "count_unique_contributor_Ids": "commit_stats_total_committers",
    "Description": "description",
    "UpdatedAt":"updated_at" ,
    "CreatedAt":"created_at"
}

const reposReName = renameKeys(repos, changeKeyNamesObject)

```

Renamed keys to mirror ecosyste.ms names so code can be reused more easily

```js
display(reposReName )
```

```js

import {countsCohortGroup} from "./components/cohorts.js"

// CREATING COHORTS 

import {createCohortColumns} from "./components/cohorts.js";

import {repos_cohort_processed_BaseCohorts} from "./components/cohorts.js";

const repos_cohort_processedSemi = repos_cohort_processed_BaseCohorts(reposReName )

const dataCohortsWithTrueInGroup = countsCohortGroup(repos_cohort_processedSemi,[ "cohort_sample","cohort_age","cohort_committers","cohort_Nadia"])


```

Processed data with cohorts calculated

```js

display(dataCohortsWithTrueInGroup)


const table_all2 = 
  view(Inputs.table(dataCohortsWithTrueInGroup, {
   rows:16
  }))

```
--------------------------

### Initial visualizations of main repository cohorts

```js

Plot.plot({
  title: "Cohort analysis age",
  marginTop: 20,
  marginRight: 20,
  marginBottom: 30,
  marginLeft: 40,
  grid: true,
  width: 1000,
  color: { legend: true } ,
  marks: [
    Plot.barY(
  dataCohortsWithTrueInGroup,
  Plot.groupX({ y: "count" }, { x: "cohort_age_trueValueInGroup", lineWidth: 74, marginBottom: 40})
)
  ]
})

```

```js
Plot.plot({
  title: "Cohort analysis age vs. committers size",
  marginTop: 20,
  marginRight: 20,
  marginBottom: 30,
  marginLeft: 40,
  grid: true,
  width: 1000,
  color: { legend: true } ,
  marks: [
    Plot.barY(
  dataCohortsWithTrueInGroup,
  Plot.groupX({ y: "count" }, { x: "cohort_age_trueValueInGroup", fill: "cohort_committers_trueValueInGroup", lineWidth: 74, marginBottom: 40})
)
  ]
})
```

```js
Plot.plot({
  title: "Cohort analysis cohort_Nadia vs. age in days",
  marginTop: 20,
  marginRight: 20,
  marginBottom: 30,
  marginLeft: 40,
  grid: true,
  width: 1000,
  color: { legend: true } ,
  marks: [
    Plot.barY(
  dataCohortsWithTrueInGroup,
  Plot.groupX({ y: "count" }, { x: "cohort_Nadia_trueValueInGroup", fill: "age_in_days", lineWidth: 74, marginBottom: 40})
)
  ]
})
```

```js
Plot.plot({
  title: "Nadia community cohorts vs. days since last update",
  marginTop: 20,
  marginRight: 20,
  marginBottom: 30,
  marginLeft: 40,
  grid: true,
  width: 1000,
  color: { legend: true } ,
  marks: [
    Plot.barY(
  dataCohortsWithTrueInGroup,
  Plot.groupX({ y: "count" }, { x: "cohort_Nadia_trueValueInGroup", fill: "daysSinceUpdated", lineWidth: 74, marginBottom: 40})
)
  ]
})
```
-----------------

## SQL filtering on table and plots below

```js

const dbRepos = DuckDBClient.of({reposSQL: dataCohortsWithTrueInGroup});

```

```js
const sizeMin = view(Inputs.range([0, 5000000], {label: "greater than this size in bytes",value:1000}));
const stargazer_count_min = view(Inputs.range([0, 10000], {label: "more than this many stargazers",value:20}));
const fork_count_min = view(Inputs.range([0, 4000], {label: "more than this many forks",value:5}));
const limitNumberRowsToShow = view(Inputs.range([0, 15000], {label: "max number of rows to show",value:200,step:1}));
```

```
SELECT * FROM reposSQL WHERE size > ${sizeMin} AND stargazers_count > ${stargazer_count_min} LIMIT ${limitNumberRowsToShow}
```

```js
const dbRepos_FilteredBySQL = dbRepos.sql`SELECT * FROM reposSQL WHERE forks_count > ${fork_count_min} AND size > ${sizeMin} AND stargazers_count > ${stargazer_count_min} LIMIT ${limitNumberRowsToShow}`

```

```js
display(dbRepos_FilteredBySQL.length)

const table_SQLunfiltered = 
  view(Inputs.table(dbRepos_FilteredBySQL))

```

```js
Plot.plot({
    title: "Nadia community cohorts vs. Organization",
  marginTop: 20,
  marginRight: 20,
  marginBottom: 30,
  marginLeft: 140,
  grid: true,
  width: 1000,
  color: { legend: true } ,
  marks: [
    Plot.barX(
      dbRepos_FilteredBySQL,
      Plot.groupY(
        { x: "count" },
        { fill: "cohort_Nadia_trueValueInGroup", y: "owner", title: "full_name", sort: { y: "x", reverse: true } }
      )
    )
  ]
})
```

### What is a Nadia Cohort?

This is a cohort group that attemps to capture a description of community size and patterns that is too abstract to think about otherwise when in pure raw numbers. 

```
|||PLACEHOLDER FOR EXPLANATORY TEXT|||
```
1. Federation

2. Club

3. Stadium

4. Toy

5. The middle

6. Repositories missing data so a cohort of this grouping can not be calculated


#### Thresholds used to group repositories into Nadia comunity cohorts
```
|||PLACEHOLDER for explaining the code below|||
```
```
      {"createCohortTestForNullEmpty":[["commit_stats_total_committers"], "cohort_Nadia_missingData"]},
      {"createCohortNumericalCol":["commit_stats_total_committers", "cohort_Nadia_mid", 6,60]},
        {"createCohortNumericalColTwoTests":["commit_stats_total_committers", "cohort_Nadia_club", 60,1000000, "ratioStargazersVsCommitters", 0,2]},
      {"createCohortNumericalColTwoTests":["commit_stats_total_committers", "cohort_Nadia_federation", 60,1000000,  "ratioStargazersVsCommitters", 2,1000000000]},
      {"createCohortNumericalColTwoTests":["commit_stats_total_committers", "cohort_Nadia_stadium", 0.2, 6, "stargazers_count", 100,100000000]},
      {"createCohortNumericalColTwoTests":["commit_stats_total_committers", "cohort_Nadia_toy", 0.2,6, "stargazers_count", 0,100]},
```
