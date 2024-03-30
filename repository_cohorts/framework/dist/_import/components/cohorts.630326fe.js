//
// Copyright (c) Microsoft.
// Licensed under the Creative Commons Attribution 4.0 International license. See LICENSE file in the project root for full license information.
//


///////////////////////////////////////////////////////////////////////////////////////////////////
//////// Code in section below is largely related to data processing for repository cohorts. //////
///////////////////////////////////////////////////////////////////////////////////////////////////

// This const is used to rename keys from raw data to a single naming convention. 
// This is useful as metadata can be pulled from the GitHub API, internal data stores, Ecosyste.ms API, or other places. 
// Each potential metadata source will sometimes call the exact same data slightly different things. 
// The key is the name being looked for in incoming data. THe value is the name it will be replaced with if seen.
export const changeKeyNamesObject = {
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
    "Decription": "description",
    "UpdatedAt":"updated_at" ,
    "CreatedAt":"created_at"
}

/**
 * Renames the keys of an array of objects based on a provided mapping object.
 * 
 * @param {Array} data - The array of objects to be modified.
 * @param {Object} changeKeyNamesObject - The object containing the key mapping.
 * @returns {Array} - The modified array of objects with renamed keys.
 */
export function renameKeys(data, changeKeyNamesObject) {
    return data.map((item) => {
        const updatedItem = {};
        for (const key in item) {
            if (changeKeyNamesObject.hasOwnProperty(key)) {
                const newKey = changeKeyNamesObject[key];
                updatedItem[newKey] = item[key];
            } else {
                updatedItem[key] = item[key];
            }
        }
        return updatedItem;
    });
}

/**
 * Adds the year of creation to new key for each repository in the given array.
 *
 * @param {Array<Object>} repos - The array of repositories.
 * @returns {Array<Object>} - The array of repositories with the year of creation added.
 */
function addYearToRepos(repos) {
    return repos.map((repo) => {
        const createdAt = new Date(repo.created_at);
        const year = createdAt.getUTCFullYear();
        const updatedRepo = { ...repo, created_at_year: year };
        return updatedRepo;
    });
}

/**
 * Adds an 'age_in_days' property to each repository object in the given array.
 * The 'age_in_days' property represents the number of days since the repository was created.
 *
 * @param {Array<Object>} repos - An array of repository objects.
 * @returns {Array<Object>} - An array of repository objects with the 'age_in_days' property added.
 */
function addAgeInDaysCol(repos) {
    return repos.map((repo) => {
        const createdAt = new Date(repo.created_at);
        const currentDate = new Date();
        const timeDiff = Math.abs(currentDate - createdAt);
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const updatedRepo = { ...repo, age_in_days: daysDiff };
        return updatedRepo;
    });
}

/**
 * Calculates the number of days since a specific column in each repository and adds a new column with the result.
 * Will do so for any coulumn that is a date.
 * 
 * @param {Array<Object>} repos - An array of repositories.
 * @param {string} colName - The name of the column containing the date in each repository.
 * @param {string} newColName - The name of the new column to be added with the number of days since the specified date.
 * @returns {Array<Object>} - An array of repositories with the new column added.
 */
function addDaysSinceCols(repos,colName,newColName) {
    return repos.map((repo) => {
        const At = new Date(repo[colName]);
        const currentDate = new Date();
        const timeDiff = Math.abs(currentDate - At);
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const updatedRepo = { ...repo, [newColName]: daysDiff };
        return updatedRepo;
    });
}

/**
 * Calculates the ratio between two columns in an array of repositories and adds a new column with the result.
 *
 * @param {Array} repos - The array of repositories.
 * @param {string} col1 - The name of the first column.
 * @param {string} col2 - The name of the second column.
 * @param {string} newColName - The name of the new column to be added.
 * @returns {Array} - The array of repositories with the new column added.
 */
