---
title: Configurator 2D Reference Reconstruction Roadmap
description: Roadmap to rebuild the 2D configurator preview from the exact visual reference, then close missing data gate by gate
owner: Ruben
status: ACTIVE
last_updated: 2026-07-18
---

# Configurator 2D Reference Reconstruction Roadmap

This roadmap is for one goal only:

- make the configurator 2D preview match a real technical reference drawing as closely as possible

The attached image should be treated as a target blueprint, not as a loose style reference.

If the preview does not match this level of clarity, the configurator will still feel schematic.

---

## 1. What the image tells us

From the reference drawing we can already infer several concrete visual rules:

- double swing gate
- two equal leaves
- brick pillars on both sides
- black steel infill with vertical bars
- two horizontal rails inside each leaf
- a center latch / meeting detail
- side clearances called out explicitly
- ground clearance called out explicitly
- height and width dimension annotations shown in red
- the design is technical, orthographic, and line-first

The 2D renderer should therefore behave like a drawing engine, not a marketing illustration.

---

## 2. Visual rules to match exactly

### Geometry and layout

- keep the drawing orthographic
- keep both leaves symmetric unless the selected gate type is asymmetric
- keep the gate centered between pillars
- keep the leaves aligned to the opening width
- show the gate as a technical elevation, not a perspective scene

### Structure

- draw two full leaves
- draw the outer frame
- draw the mid rail
- draw the bottom rail
- draw vertical infill bars
- draw the center meeting line
- draw the latch hardware only when the gate type uses it

### Site context

- draw the brick pillars when the layout includes masonry supports
- show coping / top cap only if confirmed
- show the bottom datum line / ground plane
- keep the pillar and opening dimensions readable

### Dimensioning style

- use red dimension lines
- keep dimension labels outside the object when possible
- show minimum and maximum where the source document provides them
- do not invent extra dimensions that are not in the reference
- keep the text style technical and compact

### Visual tone

- white or off-white background
- black linework
- red dimensioning annotations
- no decorative shading unless needed for clarity
- no visual embellishment that hides the technical structure

---

## 3. What must be rebuilt in the engine

The current engine is schematic enough to work, but not yet exact enough for this reference style.

The engine needs three layers of work:

1. geometry truth
2. drawing recipe
3. dimension overlay

### Geometry truth

All gate types need a precise geometry recipe that defines:

- leaf count
- frame thickness
- rail count
- infill spacing
- hinge side
- opening direction
- clear opening vs overall width semantics
- ground clearance
- pillar setback or post position

### Drawing recipe

The renderer should be able to draw:

- frame outlines
- rail outlines
- infill bars
- latch / hardware blocks
- pillars or post supports
- optional mechanism parts
- red dimension lines
- dimension labels

### Dimension overlay

The dimensioning system must support:

- horizontal dimensions
- vertical dimensions
- min / max notes
- central measurement callouts
- side clearance callouts
- ground clearance callouts

If dimension lines are hardcoded inside the gate drawing, the system will become impossible to scale across all gate types.

---

## 4. Gate-by-gate work order

The safest order is the order that gives the most usable visual truth first.

### 1. `double_swing`

This is the primary reconstruction target.

Why first:

- the reference image is closest to a double swing technical drawing
- the existing documentation is strongest here
- the image provides a clear structure to match

What to close:

- exact number of rails
- exact vertical bar count and spacing
- exact frame thickness
- center latch geometry
- pillar offset and side gap
- ground clearance
- exact meaning of the red dimensions

### 2. `single_swing`

This is the simplest derivative of the same visual language.

What to close:

- how the single leaf aligns inside the same drawing system
- how the hinge side is represented
- how the latch side is shown
- whether the same rail and infill logic can be reused

### 3. `tracked_sliding`

This family proves the renderer can switch mechanism language without losing the technical style.

What to close:

- track line style
- panel structure
- open vs closed state representation
- how much of the running gear is shown
- whether the same dimensioning style can be reused

### 4. `cantilever_sliding`

This must stay visually distinct from tracked sliding.

What to close:

- counterbalance tail proportion
- carriage and support representation
- no ground track in the opening
- opening width semantics

