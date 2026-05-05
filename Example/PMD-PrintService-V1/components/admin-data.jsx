// Admin mock data + helpers (Thai-context PMD)
const ADMIN = {};

ADMIN.fmt = {
  THB: (n) => '฿' + Math.round(n).toLocaleString('th-TH'),
  num: (n, d = 0) => Number(n).toLocaleString('th-TH', { minimumFractionDigits: d, maximumFractionDigits: d }),
  date: (s) => s, // pre-formatted strings in mock
  rel: (s) => s,
};

// Status palette — used across all status pills
ADMIN.STATUS = {
  paid:       { label: 'Paid',        bg: 'color-mix(in oklch, var(--positive) 18%, transparent)', fg: 'var(--positive)' },
  unpaid:     { label: 'Unpaid',      bg: 'color-mix(in oklch, var(--warn) 18%, transparent)',     fg: 'oklch(0.55 0.15 65)' },
  queue:      { label: 'In queue',    bg: 'var(--chip)',                                            fg: 'var(--muted2)' },
  printing:   { label: 'Printing',    bg: 'color-mix(in oklch, var(--accent) 18%, transparent)',    fg: 'var(--accent)' },
  post:       { label: 'Post-proc',   bg: 'color-mix(in oklch, var(--accent) 12%, transparent)',    fg: 'var(--accent)' },
  qa:         { label: 'QA',          bg: 'color-mix(in oklch, var(--warn) 14%, transparent)',      fg: 'oklch(0.55 0.15 65)' },
  shipped:    { label: 'Shipped',     bg: 'color-mix(in oklch, var(--positive) 14%, transparent)', fg: 'var(--positive)' },
  delivered:  { label: 'Delivered',   bg: 'color-mix(in oklch, var(--positive) 22%, transparent)', fg: 'var(--positive)' },
  cancelled:  { label: 'Cancelled',   bg: 'color-mix(in oklch, var(--danger) 14%, transparent)',   fg: 'var(--danger)' },
  refunded:   { label: 'Refunded',    bg: 'var(--chip)',                                            fg: 'var(--muted2)' },
  failed:     { label: 'Failed',      bg: 'color-mix(in oklch, var(--danger) 14%, transparent)',   fg: 'var(--danger)' },
  draft:      { label: 'Draft',       bg: 'var(--chip)',                                            fg: 'var(--muted2)' },
  sent:       { label: 'Sent',        bg: 'color-mix(in oklch, var(--accent) 14%, transparent)',    fg: 'var(--accent)' },
  expired:    { label: 'Expired',     bg: 'var(--chip)',                                            fg: 'var(--muted2)' },
  won:        { label: 'Won',         bg: 'color-mix(in oklch, var(--positive) 18%, transparent)', fg: 'var(--positive)' },
  lost:       { label: 'Lost',        bg: 'color-mix(in oklch, var(--danger) 12%, transparent)',   fg: 'var(--danger)' },
};

// Orders — realistic Thai customer mix, multi-line items, mixed processes
ADMIN.orders = [
  { id: 'PMD-2581', date: '25 เม.ย. 2026 14:32', customer: 'สมชาย วีระพันธุ์', email: 'somchai.v@gmail.com', items: 4, weight: 184, total: 4280, paid: true, status: 'printing', proc: 'FDM', material: 'PLA', color: '#28c868', ship: 'Kerry Express', track: 'KEX9381204', note: 'ลูกค้าขอด่วน' },
  { id: 'PMD-2580', date: '25 เม.ย. 2026 11:08', customer: 'Lina Phuong',        email: 'lina.p@studio.co', items: 1, weight: 62,  total: 1820, paid: true, status: 'qa',       proc: 'SLA', material: 'Tough Resin',color: '#444', ship: 'Lalamove', track: '—', note: '' },
  { id: 'PMD-2579', date: '25 เม.ย. 2026 09:51', customer: 'นายแพทย์ ธนพงศ์ จันทรา', email: 'dr.thanapong@hosp.go.th', items: 2, weight: 410, total: 12450, paid: true, status: 'post',     proc: 'SLS', material: 'PA12 Nylon', color: '#ddd', ship: 'Flash', track: 'FLA2058114', note: 'อุปกรณ์การแพทย์ — ใส่ใบกำกับภาษี' },
  { id: 'PMD-2578', date: '24 เม.ย. 2026 17:24', customer: 'Studio Quark Co., Ltd.', email: 'orders@quark.studio', items: 8, weight: 720, total: 18900, paid: true, status: 'queue',    proc: 'FDM', material: 'PETG', color: '#0aa', ship: 'Kerry Express', track: '—', note: 'PO-2026-118' },
  { id: 'PMD-2577', date: '24 เม.ย. 2026 13:02', customer: 'พิชญา สุวรรณวงศ์',     email: 'pich.s@yahoo.com', items: 1, weight: 28,  total: 690,  paid: false, status: 'unpaid',   proc: 'FDM', material: 'PLA',  color: '#e44', ship: '—', track: '—', note: 'รอแจ้งโอน' },
  { id: 'PMD-2576', date: '24 เม.ย. 2026 10:15', customer: 'Kanok Industries',        email: 'sales@kanok.co.th', items: 12, weight: 1840, total: 38600, paid: true, status: 'shipped', proc: 'MJF', material: 'PA12',color: '#222', ship: 'Inter Express', track: 'INT55811029', note: '' },
  { id: 'PMD-2575', date: '23 เม.ย. 2026 19:48', customer: 'Aran Vichit',             email: 'aran@designhouse.co', items: 3, weight: 156, total: 5240, paid: true, status: 'delivered', proc: 'SLA', material: 'Clear Resin',color: '#ace', ship: 'Lalamove', track: 'LM-7720114', note: '' },
  { id: 'PMD-2574', date: '23 เม.ย. 2026 14:11', customer: 'มหาวิทยาลัย จุฬาฯ',     email: 'lab@chula.ac.th', items: 6, weight: 502, total: 14200, paid: true, status: 'printing', proc: 'FDM', material: 'ABS',  color: '#888', ship: 'EMS', track: '—', note: 'ใบสั่งซื้อราชการ' },
  { id: 'PMD-2573', date: '23 เม.ย. 2026 09:33', customer: 'Mai Tan',                 email: 'mai.t@gmail.com', items: 2, weight: 88,  total: 2180, paid: true, status: 'cancelled',proc: 'FDM', material: 'TPU',  color: '#c4f', ship: '—', track: '—', note: 'ลูกค้ายกเลิก — refund แล้ว' },
  { id: 'PMD-2572', date: '22 เม.ย. 2026 16:22', customer: 'BangkokMakers',           email: 'bm@hello.com', items: 5, weight: 230, total: 6800, paid: true, status: 'delivered',proc: 'FDM', material: 'PLA',  color: '#fa0', ship: 'Kerry Express', track: 'KEX9376112', note: '' },
  { id: 'PMD-2571', date: '22 เม.ย. 2026 11:14', customer: 'Nicha P.',                email: 'nicha.p@gmail.com', items: 1, weight: 45,  total: 1280, paid: false, status: 'unpaid',   proc: 'SLA', material: 'Std Resin',color: '#fff', ship: '—', track: '—', note: '' },
  { id: 'PMD-2570', date: '22 เม.ย. 2026 08:55', customer: 'Architek Co.',            email: 'p@architek.co', items: 3, weight: 1200, total: 22400, paid: true, status: 'qa',     proc: 'SLA', material: 'Architectural',color: '#fff', ship: 'Inter Express', track: '—', note: 'โมเดลสถาปัตย์ scale 1:200' },
];