function createRatioColumn(repos, col1, col2, newColName) {
    return repos.map((repo) => {
        const ratio = repo[col1] / repo[col2];
        const updatedRepo = { ...repo, [newColName]: ratio };
        return updatedRepo;
    });
}

/**
 * Parses the values of specified columns in an array of objects from strings to integers.
 * This is sometimes necessary when the data is pulled from an API and the values are 
 * returned as strings instead of integers as they are in another data source.
 * 
 * @param {Array<Object>} repos - The array of objects containing the repositories.
 * @param {Array<string>} arrayOfKeys - The array of column names to be parsed.
 * @returns {Array<Object>} - The modified array of objects with parsed column values.
 */
function parseColumnsIntoIntegersFromStrings(repos, arrayOfKeys) {
    for (const repo of repos) {
        for (const column of arrayOfKeys) {
            if (repo.hasOwnProperty(column)) {
                repo[column] = parseInt(repo[column]);
            }
        }
    }
    return repos;
}

/**
 * Applies a cohort test for null or empty values on each item in the data array.
 * If any of the specified columns in the columnArray have null or empty values, 
 * the corresponding item will be updated with a new property [cohortColName] set to true.
 * Otherwise, the [cohortColName] property will be set to false.
 * 
 * @param {Array} data - The array of items to apply the cohort test on.
 * @param {Array} columnArray - The array of column names to check for null or empty values.
 * @param {string} cohortColName - The name of the property to be added to each item indicating the result of the cohort test.
 * @returns {Array} - The updated array of items with the [cohortColName] property set accordingly.
 */
function createCohortTestForNullEmpty(data, columnArray, cohortColName){
    return data.map((item) => {
        for (const column in columnArray){
          if (item[column] == null || item[column] == "") {  ///// typeof item[column] === "undefined" || 
            console.log("true triggered for value: ",item[column])
          return { ...item, [cohortColName]: true };
          }
        }
        return { ...item, [cohortColName]: false };
      });
  }

/**
 * Creates a new cohort numerical column based on a given data array and whether that single column is within two threshold values.
 * @param {Array} data - The data array to be processed.
 * @param {string} column - The name of the column to be evaluated.
 * @param {string} cohortColName - The name of the new cohort column to be created.
 * @param {number} baseThreshold - The lower threshold value for the cohort.
 * @param {number} topThreshold - The upper threshold value for the cohort.
 * @returns {Array} - The modified data array with the new cohort column.
 */
function createCohortNumericalCol(data, column, cohortColName, baseThreshold, topThreshold) {
    return data.map((item) => {
      if (item[column] > baseThreshold && item[column] <= topThreshold) {
        return { ...item, [cohortColName]: true };
      } else {
        return { ...item, [cohortColName]: false };
      }
    });
}

/**
 * Creates a new cohort column based on two numerical columns and whether each is within given threshold values.
 * @param {Array} data - The array of data objects.
 * @param {string} column - The name of the first numerical column.
 * @param {string} cohortColName - The name of the new cohort column to be created.
 * @param {number} baseThreshold - The lower threshold for the first numerical column.
 * @param {number} topThreshold - The upper threshold for the first numerical column.
 * @param {string} columnB - The name of the second numerical column.
 * @param {number} baseThresholdB - The lower threshold for the second numerical column.
 * @param {number} topThresholdB - The upper threshold for the second numerical column.
 * @returns {Array} - The modified data array with the new cohort column.
 */
function createCohortNumericalColTwoTests(data, column, cohortColName, baseThreshold, topThreshold, columnB, baseThresholdB, topThresholdB) {
    return data.map((item) => {
      if (item[column] > baseThreshold && item[column] <= topThreshold && item[columnB] > baseThresholdB && item[columnB] <= topThresholdB) {
        return { ...item, [cohortColName]: true };
      } else {
        return { ...item, [cohortColName]: false };
      }
    });
}


