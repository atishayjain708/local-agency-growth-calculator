# Implementation Plan: Local Agency Growth Calculator

## Executive Summary

This document outlines the implementation plan for building a multi-step, mobile-friendly web application that helps SEO/PPC agencies estimate potential new clients and MRR from an outbound system. The app uses a transparent calculation model based on industry-specific data and user inputs.

---

## 1. Technology Stack

### Core Framework
- **React 18+** (with TypeScript)
- **Next.js 14+** (App Router) - for routing, SSR, and build optimization
- **React Context API** - for state management (or Zustand for simpler state)

### UI/Styling
- **Tailwind CSS** - for responsive, mobile-first styling
- **Headless UI** or **Radix UI** - for accessible form components
- **Framer Motion** - for micro-animations on process visualization

### Form Handling
- **React Hook Form** - for form validation and state
- **Zod** - for schema validation

### Data Management
- **CSV to JSON conversion** - at build time or via API route
- **JSON config files** - for industry data and global constants

### Testing
- **Jest** + **React Testing Library** - for unit and component tests
- **Vitest** (alternative) - faster test runner

### Build & Deploy
- **Vercel** or **Netlify** - for hosting
- **GitHub Actions** - for CI/CD (optional)

---

## 2. Project Structure

```
hyperke-seo-agency-walkthrough/
├── public/
│   ├── data/
│   │   ├── industries.csv
│   │   └── industries.json (generated)
│   └── config/
│       └── global-config.json
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Landing page
│   │   └── calculator/
│   │       └── page.tsx        # Calculator wizard
│   ├── components/
│   │   ├── wizard/
│   │   │   ├── WizardLayout.tsx
│   │   │   ├── ProgressIndicator.tsx
│   │   │   └── StepNavigation.tsx
│   │   ├── steps/
│   │   │   ├── LandingStep.tsx
│   │   │   ├── IndustryStep.tsx
│   │   │   ├── IndustrySizeStep.tsx
│   │   │   ├── CaseStudyStep.tsx
│   │   │   ├── PricingStep.tsx
│   │   │   ├── CloseRateStep.tsx
│   │   │   ├── VolumeStep.tsx
│   │   │   ├── CapacityStep.tsx
│   │   │   ├── ProcessStep.tsx
│   │   │   └── ResultsStep.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Slider.tsx
│   │   │   ├── RadioGroup.tsx
│   │   │   ├── Autocomplete.tsx
│   │   │   └── Collapsible.tsx
│   │   └── shared/
│   │       └── NumberDisplay.tsx
│   ├── lib/
│   │   ├── calculator/
│   │   │   ├── calculatorService.ts    # Core calculation logic
│   │   │   ├── types.ts                 # TypeScript interfaces
│   │   │   └── constants.ts             # Global constants
│   │   ├── data/
│   │   │   ├── loadIndustries.ts        # Load industry data
│   │   │   └── loadConfig.ts            # Load global config
│   │   └── utils/
│   │       ├── formatters.ts            # Number/currency formatting
│   │       └── validators.ts            # Validation helpers
│   ├── context/
│   │   └── CalculatorContext.tsx        # Global state management
│   ├── hooks/
│   │   ├── useCalculator.ts             # Calculator logic hook
│   │   └── useStepNavigation.ts         # Step navigation logic
│   └── types/
│       └── index.ts                      # Shared TypeScript types
├── tests/
│   ├── calculator/
│   │   └── calculatorService.test.ts
│   └── components/
│       └── __tests__/
├── scripts/
│   └── convert-csv-to-json.ts           # Build-time CSV conversion
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

---

## 3. Data Models & Configuration

### 3.1 Industry Data Structure

**File:** `public/data/industries.csv` → `industries.json`

```typescript
interface IndustryConfig {
  industry_key: string;                    // e.g., "plumbers"
  industry_display_name: string;            // e.g., "Plumbers"
  industry_plural_label: string;            // e.g., "plumbers"
  estimated_business_count: number;         // e.g., 50000
  pcpl_min: number;                         // e.g., 400
  pcpl_max: number;                         // e.g., 600
  starter_volume_default: number;          // e.g., 10000
  max_suggested_volume?: number;            // Optional
  example_text?: string;                    // e.g., "across the United States"
  notes?: string;
}
```

### 3.2 Global Configuration

**File:** `public/config/global-config.json`

```json
{
  "lead_to_appointment_rate": 0.4,
  "max_touches_per_business": 2,
  "case_study_multipliers": {
    "none": 1.2,
    "some": 1.0,
    "strong": 0.8
  },
  "default_pcpl_min": 450,
  "default_pcpl_max": 650,
  "volume_slider": {
    "min": 5000,
    "max_default": 50000
  },
  "capacity_slider": {
    "min": 4,
    "max": 40,
    "default": 10
  },
  "close_rate_options": [0.1, 0.2, 0.3, 0.4],
  "close_rate_default": 0.2,
  "calendly_url": "https://calendly.com/your-link"
}
```

### 3.3 Calculator State

```typescript
interface CalculatorState {
  // User inputs
  industry: IndustryConfig | null;
  service_type: 'SEO' | 'Google Ads' | 'Website design or dev' | 'Multi service' | 'Other';
  case_study_strength: 'none' | 'some' | 'strong';
  case_study_text?: string;
  price_low: number;
  price_high: number;
  close_rate: number;
  prospects_per_month: number;
  capacity_calls_per_month: number;
  
