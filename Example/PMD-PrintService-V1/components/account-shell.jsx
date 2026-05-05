// Account shell — header, sidebar, reusable UI
const { useState: useS, useEffect: useE, useMemo: useM } = React;

function ThumbGlyph({ kind = 'cube', size = 48 }) {
  const s = size, color = 'var(--muted)';
  const paths = {
    cube: <g stroke={color} strokeWidth="1.1" fill="none" strokeLinejoin="round">
      <path d={`M${s*.22} ${s*.38} L${s*.5} ${s*.22} L${s*.78} ${s*.38} L${s*.78} ${s*.72} L${s*.5} ${s*.88} L${s*.22} ${s*.72} Z`}/>
      <path d={`M${s*.22} ${s*.38} L${s*.5} ${s*.54} L${s*.78} ${s*.38}`}/>
      <path d={`M${s*.5} ${s*.54} L${s*.5} ${s*.88}`}/></g>,
    shell: <g stroke={color} strokeWidth="1.1" fill="none" strokeLinejoin="round">
      <path d={`M${s*.2} ${s*.4} L${s*.2} ${s*.72} L${s*.5} ${s*.88} L${s*.8} ${s*.72} L${s*.8} ${s*.4}`}/>
      <path d={`M${s*.2} ${s*.4} L${s*.5} ${s*.2} L${s*.8} ${s*.4}`}/></g>,
    gear: <g stroke={color} strokeWidth="1.1" fill="none">
      <circle cx={s*.5} cy={s*.55} r={s*.22}/><circle cx={s*.5} cy={s*.55} r={s*.08}/>
      {Array.from({length:8}).map((_,i)=>{const a=(i/8)*Math.PI*2;const x1=s*.5+Math.cos(a)*s*.28;const y1=s*.55+Math.sin(a)*s*.28;const x2=s*.5+Math.cos(a)*s*.34;const y2=s*.55+Math.sin(a)*s*.34;return <path key={i} d={`M${x1} ${y1} L${x2} ${y2}`}/>;})}</g>,
    plate: <g stroke={color} strokeWidth="1.1" fill="none" strokeLinejoin="round">
      <path d={`M${s*.15} ${s*.55} L${s*.5} ${s*.38} L${s*.85} ${s*.55} L${s*.5} ${s*.72} Z`}/>
      <circle cx={s*.5} cy={s*.55} r={s*.06}/></g>,
    logo: <g stroke={color} strokeWidth="1.2" fill="none"><rect x={s*.25} y={s*.28} width={s*.5} height={s*.44} rx="2"/></g>,
    blade: <g stroke={color} strokeWidth="1.1" fill="none" strokeLinejoin="round">
      <path d={`M${s*.5} ${s*.15} Q${s*.7} ${s*.35} ${s*.65} ${s*.6} Q${s*.55} ${s*.8} ${s*.5} ${s*.85} Q${s*.45} ${s*.8} ${s*.35} ${s*.6} Q${s*.3} ${s*.35} ${s*.5} ${s*.15}`}/></g>,
  };
  return <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ background: 'var(--chip)', borderRadius: 4, border: '1px solid var(--line)' }}>{paths[kind] || paths.cube}</svg>;
}

