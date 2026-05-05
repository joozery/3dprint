// Icons — inline SVG, single-stroke geometric, monochrome
// All 16px by default, use `size` prop to change. Inherit color via currentColor.

const Icon = ({ children, size = 16, style, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, ...style }} {...rest}>
    {children}
  </svg>
);

const IconUpload = (p) => <Icon {...p}><path d="M8 10V2M8 2L5 5M8 2L11 5"/><path d="M2 10v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3"/></Icon>;
const IconFile = (p) => <Icon {...p}><path d="M3 2h6l4 4v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/><path d="M9 2v4h4"/></Icon>;
const IconCube = (p) => <Icon {...p}><path d="M8 1.5 2 4.5v7L8 14.5l6-3v-7L8 1.5z"/><path d="M2 4.5 8 7.5l6-3M8 7.5V14.5"/></Icon>;
const IconRotate = (p) => <Icon {...p}><path d="M2 8a6 6 0 0 1 10.5-4"/><path d="M13 2v3h-3"/><path d="M14 8a6 6 0 0 1-10.5 4"/><path d="M3 14v-3h3"/></Icon>;
const IconZoomIn = (p) => <Icon {...p}><circle cx="7" cy="7" r="4.5"/><path d="m13.5 13.5-3.2-3.2M7 5v4M5 7h4"/></Icon>;
const IconZoomOut = (p) => <Icon {...p}><circle cx="7" cy="7" r="4.5"/><path d="m13.5 13.5-3.2-3.2M5 7h4"/></Icon>;
const IconMove = (p) => <Icon {...p}><path d="M8 2v12M2 8h12M8 2l-2 2M8 2l2 2M8 14l-2-2M8 14l2-2M2 8l2-2M2 8l2 2M14 8l-2-2M14 8l-2 2"/></Icon>;
const IconRuler = (p) => <Icon {...p}><path d="m2 10 8-8 4 4-8 8-4-4z"/><path d="m4 8 1 1M6 6l1 1M8 4l1 1M10 6l1 1M8 8l1 1"/></Icon>;
const IconLayers = (p) => <Icon {...p}><path d="M8 1.5 1.5 5 8 8.5 14.5 5 8 1.5z"/><path d="m1.5 8 6.5 3.5L14.5 8M1.5 11l6.5 3.5L14.5 11"/></Icon>;
const IconCheck = (p) => <Icon {...p}><path d="m3 8 3.5 3.5L13 5"/></Icon>;
const IconX = (p) => <Icon {...p}><path d="m3 3 10 10M13 3 3 13"/></Icon>;
const IconWarn = (p) => <Icon {...p}><path d="M8 1.5 15 14H1L8 1.5z"/><path d="M8 6v3M8 11.5v.5"/></Icon>;
const IconInfo = (p) => <Icon {...p}><circle cx="8" cy="8" r="6.5"/><path d="M8 7v4M8 5v.5"/></Icon>;
const IconPlus = (p) => <Icon {...p}><path d="M8 3v10M3 8h10"/></Icon>;
const IconMinus = (p) => <Icon {...p}><path d="M3 8h10"/></Icon>;
const IconTrash = (p) => <Icon {...p}><path d="M2.5 4h11M6 4V2.5h4V4M4 4l.5 9a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1L12 4"/></Icon>;
const IconChevron = (p) => <Icon {...p}><path d="m5 6 3 3 3-3"/></Icon>;
const IconChevronRight = (p) => <Icon {...p}><path d="m6 4 3 4-3 4"/></Icon>;
const IconCart = (p) => <Icon {...p}><path d="M1.5 2h2l1.5 9a1 1 0 0 0 1 .8h6.4a1 1 0 0 0 1-.7L15 5H4"/><circle cx="6" cy="14" r="0.8"/><circle cx="12" cy="14" r="0.8"/></Icon>;
const IconDownload = (p) => <Icon {...p}><path d="M8 2v8M8 10 5 7M8 10l3-3"/><path d="M2 11v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2"/></Icon>;
const IconHistory = (p) => <Icon {...p}><path d="M2 8a6 6 0 1 0 2-4.5"/><path d="M2 2v3h3M8 4v4l2.5 2"/></Icon>;
const IconShield = (p) => <Icon {...p}><path d="M8 1.5 2.5 3.5v5c0 3 2.5 5 5.5 6 3-1 5.5-3 5.5-6v-5L8 1.5z"/></Icon>;
const IconTruck = (p) => <Icon {...p}><path d="M1.5 4h8v7h-8zM9.5 6h3l2 2.5V11H9.5z"/><circle cx="4" cy="12.5" r="1.2"/><circle cx="12" cy="12.5" r="1.2"/></Icon>;
const IconTag = (p) => <Icon {...p}><path d="m8 1.5-6.5.5v6L8 14.5l6.5-6.5v-6L8 1.5z"/><circle cx="10" cy="6" r="0.8"/></Icon>;
const IconCopy = (p) => <Icon {...p}><rect x="5" y="5" width="9" height="9" rx="1"/><path d="M11 5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2"/></Icon>;
const IconSparkle = (p) => <Icon {...p}><path d="M8 2v3M8 11v3M2 8h3M11 8h3M4 4l2 2M10 10l2 2M12 4l-2 2M4 12l2-2"/></Icon>;
const IconGrid = (p) => <Icon {...p}><rect x="2" y="2" width="5" height="5"/><rect x="9" y="2" width="5" height="5"/><rect x="2" y="9" width="5" height="5"/><rect x="9" y="9" width="5" height="5"/></Icon>;
const IconMenu = (p) => <Icon {...p}><path d="M2 4h12M2 8h12M2 12h12"/></Icon>;
const IconUser = (p) => <Icon {...p}><circle cx="8" cy="5" r="2.5"/><path d="M3 14a5 5 0 0 1 10 0"/></Icon>;
const IconGear = (p) => <Icon {...p}><circle cx="8" cy="8" r="2"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M12.5 3.5l-1.4 1.4M4.9 11.1l-1.4 1.4"/></Icon>;
const IconPin = (p) => <Icon {...p}><path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8 4.5 8s4.5-4.5 4.5-8c0-2.5-2-4.5-4.5-4.5z"/><circle cx="8" cy="6" r="1.5"/></Icon>;
const IconBuilding = (p) => <Icon {...p}><rect x="3" y="2" width="10" height="12"/><path d="M6 5h1M6 8h1M6 11h1M9 5h1M9 8h1M9 11h1"/></Icon>;
const IconCard = (p) => <Icon {...p}><rect x="1.5" y="4" width="13" height="9" rx="1"/><path d="M1.5 7h13M3 10.5h3"/></Icon>;
const IconBell = (p) => <Icon {...p}><path d="M8 2a4 4 0 0 0-4 4v3l-1 2h10l-1-2V6a4 4 0 0 0-4-4z"/><path d="M6.5 13a1.5 1.5 0 0 0 3 0"/></Icon>;
const IconTeam = (p) => <Icon {...p}><circle cx="5.5" cy="5" r="2"/><circle cx="11" cy="6" r="1.5"/><path d="M2 13a3.5 3.5 0 0 1 7 0M10 13a2.5 2.5 0 0 1 4-1.5"/></Icon>;
const IconDocument = (p) => <Icon {...p}><path d="M3 2h7l3 3v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/><path d="M9 2v4h4M5 8h6M5 10h6M5 12h4"/></Icon>;
const IconEdit = (p) => <Icon {...p}><path d="M2 11l6-6 3 3-6 6H2v-3z"/><path d="m9 4 2-2 3 3-2 2"/></Icon>;
const IconSearch = (p) => <Icon {...p}><circle cx="7" cy="7" r="4.5"/><path d="m13.5 13.5-3.2-3.2"/></Icon>;
const IconFolder = (p) => <Icon {...p}><path d="M2 4h4l1.5 1.5H14v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4z"/></Icon>;
const IconMail = (p) => <Icon {...p}><rect x="1.5" y="3" width="13" height="10" rx="1"/><path d="m1.5 4 6.5 5 6.5-5"/></Icon>;
const IconPhone = (p) => <Icon {...p}><path d="M3 2h3l1 3-1.5 1.5a8 8 0 0 0 4 4L11 9l3 1v3a1 1 0 0 1-1 1C7 14 2 9 2 3a1 1 0 0 1 1-1z"/></Icon>;
const IconStar = (p) => <Icon {...p}><path d="M8 1.5 10 6l5 .4-3.8 3.3L12.4 15 8 12l-4.4 3 1.2-5.3L1 6.4 6 6 8 1.5z"/></Icon>;

Object.assign(window, {
  IconUpload, IconFile, IconCube, IconRotate, IconZoomIn, IconZoomOut, IconMove,
  IconRuler, IconLayers, IconCheck, IconX, IconWarn, IconInfo, IconPlus, IconMinus,
  IconTrash, IconChevron, IconChevronRight, IconCart, IconDownload, IconHistory,
  IconShield, IconTruck, IconTag, IconCopy, IconSparkle, IconGrid, IconMenu,
  IconUser, IconGear, IconPin, IconBuilding, IconCard, IconBell, IconTeam,
  IconDocument, IconEdit, IconSearch, IconFolder, IconMail, IconPhone, IconStar,
});
