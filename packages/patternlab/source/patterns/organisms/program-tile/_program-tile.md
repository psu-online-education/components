---
title: Program Tile
---
The program tile is an organism that provides an overview of an individual
program. Required properties include:

- The canonical URL of the program
- The subject of the program
- The degree type of the program

There are numerous optional features that can be toggled including:

- A color profile, either "light" or "dark" (defaults to "light")
- An intro icon and label, which can be used to communicate taxonomy
- A summary of the program, generally consisting of 200 and 300 characters
- A bulleted list of important selling points

Note: the intro icon will only be displayed if an intro label is also provided.

If one or both of the summary or bulleted list properties are provided, then
the program tile will render in a progressive disclosure fashion, enabling
three additional properties:

- A customized "Expand" label
- A customized "Collapse" label
- A customized "View full details" label

### Variables
| Variable          | Type   | Required | Description                                                                                                       |
|-------------------|--------|----------|-------------------------------------------------------------------------------------------------------------------|
| url               | url    | true     | The canonical URL of the program.                                                                                 |
| subject           | string | true     | The subject of the program.                                                                                       |
| degree_type       | string | true     | The degree type of the program.                                                                                   |
| color_profile     | string | false    | The color profile to display the tile with (either "light" or "dark", defaults to "light").                       |
| intro_label       | string | false    | The intro label which will be displayed at the top of the tile.                                                   |
| intro_icon        | string | false    | The intro icon which will be displayed in front of the intro label (will only appear if there is an intro label). |
| summary           | string | false    | A summary of the program, generally consisting of 200 and 300 characters.                                         |
| info_bullets      | array  | false    | A bulleted list of important selling points.                                                                      |
| id                | string | false    | An ID attribute (defaults to "program-tile-{{subject}}-{{degree_type}}").                                         |
| expand_label      | string | false    | The label of the expand button (defaults to "Show Details").                                                      |
| collapse_label    | string | false    | The label of the collapse button (defaults to "Hide Details").                                                    |
| view_degree_label | string | false    | The label of the view degree link (defaults to "View Degree").                                                    |
