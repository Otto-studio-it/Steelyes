import type { TenantBundle } from '@steelyes/gate-engine'

export async function dispatchTenantLeadWebhook(
  tenant: TenantBundle | null,
  payload: Record<string, unknown>,
): Promise<void> {
  const webhookUrl = tenant?.leads.webhookUrl ?? process.env.TENANT_LEAD_WEBHOOK_URL
  if (!webhookUrl) {
    return
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenantId: tenant?.id ?? 'steelyes',
        ...payload,
      }),
    })
  } catch (error) {
    console.error('Tenant lead webhook failed:', error)
  }
}
