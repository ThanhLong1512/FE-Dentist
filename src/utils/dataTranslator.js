// Comprehensive Data Translator for Services, Facilities, and Doctors
// Supports Vietnamese (vi), English (en), and Chinese (zh)

const SERVICE_DICTIONARY = {
  // Medical & Lab services in BE
  "Laboratory Tests": {
    vi: {
      name: "Xét Nghiệm & Phân Tích Máu Tổng Quát",
      summary: "Xét nghiệm công thức máu toàn phần, chức năng gan, thận và chỉ số chuyển hóa chuẩn xác.",
      desc: "Xét nghiệm công thức máu toàn phần, chức năng gan, thận, lipid máu và các chỉ số sinh hóa với hệ thống máy tự động chuẩn quốc tế.",
    },
    en: {
      name: "Laboratory & Diagnostic Blood Tests",
      summary: "Complete blood count, liver and kidney functions, metabolic profiling with international accuracy.",
      desc: "Complete blood count, liver function, kidney panel, lipid profiling, and biochemical tests using state-of-the-art automated equipment.",
    },
    zh: {
      name: "临床化验与血液综合检测",
      summary: "全血细胞计数、肝肾功能与生化代谢全套检测，国际质控标准。",
      desc: "全血细胞分析、肝功、肾功、血脂全套及生化指标精密检测，采用高精度全自动化国际标准仪器。",
    },
  },
  "Vaccination": {
    vi: {
      name: "Tiêm Chủng Phòng Ngừa Tiêu Chuẩn",
      summary: "Vắc xin chính hãng phòng ngừa các bệnh truyền nhiễm cho người lớn và trẻ em.",
      desc: "Vắc xin nhập khẩu chính hãng bảo quản dây chuyền lạnh GSP, bác sĩ tư vấn và theo dõi phản ứng sau tiêm an toàn tuyệt đối.",
    },
    en: {
      name: "Preventive Immunization & Vaccination",
      summary: "Standard vaccines protecting adults and children from infectious diseases.",
      desc: "Genuine imported vaccines preserved in GSP cold chain, with pre-vaccination screening and post-injection monitoring.",
    },
    zh: {
      name: "预防接种与成人儿童疫苗",
      summary: "正品进口疫苗，全面预防成人与儿童常见及高危传染病。",
      desc: "高品质正品疫苗，严格GSP冷链质控，资深医生评估筛查与接种后留观监护，安全无忧。",
    },
  },
  "Physiotherapy": {
    vi: {
      name: "Vật Lý Trị Liệu & Phục Hồi Chức Năng",
      summary: "Liệu trình phục hồi chuyên sâu giảm đau cơ xương khớp, phục hồi vận động.",
      desc: "Phác đồ cá nhân hóa ứng dụng sóng ngắn, laser xung và kỹ thuật vận động trị liệu độc quyền giúp phục hồi nhanh chóng.",
    },
    en: {
      name: "Physiotherapy & Rehabilitation Therapy",
      summary: "Specialized rehabilitation sessions relieving musculoskeletal pain and restoring mobility.",
      desc: "Personalized recovery protocols combining therapeutic ultrasound, pulsed laser, and manual techniques for fast pain relief.",
    },
    zh: {
      name: "专业物理理疗与康复医学",
      summary: "针对肌肉骨骼疼痛与术后功能恢复的个性化物理康复疗程。",
      desc: "结合深层脉冲激光、超声波理疗及徒手手法复位，有效缓解颈肩腰腿痛，迅速恢复身体机能。",
    },
  },
  "Nutrition Consultation": {
    vi: {
      name: "Tư Vấn & Thiết Kế Thực Đơn Dinh Dưỡng",
      summary: "Thực đơn dinh dưỡng cá nhân hóa từ chuyên gia hàng đầu cho từng thể trạng.",
      desc: "Đo lường chỉ số thành phần cơ thể InBody và xây dựng phác đồ dinh dưỡng điều trị hoặc tăng cường sức khỏe.",
    },
    en: {
      name: "Clinical Nutrition & Dietary Consultation",
      summary: "Personalized dietary advice and meal planning tailored by leading nutritionists.",
      desc: "InBody bio-impedance composition analysis and custom evidence-based diet plans for lifestyle or clinical goals.",
    },
    zh: {
      name: "临床营养咨询与膳食方案",
      summary: "资深营养专家量身打造针对性膳食营养与健康生活计划。",
      desc: "人体成分深度分析，结合体质定制个性化控脂、调糖或术后恢复营养食谱，建立长效健康防线。",
    },
  },
  "Eye Examination": {
    vi: {
      name: "Khám & Tầm Soát Nhãn Khoa Chuyên Sâu",
      summary: "Đo thị lực khúc xạ, kiểm tra nhãn áp và chụp đáy mắt kỹ thuật số hiện đại.",
      desc: "Phát hiện sớm tật khúc xạ, đục thủy tinh thể, tăng nhãn áp với thiết bị quang học kỹ thuật số hàng đầu.",
    },
    en: {
      name: "Comprehensive Ophthalmology Eye Exam",
      summary: "Digital refraction testing, intraocular pressure measurement, and retinal imaging.",
      desc: "Early detection of refractive errors, cataracts, glaucoma, and macular degeneration with precision optical tools.",
    },
    zh: {
      name: "眼科全景精密检查与筛查",
      summary: "数字化精准验光、眼压测定、眼底免散瞳照相与视力全面评估。",
      desc: "全面筛查近视散光、青光眼、白内障及眼底病变，进口高精度光学设备护航明亮双眸。",
    },
  },
  "Dental Checkup": {
    vi: {
      name: "Khám & Đánh Giá Răng Miệng Toàn Diện",
      summary: "Kiểm tra răng miệng tổng quát, chụp phim Panorama và lấy cao răng siêu âm.",
      desc: "Bác sĩ chuyên khoa Răng Hàm Mặt thăm khám kỹ lưỡng, phát hiện sớm sâu răng, viêm nha chu và tư vấn phác đồ bảo tồn răng thật.",
    },
    en: {
      name: "Comprehensive Dental Examination & Cleaning",
      summary: "Complete oral health evaluation, panoramic X-rays, and ultrasonic dental scaling.",
      desc: "Full oral assessment by oral specialists, spotting early tooth decay and periodontal issues with preservation-first principles.",
    },
    zh: {
      name: "数字化口腔全景综合检查与洁牙",
      summary: "口腔全面检查、全景数字化X光片拍摄与超声波舒适洁治。",
      desc: "资深牙医全面评估牙齿、牙龈及咬合状态，早期筛查龋齿牙周病，定制以保全天然牙为核心的健康方案。",
    },
  },
  "ENT Examination": {
    vi: {
      name: "Khám & Nội Soi Tai Mũi Họng Kỹ Thuật Số",
      summary: "Nội soi ống mềm không đau phát hiện sớm viêm xoang, viêm họng và polyp.",
      desc: "Hệ thống nội soi HD ống mềm ánh sáng dải tần hẹp NBI giúp quan sát rõ tổn thương niêm mạc mà không gây khó chịu.",
    },
    en: {
      name: "Digital ENT Examination & Endoscopy",
      summary: "Painless soft-tube endoscopy detecting sinusitis, pharyngitis, and polyps early.",
      desc: "Narrow-band imaging (NBI) high-definition video endoscopy for comfortable and accurate ear, nose, and throat diagnosis.",
    },
    zh: {
      name: "耳鼻喉数字化超细软管无痛内窥镜",
      summary: "超细软管高清内窥镜检查，精准排查鼻窦炎、咽喉炎及息肉隐患。",
      desc: "采用进口高清窄带成像软管内镜，视野清晰无恶心感，精准诊断鼻炎、声带病变及咽喉微细病灶。",
    },
  },
  "Cardiology Assessment": {
    vi: {
      name: "Tầm Soát Tim Mạch & Điện Tâm Đồ Chuyên Sâu",
      summary: "Điện tâm đồ ECG, siêu âm doppler tim và đánh giá nguy cơ mạch vành.",
      desc: "Gói khám tim mạch chuyên sâu giúp phòng ngừa sớm đột quỵ, thiếu máu cơ tim và rối loạn nhịp tim.",
    },
    en: {
      name: "Cardiovascular Screening & ECG Evaluation",
      summary: "Resting ECG, cardiac Doppler ultrasound, and cardiovascular risk stratification.",
      desc: "Specialized cardiac assessments preventing myocardial infarction, arrhythmias, and stroke with non-invasive testing.",
    },
    zh: {
      name: "心血管健康深度评估与心电图",
      summary: "静息及动态心电图、心脏多普勒超声与心脑血管风险分级评估。",
      desc: "早期发现心肌缺血、心律失常及动脉硬化隐患，专业心内科医生解读，提供全方位守护。",
    },
  },
  "Mental Health Counseling": {
    vi: {
      name: "Tư Vấn & Trị Liệu Tâm Lý Lâm Sàng",
      summary: "Lắng nghe chuyên sâu, giải tỏa căng thẳng và hỗ trợ điều trị rối loạn lo âu.",
      desc: "Không gian bảo mật tuyệt đối, chuyên gia tâm lý giàu kinh nghiệm đồng hành tháo gỡ áp lực công việc và cuộc sống.",
    },
    en: {
      name: "Clinical Mental Health & Psychotherapy",
      summary: "Empathetic active listening, stress relief, and cognitive emotional support.",
      desc: "Strictly confidential environment with certified psychologists guiding you through anxiety, burnout, and emotional wellness.",
    },
    zh: {
      name: "专业心理健康咨询与情绪疏导",
      summary: "深度倾听、舒缓职场及生活压力、专业心理评估与认知疏导。",
      desc: "严格隐私保护空间，资深心理咨询师以科学认知疗法陪伴您疏导焦虑抑郁，重获内心从容阳光。",
    },
  },
  "Ultrasound Scan": {
    vi: {
      name: "Siêu Âm Màu 4D Kỹ Thuật Số Đa Cơ Quan",
      summary: "Siêu âm ổ bụng tổng quát, tuyến giáp và mạch máu với độ phân giải cao.",
      desc: "Đầu dò ma trận đa tần số hiện đại cho hình ảnh cắt lớp rõ nét từng milimet cấu trúc nội tạng.",
    },
    en: {
      name: "Digital 4D Color Ultrasound Imaging",
      summary: "High-resolution ultrasound of abdomen, thyroid, vascular system, and organs.",
      desc: "State-of-the-art multi-frequency matrix probes providing crystal-clear visualization for accurate internal diagnosis.",
    },
    zh: {
      name: "高清四维数字化彩色多普勒超声",
      summary: "腹部各脏器、甲状腺、颈动脉及浅表器官高分辨率超声探查。",
      desc: "新一代多频矩阵超声探头，清晰呈现内部器官微细血流及组织纹理，精准排查潜在结节与病变。",
    },
  },

  // Dental Services
  "Trồng Răng Implant Toàn Hàm All-on-4": {
    vi: {
      name: "Trồng Răng Implant Toàn Hàm All-on-4",
      summary: "Khôi phục toàn bộ hàm răng chỉ với 4 trụ Implant Thụy Sĩ, ăn nhai chắc chắn trọn đời.",
      desc: "Kỹ thuật trồng răng phục hình tức thì với trụ Implant Nobel Biocare/Straumann chuẩn y khoa, chịu lực hoàn hảo.",
    },
    en: {
      name: "All-on-4 Full Arch Dental Implant",
      summary: "Restore full arch teeth with only 4 Swiss/US implants, chewing naturally for life.",
      desc: "Immediate-load full arch oral rehabilitation using Nobel Biocare / Straumann titanium posts with lifelong stability.",
    },
    zh: {
      name: "All-on-4 全口数字化即刻种植牙",
      summary: "仅需4颗瑞士/瑞典精密植体恢复整口好牙，坚固耐用如同真牙。",
      desc: "采用瑞士ITI / 瑞典诺贝尔生物兼容纯钛植体，微创数字化导板即拔即种，终身质保坚固耐用。",
    },
  },
  "Niềng Răng Trong Suốt Invisalign Hoa Kỳ": {
    vi: {
      name: "Niềng Răng Trong Suốt Invisalign Hoa Kỳ",
      summary: "Khay niềng vô hình độc quyền SmartTrack, biết trước kết quả với máy quét 3D iTero 5D.",
      desc: "Hệ thống khay niềng trong suốt tháo lắp linh hoạt từ Hoa Kỳ, không gây trầy xước lợi, đảm bảo thẩm mỹ tối đa.",
    },
    en: {
      name: "Invisalign Clear Aligners (USA)",
      summary: "Invisible custom SmartTrack aligners, previewing your smile with 3D iTero 5D scanning.",
      desc: "Removable transparent orthodontic trays imported from Align Technology USA, virtually invisible and gentle on gums.",
    },
    zh: {
      name: "美国隐适美透明隐形矫正",
      summary: "定制高分子SmartTrack隐形牙套，配备iTero 5D口扫即刻预见矫正效果。",
      desc: "美国原装进口数字化矫正系统，自由摘戴隐形无痕，不伤牙龈不磨嘴，美观自信完成蜕变。",
    },
  },
  "Bọc Răng Sứ Thẩm Mỹ Nano": {
    vi: {
      name: "Bọc Răng Sứ Thẩm Mỹ Nano Emax",
      summary: "Khắc phục răng ố vàng, sứt mẻ, tạo dáng nụ cười chuẩn tỷ lệ vàng chỉ sau 2 lần hẹn.",
      desc: "Sứ nguyên khối Cercon / Emax nhập khẩu Đức, độ chịu lực gấp 5 lần răng thật, màu sắc trong bóng tự nhiên.",
    },
    en: {
      name: "Nano Ceramic & Emax Porcelain Crowns",
      summary: "Fix chipped, stained, or uneven teeth with golden ratio aesthetics in just 2 appointments.",
      desc: "Monolithic zirconia & Emax porcelain engineered in Germany, 5x stronger than natural enamel with natural translucency.",
    },
    zh: {
      name: "纳米全瓷美学微创牙冠",
      summary: "快速告别氟斑牙、牙缝大与缺损，两次就诊重现好莱坞明星黄金微笑曲线。",
      desc: "精选德国Emax / 泽康高透全瓷块，5倍于天然牙抗压韧性，色泽通透晶莹宛若天生。",
    },
  },
  "Nhổ Răng Khôn Sóng Siêu Âm Piezotome": {
    vi: {
      name: "Nhổ Răng Khôn Sóng Siêu Âm Piezotome",
      summary: "Kỹ thuật nhổ răng không xâm lấn, lành thương nhanh chóng, hạn chế tối đa cảm giác đau nhức.",
      desc: "Công nghệ sóng rung siêu âm thông minh chỉ tác động lên mô cứng, bảo tồn tuyệt đối dây thần kinh và mô mềm.",
    },
    en: {
      name: "Piezotome Ultrasonic Wisdom Tooth Extraction",
      summary: "Minimally invasive ultrasonic extraction, fast healing with minimal swelling or discomfort.",
      desc: "Ultrasonic piezo-vibrations specifically targeting mineralized tissue while protecting soft tissue and nerve canals.",
    },
    zh: {
      name: "Piezotome 超声骨刀微创无痛拔牙",
      summary: "微创超声波轻柔剥离，创口极小恢复神速，告别传统锤敲与术后肿痛。",
      desc: "法国Piezotome超声骨刀高频选择性切割骨质，完美避开下牙槽神经管与软组织，安心微创拔牙。",
    },
  },
  "Tẩy Trắng Răng Laser Whitening": {
    vi: {
      name: "Tẩy Trắng Răng Laser Whitening",
      summary: "Bật tông trắng sáng chỉ sau 45 phút điều trị bằng công nghệ ánh sáng Laser an toàn cho men răng.",
      desc: "Gel tẩy trắng nồng độ an toàn kích hoạt bằng tia Laser lạnh chuyên dụng, không gây ê buốt, hiệu quả giữ sáng lâu dài.",
    },
    en: {
      name: "Laser Teeth Whitening Treatment",
      summary: "Lift your tooth shade 3-5 levels in 45 minutes with enamel-safe cold laser technology.",
      desc: "Enamel-safe whitening formula activated by advanced cold laser, zero tooth sensitivity and long-lasting radiance.",
    },
    zh: {
      name: "德国冷光激光无敏牙齿美白",
      summary: "45分钟温和提升3-5个色阶，深层分解外源性色素沉淀，安全不伤牙釉质。",
      desc: "国际认证医用美白凝胶配合冷激光精准活化，全程温和不酸软，即刻绽放明亮自信笑容。",
    },
  },
  "Điều Trị Tủy Vi Phẫu Không Đau": {
    vi: {
      name: "Điều Trị Tủy Vi Phẫu Kính Hiển Vi",
      summary: "Làm sạch ống tủy triệt để dưới kính hiển vi chuyên dụng, chấm dứt cơn đau nhức răng cấp tính.",
      desc: "Đo chiều dài ống tủy bằng máy định vị Apex điện tử và trám bít kín khít bằng Gutta-Percha sinh học.",
    },
    en: {
      name: "Microscopic Painless Root Canal Therapy",
      summary: "Meticulous canal disinfection under surgical microscope, putting an end to acute dental pain.",
      desc: "Precision electronic apex locator guided cleaning with hermetic bio-ceramic sealing for long-term tooth survival.",
    },
    zh: {
      name: "显微精准无痛根管治疗",
      summary: "医用高倍显微镜下精密疏通清理复杂根管，迅速止痛彻底根治根尖炎症。",
      desc: "电子根测仪毫米级定位，镍钛器械立体清理并采用生物相容性热牙胶严密三维充填，保全天然牙根。",
    },
  },
};

