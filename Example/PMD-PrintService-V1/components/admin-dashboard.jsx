// Admin dashboard — KPIs, sparkline, ops queue, breakdowns
const A = window.ADMIN;

function Sparkline({ data, w = 220, h = 44, color = 'var(--accent)' }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 4) - 2}`).join(' ');
  const area = `0,${h} ${pts} ${w},${h}`;
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polygon points={area} fill={color} opacity={0.12} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} />
      <circle cx={(data.length - 1) * step} cy={h - ((data[data.length - 1] - min) / range) * (h - 4) - 2}
        r={3} fill={color} />
    </svg>
  );
}

function Bars({ data, h = 60 }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: h }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, height: `${(v / max) * 100}%`,
          background: v > 0 ? 'var(--accent)' : 'var(--chip)',
          opacity: v > 0 ? (0.4 + 0.6 * (v / max)) : 1, borderRadius: 2, minHeight: 2 }} />
      ))}
    </div>
  );
}

function Card({ children, style, ...props }) {
  return <div {...props} style={{
    background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 10, ...style,
  }}>{children}</div>;
}

function StatusPill({ k }) {
  const s = A.STATUS[k] || A.STATUS.queue;
  return <span className="pill" style={{ background: s.bg, color: s.fg }}>{s.label}</span>;
}

function Delta({ v, suffix = '%' }) {
  const pos = v > 0;
  return <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--mono)',
    color: v === 0 ? 'var(--muted)' : pos ? 'var(--positive)' : 'var(--danger)' }}>
    {v > 0 ? '▲' : v < 0 ? '▼' : '·'} {Math.abs(v)}{suffix}
  </span>;
}

function AdminDashboard() {
  const k = A.kpi;
  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Hero KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <KpiCard label="รายได้วันนี้" value={A.fmt.THB(k.revenueDay)} delta={k.revenueDayDelta}
          chart={<Sparkline data={k.revenueSeries} />} />
        <KpiCard label="รายได้สัปดาห์นี้" value={A.fmt.THB(k.revenueWeek)} delta={k.revenueWeekDelta}
          chart={<Sparkline data={k.revenueSeries.slice(-7)} color="var(--positive)" />} />
        <KpiCard label="คำสั่งซื้อวันนี้" value={k.ordersDay} delta={k.ordersDayDelta} suffix=" orders"
          chart={<Bars data={k.ordersByHour} h={44} />} />
        <KpiCard label="Avg ticket (30d)" value={A.fmt.THB(k.avgTicket)} delta={k.avgTicketDelta}
          chart={<Sparkline data={k.revenueSeries.map(v => v / 30)} color="oklch(0.55 0.15 65)" />} />
      </div>

      {/* Ops snapshot bar */}
      <Card style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 28 }}>
        <OpsStat label="Pending" value={k.pending} fg="oklch(0.55 0.15 65)" />
        <Sep />
        <OpsStat label="Printing now" value={k.printingNow} fg="var(--accent)" />
        <Sep />
        <OpsStat label="QA queue" value={k.qaQueue} fg="oklch(0.55 0.15 65)" />
        <Sep />
        <OpsStat label="Ship today" value={k.shipToday} fg="var(--positive)" />
        <Sep />
        <OpsStat label="Unpaid" value={k.unpaid} sub={A.fmt.THB(k.unpaidValue)} fg="var(--danger)" />
        <Sep />
        <OpsStat label="New customers" value={k.newCustomers} fg="var(--ink)" />
        <Sep />
        <OpsStat label="Refunds (24h)" value={k.refunds} fg="var(--ink)" />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button className="btn">Export CSV</button>
          <button className="btn primary">+ New manual order</button>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14 }}>
        {/* Recent orders */}
        <Card>
          <CardHead title="คำสั่งซื้อล่าสุด" extra={<a href="#" onClick={e=>e.preventDefault()}
            style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            ดูทั้งหมด →</a>} />
          <table>
            <thead>
              <tr style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                <Th>Order</Th><Th>Customer</Th><Th>Items</Th><Th>Process</Th><Th>Status</Th><Th right>Total</Th>
              </tr>
            </thead>
            <tbody>
              {A.orders.slice(0, 8).map(o => (
                <tr key={o.id} style={{ borderTop: '1px solid var(--line-soft)' }}>
                  <Td><span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{o.id}</span>
                    <div style={{ fontSize: 10, color: 'var(--muted)' }}>{o.date.split(' ').slice(-1)[0]}</div>
                  </Td>
                  <Td>{o.customer}</Td>
                  <Td><span className="num">{o.items}</span> <span style={{ color: 'var(--muted)', fontSize: 10 }}>· {o.weight}g</span></Td>
                  <Td><span className="mono" style={{ fontSize: 10, padding: '1px 5px',
                    border: '1px solid var(--line)', borderRadius: 3 }}>{o.proc}</span></Td>
                  <Td><StatusPill k={o.status} /></Td>
                  <Td right><span className="num" style={{ fontWeight: 600 }}>{A.fmt.THB(o.total)}</span></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Right column: breakdowns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card>
            <CardHead title="Top materials (เดือนนี้)" sub={`รวม ${A.kpi.topMaterials.reduce((s,m)=>s+m.kg,0).toFixed(1)} kg`} />
            <div style={{ padding: '4px 18px 16px', display: 'flex', flexDirection: 'column', gap: 9 }}>
              {A.kpi.topMaterials.map((m, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    fontSize: 12, marginBottom: 3 }}>
                    <span style={{ fontWeight: 500 }}>{m.name}</span>
                    <span className="num" style={{ color: 'var(--muted)' }}>{m.kg} kg · {m.pct}%</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${m.pct * 2.2}%`,
                      background: i === 0 ? 'var(--accent)' : i === 1 ? 'var(--positive)' :
                        'color-mix(in oklch, var(--accent) ' + (50 - i * 8) + '%, var(--chip))' }}/>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHead title="Process mix (30d)" />
            <div style={{ padding: '4px 18px 16px' }}>
              <div style={{ display: 'flex', height: 26, borderRadius: 4, overflow: 'hidden',
                border: '1px solid var(--line)' }}>
                {A.kpi.procMix.map((p, i) => (
                  <div key={p.name} style={{ flex: p.pct,
                    background: ['var(--accent)','var(--positive)','#683888','var(--chip)'][i],
                    color: i < 3 ? '#fff' : 'var(--muted)',
                    fontSize: 10, fontWeight: 700, fontFamily: 'var(--mono)',
                    display: 'grid', placeItems: 'center' }}>{p.pct}%</div>
                ))}
              </div>
              <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 11 }}>
                {A.kpi.procMix.map((p, i) => (
                  <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2,
                      background: ['var(--accent)','var(--positive)','#683888','var(--chip)'][i] }}/>
                    {p.name} <span style={{ color: 'var(--muted)' }}>{p.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <CardHead title="ระบบสุขภาพ" />
            <div style={{ padding: '4px 18px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <HealthRow label="CPU"  v={A.storage.health.cpu} />
              <HealthRow label="Memory" v={A.storage.health.mem} />
              <HealthRow label="Disk" v={A.storage.health.disk} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11,
                paddingTop: 6, borderTop: '1px solid var(--line-soft)' }}>
                <span style={{ color: 'var(--muted)' }}>Slice queue</span>
                <span><span className="num" style={{ fontWeight: 600 }}>{A.storage.health.sliceQueue.running}</span> running ·
                  <span className="num" style={{ fontWeight: 600 }}> {A.storage.health.sliceQueue.queued}</span> queued</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: 'var(--muted)' }}>Uptime</span>
                <span className="num">{A.storage.health.uptime}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, delta, suffix, chart }) {
  return (
    <Card style={{ padding: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.8,
        color: 'var(--muted)', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
        <span className="num" style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4 }}>{value}{suffix || ''}</span>
        <Delta v={delta} />
      </div>
      <div style={{ marginTop: 8 }}>{chart}</div>
    </Card>
  );
}

