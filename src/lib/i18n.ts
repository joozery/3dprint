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
    readonly scanning: string;
    readonly scanningDesc: string;
    readonly sheetMetal: string;
    readonly sheetMetalDesc: string;
    readonly pcb: string;
    readonly pcbDesc: string;
    readonly postProcess: string;
    readonly postProcessDesc: string;
    readonly featuredTitle: string;
    readonly featuredDesc: string;
    readonly featuredCta: string;
    readonly printingTechLabel: string;
    readonly additionalLabel: string;
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
    readonly tpu: string;
    readonly tpuDesc: string;
    readonly nylon: string;
    readonly nylonDesc: string;
    readonly engResin: string;
    readonly engResinDesc: string;
    readonly filamentLabel: string;
    readonly resinLabel: string;
    readonly guideTitle: string;
    readonly guideCta: string;
  };
  readonly models: {
    readonly gallery: string;
    readonly galleryDesc: string;
    readonly functional: string;
    readonly functionalDesc: string;
    readonly decorative: string;
    readonly decorativeDesc: string;
    readonly upload: string;
    readonly uploadDesc: string;
  };
  readonly support: {
    readonly guide: string;
    readonly guideDesc: string;
    readonly faq: string;
    readonly faqDesc: string;
    readonly contact: string;
    readonly contactDesc: string;
    readonly blog: string;
    readonly blogDesc: string;
    readonly chat: string;
    readonly chatDesc: string;
    readonly ticket: string;
    readonly ticketDesc: string;
    readonly resourcesLabel: string;
    readonly contactLabel: string;
  };
  readonly about: {
    readonly company: string;
    readonly companyDesc: string;
    readonly factory: string;
    readonly factoryDesc: string;
    readonly team: string;
    readonly teamDesc: string;
    readonly careers: string;
    readonly careersDesc: string;
    readonly sustainability: string;
    readonly sustainabilityDesc: string;
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
  readonly login: {
    readonly sidebarTitle: string;
    readonly sidebarDesc: string;
    readonly loginTitle: string;
    readonly loginSub: string;
    readonly registerTitle: string;
    readonly registerSub: string;
    readonly nameLabel: string;
    readonly namePlaceholder: string;
    readonly emailLabel: string;
    readonly passwordLabel: string;
    readonly confirmPasswordLabel: string;
    readonly forgotPassword: string;
    readonly submitLogin: string;
    readonly submitRegister: string;
    readonly loading: string;
    readonly orContinueWith: string;
    readonly noAccount: string;
    readonly registerNow: string;
    readonly hasAccount: string;
    readonly loginHere: string;
    readonly termsNote: string;
    readonly termsLink: string;
    readonly privacyLink: string;
    readonly otpTitle: string;
    readonly otpDesc: string;
    readonly otpVerify: string;
    readonly otpNext: string;
    readonly otpResendTimer: string;
    readonly otpResend: string;
    readonly backBtn: string;
    readonly backToLogin: string;
    readonly forgotTitle: string;
    readonly forgotDesc: string;
    readonly sendOtp: string;
    readonly sending: string;
    readonly resetTitle: string;
    readonly resetDesc: string;
    readonly newPasswordLabel: string;
    readonly confirmNewPasswordLabel: string;
    readonly resetBtn: string;
    readonly saving: string;
  };
  readonly profile: {
    readonly newProject: string;
    readonly mainMenu: string;
    readonly overview: string;
    readonly orderHistory: string;
    readonly docsAndSettings: string;
    readonly myQuotes: string;
    readonly profileInfo: string;
    readonly shippingAddress: string;
    readonly consultEngineer: string;
    readonly consultEngineerDesc: string;
    readonly helpCenter: string;
    readonly startLineChat: string;
    readonly searchPlaceholder: string;
    readonly greeting: string;
    readonly accountOverview: string;
    readonly systemReady: string;
    readonly allBadge: string;
    readonly totalQuotes: string;
    readonly pendingBadge: string;
    readonly awaitingQuote: string;
    readonly ordersBadge: string;
    readonly totalOrders: string;
    readonly totalSpending: string;
    readonly accumulated: string;
    readonly statusDraft: string;
    readonly statusPending: string;
    readonly statusOrdered: string;
    readonly statusCancelled: string;
    readonly statusPendingPayment: string;
    readonly statusProcessing: string;
    readonly statusPrinting: string;
    readonly statusShipped: string;
    readonly statusDelivered: string;
    readonly recentQuotes: string;
    readonly recentQuotesDesc: string;
    readonly viewAll: string;
    readonly noOrders: string;
    readonly noOrdersDesc: string;
    readonly getQuote: string;
    readonly fileList: string;
    readonly requestDate: string;
    readonly estPrice: string;
    readonly status: string;
    readonly more: string;
    readonly awaitingEstimate: string;
    readonly statusLabel: string;
    readonly ordersNav: string;
    readonly lineChat: string;
    readonly moreMenu: string;
    readonly accountAndHelp: string;
    readonly invoiceHistory: string;
    readonly accountSettings: string;
    readonly logout: string;
    readonly noHistory: string;
    readonly noHistoryDesc: string;
    readonly orderCol: string;
    readonly dateCol: string;
    readonly itemsCol: string;
    readonly totalCol: string;
    readonly noTracking: string;
    readonly trackLink: string;
    readonly shippedBy: string;
    readonly trackPackage: string;
    readonly itemsLabel: string;
    readonly saveSuccess: string;
    readonly saveFailed: string;
    readonly profileTitle: string;
    readonly profileSubtitle: string;
    readonly save: string;
    readonly accountType: string;
    readonly individual: string;
    readonly individualDesc: string;
    readonly companyType: string;
    readonly companyDesc: string;
    readonly primaryContact: string;
    readonly primaryContactDesc: string;
    readonly fullName: string;
    readonly emailLabel: string;
    readonly phoneLabel: string;
    readonly passwordLabel: string;
    readonly changePassword: string;
    readonly companySection: string;
    readonly companyBillingDesc: string;
    readonly companyNameTH: string;
    readonly companyNameEN: string;
    readonly taxId: string;
    readonly branchCode: string;
    readonly vatRegistered: string;
    readonly industryLabel: string;
    readonly contactPerson: string;
    readonly officePhone: string;
    readonly companyEmail: string;
    readonly websiteLabel: string;
    readonly companySizeLabel: string;
    readonly addressTitle: string;
    readonly shippingAddressesDesc: string;
    readonly addAddress: string;
    readonly defaultBadge: string;
    readonly editBtn: string;
    readonly setAsDefault: string;
    readonly noAddresses: string;
    readonly noAddressesDesc: string;
    readonly addAddressTitle: string;
    readonly editAddressTitle: string;
    readonly addressFormSubtitle: string;
    readonly placeLabel: string;
    readonly recipientName: string;
    readonly phoneNumber: string;
    readonly internationalAddress: string;
    readonly addressDetail: string;
    readonly cancel: string;
    readonly savingAddress: string;
    readonly saveAddress: string;
    readonly quotesPageTitle: string;
    readonly quotesPageDesc: string;
    readonly createNewQuote: string;
    readonly searchQuotes: string;
    readonly filter: string;
    readonly noQuoteHistory: string;
    readonly noQuoteHistoryDesc: string;
    readonly firstQuote: string;
    readonly itemSpec: string;
    readonly createdDate: string;
    readonly deliveredTo: string;
    readonly netTotal: string;
    readonly statusManage: string;
    readonly pageOf: string;
    readonly ofTotal: string;
    readonly awaitingQuoteLabel: string;
    readonly moreItems: string;
    readonly allRightsReserved: string;
    readonly privacyPolicy: string;
    readonly termsOfService: string;
    readonly cookiePolicy: string;
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
      fdm: "FDM Printing",
      fdmDesc: "ราคาประหยัด เหมาะกับต้นแบบและชิ้นงานขนาดใหญ่",
      sla: "SLA Resin",
      slaDesc: "ความละเอียดสูง พื้นผิวเนียนเรียบ",
      multicolor: "Multi-color Printing",
      multicolorDesc: "พิมพ์หลายสีในชิ้นเดียวด้วยเทคโนโลยี AMS",
      scanning: "3D Scanning",
      scanningDesc: "แปลงชิ้นงานจริงเป็นโมเดล 3D ดิจิทัล",
      sheetMetal: "Sheet Metal",
      sheetMetalDesc: "ตัดพับโลหะแผ่นตามแบบ",
      pcb: "PCB / PCBA",
      pcbDesc: "ออกแบบและประกอบแผงวงจรอิเล็กทรอนิกส์",
      postProcess: "Post-Processing",
      postProcessDesc: "ขัดเรียบ พ่นสี ชุบผิวระดับ Premium",
      featuredTitle: "รับราคาทันทีใน 30 วินาที",
      featuredDesc: "อัปโหลดไฟล์ 3D แล้วระบบ AI คำนวณราคาให้คุณทันที",
      featuredCta: "สั่งพิมพ์เลย",
      printingTechLabel: "เทคโนโลยีการพิมพ์",
      additionalLabel: "บริการเพิ่มเติม",
    },
    materials: {
      pla: "PLA",
      plaDesc: "เป็นมิตรกับสิ่งแวดล้อม ราคาประหยัด",
      abs: "ABS",
      absDesc: "ทนความร้อนสูง แข็งแรง",
      petg: "PETG",
      petgDesc: "ยืดหยุ่น ทนสารเคมี กึ่งโปร่งใส",
      resin: "Standard Resin",
      resinDesc: "ละเอียดสูง พื้นผิวเนียน",
      tpu: "TPU",
      tpuDesc: "ยืดหยุ่น ทนแรงกระแทก เหมือนยาง",
      nylon: "Nylon SLS",
      nylonDesc: "แข็งแรงสูง เบา ทนทาน",
      engResin: "Engineering Resin",
      engResinDesc: "ทนความร้อนสูง แรงกดอัด",
      filamentLabel: "Filament (FDM)",
      resinLabel: "Resin & Engineering",
      guideTitle: "ไม่รู้จะเลือกวัสดุไหน?",
      guideCta: "ดูคู่มือเปรียบเทียบวัสดุ",
    },
    models: {
      gallery: "แกลเลอรีโมเดลทั้งหมด",
      galleryDesc: "โมเดลสำเร็จรูปพร้อมพิมพ์กว่า 1,000+ แบบ",
      functional: "ชิ้นส่วนใช้งาน",
      functionalDesc: "เฟือง คลิป ตัวยึด อุปกรณ์ทั่วไป",
      decorative: "งานตกแต่ง",
      decorativeDesc: "ของแต่งบ้าน ของสะสม งานศิลปะ",
      upload: "อัปโหลดโมเดลของคุณ",
      uploadDesc: "แบ่งปันงานออกแบบกับชุมชน",
    },
    support: {
      guide: "คู่มือการใช้งาน",
      guideDesc: "เริ่มต้นใช้งานระบบแบบ Step-by-Step",
      faq: "คำถามที่พบบ่อย",
      faqDesc: "คำตอบสำหรับปัญหาที่พบบ่อย",
      contact: "ติดต่อเรา",
      contactDesc: "อีเมล โทรศัพท์ หรือฟอร์มออนไลน์",
      blog: "บทความและเทคนิค",
      blogDesc: "เทคนิค 3D Printing และเทรนด์ล่าสุด",
      chat: "Live Chat",
      chatDesc: "คุยกับทีมงานแบบ Real-time",
      ticket: "ส่งคำร้อง",
      ticketDesc: "ฝากปัญหาไว้กับทีมงาน",
      resourcesLabel: "แหล่งเรียนรู้",
      contactLabel: "ติดต่อทีมงาน",
    },
    about: {
      company: "เกี่ยวกับ PrintMyDesign",
      companyDesc: "พันธกิจ วิสัยทัศน์ และเรื่องราวของเรา",
      factory: "โรงงาน & เทคโนโลยี",
      factoryDesc: "เครื่องจักรระดับอุตสาหกรรมและกระบวนการผลิต",
      team: "ทีมงาน",
      teamDesc: "วิศวกรและผู้เชี่ยวชาญด้านการผลิต",
      careers: "ร่วมงานกับเรา",
      careersDesc: "ตำแหน่งงานที่เปิดรับสมัคร",
      sustainability: "ความยั่งยืน",
      sustainabilityDesc: "การผลิตที่รับผิดชอบต่อสิ่งแวดล้อม",
      contact: "ติดต่อเรา",
      contactDesc: "พูดคุยกับทีม PDM โดยตรง",
    },
    showcase: {
      heading: "บริการพิมพ์ 3 มิติ โดย PrintMyDesign",
      subheading: "เราผลิตชิ้นงานต้นแบบและผลิตจำนวนน้อยอย่างรวดเร็ว คุ้มค่า สำหรับหลากหลายอุตสาหกรรม",
      cta: "รับราคาทันที",
    },
    bento: {
      badge: "ทำไมต้องเลือกเรา",
      heading1: "ทำไมบริษัทชั้นนำถึง",
      heading2: "เลือกใช้ PrintMyDesign",
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
      s2: "สแกน 3 มิติ (3D Scanning)",
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
      c1: "เกี่ยวกับ PrintMyDesign",
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
    login: {
      sidebarTitle: "เข้าสู่โลก PDM",
      sidebarDesc: "ยกระดับงานพิมพ์ 3 มิติของคุณ ด้วยโซลูชันอัจฉริยะแบบครบวงจร",
      loginTitle: "เข้าสู่ระบบ",
      loginSub: "ดีใจที่พบคุณอีกครั้ง!",
      registerTitle: "สมัครสมาชิก",
      registerSub: "เริ่มต้นใช้งาน PDM ฟรีได้ตั้งแต่วันนี้",
      nameLabel: "ชื่อ-นามสกุล",
      namePlaceholder: "ระบุชื่อจริงของคุณ",
      emailLabel: "อีเมลแอดเดรส",
      passwordLabel: "รหัสผ่าน",
      confirmPasswordLabel: "ยืนยันรหัสผ่าน",
      forgotPassword: "ลืมรหัสผ่าน?",
      submitLogin: "เข้าสู่ระบบ",
      submitRegister: "สมัครใช้งาน",
      loading: "กำลังโหลด...",
      orContinueWith: "เข้าด้วยช่องทางอื่น",
      noAccount: "ยังไม่มีบัญชี?",
      registerNow: "สมัครเดี๋ยวนี้",
      hasAccount: "มีบัญชีอยู่แล้ว?",
      loginHere: "เข้าสู่ระบบที่นี่",
      termsNote: "เมื่อดำเนินการต่อ ถือว่าคุณยอมรับ",
      termsLink: "ข้อกำหนด",
      privacyLink: "นโยบายความเป็นส่วนตัว",
      otpTitle: "ยืนยันรหัส OTP",
      otpDesc: "เราได้ส่งรหัส 6 หลักไปที่",
      otpVerify: "ยืนยันตัวตน",
      otpNext: "ถัดไป",
      otpResendTimer: "ขอรหัสใหม่ในอีก",
      otpResend: "ส่งรหัสอีกครั้ง",
      backBtn: "ย้อนกลับ",
      backToLogin: "กลับสู่หน้าเข้าสู่ระบบ",
      forgotTitle: "ลืมรหัสผ่าน?",
      forgotDesc: "ไม่เป็นไร! กรอกอีเมลของคุณด้านล่าง แล้วเราจะส่งรหัส OTP สำหรับตั้งรหัสผ่านใหม่ไปให้",
      sendOtp: "ส่งรหัส OTP",
      sending: "กำลังส่ง...",
      resetTitle: "ตั้งรหัสผ่านใหม่",
      resetDesc: "กรุณาตั้งรหัสผ่านใหม่ที่คุณจำได้ง่ายและปลอดภัย",
      newPasswordLabel: "รหัสผ่านใหม่",
      confirmNewPasswordLabel: "ยืนยันรหัสผ่านใหม่",
      resetBtn: "รีเซ็ตรหัสผ่าน",
      saving: "กำลังบันทึก...",
    },
    profile: {
      newProject: "สร้างโปรเจกต์ใหม่",
      mainMenu: "เมนูหลัก",
      overview: "ภาพรวมการใช้งาน",
      orderHistory: "ประวัติการสั่งซื้อ",
      docsAndSettings: "เอกสารและตั้งค่า",
      myQuotes: "ใบเสนอราคาของฉัน",
      profileInfo: "ข้อมูลโปรไฟล์",
      shippingAddress: "ที่อยู่จัดส่ง",
      consultEngineer: "ปรึกษาวิศวกร 3D",
      consultEngineerDesc: "ต้องการคำแนะนำเรื่องวัสดุ หรือตรวจสอบไฟล์ก่อนพิมพ์? เราพร้อมช่วยคุณ",
      helpCenter: "ศูนย์ช่วยเหลือ 24/7",
      startLineChat: "เริ่มแชทบน LINE (@3dev)",
      searchPlaceholder: "ค้นหาโปรเจกต์ หรือส่วนต่างๆ...",
      greeting: "สวัสดี",
      accountOverview: "ภาพรวมบัญชีและการสั่งพิมพ์ 3 มิติของคุณ",
      systemReady: "ระบบประเมินราคาพร้อมใช้งาน",
      allBadge: "ทั้งหมด",
      totalQuotes: "ใบเสนอราคาทั้งหมด",
      pendingBadge: "รอดำเนินการ",
      awaitingQuote: "รายการรอประเมินราคา",
      ordersBadge: "คำสั่งซื้อ",
      totalOrders: "คำสั่งซื้อทั้งหมด",
      totalSpending: "ยอดสั่งซื้อรวมทั้งหมด",
      accumulated: "ยอดสะสม",
      statusDraft: "รอประเมินราคา",
      statusPending: "รอดำเนินการ",
      statusOrdered: "สั่งซื้อแล้ว",
      statusCancelled: "ยกเลิกแล้ว",
      statusPendingPayment: "รอชำระเงิน",
      statusProcessing: "ดำเนินการ",
      statusPrinting: "กำลังพิมพ์",
      statusShipped: "จัดส่งแล้ว",
      statusDelivered: "ส่งถึงแล้ว",
      recentQuotes: "ใบเสนอราคาล่าสุด",
      recentQuotesDesc: "แสดงรายการอัปโหลดและประเมินราคา 10 รายการล่าสุด",
      viewAll: "ดูทั้งหมด",
      noOrders: "ยังไม่มีการสั่งซื้อ",
      noOrdersDesc: "อัปโหลดโมเดล 3 มิติ เพื่อรับการประเมินราคาได้ทันที",
      getQuote: "เริ่มต้นขอใบเสนอราคา",
      fileList: "รายการไฟล์",
      requestDate: "วันที่ส่งคำขอ",
      estPrice: "ราคาประเมิน",
      status: "สถานะ",
      more: "เพิ่มเติม",
      awaitingEstimate: "รอประเมิน",
      statusLabel: "สถานะ:",
      ordersNav: "ออเดอร์",
      lineChat: "แชท LINE",
      moreMenu: "เมนูอื่นๆ",
      accountAndHelp: "เมนูบัญชีและช่วยเหลือ",
      invoiceHistory: "ใบแจ้งหนี้ / ประวัติชำระเงิน",
      accountSettings: "ตั้งค่าบัญชีส่วนตัว",
      logout: "ออกจากระบบ",
      noHistory: "ไม่พบประวัติคำสั่งซื้อ",
      noHistoryDesc: "คุณยังไม่มีรายการสั่งซื้อในขณะนี้",
      orderCol: "คำสั่งซื้อ",
      dateCol: "วันที่",
      itemsCol: "รายการ",
      totalCol: "รวม",
      noTracking: "ยังไม่มีหมายเลขพัสดุ",
      trackLink: "ติดตาม",
      shippedBy: "จัดส่งโดย",
      trackPackage: "ติดตามพัสดุ",
      itemsLabel: "รายการ:",
      saveSuccess: "บันทึกข้อมูลสำเร็จแล้ว",
      saveFailed: "บันทึกข้อมูลไม่สำเร็จ",
      profileTitle: "โปรไฟล์",
      profileSubtitle: "ข้อมูลบัญชีของคุณ",
      save: "บันทึก",
      accountType: "ประเภทบัญชี",
      individual: "บุคคลธรรมดา",
      individualDesc: "ใช้ส่วนตัว",
      companyType: "นิติบุคคล",
      companyDesc: "ออกใบกำกับภาษีในนามบริษัท",
      primaryContact: "บุคคลธรรมดา",
      primaryContactDesc: "ข้อมูลติดต่อหลัก",
      fullName: "ชื่อ-นามสกุล",
      emailLabel: "อีเมล",
      phoneLabel: "เบอร์โทร",
      passwordLabel: "รหัสผ่าน",
      changePassword: "เปลี่ยน",
      companySection: "นิติบุคคล",
      companyBillingDesc: "ข้อมูลนิติบุคคลสำหรับออกใบกำกับภาษี",
      companyNameTH: "ชื่อบริษัท (ไทย)",
      companyNameEN: "ชื่อบริษัท (อังกฤษ)",
      taxId: "เลขประจำตัวผู้เสียภาษี",
      branchCode: "รหัสสาขา",
      vatRegistered: "จดทะเบียนแล้ว · มี VAT 7%",
      industryLabel: "อุตสาหกรรม",
      contactPerson: "ผู้ติดต่อ",
      officePhone: "เบอร์บริษัท",
      companyEmail: "อีเมลบริษัท",
      websiteLabel: "เว็บไซต์",
      companySizeLabel: "ขนาดบริษัท",
      addressTitle: "ที่อยู่",
      shippingAddressesDesc: "ที่อยู่จัดส่งของคุณ",
      addAddress: "เพิ่มที่อยู่",
      defaultBadge: "ค่าเริ่มต้น",
      editBtn: "แก้ไข",
      setAsDefault: "ตั้งเป็นค่าเริ่มต้น",
      noAddresses: "ยังไม่มีที่อยู่สำหรับจัดส่ง",
      noAddressesDesc: "เพิ่มที่อยู่ใหม่เพื่อความสะดวกรวดเร็วในการสั่งพิมพ์",
      addAddressTitle: "เพิ่มที่อยู่ใหม่",
      editAddressTitle: "แก้ไขที่อยู่",
      addressFormSubtitle: "กรอกรายละเอียดสถานที่จัดส่ง",
      placeLabel: "ชื่อสถานที่ (เช่น บ้าน, ออฟฟิศ)",
      recipientName: "ชื่อ-นามสกุล ผู้รับ",
      phoneNumber: "เบอร์โทรศัพท์",
      internationalAddress: "ที่อยู่ต่างประเทศ (International Address)",
      addressDetail: "ที่อยู่ (บ้านเลขที่, อาคาร, ถนน)",
      cancel: "ยกเลิก",
      savingAddress: "กำลังบันทึก...",
      saveAddress: "บันทึกที่อยู่",
      quotesPageTitle: "ใบเสนอราคา",
      quotesPageDesc: "ประวัติการขอใบเสนอราคาและเอกสารที่เกี่ยวข้อง",
      createNewQuote: "สร้างใบเสนอราคาใหม่",
      searchQuotes: "ค้นหาด้วยรหัส หรือชื่อชิ้นงาน...",
      filter: "ตัวกรอง",
      noQuoteHistory: "ยังไม่มีประวัติทำรายการ",
      noQuoteHistoryDesc: "เริ่มสร้างออเดอร์ให้เราประเมินราคาได้ทันทีแบบไม่มีค่าใช้จ่าย",
      firstQuote: "ขอใบเสนอราคาชิ้นแรก",
      itemSpec: "รายชื่อ / สเปคงาน",
      createdDate: "วันที่สร้าง",
      deliveredTo: "ส่งถึง",
      netTotal: "ยอดสุทธิ",
      statusManage: "สถานะ / จัดการ",
      pageOf: "หน้า",
      ofTotal: "จาก",
      awaitingQuoteLabel: "รอประเมิน",
      moreItems: "+ อีก",
      allRightsReserved: "สงวนลิขสิทธิ์",
      privacyPolicy: "นโยบายความเป็นส่วนตัว",
      termsOfService: "ข้อกำหนดการให้บริการ",
      cookiePolicy: "นโยบายคุกกี้",
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
      fdm: "FDM Printing",
      fdmDesc: "Economical, ideal for prototypes & large parts",
      sla: "SLA Resin",
      slaDesc: "High resolution, ultra-smooth surface finish",
      multicolor: "Multi-color Printing",
      multicolorDesc: "Multiple colors in one part with AMS technology",
      scanning: "3D Scanning",
      scanningDesc: "Convert physical objects to digital 3D models",
      sheetMetal: "Sheet Metal",
      sheetMetalDesc: "Custom cutting & bending of metal sheets",
      pcb: "PCB / PCBA",
      pcbDesc: "PCB design and electronic board assembly",
      postProcess: "Post-Processing",
      postProcessDesc: "Sanding, painting & premium surface coating",
      featuredTitle: "Get Instant Quote in 30 Seconds",
      featuredDesc: "Upload your 3D file and our AI calculates the price immediately",
      featuredCta: "Order Now",
      printingTechLabel: "Printing Technologies",
      additionalLabel: "Additional Services",
    },
    materials: {
      pla: "PLA",
      plaDesc: "Eco-friendly & economical",
      abs: "ABS",
      absDesc: "Heat resistant & strong",
      petg: "PETG",
      petgDesc: "Flexible, chemical resistant, semi-clear",
      resin: "Standard Resin",
      resinDesc: "Ultra-high detail, smooth surface",
      tpu: "TPU",
      tpuDesc: "Flexible, impact resistant, rubber-like",
      nylon: "Nylon SLS",
      nylonDesc: "High strength, lightweight, durable",
      engResin: "Engineering Resin",
      engResinDesc: "High heat & compression resistance",
      filamentLabel: "Filament (FDM)",
      resinLabel: "Resin & Engineering",
      guideTitle: "Not sure which material?",
      guideCta: "View Material Comparison Guide",
    },
    models: {
      gallery: "Browse All Models",
      galleryDesc: "1,000+ print-ready models to choose from",
      functional: "Functional Parts",
      functionalDesc: "Gears, clips, mounts & everyday tools",
      decorative: "Decorative & Art",
      decorativeDesc: "Home decor, collectibles & art pieces",
      upload: "Upload Your Model",
      uploadDesc: "Share your design with the community",
    },
    support: {
      guide: "User Guide",
      guideDesc: "Step-by-step guide to get started",
      faq: "Frequently Asked Questions",
      faqDesc: "Quick answers to common problems",
      contact: "Contact Us",
      contactDesc: "Email, phone or online contact form",
      blog: "Blog & Techniques",
      blogDesc: "3D printing tips and latest trends",
      chat: "Live Chat",
      chatDesc: "Chat with our team in real time",
      ticket: "Submit a Ticket",
      ticketDesc: "Leave a request for our support team",
      resourcesLabel: "Learning Resources",
      contactLabel: "Contact the Team",
    },
    about: {
      company: "About PrintMyDesign",
      companyDesc: "Our mission, vision and company story",
      factory: "Factory & Technology",
      factoryDesc: "Industrial-grade machinery & production process",
      team: "Our Team",
      teamDesc: "Our engineers and manufacturing experts",
      careers: "Careers",
      careersDesc: "Open positions we're hiring for",
      sustainability: "Sustainability",
      sustainabilityDesc: "Our commitment to responsible manufacturing",
      contact: "Contact Us",
      contactDesc: "Talk directly to the PDM team",
    },
    showcase: {
      heading: "3D Printing Services by PrintMyDesign",
      subheading: "We manufacture rapid, cost-effective prototypes and low-volume production orders for a variety of industries and applications.",
      cta: "Get Instant Quote",
    },
    bento: {
      badge: "Why Choose Us",
      heading1: "Why Leading Companies",
      heading2: "Choose PrintMyDesign",
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
      s2: "3D Scanning",
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
      c1: "About PrintMyDesign",
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
    login: {
      sidebarTitle: "Enter the PDM World",
      sidebarDesc: "Elevate your 3D printing with our all-in-one intelligent solutions.",
      loginTitle: "Sign In",
      loginSub: "Great to see you again!",
      registerTitle: "Create Account",
      registerSub: "Start using PDM for free today.",
      nameLabel: "Full Name",
      namePlaceholder: "Your full name",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      confirmPasswordLabel: "Confirm Password",
      forgotPassword: "Forgot password?",
      submitLogin: "Sign In",
      submitRegister: "Create Account",
      loading: "Loading...",
      orContinueWith: "Or continue with",
      noAccount: "Don't have an account?",
      registerNow: "Register now",
      hasAccount: "Already have an account?",
      loginHere: "Sign in here",
      termsNote: "By continuing, you agree to our",
      termsLink: "Terms",
      privacyLink: "Privacy Policy",
      otpTitle: "Verify OTP",
      otpDesc: "We sent a 6-digit code to",
      otpVerify: "Verify",
      otpNext: "Next",
      otpResendTimer: "Resend in",
      otpResend: "Resend code",
      backBtn: "Go back",
      backToLogin: "Back to sign in",
      forgotTitle: "Forgot Password?",
      forgotDesc: "No worries! Enter your email below and we'll send an OTP to reset your password.",
      sendOtp: "Send OTP",
      sending: "Sending...",
      resetTitle: "Set New Password",
      resetDesc: "Please set a new password that's easy to remember and secure.",
      newPasswordLabel: "New Password",
      confirmNewPasswordLabel: "Confirm New Password",
      resetBtn: "Reset Password",
      saving: "Saving...",
    },
    profile: {
      newProject: "New Project",
      mainMenu: "Main Menu",
      overview: "Overview",
      orderHistory: "Order History",
      docsAndSettings: "Documents & Settings",
      myQuotes: "My Quotes",
      profileInfo: "Profile Info",
      shippingAddress: "Shipping Address",
      consultEngineer: "Consult 3D Engineer",
      consultEngineerDesc: "Need material advice or file verification before printing? We're ready to help.",
      helpCenter: "Help Center 24/7",
      startLineChat: "Chat on LINE (@3dev)",
      searchPlaceholder: "Search projects or sections...",
      greeting: "Hello",
      accountOverview: "Your account and 3D printing overview",
      systemReady: "Pricing system ready",
      allBadge: "Total",
      totalQuotes: "Total Quotes",
      pendingBadge: "Pending",
      awaitingQuote: "Awaiting Quote",
      ordersBadge: "Orders",
      totalOrders: "Total Orders",
      totalSpending: "Total Spending",
      accumulated: "Accumulated",
      statusDraft: "Awaiting Quote",
      statusPending: "Pending",
      statusOrdered: "Ordered",
      statusCancelled: "Cancelled",
      statusPendingPayment: "Pending Payment",
      statusProcessing: "Processing",
      statusPrinting: "Printing",
      statusShipped: "Shipped",
      statusDelivered: "Delivered",
      recentQuotes: "Recent Quotes",
      recentQuotesDesc: "Showing last 10 uploaded and quoted items",
      viewAll: "View All",
      noOrders: "No orders yet",
      noOrdersDesc: "Upload a 3D model to get an instant quote",
      getQuote: "Get a Quote",
      fileList: "File",
      requestDate: "Request Date",
      estPrice: "Est. Price",
      status: "Status",
      more: "More",
      awaitingEstimate: "Awaiting",
      statusLabel: "Status:",
      ordersNav: "Orders",
      lineChat: "LINE Chat",
      moreMenu: "More",
      accountAndHelp: "Account & Help",
      invoiceHistory: "Invoice / Payment History",
      accountSettings: "Account Settings",
      logout: "Log Out",
      noHistory: "No order history found",
      noHistoryDesc: "You have no orders at this time",
      orderCol: "Order",
      dateCol: "Date",
      itemsCol: "Items",
      totalCol: "Total",
      noTracking: "No tracking number yet",
      trackLink: "Track",
      shippedBy: "Shipped by",
      trackPackage: "Track Package",
      itemsLabel: "Items:",
      saveSuccess: "Profile saved successfully",
      saveFailed: "Failed to save",
      profileTitle: "Profile",
      profileSubtitle: "Your account information",
      save: "Save",
      accountType: "Account Type",
      individual: "Individual",
      individualDesc: "Personal use",
      companyType: "Company",
      companyDesc: "Tax invoice in company name",
      primaryContact: "Individual",
      primaryContactDesc: "Primary contact information",
      fullName: "Full Name",
      emailLabel: "Email",
      phoneLabel: "Phone",
      passwordLabel: "Password",
      changePassword: "Change",
      companySection: "Company",
      companyBillingDesc: "Company details for tax invoices",
      companyNameTH: "Company Name (Thai)",
      companyNameEN: "Company Name (English)",
      taxId: "Tax ID",
      branchCode: "Branch Code",
      vatRegistered: "Registered · VAT 7%",
      industryLabel: "Industry",
      contactPerson: "Contact Person",
      officePhone: "Office Phone",
      companyEmail: "Company Email",
      websiteLabel: "Website",
      companySizeLabel: "Company Size",
      addressTitle: "Addresses",
      shippingAddressesDesc: "Your shipping addresses",
      addAddress: "Add Address",
      defaultBadge: "Default",
      editBtn: "Edit",
      setAsDefault: "Set as Default",
      noAddresses: "No shipping addresses yet",
      noAddressesDesc: "Add a new address for faster ordering",
      addAddressTitle: "Add New Address",
      editAddressTitle: "Edit Address",
      addressFormSubtitle: "Enter shipping location details",
      placeLabel: "Place name (e.g. Home, Office)",
      recipientName: "Recipient Full Name",
      phoneNumber: "Phone Number",
      internationalAddress: "International Address",
      addressDetail: "Address (House no., Building, Street)",
      cancel: "Cancel",
      savingAddress: "Saving...",
      saveAddress: "Save Address",
      quotesPageTitle: "Quotes",
      quotesPageDesc: "Quote history and related documents",
      createNewQuote: "New Quote",
      searchQuotes: "Search by code or part name...",
      filter: "Filter",
      noQuoteHistory: "No history yet",
      noQuoteHistoryDesc: "Start an order for a free instant quote",
      firstQuote: "Request First Quote",
      itemSpec: "Item / Spec",
      createdDate: "Created",
      deliveredTo: "Delivered To",
      netTotal: "Net Total",
      statusManage: "Status / Manage",
      pageOf: "Page",
      ofTotal: "of",
      awaitingQuoteLabel: "Awaiting",
      moreItems: "+ More",
      allRightsReserved: "All rights reserved.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      cookiePolicy: "Cookie Policy",
    },
  },
};

export const LANG_META = {
  th: { label: "TH", name: "ไทย", flag: "🇹🇭" },
  en: { label: "EN", name: "English", flag: "🇬🇧" },
} as const;