// Quotations
ADMIN.quotations = [
  { id: 'Q-2026-0418', date: '25 เม.ย. 2026', customer: 'Phra Ram Co., Ltd.', email: 'noi@phraram.co.th', items: 14, total: 84500, valid: '08 พ.ค. 2026', status: 'sent', source: 'Web', owner: 'Aran' },
  { id: 'Q-2026-0417', date: '25 เม.ย. 2026', customer: 'นพดล ศรีสุวรรณ',  email: 'noppadol@gmail.com', items: 2, total: 3680, valid: '02 พ.ค. 2026', status: 'won', source: 'Web', owner: 'Auto' },
  { id: 'Q-2026-0416', date: '24 เม.ย. 2026', customer: 'Arkae Studio',  email: 'design@arkae.co', items: 6, total: 24800, valid: '01 พ.ค. 2026', status: 'sent', source: 'Email', owner: 'Praew' },
  { id: 'Q-2026-0415', date: '24 เม.ย. 2026', customer: 'Suriya P.',    email: 'suriya@gmail.com', items: 1, total: 1450, valid: '01 พ.ค. 2026', status: 'expired', source: 'Web', owner: 'Auto' },
  { id: 'Q-2026-0414', date: '23 เม.ย. 2026', customer: 'มหาวิทยาลัย เกษตรศาสตร์', email: 'eng@ku.ac.th', items: 22, total: 142800, valid: '07 พ.ค. 2026', status: 'sent', source: 'PO', owner: 'Aran' },
  { id: 'Q-2026-0413', date: '23 เม.ย. 2026', customer: 'Pim K.',       email: 'pim@gmail.com', items: 3, total: 8200, valid: '30 เม.ย. 2026', status: 'lost', source: 'Web', owner: 'Auto', lostReason: 'Price' },
  { id: 'Q-2026-0412', date: '22 เม.ย. 2026', customer: 'Saimai Toy Lab', email: 'saimai@toylab.co', items: 4, total: 11800, valid: '06 พ.ค. 2026', status: 'won', source: 'Web', owner: 'Auto' },
  { id: 'Q-2026-0411', date: '22 เม.ย. 2026', customer: 'Tanin C.',     email: 'tanin.c@hotmail.com', items: 2, total: 4400, valid: '06 พ.ค. 2026', status: 'draft', source: 'Web', owner: 'Praew' },
];

