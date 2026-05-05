// Admin orders + quotations + users + files
const { useState: useStateOrders, useMemo: useMemoOrders } = React;
const AO = window.ADMIN;
const Card2 = window.AdminCard;
const CardHead2 = window.AdminCardHead;
const Th2 = window.AdminTh;
const Td2 = window.AdminTd;
const StatusPill2 = window.AdminStatusPill;

function FilterBar({ children, right }) {
  return <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center',
    gap: 8, flexWrap: 'wrap', borderBottom: '1px solid var(--line-soft)' }}>
    {children}
    <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>{right}</div>
  </div>;
}

function Chip({ active, onClick, children, count }) {
  return <button onClick={onClick} style={{
    fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 99,
    border: '1px solid ' + (active ? 'var(--accent)' : 'var(--line)'),
    background: active ? 'color-mix(in oklch, var(--accent) 14%, transparent)' : 'var(--card)',
    color: active ? 'var(--accent)' : 'var(--ink)', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 5,
  }}>
    {children}
    {count != null && <span style={{ fontFamily: 'var(--mono)', fontSize: 10,
      color: active ? 'var(--accent)' : 'var(--muted)' }}>{count}</span>}
  </button>;
}

/* ─── ORDERS ─── */
function AdminOrders() {
  const [filter, setFilter] = useStateOrders('all');
  const [selected, setSelected] = useStateOrders(null);
  const counts = useMemoOrders(() => {
    const c = { all: AO.orders.length };
    AO.orders.forEach(o => { c[o.status] = (c[o.status] || 0) + 1; });
    return c;
  }, []);
  const list = filter === 'all' ? AO.orders : AO.orders.filter(o => o.status === filter);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 420px' : '1fr', height: '100%' }}>
      <div style={{ padding: 20, overflow: 'auto' }}>
        <Card2>
          <FilterBar right={<>
            <button className="btn">Export</button>
            <button className="btn primary">+ Manual order</button>
          </>}>
            <Chip active={filter==='all'} onClick={()=>setFilter('all')} count={counts.all}>ทั้งหมด</Chip>
            {['unpaid','queue','printing','post','qa','shipped','delivered','cancelled'].map(s => (
              <Chip key={s} active={filter===s} onClick={()=>setFilter(s)} count={counts[s] || 0}>
                {AO.STATUS[s].label}
              </Chip>
            ))}
            <span style={{ width: 1, height: 18, background: 'var(--line)', margin: '0 4px' }} />
            <input className="input" placeholder="Search ID, customer, tracking..." style={{ width: 240 }} />
          </FilterBar>
          <table>
            <thead>
              <tr style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>
                <Th2><input type="checkbox" /></Th2>
                <Th2>Order</Th2><Th2>Customer</Th2><Th2>Process · Material</Th2>
                <Th2>Items</Th2><Th2>Ship</Th2><Th2>Status</Th2><Th2 right>Total</Th2>
              </tr>
            </thead>
            <tbody>
              {list.map(o => (
                <tr key={o.id} onClick={()=>setSelected(o)}
                  style={{ borderTop: '1px solid var(--line-soft)', cursor: 'pointer',
                    background: selected?.id === o.id ? 'color-mix(in oklch, var(--accent) 6%, transparent)' : 'transparent' }}>
                  <Td2><input type="checkbox" onClick={e=>e.stopPropagation()} /></Td2>
                  <Td2>
                    <div className="mono" style={{ fontSize: 11, fontWeight: 700 }}>{o.id}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)' }}>{o.date}</div>
                  </Td2>
                  <Td2>
                    <div style={{ fontWeight: 500 }}>{o.customer}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)' }}>{o.email}</div>
                  </Td2>
                  <Td2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="mono" style={{ fontSize: 10, padding: '1px 5px',
                        border: '1px solid var(--line)', borderRadius: 3 }}>{o.proc}</span>
                      <span style={{ width: 10, height: 10, borderRadius: '50%',
                        background: o.color, border: '1px solid var(--line)' }} />
                      <span style={{ fontSize: 11 }}>{o.material}</span>
                    </div>
                  </Td2>
                  <Td2><span className="num">{o.items}</span>
                    <span style={{ color: 'var(--muted)', fontSize: 10 }}> · {o.weight}g</span></Td2>
                  <Td2 style={{ fontSize: 11 }}>
                    {o.ship === '—' ? <span style={{ color: 'var(--muted)' }}>—</span> : <>
                      <div>{o.ship}</div>
                      {o.track !== '—' && <div className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{o.track}</div>}
                    </>}
                  </Td2>
                  <Td2><StatusPill2 k={o.status} />
                    {!o.paid && <div style={{ fontSize: 10, color: 'var(--danger)', marginTop: 2 }}>● ยังไม่ชำระ</div>}
                  </Td2>
                  <Td2 right><span className="num" style={{ fontWeight: 600 }}>{AO.fmt.THB(o.total)}</span></Td2>
                </tr>
              ))}
            </tbody>
          </table>
        </Card2>
      </div>

      {selected && <OrderDrawer order={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}

function OrderDrawer({ order, onClose }) {
  const stages = ['queue','printing','post','qa','shipped','delivered'];
  const stageIdx = stages.indexOf(order.status);
  return (
    <aside style={{ borderLeft: '1px solid var(--line)', background: 'var(--card)',
      overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)',
        display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div className="mono" style={{ fontSize: 12, fontWeight: 700 }}>{order.id}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>{order.date}</div>
        </div>
        <StatusPill2 k={order.status} />
        <button className="btn ghost sm" onClick={onClose}>✕</button>
      </div>

      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Pipeline */}
        <div>
          <div className="label">Pipeline</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 }}>
            {stages.map((s, i) => (
              <div key={s} style={{
                padding: '6px 4px', textAlign: 'center', fontSize: 10, fontWeight: 600,
                background: i <= stageIdx ? 'var(--accent)' : 'var(--chip)',
                color: i <= stageIdx ? '#fff' : 'var(--muted)',
                borderRadius: 3,
              }}>{AO.STATUS[s].label}</div>
            ))}
          </div>
        </div>

        {/* Customer */}
        <Section title="ลูกค้า">
          <div style={{ fontSize: 13, fontWeight: 600 }}>{order.customer}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>{order.email}</div>
          <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
            <button className="btn sm">View profile</button>
            <button className="btn sm ghost">Email</button>
          </div>
        </Section>

        {/* Line items mock */}
        <Section title={`Line items (${order.items})`}>
          {Array.from({ length: Math.min(order.items, 3) }).map((_, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '36px 1fr auto',
              gap: 10, padding: '8px 0', borderTop: i ? '1px solid var(--line-soft)' : 0 }}>
              <div style={{ width: 36, height: 36, background: 'var(--chip)',
                borderRadius: 4, display: 'grid', placeItems: 'center', fontSize: 10,
                color: 'var(--muted)' }}>STL</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>part_{order.id.slice(-3)}_{i+1}.stl</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>
                  {order.material} · {order.proc} · 0.2mm · 20% infill</div>
              </div>
              <div className="num" style={{ fontSize: 11, fontWeight: 600, textAlign: 'right' }}>
                {AO.fmt.THB(order.total / order.items)}
              </div>
            </div>
          ))}
          {order.items > 3 && <div style={{ fontSize: 11, color: 'var(--muted)',
            textAlign: 'center', padding: '6px 0' }}>+ อีก {order.items - 3} รายการ</div>}
        </Section>

        {/* Totals */}
        <Section title="ยอดรวม">
          <Row k="Subtotal" v={AO.fmt.THB(order.total / 1.07)} />
          <Row k="VAT 7%"   v={AO.fmt.THB(order.total - order.total / 1.07)} />
          <Row k="Total" v={AO.fmt.THB(order.total)} bold />
          <div style={{ marginTop: 4, fontSize: 11, color: order.paid ? 'var(--positive)' : 'var(--danger)' }}>
            {order.paid ? '● ชำระแล้ว' : '● รอชำระ'}
          </div>
        </Section>

        {/* Shipping */}
        <Section title="การจัดส่ง">
          <Row k="Provider" v={order.ship === '—' ? '—' : order.ship} />
          {order.track !== '—' && <Row k="Tracking" v={<span className="mono" style={{ fontSize: 11 }}>{order.track}</span>} />}
        </Section>

        {order.note && <Section title="หมายเหตุ">
          <div style={{ fontSize: 12, padding: 10, background: 'var(--bg-2)',
            borderRadius: 6, border: '1px solid var(--line-soft)' }}>{order.note}</div>
        </Section>}

        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          <button className="btn primary" style={{ flex: 1 }}>Advance status →</button>
          <button className="btn">Print job</button>
          <button className="btn danger sm">Cancel</button>
        </div>
      </div>
    </aside>
  );
}

