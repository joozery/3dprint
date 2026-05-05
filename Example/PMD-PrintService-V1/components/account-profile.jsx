// Profile + Addresses + Billing sections
const { useState: useSt } = React;

function ProfileSection({ customer, setCustomer }) {
  const { t, lang } = useT();
  const tA = t.account || {};
  const p = tA.profile || {};
  const isBiz = customer.type === 'business';

  const setField = (k, v) => setCustomer({ ...customer, [k]: v });

  const GRID = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };

  return (
    <div>
      <PageHeader title={tA.sections?.profile} subtitle={p.subtitle}
        actions={<button className="btn-primary">{tA.save}</button>}/>

      <Card title={p.accountType}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['individual', 'business'].map(tt => (
            <button key={tt} onClick={() => setField('type', tt)}
              style={{ flex: 1, padding: '14px 16px', border: `1px solid ${customer.type === tt ? 'var(--accent)' : 'var(--line)'}`,
                background: customer.type === tt ? 'var(--bg)' : 'var(--chip)', borderRadius: 6,
                cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%',
                border: `2px solid ${customer.type === tt ? 'var(--accent)' : 'var(--line)'}`,
                background: customer.type === tt ? 'var(--accent)' : 'transparent',
                boxShadow: customer.type === tt ? 'inset 0 0 0 2px var(--bg)' : 'none' }}/>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{p[tt]}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  {tt === 'individual' ? 'ใช้ส่วนตัว' : 'ออกใบกำกับภาษีในนามบริษัท'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card title={p.individual} subtitle="ข้อมูลติดต่อหลัก">
        <div style={GRID}>
          <Field label={p.firstName}><TextInput value={customer.firstName} onChange={v=>setField('firstName',v)}/></Field>
          <Field label={p.lastName}><TextInput value={customer.lastName} onChange={v=>setField('lastName',v)}/></Field>
          <Field label={p.email}><TextInput value={customer.email} mono onChange={v=>setField('email',v)}/></Field>
          <Field label={p.phone}><TextInput value={customer.phone} mono onChange={v=>setField('phone',v)}/></Field>
          <Field label={p.password}>
            <div style={{ display: 'flex', gap: 8 }}>
              <TextInput value="••••••••••" readOnly mono/>
              <button className="btn-ghost" style={{ whiteSpace: 'nowrap' }}>{p.change}</button>
            </div>
          </Field>
        </div>
      </Card>

      {isBiz && (
        <Card title={p.business} subtitle="ข้อมูลนิติบุคคลสำหรับออกใบกำกับภาษี">
          <div style={GRID}>
            <Field label={p.companyName} span={2}><TextInput value={customer.companyName} onChange={v=>setField('companyName',v)}/></Field>
            <Field label={p.companyNameEn} span={2}><TextInput value={customer.companyNameEn} onChange={v=>setField('companyNameEn',v)}/></Field>
            <Field label={p.taxId} hint="13 หลัก">
              <TextInput value={customer.taxId} mono onChange={v=>setField('taxId',v)}/></Field>
            <Field label={p.branch} hint={customer.branch === '00000' ? p.headOffice : undefined}>
              <TextInput value={customer.branch} mono onChange={v=>setField('branch',v)}/></Field>
            <Field label={p.vatReg}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 34 }}>
                <Toggle on={customer.vatRegistered} onChange={v=>setField('vatRegistered',v)}/>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {customer.vatRegistered ? 'จดทะเบียนแล้ว · มี VAT 7%' : 'ไม่ได้จดทะเบียน'}
                </span>
              </div>
            </Field>
            <Field label={p.industry}><TextInput value={customer.industry} onChange={v=>setField('industry',v)}/></Field>
            <Field label={p.contactPerson}><TextInput value={customer.contactPerson} onChange={v=>setField('contactPerson',v)}/></Field>
            <Field label={p.companyPhone}><TextInput value={customer.companyPhone} mono onChange={v=>setField('companyPhone',v)}/></Field>
            <Field label={p.companyEmail}><TextInput value={customer.companyEmail} mono onChange={v=>setField('companyEmail',v)}/></Field>
            <Field label={p.website}><TextInput value={customer.website} mono onChange={v=>setField('website',v)}/></Field>
            <Field label={p.size}>
              <div style={{ display: 'flex', gap: 6 }}>
                {p.sizes?.map(sz => (
                  <button key={sz} onClick={() => setField('size', sz)}
                    style={{ flex: 1, padding: '8px 6px', fontSize: 12, fontFamily: 'var(--mono)',
                      background: customer.size === sz ? 'var(--accent)' : 'var(--bg)',
                      color: customer.size === sz ? '#fff' : 'var(--ink)',
                      border: `1px solid ${customer.size === sz ? 'var(--accent)' : 'var(--line)'}`, borderRadius: 4, cursor: 'pointer' }}>{sz}</button>
                ))}
              </div>
            </Field>
          </div>
        </Card>
      )}
    </div>
  );
}