// Facilities dictionary
const FACILITY_DICTIONARY = {
  "Nha khoa Smile - Trụ sở Quận 1": {
    vi: {
      name: "Nha khoa DENTIST PRO - Trụ sở Quận 1 (TP.HCM)",
      address: "123 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1",
      city: "TP. Hồ Chí Minh",
      desc: "Trụ sở chính hiện đại trang bị máy CT Cone Beam 3D, phòng vô trùng áp lực dương và phòng VIP tiếp đón chuẩn 5 sao.",
    },
    en: {
      name: "DENTIST PRO - District 1 Flagship (HCMC)",
      address: "123 Nam Ky Khoi Nghia St, Ben Thanh, District 1",
      city: "Ho Chi Minh City",
      desc: "Modern flagship equipped with 3D CT Cone Beam, positive pressure surgical rooms, and 5-star VIP reception lounge.",
    },
    zh: {
      name: "DENTIST PRO - 第1郡旗舰总院 (胡志明市)",
      address: "胡志明市第1郡南圻起义路123号",
      city: "胡志明市",
      desc: "高科旗舰总院，配备进口德国3D CT锥形束断层扫描仪、正压层流无菌手术室与五星级VIP私享诊室。",
    },
  },
  "Nha khoa Smile - Chi nhánh Phú Mỹ Hưng": {
    vi: {
      name: "Nha khoa DENTIST PRO - Chi nhánh Phú Mỹ Hưng (Quận 7)",
      address: "88 Nguyễn Đức Cảnh, Tân Phong, Quận 7",
      city: "TP. Hồ Chí Minh",
      desc: "Cơ sở chuyên sâu niềng răng trong suốt Invisalign, phục hình nụ cười và nha khoa gia đình chuẩn quốc tế.",
    },
    en: {
      name: "DENTIST PRO - Phu My Hung International Branch (District 7)",
      address: "88 Nguyen Duc Canh St, Tan Phong, District 7",
      city: "Ho Chi Minh City",
      desc: "Specialized center for Invisalign aligners, cosmetic smile makeover, and international family dentistry.",
    },
    zh: {
      name: "DENTIST PRO - 富美兴国际分院 (第7郡)",
      address: "胡志明市第7郡阮德景路88号",
      city: "胡志明市",
      desc: "国际社区品质专科，专注隐适美透明正畸、全瓷美容微创修复及外籍家庭口腔健康关爱。",
    },
  },
  "Nha khoa Smile - Chi nhánh Cầu Giấy": {
    vi: {
      name: "Nha khoa DENTIST PRO - Chi nhánh Cầu Giấy (Hà Nội)",
      address: "15 Duy Tân, Dịch Vọng Hậu, Cầu Giấy",
      city: "Hà Nội",
      desc: "Trung tâm nha khoa kỹ thuật cao tại Thủ đô, thuận tiện di chuyển, bãi đỗ xe rộng rãi và đội ngũ bác sĩ ĐH Y Hà Nội.",
    },
    en: {
      name: "DENTIST PRO - Cau Giay Tech Hub Branch (Hanoi)",
      address: "15 Duy Tan St, Dich Vong Hau, Cau Giay",
      city: "Hanoi",
      desc: "High-tech dental center in Hanoi with spacious parking, cutting-edge equipment and Hanoi Medical University specialists.",
    },
    zh: {
      name: "DENTIST PRO - 纸桥高科旗舰分院 (河内市)",
      address: "河内市纸桥郡维新路15号",
      city: "河内市",
      desc: "河内核心商务区大型数字化口腔中心，交通便捷配专属停车场，河内医科大学专家名医坐诊。",
    },
  },
  "Nha khoa Smile - Chi nhánh Bình Thạnh": {
    vi: {
      name: "Nha khoa DENTIST PRO - Chi nhánh Bình Thạnh",
      address: "246 Xô Viết Nghệ Tĩnh, Phường 21, Bình Thạnh",
      city: "TP. Hồ Chí Minh",
      desc: "Phòng khám nha khoa tiện ích phục vụ khu vực Đông TP.HCM với đầy đủ dịch vụ nhổ răng, trám răng thẩm mỹ và tẩy trắng.",
    },
    en: {
      name: "DENTIST PRO - Binh Thanh Community Branch",
      address: "246 Xo Viet Nghe Tinh St, Ward 21, Binh Thanh",
      city: "Ho Chi Minh City",
      desc: "Accessible neighborhood clinic serving East HCMC with full services: painless extraction, aesthetic fillings, and whitening.",
    },
    zh: {
      name: "DENTIST PRO - 平盛区分院 (胡志明市)",
      address: "胡志明市平盛区苏越义静路246号",
      city: "胡志明市",
      desc: "优质便民口腔分院，全面提供无痛微创拔牙、纳米树脂补牙、舒适洗牙及冷光牙齿美白服务。",
    },
  },
};