function Section({ title, children }) {
  return <div>
    <div className="label">{title}</div>
    {children}
  </div>;
}
function Row({ k, v, bold }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between',
    padding: '4px 0', fontSize: bold ? 13 : 12, fontWeight: bold ? 700 : 400 }}>
    <span style={{ color: bold ? 'var(--ink)' : 'var(--muted)' }}>{k}</span>
    <span className="num" style={{ fontWeight: bold ? 700 : 500 }}>{v}</span>
  </div>;
}

/* ─── QUOTATIONS ─── */
function AdminQuotations() {
  const [filter, setFilter] = useStateOrders('all');
  const list = filter === 'all' ? AO.quotations : AO.quotations.filter(q => q.status === filter);
  return <div style={{ padding: 20 }}>
    <Card2>
      <FilterBar right={<>
        <button className="btn">Export</button>
        <button className="btn primary">+ New quotation</button>
      </>}>
        <Chip active={filter==='all'} onClick={()=>setFilter('all')}>ทั้งหมด</Chip>
        {['draft','sent','won','lost','expired'].map(s => (
          <Chip key={s} active={filter===s} onClick={()=>setFilter(s)}>{AO.STATUS[s].label}</Chip>
        ))}
      </FilterBar>
      <table>
        <thead>
          <tr style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>
            <Th2>Quote</Th2><Th2>Customer</Th2><Th2>Items</Th2><Th2>Source</Th2>
            <Th2>Owner</Th2><Th2>Valid until</Th2><Th2>Status</Th2><Th2 right>Total</Th2><Th2></Th2>
          </tr>
        </thead>
        <tbody>
          {list.map(q => (
            <tr key={q.id} style={{ borderTop: '1px solid var(--line-soft)' }}>
              <Td2><span className="mono" style={{ fontSize: 11, fontWeight: 700 }}>{q.id}</span>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{q.date}</div></Td2>
              <Td2>{q.customer}<div style={{ fontSize: 10, color: 'var(--muted)' }}>{q.email}</div></Td2>
              <Td2><span className="num">{q.items}</span></Td2>
              <Td2><span className="mono" style={{ fontSize: 10 }}>{q.source}</span></Td2>
              <Td2>{q.owner}</Td2>
              <Td2>{q.valid}</Td2>
              <Td2><StatusPill2 k={q.status} />
                {q.lostReason && <div style={{ fontSize: 10, color: 'var(--muted)' }}>{q.lostReason}</div>}
              </Td2>
              <Td2 right><span className="num" style={{ fontWeight: 600 }}>{AO.fmt.THB(q.total)}</span></Td2>
              <Td2><button className="btn sm ghost">⋯</button></Td2>
            </tr>
          ))}
        </tbody>
      </table>
    </Card2>
  </div>;
}

