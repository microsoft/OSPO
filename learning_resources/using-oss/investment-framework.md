# Teaching open source risk and investment - a framework :pencil2:

While the term ‘funding open source’ captures the overarching conversation around sustainability, the framework (below) uses the term ‘investment’ to break down and teach how dollars can translate to impact; which in turn makes it easier for people to advocate for and build a business case for those dollars. There’s no one or right pathway and while we’re learning here too.

## Who is this framework for?

This framework is for anyone: researchers, businesses, non-profits, program/project managers, communities or others who want to get better at understanding how to support the continuity of their dependencies using industry-validated metrics. 

This framework is a teaching tool, a conversation starter, a way to plan, to set goals, and to measure but is not intended as a solutions-pitch. We hope that folks will share their experiences and contribute to the evolution. Paired with the [GitHub funding toolkit](https://github.com/sboysel/open-source-funding-toolkit), tracking investment and impact over time can be helpful for long-term discussions.

## When to use this framework

This framework can be used as part of engineering training, research, product workflows, in business planning, or for anyone just looking to build capabilities around how they evaluate and mitigate risk in their dependencies.

## Framework components :microscope:

Visualized using mermaid.js, components are described below.  Remember, each is a point for conversation, decision making, action and measurement.

```mermaid

flowchart LR

  classDef question-node fill:#000,color:#fff,stroke-width:3px,font-size:60px;
  classDef team-node fill:#fff,color:#000,stroke-width:3px,font-size:60px;
  classDef rubric  fill:#fff,stroke:#000,stroke-width:3px,font-size:50px;
  classDef program  fill:#fff,stroke:#000,stroke-width:3px,font-size:50px;
  classDef investment  fill:#fff,stroke:#000,stroke-width:3px,font-size:50px;
  classDef investment-option  fill:#fff,stroke:#000,stroke-width:3px,font-size:50px;
  classDef your-budget  fill:##5DE2E7,stroke:#000,stroke-width:3px,font-size:50px;
  classDef stop-using  fill:#fff,stroke:#000,stroke-width:3px,font-size:50px;

  motivation{"`**Motivation**`"}:::question-node  -- what's top of mind (or happening) for you right now?
  motivation-->bug-fixes("`**Bug fixes/feature work**`")-->rubric
  motivation-->security("`**Security**`")-->rubric
  motivation-->project-health("`**Project health**`")-->rubric
  motivation-->innovation("`**Advance innovation**`")-->rubric

  %% Rubric/Metrics 
  rubric{"`**Rubric/Metric**`"}:::question-node  -- how do you want to measure that?
  rubric-->maintainer-capacity-risk("`**Maintainer capacity risk**`"):::rubric-->investment-options
  rubric-->security-risk-a("`**Security risk** - response time`"):::rubric-->investment-options
  rubric-->security-risk-c("`**Open SSF Scorecard** - overall score`"):::rubric-->investment-options
  rubric-->security-risk-b("`**Security risk** - deprecated`"):::rubric-->investment-options
  rubric-->innovation-risk("`**Innovation risk** - lack of growth/new contributors`"):::rubric-->investment-options
  rubric-->ecosystem-need("`**Moderation and safety**`"):::rubric-->investment-options
  rubric-->ecosystem-citizenship("`**Ecosystem citizenship**`"):::rubric-->investment-options


  %% Investment Options
  investment-options{"`**Select an investment type**`"}:::question-node  -- how can you move forward through investment or action?

    %% Funding
    investment-options-->funding("`**Sponsorship/funding - financial support**`"):::investment -- Many ways to turn dollars into impact, each with different impact, think short and long term with your answer
       funding-->maintainer("`**Direct to a maintainer**`"):::investment-option
                maintainer-->general-foss-fund("`Company FOSS Fund Nomination`"):::program
        funding-->community("`**Community effort**`"):::investment-option
                community-->general-foss-fund-->funding-action
                community-->diy-foss-fund("`DIY FOSS Fund`"):::program-->funding-action
                community-->diy-foss-fund-->funding-action
        funding-->project-governance("`**Project** - as directed by governance`"):::investment-option
                project-governance-->general-foss-fund-->funding-action
                project-governance-->diy-foss-fund-->funding-action
                project-governance-->team-budget(("`**Your team/org budget**`")):::team-node-->funding-action
        funding-->foundation("`**Foundation**`"):::investment-option
                foundation-->team-budget-->funding-action{"`**Investment milestone (measure again)**`"}:::question-node

   investment-options-->stop-using("`**Stop using**`"):::stop-using -- Stop, but stop how?
                        stop-using-->resourced-fork:::investment-option
                        stop-using-->different-package:::investment-option

    %% Event Support
   investment-options-->event("`**Event support**`"):::investment -- consider if impact is for a person, ecosystem, project or intersection
        event-->event-sponsorship("`**Event sponsorship**`"):::investment-option
                 event-sponsorship-->team-budget-->funding-action   
        event-->speaker-attendee("`**Speaker/attendee support**`"):::investment-option
                speaker-attendee-->team-budget-->funding-action

    %% Employee Time    
    investment-options-->engineering-time("`**Employee time for contribution**`"):::investment -- is this one time, time-bound, or enduringm- lots of ways to invest in events? 
                 engineering-time-->time-commitment("`**FTE/Half time/Casual**`"):::investment-option
                                    time-commitment-->funding-action

  %% Support contract    
    investment-options-->support-contract("`**Support agreement**`"):::investment -- to get something done, or gain commitment over time this can help
                 support-contract-->company-procurement("`**Company procurement process**`"):::investment-option
                                    company-procurement-->funding-action

    %% Complimentary product or service 
    investment-options-->complimentary-offering("`**Complimentary product or service** `"):::investment 
            complimentary-offering-->azure-credits["`**Azure credits for OSS** `"]:::investment-option
                                     azure-credits-->funding-action
            complimentary-offering-->offering-other["`**Other** `"]:::investment-option
                                

  %% Audit
  investment-options-->audit("`**Assessment and/or supplementary support**`"):::investment -- it makes sense to do a deep-dive/assessment with an existing program, which one?
        audit-->audit-focus{"`**Focus of support?**`"}:::question-node
                audit-focus-->security-audit("`**Security**`"):::investment-option
                        security-audit-->alpha-omega("`**Alpha Omega Nomination**`"):::program
                        security-audit-->github-ossfund("`**GitHub Secure OSS Fund Nomination**`"):::program
                audit-focus-->governance("`**Governance** `"):::investment-option
                     governance-->Related-foundation-funding:::program-->team-budget-->funding-action

funding-action-->rubric
  linkStyle default stroke:#000,stroke-width:5px,font-size:20px
````
From left-to-right the framework consists of:

### Step #1 – What brings you here? (Motivation) :rocket:
Usually the journey starts with a problem to solve, an 'ask' from a project, or observation from someone who works directly with that project: a limitation in ability to get work done (bugs fixed, features fixed) or there's some measure of proactive action that needs to happen on behalf of security (for example).  All efforts start at the beginning, and understanding and isolating motivations (even if there are a few) will help a lot in figuring out the next steps.

It's really important, that this feel like a 'learn by doing' exercise, and not journey you start with all the answers.  

> Motivation simply means: what's brought you here today? What do you want to be able to say you've accomplished at the end of this exercise?

Some example motivations:

1. **Security:**  _"It seems that security updates are being left for week at a time before update/or OpenSSF Scorecard value is decreasing."_
2. **Project health:** _"There have been an increasing number of hostile comments directed at maintainers, and other contributors, I think this dependency may benefit governance, moderation improvements to address this"_
3. **Innovation:** _"There seems to be fewer and fewer contributors to this critical dependency, and even less from ecosystems we want to collaborate with."_
4. **Bugfixes /feature needs:** _"There's a bug, or issue that's critical to our product, which we don't understand how to fix, but the maintainer is struggling to keep up"_
5. **Abandoned**:_ _"a dependency seems inactive, has a bunch of open issues and PRs, I am not sure what to do."_
_
### Step #2 – Ask Good Questions (Metrics) :question:

To evaluate sustainability risks, we must ask good questions with measurable outcomes. [CHAOSS](https://chaoss.community/) is a great resource for metrics for this purpose, highlighting critical factors such as single maintainer (absence factor metric), response times to security updates, project responsiveness (responsiveness metric), or Open SSF Scorecard.

The framework currently focuses on these and other critical metrics as they relate to security and are described as rubrics grading purposes. For you/your company, start with any rubric that matters to you, agree on a pass/fail grade based on acceptable risk for your business.  Before you get started, reading this [CHAOSS practitioner's guide to interpreting metrics](https://chaoss.community/practitioner-guide-introduction/) can be really helpful to understand basics of things like data-collection and evaluation of metric outputs.

- **[Capacity Risk](https://chaoss.community/kb/metric-contributor-absence-factor/):** The impact of having a single maintainer for a highly used project, affecting everything from security to project sustainability.  This CHAOSS metric doesn't specifically focus on the maintainer, but rather indicators of high dependency on fewer contributors (which may or may not be maintainers). [Release frequency](https://chaoss.community/kb/metric-release-frequency/) can also be an indicator of capacity.
- **[Project Responsiveness Risk](https://chaoss.community/practitioner-guide-responsiveness/):** Increasing PR merge times critical path bug fixes (etc.). Looking specifically at security issue response time vs. ‘all responses can help zoom in on security-specific risk. CHAOSS has a great practitioner guide to work on refining your focus.
- **[Open SSF Scorecard](https://openssf.org/projects/scorecard/#:~:text=OpenSSF%20Scorecard%20assesses%20open%20source%20projects%20for%20security,of%20critical%20projects%20that%20the%20community%20depends%20on.):** Collection of security scores.
- **Deprecated:** Not active, renamed, abandoned.

Beyond immediate risks, important sustainability categories include:

- **[Moderation and Safety](https://chaoss.community/kb/metrics-model-safety/):** Issues like lack of code of conduct enforcement and unaddressed spamming. Safety is sustainability and sustainability risk we don’t talk about enough. One signal of failing community health, of which lack of safety can be a source, is the '[Inactive Contributor](https://chaoss.community/kb/metric-inactive-contributors/)' metric.
- **[New Contributor Growth](https://chaoss.community/kb/metric-new-contributors/):** If you are particularly invested in the success of a dependency, community growth in key markets or ecosystems is important for innovation.
- **Demonstrating Commitment to the Ecosystem:** Visibility as a supporter and sustainer of a project or ecosystem – suitable for good scores too!

### Step #3 – Evaluate ways of investing for benefit of improving risk or addressing need :star:

Depending on what you've measured for, there may be several ways to explore improvements strategies organized under these categories

#### Direct funding and sponsorship
This can be one-time or ongoing through something like GitHub Sponsors.  Some projects have different requirements for how they accept funding, including through fiscal sponsor.

- **Direct to a project or maintainer:** According to the project governance
- **Support of a community effort:** Often communities are on it! There are things like security/moderation working groups who need support, investment and partnership. It really depends on the project how this work to direct funds to specific efforts. Some projects have clear pathways to fund community initiatives, others (especially if they are new) may not yet.  
- **Direct to a foundation or related effort:** Supporting an foundation, for ecosystem or specific impact (like security) can often have magnified impact.

#### Support contract
Sometimes an agreement reached either through existing support tiers, membership models or otherwise to respond to a specific request, or types of request as part of a contract. This can be similar to other procurement agreements, and in some situations, may be required to follow other existing procurement processes and policies.

- **Specific to a problem or feature:** Timebound for a specific outcome, which could include advancing security, or addressing an open issue.
- **Ongoing:** as a part of business continuity.

#### Event Support
Events are always in need of great speakers, new ideas, and of course sponsorship.  It's a great way to support an ecosystem, and raise up emerging leaders and build relationships.

- **Event sponsorship:** for all the reasons listed in the marketing. 
- **Sponsor a community member's talk :** for established leadership programs with budget, contributing funds for speakers to attend and talk about a specific technology can do a lot for a project's trajectory.
- **Employee speaker :** sending employees who are expert in a project/language to speak is a great way to invest in a project community.

#### Employee time
It was interesting to see in the latest report on investing in open source from the Linux Foundation, that a huge amount of investment in the open source ecosystem comes from [employee contribution](https://www.linuxfoundation.org/research/open-source-funding-2024). Directly contributing to a project is a great way to invest, and provides a way to stay involved in decisions, while building relationships.

- **Casual contribution :** build contribution into your engineering workflow.
- **Regular commitment of time:** this is especially helpful if you want to take on maintainer-type contribution, which requires responsiveness.  
- **FTE role:** lots of folks work as FTE on open source, the reasons span all motivations.

#### Free/Complimentary product or service
Providing free licenses, or things like [Azure Credits for open source](https://opensource.microsoft.com/blog/2021/09/28/announcing-azure-credits-for-open-source-projects/#:~:text=This%20program%20grants%20Azure%20credits%20to%20open%20source,Source%20Initiative%20%28OSI%29-approved%20license%20is%20eligible%20to%20apply.) are away to help a project reduce the cost of operations.  Very project-dependant.

#### Stop using
Not technically an investment, but for some risk, like using deprecated projects it’s best to find alternative options, and that’s another business decision (build in-house, find another solution etc). This can include forking the project and maintaining that fork for others, which is both an investment in your dependency and the ecosystem.  See 'Employee time' section to ensure that you have the appropriate resources and check out this resource on [strategically setting goals for an open project](https://github.com/microsoft/OSPO/blob/main/learning_resources/strategy/releasing-oss-strategy.md).

#### Assessment/supplemental support
Sometimes the help that's needed, isn't clear - perhaps a project needs help with security, perhaps they just need someone expert support on a topic like governance. Efforts like [Alpha Omega](https://alpha-omega.dev/grants/how-to-apply/) or [GitHub Secure OSS Fund](https://resources.github.com/github-secure-open-source-fund/) may also be opportunities to explore and/or support in general. 

#### Funding Sources and Partnerships
Projects, foundations, and initiatives like FOSS Fund and Alpha Omega have their own budgets and evaluation criteria to indicate their processes take over after nomination.

For new investment, in most companies & organizations this requires building a business case to leverage or generate budget. The good news is by following the framework you are much more likely to have compelling data and insights to do just that. Beyond language, **partnerships for investment can be key**, and the role of an OSPO can be to help surface data that helps build coalitions and partnerships for investment.  Think nearby partnerships (other products/service using your dependencies) and broader in the ecosystem (other companies, and organizations). Partnerships can magnify impact and avoid duplication of effort.

### Step #4 Measuring Impact Over Time :straight_ruler:

This framework is a cycle – there is no start and end. Set up milestones and monitor progress regularly. Having direct dialogue with maintainers, projects and being a part of communities is even better. We encourage this always.

[GitHub has an awesome new toolkit for organizing and tracking investment](https://github.com/sboysel/open-source-funding-toolkit). This can help with impact tracking but also help tell a story of ‘funding open source’ for your company which is a whole other challenge. There’s also a CHAOSS working group for the purpose of collaborating on ‘investment impact’.

### Remember :boat:
Unless agreed-up in something like a service-agreement, no investment in open source equates to obligation of that project to treat you/your company differently than any other member of the community. Lift all boats.

### On Data

For many metrics, data sources and tooling exists, including using CHAOSS tools like [8Knot](https://eightknot.osci.io/chaoss), [GitHub dependency graph](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-the-dependency-graph) and ecosystem.ms. At Microsoft we regularly ingest GitHub data about our dependencies, which makes querying a little easier at scale. We're actively working to get better at visualizing that risk for users and will try to share depth of dependencies - more on that soon.  Please consider [https://github.com/microsoft/OSPO/blob/main/bulk-targeted-sponsorship/README.md](this resource to learn more about how we look at risk in our dependencies for investment).