function AccountHeader() {
  const { t, lang, setLang } = useT();
  const [open, setOpen] = useS(false);
  return (
    <header style={{
      gridArea: 'header', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', borderBottom: '1px solid var(--line)', background: 'var(--bg)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="Quote Page.html" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit' }}>
          <img src="assets/pmd-logo.png" alt="Print My Design" style={{ height: 28, width: 'auto', display: 'block' }} />
        </a>
        <div style={{ width: 1, height: 20, background: 'var(--line)' }}/>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)' }}>
          {t.account?.account}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <a href="Quote Page.html" style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none' }}>
          ← {t.account?.backToQuote}
        </a>
        <div style={{ width: 1, height: 20, background: 'var(--line)' }}/>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setOpen(o => !o)}
            style={{ background: 'transparent', border: '1px solid var(--line)', borderRadius: 4,
              padding: '4px 8px', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--mono)',
              display: 'flex', alignItems: 'center', gap: 4, letterSpacing: 0.5 }}>
            {LANG_META[lang]?.label || lang.toUpperCase()} <IconChevron size={10}/>
          </button>
          {open && (
            <div style={{ position: 'absolute', top: 30, right: 0, background: 'var(--bg)',
              border: '1px solid var(--line)', borderRadius: 6, boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
              minWidth: 160, zIndex: 50, overflow: 'hidden' }}>
              {Object.entries(LANG_META).map(([code, m]) => (
                <button key={code} onClick={() => { setLang(code); setOpen(false); }}
                  style={{ display: 'flex', width: '100%', padding: '8px 12px', fontSize: 12,
                    background: lang === code ? 'var(--chip)' : 'transparent', border: 'none',
                    textAlign: 'left', cursor: 'pointer', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', width: 20 }}>{m.label}</span>
                  <span>{m.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent',
          border: '1px solid var(--line)', borderRadius: 20, padding: '3px 10px 3px 3px', cursor: 'pointer' }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--ink)', color: 'var(--bg)',
            display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700 }}>SW</div>
          <span style={{ fontSize: 12, fontWeight: 500 }}>สมชาย</span>
        </button>
      </div>
    </header>
  );
}

const NAV_SECTIONS = [
  { group: 'personal', items: [{ id: 'profile', icon: IconUser },{ id: 'addresses', icon: IconPin },{ id: 'billing', icon: IconBuilding }]},
  { group: 'commerce', items: [{ id: 'models', icon: IconCube },{ id: 'orders', icon: IconTruck },{ id: 'quotes', icon: IconDocument },{ id: 'payments', icon: IconCard }]},
  { group: 'workspace', items: [{ id: 'notifications', icon: IconBell },{ id: 'team', icon: IconTeam }]},
];

function AccountSidebar({ active, setActive, collapsed, counters }) {
  const { t } = useT();
  const tA = t.account || {};
  return (
    <aside style={{ gridArea: 'sidebar', background: 'var(--card)', borderRight: '1px solid var(--line)',
      display: 'flex', flexDirection: 'column', overflow: 'auto', padding: collapsed ? '16px 6px' : '20px 0' }}>
      <div style={{ padding: collapsed ? '0 4px' : '0 20px', marginBottom: 16 }}>
        {!collapsed && (<>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>บริษัท · Business</div>
          <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>Siam Innovation Co., Ltd.</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>TAX ID 0-1055-61234-56-7</div>
        </>)}
      </div>
      {NAV_SECTIONS.map(sec => (
        <div key={sec.group} style={{ marginBottom: 4 }}>
          {!collapsed && (
            <div style={{ padding: '10px 20px 6px', fontFamily: 'var(--mono)', fontSize: 10,
              letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)' }}>
              {tA.groups?.[sec.group]}
            </div>
          )}
          {sec.items.map(item => {
            const Ic = item.icon;
            const isActive = active === item.id;
            const count = counters?.[item.id];
            return (
              <button key={item.id} onClick={() => setActive(item.id)}
                title={collapsed ? tA.sections?.[item.id] : undefined}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: collapsed ? '10px' : '8px 20px',
                  background: isActive ? 'var(--bg)' : 'transparent',
                  borderLeft: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
                  border: 'none', borderRadius: 0,
                  color: isActive ? 'var(--accent)' : 'var(--muted)',
                  fontSize: 13, fontWeight: isActive ? 600 : 500, cursor: 'pointer', textAlign: 'left',
                  justifyContent: collapsed ? 'center' : 'flex-start', fontFamily: 'var(--sans)' }}>
                <Ic size={15}/>
                {!collapsed && <span style={{ flex: 1 }}>{tA.sections?.[item.id]}</span>}
                {!collapsed && count != null && (
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)',
                    background: 'var(--chip)', padding: '1px 6px', borderRadius: 8 }}>{count}</span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </aside>
  );
}

function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      paddingBottom: 20, borderBottom: '1px solid var(--line)', marginBottom: 24, gap: 16 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: -0.4 }}>{title}</h1>
        {subtitle && <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{subtitle}</div>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>{actions}</div>}
    </div>
  );
}

function Card({ children, title, subtitle, actions, dense }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--line)',
      borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
      {(title || actions) && (
        <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', borderBottom: '1px solid var(--line)', gap: 12 }}>
          <div>
            {title && <div style={{ fontWeight: 600, fontSize: 13 }}>{title}</div>}
            {subtitle && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{subtitle}</div>}
          </div>
          {actions && <div style={{ display: 'flex', gap: 6 }}>{actions}</div>}
        </div>
      )}
      <div style={{ padding: dense ? 0 : 18 }}>{children}</div>
    </div>
  );
}

function Field({ label, children, hint, span }) {
  return (
    <div style={{ gridColumn: span === 2 ? 'span 2' : undefined, minWidth: 0 }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase',
        color: 'var(--muted)', marginBottom: 6 }}>{label}</div>
      {children}
      {hint && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, mono, readOnly, style }) {
  return <input type="text" value={value || ''} placeholder={placeholder} readOnly={readOnly}
    onChange={e => onChange?.(e.target.value)}
    style={{ width: '100%', padding: '8px 10px',
      background: readOnly ? 'var(--chip)' : 'var(--bg)',
      border: '1px solid var(--line)', borderRadius: 4, fontSize: 13,
      fontFamily: mono ? 'var(--mono)' : 'var(--sans)', color: 'var(--ink)', outline: 'none',
      ...(style || {}) }}/>;
}

function Chip({ children, tone = 'neutral', small }) {
  const tones = {
    neutral: { bg: 'var(--chip)', fg: 'var(--ink)' },
    muted: { bg: 'var(--chip)', fg: 'var(--muted)' },
    accent: { bg: 'oklch(0.95 0.04 150)', fg: 'oklch(0.35 0.12 150)' },
    warn: { bg: 'oklch(0.95 0.06 60)', fg: 'oklch(0.45 0.15 60)' },
    danger: { bg: 'oklch(0.94 0.06 25)', fg: 'oklch(0.45 0.18 25)' },
    blue: { bg: 'oklch(0.94 0.04 255)', fg: 'oklch(0.45 0.15 255)' },
  };
  const c = tones[tone] || tones.neutral;
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
    background: c.bg, color: c.fg, padding: small ? '2px 6px' : '3px 8px', borderRadius: 3,
    fontFamily: 'var(--mono)', fontSize: small ? 10 : 11, letterSpacing: 0.3, fontWeight: 500 }}>{children}</span>;
}

function EmptyState({ icon, title, desc, actionLabel, onAction }) {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--muted)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--chip)',
        display: 'grid', placeItems: 'center', color: 'var(--muted)' }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{title}</div>
      {desc && <div style={{ fontSize: 13, maxWidth: 320 }}>{desc}</div>}
      {onAction && <button className="btn-primary" onClick={onAction} style={{ marginTop: 6 }}>{actionLabel}</button>}
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange?.(!on)}
      style={{ width: 32, height: 18, borderRadius: 9, border: '1px solid var(--line)',
        background: on ? 'var(--ink)' : 'var(--chip)', position: 'relative', cursor: 'pointer', padding: 0 }}>
      <div style={{ position: 'absolute', top: 1, left: on ? 15 : 1, width: 14, height: 14,
        borderRadius: '50%', background: 'var(--bg)', transition: 'left .15s',
        boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}/>
    </button>
  );
}

Object.assign(window, { AccountHeader, AccountSidebar, PageHeader, Card, Field, TextInput, Chip, EmptyState, Toggle, ThumbGlyph, NAV_SECTIONS });