  // Calculated outputs
  calculations: {
    pcpl_min_adj: number;
    pcpl_max_adj: number;
    pcpl_mid: number;
    leads_min: number;
    leads_max: number;
    leads_mid: number;
    appointments_min: number;
    appointments_max: number;
    appointments_mid: number;
    clients_min: number;
    clients_max: number;
    clients_mid: number;
    mrr_low: number;
    mrr_high: number;
    annual_low: number;
    annual_high: number;
  } | null;
  
  // UI state
  currentStep: number;
  isCalculating: boolean;
}
```

---

## 4. Core Calculation Logic

### 4.1 Calculator Service Module

**File:** `src/lib/calculator/calculatorService.ts`

This module will contain pure functions (no side effects) for all calculations:

1. **`getAdjustedPCPL(industry, caseStudyStrength, globalConfig)`**
   - Returns adjusted PCPL min/max based on case study multiplier

2. **`calculateLeadRange(prospectsPerMonth, pcplMinAdj, pcplMaxAdj)`**
   - Returns leads_min, leads_max, leads_mid

3. **`calculateAppointmentRange(leadsMin, leadsMax, leadsMid, leadToAppointmentRate)`**
   - Returns appointments_min, appointments_max, appointments_mid

4. **`calculateClientRange(appointmentsMin, appointmentsMax, appointmentsMid, closeRate)`**
   - Returns clients_min, clients_max, clients_mid

5. **`calculateMRRRange(clientsMin, clientsMax, priceLow, priceHigh)`**
   - Returns mrr_low, mrr_high, annual_low, annual_high

6. **`calculateAll(state, industryConfig, globalConfig)`**
   - Main orchestrator function that runs all calculations
   - Returns complete calculation results

### 4.2 Calculation Flow

```
User Inputs → Adjusted PCPL → Lead Range → Appointment Range → Client Range → MRR Range
```

**Key Formulas:**
- `pcpl_min_adj = pcpl_min_base * case_study_multiplier`
- `leads_min = round(prospects_per_month / pcpl_max_adj)`
- `appointments_min = round(leads_min * lead_to_appointment_rate)`
- `clients_min = max(1, round(appointments_min * close_rate))`
- `mrr_low = clients_min * price_low`

---

## 5. Component Architecture

### 5.1 Wizard Layout Component

**Responsibility:** Manages step navigation, progress indicator, and overall wizard flow.

**Features:**
- Progress dots/bar at top
- Back/Next button logic
- Step validation before advancing
- Mobile-optimized layout

### 5.2 Step Components

Each step component will:
- Accept current state and update handlers via context
- Validate inputs before allowing next step
- Show appropriate error messages
- Be fully responsive

**Key Steps:**

1. **LandingStep** - Hero section with CTA button
2. **IndustryStep** - Autocomplete + service type selector
3. **IndustrySizeStep** - Display TAM, confirmation screen
4. **CaseStudyStep** - Radio buttons + optional textarea
5. **PricingStep** - Two number inputs with validation
6. **CloseRateStep** - Segmented control or slider
7. **VolumeStep** - Slider with live calculation preview
8. **CapacityStep** - Slider for sales capacity
9. **ProcessStep** - Timeline visualization
10. **ResultsStep** - Results display with breakdown and CTA

### 5.3 Reusable UI Components

- **Button** - Primary/secondary variants
- **Input** - Text and number inputs with validation
- **Slider** - Custom slider component with labels
- **RadioGroup** - Accessible radio button groups
- **Autocomplete** - Industry search with suggestions
- **Collapsible** - For "How we calculated this" section
- **NumberDisplay** - Formatted number/currency display

---

## 6. State Management

### 6.1 Calculator Context

**File:** `src/context/CalculatorContext.tsx`

- Provides global state for all calculator inputs and outputs
- Exposes update functions for each input field
- Triggers recalculation when relevant inputs change
- Persists state to localStorage (optional, for user convenience)

### 6.2 Custom Hooks

- **`useCalculator()`** - Wraps calculator service, handles state updates
- **`useStepNavigation()`** - Manages step flow, validation, navigation

---

## 7. Routing & Navigation

### 7.1 Route Structure

- `/` - Landing page (Screen 0)
- `/calculator` - Main calculator wizard (Screens 1-10)
  - Uses query params or state to track current step
  - Or use URL segments: `/calculator/step/[stepNumber]`

### 7.2 Navigation Logic

- **Forward navigation:** Validate current step → Update state → Move to next step
- **Backward navigation:** Allow going back, preserve state
- **Direct URL access:** Redirect to appropriate step or start

---

## 8. Styling Approach

### 8.1 Design System

- **Colors:** Professional, trustworthy palette (blues, grays)
- **Typography:** Clear hierarchy, readable on mobile
- **Spacing:** Consistent spacing scale (Tailwind defaults)
- **Cards:** Elevated cards for content sections
- **Buttons:** Large touch targets (min 44x44px on mobile)

### 8.2 Mobile-First Strategy

- Stack all elements vertically on mobile
- Large, tappable buttons
- Minimal typing required
- Progress indicator always visible
- Fixed CTA button at bottom (sticky)

### 8.3 Responsive Breakpoints

- Mobile: < 640px (default)
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## 9. Implementation Phases

### Phase 1: Foundation (Days 1-2)
- [ ] Set up Next.js project with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Create project structure
- [ ] Set up data models and types
- [ ] Create sample industry CSV and convert to JSON
- [ ] Create global config JSON
- [ ] Set up Calculator Context

### Phase 2: Core Logic (Days 3-4)
- [ ] Implement calculator service module
- [ ] Write unit tests for all calculation functions
- [ ] Create data loading utilities
- [ ] Test calculation logic with sample data

### Phase 3: UI Components (Days 5-7)
- [ ] Build reusable UI components (Button, Input, Slider, etc.)
- [ ] Create WizardLayout component
- [ ] Build ProgressIndicator component
- [ ] Implement all step components (1-10)
- [ ] Add form validation

### Phase 4: Integration (Days 8-9)
- [ ] Connect components to Calculator Context
- [ ] Implement step navigation logic
- [ ] Add live calculation updates (especially on VolumeStep)
- [ ] Implement results display with breakdown
- [ ] Add Calendly integration for CTA

### Phase 5: Polish & Testing (Days 10-11)
- [ ] Mobile responsiveness testing
- [ ] Cross-browser testing
- [ ] Add micro-animations (Framer Motion)
- [ ] Polish UI/UX details
- [ ] Accessibility audit (WCAG compliance)
- [ ] Performance optimization

### Phase 6: Data & Deployment (Day 12)
- [ ] Populate industry CSV with real data
- [ ] Tune PCPL values to match target ranges (8-12 appointments at 10k prospects)
- [ ] Set up production build
- [ ] Deploy to hosting platform
- [ ] Final QA and bug fixes

---

## 10. Testing Strategy

### 10.1 Unit Tests
- **Calculator Service:** Test all calculation functions with edge cases
- **Data Loading:** Test CSV to JSON conversion
- **Validators:** Test form validation logic

### 10.2 Component Tests
- Test each step component renders correctly
- Test form inputs update state
- Test validation errors display
- Test navigation between steps

### 10.3 Integration Tests
- Test complete user flow from landing to results
- Test calculation updates when inputs change
- Test Calendly link generation with correct params

### 10.4 Manual Testing Checklist
- [ ] All steps work on mobile (iOS Safari, Chrome)
- [ ] All steps work on desktop (Chrome, Firefox, Safari)
- [ ] Calculations are accurate
- [ ] Progress indicator updates correctly
- [ ] Back button works on all steps
- [ ] Form validation prevents invalid submissions
- [ ] Results page displays all data correctly
- [ ] Calendly link opens with correct parameters

---

## 11. Key Implementation Details

### 11.1 Industry Autocomplete
- Load industry list from JSON
- Filter as user types
- Allow free text (mark as custom_industry)
- Use default PCPL for unknown industries

### 11.2 Live Calculation on Volume Step
- Recalculate on every slider change
- Display ranges immediately
- Show TAM warning if volume exceeds limit
- Use debouncing if performance is an issue

### 11.3 Results Breakdown
- Collapsible section (default closed)
- Plain language explanation
- Use mid-point values for explanation
- Include disclaimer

### 11.4 Calendly Integration
- Build URL with query parameters
- Include all relevant calculator inputs
- Open in new tab
- Format numbers appropriately for URL

### 11.5 TAM Validation
- Calculate max volume: `min(50000, estimated_business_count * max_touches_per_business)`
- Disable slider values above max
- Show warning message if user tries to exceed

---

## 12. Performance Considerations

- **Code Splitting:** Lazy load step components
- **Memoization:** Memoize calculation results
- **Debouncing:** Debounce slider inputs if needed
- **Image Optimization:** Use Next.js Image component
- **Bundle Size:** Tree-shake unused dependencies

---

## 13. Accessibility Requirements

- **Keyboard Navigation:** All interactive elements keyboard accessible
- **Screen Readers:** Proper ARIA labels
- **Focus Management:** Focus moves appropriately between steps
- **Color Contrast:** WCAG AA compliance
- **Form Labels:** All inputs have associated labels

---

## 14. Future Enhancements (Post-MVP)

- Save/load calculator state
- Email results to user
- A/B testing different copy variations
- Analytics tracking (user drop-off points)
- Multi-language support
- Print-friendly results page

---

## 15. Success Metrics

- **Completion Rate:** % of users who complete all steps
- **Time to Complete:** Average time from landing to results
- **CTA Click Rate:** % who click "Book a strategy call"
- **Mobile vs Desktop:** Usage split
- **Most Common Industries:** Which niches are most popular

---

## Next Steps

1. Review and approve this plan
2. Set up development environment
3. Begin Phase 1 implementation
4. Create initial data files (industry CSV, global config)
5. Start building core calculation logic

---

**Document Version:** 1.0  
**Last Updated:** [Current Date]  
**Status:** Ready for Implementation

