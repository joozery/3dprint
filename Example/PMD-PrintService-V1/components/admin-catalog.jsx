// Admin catalog: Technologies (master-detail), Cost & markup, Shipping
const { useState: useStateCat } = React;
const AC = window.ADMIN;
const Card3 = window.AdminCard;
const FilterBar3 = window.AdminFilterBar;
const Chip3 = window.AdminChip;
const Th3 = window.AdminTh;
const Td3 = window.AdminTd;

/* ─── TECHNOLOGIES (master-detail) ─── */
function AdminTechnologies() {
  const [techId, setTechId] = useStateCat(AC.technologies[0].id);
  const tech = AC.technologies.find(t => t.id === techId);
  const printers = AC.printers.filter(p => p.tech === techId);
  const materials = AC.materials.filter(m => m.tech === techId);
  const markup = AC.cost.markup[techId];

  return <div style={{ display: 'grid', gridTemplateColumns: '288px 1fr',
    height: '100%', minHeight: 0 }}>

    {/* LEFT — technology list */}
    <aside style={{ borderRight: '1px solid var(--line)', background: 'var(--bg-2)',
      overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--line-soft)' }}>
        <div className="label">Technologies</div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>
          {AC.technologies.filter(t=>t.active).length} active · {AC.technologies.length} total</div>
      </div>
      <div style={{ flex: 1, padding: 10 }}>
        {AC.technologies.map(t => {
          const matCount = AC.materials.filter(m => m.tech === t.id).length;
          const printerCount = AC.printers.filter(p => p.tech === t.id).length;
          const active = t.id === techId;
          return <button key={t.id} onClick={()=>setTechId(t.id)}
            style={{ width: '100%', textAlign: 'left', padding: 12, marginBottom: 4,
              border: '1px solid ' + (active ? t.tone : 'transparent'),
              background: active ? 'var(--card)' : 'transparent', borderRadius: 8,
              cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 32, height: 32, borderRadius: 6,
              background: t.tone, color: '#fff', display: 'grid', placeItems: 'center',
              fontSize: 16, fontWeight: 700, flexShrink: 0 }}>{t.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700,
                color: active ? t.tone : 'var(--ink)' }}>{t.name}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.fullName}</div>
              <div style={{ fontSize: 10, color: 'var(--muted2)',
                marginTop: 4, fontFamily: 'var(--mono)' }}>
                {matCount} mat · {printerCount} printer{printerCount !== 1 ? 's' : ''}</div>
            </div>
            {!t.active && <span className="pill" style={{ background: 'var(--chip)',
              color: 'var(--muted)' }}>off</span>}
          </button>;
        })}
        <button className="btn" style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}>
          + Add technology</button>
      </div>
    </aside>

    {/* RIGHT — detail pane */}
    <div style={{ overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <TechHero tech={tech} markup={markup} />
      <TechPrinters printers={printers} tech={tech} />
      <TechMaterials materials={materials} tech={tech} />
    </div>
  </div>;
}

function TechHero({ tech, markup }) {
  return <div style={{ padding: '18px 24px',
    background: `linear-gradient(135deg, ${tech.tone}10, transparent 60%)`,
    borderBottom: '1px solid var(--line)' }}>
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ width: 56, height: 56, borderRadius: 10,
        background: tech.tone, color: '#fff', display: 'grid', placeItems: 'center',
        fontSize: 28, fontWeight: 700, flexShrink: 0 }}>{tech.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: tech.tone }}>{tech.name}</h2>
          <span style={{ fontSize: 13, color: 'var(--muted2)' }}>{tech.fullName}</span>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>· {tech.nameTh}</span>
        </div>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--muted2)',
          maxWidth: 720, lineHeight: 1.5 }}>{tech.desc}</p>
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)',
          fontFamily: 'var(--mono)' }}>{tech.notes}</div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button className="btn">Edit</button>
        <button className="btn primary">+ Material</button>
      </div>
    </div>

    <div style={{ marginTop: 14, display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
      <Stat label="Material unit" value={tech.materialUnit} />
      <Stat label="Lead time" value={`${tech.leadDays} day${tech.leadDays > 1 ? 's' : ''}`} />
      <Stat label="Material markup" value={markup.material + '%'} fg="var(--accent)" />
      <Stat label="Machine markup" value={markup.machine + '%'} fg="var(--accent)" />
      <Stat label="Min charge" value={'฿' + markup.min.toLocaleString()} fg="var(--ink)" />
    </div>
  </div>;
}

function Stat({ label, value, fg }) {
  return <div style={{ background: 'var(--card)', border: '1px solid var(--line)',
    borderRadius: 8, padding: '8px 12px' }}>
    <div className="label" style={{ marginBottom: 0 }}>{label}</div>
    <div className="num" style={{ fontSize: 16, fontWeight: 700, color: fg || 'var(--ink)',
      letterSpacing: -0.3 }}>{value}</div>
  </div>;
}

function TechPrinters({ printers, tech }) {
  return <div style={{ padding: '16px 24px 0' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between',
      alignItems: 'baseline', marginBottom: 8 }}>
      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Printers</h3>
      <button className="btn sm">+ Add printer</button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: 10 }}>
      {printers.map(p => (
        <div key={p.id} style={{ background: 'var(--card)', border: '1px solid var(--line)',
          borderRadius: 8, padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', marginBottom: 4 }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
              color: tech.tone, padding: '2px 6px', background: tech.tone + '15',
              borderRadius: 3 }}>×{p.count}</span>
          </div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{p.id}</div>
          <div style={{ marginTop: 8, fontSize: 11 }}>
            {p.active
              ? <span className="pill" style={{ background: 'color-mix(in oklch, var(--positive) 18%, transparent)', color: 'var(--positive)' }}>● Online</span>
              : <span className="pill" style={{ background: 'var(--chip)', color: 'var(--muted)' }}>○ Offline</span>}
          </div>
        </div>
      ))}
      {printers.length === 0 && <div style={{ padding: 24, textAlign: 'center',
        color: 'var(--muted)', fontSize: 12, gridColumn: '1/-1',
        background: 'var(--bg-2)', borderRadius: 8, border: '1px dashed var(--line)' }}>
        ยังไม่มีเครื่องพิมพ์ — เพิ่มเครื่องเพื่อเริ่มรับงาน</div>}
    </div>
  </div>;
}

