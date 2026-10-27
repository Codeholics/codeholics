# Spec Delta

## ADDED Requirements

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

## MODIFIED Requirements

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
