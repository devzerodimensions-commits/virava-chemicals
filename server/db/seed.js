import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { pool, query } from '../src/db.js';

dotenv.config();

const slug = (s) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// ---------------------------------------------------------------- categories
const categories = [
  { name: 'Fatty Alcohols', tagline: 'C8–C18 natural & synthetic alcohols',
    image: '/img/pro1.jpg',
    description: 'Natural and synthetic fatty alcohols used as emollients, emulsifiers and intermediates across personal care, detergents and industrial applications.' },
  { name: 'Fatty Acids', tagline: 'Distilled & fractionated acids',
    image: '/img/pro2.jpg',
    description: 'A complete range of saturated and unsaturated fatty acids for rubber, plastics, cosmetics, candles and lubricant industries.' },
  { name: 'Surfactants', tagline: 'Anionic, non-ionic & amphoteric',
    image: '/img/pro3.jpg',
    description: 'High-performance surfactants for detergents, personal care, textiles and industrial cleaning formulations.' },
  { name: 'Glycerine', tagline: 'Refined IP / BP / USP grades',
    image: '/img/pro4.jpg',
    description: 'Refined vegetable glycerine of pharmaceutical and technical grade for pharma, food, cosmetics and industrial use.' },
  { name: 'Oleo Derivatives & Specialty Chemicals', tagline: 'Esters, amines & specialty blends',
    image: '/img/banner3.jpg',
    description: 'Value-added oleochemical derivatives — esters, amines, GMS and specialty chemicals engineered for specific industrial performance.' },
  { name: 'HPL Products', tagline: 'HPL Additives — polymer & rubber additives',
    image: '/img/industries/2.jpg',
    description: 'Antioxidants, accelerators and additives from HPL Additives Limited for the rubber, plastics and polymer industries.' },
  { name: 'OCCL Products', tagline: 'Oriental Carbon — insoluble sulphur',
    image: '/img/industries/15.jpg',
    description: 'Insoluble sulphur and specialty products from Oriental Carbon & Chemicals Limited, primarily for the tyre and rubber industry.' },
  { name: 'STD Products', tagline: 'The Standard Chemicals range',
    image: '/img/about.jpg',
    description: 'Specialty chemicals from The Standard Chemicals Co. Pvt. Ltd. serving a broad spectrum of industries.' },
];

