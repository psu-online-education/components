---
title: Program Tile
---
The program tile is an organism that can provide a short overview of an
individual program including its summary and key selling points.

## Required properties
Required properties include:

- The canonical URL of the program
- The subject of the program
- The degree type of the program

## Optional properties
There are a host of optional properties that progressively enhance the tile.

### Color profiles
Tiles come in two color profiles: `light` and `dark`.  By default, tiles will
assume the light profile.

### Intro icon & label
Tiles can take an intro icon and label property, which can be used to
communicate taxonomy, for example.

Note: the intro icon will only be displayed if an intro label is also provided.

### Summary & key selling points
The `summary` and `info_bullets` property can be provided add additional
information about the program to the tile.

- The `summary` of the program should consist of 200 and 300 characters
- The `info_bullets` property is an array of key selling points

If one or both of the `summary` or `info_bullets` properties are provided, then
the program tile will render in a progressive disclosure fashion, enabling
five additional properties.

#### Customizable control labels
- A customized "Expand" label
- A customized "Collapse" label
- A customized "View full details" label


#### Section view tracking
Section view tracking may be enabled if the `section_name` parameter is set.
Events matching this format:
```json
{
  "event": "section_view",
  "section_view_title": "{{ section_name }}", 
  "tags": {
    "section_type": "program_tile",
    "activation_type": "USER_ACTIVATE"
  }
}
```
will be pushed to the datalayer when the user expands with the tile. If there
is also a program code provided, that will be added to the tags section in
order to track interactions in more detail.
```json
{
  "event": "section_view",
  "section_view_title": "{{ section_name }}", 
  "tags": {
    "section_type": "program_tile",
    "program_code": "{{ code }}",
    "activation_type": "USER_ACTIVATE"
  }
}
```

### Variables
| Variable          | Type   | Required | Description                                                                                                       |
|-------------------|--------|----------|-------------------------------------------------------------------------------------------------------------------|
| url               | url    | true     | The canonical URL of the program.                                                                                 |
| subject           | string | true     | The subject of the program.                                                                                       |
| degree_type       | string | true     | The degree type of the program.                                                                                   |
| code              | string | false    | If a program code is provided, section tracking will be enabled.                                                  |
| color_profile     | string | false    | The color profile to display the tile with (either "light" or "dark", defaults to "light").                       |
| intro_label       | string | false    | The intro label which will be displayed at the top of the tile.                                                   |
| intro_icon        | string | false    | The intro icon which will be displayed in front of the intro label (will only appear if there is an intro label). |
| summary           | string | false    | A summary of the program, generally consisting of 200 and 300 characters.                                         |
| info_bullets      | array  | false    | A bulleted list of important selling points.                                                                      |
| id                | string | false    | An ID attribute (defaults to "program-tile-{{subject}}-{{degree_type}}").                                         |
| expand_label      | string | false    | The label of the expand button (defaults to "Show Details").                                                      |
| collapse_label    | string | false    | The label of the collapse button (defaults to "Hide Details").                                                    |
| view_degree_label | string | false    | The label of the view degree link (defaults to "View Degree").                                                    |
