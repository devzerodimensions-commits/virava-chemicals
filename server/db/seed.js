import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { pool, query } from '../src/db.js';

dotenv.config();

export const slug = (s) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// ---------------------------------------------------------------- categories
// `solution` groups a Godrej category under one of its four product solutions.
// Categories belonging to the other principals leave it undefined.
export const categories = [
  { name: 'Fatty Alcohols', tagline: 'C8–C18 natural & synthetic alcohols', solution: 'oleochemicals',
    image: '/img/categories/fatty-alcohols.jpg',
    description: 'Natural and synthetic fatty alcohols used as emollients, emulsifiers and intermediates across personal care, detergents and industrial applications.' },
  { name: 'Fatty Acids', tagline: 'Distilled & fractionated acids', solution: 'oleochemicals',
    image: '/img/categories/fatty-acids.jpg',
    description: 'A complete range of saturated and unsaturated fatty acids for rubber, plastics, cosmetics, candles and lubricant industries.' },
  { name: 'Stearic Acids', tagline: 'Triple-pressed & specialty grades', solution: 'oleochemicals',
    image: '/img/categories/stearic-acids.jpg',
    description: 'Saturated long-chain fatty acids that are a prominent component in the manufacture of cosmetics, detergents and lubricants, as well as numerous industrial applications.' },
  { name: 'Oleic Acids', tagline: 'Distilled unsaturated grades', solution: 'oleochemicals',
    image: '/img/categories/oleic-acids.jpg',
    description: 'Distilled oleic acid grades used in lubricants, textile auxiliaries, soaps, intermediates and a broad range of industrial formulations.' },
  { name: 'Surfactants', tagline: 'Anionic, non-ionic & amphoteric', solution: 'surfactants',
    image: '/img/categories/surfactants.jpg',
    description: 'High-performance surfactants for detergents, personal care, textiles and industrial cleaning formulations.' },
  { name: 'Glycerine', tagline: 'Refined IP / BP / USP grades', solution: 'oleochemicals',
    image: '/img/categories/glycerine.jpg',
    description: 'Refined vegetable glycerine of pharmaceutical and technical grade for pharma, food, cosmetics and industrial use.' },
  { name: 'Oleo Derivatives & Specialty Chemicals', tagline: 'Esters, amines & specialty blends', solution: 'specialty-chemicals',
    image: '/img/categories/oleo-derivatives.jpg',
    description: 'Value-added oleochemical derivatives — esters, amines, GMS and specialty chemicals engineered for specific industrial performance.' },

  // --- Surfactants solution -------------------------------------------------
  { name: 'Alpha Olefin Sulfonate (AOS)', tagline: 'High-foaming anionic surfactant', solution: 'surfactants',
    image: '/img/categories/surfactants.jpg',
    description: 'Alpha olefin sulfonate liquids offering high foam, good detergency and stability in hard water, used across home and personal care.' },
  { name: 'Sodium Lauryl Sulphate (SLS)', tagline: 'Needles, granules & powder', solution: 'surfactants',
    image: '/img/categories/surfactants.jpg',
    description: 'Primary anionic surfactant supplied as needles, granules and powder for personal care, toothpaste and cleaning formulations.' },
  { name: 'Sodium Lauryl Ether Sulphate (SLES)', tagline: '2 mole ether sulphate grades', solution: 'surfactants',
    image: '/img/categories/surfactants.jpg',
    description: 'Workhorse anionic surfactant for shampoos, hand wash and liquid detergents, supplied in paste and liquid actives.' },
  { name: 'Ammonium Lauryl Sulphate (ALS)', tagline: 'Mild ammonium sulphate surfactant', solution: 'surfactants',
    image: '/img/categories/surfactants.jpg',
    description: 'Ammonium-neutralised lauryl sulphate used where a lower pH and mild sensory profile are required in personal care.' },
  { name: 'Di-Potassium Oleate Sulfonate (KOS)', tagline: 'Oleate-based sulfonate', solution: 'surfactants',
    image: '/img/categories/surfactants.jpg',
    description: 'Potassium oleate sulfonate surfactant used as a co-surfactant and emulsifier in industrial and cleaning applications.' },

  // --- Specialty Chemicals solution ----------------------------------------
  { name: 'Conditioning & Care Systems', tagline: 'Quats, amides & conditioning agents', solution: 'specialty-chemicals',
    image: '/img/categories/oleo-derivatives.jpg',
    description: 'Cationic conditioning agents, amides and care systems for hair care, fabric softening and skin care formulations.' },
  { name: 'Emulsifiers & Systems', tagline: 'Self-emulsifying bases & waxes', solution: 'specialty-chemicals',
    image: '/img/categories/oleo-derivatives.jpg',
    description: 'Emulsifier blends and self-emulsifying wax systems that build stable oil-in-water and water-in-oil emulsions.' },
  { name: 'Esters & Emollients', tagline: 'Light and rich ester emollients', solution: 'specialty-chemicals',
    image: '/img/categories/oleo-derivatives.jpg',
    description: 'Ester emollients and pearlising agents delivering spreadability, sensory feel and opacity in personal care.' },
  { name: 'Ethoxylates & Surfactants', tagline: 'Non-ionic ethoxylates', solution: 'specialty-chemicals',
    image: '/img/categories/oleo-derivatives.jpg',
    description: 'Alcohol ethoxylates, amine oxides and non-ionic surfactants for cleaning, emulsification and wetting.' },
  { name: 'Food Emulsifiers', tagline: 'Polyglycerol esters & food-grade systems', solution: 'specialty-chemicals',
    image: '/img/categories/oleo-derivatives.jpg',
    description: 'Food-grade emulsifiers, polyglycerol esters and viscosity systems for bakery, confectionery and processed food.' },
  { name: 'Performance Additives', tagline: 'Process and performance chemistry', solution: 'specialty-chemicals',
    image: '/img/categories/oleo-derivatives.jpg',
    description: 'Additives that tune process and end-product performance across coatings, cleaning and industrial formulations.' },
  { name: 'Preservatives & Antimicrobials', tagline: 'Preservation & microbial control', solution: 'specialty-chemicals',
    image: '/img/categories/oleo-derivatives.jpg',
    description: 'Preservatives, quaternary biocides and antimicrobial systems for personal care, home care and industrial use.' },

  // --- Biotech solution -----------------------------------------------------
  { name: 'Sophorolipids', tagline: 'Fermentation-derived biosurfactants', solution: 'biotech',
    image: '/img/categories/biotech.jpg',
    description: 'Fermentation-derived biosurfactants offering readily biodegradable, bio-based performance for home and personal care.' },

  { name: 'HPL Products', tagline: 'HPL Additives — polymer & rubber additives',
    image: '/img/categories/hpl-products.jpg',
    description: 'Antioxidants, accelerators and additives from HPL Additives Limited for the rubber, plastics and polymer industries.' },
  { name: 'OCCL Products', tagline: 'Oriental Carbon — insoluble sulphur',
    image: '/img/categories/occl-products.jpg',
    description: 'Insoluble sulphur and specialty products from Oriental Carbon & Chemicals Limited, primarily for the tyre and rubber industry.' },
  { name: 'STD Products', tagline: 'The Standard Chemicals range',
    image: '/img/categories/std-products.jpg',
    description: 'Specialty chemicals from The Standard Chemicals Co. Pvt. Ltd. serving a broad spectrum of industries.' },
];