/**
 * Creates a new array of objects by mapping over the given data array and adding a new property to each object.
 * The new property is determined by checking if the value of the specified column in each object includes any of the values in the valueList array.
 *
 * @param {Array} data - The array of objects to be mapped over.
 * @param {string} column - The name of the column to check for inclusion of values.
 * @param {string} cohortColName - The name of the new property to be added to each object.
 * @param {Array} valueList - The array of values to check for inclusion in the column value.
 * @returns {Array} - A new array of objects with the added property indicating if the column value includes any of the values in the valueList array.
 */
function createCohortStringListPossibleValues(data, column, cohortColName, valueList) {
    return data.map((item) => {
        const columnValue = item[column];
        const isSubstring = valueList.some((value) => columnValue.includes(value));
        return { ...item, [cohortColName]: isSubstring };
    });
}

/**
 * Creates a new cohort key in the given data array of objects that is based on 
 * whether at least one of two specified columns is true.
 *
 * @param {Array} data - The array of data objects.
 * @param {string} column1 - The name of the first column.
 * @param {string} column2 - The name of the second column.
 * @param {string} cohortColName - The name of the new cohort column to be created.
 * @returns {Array} - The modified data array with the new cohort column added.
 */
function createCohortIfEitherColumnIsTrue(data, column1, column2, cohortColName) {
        return data.map((item) => {
            if (item[column1] || item[column2]) {
                return { ...item, [cohortColName]: true };
            } else {
                return { ...item, [cohortColName]: false };
            }
        });
}


/**
 * Creates cohort columns based on the provided repositories and function list. 
 * The arguments are typically sourced from the constant jsonThatDescribesCohortsToCreate and this function 
 * is called by  the repos_cohort_processed_BaseCohorts function. 
 *
 * @param {Array} repos - The array of repositories.
 * @param {Array} functionList - The array of function objects containing the function name and arguments.
 * @returns {Array} - The modified array of repositories after applying the cohort columns.
 */
function createCohortColumns(repos, functionList) {
    let modifiedRepos = [...repos];
    for (const funcObj of functionList) {
        const funcName = Object.keys(funcObj)[0];
        const args = funcObj[funcName];
        switch (funcName) {
            case "addYearToRepos":
                modifiedRepos = addYearToRepos(modifiedRepos);
                break;
            case "addAgeInDaysCol":
                modifiedRepos = addAgeInDaysCol(modifiedRepos);
                break;
            case "addDaysSinceCols":
                modifiedRepos = addDaysSinceCols(modifiedRepos, ...args);
                break;
            case "parseColumnsIntoIntegersFromStrings":
                modifiedRepos = parseColumnsIntoIntegersFromStrings(modifiedRepos, args);
                break;
            case "createCohortTestForNullEmpty":
                modifiedRepos = createCohortTestForNullEmpty(modifiedRepos, ...args);
                break;
            case "createCohortNumericalCol":
                modifiedRepos = createCohortNumericalCol(modifiedRepos, ...args);
                break;
            case "createCohortNumericalColTwoTests":
                modifiedRepos = createCohortNumericalColTwoTests(modifiedRepos, ...args);
                break;
            case "createCohortStringListPossibleValues":
                modifiedRepos = createCohortStringListPossibleValues(modifiedRepos, ...args);
                break;
            case "createRatioColumn":
                modifiedRepos = createRatioColumn(modifiedRepos, ...args);
                break;
            case "createCohortIfEitherColumnIsTrue":
                modifiedRepos = createCohortIfEitherColumnIsTrue(modifiedRepos, ...args);
                break;
            default:
                break;
        }
    }
    return modifiedRepos;
}

