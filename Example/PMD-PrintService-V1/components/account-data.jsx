// Mock data for customer account

const SAMPLE_ADDRESSES = [
  {
    id: 'a1', label: { th: 'ออฟฟิศสำนักงานใหญ่', en: 'Head Office', zh: '总部', ja: '本社' },
    line1: { th: '88/12 อาคารสยามพารากอน ชั้น 4', en: '88/12 Siam Paragon Tower, Floor 4', zh: '暹罗百丽宫4楼88/12', ja: 'サイアムパラゴン4階88/12' },
    subDistrict: { th: 'ปทุมวัน', en: 'Pathumwan', zh: '巴吞旺', ja: 'パトゥムワン' },
    district: { th: 'ปทุมวัน', en: 'Pathumwan', zh: '巴吞旺', ja: 'パトゥムワン' },
    province: { th: 'กรุงเทพมหานคร', en: 'Bangkok', zh: '曼谷', ja: 'バンコク' },
    postal: '10330', country: 'TH',
    receiver: { th: 'คุณสมชาย วิศวกร', en: 'Somchai Wisawakon', zh: 'Somchai', ja: 'Somchai' },
    receiverPhone: '+66 2 610 9999', isDefault: true,
  },
  {
    id: 'a2', label: { th: 'คลังสินค้า บางนา', en: 'Bangna Warehouse', zh: '邦那仓库', ja: 'バンナー倉庫' },
    line1: { th: '444 ถนนบางนา-ตราด กม.15', en: '444 Bangna-Trad Rd, km 15', zh: '邦那-达叻路15km 444号', ja: 'バンナー通り15km 444' },
    subDistrict: { th: 'บางแก้ว', en: 'Bangkaeo', zh: 'Bangkaeo', ja: 'Bangkaeo' },
    district: { th: 'บางพลี', en: 'Bangphli', zh: 'Bangphli', ja: 'Bangphli' },
    province: { th: 'สมุทรปราการ', en: 'Samut Prakan', zh: '北榄府', ja: 'サムットプラーカーン' },
    postal: '10540', country: 'TH',
    receiver: { th: 'ฝ่ายรับสินค้า', en: 'Receiving Dept.', zh: '收货部', ja: '受入部門' },
    receiverPhone: '+66 2 316 5500', isDefault: false,
  },
];

const SAMPLE_MODELS = [
  { id: 'm1', name: 'bracket_v3.stl', size: '2.4 MB', folder: 'Prototypes', tags: ['bracket'], thumb: 'cube', updated: '2026-04-12', ordered: 4 },
  { id: 'm2', name: 'enclosure_top.step', size: '8.1 MB', folder: 'Enclosures', tags: ['housing'], thumb: 'shell', updated: '2026-04-08', ordered: 2 },
  { id: 'm3', name: 'gear_16t.stl', size: '1.1 MB', folder: 'Mechanical', tags: ['gear'], thumb: 'gear', updated: '2026-04-01', ordered: 12 },
  { id: 'm4', name: 'display_mount.stl', size: '3.7 MB', folder: 'Prototypes', tags: ['mount'], thumb: 'plate', updated: '2026-03-28', ordered: 1 },
  { id: 'm5', name: 'cover_plate_final.step', size: '5.2 MB', folder: 'Enclosures', tags: ['cover'], thumb: 'plate', updated: '2026-03-20', ordered: 6 },
  { id: 'm6', name: 'demo_logo_3d.stl', size: '912 KB', folder: 'Marketing', tags: ['logo'], thumb: 'logo', updated: '2026-03-15', ordered: 0 },
  { id: 'm7', name: 'clip_retainer.stl', size: '624 KB', folder: 'Mechanical', tags: ['clip'], thumb: 'cube', updated: '2026-03-10', ordered: 8 },
  { id: 'm8', name: 'turbine_blade.step', size: '11.4 MB', folder: 'R&D', tags: ['blade'], thumb: 'blade', updated: '2026-03-02', ordered: 0 },
];

const SAMPLE_ORDERS = [
  { id: 'o1', number: 'PMD-2026-0412', date: '2026-04-12', items: 3,
    parts: [
      { name: 'bracket_v3.stl', qty: 20, material: 'PLA · Standard', thumb: 'cube' },
      { name: 'gear_16t.stl', qty: 12, material: 'Nylon · Standard', thumb: 'gear' },
      { name: 'cover_plate_final.step', qty: 6, material: 'ABS · Fine', thumb: 'plate' },
    ],
    total: 18420.50, stage: 2, tracking: null },
  { id: 'o2', number: 'PMD-2026-0388', date: '2026-04-02', items: 1,
    parts: [{ name: 'enclosure_top.step', qty: 2, material: 'PETG · Matte', thumb: 'shell' }],
    total: 4890.00, stage: 5, tracking: 'KE-8823-9912-TH' },
  { id: 'o3', number: 'PMD-2026-0341', date: '2026-03-22', items: 2,
    parts: [
      { name: 'display_mount.stl', qty: 1, material: 'PLA · Fine', thumb: 'plate' },
      { name: 'clip_retainer.stl', qty: 8, material: 'PLA · Standard', thumb: 'cube' },
    ],
    total: 2180.00, stage: 5, tracking: 'KE-8640-7711-TH' },
  { id: 'o4', number: 'PMD-2026-0295', date: '2026-03-05', items: 1,
    parts: [{ name: 'demo_logo_3d.stl', qty: 50, material: 'PLA · Standard', thumb: 'logo' }],
    total: 12750.00, stage: 5, tracking: 'KE-8501-3388-TH' },
];

