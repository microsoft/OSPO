# An approach for targeted bulk sponsorship of open source dependencies
## A pseudo code explanation of how to programmatically identify a specific sample of an enterprise's dependencies for sponsorship

This page gives a high level, pseudo code description of how Microsoft selected some of the projects in the June, 2024 FOSS Fund round #30. As the actual approach and code used is very specific to internal Microsoft systems, what is described here is an outline designed for others who might want to leverage a similar approach. 

Please also read these for context: 
- Microsoft Open Source blog post describing [5 things we learned from sponsoring a sampling of our open source dependencies](https://cloudblogs.microsoft.com/opensource/)
- FOSSFUND repository [README](https://github.com/microsoft/foss-fund)
- [Ecosystems page](https://opensource.microsoft.com/ecosystem/) on opensource.microsoft.com that describes FOSSFUND and other ways Microsoft supports the open source community including 
Foundations, Azure Credits, etc.

## Targeted bulk sponsorship
### _An alternative to voting-based sponsorship or universal-thin-spread sponsorship_

Traditionally, Microsoft's [FOSSFUND](https://github.com/microsoft/foss-fund) program has used
a method of selecting open source for funding driven by employee recommendations and employee 
voting. Employees who make upstream contributions to open source projects earn the right to
vote on what projects get funded.
This approach biases sponsorship to well known open source projects. 
Another style of sponsorship is a univeral thin spread approach.
All dependencies that have signed up for a particular funding
platform are sponsored at the same level no matter their differences.

As part of experimenting through different approaches, Microsoft trialed a data-driven
approach in June of 2024 that leveraged the availability of metadata on 
packages and their source repositories combined with metadata on the usage of 
dependencies across our many tens of thousands internal repositories.
Our hypothesis was this targeted bulk approach would enable sponsorships to target
open source projects that were less well known while also being
highly impactful as judged by public download stats, downstream dependent package counts,
and Microsoft internal usage. The final list appears to support these initial hypotheses
as there are many packages never previously submitted for FOSSFUND.
Additionally, while past FOSS FUND awardees have almost always been organizations,
this round saw many individuals who develop an impactful open source project
get sponsored. 

This document attempts to summarize our approach in very broad terms and describe
both what we did and more basic approaches others might be able to take who lack the
benefits of our internal inventory of engineering systems.

## Dependency Inventory
### _To target dependencies at scale, you need a full listing of which ones you use_

Knowing your dependency usage counts is a necessary step for targeted sponsorship. 

### Advanced: inventory
Microsoft has a centralized team that is responsible for collecting
engineering system metadata. They provide various tables in 
[Azure Data Explorer](https://azure.microsoft.com/en-us/products/data-explorer/)
that the Open Source Programs Office has leveraged to get repository counts 
per unique dependency. This capability allows us to not just count dependency usage,
but also analyze usage by public vs. internal repositories as well as other dimensions.


### Basic: inventory

Even if you do not have the benefit of a centralized team already collecting this data,
there are options for getting a mostly complete view without too much effort. 
Microsoft saw a high degree of overlap between the dependencies of our public-facing
repositories in GitHub and our internal repositories. 
If we had only used data from public repositories via GitHub's SBOM export API,
our final sampling for sponsorship would not have been too different.

#### GitHub SBOM 

As seen in the GitHub 
[blog post announcing Self-service SBOMs](https://github.blog/2023-03-28-introducing-self-service-sboms/), 
you can manually go to the insights tab of any public-facing GitHub repository and download a
SBOM (Software Bill of Materials) JSON file that contains information on all the dependencies of
that repository. This is available for every public GitHub repository whether you own it or not.

The example SBOM JSON shown below comes from clicking the "Export SBOM" button
on this page: https://github.com/microsoft/opensource.microsoft.com/network/dependencies
In the JSON, the value of the key `packages` is an array that contains a list of objects. 
Each object is metadata that describes a dependency. 
In the example below, items 5 and 6 are expanded so you can more easily read the contents. 
Item 5 describes the ruby dependency rb-inotify.

_**Example SBOM data for a [single repository](https://github.com/microsoft/opensource.microsoft.com/network/dependencies)**_
```
Object {
  SPDXID: "SPDXRef-DOCUMENT"
  spdxVersion: "SPDX-2.3"
  creationInfo: Object {created: "2024-06-18T23:20:24Z", creators: Array(1)}
  name: "com.github.microsoft/opensource.microsoft.com"
  dataLicense: "CC0-1.0"
  documentDescribes: Array(1) ["SPDXRef-com.github.microsoft-opensource.microsoft.com"]
  documentNamespace: "https://github.com/microsoft/opensource.microsoft.com/dependency_graph/sbom-fd42be705acc1dad"
  packages: Array(820) [
  0: Object {SPDXID: "SPDXRef-com.github.microsoft-opensource.microsoft.com", name: "com.github.microsoft/opensource.microsoft.com", versionInfo: "", downloadLocation: "git+https://github.com/microsoft/opensource.microsoft.com", licenseDeclared: "MIT", filesAnalyzed: false, supplier: "NOASSERTION", externalRefs: Array(1)}
  1: Object {SPDXID: "SPDXRef-rubygems-i18n-1.12.0", name: "rubygems:i18n", versionInfo: "1.12.0", downloadLocation: "NOASSERTION", filesAnalyzed: false, licenseConcluded: "MIT", supplier: "NOASSERTION", externalRefs: Array(1)}
  2: Object {SPDXID: "SPDXRef-rubygems-safe-yaml-1.0.5", name: "rubygems:safe_yaml", versionInfo: "1.0.5", downloadLocation: "NOASSERTION", filesAnalyzed: false, licenseConcluded: "MIT", supplier: "NOASSERTION", externalRefs: Array(1)}
  3: Object {SPDXID: "SPDXRef-rubygems-addressable-2.8.1", name: "rubygems:addressable", versionInfo: "2.8.1", downloadLocation: "NOASSERTION", filesAnalyzed: false, licenseConcluded: "Apache-2.0", supplier: "NOASSERTION", externalRefs: Array(1)}
  4: Object {SPDXID: "SPDXRef-rubygems-rb-fsevent-0.10.4", name: "rubygems:rb-fsevent", versionInfo: "0.10.4", downloadLocation: "NOASSERTION", filesAnalyzed: false, licenseConcluded: "MIT", supplier: "NOASSERTION", externalRefs: Array(1)}
  5: Object {
  SPDXID: "SPDXRef-rubygems-rb-inotify-0.10.1"
  name: "rubygems:rb-inotify"
  versionInfo: "0.10.1"
  downloadLocation: "NOASSERTION"
  filesAnalyzed: false
  licenseConcluded: "MIT"
  supplier: "NOASSERTION"
  externalRefs: Array(1) [Object]
}
  6: Object {
  SPDXID: "SPDXRef-rubygems-concurrent-ruby-1.1.10"
  name: "rubygems:concurrent-ruby"
  versionInfo: "1.1.10"
  downloadLocation: "NOASSERTION"
  filesAnalyzed: false
  licenseConcluded: "MIT"
  supplier: "NOASSERTION"
  externalRefs: Array(1) [Object]
}
  7: Object {SPDXID: "SPDXRef-rubygems-eventmachine-1.2.7", name: "rubygems:eventmachine", versionInfo: "1.2.7", downloadLocation: "NOASSERTION", filesAnalyzed: false, licenseConcluded: "Ruby OR (GPL-2.0 AND GPL-2.0-only) OR (GPL-2.0 AND Ruby) OR (GPL-2.0-only AND Ruby)", supplier: "NOASSERTION", externalRefs: Array(1)}
  8: Object {SPDXID: "SPDXRef-rubygems-kramdown-parser-gfm-1.1.0", name: "rubygems:kramdown-parser-gfm", versionInfo: "1.1.0", downloadLocation: "NOASSERTION", filesAnalyzed: false, licenseConcluded: "MIT", supplier: "NOASSERTION", externalRefs: Array(1)}
  9: Object {SPDXID: "SPDXRef-rubygems-listen-3.7.1", name: "rubygems:listen", versionInfo: "3.7.1", downloadLocation: "NOASSERTION", filesAnalyzed: false, licenseConcluded: "MIT", supplier: "NOASSERTION", externalRefs: Array(1)}
  10: Object {SPDXID: "SPDXRef-rubygems-racc-1.6.2", name: "rubygems:racc", versionInfo: "1.6.2", downloadLocation: "NOASSERTION", filesAnalyzed: false, licenseConcluded: "BSD-2-Clause OR (BSD-2-Clause AND Ruby)", supplier: "NOASSERTION", externalRefs: Array(1)}
  11: Object {SPDXID: "SPDXRef-rubygems-sassc-2.4.0", name: "rubygems:sassc", versionInfo: "2.4.0", downloadLocation: "NOASSERTION", filesAnalyzed: false, licenseConcluded: "MIT", supplier: "NOASSERTION", externalRefs: Array(1)}
  12: Object {SPDXID: "SPDXRef-rubygems-public-suffix-4.0.6", name: "rubygems:public_suffix", versionInfo: "4.0.6", downloadLocation: "NOASSERTION", filesAnalyzed: false, licenseConcluded: "MIT", supplier: "NOASSERTION", externalRefs: Array(1)}
  13: Object {SPDXID: "SPDXRef-rubygems-http-parser.rb-0.6.0", name: "rubygems:http_parser.rb", versionInfo: "0.6.0", downloadLocation: "NOASSERTION", filesAnalyzed: false, licenseConcluded: "MIT", supplier: "NOASSERTION", externalRefs: Array(1)}
  14: Object {SPDXID: "SPDXRef-rubygems-nokogiri-1.14.3", name: "rubygems:nokogiri", versionInfo: "1.14.3", downloadLocation: "NOASSERTION", filesAnalyzed: false, licenseConcluded: "MIT", supplier: "NOASSERTION", externalRefs: Array(1)}
  15: Object {SPDXID: "SPDXRef-rubygems-colorator-1.1.0", name: "rubygems:colorator", versionInfo: "1.1.0", downloadLocation: "NOASSERTION", filesAnalyzed: false, licenseConcluded: "MIT", supplier: "NOASSERTION", externalRefs: Array(1)}
  16: Object {SPDXID: "SPDXRef-rubygems-em-websocket-0.5.1", name: "rubygems:em-websocket", versionInfo: "0.5.1", downloadLocation: "NOASSERTION", filesAnalyzed: false, licenseConcluded: "MIT", supplier: "NOASSERTION", externalRefs: Array(1)}
  17: Object {SPDXID: "SPDXRef-rubygems-forwardable-extended-2.6.0", name: "rubygems:forwardable-extended", versionInfo: "2.6.0", downloadLocation: "NOASSERTION", filesAnalyzed: false, licenseConcluded: "MIT", supplier: "NOASSERTION", externalRefs: Array(1)}
  18: Object {SPDXID: "SPDXRef-rubygems-pathutil-0.16.2", name: "rubygems:pathutil", versionInfo: "0.16.2", downloadLocation: "NOASSERTION", filesAnalyzed: false, licenseConcluded: "MIT", supplier: "NOASSERTION", externalRefs: Array(1)}
  19: Object {SPDXID: "SPDXRef-rubygems-terminal-table-1.8.0", name: "rubygems:terminal-table", versionInfo: "1.8.0", downloadLocation: "NOASSERTION", filesAnalyzed: false, licenseConcluded: "MIT", supplier: "NOASSERTION", externalRefs: Array(1)}
  … more
]
  relationships: Array(819) [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, …]
}
```

You can get to this same SBOM JSON by calling 
the [GitHub API SBOM endpoint](https://docs.github.com/en/rest/dependency-graph/sboms?apiVersion=2022-11-28).

The GitHub API is a way to create an inventory of dependencies across all of your repositories. As explained in the pseudo code below, you can call the 
GitHub API to get a list of all repositories in all of your organizations, and
then one by one call the SBOM API endpoint for each repository. You can then
create a data structure for how many times you see each dependency.

_**Pseudo code of how to get inventory of your enterprise's dependencies**_
```Pseudo code

dependencyInventory = {
   dependencyNameA: count,
   dependencyNameB: count
   ... 
}

for eachOrganization in listofOrganizations:
    for eachRepo in eachOrganization: 
        SBOM = call GitHubAPI(eachRepo)
        listOfDependencies = parse(SBOM)
        for eachDependency in listOfDependencies:
            addToDependencyInventory(eachDependency)

return dependencyInventory

```

## Collecting metadata that describes your dependencies
### _Metadata helps you know information about dependencies without reading_

To filter that inventory of dependencies down to those you want to sponsor, you
will need metadata information about each package and its source repository.
The alternative, already knowing about each dependency or reading through
source repositories doesn't scale to the dependency usage of even a small 
organization, let alone Microsoft. Although rates vary by language,
an organization with several hundred repositories will likely have many 
thousands of dependencies.

### Advanced: collecting metadata that describes your dependencies

For selecting which dependencies to sponsor in this round,
Microsoft looked at a number of dimensions leveraging different
data sources stored in different [Kusto tables](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/). 
The main source of this data was the 
[packages endpoint of Ecosyste.ms](https://packages.ecosyste.ms/), which provides
metadata that describes package and source repository public usage rates, 
dependency and dependent relationships, activity, etc.
We also used data from [ClearlyDefined.io](https://clearlydefined.io/)
for license information, experimented with the 
[OSSF risk API](https://riskapi.ashydesert-4ee1f08e.westus3.azurecontainerapps.io/apidocs/) protype for information on dependency dependency's average age, and integrated
internal metadata on how dependencies were used.

### Basic:  collecting metadata the describes your dependencies

A more basic approach is to just use the [packages endpoint of Ecosyste.ms](https://packages.ecosyste.ms/) alone. However, we would not recommend using the API
as the number of calls would be excessive. 
 You will unnecessarily hammer the API and it will take 
a very long time to get all the necessary data back.
Instead, we would recommend using the Ecosyste.ms packages dataset, which
has all the same content as the API. The [packages dataset](https://packages.ecosyste.ms/open-data) is a PostgreSQL database dump
that can be stood up as a PostgreSQL database or transformed into another
format. Microsoft exported the data from PostgreSQL
into Azure Data Explorer, so it could be queried together with our other data that
was already being analyzed with Kusto. 

_**For explanatory purposes only, this is a JavaScript function
that calls the Ecosyste.ms Packages API for a single dependency.**_
```JavaScript

async function call_api_js(packageType, packageName) {
    //// THE LINE BELOW CALLS THE FUNCTION BELOW.
    const packageTypeChecked = await convertPackageTypeNaming(packageType)
    const EcoSysPackages_baseURL = 'https://packages.ecosyste.ms/api/v1/registries/';
    const EcoSysPackages_endpoint = '/packages/';
    let url = `${EcoSysPackages_baseURL}${packageTypeChecked}${EcoSysPackages_endpoint}${packageName}`;
    const data = [];
    try {
      const packagesEndpointData = await fetch(url).then((response) => {
        return response.json();
      })
      return packagesEndpointData
      }
    catch (error) {
        return `Request failed with error: ${error.message}`;
    }
}
```


#### Converting package types to ecosyste.ms registries 

When working with dependency data in different systems, it is not uncommon for different systems to refer to 
different package managers using slightly different strings. This is one example of a function that 
takes a string that represents package managers and converts it into ecosyte.ms style
naming conventions. You will likely have to make something similar.

``` JavaScript
function convertPackageTypeNaming(packageType){
  const convertToEcosystems = {
        "git":"github%20actions",
        "npm": "npmjs.org",
        "pypi": "pypi.org",
        "pip": "pypi.org",
        "nuGet": "nuget.org",
        "nuget": "nuget.org",
        "cargo":"crates.io",
        "go":"proxy.golang.org",
        "Go":"proxy.golang.org",
        "Maven":"repo1.maven.org",
        "rubyGem":'rubygems.org',
        "rubygems":'rubygems.org',
        "conda":'conda-forge.org',
        "cocoapod":"cocoapod.org",
         "vcpkg":"vcpkg.io",
         "alpine":"alpine",
         "clojars":"clojars,org",
         "packagist":"packagist.org",
         "bower":"bower.io"
    } 
    if (packageType in Object.keys(convertToEcosystems)){
      return convertToEcosystems[packageType]
    }
    else {
      return packageType
    }
}
```

## Filter dependencies to select a subset for funding
### _Identifying how to have the most impact_

If you've done what has been described above, you will have a listing of 
your dependencies, information about how much you use each, and a
mapping between your dependencies and metadata that describes those dependencies.
The next step is to filter that list to target a subset of repositories that
meet your minimum qualifications and a further sorting/filtering to identify
the subset of dependencies that better match criteria you want to optimize for. 

As example, you might want to absolutely not fund anything by your own employees
and optimize for funding dependencies that see the most usage in your enterprise.
The first is a binary filter. The second sorts the list.

### Basic: filtering

A basic version of filtering would just be to look at each dependencies
source repository username and cut out anything that is an Organization owned
by you or the username of an employee. 
A basic version of sorting would be to sort by repository usage counts and then
take the top 100 or 500 in the sorted list.
The example pseudo code below shows both of these.

_**Pseudo code**_
```pseudo code

for dependencyRow in dataFrameOfDependencies
    if dependencyRow['source_repo_owner_login'] in listOfOurOrganizationsAndEmployeeUserNames
        delete dependencyRow from dataFrameOfDependencies

sort dataFrameOfDependencies by repository_usage_counts

take top 100
```

### Advanced: filtering

More advanced sorting might look not just at usage counts but also consider
if there are specific types of open source projects that have sustainability
issues where funding might help.
You might also want to target dependencies that are used by other dependencies
as those are more likely to be transitive dependencies that are less top-of-mind
for developers and therefore less likely to be recommended or win voting contests.
The metadata on package and source repositories
available in ecosyste.ms enables one to start to consider these more advanced
approaches. We will highlight below some of the Ecosyste.ms metadata fields 
that might be leveraged for advanced filtering and sorting.

#### Restrict to dependencies that meet a condition

##### [OSI](https://opensource.org/license) approved license?

 - Ecosyste.ms metadata field: `pkg['normalized_licenses']`
- _Explanation:_ You may want to flag for manual review any license(s) that are not known
to be [Open Source inititive](https://opensource.org/license) approved open source license(s). These might be projects where your enterprise has paid for a license or just extremely uncommon licenses. 


##### Funding mechanism set up and which one?

- Ecosyste.ms metadata field: `pkg['repo_metadata']['metadata']['funding']`
- Ecosyste.ms metadata field: `pkg['funding_links']`
    - These fields can list one or more sposnorable entities or platforms. 
- _Explanation:_ In addition to filtering out any dependency that doesn't have funding set up, enterprises may want to limit their funding to a single funding platform, like GitHub Sponsors, where a large number of sponsorable entities can be funded in a single invoice. Note that it is not unusual for the data in this field that can come from a [source repository's FUNDING.YML](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/displaying-a-sponsor-button-in-your-repository) to be improperly or variably formatted. You may need to write a script to parse it taking variations in formatting into account.


#####  Is source repsoitory owned by an organization or a user related to your enterprise?
- Ecosyste.ms metadata field: `pkg['repo_metadata']['owner']`
- _Explanation:_ As noted previously, there may be lists of public GitHub organizations your enterprise owns as well as lists of GitHub usernames mapped to your enterprise's employees that are valid to exclude. In this scenario, these lists would also be compared
against the sponsorable entity username identified in the funding mechanism step above.

#### Sort or group based on package metadata

##### Repository size
- Ecosyste.ms metadata field: `pkg['repo_metadata']['size']`
- _Explanation:_ Sometimes there can be reasons to want to identify source repositories that are unusually small or large for different treatment or at least manual review.

##### Recent activity?
- Ecosyste.ms metadata field: `pkg['latest_release_published_at']`
- Ecosyste.ms metadata field: `pkg['repo_metadata']['updated_at']`
- Ecosyste.ms metadata field: `pkg['repo_metadata']['created_at']`
- _Explanation:_ There may be reasons or strategy behind identifying and treating differently based on activity. Some packages will have had a new version released in the past year and others will not. Likewise, if the source repository has not seen activity in 8 years and is functionally dead, that might be reason to treat that item differently.

##### Based on commits and maintainers
- Ecosyste.ms metadata field: `pkg['repo_metadata']['commit_stats']['dds]`
- Ecosyste.ms metadata field: `pkg['maintainers']`
- _Explanation:_ There may be reasons to group or sort dependencies based on measures of 
how centralized the development of that package is to a single person. There are a 
variety of reasons to do this and approaches to doing this with different strengths and
weaknesses. The `maintainers` metadata field lists the maintainers listed for the package in the package manager, so it is not the same thing as source repository maintainers.
The `pkg['repo_metadata']['commit_stats']['dds]` metadata field is not always present.
However, when it is the DDS or 
[development distribution score](https://report.opensustain.tech/chapters/development-distribution-score.html) 
can help identify when development is concentrated in a single person.

##### Based on usage statistics
- Ecosyste.ms metadata field: `pkg['downloads']`
- Ecosyste.ms metadata field: `pkg['downloads_period']`
- Ecosyste.ms metadata field: `pkg['downloads_repos_count']`
- Ecosyste.ms metadata field: `pkg['dependent_packages_count']`
- Ecosyste.ms metadata field: `pkg['rankings']`
- _Explanation:_ The metadata fields above, or ratios of them, can given insights into
how much the package is being used and how it is being used. Packages with higher ratios
of dependent packages count vs. downloads count are more likely to be transitive
dependencies and probably less likely to be recommended or voted upon by developers.

## Conclusion

We hope this rough description of our _targeted bulk_ sponsorship of open source
is useful to others. All approaches have their strengths and
weaknesses. A major disadvantage of this style of approach is it funds a small sampling 
of all possible dependencies. 
The advantages of this approach are that it enables targeting of
less well known open source projects missed by traditional FOSS Fund approaches 
that leverage recommendations and voting, can be adjusted to target
different types of open source projects,
increases the number of projects sponsored for a similar amount of preparation
work, and enables a stronger relationship between what is sponsored and business impact. 


