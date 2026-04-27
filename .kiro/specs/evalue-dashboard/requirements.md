# Requirements Document

## Introduction

The Evalue Dashboard is the primary view of the Evalue platform — an AI-powered hackathon project analysis tool. It gives judges and organisers a single-page overview of all submitted projects for the active hackathon, surfacing key stats and letting users browse, filter, search, and open individual submissions. The dashboard fetches live data from the Evalue backend API (OpenAPI spec at `doc/spec.yaml`) and is built with Next.js (App Router, TypeScript) following the neu-brutalism visual style defined in `Evalue_project_dashboard.html`.

---

## Glossary

- **Dashboard**: The root page (`/`) of the Evalue frontend application.
- **Dashboard_Page**: The Next.js Server Component that owns the `/` route and orchestrates data fetching.
- **Topbar**: The fixed dark navigation bar at the top of every page, containing the Evalue logo and navigation links.
- **Stats_Row**: The horizontal row of four summary stat cards rendered above the project grid.
- **Stat_Card**: An individual summary card displaying a single metric (e.g. total submissions, analysed count).
- **Project_Grid**: The responsive grid of Project_Cards that displays all submissions.
- **Project_Card**: A single card representing one hackathon project submission.
- **Filter_Bar**: The toolbar containing the search input, filter pills, and the "Add project" CTA button.
- **Filter_Pill**: A selectable button that filters the Project_Grid by analysis status.
- **Analysis_Badge**: A small status indicator on a Project_Card showing whether market or code analysis has completed.
- **Add_Project_Modal**: The modal or form triggered by the "Add project" button for submitting a new project.
- **API**: The backend REST API described in `doc/spec.yaml`, base URL `http://localhost:8000/api`.
- **Project**: A hackathon submission object as defined in the API `Project` schema (`project_id`, `short_description`, `github_link`, `theme`, `is_reviewed`, `code_agent_analysis`, `market_agent_analysis`, `created_at`).
- **Neu-Brutalism**: The visual design language used throughout the app: yellow (`#FDFD96`) background, bold `2.5px` black borders, offset box-shadows (`5px 5px 0 #111`), flat pastel accent colours, and a dark topbar (`#111`).

---

## Requirements

### Requirement 1: Page Layout and Topbar

**User Story:** As a hackathon judge, I want a consistent top navigation bar on the dashboard, so that I can identify the application and navigate between sections.

#### Acceptance Criteria

1. THE Dashboard_Page SHALL render a full-viewport layout with a `#FDFD96` yellow background and the Topbar fixed at the top.
2. THE Topbar SHALL display a logo box containing the letter "E" with a `#FFDB58` background, the app name "Evalue", and a subtitle tag reading "hackathon judge panel".
3. THE Topbar SHALL display a "Dashboard" navigation button in the active state (black background, `#FDFD96` text) and a "Search" navigation button in the inactive state.
4. THE Topbar SHALL apply a `#111` background, `56px` height, and horizontal padding of `28px`.
5. WHEN the "Search" navigation button is clicked, THE Dashboard_Page SHALL navigate the user to the `/search` route.

---

### Requirement 2: Stats Row

**User Story:** As a hackathon judge, I want to see a summary of submission statistics at a glance, so that I can quickly understand the current state of the hackathon.

#### Acceptance Criteria

1. THE Stats_Row SHALL display exactly four Stat_Cards in a single horizontal row with equal column widths and a `12px` gap.
2. THE Stats_Row SHALL be positioned below the Filter_Bar and above the Project_Grid.
3. THE Stat_Card for "Total submissions" SHALL display the total count of projects returned by `GET /api/get-all` and a sub-label reading "This hackathon".
4. THE Stat_Card for "Analysed" SHALL display the count of projects where both `market_agent_analysis` and `code_agent_analysis` arrays are non-empty, a green (`#90EE90`) border and box-shadow, and a sub-label showing the percentage of total submissions that are analysed.
5. THE Stat_Card for "Pending review" SHALL display the count of projects where at least one of `market_agent_analysis` or `code_agent_analysis` is an empty array, a coral (`#FF7A5C`) border and box-shadow, and a sub-label reading "Awaiting agents".
6. THE Stat_Card for "Avg market score" SHALL display the average numeric score derived from the market analysis results across all projects, a purple (`#A388EE`) border and box-shadow, and a sub-label reading "Out of 10".
7. IF the `GET /api/get-all` request has not yet resolved, THEN THE Stats_Row SHALL render skeleton placeholder cards of the same dimensions.
8. IF the `GET /api/get-all` request returns an error, THEN THE Stats_Row SHALL display a visible error message in place of the stat values.

