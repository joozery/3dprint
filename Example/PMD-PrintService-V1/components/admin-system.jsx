// Admin system: Slicer, API, Storage
const { useState: useStateSys } = React;
const AS = window.ADMIN;
const Card4 = window.AdminCard;
const FilterBar4 = window.AdminFilterBar;
const Chip4 = window.AdminChip;
const Th4 = window.AdminTh;
const Td4 = window.AdminTd;
const FieldNum2 = window.AdminFieldNum;
const CardHead4 = window.AdminCardHead2;

/* ─── SLICER ─── */
function AdminSlicer() {
  const sl = AS.slicer;
  return <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 14 }}>
      <Card4>
        <CardHead4 title="PrusaSlicer CLI" sub="Configuration & runtime" extra={
          <span className="pill" style={{ background: 'color-mix(in oklch, var(--positive) 18%, transparent)', color: 'var(--positive)' }}>● Healthy</span>
        }/>
        <div style={{ padding: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ gridColumn: 'span 2' }}>
            <div className="label">Binary path</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input className="input mono" defaultValue={sl.binPath} style={{ flex: 1 }}/>
              <button className="btn">Test</button>
            </div>
            <div style={{ fontSize: 11, color: 'var(--positive)', marginTop: 4, fontFamily: 'var(--mono)' }}>
              ✓ PrusaSlicer v{sl.version} detected
            </div>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <div className="label">Profile directory</div>
            <input className="input mono" defaultValue={sl.configDir}/>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>
              Slicer reads .ini profiles per printer + per material from this folder
            </div>
          </div>
          <FieldNum2 label="Parallel jobs" v={sl.parallelJobs} suffix="workers" />
          <FieldNum2 label="Timeout" v={sl.timeoutSec} suffix="sec" />
          <FieldNum2 label="Default layer" v={sl.defaultLayer} suffix="mm" />
          <div>
            <div className="label">Failure handling</div>
            <select className="input">
              <option>Auto-retry once, then mark failed</option>
              <option>Mark failed immediately</option>
              <option>Retry 3× then alert ops</option>
            </select>
          </div>
        </div>
      </Card4>

      <Card4>
        <CardHead4 title="Quick commands" sub="Used by the worker pool" />
        <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { lbl: 'Slice + estimate', cmd: 'prusa-slicer --slice --info ${file} --load ${profile}.ini' },
            { lbl: 'Generate G-code',  cmd: 'prusa-slicer --export-gcode -o ${out}.gcode ${file}' },
            { lbl: 'Repair mesh',      cmd: 'prusa-slicer --repair ${file} -o ${out}.stl' },
            { lbl: 'Bounding info',    cmd: 'prusa-slicer --info ${file} --output json' },
          ].map((c, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{c.lbl}</span>
                <button className="btn sm ghost">Edit</button>
              </div>
              <div className="mono" style={{ fontSize: 11, padding: '6px 10px',
                background: 'var(--bg-2)', borderRadius: 4, border: '1px solid var(--line-soft)',
                color: 'var(--muted2)', overflowX: 'auto', whiteSpace: 'nowrap' }}>$ {c.cmd}</div>
            </div>
          ))}
        </div>
      </Card4>
    </div>

    <Card4>
      <CardHead4 title="Printer profiles" sub={`${sl.printers.filter(p=>p.active).length} active · ${sl.printers.length} total`}
        extra={<button className="btn primary">+ Add printer</button>}/>
      <table>
        <thead>
          <tr style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>
            <Th4>Printer</Th4><Th4>Process</Th4><Th4>Build volume</Th4><Th4>Layer range</Th4>
            <Th4 right>Total jobs</Th4><Th4>Last used</Th4><Th4>Status</Th4>
          </tr>
        </thead>
        <tbody>
          {sl.printers.map(p => (
            <tr key={p.id} style={{ borderTop: '1px solid var(--line-soft)' }}>
              <Td4><div style={{ fontWeight: 600 }}>{p.name}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{p.id}</div></Td4>
              <Td4><span className="mono" style={{ fontSize: 10, padding: '1px 5px',
                border: '1px solid var(--line)', borderRadius: 3 }}>{p.proc}</span></Td4>
              <Td4 className="mono" style={{ fontSize: 11 }}>{p.bed} mm</Td4>
              <Td4 className="mono" style={{ fontSize: 11 }}>{p.layers} mm</Td4>
              <Td4 right><span className="num">{p.jobs.toLocaleString()}</span></Td4>
              <Td4 style={{ fontSize: 11, color: 'var(--muted)' }}>{p.lastUsed}</Td4>
              <Td4>{p.active
                ? <span className="pill" style={{ background: 'color-mix(in oklch, var(--positive) 18%, transparent)', color: 'var(--positive)' }}>● Active</span>
                : <span className="pill" style={{ background: 'var(--chip)', color: 'var(--muted)' }}>○ Off</span>}</Td4>
            </tr>
          ))}
        </tbody>
      </table>
    </Card4>

    <Card4>
      <CardHead4 title="Recent slice jobs" sub="Latest worker output"
        extra={<button className="btn sm">Clear queue</button>}/>
      <table>
        <thead>
          <tr style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>
            <Th4>Job</Th4><Th4>File</Th4><Th4>Printer</Th4>
            <Th4 right>Print time</Th4><Th4 right>Filament</Th4><Th4>Started</Th4><Th4>Status</Th4>
          </tr>
        </thead>
        <tbody>
          {sl.recentJobs.map(j => (
            <tr key={j.id} style={{ borderTop: '1px solid var(--line-soft)' }}>
              <Td4><span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{j.id}</span></Td4>
              <Td4 className="mono" style={{ fontSize: 11 }}>{j.file}</Td4>
              <Td4 style={{ fontSize: 11 }}>{j.printer}</Td4>
              <Td4 right className="num">{j.time}</Td4>
              <Td4 right><span className="num">{j.filament || '—'}</span> {j.filament ? <span style={{ fontSize: 10, color: 'var(--muted)' }}>g</span> : null}</Td4>
              <Td4 style={{ fontSize: 11, color: 'var(--muted)' }}>{j.started}</Td4>
              <Td4>
                {j.status === 'ok'     && <span className="pill" style={{ background: 'color-mix(in oklch, var(--positive) 18%, transparent)', color: 'var(--positive)' }}>● ok</span>}
                {j.status === 'failed' && <span className="pill" style={{ background: 'color-mix(in oklch, var(--danger) 14%, transparent)', color: 'var(--danger)' }}>● failed</span>}
                {j.status === 'queued' && <span className="pill" style={{ background: 'var(--chip)', color: 'var(--muted2)' }}>● queued</span>}
                {j.err && <div style={{ fontSize: 10, color: 'var(--danger)' }}>{j.err}</div>}
              </Td4>
            </tr>
          ))}
        </tbody>
      </table>
    </Card4>
  </div>;
}