// Users — customers + staff mixed, filterable
ADMIN.users = [
  { id: 'U-1042', name: 'สมชาย วีระพันธุ์', email: 'somchai.v@gmail.com', role: 'customer', tier: 'Gold',   orders: 14, spend: 48200, joined: '12 ส.ค. 2024', status: 'active', last: '2 ชม. ที่แล้ว' },
  { id: 'U-1041', name: 'Lina Phuong',          email: 'lina.p@studio.co',     role: 'customer', tier: 'Silver', orders: 6,  spend: 14800, joined: '03 ม.ค. 2025', status: 'active', last: '1 วัน' },
  { id: 'U-1040', name: 'นพ. ธนพงศ์ จันทรา',     email: 'dr.thanapong@hosp.go.th', role: 'customer', tier: 'B2B',    orders: 28, spend: 184000, joined: '22 ม.ค. 2024', status: 'active', last: '3 ชม.' },
  { id: 'U-1039', name: 'Studio Quark Co., Ltd.', email: 'orders@quark.studio',role: 'customer', tier: 'B2B',    orders: 41, spend: 312800, joined: '08 พ.ย. 2023', status: 'active', last: '7 ชม.' },
  { id: 'U-1038', name: 'พิชญา สุวรรณวงศ์',      email: 'pich.s@yahoo.com',     role: 'customer', tier: 'Bronze', orders: 1,  spend: 690,    joined: '24 เม.ย. 2026', status: 'pending', last: 'วันนี้' },
  { id: 'U-1037', name: 'Mai Tan',              email: 'mai.t@gmail.com',      role: 'customer', tier: 'Bronze', orders: 3,  spend: 4280,   joined: '11 ก.พ. 2026', status: 'active', last: '2 วัน' },
  { id: 'U-0024', name: 'Aran Vichit',          email: 'aran@printmydesign.net', role: 'sales',    tier: '—',     orders: 0, spend: 0, joined: '01 ม.ค. 2024', status: 'active', last: '5 นาที' },
  { id: 'U-0023', name: 'Praew K.',             email: 'praew@printmydesign.net', role: 'ops',      tier: '—',     orders: 0, spend: 0, joined: '15 ก.พ. 2024', status: 'active', last: '12 นาที' },
  { id: 'U-0022', name: 'Niran T.',             email: 'niran@printmydesign.net', role: 'admin',    tier: '—',     orders: 0, spend: 0, joined: '01 ม.ค. 2024', status: 'active', last: '1 ชม.' },
  { id: 'U-1029', name: 'banned_user',          email: 'spam@spam.co',         role: 'customer', tier: '—',     orders: 0, spend: 0, joined: '14 มี.ค. 2026', status: 'banned', last: '40 วัน' },
];

// 3D files library
ADMIN.files = [
  { id: 'F-9821', name: 'gear_housing_v3.stl', size: 4.2, owner: 'somchai.v@gmail.com', order: 'PMD-2581', volume: 64.2, tris: 184260, watertight: true, uploaded: '25 เม.ย. 2026 14:31' },
  { id: 'F-9820', name: 'bracket_left.step',   size: 1.8, owner: 'lina.p@studio.co',     order: 'PMD-2580', volume: 28.4, tris: 92400,  watertight: true, uploaded: '25 เม.ย. 2026 11:07' },
  { id: 'F-9819', name: 'mandible_jig.stl',    size: 8.6, owner: 'dr.thanapong@hosp.go.th', order: 'PMD-2579', volume: 142.8, tris: 412800, watertight: true, uploaded: '25 เม.ย. 2026 09:48' },
  { id: 'F-9818', name: 'PROD-A14_shell.3mf',  size: 3.1, owner: 'orders@quark.studio',  order: 'PMD-2578', volume: 84.4, tris: 220400, watertight: true, uploaded: '24 เม.ย. 2026 17:20' },
  { id: 'F-9817', name: 'cosplay_helmet.stl',  size: 22.4,owner: 'pich.s@yahoo.com',    order: 'PMD-2577', volume: 28.1, tris: 880200, watertight: false, uploaded: '24 เม.ย. 2026 12:58' },
  { id: 'F-9816', name: 'arch_model_1-200.stl', size: 18.2,owner: 'p@architek.co',     order: 'PMD-2570', volume: 1180, tris: 624800, watertight: true, uploaded: '22 เม.ย. 2026 08:50' },
  { id: 'F-9815', name: 'figure_pose_v2.obj',  size: 6.4, owner: 'mai.t@gmail.com',     order: '—',        volume: 88.0, tris: 188000, watertight: true, uploaded: '21 เม.ย. 2026 22:14' },
];

// 3D Print Technologies — top of the catalog hierarchy
// Each technology owns: printers, default markup tiers, descriptive metadata
ADMIN.technologies = [
  {
    id: 'fdm', name: 'FDM',
    fullName: 'Fused Deposition Modeling',
    nameTh: 'พิมพ์เส้นพลาสติกเทอร์โมพลาสติก',
    desc: 'เครื่องพิมพ์ใช้เส้นพลาสติกหลอมแล้วฉีดเป็นชั้นๆ — เร็ว ราคาถูก เหมาะกับชิ้นงานทั่วไปและต้นแบบ',
    icon: '⊟', tone: '#8848a8', active: true,
    printers: ['p-mk4', 'p-xl', 'p-mini', 'p-bambu'],
    materialUnit: 'g',
    leadDays: 1,
    notes: 'Layer 0.07–0.30 mm · ผิวหยาบกว่า SLA · พิมพ์ได้หลายสี',
  },
  {
    id: 'sla', name: 'SLA / DLP',
    fullName: 'Stereolithography',
    nameTh: 'พิมพ์เรซิ่นด้วยแสง',
    desc: 'ใช้แสง UV ฉายลงบนเรซิ่นเหลวเพื่อแข็งตัวเป็นชั้นๆ — ผิวเรียบที่สุด รายละเอียดสูง เหมาะกับฟิกเกอร์และชิ้นงานต้นแบบที่ต้องการความสวยงาม',
    icon: '◐', tone: '#683888', active: true,
    printers: ['p-elegoo', 'p-form'],
    materialUnit: 'mL',
    leadDays: 2,
    notes: 'Layer 0.025–0.10 mm · ต้องอบ UV หลังพิมพ์ · ระวังเปราะกว่า FDM',
  },
  {
    id: 'sls', name: 'SLS',
    fullName: 'Selective Laser Sintering',
    nameTh: 'พิมพ์ผงไนลอนด้วยเลเซอร์',
    desc: 'ใช้เลเซอร์เผาผง nylon ทีละชั้น ไม่ต้องใช้ support — เหมาะกับชิ้นงานที่ใช้งานจริง รับแรงได้',
    icon: '▦', tone: '#0a8454', active: true,
    printers: ['p-eos-formiga'],
    materialUnit: 'g',
    leadDays: 4,
    notes: 'Layer 0.10–0.12 mm · งาน end-use parts · พิมพ์ได้ซับซ้อน',
  },
  {
    id: 'mjf', name: 'MJF',
    fullName: 'Multi Jet Fusion',
    nameTh: 'พิมพ์ผงด้วยน้ำยาและความร้อน',
    desc: 'HP MJF 5200 — ฉีดน้ำยาบนผง PA12 แล้วใช้ความร้อนรวมกัน — แข็งแรงและผิวดีกว่า SLS',
    icon: '▥', tone: '#1d4ed8', active: true,
    printers: ['p-hp-5200'],
    materialUnit: 'g',
    leadDays: 4,
    notes: 'Layer 0.08 mm · Production-grade · ย้อมสีได้',
  },
  {
    id: 'metal', name: 'Metal',
    fullName: 'DMLS / SLM',
    nameTh: 'พิมพ์โลหะด้วยเลเซอร์',
    desc: 'Direct Metal Laser Sintering — พิมพ์ผงโลหะเป็นชิ้นงาน — ราคาสูง เหมาะกับงาน aerospace, medical, ทันตกรรม',
    icon: '◆', tone: '#52525b', active: true,
    printers: ['p-eos-m290'],
    materialUnit: 'g',
    leadDays: 7,
    notes: 'Stainless 316L, Titanium Ti64, AlSi10Mg, CoCr · ต้องผ่าน CNC post-proc',
  },
];