// ---------------------------------------------------------------- products
// { c: category name, n: name, cas, grade, pack, desc }
const products = [
  // Fatty Alcohols
  { c: 'Fatty Alcohols', n: 'Lauryl Alcohol (C12)', cas: '112-53-8', grade: 'Cosmetic / Technical', pack: '160 kg drums', desc: 'C12 fatty alcohol used as an emollient and intermediate for surfactant manufacture.' },
  { c: 'Fatty Alcohols', n: 'Cetyl Alcohol (C16)', cas: '36653-82-4', grade: 'IP / Cosmetic', pack: '25 kg bags', desc: 'Waxy C16 alcohol used as a thickener and emollient in creams and lotions.' },
  { c: 'Fatty Alcohols', n: 'Stearyl Alcohol (C18)', cas: '112-92-5', grade: 'IP / Cosmetic', pack: '25 kg bags', desc: 'C18 fatty alcohol used as an emulsion stabiliser and opacifier.' },
  { c: 'Fatty Alcohols', n: 'Cetostearyl Alcohol', cas: '67762-27-0', grade: 'IP / BP', pack: '25 kg bags', desc: 'A blend of cetyl and stearyl alcohols widely used in pharmaceutical and cosmetic emulsions.' },
  { c: 'Fatty Alcohols', n: 'Oleyl Alcohol', cas: '143-28-2', grade: 'Cosmetic', pack: '180 kg drums', desc: 'Unsaturated fatty alcohol used as an emollient and carrier in personal care.' },

  // Fatty Acids
  { c: 'Fatty Acids', n: 'Stearic Acid', cas: '57-11-4', grade: 'Rubber / Cosmetic', pack: '25 kg bags', desc: 'Versatile saturated fatty acid used in rubber, cosmetics, candles and lubricants.' },
  { c: 'Fatty Acids', n: 'Oleic Acid', cas: '112-80-1', grade: 'Technical / Cosmetic', pack: '190 kg drums', desc: 'Unsaturated fatty acid used in soaps, lubricants, textiles and intermediates.' },
  { c: 'Fatty Acids', n: 'Palmitic Acid', cas: '57-10-3', grade: 'Technical', pack: '25 kg bags', desc: 'Saturated C16 fatty acid used in surfactants, cosmetics and candles.' },
  { c: 'Fatty Acids', n: 'Lauric Acid', cas: '143-07-7', grade: 'Technical', pack: '25 kg bags', desc: 'C12 fatty acid used in soaps, detergents and personal care.' },
  { c: 'Fatty Acids', n: 'Distilled Fatty Acid', cas: '', grade: 'Industrial', pack: 'Bulk / drums', desc: 'Distilled vegetable fatty acids for a wide range of industrial applications.' },

  // Surfactants
  { c: 'Surfactants', n: 'Sodium Lauryl Ether Sulphate (SLES)', cas: '9004-82-4', grade: '70% / 28%', pack: '220 kg drums', desc: 'Primary anionic surfactant for shampoos, hand-wash and liquid detergents.' },
  { c: 'Surfactants', n: 'Sodium Lauryl Sulphate (SLS)', cas: '151-21-3', grade: 'Needle / Powder', pack: '25 kg bags', desc: 'High-foaming anionic surfactant for personal care and cleaning products.' },
  { c: 'Surfactants', n: 'Cocamidopropyl Betaine (CAPB)', cas: '61789-40-0', grade: '30% active', pack: '220 kg drums', desc: 'Mild amphoteric surfactant and foam booster for personal care formulations.' },
  { c: 'Surfactants', n: 'Cocamide DEA', cas: '68603-42-9', grade: 'Technical', pack: '215 kg drums', desc: 'Non-ionic foam stabiliser and viscosity builder for detergents.' },

  // Glycerine
  { c: 'Glycerine', n: 'Refined Glycerine IP', cas: '56-81-5', grade: '99.5% IP', pack: '250 kg drums', desc: 'Pharmaceutical grade refined glycerine for pharma, food and cosmetic use.' },
  { c: 'Glycerine', n: 'Refined Glycerine USP/BP', cas: '56-81-5', grade: '99.7% USP/BP', pack: '250 kg drums', desc: 'High purity glycerine meeting USP and BP pharmacopoeia standards.' },
  { c: 'Glycerine', n: 'Technical Glycerine', cas: '56-81-5', grade: 'Technical', pack: '250 kg drums', desc: 'Industrial grade glycerine for technical and manufacturing applications.' },

  // Oleo Derivatives
  { c: 'Oleo Derivatives & Specialty Chemicals', n: 'Glyceryl Monostearate (GMS)', cas: '31566-31-1', grade: 'SE / Non-SE', pack: '25 kg bags', desc: 'Emulsifier and stabiliser for food, cosmetics and plastics.' },
  { c: 'Oleo Derivatives & Specialty Chemicals', n: 'Isopropyl Myristate (IPM)', cas: '110-27-0', grade: 'Cosmetic', pack: '180 kg drums', desc: 'Light emollient ester used widely in cosmetics and personal care.' },
  { c: 'Oleo Derivatives & Specialty Chemicals', n: 'Isopropyl Palmitate (IPP)', cas: '142-91-6', grade: 'Cosmetic', pack: '180 kg drums', desc: 'Emollient ester providing a smooth, non-greasy feel in formulations.' },
  { c: 'Oleo Derivatives & Specialty Chemicals', n: 'Fatty Amines', cas: '', grade: 'Industrial', pack: 'Drums', desc: 'Oleochemical amines used in fabric softeners, flotation and asphalt additives.' },

  // HPL
  { c: 'HPL Products', n: 'Rubber Antioxidants', cas: '', grade: 'Industrial', pack: '25 kg bags', desc: 'Antioxidants from HPL Additives that protect rubber from thermal and oxidative ageing.' },
  { c: 'HPL Products', n: 'Rubber Accelerators', cas: '', grade: 'Industrial', pack: '25 kg bags', desc: 'Vulcanisation accelerators for the rubber and tyre industry.' },
  { c: 'HPL Products', n: 'Antidegradants', cas: '', grade: 'Industrial', pack: '25 kg bags', desc: 'Antidegradants and specialty additives for polymer processing.' },

  // OCCL
  { c: 'OCCL Products', n: 'Insoluble Sulphur', cas: '9035-99-8', grade: 'Regular / HS', pack: '25 kg bags', desc: 'Insoluble sulphur from Oriental Carbon & Chemicals for tyre and rubber vulcanisation.' },
  { c: 'OCCL Products', n: 'Sulphuric Acid Derivatives', cas: '', grade: 'Technical', pack: 'Bulk', desc: 'Specialty sulphur-based products for industrial applications.' },

  // STD
  { c: 'STD Products', n: 'Specialty Chemicals', cas: '', grade: 'Industrial', pack: 'As required', desc: 'A range of specialty chemicals from The Standard Chemicals Co. Pvt. Ltd.' },
  { c: 'STD Products', n: 'Industrial Intermediates', cas: '', grade: 'Industrial', pack: 'As required', desc: 'Chemical intermediates serving diverse manufacturing sectors.' },
];

