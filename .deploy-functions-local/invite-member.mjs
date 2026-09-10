// Invitation endpoint; the service-role key is read only from Netlify env.
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8" } });

export default async request => {
  if (request.method !== "POST") return json({ error: "Método não permitido." }, 405);
  const callerToken = request.headers.get("authorization") || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  if (!callerToken || !serviceKey || !supabaseUrl) return json({ error: "Backend não configurado." }, 503);
  const body = await request.json().catch(() => null);
  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();
  const role = String(body?.role || "operator");
  const nucleusId = String(body?.nucleusId || "");
  if (name.length < 2 || !email || !nucleusId || !body?.organizationId || !["operator", "treasurer", "auditor", "nucleus_admin"].includes(role)) return json({ error: "Dados de convite inválidos." }, 400);

  const callerResponse = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: { apikey: serviceKey, authorization: callerToken } });
  const caller = await callerResponse.json().catch(() => null);
  if (!callerResponse.ok || !caller?.id) return json({ error: "Sessão inválida." }, 401);
  const memberships = await fetch(`${supabaseUrl}/rest/v1/memberships?select=role&user_id=eq.${encodeURIComponent(caller.id)}&nucleus_id=eq.${encodeURIComponent(nucleusId)}`, { headers: { apikey: serviceKey, authorization: callerToken } });
  const membershipRows = await memberships.json().catch(() => []);
  if (!memberships.ok || !membershipRows.some(item => ["admin", "nucleus_admin"].includes(item.role))) return json({ error: "Você não tem permissão para convidar pessoas neste núcleo." }, 403);

  const invite = await fetch(`${supabaseUrl}/auth/v1/admin/invite`, { method: "POST", headers: { apikey: serviceKey, authorization: `Bearer ${serviceKey}`, "content-type": "application/json" }, body: JSON.stringify({ email, data: { full_name: name } }) });
  const inviteData = await invite.json().catch(() => ({}));
  if (!invite.ok || !inviteData.user?.id) return json({ error: inviteData.msg || inviteData.message || "O convite não foi aceito pelo provedor de autenticação." }, invite.status || 502);

  const headers = { apikey: serviceKey, authorization: `Bearer ${serviceKey}`, "content-type": "application/json", prefer: "resolution=merge-duplicates,return=minimal" };
  const profile = await fetch(`${supabaseUrl}/rest/v1/profiles`, { method: "POST", headers, body: JSON.stringify({ id: inviteData.user.id, full_name: name }) });
  const membership = await fetch(`${supabaseUrl}/rest/v1/memberships`, { method: "POST", headers, body: JSON.stringify({ user_id: inviteData.user.id, organization_id: body.organizationId, nucleus_id: nucleusId, role }) });
  if (!profile.ok || !membership.ok) return json({ error: "Convite enviado, mas o vínculo do núcleo precisa ser revisado no banco." }, 502);
  return json({ ok: true });
};