/* ─── API ─── */
function AdminAPI() {
  const a = AS.api;
  return <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
    <Card4>
      <CardHead4 title="API keys" sub="REST + GraphQL access tokens"
        extra={<button className="btn primary">+ Generate key</button>}/>
      <table>
        <thead>
          <tr style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>
            <Th4>Key</Th4><Th4>Scope</Th4><Th4>Created</Th4>
            <Th4>Last used</Th4><Th4 right>Requests</Th4><Th4>Status</Th4><Th4></Th4>
          </tr>
        </thead>
        <tbody>
          {a.keys.map(k => (
            <tr key={k.id} style={{ borderTop: '1px solid var(--line-soft)' }}>
              <Td4>
                <div style={{ fontWeight: 600 }}>{k.label}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{k.id}••••</div>
              </Td4>
              <Td4 className="mono" style={{ fontSize: 10, color: 'var(--muted2)' }}>{k.scope}</Td4>
              <Td4 style={{ fontSize: 11 }}>{k.created}</Td4>
              <Td4 style={{ fontSize: 11, color: 'var(--muted)' }}>{k.last}</Td4>
              <Td4 right><span className="num">{k.requests.toLocaleString()}</span></Td4>
              <Td4>{k.status === 'active'
                ? <span className="pill" style={{ background: 'color-mix(in oklch, var(--positive) 18%, transparent)', color: 'var(--positive)' }}>● active</span>
                : <span className="pill" style={{ background: 'color-mix(in oklch, var(--danger) 14%, transparent)', color: 'var(--danger)' }}>● revoked</span>}</Td4>
              <Td4 right><button className="btn sm ghost">⋯</button></Td4>
            </tr>
          ))}
        </tbody>
      </table>
    </Card4>

    <Card4>
      <CardHead4 title="Webhooks" sub="Outbound events"
        extra={<button className="btn primary">+ Add endpoint</button>}/>
      <table>
        <thead>
          <tr style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>
            <Th4>Endpoint</Th4><Th4>Events</Th4><Th4>Secret</Th4>
            <Th4>Last delivery</Th4><Th4 right>Failures</Th4><Th4>Status</Th4>
          </tr>
        </thead>
        <tbody>
          {a.webhooks.map(w => (
            <tr key={w.id} style={{ borderTop: '1px solid var(--line-soft)' }}>
              <Td4 className="mono" style={{ fontSize: 11 }}>{w.url}</Td4>
              <Td4 className="mono" style={{ fontSize: 10, color: 'var(--muted2)' }}>{w.events}</Td4>
              <Td4 className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{w.secret}</Td4>
              <Td4 style={{ fontSize: 11, color: 'var(--muted)' }}>{w.last}</Td4>
              <Td4 right><span className="num" style={{ color: w.fails > 0 ? 'var(--danger)' : 'var(--muted)',
                fontWeight: w.fails > 0 ? 700 : 400 }}>{w.fails}</span></Td4>
              <Td4>
                {w.status === 'ok'      && <span className="pill" style={{ background: 'color-mix(in oklch, var(--positive) 18%, transparent)', color: 'var(--positive)' }}>● ok</span>}
                {w.status === 'failing' && <span className="pill" style={{ background: 'color-mix(in oklch, var(--danger) 14%, transparent)', color: 'var(--danger)' }}>● failing</span>}
                {w.status === 'paused'  && <span className="pill" style={{ background: 'var(--chip)', color: 'var(--muted2)' }}>● paused</span>}
              </Td4>
            </tr>
          ))}
        </tbody>
      </table>
    </Card4>

    <Card4>
      <CardHead4 title="Integrations" sub="3rd-party services" />
      <div style={{ padding: 18, display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
        {a.integrations.map(it => (
          <div key={it.id} style={{ border: '1px solid var(--line)', borderRadius: 8,
            padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 600 }}>{it.name}</div>
              {it.status === 'connected'
                ? <span style={{ fontSize: 10, color: 'var(--positive)', fontWeight: 700 }}>●</span>
                : <span style={{ fontSize: 10, color: 'var(--muted)' }}>○</span>}
            </div>
            <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase',
              letterSpacing: 0.6, fontWeight: 600 }}>{it.kind}</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--muted2)' }}>{it.detail}</div>
            <button className="btn sm" style={{ marginTop: 4 }}>
              {it.status === 'connected' ? 'Manage' : 'Enable'}</button>
          </div>
        ))}
      </div>
    </Card4>
  </div>;
}

