---
title: Program Tile Grid
---
The program tile grid is a block that offers special handling for when a group
of related program tiles must be displayed together. The grid behavior operates
as follows:

1. If all tiles in a row are collapsed, the tiles stretch to the height of the
   tallest tile in the row.
2. If any tile in a row is expanded, the other tiles will not expand to stretch
   to the new height, but instead will shrink-wrap themselves to their natural
   heights.

The information about whether a program tile is collapsed or expanded is passed
up through the `component:activated` and `component:deactivated` events. The
grid will react to these events and add state flag attributes to individual
grid items.

### Variables
| Variable | Type   | Required | Description                |
|----------|--------|----------|----------------------------|
| tiles    | array  | true     | An array of program tiles. |
