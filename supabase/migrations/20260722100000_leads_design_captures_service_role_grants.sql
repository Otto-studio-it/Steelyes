-- Migration: leads_design_captures_service_role_grants
-- The contact/configurator quote pipeline writes leads and design_captures
-- with the service-role client. service_role bypasses RLS but still needs
-- table grants (same fix quote_requests received in 20260505161000).
--
-- Note: leads INSERT from the contact form has been failing on staging with
-- 42501 (permission denied) because this grant was never issued.

GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.design_captures TO service_role;

NOTIFY pgrst, 'reload schema';
