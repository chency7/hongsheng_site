export type CaseCategory = '全部' | '船舶海洋' | '工程机械' | '轨道交通' | '风力发电' | '航空航天/其他';

export type CaseCard = {
  id: string;
  category: Exclude<CaseCategory, '全部'>;
  title: string;
  systemType: string;
  scenario: string;
  highlights: string[];
  image: string;
  parameters: { label: string; value: string }[];
  description?: string; // 详细描述
};

export const categories: CaseCategory[] = ['全部', '船舶海洋', '工程机械', '轨道交通', '风力发电', '航空航天/其他'];

export const caseCards: CaseCard[] = [
  {
    id: 'marine-piling-100m',
    category: '船舶海洋',
    title: '100米打桩船',
    systemType: '船用液压系统',
    scenario: '海上打桩作业',
    highlights: ['连续运行稳定性', '环境适应性', '维护便利性'],
    image: '/images/gc/marine.jpg',
    parameters: [
      { label: '系统压力', value: '35 MPa' },
      { label: '最大流量', value: '1200 L/min' },
      { label: '装机功率', value: '800 kW' },
    ],
    description: '针对海上恶劣工况设计的超大型打桩船液压系统，采用高压大流量闭式系统，确保打桩作业的高效与稳定。系统集成了智能监控与故障诊断功能，大幅降低了海上维护成本。'
  },
  {
    id: 'marine-dredger',
    category: '船舶海洋',
    title: '绞吸式挖泥船',
    systemType: '船用液压系统',
    scenario: '河道/港口疏浚',
    highlights: ['复杂工况适配', '动力与控制协同', '可靠性设计'],
    image: '/images/gc/marine.jpg',
    parameters: [
      { label: '绞刀功率', value: '2000 kW' },
      { label: '排距', value: '4000 m' },
      { label: '挖深', value: '25 m' },
    ],
    description: '适用于大型河道及港口疏浚作业的绞吸式挖泥船液压系统。通过精确的功率匹配控制，实现了绞刀切削与泥浆输送的最佳协同，显著提升了作业效率和燃油经济性。'
  },
  {
    id: 'marine-test-bench',
    category: '船舶海洋',
    title: '船用大型综合检测试验台',
    systemType: '检测系统',
    scenario: '船舶设备检测',
    highlights: ['数据可追溯', '测试流程规范化', '联动控制与保护'],
    image: '/images/gc/marine.jpg',
    parameters: [
      { label: '测试压力', value: '60 MPa' },
      { label: '加载力', value: '500 Ton' },
      { label: '控制精度', value: '±0.5%' },
    ],
    description: '为船舶关键液压设备提供全功能检测的综合试验台。具备压力、流量、负载等多参数加载与测试能力，支持自动化测试流程，生成符合船级社规范的检测报告。'
  },
  {
    id: 'construction-foaming-line',
    category: '工程机械',
    title: '大型发泡产线液压及电控系统',
    systemType: '生产线液压系统',
    scenario: '发泡材料生产',
    highlights: ['产线节拍匹配', '一致性与可追溯', '系统集成交付'],
    image: '/images/gc/manufacturing.jpg',
    parameters: [
      { label: '生产节拍', value: '30 s/pc' },
      { label: '定位精度', value: '±0.1 mm' },
      { label: '总功率', value: '450 kW' },
    ],
    description: '应用于大型发泡材料生产线的液压与电控集成系统。通过高精度的位置与压力控制，确保了发泡成型过程的一致性。系统支持高速生产节拍，满足大规模连续生产需求。'
  },
  {
    id: 'construction-crane-line',
    category: '工程机械',
    title: '起重机吊臂产线液压站',
    systemType: '生产线液压系统',
    scenario: '起重机制造',
    highlights: ['批量交付一致性', '维护体系完善', '工艺与品控'],
    image: '/images/gc/manufacturing.jpg',
    parameters: [
      { label: '油箱容积', value: '2000 L' },
      { label: '系统压力', value: '21 MPa' },
      { label: '工位数量', value: '12' },
    ],
    description: '服务于起重机吊臂自动化焊接与装配产线的液压动力站。采用模块化设计，便于快速安装与维护。稳定的压力输出保证了产线各工位的动作协调与加工质量。'
  },
  {
    id: 'construction-demolding-300t',
    category: '工程机械',
    title: '300T脱模机液压及电控系统',
    systemType: '重型设备液压系统',
    scenario: '模具脱模',
    highlights: ['重载稳定输出', '安全保护策略', '可维护性设计'],
    image: '/images/gc/construction.jpg',
    parameters: [
      { label: '脱模力', value: '300 Ton' },
      { label: '行程', value: '1500 mm' },
      { label: '同步精度', value: '±1 mm' },
    ],
    description: '专为大型预制件模具设计的300吨级脱模机液压系统。具备强大的脱模力与精确的同步控制能力，有效解决了大型复杂模具脱模难、易损件等问题。'
  },
  {
    id: 'construction-distributor',
    category: '工程机械',
    title: '多规格楼面布料机液压及电控系统',
    systemType: '建筑机械液压系统',
    scenario: '混凝土布料',
    highlights: ['多规格适配', '控制可靠性', '现场工况兼容'],
    image: '/images/gc/construction.jpg',
    parameters: [
      { label: '布料半径', value: '28-36 m' },
      { label: '系统压力', value: '28 MPa' },
      { label: '回转角度', value: '360°' },
    ],
    description: '适配多种规格楼面混凝土布料机的液压与电控系统。针对建筑施工现场的复杂环境进行了优化设计，具有极高的可靠性与耐用性，操作简便，维护方便。'
  },
  {
    id: 'rail-articulation-test',
    category: '轨道交通',
    title: '轨道交通铰接器试验台',
    systemType: '测试系统',
    scenario: '轨道车辆铰接器检测',
    highlights: ['重复性与一致性', '安全联锁', '报告输出'],
    image: '/images/gc/rail.jpg',
    parameters: [
      { label: '最大加载', value: '1000 kN' },
      { label: '频率', value: '5 Hz' },
      { label: '通道数', value: '16' },
    ],
    description: '用于轨道交通车辆关键部件——铰接器的性能与疲劳测试。系统能够模拟车辆运行过程中的各种复杂受力情况，验证铰接器的可靠性与寿命，保障列车运行安全。'
  },
  {
    id: 'wind-coupling-pressure',
    category: '风力发电',
    title: '风电联轴器压力测试系统',
    systemType: '测试系统',
    scenario: '联轴器压力检测',
    highlights: ['指标量化', '数据采集', '流程可追溯'],
    image: '/images/gc/wind.jpg',
    parameters: [
      { label: '测试压力', value: '250 MPa' },
      { label: '保压时间', value: '24 h' },
      { label: '介质', value: '液压油' },
    ],
    description: '针对风力发电机组联轴器的高压密封与耐压性能测试系统。支持高达250MPa的超高压测试，具备长时间保压与微小泄漏检测能力，确保联轴器在极端工况下的密封可靠性。'
  },
  {
    id: 'wind-coupling-fatigue',
    category: '风力发电',
    title: '风电联轴器疲劳测试系统',
    systemType: '测试系统',
    scenario: '联轴器疲劳寿命检测',
    highlights: ['长周期稳定运行', '工况可编程', '数据与报告'],
    image: '/images/gc/wind.jpg',
    parameters: [
      { label: '最大扭矩', value: '50 kNm' },
      { label: '疲劳次数', value: '10^7' },
      { label: '加载波形', value: '正弦/三角' },
    ],
    description: '用于评估风电联轴器疲劳寿命的专用测试系统。可模拟风机运行全生命周期内的扭矩载荷谱，进行长周期的疲劳耐久性测试，为产品改进与定型提供数据支撑。'
  },
  {
    id: 'aerospace-valve-seal',
    category: '航空航天/其他',
    title: '空气制动阀密封件测试试验台',
    systemType: '测试系统',
    scenario: '制动系统密封检测',
    highlights: ['精密控制', '流程规范化', '可追溯记录'],
    image: '/images/gc/aerospace.jpg',
    parameters: [
      { label: '气压范围', value: '0-1.0 MPa' },
      { label: '泄漏检测', value: '0.01 mL/min' },
      { label: '温控范围', value: '-40~80 ℃' },
    ],
    description: '应用于航空航天及特种车辆空气制动阀密封性能的高精度检测。集成了高低温环境模拟与精密泄漏检测技术，能够检测出极微小的气体泄漏，确保制动系统的绝对安全。'
  },
];
