export type Language = "th" | "en";

export interface TranslationSchema {
  readonly nav: {
    readonly services: string;
    readonly materials: string;
    readonly freeModels: string;
    readonly support: string;
    readonly about: string;
    readonly orderNow: string;
    readonly login: string;
    readonly logout: string;
    readonly myAccount: string;
    readonly myOrders: string;
    readonly dashboard: string;
    readonly search: string;
    readonly cart: string;
    readonly admin: string;
    readonly loginRegister: string;
  };
  readonly services: {
    readonly fdm: string;
    readonly fdmDesc: string;
    readonly sla: string;
    readonly slaDesc: string;
    readonly multicolor: string;
    readonly multicolorDesc: string;
  };
  readonly materials: {
    readonly pla: string;
    readonly plaDesc: string;
    readonly abs: string;
    readonly absDesc: string;
    readonly petg: string;
    readonly petgDesc: string;
    readonly resin: string;
    readonly resinDesc: string;
  };
  readonly support: {
    readonly guide: string;
    readonly guideDesc: string;
    readonly faq: string;
    readonly faqDesc: string;
    readonly contact: string;
    readonly contactDesc: string;
  };
  readonly showcase: {
    readonly heading: string;
    readonly subheading: string;
    readonly cta: string;
  };
  readonly bento: {
    readonly badge: string;
    readonly heading1: string;
    readonly heading2: string;
    readonly card1Title: string;
    readonly card1Desc: string;
    readonly card1Cta: string;
    readonly card2Title: string;
    readonly card2Desc: string;
    readonly card2Cta: string;
    readonly card3Title: string;
    readonly card3Desc: string;
    readonly card4Title: string;
    readonly card4Desc: string;
    readonly card4Cta: string;
  };
  readonly tech: {
    readonly heading: string;
    readonly subheading: string;
    readonly fdmDesc: string;
    readonly fdmF1: string;
    readonly fdmF2: string;
    readonly fdmF3: string;
    readonly slaDesc: string;
    readonly slaF1: string;
    readonly slaF2: string;
    readonly slaF3: string;
  };
  readonly howItWorks: {
    readonly badge: string;
    readonly heading1: string;
    readonly heading2: string;
    readonly subheading: string;
    readonly step1Title: string;
    readonly step1Desc: string;
    readonly step2Title: string;
    readonly step2Desc: string;
    readonly step3Title: string;
    readonly step3Desc: string;
    readonly step4Title: string;
    readonly step4Desc: string;
  };
  readonly footer: {
    readonly tagline: string;
    readonly newsletterTitle: string;
    readonly newsletterDesc: string;
    readonly newsletterPlaceholder: string;
    readonly newsletterBtn: string;
    readonly servicesHeading: string;
    readonly s1: string;
    readonly s2: string;
    readonly s3: string;
    readonly s4: string;
    readonly s5: string;
    readonly materialsHeading: string;
    readonly m5: string;
    readonly resourcesHeading: string;
    readonly r1: string;
    readonly r2: string;
    readonly r3: string;
    readonly r4: string;
    readonly r5: string;
    readonly companyHeading: string;
    readonly c1: string;
    readonly c2: string;
    readonly c3: string;
    readonly c4: string;
    readonly c5: string;
    readonly copyright: string;
    readonly privacy: string;
    readonly terms: string;
    readonly cookies: string;
  };
  readonly quote: {
    readonly filesLabel: string;
    readonly addFile: string;
    readonly dropOrSelect: string;
    readonly fileFormats: string;
    readonly sslNote: string;
    readonly configTitle: string;
    readonly copyToAll: string;
    readonly processLabel: string;
    readonly materialLabel: string;
    readonly colorLabel: string;
    readonly finishLabel: string;
    readonly qtyDeliveryLabel: string;
    readonly qtyLabel: string;
    readonly deliveryLabel: string;
    readonly finishStandard: string;
    readonly finishStandardPrice: string;
    readonly finishSanded: string;
    readonly finishPrimed: string;
    readonly finishPainted: string;
    readonly deliveryEconomy: string;
    readonly deliveryStandard: string;
    readonly deliveryExpress: string;
    readonly deliveryDays710: string;
    readonly deliveryDays45: string;
    readonly deliveryDays2: string;
    readonly priceBreakdown: string;
    readonly perPiece: string;
    readonly sanded: string;
    readonly setupFee: string;
    readonly coupon: string;
    readonly removeBtn: string;
    readonly shippingAddr: string;
    readonly selectAddr: string;
    readonly manageAddr: string;
    readonly addAddr: string;
    readonly shippingChannel: string;
    readonly total: string;
    readonly inclVat: string;
    readonly placeOrder: string;
    readonly quotation: string;
    readonly saveCart: string;
    readonly termsCheck: string;
    readonly termsLink: string;
    readonly termsTitle: string;
    readonly termsSub: string;
    readonly termsS1Title: string;
    readonly termsS1Body: string;
    readonly termsS2Title: string;
    readonly termsS2Body: string;
    readonly termsS3Title: string;
    readonly termsS3Body: string;
    readonly termsS4Title: string;
    readonly termsS4Body: string;
    readonly cancelBtn: string;
    readonly acceptBtn: string;
    readonly priceDetail: string;
    readonly netPrice: string;
    readonly extraNote: string;
    readonly requestQuote: string;
    readonly sending: string;
    readonly orderNow: string;
    readonly saveToCart: string;
    readonly loginRequired: string;
    readonly shippingEstimate: string;
    readonly weightLabel: string;
    readonly discountCoupon: string;
    readonly uploadError: string;
  };
}