const SAMPLE_QUOTES = [
  { id: 'q1', number: 'QTE-2026-0458', date: '2026-04-18', expires: '2026-05-02', items: 2, total: 8640.00,
    parts: [
      { name: 'bracket_v3.stl', qty: 10, material: 'PLA · Standard', thumb: 'cube' },
      { name: 'clip_retainer.stl', qty: 4, material: 'PETG · Standard', thumb: 'cube' },
    ]},
  { id: 'q2', number: 'QTE-2026-0451', date: '2026-04-15', expires: '2026-04-22', items: 1, total: 3280.00,
    parts: [{ name: 'turbine_blade.step', qty: 1, material: 'Resin · High-detail', thumb: 'blade' }]},
  { id: 'q3', number: 'QTE-2026-0440', date: '2026-04-05', expires: '2026-04-19', items: 3, total: 15600.00, expired: true,
    parts: [
      { name: 'enclosure_top.step', qty: 4, material: 'PETG · Matte', thumb: 'shell' },
      { name: 'gear_16t.stl', qty: 16, material: 'Nylon · Standard', thumb: 'gear' },
      { name: 'cover_plate_final.step', qty: 8, material: 'ABS · Fine', thumb: 'plate' },
    ]},
];

const SAMPLE_PAYMENTS = [
  { id: 'p1', type: 'card', brand: 'Visa', last4: '4242', exp: '08/28', isDefault: true, lastUsed: '2026-04-12' },
  { id: 'p2', type: 'card', brand: 'Mastercard', last4: '8811', exp: '11/27', isDefault: false, lastUsed: '2026-03-22' },
  { id: 'p3', type: 'promptpay', id_text: '02-610-9999', isDefault: false, lastUsed: '2026-02-18' },
  { id: 'p4', type: 'bank', bank: 'กสิกรไทย', account: 'xxx-x-x4488-x', isDefault: false, lastUsed: null },
];

const SAMPLE_TEAM = [
  { id: 't1', name: 'สมชาย วิศวกร', email: 'somchai@siaminnovation.co.th', role: 'owner', status: 'active', lastActive: '2 ชม.ที่แล้ว', avatar: 'SW' },
  { id: 't2', name: 'Arisa Phong', email: 'arisa@siaminnovation.co.th', role: 'admin', status: 'active', lastActive: '1 วันที่แล้ว', avatar: 'AP' },
  { id: 't3', name: 'Krit Thana', email: 'krit@siaminnovation.co.th', role: 'member', status: 'active', lastActive: '3 วันที่แล้ว', avatar: 'KT' },
  { id: 't4', name: 'Malai Suk', email: 'malai@siaminnovation.co.th', role: 'member', status: 'pending', lastActive: null, avatar: 'MS' },
  { id: 't5', name: 'Finance Dept.', email: 'finance@siaminnovation.co.th', role: 'viewer', status: 'active', lastActive: '1 สัปดาห์ที่แล้ว', avatar: 'FI' },
];

const SAMPLE_NOTIFICATIONS = {
  orderStatus: { email: true, sms: true, inapp: true },
  quotes: { email: true, sms: false, inapp: true },
  promo: { email: false, sms: false, inapp: true },
  newsletter: { email: true, sms: false, inapp: false },
};

const SAMPLE_CUSTOMER = {
  type: 'business',
  firstName: 'สมชาย', lastName: 'วิศวกร',
  email: 'somchai@siaminnovation.co.th', phone: '+66 81 234 5678',
  companyName: 'บริษัท สยาม อินโนเวชั่น จำกัด',
  companyNameEn: 'Siam Innovation Co., Ltd.',
  taxId: '0-1055-61234-56-7', branch: '00001', vatRegistered: true,
  contactPerson: 'สมชาย วิศวกร', companyPhone: '+66 2 610 9999',
  companyEmail: 'info@siaminnovation.co.th', website: 'siaminnovation.co.th',
  industry: 'Electronics', size: '51-200',
};

Object.assign(window, {
  SAMPLE_ADDRESSES, SAMPLE_MODELS, SAMPLE_ORDERS, SAMPLE_QUOTES,
  SAMPLE_PAYMENTS, SAMPLE_TEAM, SAMPLE_NOTIFICATIONS, SAMPLE_CUSTOMER,
});