// Printers — referenced by technology.printers (foreign keys)
ADMIN.printers = [
  { id: 'p-mk4',         name: 'Prusa MK4',        tech: 'fdm', count: 4, active: true },
  { id: 'p-xl',          name: 'Prusa XL (5T)',    tech: 'fdm', count: 2, active: true },
  { id: 'p-mini',        name: 'Prusa MINI+',      tech: 'fdm', count: 6, active: true },
  { id: 'p-bambu',       name: 'Bambu X1C',        tech: 'fdm', count: 8, active: true },
  { id: 'p-elegoo',      name: 'Elegoo Saturn 4',  tech: 'sla', count: 3, active: true },
  { id: 'p-form',        name: 'Formlabs Form 3+', tech: 'sla', count: 2, active: false },
  { id: 'p-eos-formiga', name: 'EOS Formiga P110', tech: 'sls', count: 1, active: true },
  { id: 'p-hp-5200',     name: 'HP Jet Fusion 5200',tech:'mjf', count: 1, active: true },
  { id: 'p-eos-m290',    name: 'EOS M290',          tech:'metal',count: 1, active: true },
];

// Materials — each belongs to ONE technology, with full pricing/dimensions/compatibility
// volume.min/max in millimetres (X × Y × Z)
ADMIN.materials = [
  { id: 'M-PLA-PRO', tech: 'fdm', name: 'PLA Pro',        nameTh: 'PLA โปร',
    stock: 84.4, unit: 'kg', cost: 480, price: 1.8, density: 1.24, lead: 1, active: true,
    volume: { min: [5, 5, 1], max: [350, 350, 350] },
    colors: ['c-black','c-white','c-gray','c-red','c-orange','c-yellow','c-green','c-cyan','c-blue','c-purple','c-magenta'],
    postProc: ['PP-01','PP-02','PP-03','PP-04','PP-08'],
    desc: 'ใช้งานทั่วไป · ราคาถูกที่สุด · ไม่ทนความร้อนสูง' },
  { id: 'M-PETG',    tech: 'fdm', name: 'PETG',           nameTh: 'PETG',
    stock: 28.2, unit: 'kg', cost: 520, price: 2.1, density: 1.27, lead: 1, active: true,
    volume: { min: [5, 5, 1], max: [350, 350, 350] },
    colors: ['c-black','c-white','c-clear','c-red','c-blue','c-green'],
    postProc: ['PP-01','PP-02','PP-04','PP-08'],
    desc: 'ทนน้ำมัน ทนสารเคมี · เหนียวกว่า PLA' },
  { id: 'M-ABS',     tech: 'fdm', name: 'ABS',            nameTh: 'ABS',
    stock: 14.0, unit: 'kg', cost: 540, price: 2.4, density: 1.04, lead: 2, active: true,
    volume: { min: [5, 5, 2], max: [256, 256, 256] },
    colors: ['c-black','c-white','c-gray','c-red'],
    postProc: ['PP-01','PP-02','PP-03','PP-04'],
    desc: 'ทนความร้อน · กลึงและเชื่อมได้ · กลิ่นแรง' },
  { id: 'M-TPU',     tech: 'fdm', name: 'TPU 95A',        nameTh: 'TPU ยืดหยุ่น',
    stock: 6.4,  unit: 'kg', cost: 880, price: 4.2, density: 1.21, lead: 2, active: true,
    volume: { min: [10, 10, 2], max: [250, 210, 220] },
    colors: ['c-black','c-white','c-clear'],
    postProc: ['PP-01'],
    desc: 'ยืดหยุ่นเหมือนยาง · เหมาะกับ gasket / phone case' },
  { id: 'M-PA-CF',   tech: 'fdm', name: 'PA-CF Carbon',   nameTh: 'ไนลอนเสริมคาร์บอน',
    stock: 2.1,  unit: 'kg', cost: 2400, price: 9.8, density: 1.10, lead: 3, active: true,
    volume: { min: [10, 10, 2], max: [256, 256, 256] },
    colors: ['c-black'],
    postProc: ['PP-01','PP-02'],
    desc: 'แข็งแรงเทียบโลหะ · งานวิศวกรรม / แม่พิมพ์' },
  { id: 'M-RES-STD', tech: 'sla', name: 'Standard Resin', nameTh: 'เรซิ่นมาตรฐาน',
    stock: 12.4, unit: 'L', cost: 980, price: 4.8, density: 1.10, lead: 2, active: true,
    volume: { min: [2, 2, 1], max: [218, 123, 260] },
    colors: ['c-black','c-white','c-gray','c-red','c-clear'],
    postProc: ['PP-01','PP-05','PP-02','PP-03','PP-04'],
    desc: 'รายละเอียดสูง · เหมาะ figure / โมเดลโชว์' },
  { id: 'M-RES-TGH', tech: 'sla', name: 'Tough Resin',    nameTh: 'เรซิ่นเหนียว',
    stock: 4.8,  unit: 'L', cost: 1480, price: 7.2, density: 1.12, lead: 2, active: true,
    volume: { min: [2, 2, 1], max: [218, 123, 260] },
    colors: ['c-gray','c-black'],
    postProc: ['PP-01','PP-05','PP-02','PP-04'],
    desc: 'เหนียวกว่ามาตรฐาน · งาน prototype ทดสอบกล' },
  { id: 'M-RES-CLR', tech: 'sla', name: 'Clear Resin',    nameTh: 'เรซิ่นใส',
    stock: 7.2,  unit: 'L', cost: 1240, price: 5.8, density: 1.10, lead: 3, active: true,
    volume: { min: [2, 2, 1], max: [145, 145, 185] },
    colors: ['c-clear'],
    postProc: ['PP-01','PP-05','PP-03'],
    desc: 'ใส่ผ่านแสง · ต้องขัดละเอียด' },
  { id: 'M-PA12-SLS',tech: 'sls', name: 'PA12 Nylon',     nameTh: 'ไนลอน PA12',
    stock: 22.4, unit: 'kg', cost: 1850, price: 11.2, density: 1.01, lead: 4, active: true,
    volume: { min: [10, 10, 2], max: [200, 250, 330] },
    colors: ['c-white','c-gray'],
    postProc: ['PP-01','PP-06','PP-07'],
    desc: 'End-use parts · ไม่ต้อง support' },
  { id: 'M-PA12-GF', tech: 'sls', name: 'PA12 Glass-fill',nameTh: 'PA12 + ใยแก้ว',
    stock: 8.0,  unit: 'kg', cost: 2400, price: 14.5, density: 1.22, lead: 4, active: true,
    volume: { min: [10, 10, 2], max: [200, 250, 330] },
    colors: ['c-white','c-gray'],
    postProc: ['PP-01','PP-06','PP-07'],
    desc: 'เสริมความแข็งด้วยใยแก้ว · งานทนแรง' },
  { id: 'M-MJF-PA12',tech: 'mjf', name: 'PA12 (HP)',      nameTh: 'PA12 สำหรับ HP',
    stock: 18.2, unit: 'kg', cost: 1980, price: 12.8, density: 1.01, lead: 4, active: true,
    volume: { min: [10, 10, 2], max: [380, 284, 380] },
    colors: ['c-gray','c-black'],
    postProc: ['PP-01','PP-06','PP-07'],
    desc: 'ผิวเรียบกว่า SLS · ย้อมดำได้ดี' },
  { id: 'M-MET-316L',tech: 'metal',name: 'Stainless 316L',nameTh: 'สแตนเลส 316L',
    stock: 12.0, unit: 'kg', cost: 5800, price: 48,    density: 8.0,  lead: 7, active: true,
    volume: { min: [5, 5, 2], max: [250, 250, 325] },
    colors: ['c-metal-raw','c-metal-polish'],
    postProc: ['PP-01','PP-09','PP-10','PP-11'],
    desc: 'ทนสนิม · งาน medical / food-grade' },
  { id: 'M-MET-TI64',tech: 'metal',name: 'Titanium Ti64', nameTh: 'ไทเทเนียม Ti64',
    stock: 4.2,  unit: 'kg', cost: 28000, price: 220,   density: 4.43, lead: 10, active: true,
    volume: { min: [5, 5, 2], max: [250, 250, 325] },
    colors: ['c-metal-raw','c-metal-polish'],
    postProc: ['PP-01','PP-09','PP-10','PP-11'],
    desc: 'น้ำหนักเบา แข็งแรงสูง · aerospace / dental' },
  { id: 'M-MET-AL',  tech: 'metal',name: 'AlSi10Mg',      nameTh: 'อลูมิเนียม AlSi10Mg',
    stock: 8.4,  unit: 'kg', cost: 4200, price: 38,    density: 2.67, lead: 7, active: false,
    volume: { min: [5, 5, 2], max: [250, 250, 325] },
    colors: ['c-metal-raw','c-metal-polish'],
    postProc: ['PP-01','PP-09','PP-10','PP-11'],
    desc: 'น้ำหนักเบา · งานยานยนต์ / drone' },
];

