# github-projects Specification

## Purpose

Showcase Codeholics repositories and manually curated GitHub recommendations on a dedicated, accessible Featured Projects page, with useful repository details grouped by category.

## Requirements

### Requirement: Featured Projects has a dedicated page
The site SHALL provide a dedicated full-width Featured Projects page at `/projects/` with a clear page heading and a primary navigation link labeled “Projects”.

#### Scenario: Visitor opens the Projects page
- **WHEN** a visitor follows the Projects navigation link or opens `/projects/`
- **THEN** the site displays the Featured Projects page rather than placing the projects section in the homepage sidebar

### Requirement: Page features Codeholics repositories
The Featured Projects page SHALL show selected Codeholics repositories in a distinct My Projects section when their repository data is available.

#### Scenario: Metadata is available for a Codeholics repository
- **WHEN** the page is generated with valid metadata for a selected Codeholics repository
- **THEN** its project card shows its repository name, description, star count, fork count, language when present, and Static badge

#### Scenario: A Codeholics repository is unavailable
- **WHEN** metadata for a selected Codeholics repository cannot be loaded or validated
- **THEN** that repository is omitted and the other available projects remain visible

### Requirement: Curated repositories are organized by category
The Featured Projects page SHALL show manually selected GitHub repositories in curator-defined categories, with repository details obtained from the configured repository links.

#### Scenario: Curated category contains available repositories
- **WHEN** a visitor views a curated category with available repository metadata
- **THEN** the category displays the repositories in their configured order with their repository name, description, star count, fork count, and language when present

#### Scenario: Visitor switches curated categories
- **WHEN** a visitor activates a category control
- **THEN** the corresponding curated repository list becomes visible and the selected category is indicated accessibly

### Requirement: Repository metadata is rendered at build time
The system SHALL retrieve repository metadata during static site generation and render it into the page without requiring browser-side GitHub API requests.

#### Scenario: Static page contains repository metadata
- **WHEN** the production site is built successfully
- **THEN** available repository names, descriptions, and metrics are present in generated HTML without a browser-side GitHub API request

#### Scenario: Authenticated API request is configured
- **WHEN** a GitHub token is provided through the build environment
- **THEN** the system uses it for GitHub API requests without exposing it in generated HTML, client-side assets, or browser requests

### Requirement: Curated repository links are validated
The system SHALL accept only valid GitHub repository links for curated entries and SHALL not use a configured URL as an arbitrary API request destination.

#### Scenario: Curated GitHub repository link is valid
- **WHEN** a curator configures a valid GitHub repository URL
- **THEN** the system resolves its owner and repository through the GitHub API and associates the metadata with its configured category

#### Scenario: Curated link is invalid or not a repository URL
- **WHEN** a configured curated link is invalid or does not identify a GitHub repository
- **THEN** the system reports the invalid entry during the build and does not request that URL

### Requirement: Unavailable repository metadata does not block the build
The system SHALL report failed or invalid repository metadata requests and omit only affected entries without preventing the Featured Projects page from building.

#### Scenario: One repository metadata request fails
- **WHEN** a GitHub request fails or returns invalid data for one repository
- **THEN** the build reports which repository could not be loaded, omits only its card, and continues rendering other available cards

### Requirement: Featured Projects is responsive and theme readable
The system SHALL present the entire Projects page, including its hero, project cards, and category controls, without horizontal page overflow and with readable text and distinguishable interactive states in the site's light and dark themes.

#### Scenario: Visitor views projects at different viewport widths
- **WHEN** the visitor views the page on a narrow or wide viewport
- **THEN** the page content and project cards reflow to fit the available width without horizontal page overflow
- **AND** category controls remain reachable, including within their existing horizontally scrollable tab row

#### Scenario: Visitor changes the site theme
- **WHEN** the visitor views the page in light or dark mode
- **THEN** card surfaces, text, metadata, borders, category controls, and hover or focus states remain distinguishable and readable
- **AND** hero text and image blending update with the resolved theme

#### Scenario: Hero text meets measurable contrast thresholds
- **WHEN** the hero is displayed at supported mobile, tablet, desktop, or large-desktop widths in either theme
- **THEN** the large hero heading meets at least 3:1 contrast against its actual rendered backdrop
- **AND** the eyebrow and summary meet at least 4.5:1 contrast against their actual rendered backdrops
- **AND** text readability does not depend on a particular bright or dark patch of the photograph

