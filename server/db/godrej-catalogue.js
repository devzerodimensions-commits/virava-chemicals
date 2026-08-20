/**
 * Godrej catalogue, transcribed from the client's "Godrej Products.xlsx" (Sheet2).
 * This sheet is the authoritative list of what Virava actually distributes — it
 * supersedes the earlier data, which was read off godrejchemicals.com and
 * contained grades Virava does not sell.
 *
 * `slug` is stated explicitly rather than derived, so entries map onto the
 * categories that already exist instead of creating near-duplicates.
 *
 * Chemical names in `chem` come from Sheet1 where the sheet supplied one.
 * Bracketed descriptors keep the sheet's wording; obvious English slips in them
 * ("Needes") are corrected, but brand tokens are transcribed exactly as written
 * even where they look like typos — those are flagged for the client rather than
 * silently changed.
 */
export const GODREJ_CATALOGUE = [
  // ------------------------------------------------------------ Oleochemicals
  {
    slug: 'fatty-alcohols', name: 'Fatty Alcohols', solution: 'oleochemicals',
    image: '/img/categories/fatty-alcohols.jpg',
    tagline: 'Ginol range — cetyl, stearyl & cetostearyl',
    description: 'Natural fatty alcohols used as emollients, emulsifiers, thickeners and surfactant intermediates across personal care, detergents and industrial formulations.',
    products: [
      { n: 'Ginol 16 98%', chem: 'Cetyl Alcohol' },
      { n: 'Ginol 18 98%', chem: 'Stearyl Alcohol' },
      { n: 'Ginol 1618%', chem: 'Cetostearyl Alcohol' },
      { n: 'Ginol 1822', chem: 'Behenyl / Stearyl Alcohol blend' },
    ],
  },
  {
    slug: 'stearic-acids', name: 'Fatty Acids (Stearic Acid)', solution: 'oleochemicals',
    image: '/img/categories/stearic-acids.jpg',
    tagline: 'Hystric, Textric, Hytitre & Distric grades',
    description: 'Saturated long-chain fatty acids used in cosmetics, detergents, lubricants, rubber compounding and general industrial processing.',
    products: [
      { n: 'Hystric grade', chem: 'Stearic Acid' },
      { n: 'Textric grade', chem: 'Stearic Acid' },
      { n: 'Hytitre grade', chem: 'Stearic Acid' },
      { n: 'Distric grade', chem: 'Stearic Acid' },
    ],
  },
  {
    slug: 'glycerine', name: 'Glycerin', solution: 'oleochemicals',
    image: '/img/categories/glycerine.jpg',
    tagline: 'IP, BP, CP, USP & FSSAI grades',
    description: 'Refined vegetable glycerine across pharmacopoeial, chemically pure and food grades for pharmaceutical, food, cosmetic and industrial use.',
    products: [
      { n: 'Glycerin IP grade', chem: 'Glycerin' },
      { n: 'Glycerin BP grade', chem: 'Glycerin' },
      { n: 'Glycerin CP grade', chem: 'Glycerin' },
      { n: 'Glycerin USP grade', chem: 'Glycerin' },
      { n: 'Glycerin FSSAI grade', chem: 'Glycerin' },
    ],
  },

  // -------------------------------------------------------------- Surfactants
  {
    slug: 'alpha-olefin-sulfonate-aos', name: 'Sodium Alpha Olefin Sulfonate (AOS)',
    solution: 'surfactants', image: '/img/categories/surfactants.jpg',
    tagline: 'Liquid, paste, powder & needle forms',
    description: 'High-foaming anionic surfactant with good detergency and hard-water stability, supplied across liquid, paste, powder and needle forms.',
    products: [
      { n: 'AOS XL 46 (AOS Liquid)' }, { n: 'AOS L46 (AOS Liquid)' },
      { n: 'AOS P46 (AOS Paste)' }, { n: 'Ginasul 46P (AOS Powder)' },
      { n: 'Ginasul 46N (AOS Needles)' }, { n: 'Ginsaul 68N (AOS Needles)' },
    ],
  },
  {
    slug: 'sodium-lauryl-sulphate-sls', name: 'Sodium Lauryl Sulfate (SLS)',
    solution: 'surfactants', image: '/img/categories/surfactants.jpg',
    tagline: 'Ginopol range — liquid, paste, powder, needles',
    description: 'Primary anionic surfactant for personal care, toothpaste and cleaning formulations, supplied as liquid, paste, powder and needles.',
    products: [
      { n: 'Ginopol L24 (SLS Liquid)' }, { n: 'Ginopol P24 (SLS Paste)' },
      { n: 'Ginopol 24P (SLS Powder)' }, { n: 'Ginopol 24N (SLS Needles)' },
    ],
  },
  {
    slug: 'sodium-lauryl-ether-sulphate-sles', name: 'Sodium Lauryl Ether Sulfate (SLES)',
    solution: 'surfactants', image: '/img/categories/surfactants.jpg',
    tagline: 'Liquid & paste actives',
    description: 'The workhorse anionic surfactant for shampoos, hand wash and liquid detergents.',
    products: [
      { n: 'SLES L24 230 (SLES Liquid)', chem: 'Sodium Laureth Sulfate' },
      { n: 'SLES P24 (SLES Paste)', chem: 'Sodium Laureth Sulfate' },
    ],
  },
  {
    slug: 'mild-surfactants', name: 'Mild Surfactants', solution: 'surfactants',
    image: '/img/categories/surfactants.jpg',
    tagline: 'Betaines, amine oxides, sulfosuccinates & sarcosinates',
    description: 'Gentle secondary surfactants that build foam, boost mildness and improve the sensory profile of personal care cleansing systems.',
    products: [
      { n: 'Ginamide B (CAPB)', chem: 'Cocamidopropyl Betaine' },
      { n: 'Ginamide BI (CAPB)', chem: 'Cocamidopropyl Betaine' },
      { n: 'Ginamide AO (Lauryl Amine Oxide)', chem: 'Lauramine Oxide' },
      { n: 'Ginodet DLSS (Disodium Lauryl Sulfosuccinate)', chem: 'Disodium Lauryl Sulfosuccinate' },
      { n: 'Ginodet LSA (Sodium Lauryl Sulfoacetate)', chem: 'Sodium Lauryl Sulfoacetate' },
      { n: 'Ginamide CB (Cocobetaine)', chem: 'Cocamidopropyl Betaine' },
      { n: 'Nuramild HP LSL (Sodium Lauroyl Sarcosinate)', chem: 'Sodium Lauroyl Sarcosinate' },
      { n: 'Nuramild HP CGL (Sodium Cocoyl Glycinate)', chem: 'Sodium Cocoyl Glycinate' },
      { n: 'Ginoneos ALS', chem: 'Ammonium Lauryl Sulfate' },
    ],
  },

  // --------------------------------------------------------------- Speciality
  {
    slug: 'emulsifying-waxes', name: 'Emulsifying Waxes', solution: 'specialty-chemicals',
    image: '/img/categories/oleo-derivatives.jpg',
    tagline: 'Ginol EW & Ginowax ranges',
    description: 'Self-emulsifying wax systems that build stable emulsions and give body to creams and lotions.',
    products: [
      { n: 'Ginol EW 6820', chem: 'Emulsifying Wax' }, { n: 'Ginol EW68 S' },
      { n: 'Ginol EW91 S' }, { n: 'Ginol EW UNREK' },
      { n: 'Ginowax' }, { n: 'Ginowax GST' }, { n: 'Ginowax AO' },
    ],
  },
  {
    slug: 'emulsifiers-and-systems', name: 'Speciality Emulsifiers', solution: 'specialty-chemicals',
    image: '/img/categories/oleo-derivatives.jpg',
    tagline: 'Ginonic CSA, S & B series',
    description: 'Emulsifier systems for oil-in-water and water-in-oil emulsions across personal care and industrial formulations.',
    products: [
      { n: 'Ginonic CSA 10' }, { n: 'Ginonic CSA 20', chem: 'CM 1000' },
      { n: 'Ginonic CSA 25' }, { n: 'Ginonic CSA 30' }, { n: 'Ginonic CSA 50' },
      { n: 'Ginonic CSA 80' }, { n: 'Ginonic S2' }, { n: 'Ginonic S20' },
      { n: 'Ginonic S21' }, { n: 'Ginonic B20' }, { n: 'Ginonic B30' },
    ],
  },
  {
    slug: 'esters-and-emollients', name: 'Esters', solution: 'specialty-chemicals',
    image: '/img/categories/oleo-derivatives.jpg',
    tagline: 'Gincol range — emollient & speciality esters',
    description: 'Ester emollients delivering spreadability, sensory feel and solubilising performance in personal care.',
    products: [
      { n: 'Gincol IPM (Iso Propyl Myristate)', chem: 'Isopropyl Myristate' },
      { n: 'Gincol IPP (Iso Propyl Palmitate)', chem: 'Isopropyl Palmitate' },
      { n: 'Gincol CSO (Cetearyl Octanoate)', chem: 'Cetearyl Ethylhexanoate' },
      { n: 'Gincol CP (Cetyl Palmitate)', chem: 'Cetyl Palmitate' },
      { n: 'Gincol EHP (Ethyl Hexyl Palmitate)', chem: 'Ethylhexyl Palmitate' },
      { n: 'Gincol IHS (Isopropyl Hydroxy Stearate)', chem: 'Isopropyl Hydroxystearate' },
      { n: 'Gincol TDS (Tri Decyl Salicylate)', chem: 'Tridecyl Salicylate' },
      { n: 'Gincol OS (Octyl Salicylate)', chem: 'Ethylhexyl Salicylate' },
      { n: 'Gincol PEGDS6 (PEG 150 Distearate)', chem: 'PEG-150 Distearate' },
      { n: 'Gincol GMS SE (Glycerol Mono Stearate)', chem: 'Glyceryl Stearate SE' },
    ],
  },
  {
    slug: 'viscosity-modifiers-foam-boosters', name: 'Viscosity Modifiers & Foam Boosters',
    solution: 'specialty-chemicals', image: '/img/categories/oleo-derivatives.jpg',
    tagline: 'Alkanolamides',
    description: 'Alkanolamides used to thicken liquid cleaning systems and stabilise foam.',
    products: [
      { n: 'Ginamide (Coco Diethanolamide)', chem: 'Cocamide DEA' },
      { n: 'Ginamide AI (Coco Monoethanolamide)', chem: 'Cocamide MEA' },
    ],
  },
  {
    slug: 'ethoxylates-and-surfactants', name: 'Ethoxylates', solution: 'specialty-chemicals',
    image: '/img/categories/oleo-derivatives.jpg',
    tagline: 'Laureth 2 to 23',
    description: 'Non-ionic alcohol ethoxylates across the Laureth range for wetting, emulsification and cleaning.',
    products: [
      { n: 'Ginonioc L242 (Laureth-2)', chem: 'Laureth-2' },
      { n: 'Ginonioc L243 (Laureth-3)', chem: 'Laureth-3' },
      { n: 'Ginonioc L247 (Laureth-7)', chem: 'Laureth-7' },
      { n: 'Ginonioc L249 (Laureth-9)', chem: 'Laureth-9' },
      { n: 'Ginonioc L2410 (Laureth-10)', chem: 'Laureth-10' },
      { n: 'Ginonioc L23 (Laureth-23)', chem: 'Laureth-23' },
    ],
  },
  {
    slug: 'pearlizing-agents', name: 'Pearlizing Agents', solution: 'specialty-chemicals',
    image: '/img/categories/oleo-derivatives.jpg',
    tagline: 'Gincol EG & Ginapearl ranges',
    description: 'Glycol esters and pearlising concentrates that give shampoos and washes an opaque, pearlescent appearance.',
    products: [
      { n: 'Gincol EGMS', chem: 'Glycol Stearate' },
      { n: 'Gincol EGDS', chem: 'Glycol Distearate' },
      { n: 'Ginapearl CPC' }, { n: 'Ginapearl 4218' },
    ],
  },
  {
    slug: 'preservatives', name: 'Preservatives', solution: 'specialty-chemicals',
    image: '/img/categories/oleo-derivatives.jpg',
    tagline: 'Godrej P series & Ginoguard',
    description: 'Preservative systems for microbial control in personal care and home care formulations.',
    products: [
      { n: 'Godrej P5 (Phenoxyethanol)', chem: 'Phenoxyethanol' },
      { n: 'Godrej P10 (Phenoxyethanol)', chem: 'Phenoxyethanol' },
      { n: 'Godrej P25 (Phenoxyethanol)', chem: 'Phenoxyethanol' },
      { n: 'Godrej P150 (Phenoxyethanol)', chem: 'Phenoxyethanol' },
      { n: 'Ginoguard GP' },
    ],
  },
  {
    slug: 'antimicrobials-biocides', name: 'Antimicrobials & Biocides', solution: 'specialty-chemicals',
    image: '/img/categories/oleo-derivatives.jpg',
    tagline: 'Quaternary biocides',
    description: 'Quaternary ammonium biocides and antimicrobial systems for sanitising and industrial applications.',
    products: [
      { n: 'Ginodet BKC 50', chem: 'Benzalkonium Chloride' },
      { n: 'Ginodet BKC 80', chem: 'Benzalkonium Chloride' },
      { n: 'Ginoquat PGB' },
    ],
  },
  {
    slug: 'conditioning-and-care-systems', name: 'Conditioning Agents', solution: 'specialty-chemicals',
    image: '/img/categories/oleo-derivatives.jpg',
    tagline: 'Quats & conditioning systems',
    description: 'Cationic conditioning agents delivering detangling, softness and substantivity in hair and skin care.',
    products: [
      { n: 'Ginoquat HPC' }, { n: 'Ginomol ST' },
      { n: 'Ginoquat 7 (PQ7)', chem: 'Polyquaternium-7' },
      { n: 'Ginamde 22CP' },
    ],
  },
  {
    slug: 'speciality-ingredients', name: 'Speciality Ingredients', solution: 'specialty-chemicals',
    image: '/img/categories/oleo-derivatives.jpg',
    tagline: 'Targeted performance ingredients',
    description: 'Speciality ingredients for specific formulation challenges across personal and home care.',
    products: [
      { n: 'Ginoquat EW' }, { n: 'Ginofos CES' },
      { n: 'Ginomol PEG7GC', chem: 'PEG-7 Glyceryl Cocoate' },
      { n: 'Ginocel 165', chem: 'PEG-100 Stearate (and) Glyceryl Stearate' },
    ],
  },
  {
    slug: 'surfactant-blends', name: 'Surfactant Blends', solution: 'specialty-chemicals',
    image: '/img/categories/oleo-derivatives.jpg',
    tagline: 'Ginamix range',
    description: 'Ready-made surfactant blends that simplify formulation of cleansing systems.',
    products: [{ n: 'Ginamix CBT' }, { n: 'Ginamix CBP' }],
  },
  {
    slug: 'actives', name: 'Actives', solution: 'specialty-chemicals',
    image: '/img/categories/oleo-derivatives.jpg',
    tagline: 'Functional actives',
    description: 'Active ingredients delivering a specific functional benefit in the finished formulation.',
    products: [{ n: 'Ginoclin CA' }, { n: 'Ginophos CD' }],
  },
  {
    slug: 'fabric-care', name: 'Fabric Care', solution: 'specialty-chemicals',
    image: '/img/categories/oleo-derivatives.jpg',
    tagline: 'Ginoquat FC range',
    description: 'Cationic softening actives for fabric conditioning and laundry care.',
    products: [{ n: 'Ginoquat FC' }, { n: 'Ginoquat FC(P)' }, { n: 'Ginoquat CP' }],
  },

  // ------------------------------------------------------------------ Biotech
  {
    slug: 'sophorolipids', name: 'Biosurfactants', solution: 'biotech',
    image: '/img/categories/biotech.jpg',
    tagline: 'SLNOVA sophorolipids',
    description: 'Fermentation-derived sophorolipid biosurfactants — readily biodegradable, bio-based performance for home and personal care.',
    products: [
      { n: 'SLNOVA A', chem: 'Sophorolipids (acidic)' },
      { n: 'SLNOVA L', chem: 'Sophorolipids (lactonic)' },
    ],
  },
];

/** Godrej categories that predate the sheet and are not in it. Retired rather
 *  than deleted, so nothing is lost and an admin can switch them back on. */
export const RETIRED_CATEGORY_SLUGS = [
  'fatty-acids',                              // sheet lists stearic acid only
  'oleic-acids',                              // not in Virava's range
  'surfactants',                              // superseded by AOS / SLS / SLES / Mild
  'oleo-derivatives-and-specialty-chemicals', // superseded by the speciality list
  'food-emulsifiers',                         // not in the sheet
  'performance-additives',                    // not in the sheet
  'preservatives-and-antimicrobials',         // split into Preservatives + Antimicrobials
];