// Colors swatches — referenced by ID from materials.colors[]
ADMIN.colors = [
  { id: 'c-black',        hex: '#000000', name: 'Black',     procs: 'FDM/SLA/SLS/MJF', avail: 8 },
  { id: 'c-white',        hex: '#ffffff', name: 'White',     procs: 'FDM/SLA/SLS/MJF', avail: 9 },
  { id: 'c-gray',         hex: '#9aa0a6', name: 'Gray',      procs: 'FDM/SLA/SLS/MJF', avail: 6 },
  { id: 'c-red',          hex: '#dc2626', name: 'Red',       procs: 'FDM/SLA',         avail: 4 },
  { id: 'c-orange',       hex: '#ea580c', name: 'Orange',    procs: 'FDM',             avail: 3 },
  { id: 'c-yellow',       hex: '#eab308', name: 'Yellow',    procs: 'FDM',             avail: 3 },
  { id: 'c-green',        hex: '#28c868', name: 'Green',     procs: 'FDM',             avail: 4 },
  { id: 'c-cyan',         hex: '#0891b2', name: 'Cyan',      procs: 'FDM',             avail: 3 },
  { id: 'c-blue',         hex: '#1d4ed8', name: 'Blue',      procs: 'FDM',             avail: 4 },
  { id: 'c-purple',       hex: '#8848a8', name: 'Purple',    procs: 'FDM',             avail: 2 },
  { id: 'c-magenta',      hex: '#be185d', name: 'Magenta',   procs: 'FDM',             avail: 2 },
  { id: 'c-clear',        hex: 'clear',   name: 'Clear',     procs: 'SLA/PETG/TPU',    avail: 3 },
  { id: 'c-metal-raw',    hex: '#a8a29e', name: 'As-printed (raw metal)', procs: 'Metal', avail: 4 },
  { id: 'c-metal-polish', hex: '#d6d3d1', name: 'Polished',  procs: 'Metal',           avail: 4 },
];

