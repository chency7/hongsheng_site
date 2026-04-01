import React from 'react';

type OrganizationSchemaProps = {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  address?: {
    street?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  };
  contactPoint?: {
    telephone?: string;
    contactType?: string;
    email?: string;
  };
};

type LocalBusinessSchemaProps = OrganizationSchemaProps & {
  priceRange?: string;
  areaServed?: string[];
};

type ProductSchemaProps = {
  name: string;
  description?: string;
  image?: string;
  brand?: string;
  category?: string;
};

type BreadcrumbSchemaProps = {
  items: Array<{
    name: string;
    url: string;
  }>;
};

export function OrganizationSchema({
  name = '湖南协力鸿胜机械有限公司',
  url = 'https://www.xl-honsun.com',
  logo = 'https://www.xl-honsun.com/images/hs/logo.png',
  description = '专注液压系统与电控系统的设计、研发与制造，提供定制化、智能化、一站式系统解决方案。',
  address = {
    city: '长沙市',
    region: '湖南省',
    country: '中国',
  },
  contactPoint = {
    telephone: '+86-731-88888888',
    contactType: 'customer service',
    email: 'contact@xl-honsun.com',
  },
}: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: address.city,
      addressRegion: address.region,
      addressCountry: address.country,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: contactPoint.telephone,
      contactType: contactPoint.contactType,
      email: contactPoint.email,
    },
    sameAs: ['https://www.xl-honsun.com'],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LocalBusinessSchema({
  name = '湖南协力鸿胜机械有限公司',
  url = 'https://www.xl-honsun.com',
  logo = 'https://www.xl-honsun.com/images/hs/logo.png',
  description = '液压系统与电控系统设计、研发与制造',
  address = {
    city: '长沙市',
    region: '湖南省',
    country: '中国',
  },
  contactPoint = {
    telephone: '+86-731-88888888',
    contactType: 'sales',
  },
  priceRange = '$$',
  areaServed = ['工程机械', '船舶海洋', '风力发电', '轨道交通'],
}: LocalBusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': url,
    name,
    url,
    logo,
    description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: address.city,
      addressRegion: address.region,
      addressCountry: address.country,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: contactPoint.telephone,
      contactType: contactPoint.contactType,
    },
    priceRange,
    areaServed: areaServed.map((area) => ({
      '@type': 'AdministrativeArea',
      name: area,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductSchema({
  name,
  description,
  image,
  brand = '湖南协力鸿胜',
  category = '液压系统',
}: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    category,
    manufacturer: {
      '@type': 'Organization',
      name: '湖南协力鸿胜机械有限公司',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://www.xl-honsun.com${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebPageSchema({
  name,
  description,
  url,
}: {
  name: string;
  description?: string;
  url: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: '湖南协力鸿胜机械有限公司',
      url: 'https://www.xl-honsun.com',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ServiceSchema({
  name,
  description,
  serviceType,
  areaServed,
}: {
  name: string;
  description?: string;
  serviceType: string;
  areaServed?: string[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType,
    provider: {
      '@type': 'Organization',
      name: '湖南协力鸿胜机械有限公司',
      url: 'https://www.xl-honsun.com',
    },
    areaServed: areaServed?.map((area) => ({
      '@type': 'AdministrativeArea',
      name: area,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
