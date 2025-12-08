# Testing Guide - Local Agency Growth Calculator

## Quick Start

The application is now running at: **http://localhost:3000**

## Testing Flow

Follow this step-by-step guide to test the complete user journey:

### Step 0: Landing Page
- ✅ Verify headline and subtext display correctly
- ✅ Click "Start the calculator" button
- ✅ Should navigate to Step 1

### Step 1: Industry Selection
- ✅ Type in the industry autocomplete (try "plumbers", "dentists", etc.)
- ✅ Select an industry from the dropdown
- ✅ Verify business count shows in dropdown
- ✅ Select a service type (SEO, Google Ads, etc.)
- ✅ Click "Next"

### Step 2: Market Size Confirmation
- ✅ Verify industry name displays correctly
- ✅ Verify business count shows with proper formatting
- ✅ Test "Change industry" button (should go back to Step 1)
- ✅ Click "Next"

### Step 3: Case Study Strength
- ✅ Select each radio option (none, some, strong)
- ✅ Optionally enter text in the case study field
- ✅ Click "Next"

### Step 4: Pricing Range
- ✅ Enter low-end pricing (e.g., 1000)
- ✅ Enter high-end pricing (e.g., 3000)
- ✅ Try invalid inputs:
  - High < Low (should show error)
  - Values outside range (should show error)
- ✅ Click "Next"

### Step 5: Close Rate
- ✅ Select different close rate options (10%, 20%, 30%, 40%)
- ✅ Verify selection highlights correctly
- ✅ Click "Next"

### Step 6: Volume Slider ⭐ (Key Step)
- ✅ Move the volume slider
- ✅ Verify live calculations update in real-time:
  - Leads range updates
  - Appointments range updates
  - New clients range updates
- ✅ Test TAM warning (set very high volume if possible)
- ✅ Click "Next"

### Step 7: Sales Capacity
- ✅ Adjust capacity slider (4-40 calls)
- ✅ Verify value updates correctly
- ✅ Click "Next"

### Step 8: Process Visualization
- ✅ Verify all 4 process steps display
- ✅ Check that industry name and service type appear in descriptions
- ✅ Verify prospects count appears correctly
- ✅ Click "See your projected revenue"

### Step 9: Results Page ⭐⭐ (Most Important)
- ✅ Verify input echo displays all your selections
- ✅ Check Pipeline Numbers section:
  - Prospects contacted
  - Leads range
  - Appointments range
  - New clients range
- ✅ Check Revenue Impact section:
  - MRR range displays correctly
  - Annual revenue calculates correctly (MRR × 12)
- ✅ Test capacity warning (if applicable)
- ✅ Click "Show how we calculated these estimates"
  - Verify breakdown shows all calculation steps
  - Check that it uses correct formulas
- ✅ Click "Book a strategy call" button
  - Should open Calendly in new tab
  - URL should include query parameters with all data

## Mobile Testing

### Desktop View (> 1024px)
- ✅ Layout looks clean and spacious
- ✅ Progress indicator visible at top
- ✅ Navigation buttons in appropriate positions

### Tablet View (640px - 1024px)
- ✅ Components stack appropriately
- ✅ Text remains readable
- ✅ Touch targets are adequate

### Mobile View (< 640px)
- ✅ All text is readable without horizontal scroll
- ✅ Progress dots display correctly
- ✅ Buttons are large enough for touch (minimum 44px)
- ✅ Forms are easy to fill on mobile
- ✅ Navigation buttons remain accessible
- ✅ Slider works smoothly with touch

## Calculation Verification

Use these test scenarios to verify calculations:

### Scenario 1: Dentists with Strong Case Studies
- Industry: Dentists
- Service: SEO
- Case Studies: Strong (0.8 multiplier)
- Pricing: $2,000 - $4,000
- Close Rate: 20%
- Volume: 10,000 prospects

**Expected Results:**
- Base PCPL for dentists: 350-550
- Adjusted PCPL: 280-440 (multiplied by 0.8)
- Leads: ~23-36 per month
- Appointments: ~9-14 per month (40% of leads)
- Clients: ~2-3 per month (20% of appointments)
- MRR: ~$4,000-$12,000

### Scenario 2: Plumbers with No Case Studies
- Industry: Plumbers
- Service: Google Ads
- Case Studies: None (1.2 multiplier)
- Pricing: $1,500 - $3,000
- Close Rate: 30%
- Volume: 15,000 prospects

**Expected Results:**
- Base PCPL: 400-600
- Adjusted PCPL: 480-720 (multiplied by 1.2)
- Leads: ~21-31 per month
- Appointments: ~8-12 per month
- Clients: ~2-4 per month (30% close rate)
- MRR: ~$3,000-$12,000

## Edge Cases to Test

1. **Unknown Industry**
   - Type a custom industry not in the list
   - Should use default PCPL values (450-650)

2. **Very High Volume**
   - Set volume above TAM limit
   - Should show warning message

3. **Very Low Pricing**
   - Try pricing below $200
   - Should validate properly

4. **Back Button Navigation**
   - Navigate to any step
   - Click "Back" button
   - Should preserve all entered data

5. **Zero/Negative Values**
   - Try entering 0 or negative in pricing
   - Should handle gracefully

## Browser Testing

Test on these browsers:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

## Performance Checks

- ✅ Initial page load < 3 seconds
- ✅ Slider interactions feel smooth (no lag)
- ✅ Step transitions are quick
- ✅ No console errors
- ✅ No layout shifts (CLS)

## Accessibility Checks

- ✅ Tab through all interactive elements
- ✅ All buttons keyboard accessible
- ✅ Form labels associated with inputs
- ✅ Focus states visible
- ✅ Color contrast meets WCAG AA
- ✅ Screen reader friendly (test with VoiceOver/NVDA)

## Known Limitations (Expected)

1. Calendly URL uses placeholder - update in `public/config/global-config.json`
2. Favicon is placeholder - replace `app/favicon.ico`
3. No persistence - refreshing page resets state (add localStorage if needed)

## Bug Reporting

If you find issues, note:
1. What step you were on
2. What you did
3. What you expected
4. What actually happened
5. Browser and device info

## Next Steps for Production

- [ ] Update Calendly URL in config
- [ ] Add real favicon
- [ ] Fine-tune PCPL values based on real data
- [ ] Add analytics tracking
- [ ] Set up error monitoring (Sentry)
- [ ] Add loading states for slow connections
- [ ] Consider adding localStorage for state persistence
- [ ] Add meta tags for SEO and social sharing
- [ ] Set up proper domain and hosting

---

**Status**: ✅ Application fully functional and ready for testing!