// Post-processing — referenced by ID from materials.postProc[]
ADMIN.postProc = [
  { id: 'PP-01', name: 'Support removal',     proc: 'all',     cost: 30,  time: 5,   default: true,  active: true,  desc: 'รื้อ support และทำความสะอาดเบื้องต้น' },
  { id: 'PP-02', name: 'Basic sanding (P400)',proc: 'FDM/SLA', cost: 80,  time: 15,  default: false, active: true,  desc: 'ขัดหยาบ — เพื่อพ่นต่อ' },
  { id: 'PP-03', name: 'Fine sanding (P1500)',proc: 'FDM/SLA', cost: 220, time: 40,  default: false, active: true,  desc: 'ขัดละเอียด — ผิวเรียบใกล้เคียงพร้อมใช้' },
  { id: 'PP-04', name: 'Primer + paint',      proc: 'all',     cost: 480, time: 60,  default: false, active: true,  desc: 'รองพื้น + พ่นสี matt/gloss' },
  { id: 'PP-05', name: 'UV cure',             proc: 'SLA',     cost: 60,  time: 12,  default: true,  active: true,  desc: 'อบแสง UV หลังพิมพ์' },
  { id: 'PP-06', name: 'Bead blast',          proc: 'SLS/MJF', cost: 120, time: 8,   default: true,  active: true,  desc: 'พ่นทรายเพื่อผิวเรียบ' },
  { id: 'PP-07', name: 'Dye (black)',         proc: 'SLS/MJF', cost: 280, time: 30,  default: false, active: true,  desc: 'ย้อมสีดำสำหรับ PA12' },
  { id: 'PP-08', name: 'Threaded inserts',    proc: 'FDM',     cost: 180, time: 10,  default: false, active: false, desc: 'ฝัง heat-set inserts (M3/M4)' },
  { id: 'PP-09', name: 'Heat treatment',      proc: 'Metal',   cost: 1200,time: 240, default: true,  active: true,  desc: 'อบเพื่อลดความเครียดในเนื้อโลหะ' },
  { id: 'PP-10', name: 'CNC machining',       proc: 'Metal',   cost: 1800,time: 90,  default: false, active: true,  desc: 'กลึงผิวสัมผัสและรูเกลียวให้ได้พิกัด' },
  { id: 'PP-11', name: 'Polish (mirror)',     proc: 'Metal',   cost: 2400,time: 120, default: false, active: true,  desc: 'ขัดเงาแบบกระจก — งานเครื่องประดับ' },
];

// Cost & markup config (single object so it's editable in Tweaks easily)
ADMIN.cost = {
  energy:    { label: 'Energy',         per: 'kWh', cost: 4.2,  unit: '฿/kWh' },
  labor:     { label: 'Labor',          per: 'h',   cost: 180,  unit: '฿/h' },
  machine:   { label: 'Machine depreciation', per: 'h', cost: 24, unit: '฿/h' },
  packaging: { label: 'Packaging',      per: 'order',cost: 35,  unit: '฿/order' },
  failure:   { label: 'Failure rate',   per: '%',   cost: 8,    unit: '%' },

  markup: {
    fdm:   { material: 220, machine: 35, min: 80 },
    sla:   { material: 180, machine: 60, min: 150 },
    sls:   { material: 140, machine: 80, min: 350 },
    mjf:   { material: 140, machine: 80, min: 350 },
    metal: { material: 80,  machine: 120, min: 1500 },
  },

  rush: { sameDay: 80, day1: 50, day2: 25 }, // % uplift
  quantity: [
    { qty: 5,   discount: 5 },
    { qty: 10,  discount: 10 },
    { qty: 25,  discount: 18 },
    { qty: 50,  discount: 25 },
    { qty: 100, discount: 32 },
  ],
  tax: 7,
};

