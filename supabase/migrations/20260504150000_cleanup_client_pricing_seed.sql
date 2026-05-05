-- Clean up staging/client pricing data after receiving Marius' actual price list.
-- Keep only real Traditional Victorian gate rows in public.gates.

DELETE FROM public.gates
WHERE id IN (
  '33333333-3333-3333-3333-333333333301',
  '33333333-3333-3333-3333-333333333302',
  '33333333-3333-3333-3333-333333333303',
  '33333333-3333-3333-3333-333333333304',
  '33333333-3333-3333-3333-333333333305',
  '33333333-3333-3333-3333-333333333306',
  '33333333-3333-3333-3333-333333333307',
  '33333333-3333-3333-3333-333333333308',
  '33333333-3333-3333-3333-333333333309',
  '33333333-3333-3333-3333-333333333310',
  '33333333-3333-3333-3333-333333333311',
  '33333333-3333-3333-3333-333333333312',
  '33333333-3333-3333-3333-333333333313',
  '33333333-3333-3333-3333-333333333314',
  '33333333-3333-3333-3333-333333333315',
  '33333333-3333-3333-3333-333333333316',
  '33333333-3333-3333-3333-333333333317',
  '33333333-3333-3333-3333-333333333318'
)
AND name = ''
AND base_price_manual_gbp = 0
AND base_price_auto_gbp IS NULL;

UPDATE public.gates
SET name = CASE
  WHEN type = 'double-swing' AND finish = 'metal' THEN 'Traditional Victorian Double Swing Gate (Metal)'
  WHEN type = 'double-swing' AND finish = 'composite' THEN 'Traditional Victorian Double Swing Gate (Composite Boards)'
  WHEN type = 'single-swing' AND finish = 'metal' THEN 'Traditional Victorian Single Swing Gate (Metal)'
  WHEN type = 'single-swing' AND finish = 'composite' THEN 'Traditional Victorian Single Swing Gate (Composite Boards)'
  WHEN type = 'sliding' AND finish = 'metal' THEN 'Traditional Victorian Trucked Sliding Gate (Metal)'
  WHEN type = 'sliding' AND finish = 'composite' THEN 'Traditional Victorian Trucked Sliding Gate (Composite Boards)'
  WHEN type = 'cantilevered' AND finish = 'metal' THEN 'Traditional Victorian Cantilevered Sliding Gate (Metal)'
  WHEN type = 'cantilevered' AND finish = 'composite' THEN 'Traditional Victorian Cantilevered Sliding Gate (Composite Boards)'
  WHEN type = 'bifolding' AND finish = 'metal' THEN 'Traditional Victorian Bifolding Double Swing Gate (Metal)'
  WHEN type = 'bifolding' AND finish = 'composite' THEN 'Traditional Victorian Bifolding Double Swing Gate (Composite Boards)'
  WHEN type = 'bifolding-single' AND finish = 'metal' THEN 'Traditional Victorian Single Bifolding Gate (Metal)'
  WHEN type = 'bifolding-single' AND finish = 'composite' THEN 'Traditional Victorian Single Bifolding Gate (Composite Boards)'
  WHEN type = 'telescopic' AND finish = 'metal' THEN 'Traditional Victorian Telescopic Sliding Gate (Metal)'
  WHEN type = 'telescopic' AND finish = 'composite' THEN 'Traditional Victorian Telescopic Sliding Gate (Composite Boards)'
  WHEN type = 'sliding-radius' AND finish = 'metal' THEN 'Traditional Victorian Radius Sliding Gate (Metal)'
  WHEN type = 'sliding-radius' AND finish = 'composite' THEN 'Traditional Victorian Radius Sliding Gate (Composite Boards)'
  ELSE name
END
WHERE style = 'victorian';

UPDATE public.gate_options
SET
  name = 'Middle Bar',
  flat_price_gbp = 275,
  per_unit_price_gbp = NULL,
  unit_type = NULL,
  notes = 'Separates the gate lengthwise into two sections. Flat extra price from Marius.'
WHERE slug = 'middle-bar';

UPDATE public.gate_options
SET
  name = 'Railheads (Top)',
  flat_price_gbp = 0,
  per_unit_price_gbp = NULL,
  unit_type = 'per_railhead',
  notes = 'Price depends on selected railhead design. Client guidance: from roughly £1.25 to £25 per railhead. Needs admin-confirmed variant pricing.'
WHERE slug = 'railheads-top';

UPDATE public.gate_options
SET
  name = 'Dog Bars',
  flat_price_gbp = 75,
  per_unit_price_gbp = 4.50,
  unit_type = 'per_extra_bar',
  notes = 'Double bottom bars. From £75, then +£4.50 for each extra bar as width increases.'
WHERE slug = 'dog-bars';

UPDATE public.gate_options
SET
  name = 'Railheads on Dog Bars',
  flat_price_gbp = 0,
  per_unit_price_gbp = NULL,
  unit_type = 'per_railhead',
  notes = 'Second row of railheads on dog bars. Same pricing logic as top railheads.'
WHERE slug = 'railheads-dog-bars';

UPDATE public.gate_options
SET
  name = 'Arch / Bow Top',
  flat_price_gbp = 850,
  per_unit_price_gbp = NULL,
  unit_type = NULL,
  notes = 'Curved top instead of a straight top. Flat extra price per gate.'
WHERE slug = 'arch-bow-top';

UPDATE public.gate_options
SET
  name = 'Circles Between Vertical Bars',
  flat_price_gbp = 275,
  per_unit_price_gbp = 2.50,
  unit_type = 'per_circle',
  notes = 'Requires one extra horizontal bar (£275), then +£2.50 per circle based on gate width.'
WHERE slug = 'circles';

UPDATE public.gate_options
SET
  name = 'Bushes on Vertical Bars',
  flat_price_gbp = 90,
  per_unit_price_gbp = 2.50,
  unit_type = 'per_bush',
  notes = 'Decorative bushes. From £90 base, then from £2.50 per bush; larger bushes can reach about £12.50.'
WHERE slug = 'bushes';

UPDATE public.gate_options
SET
  name = 'Spirals on Vertical Bars',
  flat_price_gbp = 0,
  per_unit_price_gbp = 3.80,
  unit_type = 'per_spiral',
  notes = 'Decorative spirals. Minimum £3.80 per spiral.'
WHERE slug = 'spirals';

SELECT pg_notify('pgrst', 'reload schema');
