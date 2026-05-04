-- Force PostgREST schema cache reload to pick up gate_options, fencing_panels, and gates columns.
NOTIFY pgrst, 'reload schema';