/**
 * This constant holds a JSON type data structure that describes the cohorts to be created.
 * Each object in the array has a single key-value pair where the key is the name of the function to be called and the value is an array 
 * of arguments to be passed to the function. By calling functions in a specific order we can create key: value pairs in the data structure 
 * (aka colummns in the resulting table) that can be reused to create more complicated fields and finally cohorts. For example, "addAgeInDaysCol" 
 * is calculated and then used to calculate the "cohort_age_baby30d" cohort key/column. 
*/
export const jsonThatDescribesCohortsToCreate = [
    //// created calculated columns used in cohorts ////
    {"addYearToRepos":[]},
    {"addAgeInDaysCol":[]},
    {"addDaysSinceCols":["updated_at","daysSinceUpdated"]},
    {"parseColumnsIntoIntegersFromStrings":["commit_stats_total_commits", "commit_stats_total_committers","commit_stats_mean_commits", "commit_stats_dds"]},
    {"createRatioColumn":["stargazers_count","commit_stats_total_committers","ratioStargazersVsCommitters"]},
    {"createRatioColumn":["stargazers_count","forks_count","ratioStargazersVsForks"]},
    {"createRatioColumn":["subscribers_count","commit_stats_total_committers","ratioWatchersVsCommitters"]},
    //// sample or demo or example cohorts ////
    {"createCohortStringListPossibleValues":["full_name", "cohort_sample_fullName", ["sample","demo","example","tutorial"]]},
    {"createCohortStringListPossibleValues":["description", "cohort_sample_Description", ["sample","demo","example","tutorial"]]},
    {"createCohortIfEitherColumnIsTrue":["cohort_sample_fullName", "cohort_sample_Description", "cohort_sample"]},
  ///// NEED FUNCTION THAT RETURNS TURE IF GROUP OF KEY IS ALL FALSE
    //// committer community size cohorts ////
    // {"createCohortNumericalCol":["commit_stats_total_committers", "cohort_committers_Null", 0,0.9]},
    // {"createCohortNumericalCol":["commit_stats_total_committers", "cohort_committers_NonZero", 0.2,100000]},
    {"createCohortTestForNullEmpty":[["commit_stats_total_committers"], "cohort_committers_missingData"]},
    {"createCohortNumericalCol":["commit_stats_total_committers", "cohort_committers_1-20", 0.2,20.5]},
    {"createCohortNumericalCol":["commit_stats_total_committers", "cohort_committers_20-100", 20.5,100.5]},
    {"createCohortNumericalCol":["commit_stats_total_committers", "cohort_committers_100plus", 100.5,10000000]},
    //// age cohorts ////
    {"createCohortTestForNullEmpty":[["age_in_days"], "cohort_age_missingData"]},
    {"createCohortNumericalCol":["age_in_days", "cohort_age_baby30d", 0,30]},
    {"createCohortNumericalCol":["age_in_days", "cohort_age_toddler30to90d", 30,90]},
    {"createCohortNumericalCol":["age_in_days", "cohort_age_teen90to365d", 90,365]},
    {"createCohortNumericalCol":["age_in_days", "cohort_age_adult365to1095d", 365,1095]},
    {"createCohortNumericalCol":["age_in_days", "cohort_age_seniorMore1095d", 1095,100000000000000]},
    //// Nadia cohorts ////
  {"createCohortTestForNullEmpty":[["commit_stats_total_committers"], "cohort_Nadia_missingData"]},
  {"createCohortNumericalCol":["commit_stats_total_committers", "cohort_Nadia_mid", 6,60]},
    {"createCohortNumericalColTwoTests":["commit_stats_total_committers", "cohort_Nadia_club", 60,1000000, "ratioStargazersVsCommitters", 0,2]},
  {"createCohortNumericalColTwoTests":["commit_stats_total_committers", "cohort_Nadia_federation", 60,1000000,  "ratioStargazersVsCommitters", 2,1000000000]},
  {"createCohortNumericalColTwoTests":["commit_stats_total_committers", "cohort_Nadia_stadium", 0.2, 6, "stargazers_count", 100,100000000]},
  {"createCohortNumericalColTwoTests":["commit_stats_total_committers", "cohort_Nadia_toy", 0.2,6, "stargazers_count", 0,100]}  
]