---

### Requirement 3: Filter Bar

**User Story:** As a hackathon judge, I want to search and filter the project list, so that I can quickly find specific submissions or focus on a subset of projects.

#### Acceptance Criteria

1. THE Filter_Bar SHALL be rendered above the Stats_Row and contain, from left to right: a search input, a group of Filter_Pills, and an "Add project" button.
2. THE Filter_Bar search input SHALL display a placeholder text of "Search submissions..." and apply a `2.5px` black border, `3px` border-radius, and a `3px 3px 0 #111` box-shadow.
3. WHEN the user types in the search input, THE Project_Grid SHALL update in real time to show only Project_Cards whose title or short description contains the entered text (case-insensitive).
4. THE Filter_Bar SHALL render four Filter_Pills labelled "All", "Analysed", "Pending", and "Reviewed".
5. WHEN a Filter_Pill is selected, THE Filter_Pill SHALL apply a black (`#111`) background with `#FDFD96` text, and THE Project_Grid SHALL display only projects matching the selected filter:
   - "All": all projects
   - "Analysed": projects where both `market_agent_analysis` and `code_agent_analysis` are non-empty
   - "Pending": projects where at least one analysis array is empty
   - "Reviewed": projects where `is_reviewed` is `true`
6. THE Filter_Bar SHALL apply only one active Filter_Pill at a time; selecting a new pill SHALL deselect the previously active one.
7. WHEN both a search query and a Filter_Pill are active, THE Project_Grid SHALL display only projects that satisfy both conditions simultaneously.
8. THE "Add project" button SHALL be styled with a coral (`#FF7A5C`) background, `2.5px` black border, and a `4px 4px 0 #111` box-shadow.
9. WHEN the "Add project" button is clicked, THE Dashboard_Page SHALL open the Add_Project_Modal.

---

### Requirement 4: Project Grid

**User Story:** As a hackathon judge, I want to browse all submitted projects in a card grid, so that I can get an overview of every submission and open the ones I want to evaluate.

#### Acceptance Criteria

1. THE Project_Grid SHALL render Project_Cards in a three-column responsive grid with a `16px` gap on viewports wider than `768px`.
2. THE Project_Grid SHALL render Project_Cards in a single-column layout on viewports `768px` wide or narrower.
3. THE Project_Grid SHALL display a section heading "All submissions" above the grid.
4. IF the filtered and searched result set is empty, THEN THE Project_Grid SHALL display a message reading "No submissions match your search." in place of the grid.
5. IF the `GET /api/get-all` request has not yet resolved, THEN THE Project_Grid SHALL render skeleton placeholder cards matching the Project_Card dimensions.
6. THE Project_Grid SHALL render an "Add new submission" placeholder card as the last item in the grid, styled with a dashed border and no box-shadow.

---

### Requirement 5: Project Card

**User Story:** As a hackathon judge, I want each project card to show key information at a glance, so that I can quickly assess a submission before opening it.

#### Acceptance Criteria

1. THE Project_Card SHALL display a `6px` coloured accent bar at the top, with the colour cycling through the palette: green (`#90EE90`), blue (`#87CEEB`), yellow (`#FFDB58`), coral (`#FF7A5C`), purple (`#A388EE`), pink (`#FFB2EF`).
2. THE Project_Card SHALL display the project's sequential submission number (e.g. "#01") derived from its position in the ordered list returned by `GET /api/get-all`.
3. THE Project_Card SHALL display the project's short description (`short_description` field) truncated to a maximum of two lines.
4. THE Project_Card SHALL display the project's theme (`theme` field) as a tag pill, and up to two additional technology tags inferred from the `github_link` or `long_description` when available.
5. THE Project_Card SHALL display two Analysis_Badges in the card footer: one for "Market" analysis and one for "Code" analysis.
6. WHEN `market_agent_analysis` is a non-empty array, THE Analysis_Badge for "Market" SHALL display "Market ✓" with a green (`#90EE90`) background.
7. WHEN `market_agent_analysis` is an empty array, THE Analysis_Badge for "Market" SHALL display "Market —" with a grey (`#ddd`) background and muted text (`#777`).
8. WHEN `code_agent_analysis` is a non-empty array, THE Analysis_Badge for "Code" SHALL display "Code ✓" with a pink (`#FFB2EF`) background.
9. WHEN `code_agent_analysis` is an empty array, THE Analysis_Badge for "Code" SHALL display "Code —" with a grey (`#ddd`) background and muted text (`#777`).
10. THE Project_Card SHALL display an "Open ↗" action button in the card footer.
11. WHEN the "Open ↗" button is clicked, THE Dashboard_Page SHALL navigate the user to `/project/[project_id]`.
12. WHEN the user hovers over a Project_Card, THE Project_Card SHALL translate by `(-2px, -2px)` and increase its box-shadow offset to `7px 7px 0 #111`.
13. THE Project_Card SHALL apply a `2.5px` black border, `4px` border-radius, and a `5px 5px 0 #111` box-shadow in its default state.