#### Scenario: Projects content remains readable outside the hero
- **WHEN** a visitor views repository cards, their metadata, category tabs, and empty or populated category panels in either theme
- **THEN** normal-sized text meets at least 4.5:1 contrast against its actual rendered background
- **AND** meaningful focus indicators and control states meet at least 3:1 contrast against adjacent colors

#### Scenario: Theme selection is honored on load and after switching
- **WHEN** a visitor loads the page with a saved light or dark preference, or with System mode following the OS preference
- **THEN** the hero and remaining project content use the same resolved theme as the shared navigation and page
- **AND** using the existing theme control updates the page without a reload
- **AND** returning to System follows subsequent OS preference changes

### Requirement: Project links are accessible and safe
The system SHALL provide keyboard-accessible repository links and category controls with visible focus indication and safe external-link behavior.

#### Scenario: Visitor opens a repository
- **WHEN** a visitor activates a repository link by pointer or keyboard
- **THEN** the repository opens in a new tab with appropriate link security attributes and the focused link has a visible focus style

#### Scenario: Visitor operates category controls with a keyboard
- **WHEN** a keyboard user navigates and activates curated category controls
- **THEN** each control is reachable, its selected state is exposed accessibly, and the active repository list can be reached by keyboard

### Requirement: Featured Projects hero includes concept artwork
The Featured Projects hero SHALL pair its existing heading and introduction with the supplied developer-desk artwork and use theme-aware visual blending that maintains readable text and a cohesive transition between content and image in both light and dark modes.

#### Scenario: Hero matches the desktop concept
- **WHEN** a visitor views the Featured Projects page on a wide viewport
- **THEN** the hero presents its text on the left and the developer-desk artwork on the right, blended directly into the active page background
- **AND** dark mode retains a dark, atmospheric fade while light mode blends into the light page without dark-only gradient stops beside the copy
- **AND** interface text uses the site's approved theme colors while the artwork retains its original colors
- **AND** the hero has no enclosing card background, rounded border, or shadow

#### Scenario: Hero adapts to a narrow viewport
- **WHEN** a visitor views the Featured Projects page on a narrow viewport
- **THEN** the hero image crops or stacks without horizontal overflow
- **AND** the heading and introduction remain visible and readable in both themes
- **AND** the mobile image-to-copy transition follows the active page background

#### Scenario: Artwork starts beneath navigation without excessive vertical cropping
- **WHEN** the page is viewed at the top on a desktop viewport
- **THEN** the artwork starts directly beneath the navbar without a blank top gutter
- **AND** its visible region preserves the source image's vertical scene rather than cropping it into a short strip

#### Scenario: Hero separates from following content
- **WHEN** the visitor reaches the end of the hero
- **THEN** a subtle horizontal divider separates it from the projects content without enclosing the hero in a box

#### Scenario: Hero artwork is decorative
- **WHEN** assistive technology reads the Featured Projects page
- **THEN** the artwork does not create redundant image narration
- **AND** the hero text remains the accessible page introduction

### Requirement: Featured Projects hero serves optimized WebP artwork
The Featured Projects page SHALL serve the existing full-size developer-desk artwork as a genuine WebP image rather than the PNG source, with correct intrinsic dimensions and no redundant PNG hero download.

#### Scenario: Browser loads the hero artwork
- **WHEN** a visitor opens `/projects/` with an empty browser cache
- **THEN** the selected hero image URL ends in `cyberpunk_developer_desk_under_moonlight_fullsize.webp`
- **AND** the response succeeds with WebP image content and valid RIFF/WEBP bytes
- **AND** the browser decodes the image at its actual 1983-by-793 dimensions
- **AND** the declared image dimensions match those intrinsic dimensions
- **AND** the page does not request the corresponding PNG as a hero image or preload

#### Scenario: Hero image remains decorative and prioritized
- **WHEN** the Projects page is rendered
- **THEN** the hero image retains empty alternative text inside a container hidden from assistive technology
- **AND** its loading remains prioritized as above-the-fold artwork rather than lazy-loaded
