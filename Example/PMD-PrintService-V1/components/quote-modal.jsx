// QuoteModal — confirm-and-send-by-email dialog with quotation preview.
// Renders into <body> as a fixed overlay; closes on Esc / backdrop / Cancel.

const { useState: useStateQM, useEffect: useEffectQM, useRef: useRefQM } = React;

function QuoteModal({ open, onClose, lines, totals, parts, defaultEmail = 'somchai@gmail.com', t }) {
  const [email, setEmail] = useStateQM(defaultEmail);
  const [sending, setSending] = useStateQM(false);
  const [sent, setSent] = useStateQM(false);
  const inputRef = useRefQM(null);

  // Esc to close. Reset state when reopened.
  useEffectQM(() => {
    if (!open) return;
    setSent(false);
    setSending(false);
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const today = new Date();
  const validUntil = new Date(today.getTime() + 14 * 86400000);
  const fmtDate = (d) => d.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' });
  const quoteId = 'Q-' + today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') +
    String(today.getDate()).padStart(2, '0') + '-' +
    String(Math.floor(Math.random() * 900) + 100);

  const handleSend = () => {
    if (!valid || sending) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 900);
  };

  return (
    <div onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(20, 12, 28, 0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, backdropFilter: 'blur(2px)',
      }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 720, maxHeight: '90vh',
          background: 'var(--bg)', borderRadius: 10,
          border: '1px solid var(--line)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          fontFamily: 'var(--sans)',
        }}>
        {/* Header */}
        <div style={{
          padding: '16px 22px', borderBottom: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'color-mix(in oklch, var(--accent) 12%, transparent)',
              display: 'grid', placeItems: 'center', color: 'var(--accent)',
            }}>
              <IconMail size={18} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{t.qm.title}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{quoteId}</div>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close"
            style={{
              width: 32, height: 32, border: 'none', borderRadius: 6,
              background: 'transparent', cursor: 'pointer', color: 'var(--muted)',
              display: 'grid', placeItems: 'center',
            }}>
            <IconX size={14} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '18px 22px' }}>
          {sent ? (
            <SentSuccess email={email} t={t} />
          ) : (
            <>
              {/* Email field */}
              <div style={{ marginBottom: 18 }}>
                <label style={{
                  display: 'block', fontSize: 10, fontFamily: 'var(--mono)',
                  letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)',
                  marginBottom: 6,
                }}>{t.qm.emailLabel}</label>
                <input ref={inputRef} type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  style={{
                    width: '100%', padding: '10px 12px', fontSize: 13,
                    border: `1px solid ${email && !valid ? 'var(--danger)' : 'var(--line)'}`,
                    borderRadius: 6, outline: 'none', background: 'var(--card)',
                    color: 'var(--ink)', fontFamily: 'var(--sans)',
                  }} />
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, lineHeight: 1.5 }}>
                  {t.qm.emailHelp}
                </div>
              </div>

              {/* Preview */}
              <div style={{
                border: '1px solid var(--line)', borderRadius: 8,
                background: 'var(--card)', overflow: 'hidden',
              }}>
                <div style={{
                  padding: '10px 14px', borderBottom: '1px solid var(--line-soft)',
                  background: 'var(--bg-2)', display: 'flex',
                  alignItems: 'center', justifyContent: 'space-between',
                  fontSize: 10, fontFamily: 'var(--mono)', letterSpacing: 1,
                  textTransform: 'uppercase', color: 'var(--muted)',
                }}>
                  <span>{t.qm.previewLabel}</span>
                  <span>{t.qm.validUntil}: {fmtDate(validUntil)}</span>
                </div>
                <QuotePreview lines={lines} totals={totals} t={t} quoteId={quoteId} date={fmtDate(today)} />
              </div>
            </>
          )}
        </div>

        {/* Footer actions */}
        <div style={{
          padding: '14px 22px', borderTop: '1px solid var(--line)',
          display: 'flex', justifyContent: 'flex-end', gap: 8,
          background: 'var(--bg-2)',
        }}>
          {sent ? (
            <button className="btn-primary" onClick={onClose}
              style={{ padding: '8px 18px', fontSize: 13 }}>
              {t.qm.done}
            </button>
          ) : (
            <>
              <button className="btn-ghost" onClick={onClose}
                style={{ padding: '8px 14px', fontSize: 12 }}>
                {t.qm.cancel}
              </button>
              <button className="btn-primary" onClick={handleSend} disabled={!valid || sending}
                style={{
                  padding: '8px 18px', fontSize: 13,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  opacity: valid && !sending ? 1 : 0.5,
                }}>
                {sending ? (
                  <>
                    <span style={{
                      width: 12, height: 12, border: '2px solid rgba(255,255,255,0.4)',
                      borderTopColor: '#fff', borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                    }} />
                    {t.qm.sending}
                  </>
                ) : (
                  <>
                    <IconMail size={13} />
                    {t.qm.send}
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>);

}

// ---- preview ----
function QuotePreview({ lines, totals, t, quoteId, date }) {
  return (
    <div style={{ padding: '16px 18px', fontSize: 12, color: 'var(--ink)' }}>
      {/* Letterhead */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 16, marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid var(--line-soft)' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: 1 }}>PRINT&nbsp;MY&nbsp;DESIGN</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>printmydesign.net · 02-XXX-XXXX</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)',
            letterSpacing: 1, textTransform: 'uppercase' }}>{t.qm.quotationNo}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 600 }}>{quoteId}</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{date}</div>
        </div>
      </div>

      {/* Line items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 100px',
          fontSize: 9, fontFamily: 'var(--mono)', letterSpacing: 1, textTransform: 'uppercase',
          color: 'var(--muted)', paddingBottom: 4, borderBottom: '1px solid var(--line-soft)' }}>
          <span>{t.qm.col.item}</span>
          <span style={{ textAlign: 'right' }}>{t.qm.col.qty}</span>
          <span style={{ textAlign: 'right' }}>{t.qm.col.amount}</span>
        </div>
        {lines.map((l) => (
          <div key={l.part.id} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 100px', gap: 8,
            fontSize: 12, alignItems: 'baseline' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {l.part.name}
              </div>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', marginTop: 1 }}>
                {l.mat?.name} · {l.part.color} · {l.finish?.name || 'Standard'}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 11 }}>×{l.part.qty}</div>
            <div style={{ textAlign: 'right', fontFamily: 'var(--mono)',
              fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>฿{Number(l.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--line-soft)',
        display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'var(--mono)', fontSize: 12 }}>
        <PvRow label={t.price.subtotal} v={totals.subtotal} />
        <PvRow label={t.price.setup} v={totals.setupFee} sub />
        {totals.discount > 0 && <PvRow label={t.price.coupon} v={-totals.discount} sub accent />}
        <PvRow label={t.price.vat} v={totals.vat} sub />
        <div style={{ display: 'flex', justifyContent: 'space-between',
          marginTop: 6, paddingTop: 8, borderTop: '1px solid var(--line)',
          fontSize: 14, fontWeight: 700 }}>
          <span style={{ fontFamily: 'var(--sans)' }}>{t.price.total}</span>
          <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--accent)' }}>
            ฿{Number(totals.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>);
}

function PvRow({ label, v, sub, accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between',
      fontSize: sub ? 11 : 12, color: sub ? 'var(--muted)' : 'var(--ink)',
      fontWeight: sub ? 400 : 600 }}>
      <span style={{ color: accent ? 'var(--accent)' : 'inherit' }}>{label}</span>
      <span style={{ fontVariantNumeric: 'tabular-nums', color: accent ? 'var(--accent)' : 'inherit' }}>
        {v < 0 ? '−' : ''}฿{Number(Math.abs(v)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    </div>);
}

// ---- success state ----
function SentSuccess({ email, t }) {
  return (
    <div style={{ padding: '32px 16px', textAlign: 'center' }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px',
        background: 'color-mix(in oklch, var(--positive) 15%, transparent)',
        display: 'grid', placeItems: 'center', color: 'var(--positive)',
      }}>
        <IconCheck size={28} />
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{t.qm.sentTitle}</div>
      <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, maxWidth: 380, margin: '0 auto' }}>
        {t.qm.sentBody1}
        <div style={{ fontFamily: 'var(--mono)', color: 'var(--ink)', fontWeight: 600, marginTop: 4 }}>{email}</div>
        <div style={{ marginTop: 8 }}>{t.qm.sentBody2}</div>
      </div>
    </div>);
}

window.QuoteModal = QuoteModal;