// Doctors dictionary
const DOCTOR_DICTIONARY = {
  "BS. CKI Nguyễn Văn Minh": {
    vi: {
      name: "BS. CKI Nguyễn Văn Minh",
      exp: "15 năm kinh nghiệm",
      desc: "Chuyên gia cấy ghép Implant & Phục hình sứ, tu nghiệp chuyên sâu tại Thụy Sĩ.",
    },
    en: {
      name: "Dr. Nguyen Van Minh (MD)",
      exp: "15 Years Experience",
      desc: "Specialist in Implantology & Prosthodontics, advanced fellowship in Switzerland.",
    },
    zh: {
      name: "阮文明 主治医师",
      exp: "15年临床经验",
      desc: "数字化种植牙与全瓷修复学科带头人，瑞士名校进修学者。",
    },
  },
  "ThS. BS Trần Thị Mai": {
    vi: {
      name: "ThS. BS Trần Thị Mai",
      exp: "12 năm kinh nghiệm",
      desc: "Chuyên gia Chỉnh nha & Niềng răng Invisalign hạng Platinum Elite.",
    },
    en: {
      name: "Dr. Tran Thi Mai (MSc)",
      exp: "12 Years Experience",
      desc: "Invisalign Platinum Elite Certified Orthodontist & Craniofacial Specialist.",
    },
    zh: {
      name: "陈氏梅 硕士主任",
      exp: "12年临床经验",
      desc: "隐适美全球认证白金菁英医生，专注颜面微笑美学与复杂隐形矫正。",
    },
  },
  "BS. CKI Lê Quang Huy": {
    vi: {
      name: "BS. CKI Lê Quang Huy",
      exp: "10 năm kinh nghiệm",
      desc: "Chuyên gia Tiểu phẫu & Nhổ răng khôn sóng siêu âm Piezotome không đau.",
    },
    en: {
      name: "Dr. Le Quang Huy (MD)",
      exp: "10 Years Experience",
      desc: "Oral Surgeon specializing in Piezotome painless ultrasonic wisdom extractions.",
    },
    zh: {
      name: "黎光辉 主治牙医",
      exp: "10年临床经验",
      desc: "口腔颌面外科微创手术专家，Piezotome超声骨刀无痛拔牙学科骨干。",
    },
  },
  "BS. Hoàng Bảo Ngọc": {
    vi: {
      name: "BS. Hoàng Bảo Ngọc",
      exp: "8 năm kinh nghiệm",
      desc: "Chuyên gia Nha khoa Thẩm mỹ, dán sứ Veneer và tẩy trắng răng không ê buốt.",
    },
    en: {
      name: "Dr. Hoang Bao Ngoc (DDS)",
      exp: "8 Years Experience",
      desc: "Aesthetic Dentist, master of ultra-thin Veneers and sensitive-free whitening.",
    },
    zh: {
      name: "黄宝玉 资深医师",
      exp: "8年临床经验",
      desc: "微创美学修复与超薄贴面专家，专研冷光激光无敏牙齿美白技术。",
    },
  },
};

