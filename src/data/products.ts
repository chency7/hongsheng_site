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
      { id: 'excavator', name: '挖掘机液压件' },
      { id: 'crane', name: '起重机液压站' },
      { id: 'loader', name: '装载机系统' },
    ],
  },
  {
    id: 'railway',
    name: '轨道交通',
    subCategories: [
      { id: 'brake', name: '制动系统测试台' },
      { id: 'suspension', name: '悬挂系统液压件' },
    ],
  },
  {
    id: 'marine',
    name: '船舶海洋',
    subCategories: [
      { id: 'steering', name: '舵机液压系统' },
      { id: 'deck', name: '甲板机械泵站' },
    ],
  },
  {
    id: 'wind',
    name: '风力发电',
    subCategories: [
      { id: 'pitch', name: '变桨液压系统' },
      { id: 'yaw', name: '偏航制动器' },
    ],
  },
  {
    id: 'aerospace',
    name: '航空航天',
    subCategories: [
      { id: 'test-bench', name: '伺服测试台' },
      { id: 'flight-control', name: '飞控液压组件' },
    ],
  },
  {
    id: 'manufacturing',
    name: '工业制造',
    subCategories: [
      { id: 'press', name: '压机液压站' },
      { id: 'automation', name: '自动化液压控制' },
    ],
  },
];

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  model: string;
  category: ProductCategory;
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
}

export const productBrands: ProductBrand[] = ['福艾德', '派克', '力士乐', '贺德克', '其他'];

export const products: Product[] = [
  {
    id: 'p1',
    name: '标准伺服油缸',
    model: 'FYD-50',
    category: 'excavator',
    brand: '福艾德',
    price: 12800,
    rating: 4.5,
    sales: 120,
    createdAt: '2023-10-01',
    image: '/images/products/cylinder.jpg',
    images: ['/images/products/cylinder.jpg', '/images/products/cylinder-2.jpg'],
    specs: [
      { label: '缸径', value: '40-250mm' },
      { label: '行程', value: '50-2000mm' },
      { label: '额定压力', value: '21MPa' },
    ],
    description: '适用于通用液压系统的标准伺服油缸，具备高精度定位与长寿命密封设计，广泛应用于工程机械与自动化产线。',
    features: ['高精度位置反馈', '进口密封件保障寿命', '低摩擦设计', '可定制安装方式'],
  },
  {
    id: 'p2',
    name: '高压齿轮泵',
    model: 'GHP-2',
    category: 'crane',
    brand: '力士乐',
    price: 3500,
    rating: 4.8,
    sales: 300,
    createdAt: '2023-11-15',
    image: '/images/products/pump.jpg',
    images: ['/images/products/pump.jpg'],
    specs: [
      { label: '排量', value: '4-30 cc/rev' },
      { label: '最高压力', value: '25MPa' },
      { label: '转速', value: '3000 rpm' },
    ],
    description: '高性能外啮合齿轮泵，结构紧凑，噪音低，适用于各类行走机械和工业液压系统。',
    features: ['低噪音', '高容积效率', '耐用铸铁壳体'],
  },
  {
    id: 'p3',
    name: '比例伺服阀',
    model: 'SV-10',
    category: 'brake',
    brand: '派克',
    price: 25000,
    rating: 4.9,
    sales: 45,
    createdAt: '2024-01-20',
    image: '/images/products/valve.jpg',
    images: ['/images/products/valve.jpg'],
    specs: [
      { label: '额定流量', value: '10-40 L/min' },
      { label: '频响', value: '100Hz' },
      { label: '滞环', value: '<0.5%' },
    ],
    description: '直动式高频响比例伺服阀，带内置位移传感器，实现精密流量和压力控制。',
    features: ['高动态响应', '零遮盖阀芯', '集成数字放大器'],
  },
  {
    id: 'p4',
    name: '压力传感器',
    model: 'PT-400',
    category: 'steering',
    brand: '贺德克',
    price: 1200,
    rating: 4.7,
    sales: 500,
    createdAt: '2023-08-10',
    image: '/images/products/sensor.jpg',
    images: ['/images/products/sensor.jpg'],
    specs: [
      { label: '量程', value: '0-400 bar' },
      { label: '输出信号', value: '4-20mA' },
      { label: '精度', value: '0.5% FS' },
    ],
    description: '紧凑型工业压力变送器，抗冲击和振动能力强，不锈钢外壳。',
    features: ['全焊接结构', '抗干扰性强', '防护等级IP67'],
  },
  {
    id: 'p5',
    name: '可编程逻辑控制器',
    model: 'PLC-S7',
    category: 'automation',
    brand: '其他',
    price: 5800,
    rating: 4.6,
    sales: 210,
    createdAt: '2023-12-05',
    image: '/images/products/controller.jpg',
    images: ['/images/products/controller.jpg'],
    specs: [
      { label: '输入/输出', value: '14DI/10DO' },
      { label: '通讯接口', value: 'PROFINET' },
      { label: '运行内存', value: '100KB' },
    ],
    description: '紧凑型高级控制器，适合中小型自动化设备的逻辑和运动控制。',
    features: ['集成以太网口', '支持高速计数', '丰富的扩展模块'],
  },
];