function TechMaterials({ materials, tech }) {
  const [selMat, setSelMat] = useStateCat(materials[0]?.id);
  const mat = materials.find(m => m.id === selMat) || materials[0];
  return <div style={{ padding: '16px 24px 24px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between',
      alignItems: 'baseline', marginBottom: 8 }}>
      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
        Materials <span style={{ fontWeight: 400, color: 'var(--muted)' }}>· {materials.length}</span>
      </h3>
      <div style={{ display: 'flex', gap: 6 }}>
        <button className="btn sm">Bulk price update</button>
        <button className="btn sm primary">+ Add material</button>
      </div>
    </div>

    {materials.length === 0 ? (
      <div style={{ padding: 32, textAlign: 'center', color: 'var(--muted)',
        background: 'var(--bg-2)', borderRadius: 8, border: '1px dashed var(--line)' }}>
        ยังไม่มีวัสดุสำหรับ {tech.name} — เพิ่มวัสดุเพื่อเริ่มขาย</div>
    ) : (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px',
        gap: 14, alignItems: 'flex-start' }}>

        {/* Materials table */}
        <Card3>
          <table>
            <thead>
              <tr style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>
                <Th3>Material</Th3><Th3 right>Stock</Th3>
                <Th3 right>Cost</Th3><Th3 right>Sell</Th3><Th3 right>Margin</Th3>
                <Th3>Status</Th3>
              </tr>
            </thead>
            <tbody>
              {materials.map(m => {
                const margin = ((m.price * 1000 - m.cost) / (m.price * 1000) * 100).toFixed(0);
                const lowStock = m.stock < 5;
                const active = m.id === selMat;
                return <tr key={m.id} onClick={()=>setSelMat(m.id)}
                  style={{ borderTop: '1px solid var(--line-soft)', cursor: 'pointer',
                    background: active ? 'color-mix(in oklch, var(--accent) 6%, transparent)' : 'transparent' }}>
                  <Td3>
                    <div style={{ fontWeight: 600 }}>{m.name}</div>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{m.id}</div>
                  </Td3>
                  <Td3 right>
                    <span className="num" style={{ fontWeight: 600,
                      color: m.stock === 0 ? 'var(--danger)' : lowStock ? 'oklch(0.6 0.16 65)' : 'var(--ink)' }}>
                      {m.stock}</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}> {m.unit}</span>
                  </Td3>
                  <Td3 right><span className="num" style={{ fontSize: 11 }}>฿{m.cost}/{m.unit}</span></Td3>
                  <Td3 right><span className="num" style={{ fontWeight: 600 }}>฿{m.price}/g</span></Td3>
                  <Td3 right><span className="num" style={{ color: 'var(--positive)', fontWeight: 600 }}>{margin}%</span></Td3>
                  <Td3>{m.active
                    ? <span className="pill" style={{ background: 'color-mix(in oklch, var(--positive) 18%, transparent)', color: 'var(--positive)' }}>● On</span>
                    : <span className="pill" style={{ background: 'var(--chip)', color: 'var(--muted)' }}>○ Off</span>}</Td3>
                </tr>;
              })}
            </tbody>
          </table>
        </Card3>

        {/* Material detail panel */}
        {mat && <MaterialDetail mat={mat} tech={tech} />}
      </div>
    )}
  </div>;
}

