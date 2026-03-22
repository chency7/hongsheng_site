export type ProductCategory = string;
export type ProductBrand = '福艾德' | '派克' | '力士乐' | '贺德克' | '其他';

export interface CategoryOption {
  id: string;
  name: string;
  subCategories?: { id: string; name: string }[];
}

export const categoryOptions: CategoryOption[] = [
  {
    id: 'engineering',
    name: '工程机械',
    subCategories: [
      { id: 'concrete-placing-boom', name: '布料机液压站' },
    ],
  },
  {
    id: 'railway',
    name: '轨道交通',
    subCategories: [],
  },
  {
    id: 'marine',
    name: '船舶海洋',
    subCategories: [],
  },
  {
    id: 'wind',
    name: '风力发电',
    subCategories: [],
  },
  {
    id: 'aerospace',
    name: '航空航天',
    subCategories: [],
  },
  {
    id: 'manufacturing',
    name: '工业制造',
    subCategories: [
      { id: 'mine-truck', name: '矿卡专用控制阀组' },
      { id: 'manifold-block', name: '组合阀组' },
    ],
  },
];

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductDetailTab {
  title: string;
  content: string; // 可以是 markdown 格式
  type?: 'markdown' | 'pdf' | 'file'; // 标识 tab 的类型，默认为 markdown
  fileUrl?: string; // 如果 type 是 file，这里提供文件的路径
}

export interface Product {
  id: string;
  name: string;
  model: string;
  category: string;
  brand: ProductBrand;
  price: number;
  rating: number;
  sales: number;
  createdAt: string;
  image: string;
  images: string[];
  specs: ProductSpec[];
  description: string;
  features: string[];
  detailTabs?: ProductDetailTab[];
}

export const productBrands: ProductBrand[] = ['福艾德', '派克', '力士乐', '贺德克', '其他'];

