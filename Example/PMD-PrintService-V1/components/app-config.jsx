// Config panel (right of viewer) + price panel (far right)

const { useState: useState2 } = React;

function ConfigPanel({ part, updatePart }) {
  const { t } = useT();
  if (!part) return (
    <div style={{ gridArea: 'config', borderLeft: '1px solid var(--line)',
      padding: 20, color: 'var(--muted)', fontSize: 12 }}>
      {t.config.uploadFirst}
    </div>);

  const mat = MATERIALS.find((m) => m.id === part.materialId);
  const processes = ['FDM', 'SLA', 'MJF', 'SLS', 'SLM'];
  const [proc, setProc] = useState2(mat?.process || 'FDM');
  const filtered = MATERIALS.filter((m) => m.process === proc);
  const finish = FINISHES.find((f) => f.id === part.finishId);

  return (
    <aside style={{
      gridArea: 'config', borderLeft: '1px solid var(--line)',
      overflow: 'auto', background: 'var(--bg)'
    }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1.5,
            textTransform: 'uppercase', color: 'var(--muted)' }}>{t.config.kicker}</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{t.config.title}</div>
        </div>
        <button style={{ background: 'transparent', border: '1px solid var(--line)', borderRadius: 4,
          padding: '4px 8px', fontSize: 10, fontFamily: 'var(--mono)', letterSpacing: 0.5,
          color: 'var(--muted)', cursor: 'pointer' }}>
          {t.config.copyAll}
        </button>
      </div>

      <div style={{ padding: 18 }}>
        {/* Process */}
        <Section title={t.config.sec1}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
            {processes.map((p) =>
            <button key={p} onClick={() => setProc(p)}
            style={{
              padding: '8px 4px', fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 600,
              background: proc === p ? 'var(--accent)' : 'var(--card)',
              color: proc === p ? '#fff' : 'var(--ink)',
              border: `1px solid ${proc === p ? 'var(--accent)' : 'var(--line)'}`,
              borderRadius: 4, cursor: 'pointer'
            }}>{p}</button>
            )}
          </div>
        </Section>

        {/* Material */}
        <Section title={t.config.sec2}>
          <div style={{ display: 'grid', gap: 8 }}>
            {filtered.map((m) =>
            <MaterialCard key={m.id} mat={m}
            active={m.id === part.materialId}
            onClick={() => updatePart({ materialId: m.id })} />
            )}
            {filtered.length === 0 &&
            <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', padding: 20 }}>
                {t.config.noMat}
              </div>
            }
          </div>
          {mat &&
          <div style={{ marginTop: 12, padding: 12, background: 'var(--card)',
            border: '1px solid var(--line)', borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <StatBar label={t.config.strength} value={mat.strength} />
              <StatBar label={t.config.detailStat} value={mat.detail} />
              <StatBar label={t.config.heat} value={mat.heat} />
            </div>
          }
        </Section>

        {/* Color */}
        <Section title={t.config.sec3}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
            { name: 'White', hex: '#f3f4f6' },
            { name: 'Grey', hex: '#9ca3af' },
            { name: 'Black', hex: '#1f2937' },
            { name: 'Red', hex: '#dc2626' },
            { name: 'Blue', hex: '#2563eb' },
            { name: 'Yellow', hex: '#eab308' },
            { name: 'Green', hex: '#16a34a' },
            { name: 'Clear', hex: '#e5e7eb', pattern: true }].
            map((c) => {
              const active = c.name === part.color || part.color === 'Clear Black' && c.name === 'Clear';
              return (
                <button key={c.name} onClick={() => updatePart({ color: c.name })}
                title={t.colors[c.name] || c.name}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: c.pattern ? `repeating-linear-gradient(45deg, ${c.hex}, ${c.hex} 3px, #fff 3px, #fff 6px)` : c.hex,
                  border: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
                  outline: '1px solid var(--line)',
                  cursor: 'pointer', padding: 0
                }} />);

            })}
          </div>
        </Section>

        {/* Infill (FDM only) */}
        {proc === 'FDM' &&
        <Section title={t.config.sec4}>
            <div style={{ display: 'flex', gap: 4 }}>
              {INFILLS.map((i) => {
              const active = i === part.infill;
              return (
                <button key={i} onClick={() => updatePart({ infill: i })}
                style={{
                  flex: 1, padding: '8px 0', fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 600,
                  background: active ? 'var(--accent)' : 'var(--card)',
                  color: active ? '#fff' : 'var(--ink)',
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--line)'}`,
                  borderRadius: 4, cursor: 'pointer'
                }}>{i}%</button>);

            })}
            </div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 6, fontFamily: 'var(--mono)' }}>
              {t.config.infillDesc(part.infill)}
            </div>
          </Section>
        }

        {/* Finish */}
        <Section title={`${proc === 'FDM' ? '5' : '4'}. ${t.config.sec5Finish}`}>
          <div style={{ display: 'grid', gap: 4 }}>
            {FINISHES.map((f) => {
              const active = f.id === part.finishId;
              return (
                <button key={f.id} onClick={() => updatePart({ finishId: f.id })}
                style={{
                  padding: '10px 12px', fontSize: 12, textAlign: 'left',
                  background: active ? 'var(--accent)' : 'var(--card)',
                  color: active ? '#fff' : 'var(--ink)',
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--line)'}`,
                  borderRadius: 4, cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <span style={{ fontWeight: 600 }}>{t.finishes[f.id] || f.name}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11,
                    color: active ? 'rgba(255,255,255,0.7)' : 'var(--muted)' }}>
                    {f.price === 0 ? t.config.finishIncluded : `฿${fmtNum(f.price, 0)}`}
                  </span>
                </button>);

            })}
          </div>
        </Section>

        {/* Quantity + lead time */}
        <Section title={`${proc === 'FDM' ? '6' : '5'}. ${t.config.sec6Qty}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', flex: 1 }}>{t.config.qty}</div>
            <QtyStepper value={part.qty} onChange={(v) => updatePart({ qty: v })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
            {[
            { id: 'eco', name: t.config.leadEco, sub: t.config.leadEcoSub, mult: 1.0 },
            { id: 'std', name: t.config.leadStd, sub: t.config.leadStdSub, mult: 1.15 },
            { id: 'rush', name: t.config.leadRush, sub: t.config.leadRushSub, mult: 1.5 }].
            map((o) => {
              const active = (part.lead || 'std') === o.id;
              return (
                <button key={o.id} onClick={() => updatePart({ lead: o.id })}
                style={{
                  padding: '10px 6px', textAlign: 'center',
                  background: active ? 'var(--accent)' : 'var(--card)',
                  color: active ? '#fff' : 'var(--ink)',
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--line)'}`,
                  borderRadius: 4, cursor: 'pointer'
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600 }}>{o.name}</div>
                  <div style={{ fontSize: 10, fontFamily: 'var(--mono)', marginTop: 2,
                    color: active ? 'rgba(255,255,255,0.7)' : 'var(--muted)' }}>{o.sub}</div>
                </button>);

            })}
          </div>
        </Section>
      </div>
    </aside>);

}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, display: 'flex',
        alignItems: 'center', gap: 6 }}>
        {title}
      </div>
      {children}
    </div>);

}