function MaterialDetail({ mat, tech }) {
  const colors = (mat.colors || []).map(id => AC.colors.find(c => c.id === id)).filter(Boolean);
  const postProc = (mat.postProc || []).map(id => AC.postProc.find(p => p.id === id)).filter(Boolean);
  return <Card3 style={{ padding: 16, position: 'sticky', top: 16 }}>
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 16, fontWeight: 700 }}>{mat.name}</div>
      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{mat.nameTh}</div>
      <div style={{ fontSize: 12, color: 'var(--muted2)', marginTop: 6,
        lineHeight: 1.4 }}>{mat.desc}</div>
    </div>

    {/* Build volume */}
    <Section3 title="Build volume" subtitle="ขอบเขตขนาดที่พิมพ์ได้">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <DimBox label="Min size" v={mat.volume.min} accent="var(--muted)" />
        <DimBox label="Max size" v={mat.volume.max} accent={tech.tone} />
      </div>
      <BuildVolumeViz min={mat.volume.min} max={mat.volume.max} accent={tech.tone} />
    </Section3>

    {/* Available colors */}
    <Section3 title={`Available colors · ${colors.length}`} subtitle="สีที่พร้อมพิมพ์">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {colors.map(c => (
          <div key={c.id} title={c.name} style={{ display: 'flex',
            alignItems: 'center', gap: 6, padding: '4px 8px 4px 4px',
            border: '1px solid var(--line)', borderRadius: 99, fontSize: 11 }}>
            <span style={{ width: 14, height: 14, borderRadius: '50%',
              background: c.hex === 'clear'
                ? 'repeating-linear-gradient(45deg, var(--chip), var(--chip) 3px, var(--card) 3px, var(--card) 6px)'
                : c.hex,
              border: '1px solid var(--line)' }}/>
            {c.name}
          </div>
        ))}
        <button className="btn sm ghost" style={{ borderRadius: 99 }}>+ Add</button>
      </div>
    </Section3>

    {/* Post-processing */}
    <Section3 title={`Post-processing · ${postProc.length}`} subtitle="ขั้นตอนปลายทางที่ใช้กับวัสดุนี้ได้">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {postProc.map(p => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', padding: '8px 10px', background: 'var(--bg-2)',
            border: '1px solid var(--line-soft)', borderRadius: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              {p.default && <span style={{ width: 6, height: 6, borderRadius: '50%',
                background: 'var(--accent)', flexShrink: 0 }}/>}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{p.name}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{p.id}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
              <div className="num" style={{ fontSize: 12, fontWeight: 600 }}>฿{p.cost}</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>+{p.time} min</div>
            </div>
          </div>
        ))}
        <button className="btn sm ghost">+ Link step</button>
      </div>
    </Section3>

    {/* Pricing */}
    <Section3 title="Pricing snapshot">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Stat label={`Cost / ${mat.unit}`} value={'฿' + mat.cost.toLocaleString()} />
        <Stat label="Sell / g" value={'฿' + mat.price} fg={tech.tone} />
        <Stat label="Density" value={mat.density + ' g/cc'} />
        <Stat label="Lead" value={mat.lead + ' day' + (mat.lead > 1 ? 's' : '')} />
      </div>
      <div style={{ marginTop: 8, fontSize: 10, color: 'var(--muted)',
        fontFamily: 'var(--mono)', textAlign: 'right' }}>
        Tech markup: {AC.cost.markup[tech.id].material}% / {AC.cost.markup[tech.id].machine}%
      </div>
    </Section3>

    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
      <button className="btn primary" style={{ flex: 1 }}>Edit material</button>
      <button className="btn">Duplicate</button>
    </div>
  </Card3>;
}

function Section3({ title, subtitle, children }) {
  return <div style={{ marginBottom: 14, paddingBottom: 14,
    borderBottom: '1px solid var(--line-soft)' }}>
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
        textTransform: 'uppercase', color: 'var(--muted2)' }}>{title}</div>
      {subtitle && <div style={{ fontSize: 10, color: 'var(--muted)' }}>{subtitle}</div>}
    </div>
    {children}
  </div>;
}

