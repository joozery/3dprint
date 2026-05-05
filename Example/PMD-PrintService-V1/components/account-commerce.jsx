// Models, Orders, Quotes
const { useState: useSc, useMemo: useMc } = React;

function ModelsSection({ models, setModels }) {
  const { t } = useT();
  const tA = t.account || {};
  const m = tA.models || {};
  const [q, setQ] = useSc('');
  const [folder, setFolder] = useSc('all');
  const folders = useMc(() => ['all', ...new Set(models.map(x => x.folder))], [models]);
  const filtered = models.filter(x =>
    (folder === 'all' || x.folder === folder) &&
    (!q || x.name.toLowerCase().includes(q.toLowerCase())));

  return (
    <div>
      <PageHeader title={m.title} subtitle={m.subtitle}
        actions={<button className="btn-primary"><IconUpload size={12}/>&nbsp;{m.uploadNew}</button>}/>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 240px', maxWidth: 320, position: 'relative' }}>
          <IconSearch size={13} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--muted)' }}/>
          <TextInput value={q} onChange={setQ} placeholder={m.search} style={{ paddingLeft: 30 }}/>
        </div>
        <div style={{ display: 'flex', gap: 4, padding: 2, background: 'var(--chip)',
          border: '1px solid var(--line)', borderRadius: 4 }}>
          {folders.map(f => (
            <button key={f} onClick={() => setFolder(f)}
              style={{ padding: '5px 10px', fontSize: 11, fontFamily: 'var(--mono)',
                background: folder === f ? 'var(--bg)' : 'transparent',
                border: folder === f ? '1px solid var(--line)' : '1px solid transparent',
                borderRadius: 3, cursor: 'pointer', letterSpacing: 0.3 }}>
              {f === 'all' ? m.all : f}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
          {filtered.length} / {models.length}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card><EmptyState icon={<IconCube size={22}/>} title={m.empty}
          actionLabel={m.uploadNew} onAction={() => {}}/></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {filtered.map(mod => (
            <div key={mod.id} style={{ border: '1px solid var(--line)', borderRadius: 6,
              background: 'var(--card)', overflow: 'hidden' }}>
              <div style={{ aspectRatio: '4/3', background: 'var(--chip)', display: 'grid',
                placeItems: 'center', borderBottom: '1px solid var(--line)' }}>
                <ThumbGlyph kind={mod.thumb} size={72}/>
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--mono)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {mod.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4,
                  fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>
                  <span>{mod.size}</span>
                  <span>{mod.folder}</span>
                </div>
                <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
                  <button className="btn-primary" style={{ flex: 1, fontSize: 11, padding: '6px 8px' }}>
                    {m.actions?.requote}
                  </button>
                  <button className="btn-ghost" style={{ padding: '6px 8px' }} title={m.actions?.download}>
                    <IconDownload size={12}/>
                  </button>
                  <button className="btn-ghost" style={{ padding: '6px 8px', color: 'oklch(0.45 0.18 25)' }} title={m.actions?.delete}>
                    <IconTrash size={12}/>
                  </button>
                </div>
                <div style={{ marginTop: 8, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted2)' }}>
                  สั่งซื้อ {mod.ordered}× · {mod.updated}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrdersSection({ orders }) {
  const { t, lang } = useT();
  const tA = t.account || {};
  const o = tA.orders || {};
  const [expanded, setExpanded] = useSc(null);

  const fmt = n => n.toLocaleString(lang === 'th' ? 'th-TH' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div>
      <PageHeader title={o.title} subtitle={o.subtitle}/>
      {orders.length === 0 ? (
        <Card><EmptyState icon={<IconTruck size={22}/>} title={o.empty} desc={o.emptyHint}
          actionLabel={o.startOrder} onAction={() => {}}/></Card>
      ) : (
        <Card dense>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 0.8fr 2fr 1fr auto', gap: 0,
            padding: '10px 18px', borderBottom: '1px solid var(--line)',
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase',
            color: 'var(--muted)' }}>
            <div>{o.cols?.order}</div>
            <div>{o.cols?.date}</div>
            <div style={{ textAlign: 'center' }}>{o.cols?.items}</div>
            <div>{o.cols?.status}</div>
            <div style={{ textAlign: 'right' }}>{o.cols?.total}</div>
            <div style={{ width: 20 }}/>
          </div>
          {orders.map(ord => {
            const isOpen = expanded === ord.id;
            return (
              <div key={ord.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <button onClick={() => setExpanded(isOpen ? null : ord.id)}
                  style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 0.8fr 2fr 1fr auto', gap: 0,
                    width: '100%', padding: '14px 18px', border: 'none', background: isOpen ? 'var(--chip)' : 'transparent',
                    cursor: 'pointer', textAlign: 'left', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--mono)' }}>{ord.number}</div>
                    {ord.tracking && <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--mono)', marginTop: 2 }}>
                      {o.tracking}: {ord.tracking}
                    </div>}
                  </div>
                  <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--muted2)' }}>{ord.date}</div>
                  <div style={{ textAlign: 'center', fontSize: 12, fontFamily: 'var(--mono)' }}>{ord.items}</div>
                  <div><OrderPipeline stage={ord.stage} labels={o.pipeline}/></div>
                  <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 600, fontFamily: 'var(--mono)' }}>
                    ฿{fmt(ord.total)}
                  </div>
                  <div style={{ width: 20, textAlign: 'center', color: 'var(--muted)',
                    transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>
                    <IconChevron size={12}/>
                  </div>
                </button>
                {isOpen && (
                  <div style={{ padding: '16px 18px 20px', background: 'var(--chip)', borderTop: '1px solid var(--line)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10, marginBottom: 14 }}>
                      {ord.parts.map((p, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, background: 'var(--bg)',
                          padding: 10, borderRadius: 4, border: '1px solid var(--line)' }}>
                          <ThumbGlyph kind={p.thumb} size={44}/>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--mono)',
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                            <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{p.material}</div>
                            <div style={{ fontSize: 11, marginTop: 2, fontFamily: 'var(--mono)' }}>× {p.qty}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button className="btn-ghost" style={{ fontSize: 11 }}><IconCopy size={11}/>&nbsp;{o.reorder}</button>
                      <button className="btn-ghost" style={{ fontSize: 11 }}><IconDownload size={11}/>&nbsp;{o.invoice}</button>
                      <button className="btn-ghost" style={{ fontSize: 11 }}><IconDownload size={11}/>&nbsp;{o.receipt}</button>
                      {ord.tracking && <button className="btn-ghost" style={{ fontSize: 11 }}><IconTruck size={11}/>&nbsp;{o.tracking}</button>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}

function OrderPipeline({ stage, labels }) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {labels.map((lb, i) => {
        const done = i < stage;
        const active = i === stage;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%',
              border: `1.5px solid ${done || active ? 'var(--ink)' : 'var(--line)'}`,
              background: done ? 'var(--ink)' : active ? 'var(--bg)' : 'transparent',
              color: done ? 'var(--bg)' : 'var(--ink)',
              display: 'grid', placeItems: 'center', flexShrink: 0,
              boxShadow: active ? '0 0 0 3px var(--chip)' : 'none',
            }}>
              {done ? <IconCheck size={9}/> : <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 600 }}>{i+1}</span>}
            </div>
            {i < labels.length - 1 && <div style={{ width: 10, height: 1, background: done ? 'var(--ink)' : 'var(--line)' }}/>}
          </div>
        );
      })}
      <div style={{ marginLeft: 8, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 0.5,
        color: 'var(--muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
        {labels[stage] || labels[labels.length - 1]}
      </div>
    </div>
  );
}

function QuotesSection({ quotes }) {
  const { t, lang } = useT();
  const tA = t.account || {};
  const q = tA.quotes || {};
  const now = new Date('2026-04-19');
  const fmt = n => n.toLocaleString(lang === 'th' ? 'th-TH' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div>
      <PageHeader title={q.title} subtitle={q.subtitle}/>
      {quotes.length === 0 ? (
        <Card><EmptyState icon={<IconDocument size={22}/>} title={q.empty}/></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
          {quotes.map(qt => {
            const days = Math.ceil((new Date(qt.expires) - now) / 86400000);
            const isExpired = qt.expired || days < 0;
            const isSoon = days >= 0 && days <= 3 && !isExpired;
            return (
              <div key={qt.id} style={{ border: '1px solid var(--line)', borderRadius: 6,
                background: isExpired ? 'var(--chip)' : 'var(--card)',
                opacity: isExpired ? 0.7 : 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--mono)' }}>{qt.number}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)', marginTop: 2 }}>{qt.date}</div>
                  </div>
                  {isExpired ? <Chip tone="danger" small>{q.expired}</Chip>
                    : isSoon ? <Chip tone="warn" small>⏱ {q.expiresIn?.(days)}</Chip>
                    : <Chip tone="accent" small>{q.expiresIn?.(days)}</Chip>}
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {qt.parts.slice(0, 3).map((p, i) => <ThumbGlyph key={i} kind={p.thumb} size={40}/>)}
                  {qt.parts.length > 3 && (
                    <div style={{ width: 40, height: 40, background: 'var(--chip)', border: '1px solid var(--line)',
                      borderRadius: 4, display: 'grid', placeItems: 'center', fontFamily: 'var(--mono)',
                      fontSize: 11, color: 'var(--muted)' }}>+{qt.parts.length - 3}</div>
                  )}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted2)' }}>
                  {qt.parts.map(p => p.name).join(' · ')}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  paddingTop: 8, borderTop: '1px dashed var(--line)' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1,
                    textTransform: 'uppercase', color: 'var(--muted)' }}>{q.cols?.total}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--mono)' }}>฿{fmt(qt.total)}</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {!isExpired && <button className="btn-primary" style={{ flex: 1, fontSize: 12 }}>{q.convert}</button>}
                  <button className="btn-ghost" style={{ fontSize: 11 }} title={q.duplicate}><IconCopy size={12}/></button>
                  <button className="btn-ghost" style={{ fontSize: 11 }} title={q.pdfDl}><IconDownload size={12}/></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ModelsSection, OrdersSection, QuotesSection });
