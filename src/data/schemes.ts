import { GovernmentScheme } from '../types';

export const GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: 'pm-aasha',
    title: 'PM-AASHA (Pradhan Mantri Annadata Aay Sanraksan Abhiyan)',
    category: 'Price Support',
    beneficiary: 'All registered farmers growing Pulses, Oilseeds & Copra',
    highlight: 'Guaranteed MSP floor with Price Deficiency Payment',
    description: 'Comprises Price Support Scheme (PSS), Price Deficiency Payment Scheme (PDPS) and Pilot of Private Procurement & Stockist Scheme (PPSS). If mandi market price falls below MSP, government covers the gap or procures directly.',
    benefitsList: [
      'Direct purchase at 100% MSP if market price drops below benchmark',
      'Under PDPS: Direct DBT compensation of difference between MSP and market auction price up to 25% of MSP',
      'Electronic weighment and zero agent commission cuts'
    ],
    eligibility: [
      'Landholding farmer or registered tenant farmer',
      'Crop sowing registration on state portal (e.g. e-Uparjan, Meri Fasal Mera Byora, Bhoomi)',
      'Aadhaar-linked active bank account'
    ],
    howToApply: 'Register during sowing or pre-harvest season at nearest CSC (Common Service Center), PACS society, or state portal.',
    portalUrl: 'https://pmaasha.gov.in',
    helpline: '1800-180-1551 (Kisan Call Center)'
  },
  {
    id: 'enam',
    title: 'e-NAM (National Agriculture Market)',
    category: 'Market Access',
    beneficiary: 'Any farmer selling agricultural produce in connected APMC mandis',
    highlight: 'One Nation One Market - 1361+ Mandis Integrated',
    description: 'An online electronic trading platform connecting APMC mandis across 23 States and 4 UTs. Farmers can upload assaying reports, receive online bids from buyers across India, and receive direct payment to their bank account.',
    benefitsList: [
      'Access to interstate competitive bidding and wider trader base',
      'Free quality assaying testing at mandi lab',
      'Direct online bank settlement into your bank account within 24-48 hours',
      'Elimination of arbitrary trader deductions'
    ],
    eligibility: [
      'Farmer with APMC entry pass or registration',
      'Bank passbook and Aadhaar card'
    ],
    howToApply: 'Visit your nearest e-NAM enabled APMC gate with produce or pre-register on enam.gov.in / e-NAM mobile app.',
    portalUrl: 'https://enam.gov.in',
    helpline: '1800-270-0224'
  },
  {
    id: 'enwr-pledge-finance',
    title: 'e-NWR Negotiable Warehouse Receipt Pledge Financing',
    category: 'Storage & Finance',
    beneficiary: 'Farmers with surplus grain who wish to avoid distress harvest sale',
    highlight: 'Avoid distress sale: Store produce & get 75% loan at 7% interest',
    description: 'Under WDRA (Warehousing Development and Regulatory Authority), farmers can store grains in registered warehouses, receive a digital e-NWR, and borrow up to 75% of the produce value from commercial banks at concessional interest.',
    benefitsList: [
      'Loan up to 75% of current market value of deposited produce',
      'Interest subvention: Concessional interest rate around 7% per annum',
      'Hold produce for 3 to 9 months until off-season prices rise by ₹150-₹300/qtl',
      'Grain is scientifically insured against moisture, pests, and fire'
    ],
    eligibility: [
      'Crop quality conforms to WDRA grade specifications (moisture < 12-14%)',
      'Valid farmer ID and Aadhaar'
    ],
    howToApply: 'Deposit stock in WDRA accredited warehouse (CWC, SWC or private registered godown). Warehouse issues e-NWR in repository (e-NWR/NeRL/CDSL) and applies to bank.',
    portalUrl: 'https://wdra.gov.in',
    helpline: '011-49536495'
  },
  {
    id: 'pmksy-storage',
    title: 'Agriculture Infrastructure Fund (AIF) & Post-Harvest Storage',
    category: 'Storage & Finance',
    beneficiary: 'Individual farmers, FPOs, PACS, and Agri-entrepreneurs',
    highlight: '3% Interest Subvention for building farm-gate godowns & dryers',
    description: 'Medium-long term debt financing for investment in viable projects for post-harvest management infrastructure and community farming assets.',
    benefitsList: [
      '3% per annum interest subvention up to a limit of ₹2 Crore for up to 7 years',
      'CGTMSE credit guarantee fee coverage',
      'Assistance for farm-gate sorting, grading, solar dryers and cold rooms'
    ],
    eligibility: [
      'Primary Agricultural Credit Societies (PACS), FPOs, Agri-entrepreneurs, Individual Farmers'
    ],
    howToApply: 'Apply online on the Agri Infra Fund portal (agriinfra.dac.gov.in).',
    portalUrl: 'https://agriinfra.dac.gov.in',
    helpline: '011-23381012'
  },
  {
    id: 'pm-kisan',
    title: 'PM-KISAN Samman Nidhi',
    category: 'Direct Benefit',
    beneficiary: 'All landholding farmer families across India',
    highlight: '₹6,000 per year directly to bank account in 3 installments',
    description: 'Direct income support of ₹6,000 per year in three equal installments of ₹2,000 directly into the bank accounts of landholder farmer families.',
    benefitsList: [
      'Unconditional liquidity support before sowing and harvest cycles',
      '100% Central funding via Direct Benefit Transfer (DBT)',
      'Helps finance transport, bagging, and harvesting fuel expenses'
    ],
    eligibility: [
      'Landholding farmer families with cultivable land in land records',
      'e-KYC completed on PM-KISAN portal'
    ],
    howToApply: 'Self-registration through PM-KISAN portal or nearest CSC center.',
    portalUrl: 'https://pmkisan.gov.in',
    helpline: '155261 / 011-24300606'
  }
];