/**
 * Creates base cohorts from the given repositories and JSON that describes the cohorts to create.
 *
 * @param {Array} repos - The repositories to create cohorts from.
 * @param {Object} jsonThatDescribesCohortsToCreate - The JSON object that describes the cohorts to create.
 * @returns {Array} - Any array of objects where each object is a repository and the key: value pairs of each object represent the created cohort columns and original columns.
 */
export function repos_cohort_processed_BaseCohorts(repos, jsonThatDescribesCohortsToCreate = jsonThatDescribesCohortsToCreate){
    return createCohortColumns(repos, jsonThatDescribesCohortsToCreate )
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////// Code in section below largely related to displaying and interacting for repository cohort data rather than data processing.  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Retrieves a list of cohort columns from the given repositories.
 * This can be used to extract names for any cohort columns while ignoring all non-cohort columns, 
 * which can be useful for visualizing just that subset of information.
 *
 * @param {Array} repos - The array of repositories.
 * @returns {Array} - The list of cohort columns.
 */
export function get_list_of_cohort_columns(repos){
    const cohortColumns = Object.keys(repos[0]).filter((col) => col.includes("cohort_"));
    return cohortColumns;
}



export function cohort_column_state(cohortColumns) {
    const state = {};
    cohortColumns.forEach((column) => {
        state[column] = "false";
    });
    return state;
}

/**
 * Retrieves an object of cohort columns from an array of repositories.
 * This can be used to generate a data stucture for creating buttons that filter repositories by cohort.
 * 
 * @param {Array} repos - An array of repositories.
 * @returns {Object} - An object containing cohort columns.
 */
export function get_object_of_cohort_columns(repos){
    const cohortColumns = Object.keys(repos[0]).filter((col) => col.includes("cohort_"));
    const columnLists = cohortColumns.map((col) => col.split("_"));
    const columnObject = {};
    for (const columnList of columnLists) {
        const key = columnList[1];
        if (columnObject[key]) {
            columnObject[key].push(columnList.join("_"));
        } else {
            columnObject[key] = [columnList.join("_")];
        }
    }
    return columnObject;
}


/**
 * Creates and appends buttons to a specified HTML element based on the provided cohort data.
 * 
 * @param {Object} repos_cohort_processed - The processed cohort data.
 * @param {Object} cohort_columns_object - The object containing cohort columns.
 * @param {Object} cohort_columns_state - The object containing the state of cohort columns.
 * @param {string} divId - The ID of the HTML element where the buttons will be appended.
 */
export function button_cohort_filter(repos_cohort_processed, cohort_columns_object, cohort_columns_state, divId) {
    const createButton = (columnName, text, backgroundColor = "#5362a1", textColor = "#ffffff") => {
        const button = document.createElement("button");
        button.className = "button-cta";
        button.id = columnName;
        button.innerText = text;
        button.style.padding = "0.5rem";
        button.style.border = "0.3rem solid black";
        button.dataset.state = "false";
        button.addEventListener("click", () => {
            button.dataset.state = button.dataset.state === "true" ? "false" : "true";
            const columnName = button.id;
            cohort_columns_state[columnName] = button.dataset.state; 
            if (button.dataset.state === "false") {
                button.style.background = "gray";
            } else {
                button.style.background = backgroundColor;
            }
        });
        if (button.dataset.state === "false") {
            button.style.background = "gray";
        } else {
            button.style.background = backgroundColor;
        }
        return button;
    }

    const createRow = (columns) => {
        const row = document.createElement("div");
        row.className = "button-row";
        columns.forEach((column) => {
            const buttonText = column.replace("cohort_", "");
            const button = createButton(column, buttonText);
            row.appendChild(button);
        });
        return row;
    }

    const divElement = document.getElementById(divId);
    for (const key in cohort_columns_object) {
        const columns = cohort_columns_object[key];
        const row = createRow(columns);
        divElement.appendChild(row);
    }

    // return cohort_columns_state;
}


/**
 * Filters an array of repositories based on the selected cohort columns.
 * 
 * @param {Array} repos - The array of repositories to filter.
 * @param {Object} cohort_columns_state - The state object representing the cohort columns.
 * @returns {Array} - The filtered array of repositories.
 */
export function filter_repos_by_cohort(repos, cohort_columns_state) {
    const selectedColumns = Object.keys(cohort_columns_state).filter((column) => cohort_columns_state[column] === 'true');
    const filtered_repos = repos.filter((repo) => {
        return selectedColumns.every((column) => repo[column] === true);
    });
    console.log("selectedColumns = ", selectedColumns, "filtered_repos = ", filtered_repos);

    const preElement = document.getElementById("test-2");
    preElement.innerHTML = JSON.stringify(filtered_repos.length, null, 2);
    if(filtered_repos.length < 10){
        const preElement2 = document.getElementById("test-3");
        preElement2.innerHTML = JSON.stringify(filtered_repos, null, 2);
    }
    else {
        const preElement2 = document.getElementById("test-3");
        preElement2.innerHTML = JSON.stringify("too long", null, 2);
    }    
    return filtered_repos;
}


/**
 * Adds a filter button to the specified HTML element that filters repositories based on the selected cohort columns.
 * 
 * @param {Array} repos - The array of repositories.
 * @param {Object} cohort_columns_state - The state object representing the cohort columns.
 */
export function addFilterButton(repos, cohort_columns_state) {
    const button = document.createElement("button");
    button.innerText = "Filter Repos";
    button.addEventListener("click", () => {
        filter_repos_by_cohort(repos, cohort_columns_state);
    });
    const divElement = document.getElementById("button-container");
    divElement.appendChild(button);
}


function modifyEmptyValues(data) {
    return data.map((item) => {
        for (const key in item) {
            if (item[key] === "") {
                item[key] = " ";
            }
        }
        return item;
    });
}

function takeOutAllKeysExcept(arrayOfKeys){
    return function(data){
        return data.map((item) => {
            const newItem = {};
            for (const key in item) {
                if (arrayOfKeys.includes(key)) {
                    newItem[key] = item[key];
                }
            }
            return newItem;
        });
    }
}

function flattenJSON(data){
    const flattenObject = (obj, prefix = '_') => {
        const flattened = {};
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                const nestedKeys = flattenObject(obj[key], `${prefix}${key}_`);
                Object.assign(flattened, nestedKeys);
            } else {
                const newKey = key.replace(prefix, '');
                flattened[newKey] = obj[key];
            }
        }
        return flattened;
    };

    return data.map((item) => {
        return flattenObject(item);
    });
}