---

### Requirement 6: Add Project Modal

**User Story:** As a hackathon organiser, I want to submit a new project from the dashboard, so that I can add submissions without leaving the page.

#### Acceptance Criteria

1. THE Add_Project_Modal SHALL be rendered as an overlay on top of the Dashboard_Page when triggered.
2. THE Add_Project_Modal SHALL contain a form with the following fields: "Short description" (required, text input, max 200 characters), "Long description" (optional, textarea), and "GitHub link" (required, URL input matching `https://github.com/...`).
3. WHEN the form is submitted with valid data, THE Add_Project_Modal SHALL call `POST /api/create-project` with the field values as the request body.
4. WHILE the `POST /api/create-project` request is in flight, THE Add_Project_Modal SHALL disable the submit button and display a loading indicator.
5. WHEN `POST /api/create-project` returns a successful response, THE Add_Project_Modal SHALL close and THE Project_Grid SHALL refresh its data by re-fetching `GET /api/get-all`.
6. IF `POST /api/create-project` returns an error response, THEN THE Add_Project_Modal SHALL display the error message from the response body without closing the modal.
7. WHEN the user clicks outside the Add_Project_Modal or presses the Escape key, THE Add_Project_Modal SHALL close without submitting the form.
8. THE Add_Project_Modal SHALL apply the Neu-Brutalism style: white background, `2.5px` black border, `6px 6px 0 #111` box-shadow, and a `#FFDB58` header bar.

---

### Requirement 7: Data Fetching and API Integration

**User Story:** As a hackathon judge, I want the dashboard to display live data from the backend, so that I always see the current state of submissions.

#### Acceptance Criteria

1. THE Dashboard_Page SHALL fetch the full project list on initial render by calling `GET /api/get-all` (base URL `http://localhost:8000/api`).
2. THE Dashboard_Page SHALL derive all Stats_Row values from the single `GET /api/get-all` response without making additional API calls for stats.
3. WHEN the Dashboard_Page is a Next.js Server Component, THE Dashboard_Page SHALL perform the `GET /api/get-all` fetch on the server and pass the result as props to client sub-components.
4. THE Dashboard_Page SHALL expose a client-side refresh mechanism so that after a successful project submission the Project_Grid re-fetches `GET /api/get-all` without a full page reload.
5. IF the `GET /api/get-all` response contains an empty `projects` array, THEN THE Dashboard_Page SHALL render the Stats_Row with all values set to zero and THE Project_Grid SHALL display only the "Add new submission" placeholder card.

---

### Requirement 8: Visual Design Compliance

**User Story:** As a product designer, I want the dashboard to faithfully implement the Neu-Brutalism design system, so that the application has a consistent and distinctive visual identity.

#### Acceptance Criteria

1. THE Dashboard_Page SHALL use `#FDFD96` as the page background colour.
2. THE Dashboard_Page SHALL use the Geist Sans font family (already configured in `src/app/layout.tsx`) for all text.
3. THE Dashboard_Page SHALL apply `2.5px solid #111` borders to all interactive card and input elements.
4. THE Dashboard_Page SHALL apply offset box-shadows of the form `Xpx Xpx 0 #111` (or a pastel accent colour) to all card and button elements, with no blur radius.
5. WHEN an interactive element (button, pill, card) is in the active/pressed state, THE Dashboard_Page SHALL translate the element by `(2px, 2px)` and reduce the box-shadow offset by `2px` to simulate a physical press.
6. THE Dashboard_Page SHALL use the pastel accent colour palette: green `#90EE90`, blue `#87CEEB`, yellow `#FFDB58`, coral `#FF7A5C`, purple `#A388EE`, pink `#FFB2EF`.
7. THE Dashboard_Page SHALL be fully responsive, adapting the Project_Grid from three columns to one column on mobile viewports.