/**
 * Translates a service object based on the given language code ('vi', 'en', 'zh')
 */
export function translateService(service, lang = "vi") {
  if (!service) return service;
  const rawName = (service.nameService || "").trim();
  const dict = SERVICE_DICTIONARY[rawName];

  if (!dict) {
    // If not exact match, check fuzzy key inclusion
    const matchedKey = Object.keys(SERVICE_DICTIONARY).find(
      (k) =>
        k.toLowerCase().includes(rawName.toLowerCase()) ||
        rawName.toLowerCase().includes(k.toLowerCase())
    );
    if (matchedKey) {
      const matchDict = SERVICE_DICTIONARY[matchedKey];
      const trans = matchDict[lang] || matchDict.vi || matchDict.en;
      return {
        ...service,
        nameService: trans?.name || service.nameService,
        summary: trans?.summary || service.summary,
        description: trans?.desc || service.description,
        Unit: lang === "vi" ? "Giờ" : lang === "zh" ? "小时" : "Hour",
      };
    }

    return {
      ...service,
      Unit: lang === "vi" ? "Giờ" : lang === "zh" ? "小时" : "Hour",
    };
  }

  const trans = dict[lang] || dict.vi || dict.en;
  return {
    ...service,
    nameService: trans?.name || service.nameService,
    summary: trans?.summary || service.summary,
    description: trans?.desc || service.description,
    Unit: lang === "vi" ? "Giờ" : lang === "zh" ? "小时" : "Hour",
  };
}