// Shipping providers
ADMIN.shippers = [
  { id: 'kerry',    name: 'Kerry Express', enabled: true,  api: 'connected',  base: 45,  perKg: 12, free: 1500, codFee: 25, sla: '1-2 วัน', logo: '🟧' },
  { id: 'flash',    name: 'Flash Express', enabled: true,  api: 'connected',  base: 40,  perKg: 10, free: 1500, codFee: 20, sla: '1-2 วัน', logo: '🟨' },
  { id: 'lalamove', name: 'Lalamove',       enabled: true,  api: 'connected',  base: 80,  perKg: 0,  free: null, codFee: 0,  sla: 'Same-day', logo: '🟥' },
  { id: 'inter',    name: 'Inter Express',  enabled: true,  api: 'connected',  base: 60,  perKg: 8,  free: 2500, codFee: 30, sla: '2-3 วัน', logo: '🟦' },
  { id: 'ems',      name: 'EMS (ไปรษณีย์)', enabled: true,  api: 'manual',     base: 50,  perKg: 14, free: null, codFee: 35, sla: '2-3 วัน', logo: '⬛' },
  { id: 'jt',       name: 'J&T Express',    enabled: false, api: 'disconnected', base: 38,perKg: 10, free: null, codFee: 20, sla: '2 วัน', logo: '🟥' },
  { id: 'pickup',   name: 'รับเองที่ร้าน',  enabled: true,  api: 'n/a',        base: 0,   perKg: 0,  free: 0,    codFee: 0,  sla: 'Same-day',logo: '🏪' },
];

// PrusaSlicer printer profiles + active config
ADMIN.slicer = {
  binPath: '/usr/local/bin/prusa-slicer',
  version: '2.7.4',
  configDir: '/var/pmd/slicer-profiles',
  parallelJobs: 4,
  timeoutSec: 180,
  defaultLayer: 0.2,
  printers: [
    { id: 'p-mk4',     name: 'Prusa MK4',       proc: 'FDM', bed: '250×210×220', layers: '0.07-0.30', active: true,  jobs: 4128, lastUsed: '2 นาที' },
    { id: 'p-xl',      name: 'Prusa XL (5T)',   proc: 'FDM', bed: '360×360×360', layers: '0.10-0.30', active: true,  jobs: 1284, lastUsed: '24 นาที' },
    { id: 'p-mini',    name: 'Prusa MINI+',     proc: 'FDM', bed: '180×180×180', layers: '0.07-0.25', active: true,  jobs: 880,  lastUsed: '1 ชม.' },
    { id: 'p-bambu',   name: 'Bambu X1C',       proc: 'FDM', bed: '256×256×256', layers: '0.08-0.32', active: true,  jobs: 2412, lastUsed: '8 นาที' },
    { id: 'p-elegoo',  name: 'Elegoo Saturn 4', proc: 'SLA', bed: '218×123×260', layers: '0.025-0.10',active: true,  jobs: 612,  lastUsed: '40 นาที' },
    { id: 'p-form',    name: 'Formlabs Form 3+',proc: 'SLA', bed: '145×145×185', layers: '0.025-0.10',active: false, jobs: 88,   lastUsed: '14 วัน' },
  ],
  recentJobs: [
    { id: 'SJ-44120', file: 'gear_housing_v3.stl', printer: 'Prusa MK4',    status: 'ok',    time: '4ชม 12น', filament: 62, started: '14:31' },
    { id: 'SJ-44119', file: 'bracket_left.step',   printer: 'Prusa MINI+',  status: 'ok',    time: '1ชม 48น', filament: 28, started: '11:10' },
    { id: 'SJ-44118', file: 'mandible_jig.stl',    printer: 'Prusa XL',     status: 'ok',    time: '8ชม 24น', filament: 142,started: '09:51' },
    { id: 'SJ-44117', file: 'cosplay_helmet.stl',  printer: 'Bambu X1C',    status: 'failed',time: '—',       filament: 0,  started: '12:58', err: 'non-manifold mesh' },
    { id: 'SJ-44116', file: 'PROD-A14_shell.3mf',  printer: 'Bambu X1C',    status: 'ok',    time: '3ชม 02น', filament: 84, started: '17:24' },
    { id: 'SJ-44115', file: 'arch_model_1-200.stl',printer: 'Formlabs F3+', status: 'queued',time: '—',       filament: 0,  started: '—' },
  ],
};

// API integrations
ADMIN.api = {
  keys: [
    { id: 'k_live_8421', label: 'Production · Web',  scope: 'orders.read, quotes.write, files.write', created: '12 ม.ค. 2025', last: '2 นาที', requests: 184200, status: 'active' },
    { id: 'k_live_7710', label: 'Production · Mobile',scope: 'orders.read, quotes.read', created: '08 มี.ค. 2025', last: '4 ชม.', requests: 24800, status: 'active' },
    { id: 'k_test_2204', label: 'Staging',            scope: '*',                       created: '01 เม.ย. 2026', last: '1 วัน',  requests: 1284,  status: 'active' },
    { id: 'k_live_1188', label: 'CSV importer',       scope: 'orders.write',            created: '22 ส.ค. 2024', last: '40 วัน', requests: 88,    status: 'revoked' },
  ],
  webhooks: [
    { id: 'wh_001', url: 'https://hooks.printmydesign.net/orders',     events: 'order.paid, order.shipped, order.delivered', secret: 'whsec_••••8821', status: 'ok',     last: '2 นาที',  fails: 0 },
    { id: 'wh_002', url: 'https://accounting.flow.app/in/pmd',         events: 'order.paid, refund.created',                  secret: 'whsec_••••4410', status: 'ok',     last: '14 นาที', fails: 0 },
    { id: 'wh_003', url: 'https://line.me/notify/pmd-ops',             events: 'order.paid, slicer.failed',                   secret: 'whsec_••••2218', status: 'failing',last: '4 ชม.',   fails: 12 },
    { id: 'wh_004', url: 'https://internal-tools.local/pmd-sync',      events: '*',                                            secret: 'whsec_••••0021', status: 'paused', last: '7 วัน',  fails: 0 },
  ],
  integrations: [
    { id: 'omise',  name: 'Omise',         kind: 'Payment',  status: 'connected', detail: 'pkey_••••2210' },
    { id: 'gbprime',name: 'GB PrimePay',  kind: 'Payment',  status: 'connected', detail: 'merchant 2014' },
    { id: 'qr',     name: 'PromptPay QR',  kind: 'Payment',  status: 'connected', detail: 'TaxID 0105561...' },
    { id: 'flow',   name: 'FlowAccount',   kind: 'Accounting',status:'connected', detail: 'auto invoice' },
    { id: 'line',   name: 'LINE OA',        kind: 'Messaging',status:'connected', detail: '@printmydesign' },
    { id: 'mailgun',name: 'Mailgun',        kind: 'Email',    status: 'connected', detail: 'mg.printmydesign.net' },
    { id: 'sendgrid',name: 'SendGrid',      kind: 'Email',    status: 'disabled',  detail: 'fallback' },
    { id: 'analytics',name: 'Analytics',    kind: 'Tracking', status: 'connected', detail: 'GA4 + Meta Pixel' },
  ],
};

