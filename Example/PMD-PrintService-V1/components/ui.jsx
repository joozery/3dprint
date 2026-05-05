// QuotePage — the main interactive quote configurator

const MATERIALS = [
{ id: 'pla', process: 'FDM', name: 'PLA Standard', color: 'Matte White', price: 1.0,
  desc: { th: 'เหมาะสำหรับงานต้นแบบทั่วไป', en: 'Great for general prototyping', zh: '适合一般原型制作', ja: '一般的なプロトタイプに' },
  strength: 2, detail: 3, heat: 1,
  tds: '#tds/pla-standard.pdf', sds: '#sds/pla-standard.pdf' },
{ id: 'petg', process: 'FDM', name: 'PETG', color: 'Clear Black', price: 1.2,
  desc: { th: 'ทนทาน กันกระแทก กันน้ำ', en: 'Tough, impact & water resistant', zh: '坚韧、抗冲击、防水', ja: '丈夫で耐衝撃・防水' },
  strength: 3, detail: 3, heat: 3,
  tds: '#tds/petg.pdf', sds: '#sds/petg.pdf' },
{ id: 'abs', process: 'FDM', name: 'ABS Pro', color: 'Black', price: 1.4,
  desc: { th: 'งานทนร้อน ทนแรงกระแทก', en: 'Heat- and impact-resistant', zh: '耐热、抗冲击', ja: '耐熱・耐衝撃' },
  strength: 4, detail: 3, heat: 4,
  tds: '#tds/abs-pro.pdf', sds: '#sds/abs-pro.pdf' },
{ id: 'resin', process: 'SLA', name: 'Industrial Resin', color: 'Grey', price: 2.8,
  desc: { th: 'ผิวละเอียดพิเศษ งานต้นแบบ', en: 'Ultra-smooth finish, prototypes', zh: '表面极细腻,原型件', ja: '超滑らかな仕上がり' },
  strength: 3, detail: 5, heat: 3,
  tds: '#tds/industrial-resin.pdf', sds: '#sds/industrial-resin.pdf' },
{ id: 'nylon', process: 'MJF', name: 'Nylon PA12', color: 'Grey', price: 3.4,
  desc: { th: 'งานฟังก์ชัน ชิ้นส่วนกลไก', en: 'Functional & mechanical parts', zh: '功能件、机械零件', ja: '機能部品・機械部品' },
  strength: 5, detail: 4, heat: 4,
  tds: '#tds/nylon-pa12.pdf', sds: '#sds/nylon-pa12.pdf' },
{ id: 'tpu', process: 'SLS', name: 'TPU Flex 95A', color: 'Black', price: 3.9,
  desc: { th: 'ยืดหยุ่น งานยาง', en: 'Flexible, rubber-like', zh: '柔性、类橡胶', ja: '柔軟・ゴム状' },
  strength: 3, detail: 3, heat: 3,
  tds: '#tds/tpu-95a.pdf', sds: '#sds/tpu-95a.pdf' },
{ id: 'tough', process: 'SLA', name: 'Tough 2000', color: 'Amber', price: 4.2,
  desc: { th: 'แข็งแรงแบบเรซิ่น', en: 'High-strength resin', zh: '高强度树脂', ja: '高強度レジン' },
  strength: 4, detail: 5, heat: 3,
  tds: '#tds/tough-2000.pdf', sds: '#sds/tough-2000.pdf' },
{ id: 'steel', process: 'SLM', name: 'Stainless 316L', color: 'Metal', price: 12.5,
  desc: { th: 'โลหะเกรดอุตสาหกรรม', en: 'Industrial-grade metal', zh: '工业级金属', ja: '工業グレード金属' },
  strength: 5, detail: 4, heat: 5,
  tds: '#tds/stainless-316l.pdf', sds: '#sds/stainless-316l.pdf' }];


const FINISHES = [
{ id: 'standard', price: 0, time: 0 },
{ id: 'sanded', price: 80, time: 1 },
{ id: 'primed', price: 150, time: 2 },
{ id: 'painted', price: 250, time: 3 },
{ id: 'polished', price: 320, time: 3 }];


const INFILLS = [10, 20, 30, 50, 80, 100];

// Status icons for file
function StatusDot({ kind = 'ok' }) {
  const colors = { ok: '#16a34a', warn: '#f59e0b', err: '#ef4444', analyzing: '#3b82f6' };
  return (
    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
      background: colors[kind],
      boxShadow: kind === 'analyzing' ? `0 0 0 0 ${colors[kind]}` : 'none',
      animation: kind === 'analyzing' ? 'pulse 1.4s infinite' : 'none' }} />);

}

// Small dotted divider
const Divider = ({ style }) =>
<div style={{ height: 1, background: 'repeating-linear-gradient(90deg, var(--line) 0 4px, transparent 4px 8px)', ...style }} />;


// Mini bar chart for material stats
const StatBar = ({ label, value }) =>
<div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontFamily: 'var(--mono)' }}>
    <span style={{ width: 52, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) =>
    <div key={i} style={{ width: 8, height: 10,
      background: i <= value ? 'var(--ink)' : 'var(--line)' }} />
    )}
    </div>
  </div>;