// ---------------------------------------------------------------- products
// { c: category name, n: name, cas, grade, pack, desc }
export const products = [
  // Fatty Alcohols
  { c: 'Fatty Alcohols', n: 'Lauryl Alcohol (C12)', cas: '112-53-8', grade: 'Cosmetic / Technical', pack: '160 kg drums', desc: 'C12 fatty alcohol used as an emollient and intermediate for surfactant manufacture.' },
  { c: 'Fatty Alcohols', n: 'Cetyl Alcohol (C16)', cas: '36653-82-4', grade: 'IP / Cosmetic', pack: '25 kg bags', desc: 'Waxy C16 alcohol used as a thickener and emollient in creams and lotions.' },
  { c: 'Fatty Alcohols', n: 'Stearyl Alcohol (C18)', cas: '112-92-5', grade: 'IP / Cosmetic', pack: '25 kg bags', desc: 'C18 fatty alcohol used as an emulsion stabiliser and opacifier.' },
  { c: 'Fatty Alcohols', n: 'Cetostearyl Alcohol', cas: '67762-27-0', grade: 'IP / BP', pack: '25 kg bags', desc: 'A blend of cetyl and stearyl alcohols widely used in pharmaceutical and cosmetic emulsions.' },
  { c: 'Fatty Alcohols', n: 'Oleyl Alcohol', cas: '143-28-2', grade: 'Cosmetic', pack: '180 kg drums', desc: 'Unsaturated fatty alcohol used as an emollient and carrier in personal care.' },
  // Ginol range — Godrej trade names distributed by Virava
  { c: 'Fatty Alcohols', n: 'Ginol 16 (95%)', cas: '36653-82-4', grade: '95% cetyl', pack: '25 kg bags', desc: 'Cetyl alcohol at 95% purity, used as a thickener, emollient and emulsion stabiliser.' },
  { c: 'Fatty Alcohols', n: 'Ginol 16 (98%)', cas: '36653-82-4', grade: '98% cetyl', pack: '25 kg bags', desc: 'Higher-purity cetyl alcohol for personal care and pharmaceutical emulsions.' },
  { c: 'Fatty Alcohols', n: 'Ginol 16 (99%)', cas: '36653-82-4', grade: '99% cetyl', pack: '25 kg bags', desc: 'Premium 99% cetyl alcohol where the tightest purity specification is required.' },
  { c: 'Fatty Alcohols', n: 'Ginol 1618 (60:40)', cas: '67762-27-0', grade: '60:40 blend', pack: '25 kg bags', desc: 'Cetostearyl alcohol blended 60:40 for consistent emulsification across cosmetic bases.' },

  // Fatty Acids
  { c: 'Fatty Acids', n: 'Stearic Acid', cas: '57-11-4', grade: 'Rubber / Cosmetic', pack: '25 kg bags', desc: 'Versatile saturated fatty acid used in rubber, cosmetics, candles and lubricants.' },
  { c: 'Fatty Acids', n: 'Oleic Acid', cas: '112-80-1', grade: 'Technical / Cosmetic', pack: '190 kg drums', desc: 'Unsaturated fatty acid used in soaps, lubricants, textiles and intermediates.' },
  { c: 'Fatty Acids', n: 'Palmitic Acid', cas: '57-10-3', grade: 'Technical', pack: '25 kg bags', desc: 'Saturated C16 fatty acid used in surfactants, cosmetics and candles.' },
  { c: 'Fatty Acids', n: 'Lauric Acid', cas: '143-07-7', grade: 'Technical', pack: '25 kg bags', desc: 'C12 fatty acid used in soaps, detergents and personal care.' },
  { c: 'Fatty Acids', n: 'Distilled Fatty Acid', cas: '', grade: 'Industrial', pack: 'Bulk / drums', desc: 'Distilled vegetable fatty acids for a wide range of industrial applications.' },
  { c: 'Fatty Acids', n: 'Arachidic Acid 95%', cas: '506-30-9', grade: '95% min', pack: '25 kg bags', desc: 'Long-chain C20 saturated fatty acid used in lubricants, waxes and specialty formulations.' },
  { c: 'Fatty Acids', n: 'Behenic Acid 85%', cas: '112-85-6', grade: '85% min', pack: '25 kg bags', desc: 'C22 saturated fatty acid used in personal care, lubricants and polymer additives.' },
  { c: 'Fatty Acids', n: 'Behenic Acid 90%', cas: '112-85-6', grade: '90% min', pack: '25 kg bags', desc: 'Higher-purity behenic acid for demanding cosmetic and industrial applications.' },

  // Stearic Acids — Godrej trade names distributed by Virava
  { c: 'Stearic Acids', n: 'Hystric — Triple Pressed', cas: '57-11-4', grade: 'Triple pressed', pack: '25 kg bags', desc: 'Triple-pressed stearic acid of high purity for cosmetics, pharmaceuticals and premium rubber compounding.' },
  { c: 'Stearic Acids', n: 'Textric', cas: '57-11-4', grade: 'Technical', pack: '25 kg bags', desc: 'Technical grade stearic acid widely used in textile auxiliaries, detergents and industrial processing.' },
  { c: 'Stearic Acids', n: 'Textric SPL', cas: '57-11-4', grade: 'Special', pack: '25 kg bags', desc: 'Special grade stearic acid offering tighter specification for sensitive formulations.' },
  { c: 'Stearic Acids', n: 'Distric', cas: '57-11-4', grade: 'Distilled', pack: '25 kg bags', desc: 'Distilled stearic acid used in rubber, plastics, candles and lubricant applications.' },

  // Oleic Acids — Godrej trade names distributed by Virava
  { c: 'Oleic Acids', n: 'Lubolic', cas: '112-80-1', grade: 'Technical', pack: '190 kg drums', desc: 'Distilled oleic acid for lubricants, soaps, textile auxiliaries and chemical intermediates.' },
  { c: 'Oleic Acids', n: 'Lubolic E', cas: '112-80-1', grade: 'Special', pack: '190 kg drums', desc: 'Enhanced grade oleic acid with improved colour and stability for demanding applications.' },
  { c: 'Oleic Acids', n: 'Lubolic 15', cas: '112-80-1', grade: 'Low titre', pack: '190 kg drums', desc: 'Low-titre oleic acid grade suited to cold-weather and low-temperature processing.' },
  { c: 'Oleic Acids', n: 'Lubolic 20', cas: '112-80-1', grade: 'Standard titre', pack: '190 kg drums', desc: 'Standard titre oleic acid used across lubricant, textile and industrial formulations.' },

  // Surfactants
  { c: 'Surfactants', n: 'Sodium Lauryl Ether Sulphate (SLES)', cas: '9004-82-4', grade: '70% / 28%', pack: '220 kg drums', desc: 'Primary anionic surfactant for shampoos, hand-wash and liquid detergents.' },
  { c: 'Surfactants', n: 'Sodium Lauryl Sulphate (SLS)', cas: '151-21-3', grade: 'Needle / Powder', pack: '25 kg bags', desc: 'High-foaming anionic surfactant for personal care and cleaning products.' },
  { c: 'Surfactants', n: 'Cocamidopropyl Betaine (CAPB)', cas: '61789-40-0', grade: '30% active', pack: '220 kg drums', desc: 'Mild amphoteric surfactant and foam booster for personal care formulations.' },
  { c: 'Surfactants', n: 'Cocamide DEA', cas: '68603-42-9', grade: 'Technical', pack: '215 kg drums', desc: 'Non-ionic foam stabiliser and viscosity builder for detergents.' },

  // Glycerine
  { c: 'Glycerine', n: 'Refined Glycerine IP', cas: '56-81-5', grade: '99.5% IP', pack: '250 kg drums', desc: 'Pharmaceutical grade refined glycerine for pharma, food and cosmetic use.' },
  { c: 'Glycerine', n: 'Refined Glycerine USP/BP', cas: '56-81-5', grade: '99.7% USP/BP', pack: '250 kg drums', desc: 'High purity glycerine meeting USP and BP pharmacopoeia standards.' },
  { c: 'Glycerine', n: 'Technical Glycerine', cas: '56-81-5', grade: 'Technical', pack: '250 kg drums', desc: 'Industrial grade glycerine for technical and manufacturing applications.' },
  // Pharmacopoeial grades — Godrej trade names distributed by Virava
  { c: 'Glycerine', n: 'Glycerin BP', cas: '56-81-5', grade: 'BP', pack: '250 kg drums', desc: 'Vegetable glycerine meeting British Pharmacopoeia specification for pharma and personal care.' },
  { c: 'Glycerine', n: 'Glycerin EP', cas: '56-81-5', grade: 'EP', pack: '250 kg drums', desc: 'European Pharmacopoeia grade glycerine for regulated pharmaceutical formulations.' },
  { c: 'Glycerine', n: 'Glycerin CP', cas: '56-81-5', grade: 'CP', pack: '250 kg drums', desc: 'Chemically pure glycerine for food, cosmetic and fine-chemical applications.' },
  { c: 'Glycerine', n: 'Glycerin IP', cas: '56-81-5', grade: 'IP', pack: '250 kg drums', desc: 'Indian Pharmacopoeia grade glycerine for domestic pharmaceutical manufacture.' },

  // Oleo Derivatives
  { c: 'Oleo Derivatives & Specialty Chemicals', n: 'Glyceryl Monostearate (GMS)', cas: '31566-31-1', grade: 'SE / Non-SE', pack: '25 kg bags', desc: 'Emulsifier and stabiliser for food, cosmetics and plastics.' },
  { c: 'Oleo Derivatives & Specialty Chemicals', n: 'Isopropyl Myristate (IPM)', cas: '110-27-0', grade: 'Cosmetic', pack: '180 kg drums', desc: 'Light emollient ester used widely in cosmetics and personal care.' },
  { c: 'Oleo Derivatives & Specialty Chemicals', n: 'Isopropyl Palmitate (IPP)', cas: '142-91-6', grade: 'Cosmetic', pack: '180 kg drums', desc: 'Emollient ester providing a smooth, non-greasy feel in formulations.' },
  { c: 'Oleo Derivatives & Specialty Chemicals', n: 'Fatty Amines', cas: '', grade: 'Industrial', pack: 'Drums', desc: 'Oleochemical amines used in fabric softeners, flotation and asphalt additives.' },

  // Surfactants solution — Godrej trade names distributed by Virava
  { c: 'Alpha Olefin Sulfonate (AOS)', n: 'Alfodet L46', grade: 'Liquid, ~46% active', pack: '220 kg drums', desc: 'Alpha olefin sulfonate liquid delivering high foam and good detergency in home and personal care cleaning systems.' },
  { c: 'Alpha Olefin Sulfonate (AOS)', n: 'Alfodet XL46', grade: 'Liquid, ~46% active', pack: '220 kg drums', desc: 'Higher-clarity AOS liquid for formulations where colour and appearance matter.' },
  { c: 'Alpha Olefin Sulfonate (AOS)', n: 'Ginasul TWS', grade: 'Liquid', pack: '220 kg drums', desc: 'AOS-based surfactant used as a primary or co-surfactant in cleaning formulations.' },
  { c: 'Alpha Olefin Sulfonate (AOS)', n: 'Ginasul 6836', grade: 'Liquid', pack: '220 kg drums', desc: 'Alpha olefin sulfonate grade offering stable foam across a broad pH range.' },

  { c: 'Sodium Lauryl Sulphate (SLS)', n: 'Ginopol 24G', grade: 'Granules', pack: '25 kg bags', desc: 'Granular sodium lauryl sulphate for powder detergents and dry-blend applications.' },
  { c: 'Sodium Lauryl Sulphate (SLS)', n: 'Ginopol 24N', grade: 'Needles', pack: '25 kg bags', desc: 'Needle-form sodium lauryl sulphate offering high foam for personal care and cleaning products.' },
  { c: 'Sodium Lauryl Sulphate (SLS)', n: 'Ginopol 28N', grade: 'Needles', pack: '25 kg bags', desc: 'Higher-active needle grade sodium lauryl sulphate for concentrated formulations.' },
  { c: 'Sodium Lauryl Sulphate (SLS)', n: 'Ginopol 24P', grade: 'Powder', pack: '25 kg bags', desc: 'Powder sodium lauryl sulphate suited to toothpaste and dry powder systems.' },

  { c: 'Sodium Lauryl Ether Sulphate (SLES)', n: 'Godrej SLES L24-230', grade: 'Liquid, ~26% active', pack: '220 kg drums', desc: 'Liquid 2 mole sodium lauryl ether sulphate for ready-to-use liquid cleaning formulations.' },
  { c: 'Sodium Lauryl Ether Sulphate (SLES)', n: 'Godrej SLES P24-270', grade: 'Paste, ~70% active', pack: '220 kg drums', desc: 'High-active SLES paste — the standard base for shampoos, hand wash and liquid detergents.' },
  { c: 'Sodium Lauryl Ether Sulphate (SLES)', n: 'Godrej SLES P24-170', grade: 'Paste, ~70% active', pack: '220 kg drums', desc: 'SLES paste grade offering an alternative viscosity and handling profile.' },

  { c: 'Ammonium Lauryl Sulphate (ALS)', n: 'Ginoneos ALS', grade: 'Liquid', pack: '220 kg drums', desc: 'Ammonium lauryl sulphate for lower-pH personal care formulations needing a mild sensory profile.' },

  { c: 'Di-Potassium Oleate Sulfonate (KOS)', n: 'Ginoneos KOS', grade: 'Liquid', pack: '220 kg drums', desc: 'Di-potassium oleate sulfonate used as a co-surfactant and emulsifier in industrial cleaning.' },

  // Specialty Chemicals solution — Godrej trade names distributed by Virava
  { c: 'Conditioning & Care Systems', n: 'Ginamide 22CP', grade: 'Specialty', pack: '50 kg bags', desc: 'Amide-based conditioning agent for hair care and fabric care formulations.' },
  { c: 'Conditioning & Care Systems', n: 'Ginomol ST', grade: 'Specialty', pack: '50 kg bags', desc: 'Conditioning and care ingredient used to improve substantivity and feel.' },
  { c: 'Conditioning & Care Systems', n: 'Ginoquat CP', grade: 'Cationic', pack: '50 kg drums', desc: 'Quaternary conditioning agent delivering detangling and softness in hair care.' },
  { c: 'Conditioning & Care Systems', n: 'Ginoquat EW', grade: 'Cationic', pack: '50 kg drums', desc: 'Emulsifying cationic quat for conditioners and fabric softening systems.' },

  { c: 'Emulsifiers & Systems', n: 'Ginamix AG TA15', grade: 'Emulsifier blend', pack: '50 kg bags', desc: 'Emulsifier system for stable oil-in-water emulsions in personal care.' },
  { c: 'Emulsifiers & Systems', n: 'Ginamix CBP', grade: 'Emulsifier blend', pack: '50 kg bags', desc: 'Blended emulsifier base simplifying formulation of creams and lotions.' },
  { c: 'Emulsifiers & Systems', n: 'Ginol EW 91S', grade: 'Self-emulsifying', pack: '25 kg bags', desc: 'Self-emulsifying fatty alcohol base for straightforward emulsion build.' },
  { c: 'Emulsifiers & Systems', n: 'Ginowax AO', grade: 'Emulsifying wax', pack: '25 kg bags', desc: 'Emulsifying wax providing body and stability to cream formulations.' },

  { c: 'Esters & Emollients', n: 'Ginapearl 4218', grade: 'Pearlising agent', pack: '50 kg drums', desc: 'Pearlising concentrate giving shampoos and washes an opaque, pearlescent appearance.' },
  { c: 'Esters & Emollients', n: 'Gincol EHS', grade: 'Ester', pack: '180 kg drums', desc: 'Light ester emollient with a dry, non-greasy skin feel.' },
  { c: 'Esters & Emollients', n: 'Gincol FB DMG', grade: 'Ester', pack: '180 kg drums', desc: 'Ester emollient used to adjust spreadability and sensory profile.' },
  { c: 'Esters & Emollients', n: 'Gincol OS', grade: 'Ester', pack: '180 kg drums', desc: 'Oleate ester emollient offering rich cushion in skin care formulations.' },

  { c: 'Ethoxylates & Surfactants', n: 'Ginonic CSA 12', grade: 'Non-ionic', pack: '200 kg drums', desc: 'Alcohol ethoxylate non-ionic surfactant for wetting, emulsification and cleaning.' },
  { c: 'Ethoxylates & Surfactants', n: 'Ginamide AO', grade: 'Amine oxide', pack: '200 kg drums', desc: 'Amine oxide surfactant used as a foam booster and viscosity builder.' },
  { c: 'Ethoxylates & Surfactants', n: 'Ginamide B', grade: 'Amide', pack: '200 kg drums', desc: 'Alkanolamide used to stabilise foam and thicken liquid cleaning systems.' },
  { c: 'Ethoxylates & Surfactants', n: 'Ginodet DLSS', grade: 'Anionic', pack: '200 kg drums', desc: 'Sulphosuccinate-type mild anionic surfactant for gentle cleansing.' },

  { c: 'Food Emulsifiers', n: 'Dynapol PGE SFO', grade: 'Food grade', pack: '25 kg drums', desc: 'Polyglycerol ester of sunflower oil used as a food-grade emulsifier.' },
  { c: 'Food Emulsifiers', n: 'DynaTar 95-62-80', grade: 'Food grade', pack: '25 kg drums', desc: 'Food-grade emulsifier system for bakery and confectionery applications.' },
  { c: 'Food Emulsifiers', n: 'DynaVisc 9008', grade: 'Food grade', pack: '25 kg drums', desc: 'Viscosity and texture modifier for processed food formulations.' },
  { c: 'Food Emulsifiers', n: 'DynaVisc 999', grade: 'Food grade', pack: '25 kg drums', desc: 'Food-grade viscosity system used to control body and mouthfeel.' },

  { c: 'Performance Additives', n: 'Ginacryl PC SB501', grade: 'Performance additive', pack: '200 kg drums', desc: 'Acrylic performance additive for coatings and industrial formulations.' },
  { c: 'Performance Additives', n: 'Ginoclin CA', grade: 'Performance additive', pack: '200 kg drums', desc: 'Cleaning performance additive supporting soil removal and rinsing.' },
  { c: 'Performance Additives', n: 'Ginophos CD', grade: 'Phosphate ester', pack: '200 kg drums', desc: 'Phosphate ester additive used for emulsification and corrosion control.' },
  { c: 'Performance Additives', n: 'Godrej IMD 18-NH2', grade: 'Amine', pack: '200 kg drums', desc: 'Fatty amine intermediate for performance chemistry applications.' },

  { c: 'Preservatives & Antimicrobials', n: 'Ginodet BKC 50', grade: '50% active', pack: '200 kg drums', desc: 'Benzalkonium chloride solution used as a quaternary biocide and sanitiser base.' },
  { c: 'Preservatives & Antimicrobials', n: 'Ginoguard GP', grade: 'Preservative', pack: '50 kg drums', desc: 'Broad-spectrum preservative system for personal care and home care.' },
  { c: 'Preservatives & Antimicrobials', n: 'Ginoguard PGB', grade: 'Preservative', pack: '50 kg drums', desc: 'Glycol-based preservative booster with multifunctional properties.' },
  { c: 'Preservatives & Antimicrobials', n: 'Godrej P10', grade: 'Preservative', pack: '50 kg drums', desc: 'Preservative concentrate for microbial control in aqueous formulations.' },

  // Biotech solution — Godrej trade names distributed by Virava
  { c: 'Sophorolipids', n: 'SLNOVA A', grade: 'Acidic sophorolipid', pack: '200 kg drums', desc: 'Fermentation-derived acidic sophorolipid biosurfactant — readily biodegradable and bio-based, for home and personal care.' },
  { c: 'Sophorolipids', n: 'SLNOVA L', grade: 'Lactonic sophorolipid', pack: '200 kg drums', desc: 'Lactonic sophorolipid biosurfactant offering antimicrobial and surface-active performance from a renewable source.' },

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

// ---------------------------------------------------------------- product specs
// Extra rows for the product detail page, in the style principals publish.
// Deliberately limited to things that are actually true of the material: the
// physical form and application scope come from the category, and INCI names are
// the real ones. Nothing here invents a performance claim.
export const CATEGORY_SPECS = {
  'Fatty Alcohols': {
    'Typical Properties': 'White waxy solid or pastilles, low odour, soluble in alcohols and oils.',
    'Application Details': 'Emollients, emulsifiers, thickeners and surfactant intermediates for personal care, detergents and industrial formulations.',
  },
  'Fatty Acids': {
    'Typical Properties': 'Solid flakes to viscous liquid depending on chain length and titre.',
    'Application Details': 'Rubber compounding, plastics processing, cosmetics, candles, lubricants and textile auxiliaries.',
  },
  'Stearic Acids': {
    'Typical Properties': 'White to off-white waxy flakes or beads, mild characteristic odour.',
    'Application Details': 'Cosmetics, detergents, lubricants, rubber compounding and general industrial processing.',
  },
  'Oleic Acids': {
    'Typical Properties': 'Pale yellow oily liquid at room temperature, characteristic odour.',
    'Application Details': 'Lubricants, soaps, textile auxiliaries, intermediates and industrial formulations.',
  },
  'Surfactants': {
    'Typical Properties': 'Clear to hazy liquid, paste or needles depending on active content.',
    'Application Details': 'Shampoos, hand wash, liquid detergents, personal care and industrial cleaning.',
  },
  'Glycerine': {
    'Typical Properties': 'Clear, colourless, odourless viscous liquid; hygroscopic; miscible with water.',
    'Application Details': 'Pharmaceutical, food, cosmetic, personal care and industrial applications including paints and resins.',
  },
  'Oleo Derivatives & Specialty Chemicals': {
    'Typical Properties': 'Varies by product — clear ester liquids through to white solid emulsifiers.',
    'Application Details': 'Cosmetics, food, plastics and personal care formulations requiring value-added oleochemical derivatives.',
  },
  'HPL Products': {
    'Typical Properties': 'Powder, granules or masterbatch depending on additive type.',
    'Application Details': 'Rubber, tyre, plastics and polymer processing.',
  },
  'OCCL Products': {
    'Typical Properties': 'Free-flowing powder, oil-treated grades available.',
    'Application Details': 'Tyre and rubber vulcanisation.',
  },
  'STD Products': {
    'Typical Properties': 'Varies by product.',
    'Application Details': 'A broad spectrum of manufacturing industries.',
  },
};

// Real INCI names, keyed by product. Products absent from this map simply do not
// get an INCI Name row.
export const INCI_NAMES = {
  'Lauryl Alcohol (C12)': 'Lauryl Alcohol',
  'Cetyl Alcohol (C16)': 'Cetyl Alcohol',
  'Stearyl Alcohol (C18)': 'Stearyl Alcohol',
  'Cetostearyl Alcohol': 'Cetearyl Alcohol',
  'Oleyl Alcohol': 'Oleyl Alcohol',
  'Ginol 16 (95%)': 'Cetyl Alcohol',
  'Ginol 16 (98%)': 'Cetyl Alcohol',
  'Ginol 16 (99%)': 'Cetyl Alcohol',
  'Ginol 1618 (60:40)': 'Cetearyl Alcohol',
  'Stearic Acid': 'Stearic Acid',
  'Oleic Acid': 'Oleic Acid',
  'Palmitic Acid': 'Palmitic Acid',
  'Lauric Acid': 'Lauric Acid',
  'Arachidic Acid 95%': 'Arachidic Acid',
  'Behenic Acid 85%': 'Behenic Acid',
  'Behenic Acid 90%': 'Behenic Acid',
  'Hystric — Triple Pressed': 'Stearic Acid',
  'Textric': 'Stearic Acid',
  'Textric SPL': 'Stearic Acid',
  'Distric': 'Stearic Acid',
  'Lubolic': 'Oleic Acid',
  'Lubolic E': 'Oleic Acid',
  'Lubolic 15': 'Oleic Acid',
  'Lubolic 20': 'Oleic Acid',
  'Refined Glycerine IP': 'Glycerin',
  'Refined Glycerine USP/BP': 'Glycerin',
  'Technical Glycerine': 'Glycerin',
  'Glycerin BP': 'Glycerin',
  'Glycerin EP': 'Glycerin',
  'Glycerin CP': 'Glycerin',
  'Glycerin IP': 'Glycerin',
  'Sodium Lauryl Ether Sulphate (SLES)': 'Sodium Laureth Sulfate',
  'Sodium Lauryl Sulphate (SLS)': 'Sodium Lauryl Sulfate',
  'Cocamidopropyl Betaine (CAPB)': 'Cocamidopropyl Betaine',
  'Cocamide DEA': 'Cocamide DEA',
  'Glyceryl Monostearate (GMS)': 'Glyceryl Stearate',
  'Isopropyl Myristate (IPM)': 'Isopropyl Myristate',
  'Isopropyl Palmitate (IPP)': 'Isopropyl Palmitate',
};

export const specsFor = (p) => {
  const s = { ...(CATEGORY_SPECS[p.c] || {}) };
  if (p.grade) s.Feature = `${p.grade} grade, supplied by Virava Chemicals.`;
  if (INCI_NAMES[p.n]) s['INCI Name'] = INCI_NAMES[p.n];
  return s;
};

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

// ---------------------------------------------------------------- solutions
// Godrej's four product solutions. *starred* words render as the italic accent.
export const solutions = [
  { slug: 'oleochemicals', name: 'Oleochemicals',
    portfolio_title: 'Oleochemicals Portfolio',
    headline: 'High-purity oleochemicals for *demanding* industrial needs',
    lead: 'renewable fatty acids, fatty alcohols, glycerine and speciality derivatives — engineered for purity, consistency and performance across a wide range of industrial applications.',
    points: 'Sustainably sourced and bio-based\nConsistent, batch-to-batch quality\nAdaptable across diverse industries',
    blurb: 'Glycerine, stearic and fatty acids, oleic acids and fatty alcohols.',
    image: '/img/categories/glycerine.jpg' },
  { slug: 'surfactants', name: 'Surfactants',
    portfolio_title: 'Our Surfactants Portfolio',
    headline: 'Surfactants that build *foam*, cleaning and mildness',
    lead: 'anionic and non-ionic surfactants — AOS, SLS, SLES, ALS and KOS — supplied as pastes, liquids, needles and granules for home care, personal care and industrial cleaning.',
    points: 'High foam and reliable detergency\nLiquid, paste, needle and granule forms\nHome care, personal care and industrial cleaning',
    blurb: 'AOS, SLS, SLES, ALS and KOS in liquid, paste, needle and granule forms.',
    image: '/img/categories/surfactants.jpg' },
  { slug: 'specialty-chemicals', name: 'Specialty Chemicals',
    portfolio_title: 'Our Specialities Portfolio',
    headline: 'Speciality chemistry for *formulation* performance',
    lead: 'conditioning systems, emulsifiers, esters and emollients, ethoxylates, food emulsifiers, performance additives and preservatives for personal care, home care and food.',
    points: 'Conditioning, emulsification and sensory control\nFood-grade and personal-care grades\nPreservation and microbial control',
    blurb: 'Conditioning systems, emulsifiers, esters, ethoxylates and preservatives.',
    image: '/img/categories/oleo-derivatives.jpg' },
  { slug: 'biotech', name: 'Biotech',
    portfolio_title: 'Biosurfactants Portfolio',
    headline: 'Fermentation-derived *biosurfactants*',
    lead: 'sophorolipid biosurfactants produced by fermentation — readily biodegradable, bio-based alternatives for home and personal care formulations.',
    points: 'Bio-based and readily biodegradable\nProduced by fermentation\nHome care and personal care',
    blurb: 'Fermentation-derived sophorolipid biosurfactants.',
    image: '/img/categories/biotech.jpg' },
];

// ---------------------------------------------------------------- highlights
export const highlights = [
  { icon: 'awards', title: '35+ Awards', subtitle: 'Recognised & award-winning brand' },
  { icon: 'partner', title: 'Godrej Partner', subtitle: 'Exclusive distributors of oleo chemicals' },
  { icon: 'industries', title: '20+ Industries', subtitle: 'Served across diverse sectors' },
  { icon: 'generations', title: '3 Generations', subtitle: 'Trusted since 1996' },
];

// ---------------------------------------------------------------- faqs
export const faqs = [
  { question: 'Application depth that helps customers move faster',
    answer: 'Five decades in the agency business means we know how these chemicals behave in the field. We help with grade selection, substitutions and troubleshooting across personal care, detergents, rubber, plastics, textiles and lubricants — not just quoting a price.' },
  { question: 'A broad portfolio from reputed manufacturers',
    answer: 'As exclusive distributors of Godrej Industries Ltd, and representing HPL Additives, Oriental Carbon & Chemicals and The Standard Chemicals Co., we cover fatty alcohols, fatty acids, surfactants, glycerine, oleo derivatives and specialty additives from one supplier.' },
  { question: 'Reliable supply backed by real warehousing',
    answer: 'Established warehousing, a strong distribution network and experienced staff mean consistent, on-time delivery — including bulk quantities and repeat scheduled supply.' },
  { question: 'Quality and transparency across three generations',
    answer: 'Products come from certified manufacturers with documentation to match. Honest, transparent dealing with customers and principals alike is what the firm was built on.' },
];

// ---------------------------------------------------------------- hero slides
export const heroSlides = [
  { title: 'The Most Trusted Name in Industrial Chemicals',
    subtitle: 'Reputed & award-winning brand serving the industrial world of Gujarat since 1996.',
    image: '/img/slides/godrej.jpg', cta_text: 'Explore Our Products', cta_link: '/products' },
  { title: 'Exclusive Distributors of Godrej Oleo Chemicals',
    subtitle: 'A valued business partner of Godrej Industries Ltd — a leader in oleo chemicals.',
    image: '/img/slides/hpl.jpg', cta_text: 'Our Principals', cta_link: '/#principals' },
  { title: 'Quality, Service & Transparency for Three Generations',
    subtitle: 'Fatty alcohols, fatty acids, surfactants, glycerine & specialty chemicals.',
    image: '/img/slides/occl.jpg', cta_text: 'Get in Touch', cta_link: '/contact' },
  { title: 'Insoluble Sulphur, Additives & Specialty Chemicals',
    subtitle: 'Representing HPL Additives, Oriental Carbon & Chemicals and The Standard Chemicals Co.',
    image: '/img/slides/standard.jpg', cta_text: 'Browse the Range', cta_link: '/products' },
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
  established: '1996',
  founder: 'Mr. Siddharth Shah',
  about_short: 'Virava Chemicals is a closely held partnership firm and an agency house serving the industrial world with quality products from reputed manufacturers for more than five decades.',
  about_full: 'Virava Chemicals is committed towards quality service and transparency with its customers and principals. Determined with direction since three generations, Virava has achieved goodwill and a reputable position in various industries. We are a valued business partner of Godrej Industries Ltd, a leader in oleo chemicals, and also represent other renowned manufacturers of the country as our principals.',
  address: "402 'Arista' - The Business Hub, Above Pantaloons, Nr. Madhur Hall, Anand Nagar Road, Satellite, Ahmedabad - 380015",
  phone1: '+91-079-29708697',
  phone2: '+91-079-29708688',
  email: 'viravachemicals@gmail.com',
  stat_experience: '50',
  stat_awards: '35',
  stat_customers: '2500',
  map_embed: 'https://www.google.com/maps?q=Arista+The+Business+Hub+Satellite+Ahmedabad&output=embed',
  facebook: '', linkedin: '', twitter: '',
};

export async function run(closePool = true) {
  console.log('Seeding Virava Chemicals database...');
  await query(`TRUNCATE enquiries, products, categories, principals, industries, hero_slides, blogs, site_settings, admins, solutions, highlights, faqs RESTART IDENTITY CASCADE`);

  // principals (first, so categories can reference them)
  const pKeyId = {}; // godrej/hpl/occl/std -> id
  for (let i = 0; i < principals.length; i++) {
    const p = principals[i];
    const { rows } = await query(
      `INSERT INTO principals (slug, name, description, logo_url, website, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [slug(p.name), p.name, p.desc, p.logo, p.website, i]
    );
    const n = p.name.toLowerCase();
    const key = n.includes('godrej') ? 'godrej' : n.includes('hpl') ? 'hpl'
      : n.includes('oriental') ? 'occl' : 'std';
    pKeyId[key] = rows[0].id;
  }

  // which principal each category belongs to
  const catPrincipal = (name) => {
    const n = name.toLowerCase();
    if (n.includes('hpl')) return pKeyId.hpl;
    if (n.includes('occl')) return pKeyId.occl;
    if (n.includes('std')) return pKeyId.std;
    return pKeyId.godrej; // fatty alcohols/acids, surfactants, glycerine, oleo derivatives
  };

  // categories
  const catId = {};
  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    const { rows } = await query(
      `INSERT INTO categories (slug, name, principal_id, solution, tagline, description, image_url, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      [slug(c.name), c.name, catPrincipal(c.name), c.solution || null,
       c.tagline, c.description, c.image, i]
    );
    catId[c.name] = { id: rows[0].id, image: c.image };
  }

  // products
  let pi = 0;
  for (const p of products) {
    const cat = catId[p.c];
    await query(
      `INSERT INTO products (category_id, slug, name, description, cas_no, grade, packaging, image_url, specs, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [cat.id, slug(p.n) + '-' + (++pi), p.n, p.desc, p.cas || '', p.grade || '',
       p.pack || '', cat.image, JSON.stringify(specsFor(p)), pi]
    );
  }

  // solutions / highlights / faqs
  for (let i = 0; i < solutions.length; i++) {
    const s = solutions[i];
    await query(
      `INSERT INTO solutions (slug, name, portfolio_title, headline, lead, points, blurb, image_url, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [s.slug, s.name, s.portfolio_title, s.headline, s.lead, s.points, s.blurb, s.image, i]
    );
  }
  for (let i = 0; i < highlights.length; i++) {
    const h = highlights[i];
    await query(
      'INSERT INTO highlights (icon, title, subtitle, sort_order) VALUES ($1,$2,$3,$4)',
      [h.icon, h.title, h.subtitle, i]
    );
  }
  for (let i = 0; i < faqs.length; i++) {
    const f = faqs[i];
    await query(
      'INSERT INTO faqs (question, answer, sort_order) VALUES ($1,$2,$3)',
      [f.question, f.answer, i]
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