// Storage / system
ADMIN.storage = {
  buckets: [
    { id: 'uploads',    name: 'Customer uploads',   driver: 'S3',   region: 'ap-southeast-1', size: 142.8, files: 18420, retention: '12 เดือน',  lifecycle: 'archive>180d', public: false },
    { id: 'gcode',      name: 'Generated G-code',   driver: 'S3',   region: 'ap-southeast-1', size: 84.2,  files: 9210,  retention: '6 เดือน',   lifecycle: 'delete>90d',  public: false },
    { id: 'thumbnails', name: 'Render thumbnails',  driver: 'CDN',  region: 'global',         size: 12.4,  files: 18420, retention: '12 เดือน',  lifecycle: 'keep',         public: true  },
    { id: 'invoices',   name: 'Invoices & receipts',driver: 'S3',   region: 'ap-southeast-1', size: 6.2,   files: 4180,  retention: '7 ปี',     lifecycle: 'cold>365d',    public: false },
    { id: 'backups',    name: 'DB backups (daily)', driver: 'S3-IA',region: 'ap-southeast-1', size: 220.4, files: 90,    retention: '90 วัน',    lifecycle: 'delete>90d',   public: false },
  ],
  jobs: [
    { id: 'JB-441', name: 'Daily backup',        cron: '0 3 * * *',    last: '03:00 ผ่าน',  next: 'พรุ่งนี้ 03:00', status: 'ok' },
    { id: 'JB-440', name: 'Lifecycle cleanup',   cron: '0 4 * * *',    last: '04:00 ผ่าน',  next: 'พรุ่งนี้ 04:00', status: 'ok' },
    { id: 'JB-439', name: 'Render thumbnails',   cron: 'on-upload',    last: '2 นาที',     next: 'on-upload',     status: 'ok' },
    { id: 'JB-438', name: 'Re-slice expired',    cron: '0 */6 * * *',  last: '12:00 ผ่าน',  next: 'วันนี้ 18:00',  status: 'ok' },
    { id: 'JB-437', name: 'Quote expiry sweep',  cron: '0 1 * * *',    last: '01:00 ผ่าน',  next: 'พรุ่งนี้ 01:00', status: 'ok' },
    { id: 'JB-436', name: 'Filament audit',      cron: '0 0 * * 1',    last: '5 วัน',      next: 'จันทร์ 00:00',  status: 'warn' },
  ],
  health: {
    cpu: 24, mem: 62, disk: 41, queue: 8, uptime: '42 วัน 7 ชม.',
    db: { ok: true, replicaLag: '0.4s' },
    redis: { ok: true, mem: '184 MB / 1 GB' },
    sliceQueue: { running: 4, queued: 12, failed24h: 2 },
  },
};

// Aggregate KPIs (used in dashboard)
ADMIN.kpi = {
  revenueDay:    128400,  revenueDayDelta:    +18.4,
  revenueWeek:   742800,  revenueWeekDelta:   +6.2,
  revenueMonth:  3184200, revenueMonthDelta:  +12.8,
  ordersDay:     34,      ordersDayDelta:     +6,
  pending:       18,
  printingNow:   12,
  qaQueue:       5,
  shipToday:     22,
  unpaid:        4,
  unpaidValue:   18820,
  avgTicket:     3780,    avgTicketDelta:     -1.4,
  conversion:    34.2,    conversionDelta:    +2.1,
  newCustomers:  8,
  refunds:       0,
  // Sparkline data — 14 days, ฿
  revenueSeries: [82, 94, 88, 110, 124, 118, 92, 142, 158, 132, 148, 162, 184, 128].map(n => n * 1000),
  // Hourly orders today
  ordersByHour: [0,0,0,0,0,0,0,1,2,4,6,5,3,4,5,3,2,1,0,0,0,0,0,0],
  // Top materials this month (kg)
  topMaterials: [
    { name: 'PLA Pro',  pct: 38, kg: 84.4 },
    { name: 'PETG',     pct: 18, kg: 42.2 },
    { name: 'PA12',     pct: 14, kg: 22.4 },
    { name: 'Tough Resin', pct: 12, kg: 18.4 },
    { name: 'ABS',      pct: 8,  kg: 12.0 },
    { name: 'Other',    pct: 10, kg: 14.4 },
  ],
  // Process mix
  procMix: [
    { name: 'FDM', pct: 64 },
    { name: 'SLA', pct: 18 },
    { name: 'SLS/MJF', pct: 16 },
    { name: 'Other', pct: 2 },
  ],
};

window.ADMIN = ADMIN;