// ---------------------------------------------------------------- principals
const principals = [
  { name: 'Godrej Industries Limited', logo: '/img/partners/logo1.png', website: 'https://www.godrejchemicals.com/',
    desc: 'A leader in oleo chemicals and Virava\'s flagship principal. Godrej Industries manufactures fatty alcohols, fatty acids, surfactants and glycerine of international quality.' },
  { name: 'HPL Additives Limited', logo: '/img/partners/logo2.png', website: '',
    desc: 'A leading manufacturer of rubber and polymer additives — antioxidants, accelerators and antidegradants.' },
  { name: 'Oriental Carbon & Chemicals Limited', logo: '/img/partners/logo3.png', website: '',
    desc: 'One of the world\'s leading manufacturers of insoluble sulphur for the tyre and rubber industry.' },
  { name: 'The Standard Chemicals Co. Pvt. Ltd.', logo: '/img/partners/logo4.png', website: '',
    desc: 'A trusted manufacturer of specialty chemicals serving a broad spectrum of industries.' },
];

// ---------------------------------------------------------------- industries
const industryNames = [
  'Plastics', 'Rubber', 'Textile & Textile Auxiliary', 'Pharmaceuticals',
  'Cosmetics & Personal Care', 'Detergent', 'Food Products', 'Pigments & Dyestuff',
  'Ink', 'Paints', 'Metal Polish', 'Waxes', 'Mineral Coating', 'Ceramics',
  'Metal Tubes', 'Aluminum Foils', 'Pesticides & Agro Chemicals', 'Lubricants',
  'Industrial Surfactants', 'Construction',
];

// ---------------------------------------------------------------- hero slides
const heroSlides = [
  { title: 'The Most Trusted Name in Industrial Chemicals',
    subtitle: 'Reputed & award-winning brand serving the industrial world of India since 1997.',
    image: '/img/banner3.jpg', cta_text: 'Explore Our Products', cta_link: '/products' },
  { title: 'Exclusive Distributors of Godrej Oleo Chemicals',
    subtitle: 'A valued business partner of Godrej Industries Ltd — a leader in oleo chemicals.',
    image: '/img/banner1.jpg', cta_text: 'Our Principals', cta_link: '/about' },
  { title: 'Quality, Service & Transparency for Three Generations',
    subtitle: 'Fatty alcohols, fatty acids, surfactants, glycerine & specialty chemicals.',
    image: '/img/banner4.jpg', cta_text: 'Get in Touch', cta_link: '/contact' },
];

// ---------------------------------------------------------------- blogs
const blogs = [
  {
    title: 'Understanding Fatty Alcohols and Their Industrial Applications',
    category: 'Oleochemicals', author: 'Virava Team', image: '/img/pro1.jpg',
    date: '2026-07-12',
    excerpt: 'From C8 to C18, fatty alcohols are the backbone of countless products — surfactants, emulsifiers and emollients. Here is how each range is used across industries.',
    content: 'Fatty alcohols are aliphatic alcohols derived from natural fats and oils. They serve as key intermediates in the manufacture of surfactants, and as emollients and consistency agents in personal care and industrial formulations. This guide walks through the common C12–C18 ranges and their applications.',
  },
  {
    title: 'Glycerine Grades Explained: IP, BP, USP and Technical',
    category: 'Products', author: 'Virava Team', image: '/img/pro4.jpg',
    date: '2026-06-24',
    excerpt: 'Choosing the right glycerine grade matters for pharma, food and industrial use. We break down the differences between refined and technical glycerine.',
    content: 'Glycerine is one of the most versatile oleochemicals, used in pharmaceuticals, food, cosmetics and a wide range of industrial applications. The right grade — IP, BP, USP or technical — depends on purity requirements and end-use. This article explains how to select the correct grade.',
  },
  {
    title: 'Why Godrej Oleo Chemicals Are Trusted Across Industries',
    category: 'Industry', author: 'Virava Team', image: '/img/banner1.jpg',
    date: '2026-05-30',
    excerpt: 'As the exclusive distributor of Godrej Industries Ltd, Virava supplies world-class oleo chemicals. Here is what sets them apart on quality and consistency.',
    content: 'Godrej Industries Ltd is a leader in oleo chemicals, manufacturing fatty alcohols, fatty acids, surfactants and glycerine of international quality. As their valued business partner, Virava Chemicals brings this quality and consistency to industries across India.',
  },
];