function DimBox({ label, v, accent }) {
  return <div style={{ background: 'var(--bg-2)', border: '1px solid var(--line-soft)',
    borderRadius: 6, padding: '6px 10px' }}>
    <div className="label" style={{ marginBottom: 0 }}>{label}</div>
    <div className="mono" style={{ fontSize: 12, fontWeight: 700, color: accent }}>
      {v[0]} × {v[1]} × {v[2]} <span style={{ fontWeight: 400, color: 'var(--muted)' }}>mm</span></div>
  </div>;
}

function BuildVolumeViz({ min, max, accent }) {
  // Scale max to fit a 200×100 svg, isometric-ish proportional bar chart
  const maxDim = Math.max(...max);
  const w = 220, h = 90, pad = 12;
  const scale = (h - pad * 2) / maxDim;
  return <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} style={{ marginTop: 8 }}>
    {/* baseline */}
    <line x1="20" y1={h - pad} x2={w - 8} y2={h - pad} stroke="var(--line)" strokeWidth="1"/>
    {['X', 'Y', 'Z'].map((axis, i) => {
      const cx = 36 + i * 64;
      const maxH = max[i] * scale;
      const minH = Math.max(min[i] * scale, 1.5);
      return <g key={axis}>
        {/* max bar */}
        <rect x={cx - 18} y={h - pad - maxH} width={36} height={maxH}
          fill={accent} fillOpacity="0.18" stroke={accent} strokeWidth="1"/>
        {/* min bar */}
        <rect x={cx - 6} y={h - pad - minH} width={12} height={minH} fill="var(--muted2)"/>
        <text x={cx} y={h - 2} textAnchor="middle" fontSize="9"
          fill="var(--muted)" fontFamily="var(--mono)">{axis}</text>
        <text x={cx} y={h - pad - maxH - 3} textAnchor="middle" fontSize="9"
          fontWeight="700" fill={accent} fontFamily="var(--mono)">{max[i]}</text>
      </g>;
    })}
    <text x={w - 4} y={12} textAnchor="end" fontSize="9" fill="var(--muted)"
      fontFamily="var(--mono)" letterSpacing="1">MM</text>
  </svg>;
}