// PRICE PANEL --------------------------------
const fmtNum = (n, d = 2) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtB = (n) => `฿${fmtNum(n)}`;

function PricePanel({ parts, scenario }) {
  const { t } = useT();
  const lines = useMemo(() => {
    return parts.map((p) => {
      const mat = MATERIALS.find((m) => m.id === p.materialId);
      const finish = FINISHES.find((f) => f.id === p.finishId);
      const leadMult = { eco: 1.0, std: 1.15, rush: 1.5 }[p.lead || 'std'];
      const matCost = p.volume * (mat?.price || 1) * 60;
      const finishCost = finish?.price || 0;
      const unit = (matCost + finishCost) * leadMult;
      const total = unit * p.qty;
      return { part: p, unit, total, mat, finish };
    });
  }, [parts]);

  const subtotal = lines.reduce((s, l) => s + l.total, 0);
  const setupFee = parts.length > 0 ? 150 : 0;
  const discount = 25;
  const beforeVat = subtotal + setupFee - discount;
  const vat = beforeVat * 0.07;
  const total = beforeVat + vat;
  const weight = parts.reduce((s, p) => s + p.volume * p.qty * 1.24, 0);
  const [coupon, setCoupon] = useState2('');
  const [couponApplied, setCouponApplied] = useState2(true);
  const [agreed, setAgreed] = useState2(false);
  const [quoteOpen, setQuoteOpen] = useState2(false);

  const loading = scenario === 'analyzing' || parts.some((p) => p.status === 'analyzing');
  const totalsBundle = { subtotal, setupFee, discount: couponApplied ? discount : 0, vat, total };

  return (
    <aside style={{
      gridArea: 'price',
      borderLeft: '1px solid var(--line)', background: 'var(--card)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)',
        background: 'var(--bg)' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1.5,
          textTransform: 'uppercase', color: 'var(--muted)' }}>{t.price.kicker}</div>
        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{t.price.title}</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 0' }}>
        {parts.length === 0 &&
        <div style={{ padding: 24, textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
            {t.price.addToSee}
          </div>
        }

        {lines.map((l, i) =>
        <div key={l.part.id} style={{ padding: '10px 18px',
          borderBottom: i < lines.length - 1 ? '1px dashed var(--line)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.part.name}</div>
                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', marginTop: 2 }}>
                  {l.mat?.name} · {t.colors[l.part.color] || l.part.color} · ×{l.part.qty}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 600,
              fontVariantNumeric: 'tabular-nums' }}>
                {loading ? '—' : fmtB(l.total)}
              </div>
            </div>
            {!loading &&
          <div style={{ display: 'flex', justifyContent: 'space-between',
            fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>
                <span>{t.price.perPiece(fmtB(l.unit))}</span>
                <span>{l.finish?.price > 0 ? `+ ${t.finishes[l.finish.id] || l.finish.name}` : ''}</span>
              </div>
          }
          </div>
        )}

        {parts.length > 0 &&
        <div style={{ padding: '14px 18px', borderTop: '1px solid var(--line)',
          display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--mono)', fontSize: 12 }}>
            <RowNum label={t.price.subtotal} value={loading ? '—' : fmtB(subtotal)} />
            <RowNum label={t.price.setup} value={loading ? '—' : fmtB(setupFee)} sub />
            {couponApplied &&
          <RowNum label={t.price.coupon} value={loading ? '—' : `−${fmtB(discount)}`} sub accent />
          }
            <RowNum label={t.price.vat} value={loading ? '—' : fmtB(vat)} sub />
          </div>
        }
      </div>

      {parts.length > 0 &&
      <>
          {/* Coupon */}
          <div style={{ padding: '12px 18px', borderTop: '1px solid var(--line)', background: 'var(--bg)' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1.5,
            textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>{t.price.couponLabel}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 10px', border: '1px solid var(--line)', borderRadius: 4, background: 'var(--card)' }}>
                <IconTag size={12} style={{ color: couponApplied ? 'var(--accent)' : 'var(--muted)' }} />
                <input type="text"
              value={couponApplied ? 'FIRST25' : coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder={t.price.couponPh}
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none',
                fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 1, color: 'var(--ink)' }} />
                {couponApplied &&
              <span style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--accent)',
                letterSpacing: 1 }}>{t.price.active}</span>
              }
              </div>
              <button onClick={() => setCouponApplied(!couponApplied)} className="btn-ghost"
            style={{ padding: '6px 12px', fontSize: 11 }}>
                {couponApplied ? t.price.remove : t.price.apply}
              </button>
            </div>
          </div>

          {/* Shipping */}
          <div style={{ padding: '12px 18px', borderTop: '1px solid var(--line)', background: 'var(--bg)',
          display: 'flex', alignItems: 'center', gap: 10 }}>
            <IconTruck size={16} style={{ color: 'var(--muted)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600 }}>{t.price.shipTo}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
                {t.price.shipSub(fmtNum(weight, 0))}
              </div>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600 }}>
              {loading ? '—' : `฿85.00`}
            </div>
          </div>

          {/* Total */}
          <div style={{ padding: '16px 18px', borderTop: '1px solid var(--line)',
          background: 'var(--accent)', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1.5,
                textTransform: 'uppercase', opacity: 0.6 }}>{t.price.total}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, opacity: 0.5, marginTop: 2 }}>
                  {t.price.vatIncl}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 28, fontWeight: 700,
              fontVariantNumeric: 'tabular-nums', letterSpacing: -1 }}>
                {loading ? <span style={{ opacity: 0.4 }}>฿—</span> : fmtB(total)}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ padding: 16, borderTop: '1px solid var(--line)', background: 'var(--card)' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11,
            color: 'var(--muted)', marginBottom: 10, cursor: 'pointer', lineHeight: 1.4 }}>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
            style={{ marginTop: 1, accentColor: 'var(--accent)' }} />
              <span>{t.price.agree} <a href="#" style={{ color: 'var(--ink)' }}>{t.price.terms}</a></span>
            </label>
            <button className="btn-primary" disabled={!agreed || loading}
          style={{ width: '100%', padding: '12px', fontSize: 13, fontWeight: 600,
            opacity: agreed && !loading ? 1 : 0.5 }}>
              {t.price.place}
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 6 }}>
              <button className="btn-ghost" onClick={() => !loading && setQuoteOpen(true)}
                disabled={loading}
                style={{ padding: '8px', fontSize: 11, opacity: loading ? 0.5 : 1 }}>
                <IconMail size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                {t.price.quote}
              </button>
              <button className="btn-ghost" style={{ padding: '8px', fontSize: 11 }}>
                <IconCart size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                {t.price.saveCart}
              </button>
            </div>
            <div style={{ marginTop: 10, fontSize: 10, color: 'var(--muted)', textAlign: 'center',
            lineHeight: 1.5, fontFamily: 'var(--mono)' }}>
              {t.price.notice}
            </div>
          </div>
        </>
      }
      {typeof QuoteModal !== 'undefined' && (
        <QuoteModal
          open={quoteOpen}
          onClose={() => setQuoteOpen(false)}
          lines={lines}
          totals={totalsBundle}
          parts={parts}
          t={t} />
      )}
    </aside>);

}

function RowNum({ label, value, sub, accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between',
      fontSize: sub ? 11 : 12, color: sub ? 'var(--muted)' : 'var(--ink)',
      fontWeight: sub ? 400 : 600 }}>
      <span style={{ color: accent ? 'var(--accent)' : 'inherit' }}>{label}</span>
      <span style={{ fontVariantNumeric: 'tabular-nums', color: accent ? 'var(--accent)' : 'inherit' }}>
        {value}
      </span>
    </div>);

}

// Warning banner
function WarningBanner({ part }) {
  const { t } = useT();
  if (!part?.warnings?.length) return null;
  return (
    <div style={{
      position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
      background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 6,
      padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 10,
      fontSize: 12, zIndex: 3, maxWidth: 480
    }}>
      <IconWarn size={14} style={{ color: '#b45309', flexShrink: 0 }} />
      <div style={{ flex: 1, color: '#78350f' }}>
        <strong>{t.warn.count(part.warnings.length)}</strong> · {part.warnings[0].msg}
      </div>
      <button style={{ background: 'transparent', border: 'none', fontSize: 11,
        color: '#78350f', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}>
        {t.warn.viewAll}
      </button>
    </div>);

}

Object.assign(window, { ConfigPanel, PricePanel, WarningBanner });