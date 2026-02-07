# Lirra Dashboard - Business Automation Hub

An all-in-one automation platform for small businesses to manage bookkeeping, product labels, catalog photos, WhatsApp AI replies, and analytics.

## Features

###   Auto Bookkeeping

- Automated income and expense recording
- Receipt upload with automatic data extraction
- Financial summaries (daily, weekly, monthly)
- Profit and loss statements
- Transaction categorization

###  ️ Label Generator

- Ready-to-use templates
- Logo upload with auto-design adaptation
- Color and font customization
- Auto-generated product information
- Export in print-ready formats (PNG, PDF, SVG)

###   Catalog Photo Enhancer

- Automatic background removal
- Lighting and color correction
- Marketplace-ready dimensions
- Batch processing

###   WhatsApp AI Reply

- AI-powered customer responses
- Product catalog integration
- Quick reply templates
- Multilingual support
- Working hours configuration

###   Analytics Dashboard

- Sales charts and trends
- Top-selling products analysis
- Peak inquiry hours tracking
- Stock predictions
- Business health score

###   Multi-Store Management

- Tokopedia integration
- Shopee integration
- Instagram connection
- WhatsApp Business sync
- Unified dashboard

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx      # Main navigation sidebar
│   │   └── Header.tsx       # Top header bar
│   └── index.ts
├── pages/
│   ├── LandingPage.tsx      # Marketing landing page
│   ├── OnboardingPage.tsx   # User setup wizard
│   ├── Dashboard.tsx        # Main dashboard overview
│   ├── Bookkeeping.tsx      # Financial management
│   ├── LabelGenerator.tsx   # Product label creator
│   ├── CatalogEnhancer.tsx  # Photo enhancement tool
│   ├── WhatsAppAI.tsx       # AI chat automation
│   ├── Analytics.tsx        # Business analytics
│   ├── Settings.tsx         # App settings
│   └── index.ts
├── types/
│   └── index.ts             # TypeScript interfaces
├── utils/
├── App.tsx                  # Main app component
├── main.tsx                 # App entry point
└── index.css                # Global styles

```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Install required packages
npm install lucide-react

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Pages Overview

1. **Landing Page** - Convince users with features and testimonials
2. **Onboarding** - 3-step setup wizard for business configuration
3. **Dashboard** - Overview of daily sales, chats, expenses, and notifications
4. **Bookkeeping** - Transaction management and financial reports
5. **Label Generator** - Create custom product labels
6. **Catalog Enhancer** - AI-powered photo enhancement
7. **WhatsApp AI** - Automated customer chat responses
8. **Analytics** - Comprehensive business insights
9. **Settings** - Profile, integrations, billing, and preferences

## License

MIT

// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