export const products: Product[] = [
  {
    id: 'p-33m-placing-boom',
    name: '33米布料机液压站',
    model: 'HS-33M-PB',
    category: 'concrete-placing-boom',
    brand: '其他',
    price: 0,
    rating: 5.0,
    sales: 0,
    createdAt: '2024-03-22',
    image: '/images/products/33米布料机液压站/1.jpg',
    images: Array.from({ length: 17 }, (_, i) => `/images/products/33米布料机液压站/${i + 1}.jpg`),
    specs: [
      { label: '适配臂架长度', value: '33米' },
      { label: '系统类型', value: '布料机专用液压站' },
      { label: '应用领域', value: '工程机械、混凝土浇筑' },
    ],
    description: '提供专业的混凝土楼面布料机全系统解决方案，集液压系统、电控系统、液压油缸于一体，完美实现布料机的各项功能。',
    features: ['全套一体化设计', '23年制造经验', '系统专项优化', '智能电控技术', '全环境适应性'],
    detailTabs: [
      {
        title: '产品概述',
        content: `
我们提供专业的混凝土楼面布料机全系统解决方案，集液压系统、电控系统、液压油缸于一体，完美实现布料机的各项功能。

### 核心优势

1. **全套一体化设计** - 专为混凝土布料机量身定制，包含液压系统、电控系统、液压油缸、回转过电环模块（选配）
2. **23年制造经验** - 专业液压油缸制造厂家，混凝土泵送主油缸市场占有量全国领先
3. **系统专项优化** - 液压系统针对不同型号布料机进行专项优化，配置高、动力强劲、可靠性卓越
4. **智能电控技术** - 专门为布料机开发的电控系统，确保动作精准执行，配备多重保护线路
5. **全环境适应性** - 液压泵站自带防雨棚，电控箱采用不锈钢箱体，适应各种室外施工环境
6. **人性化操作** - 所有型号配备无线/有线遥控器，高端型号可选肩式一体遥控器
7. **自动温控系统** - 温度达到设定值自动启停风冷却器，确保系统稳定运行
        `
      },
      {
        title: '技术参数',
        content: `
### 液压系统技术参数

| 型号 | 17/21M-3RM | 17/21M-3RH | 33M-3RM | 33M-4RM | 33M-4RH | 36M-4RH |
|------|------------|------------|----------|----------|----------|----------|
| **电源** | 380V/50Hz/60Hz | 380V/50Hz/60Hz | 380V/50Hz/60Hz | 380V/50Hz/60Hz | 380V/50Hz/60Hz | 380V/50Hz/60Hz |
| **功率** | 5.5KW | 5.5KW | 18.5KW | 22KW | 22KW | 22KW |
| **系统压力** | 30Mpa | 30Mpa | 30Mpa | 30Mpa | 30Mpa | 30Mpa |
| **油箱容积** | 120L | 120L | 140L | 175L | 175L | 175L |
| **系统流量** | 11L/min | 11L/min | 26L/min | 36L/min | 36L/min | 36L/min |
| **风机功率** | 200W | 200W | 300W | 300W | 300W | 300W |
| **主阀品牌** | 力士乐乐卓 | 力士乐乐卓 | 力度克/海德罗斯 | 力度克/海德罗斯 | 力度克/海德罗斯 | 力度克/海德罗斯 |
| **控制阀类型** | 国产电磁阀组 | 进口电磁阀组 | 进口电磁阀组 | 进口电磁阀组 | 进口多路阀 | 进口多路阀 |
| **控制方式** | 开关量控制 | 开关量控制 | 开关量控制 | 比例量控制 | 比例量控制 | 比例量控制 |

**臂架油缸规格：**
- 缸径：100-220mm
- 杆径：75-130mm 
- 行程：500-1800mm

### 电控系统技术参数

| 型号 | 17/21M-3RM-DK | 17/21M-3RH-DK | 33M-3RM-DK | 33M-4RM-DK | 33M-4RH-DK | 36M-4RH-DK |
|------|---------------|---------------|-------------|-------------|-------------|-------------|
| **主回路电压** | 三相380VAC/50Hz | 三相380VAC/50Hz | 三相380VAC/50Hz | 三相380VAC/50Hz | 三相380VAC/50Hz | 三相380VAC/50Hz |
| **控制回路电压** | 单相220VAC & 24VDC | 单相220VAC & 24VDC | 单相220VAC & 24VDC | 单相220VAC & 24VDC | 单相220VAC & 24VDC | 单相220VAC & 24VDC |
| **控制模式** | 面板/有线/无线遥控 | 面板/有线/无线遥控 | 面板/有线/无线遥控 | 面板/有线/无线遥控 | 面板/无线遥控 | 面板/无线遥控 |
| **控制方式** | 继电器控制，24VDC/8A | 继电器控制，24VDC/8A | 继电器控制，24VDC/8A | 继电器控制，24VDC/9A | 控制器+触摸屏 | 控制器+触摸屏 |
| **急停功能** | 有 | 有 | 有 | 有 | 有 | 有 |
| **短路/过载保护** | 有 | 有 | 有 | 有 | 有 | 有 |
| **元器件品牌** | 施耐德/霍尼韦尔 | 施耐德/霍尼韦尔 | 施耐德/霍尼韦尔 | 施耐德/霍尼韦尔 | 施耐德/霍尼韦尔 | 施耐德/霍尼韦尔 |
| **无线遥控品牌** | 禹鼎 | 禹鼎 | 禹鼎 | 禹鼎 | 欧姆 | 欧姆 |
| **整机尺寸** | 550×750×250mm | 550×750×250mm | 550×750×250mm | 550×750×250mm | 550×750×250mm | 550×750×250mm |
| **整机重量** | 50Kg | 50Kg | 50Kg | 50Kg | 50Kg | 50Kg |
| **安装方式** | 壁挂式 | 壁挂式 | 壁挂式 | 壁挂式 | 壁挂式 | 壁挂式 |
        `
      },
      {
        title: '产品特点',
        content: `
### 液压系统特点
- **配置灵活**：可选用比例多路阀，控制精度更高
- **优质元件**：采用优质国产或进口液压元件，性价比高
- **稳定耐用**：经久耐用，维护方便，可靠性强
- **环境适应**：自带防雨棚，适应室外作业环境

### 电控系统特点 
- **专业开发**：专门为布料机定制开发
- **多重控制**：支持面板、有线、无线多种控制方式
- **安全可靠**：配备急停、短路、过载等多重保护
- **防护设计**：不锈钢箱体+防雨罩，适应恶劣环境

### 独特优势
- **回转过电环模块**：独有的技术设计
- **自动温控系统**：智能温度管理，节能高效
- **人性化遥控**：肩式无线/有线一体遥控器可选
- **紧凑设计**：整体美观大方，占用空间小

## 适用机型

- 行走式混凝土布料机
- 内爬式混凝土布料机
- 顶升式混凝土布料机
- 各类楼面施工布料设备

## 服务支持

基于23年专业制造经验，我们提供：
- 全系统解决方案定制
- 专业技术咨询与服务
- 完善的售后支持体系
- 持续的技术升级服务
        `
      },
      {
        title: '产品资料',
        content: '产品宣传册、简介与选型指南',
        type: 'file',
        fileUrl: '/images/products/33米布料机液压站/产品简介.pptx'
      }
    ]
  },
  {
    id: 'p-mine-truck-valve',
    name: '矿卡专用控制阀组',
    model: 'HS-MT-VALVE',
    category: 'mine-truck',
    brand: '其他',
    price: 0,
    rating: 5.0,
    sales: 0,
    createdAt: '2024-03-22',
    image: '/images/products/矿卡专用控制阀组/转向对中举升阀组.png',
    images: [
      '/images/products/矿卡专用控制阀组/转向对中举升阀组.png',
      '/images/products/矿卡专用控制阀组/制动阀组.png'
    ],
    specs: [
      { label: '阀体材料', value: '高强度阀体，表面镀锌镍' },
      { label: '系统集成', value: '比例多路阀与开关阀组合' },
      { label: '控制方式', value: '电液比例控制 / CAN总线' },
    ],
    description: '专为矿用卡车设计的集成控制阀组，包含转向对中举升阀组和制动阀组。具备耐高压、抗污染、防腐耐磨等特性，适应极端工况。',
    features: ['模块化紧凑设计', '冗余安全设计', '一线品牌元件', '支持CAN总线诊断'],
    detailTabs: [
      {
        title: '产品简介',
        content: `
### 矿卡专用控制阀组

- 高强度阀体材料，表面镀锌镍，耐高压，抗污染能力强，可耐受高低温，防腐耐磨；
- 采用新型密封工艺，适应高压和频繁冲击；
- 模块化设计，通过比例多路阀与开关阀组合集成的方式，减少外部管路，布局更加紧凑，关键部位采用冗余设计，提升可靠性；
- 安全保障：可通过溢流阀或压力传感器实现系统压力限制。在断电或故障时，通过手动泄压阀或蓄能器保持基本制动能力。集成压力传感器、流量传感器，配合控制器实现实时监测与报警；
- 所有阀件均采用国际一线品牌，可通过电液比例阀与车辆控制器（VCU）通信，实现精准控制；
- 集成传感器数据可与CAN总线通信，实现远程监控和故障诊断（选配）。

### 包含组件
- **转向对中举升阀组**
- **制动阀组**
        `
      }
    ]
  },
  {
    id: 'p-manifold-block',
    name: '组合阀组',
    model: 'HS-MANIFOLD',
    category: 'manifold-block',
    brand: '其他',
    price: 0,
    rating: 5.0,
    sales: 0,
    createdAt: '2024-03-22',
    image: '/images/products/组合阀组/1.png',
    images: [
      '/images/products/组合阀组/1.png',
      '/images/products/组合阀组/2.png',
      '/images/products/组合阀组/3.png'
    ],
    specs: [
      { label: '系统定位', value: '液压系统集成控制单元' },
      { label: '流道设计', value: 'CFD软件优化' },
      { label: '服务模式', value: '量身定制解决方案' },
    ],
    description: '作为液压系统中的集成控制单元，旨在提升整体系统控制的集成性、紧凑性，减少管路连接和漏油风险。',
    features: ['高集成性', 'CFD流道优化', '量身定制', '应用广泛'],
    detailTabs: [
      {
        title: '产品简介',
        content: `
### 组合阀组

- 作为液压系统中的集成控制单元，旨在提升整体系统控制的集成性、紧凑性，减少管路连接和漏油风险；
- 通过CFD软件优化阀块内部流道，减少紊流和压降；
- 为客户提供量身定制的创新解决方案。

### 应用主机
- 履带式起重机 / 蜘蛛吊等工程机械设备
- 高空作业平台等设备
        `
      }
    ]
  }
];