/* ─── USERS ─── */
function AdminUsers() {
  const [tab, setTab] = useStateOrders('customer');
  const list = AO.users.filter(u => tab === 'all' ? true : u.role === tab);
  return <div style={{ padding: 20 }}>
    <Card2>
      <FilterBar right={<>
        <button className="btn">Export</button>
        <button className="btn primary">+ Invite</button>
      </>}>
        <Chip active={tab==='customer'} onClick={()=>setTab('customer')}
          count={AO.users.filter(u=>u.role==='customer').length}>Customers</Chip>
        <Chip active={tab==='admin'} onClick={()=>setTab('admin')}
          count={AO.users.filter(u=>u.role==='admin').length}>Admins</Chip>
        <Chip active={tab==='ops'} onClick={()=>setTab('ops')}
          count={AO.users.filter(u=>u.role==='ops').length}>Ops</Chip>
        <Chip active={tab==='sales'} onClick={()=>setTab('sales')}
          count={AO.users.filter(u=>u.role==='sales').length}>Sales</Chip>
        <Chip active={tab==='all'} onClick={()=>setTab('all')}>All</Chip>
      </FilterBar>
      <table>
        <thead>
          <tr style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>
            <Th2>User</Th2><Th2>Role</Th2><Th2>Tier</Th2><Th2 right>Orders</Th2>
            <Th2 right>Total spent</Th2><Th2>Joined</Th2><Th2>Last active</Th2><Th2>Status</Th2><Th2></Th2>
          </tr>
        </thead>
        <tbody>
          {list.map(u => (
            <tr key={u.id} style={{ borderTop: '1px solid var(--line-soft)' }}>
              <Td2>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--chip)', color: 'var(--ink)', display: 'grid',
                    placeItems: 'center', fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700 }}>
                    {u.name.split(' ').slice(0,2).map(s => s[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500 }}>{u.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)' }}>{u.email}</div>
                  </div>
                </div>
              </Td2>
              <Td2><span className="mono" style={{ fontSize: 10, padding: '1px 5px',
                border: '1px solid var(--line)', borderRadius: 3,
                color: u.role === 'admin' ? 'var(--accent)' : 'var(--muted2)' }}>
                {u.role}</span></Td2>
              <Td2><span style={{ fontSize: 11, fontWeight: 600,
                color: u.tier === 'Gold' ? 'oklch(0.65 0.15 65)' :
                       u.tier === 'B2B' ? 'var(--accent)' :
                       u.tier === 'Silver' ? 'var(--muted2)' : 'var(--muted)' }}>{u.tier}</span></Td2>
              <Td2 right><span className="num">{u.orders}</span></Td2>
              <Td2 right><span className="num" style={{ fontWeight: 600 }}>{AO.fmt.THB(u.spend)}</span></Td2>
              <Td2 style={{ fontSize: 11 }}>{u.joined}</Td2>
              <Td2 style={{ fontSize: 11, color: 'var(--muted)' }}>{u.last}</Td2>
              <Td2><StatusPill2 k={u.status === 'banned' ? 'cancelled' : u.status === 'pending' ? 'queue' : 'paid'} /></Td2>
              <Td2><button className="btn sm ghost">⋯</button></Td2>
            </tr>
          ))}
        </tbody>
      </table>
    </Card2>
  </div>;
}

