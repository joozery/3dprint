// Admin shell: sidebar + topbar + page chrome
const { useState: useStateShell } = React;

const NAV_GROUPS = [
  {
    title: 'ภาพรวม',
    items: [
      { id: 'dashboard',  label: 'Dashboard',   hint: 'รายได้ · KPI · กราฟ' },
    ],
  },
  {
    title: 'การดำเนินงาน',
    items: [
      { id: 'orders',     label: 'Orders',      hint: 'คำสั่งซื้อ' },
      { id: 'quotations', label: 'Quotations',  hint: 'ใบเสนอราคา' },
      { id: 'users',      label: 'Users',       hint: 'ลูกค้า + พนักงาน' },
      { id: 'files',      label: '3D Files',    hint: 'คลังไฟล์ STL/STEP' },
    ],
  },
  {
    title: 'แคตตาล็อก',
    items: [
      { id: 'technologies', label: 'Technologies', hint: '3D printing tech + วัสดุ + สี + post-proc' },
      { id: 'cost',         label: 'Cost & Markup', hint: 'ต้นทุน + กำไร per tech' },
      { id: 'shipping',     label: 'Shipping',    hint: 'ผู้ให้บริการขนส่ง' },
    ],
  },
  {
    title: 'ระบบ',
    items: [
      { id: 'slicer',     label: 'PrusaSlicer', hint: 'CLI + เครื่องพิมพ์' },
      { id: 'api',        label: 'API & Webhooks', hint: 'integrations' },
      { id: 'storage',    label: 'Storage & Jobs', hint: 'S3 + cron' },
    ],
  },
];

function AdminShell({ section, setSection, role, setRole, theme, setTheme, children }) {
  const current = NAV_GROUPS.flatMap(g => g.items).find(i => i.id === section);
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '232px 1fr', gridTemplateRows: '52px 1fr',
      gridTemplateAreas: '"side top" "side main"',
      height: '100vh', background: 'var(--bg)', color: 'var(--ink)',
    }}>
      <Sidebar section={section} setSection={setSection} />
      <Topbar current={current} role={role} setRole={setRole} theme={theme} setTheme={setTheme} />
      <main style={{ gridArea: 'main', overflow: 'auto', padding: 0 }}>
        {children}
      </main>
    </div>
  );
}

function Sidebar({ section, setSection }) {
  return (
    <aside style={{
      gridArea: 'side', borderRight: '1px solid var(--line)', background: 'var(--bg-2)',
      display: 'flex', flexDirection: 'column', minHeight: 0,
    }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)',
        display: 'flex', alignItems: 'center', gap: 10 }}>
        <a href="Quote Page.html" style={{ display: 'block' }}>
          <img src="assets/pmd-logo.png" alt="Print My Design"
            style={{ height: 26, width: 'auto', display: 'block' }} />
        </a>
        <span style={{ marginLeft: 'auto', fontSize: 9, fontFamily: 'var(--mono)',
          fontWeight: 700, padding: '2px 6px', borderRadius: 3,
          background: 'var(--accent)', color: '#fff', letterSpacing: 0.6 }}>ADMIN</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px 16px' }}>
        {NAV_GROUPS.map((g, gi) => (
          <div key={gi} style={{ marginTop: gi === 0 ? 4 : 14 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase',
              color: 'var(--muted)', padding: '0 10px 4px' }}>{g.title}</div>
            {g.items.map(it => {
              const active = section === it.id;
              return (
                <button key={it.id} onClick={() => setSection(it.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                    width: '100%', textAlign: 'left', padding: '7px 10px',
                    border: 0, borderRadius: 6, cursor: 'pointer',
                    background: active ? 'var(--accent)' : 'transparent',
                    color: active ? '#fff' : 'var(--ink)',
                    marginBottom: 1,
                  }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{it.label}</span>
                  <span style={{ fontSize: 10, color: active ? 'rgba(255,255,255,0.78)' : 'var(--muted)',
                    fontWeight: 500 }}>{it.hint}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--line)', padding: '10px 12px',
        display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%',
          background: 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center',
          fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700 }}>NT</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
            overflow: 'hidden', textOverflow: 'ellipsis' }}>Niran T.</div>
          <div style={{ fontSize: 10, color: 'var(--muted)' }}>niran@printmydesign.net</div>
        </div>
        <button className="btn ghost sm" title="Sign out" style={{ padding: 4 }}>↗</button>
      </div>
    </aside>
  );
}

function Topbar({ current, role, setRole, theme, setTheme }) {
  return (
    <header style={{
      gridArea: 'top', borderBottom: '1px solid var(--line)', background: 'var(--card)',
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14, minWidth: 0,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2,
          color: 'var(--muted)', textTransform: 'uppercase' }}>
          {current?.hint || ''}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.1 }}>
          {current?.label || 'Admin'}
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <input className="input" placeholder="ค้นหา orders, quotes, users..."
          style={{ width: 320, paddingLeft: 30 }} />
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
          fontSize: 13, color: 'var(--muted)' }}>⌕</span>
        <span className="kbd" style={{ position: 'absolute', right: 8, top: '50%',
          transform: 'translateY(-50%)' }}>⌘K</span>
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        {[['admin','Admin'],['ops','Ops'],['finance','Finance']].map(([k, lbl]) => (
          <button key={k} onClick={() => setRole(k)}
            style={{
              fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 5,
              border: '1px solid ' + (role === k ? 'var(--accent)' : 'var(--line)'),
              background: role === k ? 'color-mix(in oklch, var(--accent) 12%, transparent)' : 'transparent',
              color: role === k ? 'var(--accent)' : 'var(--muted)',
              cursor: 'pointer',
            }}>{lbl}</button>
        ))}
      </div>

      <button className="btn ghost sm" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        title="Theme">{theme === 'light' ? '☾' : '☀'}</button>

      <button style={{
        position: 'relative', width: 32, height: 32, border: '1px solid var(--line)',
        borderRadius: 6, background: 'transparent', cursor: 'pointer', color: 'var(--ink)',
      }} title="Notifications">🔔
        <span style={{ position: 'absolute', top: -3, right: -3, minWidth: 16, height: 16,
          padding: '0 4px', background: 'var(--danger)', color: '#fff', fontSize: 9,
          fontWeight: 700, borderRadius: 99, display: 'grid', placeItems: 'center',
          fontFamily: 'var(--mono)' }}>4</span>
      </button>
    </header>
  );
}

window.AdminShell = AdminShell;
