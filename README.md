# Microsoft OSPO
A place where we'll share various resources we've created to help our team and others learn about open source and how to work in an open source way.  Currently this includes learning resources, survey questions, and other resources.  We hope you find these useful and welcome contributions to make them better.

## Content by directory

### Learning Resources

Checklists and reusable learning content that may of interest to other OSPOs.

### Surveys

Examples survey questions the Microsoft OSPO has used.

### Repository cohorts

The repository cohorts directory holds an example of the repository cohorts concept. 
Some of the content in this directory is associated with a 2024 Open Source Summit talk.
The `framework` directory within the `repository_cohorts directory` holds an Observable Framework project 
that builds a static GitHub pages page that should be viewable [here](https://microsoft.github.io/OSPO/repository_cohorts/framework/dist/)
. It implements the repository cohorts concept for a fixed export of Microsoft public repository metadata.

### Instruction files for surfacing dependency risk information

In the `.github/instructions` folder there are instruction files that are consumed by GitHub Copilot.

These dependency risk instruction files are designed to provide detailed guidance for Copilot, when in agent mode, on
where to get information and how to assess the risks of using a third-party package or library in software development,
as well as how to format that information into a standardized dependency risk report in the chat window that is
easily scannable and understandable by developers such that they make better informed decisions about dependency
consumption.

There is a more extensive README on the dependency risk instruction files at `.github/instructions/dependency-risk-README.md` that contains
information on how the instruction files work, what problems they solve, and [shows an example](.github/instructions/dependency-risk-README.md#example-dependency-risk-report) of what a dependency risk report that appears
in the GitHub Copilot chat window looks like.

This approach is at prototype stage. Please leave feedback in issues in this repository. We can imagine you might
have the `dependency-risk-company-level.instructions.md` file point at your company's MCP server for internal information
on dependencies or third party MCP tools that provide additional dependency risk information.

#### Reusable patterns of these instruction files

These instructions are split into more than one file, so some of the instructions can live in an external repository
or MCP (Model Context Protocol) server. You might want to use that type of approach anytime you have parts of the
instructions that you want owned by a centralized team, like an OSPO or platform engineering team, and parts owned by
individual repositories but that all goes to build the same GitHub Copilot experience driven by instruction files.
The alternative is having to manage instruction files as individual files, that get stale, across hundreds or thousands
of repositories via pull requests. Note that this approach also requires usage of wording in the base instruction file that asks
the user for permission to use instructions in the external location.

## LICENSE

[Creative Commons Attribution 4.0 International](LICENSE)

## Contributing

This project welcomes contributions and suggestions. Individual top-level directories may have further guidance in their READMEs.

Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit <https://cla.opensource.microsoft.com>.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
