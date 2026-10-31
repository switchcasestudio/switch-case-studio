# Wikidata entry: Switch Case Studio (draft, 2026-10-27)

**Create only after the Clutch profile is published** (clutch.co/profile/switch-case-studio, submitted 2026-10-27, under review). Without an independent reference, volunteer editors may delete a small-business item. Create it from the owner's own Wikidata account (Special:NewItem), then add the statements below with "+ add statement". All IDs were checked against the Wikidata API on 2026-10-27.

## Item

| Field | Value |
|---|---|
| Label (en) | Switch Case Studio |
| Description (en) | web design and development studio in Portland, Oregon |
| Also known as (en) | SCS |

Keep the description lowercase, with no period and no marketing words; Wikidata rejects promotional descriptions.

## Statements

| Property | Value | Reference |
|---|---|---|
| P31 instance of | Q4830453 business | P854 reference URL: https://switchcasestudio.com/about |
| P452 industry | Q190637 web design | P854: https://switchcasestudio.com/services |
| P452 industry | Q386275 web development | P854: https://switchcasestudio.com/services |
| P17 country | Q30 United States of America | P854: Clutch profile URL |
| P159 headquarters location | Q6106 Portland (Oregon) | P854: Clutch profile URL |
| P571 inception | 2024 (precision: year) | P854: Clutch profile URL |
| P856 official website | https://switchcasestudio.com | none needed |
| P1448 official name | Switch Case Studio (en) | P854: https://switchcasestudio.com |
| P12361 Bluesky handle | switchcasestudio.bsky.social | none needed |
| P4264 LinkedIn company or organization ID | 127224064 | none needed |
| P2003 Instagram username | switchcasestudio | none needed |
| P11892 Threads username | switchcasestudio | none needed |
| P2002 X (Twitter) username | s_c_studio | none needed |
| P2037 GitHub account | switchcasestudio | none needed |

Add P813 retrieved (the date you create the item) to every P854 reference.

## Left out on purpose

- **Founder (P112):** needs a Wikidata item for the founder. An item for a private person without independent coverage is likely to be deleted; skip it.
- **Street address and phone (P6375, P1329):** they don't help entity matching, and they put a home or office address in a public database.
- **Facebook (P2013):** the page has a numeric `profile.php?id=` address, not a username, so the property doesn't fit.

## After it is saved

1. Copy the new Q-number.
2. Add `https://www.wikidata.org/wiki/Q…` to `src/data/social.js` as a non-footer entry, or straight into the `sameAs` mirror in `index.html` (keep `check:sameas` green).
3. Search Google for "Switch Case Studio Portland" a few weeks later to see whether a Knowledge Panel appears.

## Created 2026-10-30: Q141938459

https://www.wikidata.org/wiki/Q141938459, by account Switchcasestudio. The full reference list above tripped Wikidata's abuse filter ("too many external links", "Excessive self referring") on a new account, so the live item has no references to our own site: Clutch sources only P159 and P571. Every other statement above is in, unreferenced.