/* ─── STORAGE ─── */
function AdminStorage() {
  const s = AS.storage;
  const totalSize = s.buckets.reduce((a, b) => a + b.size, 0);
  return <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
      <KpiBox label="Total storage" value={totalSize.toFixed(1) + ' GB'} sub="across 5 buckets"/>
      <KpiBox label="Files" value={s.buckets.reduce((a,b)=>a+b.files,0).toLocaleString()} sub="all buckets"/>
      <KpiBox label="DB replica lag" value={s.health.db.replicaLag} sub={s.health.db.ok ? 'healthy' : 'lagging'}
        fg={s.health.db.ok ? 'var(--positive)' : 'var(--danger)'}/>
      <KpiBox label="Redis memory" value={s.health.redis.mem} sub={s.health.redis.ok ? 'healthy' : 'pressure'}
        fg={s.health.redis.ok ? 'var(--positive)' : 'var(--danger)'}/>
    </div>

    <Card4>
      <CardHead4 title="Storage buckets" sub="Object storage by purpose"
        extra={<button className="btn">Re-scan sizes</button>}/>
      <table>
        <thead>
          <tr style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>
            <Th4>Bucket</Th4><Th4>Driver</Th4><Th4>Region</Th4>
            <Th4 right>Size</Th4><Th4 right>Files</Th4><Th4>Retention</Th4>
            <Th4>Lifecycle</Th4><Th4>Visibility</Th4>
          </tr>
        </thead>
        <tbody>
          {s.buckets.map(b => (
            <tr key={b.id} style={{ borderTop: '1px solid var(--line-soft)' }}>
              <Td4>
                <div style={{ fontWeight: 600 }}>{b.name}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{b.id}</div>
              </Td4>
              <Td4><span className="mono" style={{ fontSize: 10, padding: '1px 5px',
                border: '1px solid var(--line)', borderRadius: 3 }}>{b.driver}</span></Td4>
              <Td4 className="mono" style={{ fontSize: 11 }}>{b.region}</Td4>
              <Td4 right><span className="num" style={{ fontWeight: 600 }}>{b.size}</span> <span style={{ fontSize: 10, color: 'var(--muted)' }}>GB</span></Td4>
              <Td4 right><span className="num">{b.files.toLocaleString()}</span></Td4>
              <Td4 style={{ fontSize: 11 }}>{b.retention}</Td4>
              <Td4 className="mono" style={{ fontSize: 10, color: 'var(--muted2)' }}>{b.lifecycle}</Td4>
              <Td4>{b.public
                ? <span className="pill" style={{ background: 'color-mix(in oklch, var(--warn) 14%, transparent)', color: 'oklch(0.55 0.15 65)' }}>● public</span>
                : <span className="pill" style={{ background: 'var(--chip)', color: 'var(--muted2)' }}>● private</span>}</Td4>
            </tr>
          ))}
        </tbody>
      </table>
    </Card4>

    <Card4>
      <CardHead4 title="Scheduled jobs" sub="Cron + event-triggered tasks"
        extra={<button className="btn primary">+ New job</button>}/>
      <table>
        <thead>
          <tr style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>
            <Th4>Job</Th4><Th4>Schedule</Th4><Th4>Last run</Th4>
            <Th4>Next run</Th4><Th4>Status</Th4><Th4></Th4>
          </tr>
        </thead>
        <tbody>
          {s.jobs.map(j => (
            <tr key={j.id} style={{ borderTop: '1px solid var(--line-soft)' }}>
              <Td4><div style={{ fontWeight: 600 }}>{j.name}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{j.id}</div></Td4>
              <Td4 className="mono" style={{ fontSize: 11 }}>{j.cron}</Td4>
              <Td4 style={{ fontSize: 11, color: 'var(--muted)' }}>{j.last}</Td4>
              <Td4 style={{ fontSize: 11 }}>{j.next}</Td4>
              <Td4>
                {j.status === 'ok' && <span className="pill" style={{ background: 'color-mix(in oklch, var(--positive) 18%, transparent)', color: 'var(--positive)' }}>● ok</span>}
                {j.status === 'warn' && <span className="pill" style={{ background: 'color-mix(in oklch, var(--warn) 14%, transparent)', color: 'oklch(0.55 0.15 65)' }}>● warn</span>}
              </Td4>
              <Td4 right><button className="btn sm">Run now</button></Td4>
            </tr>
          ))}
        </tbody>
      </table>
    </Card4>
  </div>;
}

function KpiBox({ label, value, sub, fg }) {
  return <div style={{ background: 'var(--card)', border: '1px solid var(--line)',
    borderRadius: 10, padding: 14 }}>
    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.8,
      color: 'var(--muted)', textTransform: 'uppercase' }}>{label}</div>
    <div className="num" style={{ fontSize: 22, fontWeight: 700, marginTop: 2,
      color: fg || 'var(--ink)', letterSpacing: -0.4 }}>{value}</div>
    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{sub}</div>
  </div>;
}

window.AdminSlicer = AdminSlicer;
window.AdminAPI = AdminAPI;
window.AdminStorage = AdminStorage;