/* ─── COST & MARKUP ─── */
function AdminCost() {
  const c = AC.cost;
  return <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
    <Card3>
      <CardHead title="ต้นทุนดำเนินการ" sub="Operating cost components" />
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {Object.entries(c).filter(([k]) => !['markup','rush','quantity','tax'].includes(k)).map(([k, v]) => (
          <div key={k} style={{ display: 'grid', gridTemplateColumns: '1fr 140px',
            gap: 10, alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 500 }}>{v.label}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>per {v.per}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input className="input" defaultValue={v.cost} style={{ width: 80, textAlign: 'right' }} />
              <span style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{v.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </Card3>

    <Card3>
      <CardHead title="Markup ต่อเทคโนโลยี" sub="% บนวัสดุ + % เครื่อง + ค่าขั้นต่ำ" />
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {AC.technologies.map(tech => {
          const m = c.markup[tech.id];
          if (!m) return null;
          return <div key={tech.id} style={{ border: '1px solid var(--line)',
            borderRadius: 8, padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 5, background: tech.tone,
                color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700 }}>{tech.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{tech.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{tech.fullName}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              <FieldNum label="Material %" v={m.material} suffix="%" />
              <FieldNum label="Machine %" v={m.machine} suffix="%" />
              <FieldNum label="Min charge" v={m.min} prefix="฿" />
            </div>
          </div>;
        })}
      </div>
    </Card3>

    <Card3>
      <CardHead title="Rush uplift" sub="Additional % on top of base price" />
      <div style={{ padding: 18, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        <FieldNum label="Same-day" v={c.rush.sameDay} suffix="%" />
        <FieldNum label="1-day" v={c.rush.day1} suffix="%" />
        <FieldNum label="2-day" v={c.rush.day2} suffix="%" />
      </div>
    </Card3>

    <Card3>
      <CardHead title="Quantity discount tiers" />
      <table>
        <thead>
          <tr style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>
            <Th3>Min qty</Th3><Th3 right>Discount</Th3><Th3></Th3>
          </tr>
        </thead>
        <tbody>
          {c.quantity.map((q, i) => (
            <tr key={i} style={{ borderTop: '1px solid var(--line-soft)' }}>
              <Td3><span className="num">{q.qty}+</span></Td3>
              <Td3 right><span className="num" style={{ fontWeight: 600, color: 'var(--positive)' }}>−{q.discount}%</span></Td3>
              <Td3 right><button className="btn sm ghost">Edit</button></Td3>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ padding: '0 18px 14px' }}>
        <button className="btn sm">+ Add tier</button>
        <span style={{ marginLeft: 12, fontSize: 11, color: 'var(--muted)' }}>
          VAT: <strong>{c.tax}%</strong> · auto-applied to all invoices</span>
      </div>
    </Card3>
  </div>;
}

function FieldNum({ label, v, suffix, prefix }) {
  return <div>
    <div className="label">{label}</div>
    <div style={{ display: 'flex', alignItems: 'stretch', border: '1px solid var(--line)', borderRadius: 6 }}>
      {prefix && <span style={{ padding: '7px 8px', color: 'var(--muted)',
        background: 'var(--bg-2)', borderRight: '1px solid var(--line)', fontSize: 11 }}>{prefix}</span>}
      <input defaultValue={v} style={{ border: 0, flex: 1, padding: '7px 10px',
        background: 'transparent', color: 'var(--ink)', textAlign: 'right',
        fontFamily: 'var(--mono)', fontSize: 12, outline: 'none' }} />
      {suffix && <span style={{ padding: '7px 8px', color: 'var(--muted)',
        background: 'var(--bg-2)', borderLeft: '1px solid var(--line)', fontSize: 11 }}>{suffix}</span>}
    </div>
  </div>;
}

function CardHead({ title, sub, extra }) {
  return <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'baseline',
    justifyContent: 'space-between', borderBottom: '1px solid var(--line-soft)' }}>
    <div>
      <div style={{ fontSize: 13, fontWeight: 700 }}>{title}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--muted)' }}>{sub}</div>}
    </div>
    {extra}
  </div>;
}

/* ─── SHIPPING ─── */
function AdminShipping() {
  return <div style={{ padding: 20 }}>
    <Card3>
      <FilterBar3 right={<button className="btn primary">+ Add provider</button>}>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>
          {AC.shippers.filter(s=>s.enabled).length} of {AC.shippers.length} providers enabled
        </span>
      </FilterBar3>
      <table>
        <thead>
          <tr style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>
            <Th3>Provider</Th3><Th3>API</Th3><Th3 right>Base</Th3>
            <Th3 right>+ per kg</Th3><Th3 right>Free over</Th3><Th3 right>COD fee</Th3>
            <Th3>SLA</Th3><Th3>Status</Th3><Th3></Th3>
          </tr>
        </thead>
        <tbody>
          {AC.shippers.map(s => (
            <tr key={s.id} style={{ borderTop: '1px solid var(--line-soft)' }}>
              <Td3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--chip)',
                    display: 'grid', placeItems: 'center', fontSize: 14 }}>{s.logo}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{s.name}</div>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{s.id}</div>
                  </div>
                </div>
              </Td3>
              <Td3>
                {s.api === 'connected' && <span className="pill" style={{ background: 'color-mix(in oklch, var(--positive) 18%, transparent)', color: 'var(--positive)' }}>● API</span>}
                {s.api === 'manual' && <span className="pill" style={{ background: 'var(--chip)', color: 'var(--muted2)' }}>● manual</span>}
                {s.api === 'disconnected' && <span className="pill" style={{ background: 'color-mix(in oklch, var(--danger) 14%, transparent)', color: 'var(--danger)' }}>● off</span>}
                {s.api === 'n/a' && <span className="pill" style={{ background: 'var(--chip)', color: 'var(--muted)' }}>n/a</span>}
              </Td3>
              <Td3 right><span className="num">{s.base ? '฿' + s.base : '—'}</span></Td3>
              <Td3 right><span className="num">{s.perKg ? '฿' + s.perKg : '—'}</span></Td3>
              <Td3 right><span className="num">{s.free ? '฿' + s.free.toLocaleString() : '—'}</span></Td3>
              <Td3 right><span className="num">{s.codFee ? '฿' + s.codFee : '—'}</span></Td3>
              <Td3 style={{ fontSize: 11 }}>{s.sla}</Td3>
              <Td3>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked={s.enabled} style={{ accentColor: 'var(--accent)' }}/>
                  <span style={{ fontSize: 11 }}>{s.enabled ? 'Enabled' : 'Disabled'}</span>
                </label>
              </Td3>
              <Td3><button className="btn sm ghost">Configure</button></Td3>
            </tr>
          ))}
        </tbody>
      </table>
    </Card3>
  </div>;
}

window.AdminTechnologies = AdminTechnologies;
window.AdminCost = AdminCost;
window.AdminShipping = AdminShipping;
window.AdminFieldNum = FieldNum;
window.AdminCardHead2 = CardHead;
