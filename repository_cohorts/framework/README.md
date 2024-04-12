# Repository Cohorts

The content of this directory holds a front-end only website built with 
the [Observable Framework](https://observablehq.com/framework) library. 
It is intended as demonstration of using repository cohorts concept to turn 
repository metadata into more easily undestandable groups or 'cohorts' of repositories. 

Relevant to the top directory of this repository, 
the data processing code is in `repository_cohorts/framework/docs/components/cohorts.js`. 
Visualization code is in the `repository_cohorts/framework/docs/index.md` file.

This directory builds a static page for GitHub pages
that should be viewable at https://microsoft.github.io/OSPO/repository_cohorts/framework/dist/
or https://aka.ms/RepositoryCohorts/Demo/Microsoft 

## Contributing

The code in the files mentioned above is intended to be reused via example, not necessarily directly imported. 

Internally, we largely due this analysis using the 
[KQL (Kusto Query Language)](https://learn.microsoft.com/en-us/azure/data-explorer/kql-learning-resources). 
However, we are demoing repository cohorts here in JavaScript to make it more reusable. 

If you have a cohort that you use that is not in this code, but could be easily contributed if added to the JSON 
consumed by the `repos_cohort_processed_BaseCohorts` function in `cohorts.js`, then please submit a pull request.
We would love to see what others are finding is useful cohorts to examine. 

## Getting started

This is an [Observable Framework](https://observablehq.com/framework) project. To start the local preview server, run:

```
npm install
```

Then 

```
npm run dev
```

Then visit <http://localhost:3000> to preview your project.

For more, see <https://observablehq.com/framework/getting-started>.

## Project structure

```ini
.
├─ docs
│  ├─ components
│  │  └─ cohorts.js           # an importable module used to calculate repository cohorts
│  ├─ data
│  │  ├─ microsoft_repos_public_20240319.csv       # a data file with a fixed export of Microsoft repository metadata
│  └─ index.md                 # the home page for repository cohorts
├─ .gitignore
├─ observablehq.config.js      # the project config file
├─ package.json                 # defines our dependencies
└─ README.md
```

**`docs`** - This is the “source root” — where your source files live. Pages go here. Each page is a Markdown file. Observable Framework uses [file-based routing](https://observablehq.com/framework/routing), which means that the name of the file controls where the page is served. You can create as many pages as you like. Use folders to organize your pages.

**`docs/index.md`** - This is the home page for your site. You can have as many additional pages as you’d like, but you should always have a home page, too.

**`docs/data`** - You can put [data loaders](https://observablehq.com/framework/loaders) or static data files anywhere in your source root, but we recommend putting them here.

**`docs/components`** - You can put shared [JavaScript modules](https://observablehq.com/framework/javascript/imports) anywhere in your source root, but we recommend putting them here. This helps you pull code out of Markdown files and into JavaScript modules, making it easier to reuse code across pages, write tests and run linters, and even share code with vanilla web applications.

**`observablehq.config.js`** - This is the [project configuration](https://observablehq.com/framework/config) file, such as the pages and sections in the sidebar navigation, and the project’s title.

## Command reference

| Command           | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `npm install`            | Install or reinstall dependencies                        |
| `npm run dev`        | Start local preview server                               |
| `npm run build`      | Build your static site, generating `./dist`              |
| `npm run deploy`     | Deploy your project to Observable                        |
| `npm run clean`      | Clear the local data loader cache                        |
| `npm run observable` | Run commands like `observable help`                      |
