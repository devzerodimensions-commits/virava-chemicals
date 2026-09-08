/**
 * HPL Additives, Oriental Carbon & Chemicals and The Standard Chemicals Co.,
 * transcribed from the client's "Godrej Products-2.xlsx" — sheets 3, 4 and 5.
 * Godrej lives in godrej-catalogue.js and is deliberately not touched here.
 *
 * Two things in the source worth knowing:
 *
 *  - The HPL sheet lists "Kinox 68" twice, once under Phenolics and once under
 *    Phosphites. Both are kept, distinguished by type, because a phenolic and a
 *    phosphite are genuinely different products — but one of those numbers may
 *    be a slip in the sheet and is worth confirming with the client.
 *  - That second entry reads "Senondary Antioxidants". Corrected to "Secondary"
 *    rather than published with the typo.
 *
 * The OCCL and Standard sheets give a single product each and no categories, so
 * those go into each principal's existing category rather than inventing one.
 */

export const PRINCIPAL_SHEETS = [
  {
    principal: 'hpl-additives-limited',
    image: '/img/categories/hpl-products.webp',
    categories: [
      {
        slug: 'hpl-polymerization-catalysts',
        name: 'Polymerization Catalysts',
        tagline: 'Initiators for polymer manufacture',
        description: 'Azo initiators for polymerisation, in water- and solvent-soluble grades.',
        products: [
          { n: 'AZPH', d: 'Water-soluble polymerization catalyst.' },
          { n: 'AZIM', d: 'Water-soluble polymerization catalyst.' },
          { n: 'AZDN', d: 'Solvent-soluble polymerization catalyst.' },
        ],
      },
      {
        slug: 'hpl-blowing-agents',
        name: 'Chemical Blowing Agents & Activators',
        tagline: 'Foaming agents for rubber and plastics',
        description: 'Mikrofine blowing agents and activators for foamed rubber and plastic products.',
        products: [
          { n: 'Mikrofine ADC H5', d: 'Azodicarbonamide blowing agent.' },
          { n: 'Mikrofine ADC 4075', d: 'Azodicarbonamide blowing agent.' },
          { n: 'Mikrofine 7500', d: 'Chemical blowing agent.' },
          { n: 'Mikrofine 7800', d: 'Chemical blowing agent.' },
          { n: 'Mikrofine 5200', d: 'Chemical blowing agent.' },
          { n: 'Mikrofine 5145', d: 'Chemical blowing agent.' },
          { n: 'Mikrofine ADC RM1', d: 'Azodicarbonamide blowing agent.' },
          { n: 'Mikrofine OBSH', d: 'OBSH blowing agent.' },
          { n: 'Mikrofine ADC F5', d: 'Azodicarbonamide blowing agent.' },
        ],
      },
      {
        slug: 'hpl-antioxidants',
        name: 'Antioxidants',
        tagline: 'Primary and secondary stabilisers',
        description: 'Kinox primary phenolic and secondary phosphite antioxidants for polymers and rubber.',
        products: [
          { n: 'Kinox 10', d: 'Primary antioxidant — phenolic.' },
          { n: 'Kinox 76', d: 'Primary antioxidant — phenolic.' },
          { n: 'Kinox 30', d: 'Primary antioxidant — phenolic.' },
          { n: 'Kinox 34', d: 'Primary antioxidant — phenolic.' },
          { n: 'Kinox 98', d: 'Primary antioxidant — phenolic.' },
          { n: 'Kinox 68 (Phenolic)', d: 'Secondary antioxidant — phenolic.' },
          { n: 'Kinox 28', d: 'Secondary antioxidant — phosphite.' },
          { n: 'Kinox 68 (Phosphite)', d: 'Secondary antioxidant — phosphite.' },
        ],
      },
    ],
  },

  {
    principal: 'oriental-carbon-and-chemicals-limited',
    image: '/img/categories/occl-products.webp',
    categories: [
      {
        // the principal's existing category — reused rather than replaced
        slug: 'occl-products',
        name: 'OCCL Products',
        tagline: 'Insoluble sulphur for tyre and rubber',
        description: 'Insoluble sulphur grades for the tyre and rubber industries.',
        products: [
          { n: 'Diamond Sulf OT - 20', d: 'Insoluble sulphur for rubber vulcanisation.' },
        ],
      },
    ],
  },

  {
    principal: 'the-standard-chemicals-co-pvt-ltd',
    image: '/img/categories/std-products.webp',
    categories: [
      {
        slug: 'std-products',
        name: 'Standard Chemicals Products',
        tagline: 'Rubber maker’s sulphur',
        description: 'Sulphur powder for the manufacture of rubber products.',
        products: [
          {
            n: 'Sulphur Powder Tyre Brand',
            // the sheet's own description, quoted as written
            d: 'Tyre Brand Sulphur Powder is a quality product used as the vulcanising agent in the '
              + 'manufacture of rubber products. It is manufactured keeping a number of parameters such as '
              + 'ash, acidity, moisture and particle size carefully monitored to ensure superior quality of '
              + 'sulphur powder. Tyre Brand Rubber Maker’s Sulphur Powder is recommended for improved '
              + 'production and quality of end product.',
          },
        ],
      },
    ],
  },
];