function takeOffPrefix(data){
    return data.map((item) => {
        const modifiedItem = {};
        for (const key in item) {
            const modifiedKey = key.replace("_", "");
            modifiedItem[modifiedKey] = typeof item[key] === 'string' ? item[key].replace("_", "") : item[key];
        }
        return modifiedItem;
    });
}


/**
 * Counts the cohort group coverage in the given data array based on the provided cohort group array.
 * 
 * @param {Array} data - The data array to be processed.
 * @param {Array} cohortGroupArray - The array of cohort group substrings to be checked.
 * @returns {Array} - The modified data array with additional properties indicating the true values in each cohort group.
 */
export function countsCohortGroup(data, cohortGroupArray){
    const numberOfCohortGroups = cohortGroupArray.length
    const modifiedData = data.map((item) => {
        const trueValues = {};
        for (const key in item) {
            var numberOfCohortGroupsCovered = 0;
            for (const substring of cohortGroupArray) {
                if (key.includes(substring) && item[key] === true) {
                    trueValues[`${substring}_trueValueInGroup`] = key;
                    numberOfCohortGroupsCovered += 1;
                    if(  numberOfCohortGroupsCovered === numberOfCohortGroups){
                        break;
                    }    
                }
            }
        }
        return Object.assign({}, item, trueValues);
    });
    return modifiedData;
}