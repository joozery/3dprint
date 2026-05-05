// App.jsx — main Quote page

const { useState, useEffect, useRef, useMemo } = React;

const WARN_MSG = {
  th: 'ผนังบาง 1 จุด (0.9mm) · ควรเพิ่มเป็น ≥1.2mm',
  en: '1 thin wall found (0.9mm) · should be ≥1.2mm',
  zh: '发现1处薄壁 (0.9mm) · 应 ≥1.2mm',
  ja: '薄壁1箇所 (0.9mm) · ≥1.2mm推奨'
};

const SAMPLE_PARTS = [
{
  id: 1, name: 'bracket_v3.stl', volume: 12.4, bbox: { x: 60, y: 40, z: 48 },
  qty: 2, materialId: 'nylon', finishId: 'sanded', infill: 30, color: 'Grey',
  status: 'ready',
  warnings: [{ kind: 'warn', msg: WARN_MSG }],
  triangles: 18432, watertight: true
},
{
  id: 2, name: 'gearbox_cover.step', volume: 34.8, bbox: { x: 120, y: 80, z: 22 },
  qty: 1, materialId: 'petg', finishId: 'standard', infill: 20, color: 'Clear Black',
  status: 'ready', warnings: [], triangles: 52104, watertight: true
}];


function LangSwitcher() {
  const { lang, setLang } = useT();
  const [open, setOpen] = useState(false);
  const meta = LANG_META[lang];
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen((o) => !o)}
      style={{ ...iconBtn, width: 'auto', padding: '0 10px', gap: 6,
        fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>
        <span style={{ fontSize: 13 }}>{meta.flag}</span>
        {meta.label}
        <IconChevron size={10} />
      </button>
      {open &&
      <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4,
          background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 6,
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)', minWidth: 160, zIndex: 50, overflow: 'hidden' }}>
            {Object.entries(LANG_META).map(([code, m]) =>
          <button key={code}
          onClick={() => {setLang(code);setOpen(false);}}
          style={{
            width: '100%', padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 8,
            background: code === lang ? 'var(--card)' : 'transparent',
            border: 'none', borderBottom: '1px solid var(--line)',
            cursor: 'pointer', fontSize: 12, textAlign: 'left'
          }}>
                <span style={{ fontSize: 14 }}>{m.flag}</span>
                <span style={{ flex: 1 }}>{m.name}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)',
              letterSpacing: 1 }}>{m.label}</span>
                {code === lang && <IconCheck size={12} style={{ color: 'var(--accent)' }} />}
              </button>
          )}
          </div>
        </>
      }
    </div>);

}