function AddressCard({ addr, lang, onEdit, onRemove, onMakeDefault, tA }) {
  const a = tA.addresses || {};
  return (
    <div style={{ padding: 16, border: '1px solid var(--line)', borderRadius: 6,
      background: addr.isDefault ? 'var(--bg)' : 'var(--card)',
      borderColor: addr.isDefault ? 'var(--accent)' : 'var(--line)',
      display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{addr.label?.[lang] || addr.label?.en}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
            {addr.country} · {addr.postal}
          </div>
        </div>
        {addr.isDefault && <Chip tone="accent" small><IconStar size={9}/>&nbsp;{tA.default}</Chip>}
      </div>
      <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--ink)' }}>
        <div style={{ fontWeight: 500 }}>{addr.receiver?.[lang] || addr.receiver?.en}</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>{addr.receiverPhone}</div>
        <div style={{ marginTop: 4, color: 'var(--muted2)' }}>
          {addr.line1?.[lang]} · {addr.subDistrict?.[lang]} · {addr.district?.[lang]} · {addr.province?.[lang]} {addr.postal}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
        <button className="btn-ghost" onClick={onEdit} style={{ fontSize: 11 }}>
          <IconEdit size={11}/>&nbsp;{tA.edit}
        </button>
        {!addr.isDefault && (
          <button className="btn-ghost" onClick={onMakeDefault} style={{ fontSize: 11 }}>
            {tA.makeDefault}
          </button>
        )}
        {!addr.isDefault && (
          <button className="btn-ghost" onClick={onRemove} style={{ fontSize: 11, color: 'oklch(0.45 0.18 25)' }}>
            <IconTrash size={11}/>&nbsp;{tA.remove}
          </button>
        )}
      </div>
    </div>
  );
}

function AddressesSection({ addresses, setAddresses }) {
  const { t, lang } = useT();
  const tA = t.account || {};
  const setDefault = id => setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
  const remove = id => setAddresses(addresses.filter(a => a.id !== id));

  return (
    <div>
      <PageHeader title={tA.sections?.addresses} subtitle={tA.addresses?.subtitle}
        actions={<button className="btn-primary"><IconPlus size={12}/>&nbsp;{tA.addresses?.addNew}</button>}/>
      {addresses.length === 0 ? (
        <Card><EmptyState icon={<IconPin size={22}/>} title={tA.addresses?.none}
          actionLabel={tA.addresses?.addNew} onAction={() => {}}/></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {addresses.map(a => <AddressCard key={a.id} addr={a} lang={lang} tA={tA}
            onMakeDefault={() => setDefault(a.id)} onRemove={() => remove(a.id)} onEdit={() => {}}/>)}
        </div>
      )}
    </div>
  );
}

function BillingSection({ customer, addresses }) {
  const { t, lang } = useT();
  const tA = t.account || {};
  const defaultAddr = addresses.find(a => a.isDefault);
  const [sameAsShipping, setSame] = useSt(true);

  return (
    <div>
      <PageHeader title={tA.sections?.billing} subtitle={tA.billing?.subtitle}/>

      <Card title={tA.billing?.title}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 16 }}>
          <input type="checkbox" checked={sameAsShipping} onChange={e => setSame(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}/>
          <span style={{ fontSize: 13 }}>ใช้ที่อยู่จัดส่งเริ่มต้นเป็นที่อยู่เรียกเก็บเงิน</span>
        </label>
        {!sameAsShipping && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="ชื่อผู้รับใบแจ้งหนี้" span={2}><TextInput value={customer.companyName}/></Field>
            <Field label="เลขประจำตัวผู้เสียภาษี"><TextInput mono value={customer.taxId}/></Field>
            <Field label="สาขา"><TextInput mono value={customer.branch}/></Field>
          </div>
        )}
      </Card>

      <Card title="ตัวอย่างใบกำกับภาษี" subtitle="ข้อมูลนี้จะปรากฏบนใบกำกับภาษีของคุณ">
        <div style={{ background: 'var(--chip)', padding: 20, borderRadius: 6, fontSize: 13,
          fontFamily: 'var(--sans)', border: '1px dashed var(--line)' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)',
            letterSpacing: 1.5, marginBottom: 8 }}>TAX INVOICE / ใบกำกับภาษี</div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{customer.companyName}</div>
          <div style={{ color: 'var(--muted)', fontSize: 12 }}>{customer.companyNameEn}</div>
          <div style={{ marginTop: 8, fontSize: 12 }}>
            เลขประจำตัวผู้เสียภาษี: <span style={{ fontFamily: 'var(--mono)' }}>{customer.taxId}</span>
            {' · '}สาขา: <span style={{ fontFamily: 'var(--mono)' }}>{customer.branch}</span>
          </div>
          {defaultAddr && (
            <div style={{ marginTop: 8, fontSize: 12, lineHeight: 1.6, color: 'var(--muted2)' }}>
              {defaultAddr.line1?.[lang]}<br/>
              {defaultAddr.subDistrict?.[lang]} {defaultAddr.district?.[lang]} {defaultAddr.province?.[lang]} {defaultAddr.postal}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { ProfileSection, AddressesSection, BillingSection });
