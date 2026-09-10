مشوارك --- Color Palette & Typography
Full Color Palette
1. Primary Nile / Teal
Name                  HEX         Usage
---
Nile Teal         `#075E6B`   Main buttons, links, icons, headings
Nile Teal Hover   `#064F5A`   Button hover / active states
Nile Teal Dark    `#0A3E4A`   Dark text, footer, strong headings
Deep Nile         `#0A2A35`   Very dark text / deep UI elements
Deep Nile 2       `#123E4A`   Secondary dark surfaces
Teal Light        `#DCEFF1`   Icon backgrounds, soft highlights
Teal Very Light   `#EEF7F8`   Subtle backgrounds
---
2. Egyptian / Papyrus Neutrals
Name             HEX         Usage
---
Papyrus      `#F8F3ED`   Main warm page background
Sand         `#F2EDE5`   Secondary sections
Warm White   `#FAF8F5`   Cards / subtle surfaces
White        `#FFFFFF`   Header, cards, search field
Off White    `#F8F8F8`   Secondary backgrounds
Light Gray   `#F0F0F0`   Form/control backgrounds
---
3. Typography Colors
Name                 HEX         Usage
---
Primary Text     `#182024`   Main body text
Dark Text        `#0A3E4A`   Major headings
Secondary Text   `#59686D`   Descriptions
Muted Text       `#7A878A`   Supporting/subtle text
White Text       `#FFFFFF`   Dark backgrounds / buttons
Teal Text        `#075E6B`   Links and highlighted text
---
4. Borders
Name               HEX         Usage
---
Border         `#DDE3E3`   Cards, inputs
Light Border   `#E9EDED`   Very subtle separators
Teal Border    `#BFDDE0`   Teal category cards
Gold Border    `#E7D6B8`   Personal-document cards
Red Border     `#F0C9CD`   Travel cards
Blue Border    `#C8DFEC`   Traffic cards
---
5. Egyptian Accent Colors
Gold
Name                HEX         Usage
---
Egyptian Gold   `#C69C45`   Decorative lines, accents
Gold Light      `#F7EEDC`   Gold icon backgrounds
Gold Soft       `#F2E5CC`   Warm category surfaces
Red
Name               HEX         Usage
---
Egyptian Red   `#C92A35`   Travel category / emphasis
Red Light      `#F7E3E5`   Travel icon background
Red Soft       `#FBEDEF`   Travel card background
Green / Family
Name               HEX         Usage
---
Family Teal    `#2A8B8C`   Family category
Family Light   `#DCEFEF`   Family icon background
Family Soft    `#F0F9F8`   Family card background
Blue / Traffic
Name               HEX         Usage
---
Traffic Blue   `#2878A5`   Traffic category
Blue Light     `#E4F0F7`   Traffic icon background
Blue Soft      `#F1F8FB`   Traffic card background
---
6. Status / Utility Colors
Name                HEX         Usage
---
Success         `#217A55`   Success / verified information
Warning         `#C88A1D`   Warnings
Info            `#2878A5`   Informational messages
Error           `#C92A35`   Errors / important warnings
Success Light   `#E5F3EC`   Success background
Warning Light   `#FAF0DA`   Warning background
Error Light     `#F7E3E5`   Error background
---
Main Palette at a Glance
``` text
#075E6B  ████  Nile Teal
#064F5A  ████  Nile Teal Hover
#0A3E4A  ████  Deep Nile
#0A2A35  ████  Deep Nile Dark

#F8F3ED  ████  Papyrus
#F2EDE5  ████  Sand
#FFFFFF  ████  White

#C69C45  ████  Egyptian Gold
#C92A35  ████  Egyptian Red
#2878A5  ████  Egyptian Blue
#217A55  ████  Success Green

#DCEFF1  ████  Teal Light
#F7EEDC  ████  Gold Light
#F7E3E5  ████  Red Light
#E4F0F7  ████  Blue Light
```
---
Fonts
Arabic
IBM Plex Sans Arabic
Recommended weights:
``` text
IBM Plex Sans Arabic
├── 400 — Regular
├── 500 — Medium
├── 600 — SemiBold
└── 700 — Bold
```
Suggested Usage
Element            Font                     Weight
---
Body text          IBM Plex Sans Arabic        400
Navigation         IBM Plex Sans Arabic        500
Buttons            IBM Plex Sans Arabic        600
Card titles        IBM Plex Sans Arabic        600
Section headings   IBM Plex Sans Arabic        700
Hero heading       IBM Plex Sans Arabic        700
Footer headings    IBM Plex Sans Arabic        600
Small labels       IBM Plex Sans Arabic        500
English
For English UI elements such as EN, use:
IBM Plex Sans
Recommended weight: 500--600
---
Logo Font / Wordmark
The مشوارك logo itself is not a standard font.
The Arabic wordmark and location-pin mark are custom graphic artwork.
Use the supplied logo image rather than trying to reproduce the logo
with a font.
---
Recommended CSS Variables
``` css
:root {
  /* Brand */
  --primary: #075E6B;
  --primary-hover: #064F5A;
  --primary-light: #DCEFF1;
  --deep-nile: #0A3E4A;
  --deep-nile-dark: #0A2A35;
  --deep-nile-2: #123E4A;

  /* Backgrounds */
  --papyrus: #F8F3ED;
  --sand: #F2EDE5;
  --white: #FFFFFF;
  --off-white: #FAF8F5;

  /* Typography */
  --text-primary: #182024;
  --text-secondary: #59686D;
  --text-muted: #7A878A;

  /* Borders */
  --border: #DDE3E3;
  --border-light: #E9EDED;

  /* Egyptian accents */
  --gold: #C69C45;
  --gold-light: #F7EEDC;

  --red: #C92A35;
  --red-light: #F7E3E5;

  --blue: #2878A5;
  --blue-light: #E4F0F7;

  --green: #217A55;
  --green-light: #E5F3EC;
}
```
---
Font CSS
``` css
body {
  font-family: "IBM Plex Sans Arabic", sans-serif;
  color: #182024;
  background: #F8F3ED;
}

h1, h2, h3, h4 {
  font-family: "IBM Plex Sans Arabic", sans-serif;
  font-weight: 700;
}
```
---
Brand Direction
The visual language is based on:
Nile teal as the primary brand color
Papyrus and sand for warm Egyptian-inspired backgrounds
Egyptian gold for heritage-inspired accents
Egyptian red for travel and emphasis
Egyptian blue for traffic-related services
Teal/green for family and positive states
IBM Plex Sans Arabic for a modern Arabic interface
Custom مشوارك logo artwork rather than a font-based wordmark
This palette is intended to remain consistent across the homepage,
service pages, category cards, buttons, forms, informational sections,
and footer.