function Header() {
  const { t } = useT();
  const navItems = [t.nav.services, t.nav.materials, t.nav.models, t.nav.help, t.nav.about];
  return (
    <header style={{
      gridArea: 'header',
      borderBottom: '1px solid var(--line)',
      background: 'var(--bg)',
      display: 'flex', alignItems: 'center', padding: '0 20px',
      height: 56
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32, flex: 1 }}>
        <a href="Account.html" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <img src="assets/pmd-logo.png" alt="Print My Design" style={{ height: 30, width: 'auto', display: 'block' }} />
        </a>
        <nav style={{ display: 'flex', gap: 4, fontSize: 13 }}>
          {navItems.map((n, i) =>
          <a key={i} href="#" className="nav-link" style={{
            padding: '6px 10px', color: 'var(--ink)', textDecoration: 'none',
            borderRadius: 4, transition: 'color .12s, background .12s'
          }}>{n}</a>
          )}
        </nav>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <LangSwitcher />
        <button style={iconBtn}><IconHistory size={14} /></button>
        <button style={iconBtn}><IconUser size={14} /></button>
        <button style={{ ...iconBtn, position: 'relative' }}>
          <IconCart size={14} />
          <span style={{ position: 'absolute', top: 4, right: 4, width: 14, height: 14,
            background: 'var(--accent)', color: '#fff', borderRadius: '50%',
            fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--mono)' }}>2</span>
        </button>
        <div style={{ width: 1, height: 20, background: 'var(--line)', margin: '0 4px' }} />
        <button className="btn-primary" style={{ padding: '8px 14px', fontSize: 12 }}>{t.header.orderNow}</button>
      </div>
    </header>);

}
const iconBtn = {
  width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'transparent', border: '1px solid var(--line)', borderRadius: 6,
  cursor: 'pointer', color: 'var(--ink)'
};

// Sub-header with page title & scenario jumper
function SubHeader({ scenario, setScenario }) {
  const { t } = useT();
  const scenarios = [
  { value: 'empty', label: 'Empty' },
  { value: 'uploading', label: 'Uploading' },
  { value: 'analyzing', label: 'Analyzing' },
  { value: 'priced', label: 'Priced' },
  { value: 'multi', label: 'Multi-part' },
  { value: 'warning', label: 'Warnings' }];

  return (
    <div style={{
      gridArea: 'subhead',
      padding: '18px 20px', borderBottom: '1px solid var(--line)',
      display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap'
    }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)',
          letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>
          {t.subhead.kicker}
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>
          {t.subhead.title}
        </h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <a href="#" style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: 4 }}>
          {t.subhead.guide} <IconChevronRight size={12} />
        </a>
        <a href="#" style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: 4 }}>
          <IconHistory size={12} /> {t.subhead.history}
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 8px', border: '1px dashed var(--line)', borderRadius: 4,
          fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>
          <span>STATE</span>
          <select value={scenario} onChange={(e) => setScenario(e.target.value)}
          style={{ border: 'none', background: 'transparent', fontFamily: 'var(--mono)',
            fontSize: 10, color: 'var(--ink)', fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase' }}>
            {scenarios.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>
    </div>);

}

// Left: file list + upload
function PartsSidebar({ parts, activeId, setActiveId, onDelete, onUpload, onReset, scenario }) {
  const { t } = useT();
  const fileInput = useRef(null);
  return (
    <aside style={{
      gridArea: 'sidebar', borderRight: '1px solid var(--line)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>
      <div style={{ padding: 16, borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 1.5,
            textTransform: 'uppercase', color: 'var(--muted)' }}>
            {t.parts.label} · {parts.length}
          </div>
          <button onClick={() => fileInput.current?.click()}
          style={{ background: 'transparent', border: '1px solid var(--line)', borderRadius: 4,
            padding: '4px 8px', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            fontFamily: 'var(--sans)', color: 'var(--ink)' }}>
            <IconPlus size={11} /> {t.parts.add}
          </button>
          <input ref={fileInput} type="file" style={{ display: 'none' }}
          onChange={(e) => e.target.files[0] && onUpload(e.target.files[0].name)} />
        </div>
        <button onClick={() => fileInput.current?.click()}
        style={{
          width: '100%', padding: '14px 12px', border: '1.5px dashed var(--line)',
          borderRadius: 6, background: 'var(--card)', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          color: 'var(--muted)'
        }}>
          <IconUpload size={18} />
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink)' }}>
            {t.parts.dropCta}
          </div>
          <div style={{ fontSize: 10, fontFamily: 'var(--mono)', letterSpacing: 0.5 }}>
            {t.parts.dropSub}
          </div>
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {parts.length === 0 &&
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted)', fontSize: 11 }}>
            {t.parts.empty}<br />{t.parts.emptyHint}
          </div>
        }
        {parts.map((p) =>
        <PartRow key={p.id} part={p} active={p.id === activeId}
        onClick={() => setActiveId(p.id)}
        onDelete={() => onDelete(p.id)} />
        )}
      </div>

      <div style={{ padding: 12, borderTop: '1px solid var(--line)', background: 'var(--card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10,
          color: 'var(--muted)', fontFamily: 'var(--mono)', letterSpacing: 0.5 }}>
          <IconShield size={12} />
          {t.parts.secure}
        </div>
      </div>
    </aside>);

}

// Center: 3D viewer + analysis panel
function ViewerArea({ part, scenario, viewMode, setViewMode, rotation, setRotation }) {
  const { t } = useT();
  if (!part) return <EmptyViewer />;
  if (scenario === 'uploading') return <UploadingViewer />;
  if (scenario === 'analyzing' || part.status === 'analyzing') return <AnalyzingViewer />;

  return (
    <div style={{ gridArea: 'viewer', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ViewerToolbar part={part} viewMode={viewMode} setViewMode={setViewMode} />

      <div style={{ flex: 1, position: 'relative', background: 'var(--viewer)', overflow: 'hidden' }}>
        <ModelViewer rotation={rotation} setRotation={setRotation}
        mode={viewMode} bounds={part.bbox} />

        {/* View controls overlay */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          display: 'flex', flexDirection: 'column', gap: 4
        }}>
          {[IconRotate, IconZoomIn, IconZoomOut, IconMove].map((I, i) =>
          <button key={i} style={viewerBtn}><I size={14} /></button>
          )}
        </div>

        {/* Axis gizmo */}
        <div style={{ position: 'absolute', top: 12, right: 12,
          display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ ...viewerBtn, width: 'auto', padding: '4px 8px',
            fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)',
            letterSpacing: 1, cursor: 'default' }}>ISO</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['X', 'Y', 'Z'].map((a) =>
            <button key={a} style={{ ...viewerBtn, width: 28, fontFamily: 'var(--mono)',
              fontSize: 10, fontWeight: 700 }}>{a}</button>
            )}
          </div>
        </div>

        {/* Dimensions readout */}
        <div style={{
          position: 'absolute', bottom: 12, left: 12,
          display: 'flex', flexDirection: 'column', gap: 3,
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 0.5,
          background: 'rgba(255,255,255,0.92)', padding: '8px 10px',
          border: '1px solid var(--line)', borderRadius: 4, color: 'var(--ink)'
        }}>
          <div style={{ color: 'var(--muted)', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>{t.viewer.bbox}</div>
          <div>X &nbsp;{String(part.bbox.x).padStart(3, ' ')}.0 mm</div>
          <div>Y &nbsp;{String(part.bbox.y).padStart(3, ' ')}.0 mm</div>
          <div>Z &nbsp;{String(part.bbox.z).padStart(3, ' ')}.0 mm</div>
        </div>

        {/* Heatmap legend */}
        {viewMode === 'heatmap' &&
        <div style={{
          position: 'absolute', bottom: 12, right: 12,
          padding: '8px 10px', background: 'rgba(255,255,255,0.95)',
          border: '1px solid var(--line)', borderRadius: 4,
          fontFamily: 'var(--mono)', fontSize: 10
        }}>
            <div style={{ color: 'var(--muted)', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{t.viewer.wallThick}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 60, height: 6, background: 'linear-gradient(90deg, #ef4444, #f59e0b, #3b82f6)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <span>&lt;0.8</span><span>1.2</span><span>&gt;2 mm</span>
            </div>
          </div>
        }
      </div>

      {/* Analysis bar */}
      <AnalysisBar part={part} />
    </div>);

}
const viewerBtn = {
  width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(255,255,255,0.9)', border: '1px solid var(--line)', borderRadius: 4,
  color: 'var(--ink)', cursor: 'pointer'
};

function ViewerToolbar({ part, viewMode, setViewMode }) {
  const { t } = useT();
  return (
    <div style={{
      padding: '10px 16px', borderBottom: '1px solid var(--line)',
      display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconFile size={14} />
        <span style={{ fontSize: 13, fontWeight: 600 }}>{part.name}</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)',
          padding: '2px 6px', background: 'var(--chip)', borderRadius: 3 }}>
          {(part.volume * 4).toFixed(0)} KB
        </span>
      </div>
      <div style={{ flex: 1 }} />
      <Segmented size="sm" value={viewMode} onChange={setViewMode}
      options={[
      { value: 'shaded', label: t.viewer.shaded },
      { value: 'wireframe', label: t.viewer.wireframe },
      { value: 'heatmap', label: t.viewer.heatmap },
      { value: 'ruler', label: t.viewer.ruler }]
      } />
    </div>);

}

function AnalysisBar({ part }) {
  const { t } = useT();
  const stats = [
  { label: t.viewer.stats.volume, value: `${part.volume.toFixed(1)}`, unit: 'cm³' },
  { label: t.viewer.stats.surface, value: `${(part.volume * 8.4).toFixed(0)}`, unit: 'cm²' },
  { label: t.viewer.stats.weight, value: `${(part.volume * 1.24).toFixed(1)}`, unit: 'g' },
  { label: t.viewer.stats.triangles, value: part.triangles.toLocaleString(), unit: '' },
  { label: t.viewer.stats.watertight, value: part.watertight ? t.viewer.yes : t.viewer.no, unit: '' },
  { label: t.viewer.stats.printtime, value: `${Math.ceil(part.volume * 0.6)}`, unit: 'h' }];

  return (
    <div style={{
      borderTop: '1px solid var(--line)',
      display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`
    }}>
      {stats.map((s, i) =>
      <div key={i} style={{ padding: '10px 14px', borderRight: i < stats.length - 1 ? '1px solid var(--line)' : 'none' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 1,
          textTransform: 'uppercase', color: 'var(--muted)' }}>{s.label}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 600, marginTop: 2 }}>
            {s.value}<span style={{ color: 'var(--muted)', fontSize: 10, marginLeft: 3 }}>{s.unit}</span>
          </div>
        </div>
      )}
    </div>);

}

function EmptyViewer() {
  const { t } = useT();
  return (
    <div style={{ gridArea: 'viewer', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: 'var(--viewer)',
      position: 'relative', overflow: 'hidden' }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
        <defs>
          <pattern id="bg-dot" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.8" fill="rgba(30,36,51,0.15)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-dot)" />
      </svg>
      <div style={{ textAlign: 'center', zIndex: 1, maxWidth: 440, padding: 24 }}>
        <div style={{ width: 88, height: 88, margin: '0 auto 20px',
          border: '2px dashed var(--line)', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--card)' }}>
          <IconUpload size={28} style={{ color: 'var(--muted)' }} />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{t.viewer.emptyTitle}</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', margin: '8px 0 20px', lineHeight: 1.5 }}>
          {t.viewer.emptyDesc}
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="btn-primary">{t.viewer.pickFile}</button>
          <button className="btn-ghost">{t.viewer.sample}</button>
        </div>
      </div>
    </div>);

}

function UploadingViewer() {
  const { t } = useT();
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setProgress((p) => (p + 3) % 100), 80);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ gridArea: 'viewer', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: 'var(--viewer)', padding: 40 }}>
      <div style={{ width: 320 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <IconFile size={18} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>assembly_housing.step</span>
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
            {progress}%
          </span>
        </div>
        <div style={{ height: 4, background: 'var(--chip)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--accent)', width: `${progress}%`, transition: 'width .15s' }} />
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)',
          marginTop: 14, letterSpacing: 0.5 }}>
          {t.viewer.uploading} · 2.4 MB / 3.8 MB · 1.2 MB/s
        </div>
      </div>
    </div>);

}

function AnalyzingViewer() {
  const { t } = useT();
  const steps = t.viewer.steps.map((label, i) => ({
    label, done: i < 2, active: i === 2
  }));
  return (
    <div style={{ gridArea: 'viewer', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: 'var(--viewer)' }}>
      <div style={{ width: 100, height: 100, position: 'relative' }}>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, animation: 'spin 2s linear infinite' }}>
          <circle cx="50" cy="50" r="40" fill="none" stroke="var(--line)" strokeWidth="2" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="var(--accent)" strokeWidth="2"
          strokeDasharray="60 260" strokeLinecap="round" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center' }}>
          <IconCube size={32} style={{ color: 'var(--accent)' }} />
        </div>
      </div>
      <div style={{ marginTop: 24, fontSize: 14, fontWeight: 600 }}>{t.viewer.analyzing}</div>
      <div style={{ marginTop: 16, fontFamily: 'var(--mono)', fontSize: 11 }}>
        {steps.map((s, i) =>
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0',
          color: s.done ? 'var(--muted)' : s.active ? 'var(--ink)' : 'var(--line)' }}>
            <span style={{ width: 14, display: 'flex', justifyContent: 'center' }}>
              {s.done ? <IconCheck size={12} /> : s.active ? '→' : '·'}
            </span>
            {s.label}
          </div>
        )}
      </div>
    </div>);

}

Object.assign(window, {
  Header, SubHeader, PartsSidebar, ViewerArea, SAMPLE_PARTS
});