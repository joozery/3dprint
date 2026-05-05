// Payments, Notifications, Team
const { useState: useSw } = React;

function PaymentsSection({ payments, setPayments }) {
  const { t } = useT();
  const tA = t.account || {};
  const p = tA.payments || {};
  const setDefault = id => setPayments(payments.map(x => ({ ...x, isDefault: x.id === id })));
  const remove = id => setPayments(payments.filter(x => x.id !== id));

  return (
    <div>
      <PageHeader title={p.title} subtitle={p.subtitle}
        actions={<>
          <button className="btn-ghost" style={{ fontSize: 12 }}><IconPlus size={11}/>&nbsp;{p.addPromptpay}</button>
          <button className="btn-primary"><IconPlus size={12}/>&nbsp;{p.addCard}</button>
        </>}/>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {payments.map(pm => (
          <div key={pm.id} style={{ borderRadius: 8, padding: 16,
            background: pm.isDefault ? 'var(--accent)' : 'var(--card)',
            color: pm.isDefault ? '#fff' : 'var(--ink)',
            border: `1px solid ${pm.isDefault ? 'var(--accent)' : 'var(--line)'}`, display: 'flex', flexDirection: 'column',
            gap: 12, minHeight: 150 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1.5,
                textTransform: 'uppercase', opacity: 0.7 }}>
                {pm.type === 'card' ? pm.brand : pm.type === 'promptpay' ? 'PromptPay' : pm.bank}
              </div>
              {pm.isDefault && <Chip tone="accent" small>{tA.default}</Chip>}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 17, letterSpacing: 2, fontWeight: 600 }}>
              {pm.type === 'card' ? `•••• ${pm.last4}`
                : pm.type === 'promptpay' ? pm.id_text
                : pm.account}
            </div>
            {pm.type === 'card' && (
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.8 }}>
                {p.expires} {pm.exp}
              </div>
            )}
            <div style={{ marginTop: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap',
              fontSize: 11 }}>
              {!pm.isDefault && (
                <button onClick={() => setDefault(pm.id)}
                  style={{ background: 'transparent', border: '1px solid var(--line)', color: 'inherit',
                    borderRadius: 3, padding: '4px 8px', cursor: 'pointer', fontSize: 11 }}>
                  {tA.makeDefault}
                </button>
              )}
              {!pm.isDefault && (
                <button onClick={() => remove(pm.id)}
                  style={{ background: 'transparent', border: '1px solid var(--line)',
                    color: 'oklch(0.55 0.18 25)', borderRadius: 3, padding: '4px 8px', cursor: 'pointer', fontSize: 11 }}>
                  {tA.remove}
                </button>
              )}
              {pm.lastUsed && (
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 10, opacity: 0.6, alignSelf: 'center' }}>
                  {p.lastUsed} {pm.lastUsed}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsSection({ prefs, setPrefs }) {
  const { t, lang, setLang } = useT();
  const tA = t.account || {};
  const n = tA.notifications || {};
  const topicKeys = ['orderStatus', 'quotes', 'promo', 'newsletter'];
  const channelKeys = ['email', 'sms', 'inapp'];
  const toggle = (topic, channel) =>
    setPrefs({ ...prefs, [topic]: { ...prefs[topic], [channel]: !prefs[topic][channel] } });

  return (
    <div>
      <PageHeader title={n.title} subtitle={n.subtitle}/>
      <Card dense>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 90px 90px 90px',
          gap: 0, padding: '14px 18px', borderBottom: '1px solid var(--line)',
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase',
          color: 'var(--muted)', alignItems: 'center' }}>
          <div>หัวข้อ</div>
          {channelKeys.map(c => (
            <div key={c} style={{ textAlign: 'center', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 4 }}>
              {c === 'email' && <IconMail size={11}/>}
              {c === 'sms' && <IconPhone size={11}/>}
              {c === 'inapp' && <IconBell size={11}/>}
              {n.channels?.[c]}
            </div>
          ))}
        </div>
        {topicKeys.map((tk, i) => (
          <div key={tk} style={{ display: 'grid', gridTemplateColumns: '2fr 90px 90px 90px',
            gap: 0, padding: '16px 18px',
            borderBottom: i < topicKeys.length - 1 ? '1px solid var(--line)' : 'none',
            alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{n.topics?.[tk]}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{n.topics?.[tk+'Desc']}</div>
            </div>
            {channelKeys.map(c => (
              <div key={c} style={{ display: 'grid', placeItems: 'center' }}>
                <Toggle on={prefs[tk]?.[c]} onChange={() => toggle(tk, c)}/>
              </div>
            ))}
          </div>
        ))}
      </Card>
      <Card title={n.language}>
        <div style={{ display: 'flex', gap: 6 }}>
          {Object.entries(LANG_META).map(([code, m]) => (
            <button key={code} onClick={() => setLang(code)}
              style={{ padding: '8px 14px', fontSize: 12, fontFamily: 'var(--mono)',
                background: lang === code ? 'var(--accent)' : 'var(--bg)',
                color: lang === code ? '#fff' : 'var(--ink)',
                border: `1px solid ${lang === code ? 'var(--accent)' : 'var(--line)'}`, borderRadius: 4, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontWeight: 600 }}>{m.label}</span>
              <span style={{ fontFamily: 'var(--sans)' }}>{m.name}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TeamSection({ team, setTeam }) {
  const { t } = useT();
  const tA = t.account || {};
  const te = tA.team || {};
  const active = team.filter(m => m.status === 'active');
  const pending = team.filter(m => m.status === 'pending');

  return (
    <div>
      <PageHeader title={te.title} subtitle={te.subtitle}
        actions={<button className="btn-primary"><IconPlus size={12}/>&nbsp;{te.invite}</button>}/>
      <Card dense title={te.active} subtitle={`${active.length} members`}>
        <div>
          {active.map((m, i) => (
            <MemberRow key={m.id} m={m} isLast={i === active.length - 1} tA={tA}/>
          ))}
        </div>
      </Card>
      {pending.length > 0 && (
        <Card dense title={te.pending} subtitle={`${pending.length} invites`}>
          <div>
            {pending.map((m, i) => (
              <MemberRow key={m.id} m={m} isLast={i === pending.length - 1} tA={tA} pending/>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function MemberRow({ m, isLast, tA, pending }) {
  const te = tA.team || {};
  const roleTone = { owner: 'accent', admin: 'blue', member: 'neutral', viewer: 'muted' }[m.role];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr auto', gap: 12,
      padding: '14px 18px', borderBottom: isLast ? 'none' : '1px solid var(--line)',
      alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', minWidth: 0 }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--chip)',
          border: '1px solid var(--line)', display: 'grid', placeItems: 'center',
          fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{m.avatar}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</div>
        </div>
      </div>
      <div><Chip tone={roleTone} small>{te.roles?.[m.role]}</Chip></div>
      <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
        {pending ? te.pending : m.lastActive}
      </div>
      <div>
        {m.role !== 'owner' && (
          <button className="btn-ghost" style={{ fontSize: 11, color: 'oklch(0.45 0.18 25)' }}>
            {te.revoke}
          </button>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { PaymentsSection, NotificationsSection, TeamSection });