export const I18N: Record<Language, TranslationSchema> = {
  th: {
    nav: {
      services: "บริการ",
      materials: "วัสดุ",
      freeModels: "โมเดล 3D ฟรี",
      support: "ช่วยเหลือ",
      about: "เกี่ยวกับเรา",
      orderNow: "สั่งพิมพ์เลย",
      login: "เข้าสู่ระบบ",
      logout: "ออกจากระบบ",
      myAccount: "บัญชีของฉัน",
      myOrders: "ออเดอร์ของฉัน",
      dashboard: "แดชบอร์ดของฉัน",
      search: "ค้นหา",
      cart: "ตะกร้า",
      admin: "ผู้ดูแลระบบ",
      loginRegister: "เข้าสู่ระบบ / สมัครสมาชิก",
    },
    services: {
      fdm: "FDM Printing (เส้นพลาสติก)",
      fdmDesc: "ราคาประหยัด เหมาะกับต้นแบบ",
      sla: "SLA Resin (เรซิ่น)",
      slaDesc: "ความละเอียดสูง พื้นผิวเนียน",
      multicolor: "Multi-color",
      multicolorDesc: "พิมพ์หลายสีในชิ้นเดียว",
    },
    materials: {
      pla: "PLA",
      plaDesc: "เป็นมิตรกับสิ่งแวดล้อม",
      abs: "ABS",
      absDesc: "ทนความร้อน แข็งแรง",
      petg: "PETG",
      petgDesc: "ยืดหยุ่น ทนสารเคมี",
      resin: "Resin",
      resinDesc: "ละเอียดสูง",
    },
    support: {
      guide: "คู่มือการใช้งาน",
      guideDesc: "เริ่มต้นใช้งานระบบ",
      faq: "FAQ",
      faqDesc: "คำถามที่พบบ่อย",
      contact: "ติดต่อเรา",
      contactDesc: "พูดคุยกับทีมงาน",
    },
    showcase: {
      heading: "3D Printed Parts Made by PDM",
      subheading: "เราผลิตชิ้นงานต้นแบบและผลิตจำนวนน้อยอย่างรวดเร็ว คุ้มค่า สำหรับหลากหลายอุตสาหกรรม",
      cta: "รับราคาทันที",
    },
    bento: {
      badge: "ทำไมต้องเลือกเรา",
      heading1: "ทำไมบริษัทชั้นนำถึง",
      heading2: "เลือกใช้ 3DEV",
      card1Title: "พิมพ์ชิ้นงานด้วยวัสดุระดับอุตสาหกรรม",
      card1Desc: "รองรับวัสดุหลากหลาย ทั้งเรซิ่นคุณภาพสูง ไนลอนเหนียวทนทาน และโลหะ สำหรับชิ้นงานที่ต้องการความแกร่งเป็นพิเศษ",
      card1Cta: "สั่งพิมพ์เลย",
      card2Title: "อัปโหลดไฟล์ รับราคาทันที",
      card2Desc: "ระบบ AI วิเคราะห์ไฟล์สามมิติอัตโนมัติ คำนวณราคาให้คุณทันทีแบบไม่ต้องรอ",
      card2Cta: "เริ่มอัปโหลดไฟล์",
      card3Title: "สี & พื้นผิวหลากหลาย",
      card3Desc: "เลือกชิ้นงานได้ตั้งแต่ Full Color จนถึงผิวด้านระดับ Premium",
      card4Title: "คุณภาพระดับโรงงาน ผ่านการตรวจสอบทุกชิ้น",
      card4Desc: "ทีมวิศวกรตรวจสอบไฟล์และชิ้นงานอย่างละเอียดก่อนส่งมอบทุกครั้ง เพื่อให้มั่นใจว่าคุณได้รับชิ้นงานที่สมบูรณ์แบบที่สุด",
      card4Cta: "ขอดูตัวอย่างงาน",
    },
    tech: {
      heading: "เทคโนโลยีที่รองรับ",
      subheading: "เราใช้เครื่องพิมพ์ 3 มิติระดับอุตสาหกรรม เพื่อให้แน่ใจว่างานทุกชิ้นมีคุณภาพสูงสุด",
      fdmDesc: "เหมาะสำหรับชิ้นงานต้นแบบ (Prototyping) ชิ้นส่วนกลไก และงานขนาดใหญ่ที่ต้องการความประหยัด",
      fdmF1: "ราคาถูกที่สุด",
      fdmF2: "วัสดุหลากหลาย (PLA, ABS, PETG)",
      fdmF3: "ชิ้นงานแข็งแรงทนทาน",
      slaDesc: "เหมาะสำหรับงานที่ต้องการความละเอียดสูง พื้นผิวเรียบเนียน เช่น โมเดลฟิกเกอร์ หรืออัญมณี",
      slaF1: "ความละเอียดสูงมาก (Micron level)",
      slaF2: "พื้นผิวเนียนเรียบ",
      slaF3: "รองรับเรซิ่นวิศวกรรมเฉพาะทาง",
    },
    howItWorks: {
      badge: "ขั้นตอนการทำงาน",
      heading1: "ขั้นตอนการสั่งพิมพ์ที่ง่าย",
      heading2: "และเป็นมืออาชีพ",
      subheading: "เราเปลี่ยนกระบวนการผลิตงานอุตสาหกรรมที่ซับซ้อน ให้กลายเป็นเรื่องง่ายด้วยระบบแพลตฟอร์มอัตโนมัติของเรา",
      step1Title: "อัปโหลดไฟล์ 3D",
      step1Desc: "รองรับไฟล์ .STL, .OBJ, .STEP ระบบจะตรวจสอบและซ่อมแซมวิเคราะห์ความสมบูรณ์ให้แบบอัตโนมัติ",
      step2Title: "เลือกวัสดุและสี",
      step2Desc: "เลือกวัสดุที่เหมาะสม ทั้งเรซิ่น ไนลอน โลหะ และเปรียบเทียบราคาแบบเรียลไทม์",
      step3Title: "สั่งพิมพ์ระดับอุตสาหกรรม",
      step3Desc: "วิศวกรตรวจสอบไฟล์และเริ่มการพิมพ์ด้วยเครื่องจักร High-end มาตรฐานสากล",
      step4Title: "จัดส่งรวดเร็วถึงมือคุณ",
      step4Desc: "ผ่านกระบวนการ QC อย่างเข้มงวด บรรจุให้อย่างดี และจัดส่งตรงเวลา",
    },
    footer: {
      tagline: "ผู้นำแพลตฟอร์มการผลิตและพิมพ์ 3 มิติระดับสากล ให้บริการด้วยมาตรฐานอุตสาหกรรม (Industrial Grade) เพื่อเปลี่ยนทุกไอเดียของคุณให้กลายเป็นชิ้นงานจริงได้อย่างรวดเร็วและแม่นยำ",
      newsletterTitle: "ติดตามข่าวสารและสิทธิพิเศษ",
      newsletterDesc: "ลงทะเบียนเพื่อรับข่าวสารด้านเทคโนโลยีการผลิตจากเรา",
      newsletterPlaceholder: "กรอกอีเมลของคุณ",
      newsletterBtn: "ติดตาม",
      servicesHeading: "บริการ (Services)",
      s1: "พิมพ์ 3 มิติ (3D Printing)",
      s2: "งานกัด CNC (CNC Machining)",
      s3: "พับโลหะ (Sheet Metal)",
      s4: "ประกอบวงจร (PCB/PCBA)",
      s5: "เทคโนโลยีใหม่ๆ",
      materialsHeading: "วัสดุ (Materials)",
      m5: "คู่มือเปรียบเทียบวัสดุ",
      resourcesHeading: "แหล่งเรียนรู้",
      r1: "คู่มือการออกแบบ 3D",
      r2: "เกณฑ์การอัปโหลดไฟล์",
      r3: "บทความ (Blog)",
      r4: "กรณีศึกษา (Case Studies)",
      r5: "ศูนย์ช่วยเหลือ",
      companyHeading: "เกี่ยวกับองค์กร",
      c1: "เกี่ยวกับ 3DEV",
      c2: "โรงงานและเทคโนโลยี",
      c3: "ร่วมงานกับเรา (Careers)",
      c4: "ความยั่งยืน (Sustainability)",
      c5: "ติดต่อเรา",
      copyright: "สงวนลิขสิทธิ์",
      privacy: "นโยบายความเป็นส่วนตัว",
      terms: "ข้อกำหนดการให้บริการ",
      cookies: "นโยบายคุกกี้",
    },
    quote: {
      filesLabel: "ไฟล์",
      addFile: "เพิ่ม",
      dropOrSelect: "ลากวางหรือเลือกไฟล์ 3D",
      fileFormats: "STL · STEP · OBJ · 3MF",
      sslNote: "การอัปโหลดเข้ารหัสและเป็นความลับ SSL",
      configTitle: "ตั้งค่าการพิมพ์",
      copyToAll: "คัดลอกการตั้งค่าทั้งหมด",
      processLabel: "1. กระบวนการ (Process)",
      materialLabel: "2. วัสดุ (Material)",
      colorLabel: "3. สี (Color)",
      finishLabel: "4. ผิวงาน (Finish)",
      qtyDeliveryLabel: "5. จำนวน & เวลาจัดส่ง",
      qtyLabel: "จำนวน",
      deliveryLabel: "ความเร็วการจัดส่ง",
      finishStandard: "มาตรฐาน (Standard)",
      finishStandardPrice: "รวมในราคา",
      finishSanded: "ขัดเรียบ (Sanded)",
      finishPrimed: "พ่นรองพื้น (Primed)",
      finishPainted: "พ่นสี (Painted)",
      deliveryEconomy: "ประหยัด",
      deliveryStandard: "ปกติ",
      deliveryExpress: "ด่วน",
      deliveryDays710: "7-10 วัน",
      deliveryDays45: "4-5 วัน",
      deliveryDays2: "2 วัน",
      priceBreakdown: "รายละเอียดราคา",
      perPiece: "/ชิ้น",
      sanded: "ขัดเรียบ (Sanded)",
      setupFee: "ค่าเตรียมงาน",
      coupon: "คูปอง",
      removeBtn: "นำออก",
      shippingAddr: "ที่อยู่จัดส่ง",
      selectAddr: "เลือกที่อยู่จัดส่ง",
      manageAddr: "จัดการที่อยู่",
      addAddr: "เพิ่มที่อยู่จัดส่ง",
      shippingChannel: "ช่องทางการจัดส่ง",
      total: "รวมทั้งหมด",
      inclVat: "รวม VAT 7% แล้ว",
      placeOrder: "สั่งพิมพ์เลย",
      quotation: "ใบเสนอราคา",
      saveCart: "บันทึกตะกร้า",
      termsCheck: "ฉันยอมรับ",
      termsLink: "เงื่อนไขการใช้งาน",
      termsTitle: "เงื่อนไขการใช้งาน",
      termsSub: "Terms and Conditions",
      termsS1Title: "1. การรับประกันและขอบเขตความรับผิดชอบ",
      termsS1Body: "บริษัทขอสงวนสิทธิ์ในการไม่รับผิดชอบต่อความเสียหายที่เกิดจากความผิดพลาดของไฟล์ต้นฉบับของผู้ใช้งาน งานพิมพ์ 3 มิติอาจมีร่องรอยของชั้นเลเยอร์ (Layer lines) ซึ่งเป็นลักษณะปกติของกระบวนการผลิต",
      termsS2Title: "2. ระยะเวลาการผลิตและการจัดส่ง",
      termsS2Body: "ระยะเวลาที่ระบุเป็นการประมาณการเบื้องต้น บริษัทจะเริ่มนับระยะเวลาการผลิตหลังจากได้รับหลักฐานการชำระเงินที่ถูกต้องและไฟล์งานผ่านการตรวจสอบความพร้อมทางเทคนิคแล้วเท่านั้น",
      termsS3Title: "3. นโยบายการยกเลิกและคืนเงิน",
      termsS3Body: "เนื่องจากเป็นสินค้าสั่งทำพิเศษ (Custom Made) เมื่อเริ่มกระบวนการพิมพ์แล้ว จะไม่สามารถยกเลิกหรือขอคืนเงินได้ เว้นแต่จะเกิดจากความผิดพลาดของบริษัทโดยตรง",
      termsS4Title: "4. ความปลอดภัยของข้อมูล",
      termsS4Body: "บริษัทให้ความสำคัญกับความเป็นส่วนตัวและลิขสิทธิ์ไฟล์งานของท่าน ไฟล์ที่อัปโหลดจะถูกเก็บรักษาเป็นความลับและใช้เพื่อวัตถุประสงค์ในการผลิตเท่านั้น",
      cancelBtn: "ยกเลิก",
      acceptBtn: "ฉันยอมรับเงื่อนไข",
      priceDetail: "รายละเอียดราคา",
      netPrice: "ราคาสุทธิ",
      extraNote: "อาจมีค่าใช้จ่ายเพิ่มเติมสำหรับ",
      requestQuote: "ขอใบเสนอราคา",
      sending: "กำลังส่ง...",
      orderNow: "สั่งพิมพ์เลย",
      saveToCart: "บันทึกลงตะกร้า",
      loginRequired: "ต้องเข้าสู่ระบบก่อนขอใบเสนอราคา",
      shippingEstimate: "ประมาณการค่าส่ง",
      weightLabel: "น้ำหนัก",
      discountCoupon: "คูปองส่วนลด",
      uploadError: "การอัปโหลดไฟล์ล้มเหลว",
    },
  },
  en: {
    nav: {
      services: "Services",
      materials: "Materials",
      freeModels: "Free 3D Models",
      support: "Help & Support",
      about: "About Us",
      orderNow: "Order Now",
      login: "Log In",
      logout: "Log Out",
      myAccount: "My Account",
      myOrders: "My Orders",
      dashboard: "My Dashboard",
      search: "Search",
      cart: "Cart",
      admin: "Admin Console",
      loginRegister: "Sign In / Register",
    },
    services: {
      fdm: "FDM Printing (Filament)",
      fdmDesc: "Economical, ideal for prototyping",
      sla: "SLA Resin (Resin)",
      slaDesc: "High resolution, smooth surface",
      multicolor: "Multi-color Printing",
      multicolorDesc: "Print multiple colors in one piece",
    },
    materials: {
      pla: "PLA",
      plaDesc: "Eco-friendly filament",
      abs: "ABS",
      absDesc: "Heat resistant & strong",
      petg: "PETG",
      petgDesc: "Flexible & chemical resistant",
      resin: "Resin",
      resinDesc: "Ultra high detail",
    },
    support: {
      guide: "User Guide",
      guideDesc: "Get started with the platform",
      faq: "FAQ",
      faqDesc: "Frequently asked questions",
      contact: "Contact Us",
      contactDesc: "Chat with our support team",
    },
    showcase: {
      heading: "3D Printed Parts Made by PDM",
      subheading: "We manufacture rapid, cost-effective prototypes and low-volume production orders for a variety of industries and applications.",
      cta: "Get Instant Quote",
    },
    bento: {
      badge: "Why Choose Us",
      heading1: "Why Leading Companies",
      heading2: "Choose 3DEV",
      card1Title: "Print with Industrial-Grade Materials",
      card1Desc: "Supports a wide range of materials including high-quality resin, durable nylon, and metal for parts that demand exceptional strength.",
      card1Cta: "Order Now",
      card2Title: "Upload File, Get Instant Quote",
      card2Desc: "Our AI system automatically analyzes your 3D file and calculates the price immediately — no waiting required.",
      card2Cta: "Start Upload",
      card3Title: "Colors & Finishes Variety",
      card3Desc: "Choose from Full Color to premium matte finishes for your parts.",
      card4Title: "Factory-Grade Quality, Every Part Inspected",
      card4Desc: "Our engineering team carefully inspects every file and part before delivery to ensure you receive the most perfect result possible.",
      card4Cta: "View Sample Work",
    },
    tech: {
      heading: "Supported Technologies",
      subheading: "We use industrial-grade 3D printers to ensure every part meets the highest quality standards.",
      fdmDesc: "Ideal for prototyping, mechanical parts, and large-scale jobs that require cost efficiency.",
      fdmF1: "Most affordable option",
      fdmF2: "Wide material range (PLA, ABS, PETG)",
      fdmF3: "Strong and durable parts",
      slaDesc: "Perfect for high-detail work with smooth surfaces, such as figurines, jewelry, and precision models.",
      slaF1: "Ultra-high resolution (micron level)",
      slaF2: "Smooth and clean surface finish",
      slaF3: "Supports engineering-grade resins",
    },
    howItWorks: {
      badge: "Workflow",
      heading1: "Simple & Professional",
      heading2: "Ordering Process",
      subheading: "We transform complex industrial manufacturing into a seamless experience with our automated platform.",
      step1Title: "Upload 3D File",
      step1Desc: "Supports .STL, .OBJ, .STEP files. Our system auto-checks and repairs the file for completeness.",
      step2Title: "Choose Material & Color",
      step2Desc: "Select the right material — resin, nylon, metal — and compare pricing in real time.",
      step3Title: "Industrial-Grade Printing",
      step3Desc: "Engineers verify the file and begin printing with internationally certified, high-end machinery.",
      step4Title: "Fast Delivery to Your Door",
      step4Desc: "Passes strict QC inspection, carefully packaged, and delivered on time.",
    },
    footer: {
      tagline: "Leading global platform for 3D printing and manufacturing services. We deliver industrial-grade quality to turn your ideas into reality — fast and precise.",
      newsletterTitle: "Stay Updated & Get Exclusive Offers",
      newsletterDesc: "Subscribe to receive manufacturing tech news and promotions from us.",
      newsletterPlaceholder: "Enter your email",
      newsletterBtn: "Subscribe",
      servicesHeading: "Services",
      s1: "3D Printing",
      s2: "CNC Machining",
      s3: "Sheet Metal Fabrication",
      s4: "PCB/PCBA Assembly",
      s5: "New Technologies",
      materialsHeading: "Materials",
      m5: "Material Comparison Guide",
      resourcesHeading: "Resources",
      r1: "3D Design Guide",
      r2: "File Upload Criteria",
      r3: "Blog",
      r4: "Case Studies",
      r5: "Help Center",
      companyHeading: "Company",
      c1: "About 3DEV",
      c2: "Factory & Technology",
      c3: "Careers",
      c4: "Sustainability",
      c5: "Contact Us",
      copyright: "All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      cookies: "Cookie Policy",
    },
    quote: {
      filesLabel: "Files",
      addFile: "Add",
      dropOrSelect: "Drag & drop or select a 3D file",
      fileFormats: "STL · STEP · OBJ · 3MF",
      sslNote: "Uploads are SSL-encrypted & confidential",
      configTitle: "Print Configuration",
      copyToAll: "Copy to all",
      processLabel: "1. Process",
      materialLabel: "2. Material",
      colorLabel: "3. Color",
      finishLabel: "4. Finish",
      qtyDeliveryLabel: "5. Quantity & Delivery",
      qtyLabel: "Quantity",
      deliveryLabel: "Delivery Speed",
      finishStandard: "Standard",
      finishStandardPrice: "Included",
      finishSanded: "Sanded",
      finishPrimed: "Primed",
      finishPainted: "Painted",
      deliveryEconomy: "Economy",
      deliveryStandard: "Standard",
      deliveryExpress: "Express",
      deliveryDays710: "7-10 days",
      deliveryDays45: "4-5 days",
      deliveryDays2: "2 days",
      priceBreakdown: "Price Breakdown",
      perPiece: "/pc",
      sanded: "+ Sanded",
      setupFee: "Setup fee",
      coupon: "Coupon",
      removeBtn: "Remove",
      shippingAddr: "Shipping Address",
      selectAddr: "Select shipping address",
      manageAddr: "Manage Addresses",
      addAddr: "Add Shipping Address",
      shippingChannel: "Shipping Method",
      total: "Total",
      inclVat: "Incl. 7% VAT",
      placeOrder: "Place Order",
      quotation: "Quotation",
      saveCart: "Save to Cart",
      termsCheck: "I agree to the",
      termsLink: "Terms & Conditions",
      termsTitle: "Terms and Conditions",
      termsSub: "Terms and Conditions",
      termsS1Title: "1. Warranty & Liability",
      termsS1Body: "The company reserves the right not to be liable for damages caused by errors in the user's original files. 3D printed parts may show layer lines, which is a normal characteristic of the manufacturing process.",
      termsS2Title: "2. Production & Delivery Timeline",
      termsS2Body: "Stated timelines are preliminary estimates. Production countdown begins only after valid payment confirmation is received and the file passes technical readiness checks.",
      termsS3Title: "3. Cancellation & Refund Policy",
      termsS3Body: "As items are custom-made, once production begins, cancellation or refund requests are not possible under any circumstance, unless caused directly by company error.",
      termsS4Title: "4. Data Security",
      termsS4Body: "We take your file privacy and intellectual property seriously. Uploaded files are stored confidentially and used solely for production purposes.",
      cancelBtn: "Cancel",
      acceptBtn: "I Accept Terms",
      priceDetail: "Price Details",
      netPrice: "Net Price",
      extraNote: "Additional charges may apply for",
      requestQuote: "Request Quote",
      sending: "Sending...",
      orderNow: "Order Now",
      saveToCart: "Save to Cart",
      loginRequired: "Login required to request a quote",
      shippingEstimate: "Shipping Estimate",
      weightLabel: "Weight",
      discountCoupon: "Discount Coupon",
      uploadError: "File upload failed",
    },
  },
};

export const LANG_META = {
  th: { label: "TH", name: "ไทย", flag: "🇹🇭" },
  en: { label: "EN", name: "English", flag: "🇬🇧" },
} as const;