// Segmented control
function Segmented({ options, value, onChange, size = 'md' }) {
  return (
    <div style={{ display: 'flex', border: '1px solid var(--line)', borderRadius: 6, overflow: 'hidden', background: 'var(--card)' }}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button key={opt.value} onClick={() => onChange(opt.value)}
          style={{
            flex: 1, padding: size === 'sm' ? '6px 8px' : '8px 10px',
            fontSize: size === 'sm' ? 11 : 12,
            fontFamily: 'var(--sans)',
            background: active ? 'var(--accent)' : 'transparent',
            color: active ? '#fff' : 'var(--ink)',
            border: 'none',
            borderRight: '1px solid var(--line)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontWeight: active ? 600 : 500,
            transition: 'background .15s'
          }}>
            {opt.label}
          </button>);

      })}
    </div>);

}

// Material card — includes TDS/SDS links
function MaterialCard({ mat, active, onClick, lang = 'th', t }) {
  const dim = active ? 'rgba(255,255,255,0.7)' : 'var(--muted)';
  const sheetBtn = {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 0.5,
    padding: '3px 6px', borderRadius: 3,
    border: `1px solid ${active ? 'rgba(255,255,255,0.25)' : 'var(--line)'}`,
    color: active ? '#fff' : 'var(--ink)',
    textDecoration: 'none', background: 'transparent',
    cursor: 'pointer'
  };
  return (
    <div onClick={onClick}
    style={{
      textAlign: 'left', padding: 14, background: active ? 'var(--accent)' : 'var(--card)',
      color: active ? '#fff' : 'var(--ink)',
      border: `1px solid ${active ? 'var(--accent)' : 'var(--line)'}`,
      borderRadius: 6, cursor: 'pointer', width: '100%',
      display: 'flex', flexDirection: 'column', gap: 8,
      transition: 'all .15s'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1,
          padding: '2px 6px', borderRadius: 3,
          background: active ? 'rgba(255,255,255,0.15)' : 'var(--chip)',
          color: active ? '#fff' : 'var(--muted)' }}>{mat.process}</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, marginLeft: 'auto', color: dim }}>
          ฿{mat.price.toFixed(2)}/cm³
        </span>
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{mat.name}</div>
        <div style={{ fontSize: 11, color: dim, marginTop: 2 }}>
          {typeof mat.desc === 'string' ? mat.desc : mat.desc[lang] || mat.desc.en}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 2, flexWrap: 'wrap' }}>
        <a href={mat.tds} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()} style={sheetBtn}
        title={t?.config?.tds || 'Technical Data Sheet'}>
          <IconFile size={10} /> TDS
        </a>
        <a href={mat.sds} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()} style={sheetBtn}
        title={t?.config?.sds || 'Safety Data Sheet'}>
          <IconShield size={10} /> SDS
        </a>
      </div>
    </div>);

}

// Quantity stepper
function QtyStepper({ value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', border: '1px solid var(--line)', borderRadius: 6, overflow: 'hidden', background: 'var(--card)', width: 132, flexShrink: 0 }}>
      <button onClick={() => onChange(Math.max(1, value - 1))} style={stepBtn} aria-label="Decrease quantity"><IconMinus size={14} /></button>
      <input type="text" value={value} onChange={(e) => onChange(Math.max(1, +e.target.value.replace(/\D/g, '') || 1))}
      style={{ flex: 1, minWidth: 0, border: 'none', borderLeft: '1px solid var(--line)', borderRight: '1px solid var(--line)', background: 'transparent', textAlign: 'center',
        fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 600, color: 'var(--ink)', outline: 'none', padding: 0 }} />
      <button onClick={() => onChange(value + 1)} style={stepBtn} aria-label="Increase quantity"><IconPlus size={14} /></button>
    </div>);

}
const stepBtn = {
  width: 36, flexShrink: 0, border: 'none', background: 'var(--bg-2)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)',
  transition: 'background 120ms ease',
};

// File / part row in sidebar
function PartRow({ part, active, onClick, onDelete }) {
  const { t } = useT();
  const isAnalyzing = part.status === 'analyzing';
  return (
    <div onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 12px', cursor: 'pointer',
      borderLeft: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
      background: active ? 'var(--card)' : 'transparent',
      borderBottom: '1px solid var(--line)'
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 4, background: 'var(--chip)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)',
        flexShrink: 0
      }}>
        <IconCube size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {part.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10,
          fontFamily: 'var(--mono)', color: 'var(--muted)', marginTop: 2 }}>
          <StatusDot kind={part.status === 'analyzing' ? 'analyzing' : part.warnings?.length ? 'warn' : 'ok'} />
          {isAnalyzing ? t.parts.analyzing : `${part.volume.toFixed(1)} cm³ · ×${part.qty}`}
        </div>
      </div>
      <button onClick={(e) => {e.stopPropagation();onDelete();}}
      style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 4 }}>
        <IconTrash size={14} />
      </button>
    </div>);

}

Object.assign(window, {
  MATERIALS, FINISHES, INFILLS,
  StatusDot, Divider, StatBar, Segmented, MaterialCard, QtyStepper, PartRow
});