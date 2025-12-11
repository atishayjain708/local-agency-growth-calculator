# Local Agency Growth Calculator

A multi-step, mobile-friendly web application that helps SEO, PPC, and web agencies estimate potential new clients and MRR from an outbound system.

## Features

- 🎯 **10-Step Wizard Flow** - Guided experience from landing to results
- 📊 **Real-time Calculations** - Live estimates based on industry data
- 📱 **Mobile-First Design** - Fully responsive and touch-optimized
- 🔍 **Industry-Specific Data** - Tailored estimates for 15+ local service industries
- 💰 **MRR Projections** - Calculate potential monthly and annual revenue
- 🎨 **Modern UI** - Clean, professional design with smooth animations
- ♿ **Accessible** - Built with WCAG compliance in mind

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main calculator page
│   └── globals.css        # Global styles
├── components/
│   ├── steps/             # Individual wizard steps
│   ├── ui/                # Reusable UI components
│   ├── wizard/            # Wizard layout components
│   └── shared/            # Shared components
├── context/               # React context for state management
├── lib/
│   ├── calculator/        # Calculation logic
│   ├── data/              # Data loading utilities
│   └── utils/             # Helper functions
├── public/
│   ├── config/            # Global configuration
│   └── data/              # Industry data (CSV)
└── types/                 # TypeScript type definitions
```

## Configuration

### Industry Data

Edit `public/data/industries.csv` to add or modify industries. Each industry includes:
- Display name and plural label
- Estimated business count (TAM)
- PCPL (Prospects per Lead) min/max ranges
- Default volume settings

### Global Config

Edit `public/config/global-config.json` to adjust:
- Lead-to-appointment conversion rate
- Case study multipliers
- Slider ranges and defaults
- Calendly booking URL

## Calculation Logic

The calculator uses a transparent model:

1. **PCPL Adjustment** - Base PCPL × case study multiplier
2. **Lead Range** - Prospects ÷ PCPL (min/max)
3. **Appointments** - Leads × 40% conversion rate
4. **Clients** - Appointments × user's close rate
5. **MRR** - Clients × pricing range

All calculations are in `lib/calculator/calculatorService.ts`.

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Quick Start

**Local Development:**
```bash
npm run dev
# Visit http://localhost:3000
```

**Deploy to VPS:**
```bash
./deploy-with-auto-port.sh
# Automatically finds free port, deploys, and starts
# Visit http://137.74.43.93
```

**Check Deployment:**
```bash
./check-deployed-port.sh
```

See `DEPLOYMENT.md` for complete deployment guide and `PORT_MANAGEMENT.md` for port management details.

## Technologies

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod

## License

MIT

## Support

For questions or issues, please open a GitHub issue.