/**
 * Translates a facility object based on the given language code ('vi', 'en', 'zh')
 */
export function translateFacility(facility, lang = "vi") {
  if (!facility) return facility;
  const rawName = (facility.name || "").trim();
  const dict = FACILITY_DICTIONARY[rawName];

  if (!dict) {
    // Check partial match
    const matchedKey = Object.keys(FACILITY_DICTIONARY).find(
      (k) =>
        k.toLowerCase().includes(rawName.toLowerCase()) ||
        rawName.toLowerCase().includes(k.toLowerCase())
    );
    if (matchedKey) {
      const matchDict = FACILITY_DICTIONARY[matchedKey];
      const trans = matchDict[lang] || matchDict.vi || matchDict.en;
      return {
        ...facility,
        name: trans?.name || facility.name,
        address: trans?.address || facility.address,
        city: trans?.city || facility.city,
        description: trans?.desc || facility.description,
      };
    }
    return facility;
  }

  const trans = dict[lang] || dict.vi || dict.en;
  return {
    ...facility,
    name: trans?.name || facility.name,
    address: trans?.address || facility.address,
    city: trans?.city || facility.city,
    description: trans?.desc || facility.description,
  };
}

/**
 * Translates doctor info based on the given language code ('vi', 'en', 'zh')
 */
export function translateDoctor(doctor, lang = "vi") {
  if (!doctor) return doctor;
  const rawName = (doctor.name || "").trim();
  const dict = DOCTOR_DICTIONARY[rawName];

  if (!dict) {
    return doctor;
  }

  const trans = dict[lang] || dict.vi || dict.en;
  return {
    ...doctor,
    name: trans?.name || doctor.name,
    experience: trans?.exp || doctor.experience,
    description: trans?.desc || doctor.description,
  };
}

/**
 * Localized price formatting
 */
export function formatLocalizedPrice(amount, lang = "vi") {
  const num = Number(amount) || 0;
  if (lang === "en") {
    // Convert VND approximately to USD for display if desired or formatted USD/VND
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(num);
  }
  if (lang === "zh") {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(num);
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
}
