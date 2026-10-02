# Spec Delta

## MODIFIED Requirements

### Requirement: Feed uses site canonical URL
The RSS feed SHALL emit absolute URLs rooted at the canonical site URL resolved for the current build so feed readers can resolve entries consistently across production and non-production deployments.

#### Scenario: Item links are absolute
- **WHEN** a feed reader opens an item from `/rss.xml`
- **THEN** the item link resolves to the full canonical URL for that post

#### Scenario: Item links use build override URL
- **WHEN** a build runs with a canonical site URL environment variable set to `https://dev.codeholics.com`
- **THEN** item links in `/rss.xml` resolve under `https://dev.codeholics.com`

#### Scenario: Item links use default production URL
- **WHEN** a build runs without the canonical site URL environment variable
- **THEN** item links in `/rss.xml` resolve under `https://www.codeholics.com`