// ---------------------------------------------------------------- settings
const settings = {
  company_name: 'Virava Chemicals',
  tagline: 'The Most Trusted, Reputed & Award Winning Brand Serving the Industrial World of India',
  established: '1997',
  founder: 'Mr. Siddharth S. Shah',
  about_short: 'Virava Chemicals is a closely held partnership firm and an agency house serving the industrial world with quality products from reputed manufacturers for more than five decades.',
  about_full: 'Virava Chemicals is committed towards quality service and transparency with its customers and principals. Determined with direction since three generations, Virava has achieved goodwill and a reputable position in various industries. We are a valued business partner of Godrej Industries Ltd, a leader in oleo chemicals, and also represent other renowned manufacturers of the country as our principals.',
  address: "402 'Arista' - The Business Hub, Above Pantaloons, Nr. Madhur Hall, Anand Nagar Road, Satellite, Ahmedabad - 380015",
  phone1: '+91-079-29708697',
  phone2: '+91-079-29708688',
  email: 'viravachemicals@gmail.com',
  stat_experience: '50',
  stat_awards: '35',
  stat_customers: '3000',
  map_embed: 'https://www.google.com/maps?q=Arista+The+Business+Hub+Satellite+Ahmedabad&output=embed',
  facebook: '', linkedin: '', twitter: '',
};

export async function run(closePool = true) {
  console.log('Seeding Virava Chemicals database...');
  await query(`TRUNCATE enquiries, products, categories, principals, industries, hero_slides, blogs, site_settings, admins RESTART IDENTITY CASCADE`);

  // categories
  const catId = {};
  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    const { rows } = await query(
      `INSERT INTO categories (slug, name, tagline, description, image_url, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [slug(c.name), c.name, c.tagline, c.description, c.image, i]
    );
    catId[c.name] = { id: rows[0].id, image: c.image };
  }

  // products
  let pi = 0;
  for (const p of products) {
    const cat = catId[p.c];
    await query(
      `INSERT INTO products (category_id, slug, name, description, cas_no, grade, packaging, image_url, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [cat.id, slug(p.n) + '-' + (++pi), p.n, p.desc, p.cas || '', p.grade || '',
       p.pack || '', cat.image, pi]
    );
  }

  // principals
  for (let i = 0; i < principals.length; i++) {
    const p = principals[i];
    await query(
      `INSERT INTO principals (slug, name, description, logo_url, website, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [slug(p.name), p.name, p.desc, p.logo, p.website, i]
    );
  }

  // industries
  for (let i = 0; i < industryNames.length; i++) {
    const n = industryNames[i];
    await query(
      `INSERT INTO industries (slug, name, image_url, sort_order)
       VALUES ($1,$2,$3,$4)`,
      [slug(n), n, `/img/industries/${i + 1}.jpg`, i]
    );
  }

  // hero slides
  for (let i = 0; i < heroSlides.length; i++) {
    const h = heroSlides[i];
    await query(
      `INSERT INTO hero_slides (title, subtitle, image_url, cta_text, cta_link, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [h.title, h.subtitle, h.image, h.cta_text, h.cta_link, i]
    );
  }

  // blogs
  for (let i = 0; i < blogs.length; i++) {
    const b = blogs[i];
    await query(
      `INSERT INTO blogs (slug, title, excerpt, content, category, author, image_url, published_at, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [slug(b.title), b.title, b.excerpt, b.content, b.category, b.author, b.image, b.date, i]
    );
  }

  // settings
  for (const [k, v] of Object.entries(settings)) {
    await query(
      `INSERT INTO site_settings (key, value) VALUES ($1,$2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [k, v]
    );
  }

  // admin
  const email = (process.env.ADMIN_EMAIL || 'admin@viravachemicals.com').toLowerCase();
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Virava@2026', 10);
  await query(
    `INSERT INTO admins (name, email, password_hash) VALUES ($1,$2,$3)`,
    [process.env.ADMIN_NAME || 'Virava Admin', email, hash]
  );

  console.log(`Seed complete:
  ${categories.length} categories, ${products.length} products,
  ${principals.length} principals, ${industryNames.length} industries,
  ${heroSlides.length} hero slides, ${Object.keys(settings).length} settings.
  Admin login -> ${email} / ${process.env.ADMIN_PASSWORD || 'Virava@2026'}`);

  if (closePool) await pool.end();
}

// Auto-run only when executed directly (node db/seed.js)
if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('/seed.js')) {
  run().catch((e) => { console.error(e); process.exit(1); });
}