/* ─── 3D FILES ─── */
function AdminFiles() {
  return <div style={{ padding: 20 }}>
    <Card2>
      <FilterBar right={<>
        <button className="btn">Bulk download</button>
        <button className="btn primary">+ Upload</button>
      </>}>
        <Chip active>ทั้งหมด</Chip>
        <Chip>Linked to order</Chip>
        <Chip>Standalone</Chip>
        <Chip>Issues (1)</Chip>
        <input className="input" placeholder="Filter by name, owner..." style={{ width: 240 }} />
      </FilterBar>
      <table>
        <thead>
          <tr style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>
            <Th2>File</Th2><Th2>Owner</Th2><Th2>Order</Th2>
            <Th2 right>Volume</Th2><Th2 right>Triangles</Th2><Th2 right>Size</Th2>
            <Th2>Watertight</Th2><Th2>Uploaded</Th2><Th2></Th2>
          </tr>
        </thead>
        <tbody>
          {AO.files.map(f => (
            <tr key={f.id} style={{ borderTop: '1px solid var(--line-soft)' }}>
              <Td2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, background: 'var(--chip)',
                    borderRadius: 4, display: 'grid', placeItems: 'center',
                    fontSize: 9, fontFamily: 'var(--mono)', fontWeight: 700,
                    color: 'var(--muted)' }}>
                    {f.name.split('.').pop().toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500 }}>{f.name}</div>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{f.id}</div>
                  </div>
                </div>
              </Td2>
              <Td2 style={{ fontSize: 11 }}>{f.owner}</Td2>
              <Td2><span className="mono" style={{ fontSize: 11 }}>{f.order}</span></Td2>
              <Td2 right><span className="num">{f.volume}</span> <span style={{ color: 'var(--muted)', fontSize: 10 }}>cm³</span></Td2>
              <Td2 right><span className="num">{f.tris.toLocaleString()}</span></Td2>
              <Td2 right><span className="num">{f.size}</span> <span style={{ color: 'var(--muted)', fontSize: 10 }}>MB</span></Td2>
              <Td2>{f.watertight
                ? <span className="pill" style={{ background: 'color-mix(in oklch, var(--positive) 18%, transparent)', color: 'var(--positive)' }}>● OK</span>
                : <span className="pill" style={{ background: 'color-mix(in oklch, var(--danger) 14%, transparent)', color: 'var(--danger)' }}>● non-manifold</span>}</Td2>
              <Td2 style={{ fontSize: 11, color: 'var(--muted)' }}>{f.uploaded}</Td2>
              <Td2><button className="btn sm ghost">⋯</button></Td2>
            </tr>
          ))}
        </tbody>
      </table>
    </Card2>
  </div>;
}

window.AdminOrders = AdminOrders;
window.AdminQuotations = AdminQuotations;
window.AdminUsers = AdminUsers;
window.AdminFiles = AdminFiles;
window.AdminFilterBar = FilterBar;
window.AdminChip = Chip;
window.AdminSection = Section;
window.AdminRow = Row;