### 5. `bifolding_double_swing`

This is a more complex swing family and should only be tackled after the baseline swing drawing is stable.

What to close:

- fold split ratio
- main hinge vs fold hinge
- open-state stacking logic
- same drawing style or a simplified variant

### 6. `single_bifolding`

What to close:

- folding split ratio
- collection side
- symmetric or asymmetric open state
- same shared geometry helpers as the bifolding double swing

### 7. `telescopic_sliding`

This is a multi-panel sequencing problem.

What to close:

- number of panels
- overlap order
- open-state stack positions
- which parts are visible in technical elevation

### 8. `radius_sliding`

This must remain last until the client confirms what the term actually means.

What to close:

- curved path or curved top or both
- whether the mechanism is a special sliding variant or a separate product definition
- what the technical drawing must show in plan and elevation

---

## 5. Missing data checklist by gate

### Double swing

- exact width band
- exact height band
- clear opening vs overall width
- ground clearance
- pillar gap
- frame tube sizes
- rail count
- vertical bar count formula
- center latch representation
- whether the reference size includes the brick pillars

### Single swing

- same items as double swing
- hinge side default
- latch position
- whether the drawing should mirror the double swing style or use a pedestrian-specific layout

### Tracked sliding

- track type
- rail visibility level
- roller visibility level
- motor visibility level
- panel overlap logic
- how the red dimensions should represent the runback

### Cantilever sliding

- tail ratio
- support carriage position
- open-state tail extension
- whether the gate width in the catalog means clear opening or total assembly length

### Bifolding double swing

- how each leaf is split
- hinge count
- fold angle
- open-state footprint
- decorative compatibility

### Single bifolding

- fold ratio
- collection side
- mechanical visibility
- how to present it in elevation without clutter

### Telescopic sliding

- panel count
- staggered motion order
- closed overlap state
- open stack state
- clear opening semantics

### Radius sliding

- exact mechanism meaning
- path geometry
- whether it belongs to the sliding family or needs a separate renderer branch

---

## 6. Practical collection method

For every gate type, use the same evidence chain:

1. confirm the client brief
2. compare with the gate catalog page
3. compare with the photo audit
4. compare with the engine preset
5. identify what the renderer cannot yet express
6. write the missing value list
7. only then change the engine or UI

Do not do drawing tweaks before the data is closed.

If the drawing is changed first, the engine will drift and the reference will be lost.

---

## 7. Execution phases

### Phase A - Reference lock

Goal:

- freeze the target 2D style
- document what every line in the reference is doing

Deliverables:

- one visual grammar for technical gate drawings
- one shared dimension style
- one shared site-context style

### Phase B - Double swing reconstruction

Goal:

- make `double_swing` match the reference drawing as closely as possible

Deliverables:

- revised 2D render recipe
- dimension overlay rules
- gate-specific geometry notes
- test coverage for the final geometry recipe

### Phase C - Family expansion

Goal:

- reuse the same drawing language on the remaining gate families

Deliverables:

- `single_swing`
- `tracked_sliding`
- `cantilever_sliding`

### Phase D - Complex mechanisms

Goal:

- extend the same visual language to folding and telescopic families

Deliverables:

- `bifolding_double_swing`
- `single_bifolding`
- `telescopic_sliding`

### Phase E - Ambiguous family

Goal:

- close the meaning of `radius_sliding` before any final renderer work

Deliverables:

- client definition
- final geometry model
- renderer decision

---

## 8. Recommended implementation order

If you want the shortest safe path:

1. lock the technical drawing grammar
2. rebuild `double_swing`
3. derive `single_swing`
4. separate tracked and cantilever sliding clearly
5. only then attack bifolding and telescopic
6. leave `radius_sliding` for last

That order minimizes rework because the first gate becomes the template for the others.

---

## 9. Definition of done

The 2D reconstruction work is done when:

- the preview looks like a technical drawing, not a marketing render
- `double_swing` can be matched to a reference drawing with the same structural language
- each gate type has a documented missing-data list
- the engine owns geometry truth
- the UI only consumes engine output
- `radius_sliding` remains explicitly blocked until defined

