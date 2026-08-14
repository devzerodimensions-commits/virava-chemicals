const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
} = require('docx');
const fs = require('fs');

const RED = 'D81F26';
const DARK = '161616';
const GREY = '555555';

const H = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 320, after: 140 }, children: [new TextRun({ text: t, color: DARK, bold: true })] });
const H2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 220, after: 100 }, children: [new TextRun({ text: t, color: DARK, bold: true })] });
const P = (t) => new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: t, color: '333333' })] });
const B = (t) => new Paragraph({ bullet: { level: 0 }, spacing: { after: 60 }, children: Array.isArray(t) ? t : [new TextRun({ text: t, color: '333333' })] });
const KV = (k, v) => new Paragraph({ bullet: { level: 0 }, spacing: { after: 60 }, children: [new TextRun({ text: k + ': ', bold: true, color: DARK }), new TextRun({ text: v, color: '333333' })] });

function table(rows, widths) {
  return new Table({
    columnWidths: widths,
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    rows: rows.map((cells, ri) => new TableRow({
      children: cells.map((c, ci) => new TableCell({
        width: { size: widths[ci], type: WidthType.DXA },
        shading: ri === 0 ? { type: ShadingType.CLEAR, fill: DARK } : (ri % 2 ? { type: ShadingType.CLEAR, fill: 'F5F5F5' } : { type: ShadingType.CLEAR, fill: 'FFFFFF' }),
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: c, bold: ri === 0, color: ri === 0 ? 'FFFFFF' : '333333', size: 20 })] })],
      })),
    })),
  });
}

const rule = () => new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: RED } }, spacing: { after: 160 }, children: [] });

const doc = new Document({
  styles: { default: { document: { run: { font: 'Calibri', size: 22 } } } },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, bottom: 1080, left: 1200, right: 1200 } } },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600, after: 40 }, children: [new TextRun({ text: 'VIRAVA', bold: true, size: 56, color: DARK }), new TextRun({ text: ' CHEMICALS', bold: true, size: 56, color: RED })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 30 }, children: [new TextRun({ text: 'Website Project Documentation', size: 30, color: GREY })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: 'React + Node.js + PostgreSQL  ·  Hosted on Render', size: 20, color: GREY, italics: true })] }),
      rule(),

      H('1. Project Overview'),
      P('Virava Chemicals (Ahmedabad, established 1997) is a chemical distribution / agency house — the exclusive distributor of Godrej Industries Ltd and other leading manufacturers, supplying oleochemicals and specialty chemicals to 20+ industries across India.'),
      P('This project is a complete, modern redesign of the Virava Chemicals website with a custom admin dashboard, built as a full-stack web application and deployed live on the internet.'),

      H('2. Live Access'),
      table([
        ['Item', 'Details'],
        ['Live Website', 'https://virava-chemicals.onrender.com'],
        ['Admin Panel', 'https://virava-chemicals.onrender.com/admin'],
        ['Admin Email', 'admin@viravachemicals.com'],
        ['Admin Password', 'Virava@2026  (change after go-live)'],
        ['Source Code (GitHub)', 'github.com/devzerodimensions-commits/virava-chemicals'],
      ], [3200, 6640]),
      new Paragraph({ spacing: { after: 120 }, children: [] }),
      P('Note: The site is on a free hosting plan, so it "sleeps" after ~15 minutes of inactivity — the first visit may take ~30–50 seconds to wake up.'),

      H('3. Technology Stack'),
      table([
        ['Layer', 'Technology'],
        ['Frontend', 'React 18 + Vite, React Router'],
        ['Backend', 'Node.js + Express (REST API)'],
        ['Database', 'PostgreSQL'],
        ['Hosting', 'Render (web service + managed PostgreSQL)'],
        ['Fonts / Theme', 'Source Sans 3 (Godrej-style); black & white with red accent'],
      ], [3200, 6640]),

      H('4. Website Pages & Sections'),
      H2('Public Website'),
      B('Home — intro, 4-slide manufacturer hero banners, "What We Do" services, product categories, principals, industries, stats, blogs, and enquiry CTA'),
      B('About Us — company profile, mission, why-Virava, and principals'),
      B('Products — 8 categories, each opening a detail page with products, grades & specifications'),
      B('Principals — dedicated detail page per manufacturer (Godrej, HPL, OCCL, SCC) with a tabbed product portfolio; click a product for full specifications & applications'),
      B('Industries — 20+ industries served'),
      B('Blog — 3 articles shown on the home page, each opening a full article page'),
      B('Contact — enquiry form (saved to the admin inbox), address, phone, email and map'),

      H('5. Admin Dashboard'),
      P('A secure, password-protected admin panel lets the client manage all website content without any coding:'),
      B('Dashboard — overview counts and recent enquiries'),
      B('Enquiries — inbox of all contact/product enquiries (view, mark read/replied, delete)'),
      B('Products, Categories, Industries, Principals — full add / edit / delete with image upload'),
      B('Hero Slides & Blogs — manage homepage banners and articles'),
      B('Settings — company info, contact details, about text and statistics'),

      H('6. Key Features'),
      B('Fully responsive (mobile, tablet, desktop)'),
      B('Enquiry-based model suited to B2B chemical distribution (quote requests, not online payment)'),
      B('Manufacturer-wise product portfolio with tabs and detailed product view'),
      B('All content editable from the admin panel'),
      B('Custom VC monogram favicon and brand identity'),

      H('7. Deployment & Updates'),
      KV('Platform', 'Render (Blueprint: 1 web service + 1 PostgreSQL database)'),
      KV('Auto-setup', 'Database schema and initial data are created automatically on first deploy'),
      KV('Updates', 'Any code change pushed to GitHub is deployed to the live site'),
      KV('Recommendation', 'Upgrade to a paid plan for always-on performance and a permanent database'),

      H('8. Local Development'),
      P('The project also runs locally on a Windows PC (portable PostgreSQL included):'),
      KV('Start everything', 'Double-click start-all.bat (starts database, API and website)'),
      KV('Website', 'http://localhost:5190'),
      KV('Admin', 'http://localhost:5190/admin'),

      rule(),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 }, children: [new TextRun({ text: 'Prepared by Zero Dimensions', italics: true, color: GREY, size: 18 })] }),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync('C:\\Users\\Admin\\Desktop\\Virava Chemicals\\Virava-Chemicals-Documentation.docx', buf);
  console.log('DOCX created');
});