function OpsStat({ label, value, sub, fg }) {
  return (
    <div style={{ minWidth: 88 }}>
      <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: fg, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{sub}</div>}
    </div>
  );
}

function Sep() { return <div style={{ width: 1, height: 32, background: 'var(--line)' }} />; }
function CardHead({ title, sub, extra }) {
  return <div style={{ padding: '12px 18px 10px', display: 'flex', alignItems: 'baseline',
    justifyContent: 'space-between', borderBottom: '1px solid var(--line-soft)' }}>
    <div>
      <div style={{ fontSize: 13, fontWeight: 700 }}>{title}</div>
      {sub && <div style={{ fontSize: 10, color: 'var(--muted)' }}>{sub}</div>}
    </div>
    {extra}
  </div>;
}
function Th({ children, right }) {
  return <th style={{ textAlign: right ? 'right' : 'left', padding: '10px 18px',
    fontSize: 10, fontWeight: 600 }}>{children}</th>;
}
function Td({ children, right }) {
  return <td style={{ textAlign: right ? 'right' : 'left', padding: '10px 18px',
    fontSize: 12, verticalAlign: 'top' }}>{children}</td>;
}
function HealthRow({ label, v }) {
  const color = v > 80 ? 'var(--danger)' : v > 60 ? 'oklch(0.7 0.16 65)' : 'var(--positive)';
  return <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
      <span style={{ color: 'var(--muted)' }}>{label}</span>
      <span className="num" style={{ fontWeight: 600 }}>{v}%</span>
    </div>
    <div className="bar-track"><div className="bar-fill" style={{ width: v + '%', background: color }} /></div>
  </div>;
}

window.AdminDashboard = AdminDashboard;
window.AdminCard = Card;
window.AdminCardHead = CardHead;
window.AdminTh = Th;
window.AdminTd = Td;
window.AdminStatusPill = StatusPill;
window.AdminSparkline = Sparkline;
