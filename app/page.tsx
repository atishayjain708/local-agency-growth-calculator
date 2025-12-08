'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { WizardLayout } from '@/components/wizard/WizardLayout';
import { LandingStep } from '@/components/steps/LandingStep';
import { IndustryStep } from '@/components/steps/IndustryStep';
import { IndustrySizeStep } from '@/components/steps/IndustrySizeStep';
import { CaseStudyStep } from '@/components/steps/CaseStudyStep';
import { PricingStep } from '@/components/steps/PricingStep';
import { CloseRateStep } from '@/components/steps/CloseRateStep';
import { VolumeStep } from '@/components/steps/VolumeStep';
import { CapacityStep } from '@/components/steps/CapacityStep';
import { ProcessStep } from '@/components/steps/ProcessStep';
import { ResultsStep } from '@/components/steps/ResultsStep';

const TOTAL_STEPS = 10;

export default function Home() {
  const {
    state,
    globalConfig,
    setIndustry,
    setServiceType,
    setCaseStudyStrength,
    setCaseStudyText,
    setPricing,
    setCloseRate,
    setProspectsPerMonth,
    setCapacity,
    nextStep,
    prevStep,
    recalculate,
  } = useCalculator();

  if (!globalConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calculator...</p>
        </div>
      </div>
    );
  }

  const canProceedFromStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return true;
      case 1:
        return state.industry !== null;
      case 2:
        return state.industry !== null;
      case 3:
        return true;
      case 4:
        return state.price_low > 0 && state.price_high > 0 && state.price_high >= state.price_low;
      case 5:
        return true;
      case 6:
        return state.industry !== null;
      case 7:
        return true;
      case 8:
        return true;
      case 9:
        return state.calculations !== null;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedFromStep(state.currentStep)) {
      nextStep();
    }
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return <LandingStep onStart={nextStep} />;
      
      case 1:
        return (
          <IndustryStep
            industry={state.industry}
            serviceType={state.service_type}
            onIndustryChange={setIndustry}
            onServiceTypeChange={setServiceType}
          />
        );
      
      case 2:
        if (!state.industry) {
          prevStep();
          return null;
        }
        return (
          <IndustrySizeStep
            industry={state.industry}
            onChangeIndustry={() => prevStep()}
          />
        );
      
      case 3:
        return (
          <CaseStudyStep
            caseStudyStrength={state.case_study_strength}
            caseStudyText={state.case_study_text}
            onCaseStudyStrengthChange={setCaseStudyStrength}
            onCaseStudyTextChange={setCaseStudyText}
          />
        );
      
      case 4:
        return (
          <PricingStep
            priceLow={state.price_low}
            priceHigh={state.price_high}
            onPricingChange={setPricing}
            minPrice={globalConfig.pricing.min}
            maxPrice={globalConfig.pricing.max}
          />
        );
      
      case 5:
        return (
          <CloseRateStep
            closeRate={state.close_rate}
            onCloseRateChange={setCloseRate}
          />
        );
      
      case 6:
        if (!state.industry) {
          prevStep();
          return null;
        }
        return (
          <VolumeStep
            industry={state.industry}
            prospectsPerMonth={state.prospects_per_month}
            calculations={state.calculations}
            onProspectsChange={setProspectsPerMonth}
            onRecalculate={recalculate}
            maxTouchesPerBusiness={globalConfig.max_touches_per_business}
            volumeMin={globalConfig.volume_slider.min}
            volumeMaxDefault={globalConfig.volume_slider.max_default}
          />
        );
      
      case 7:
        return (
          <CapacityStep
            capacity={state.capacity_calls_per_month}
            onCapacityChange={setCapacity}
            minCapacity={globalConfig.capacity_slider.min}
            maxCapacity={globalConfig.capacity_slider.max}
          />
        );
      
      case 8:
        if (!state.industry) {
          prevStep();
          return null;
        }
        return (
          <ProcessStep
            industry={state.industry}
            serviceType={state.service_type}
            prospectsPerMonth={state.prospects_per_month}
          />
        );
      
      case 9:
        if (!state.industry || !state.calculations) {
          prevStep();
          return null;
        }
        return (
          <ResultsStep
            industry={state.industry}
            serviceType={state.service_type}
            prospectsPerMonth={state.prospects_per_month}
            closeRate={state.close_rate}
            priceLow={state.price_low}
            priceHigh={state.price_high}
            capacity={state.capacity_calls_per_month}
            calculations={state.calculations}
            calendlyUrl={globalConfig.calendly_url}
          />
        );
      
      default:
        return <LandingStep onStart={nextStep} />;
    }
  };

  // Landing page doesn't use WizardLayout
  if (state.currentStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="w-full max-w-4xl">
          {renderStep()}
        </div>
      </div>
    );
  }

  return (
    <WizardLayout
      currentStep={state.currentStep}
      totalSteps={TOTAL_STEPS}
      onNext={handleNext}
      onPrev={prevStep}
      nextLabel={state.currentStep === 8 ? 'See your projected revenue' : 'Next'}
      showNext={state.currentStep !== 9}
      showPrev={state.currentStep > 0}
      nextDisabled={!canProceedFromStep(state.currentStep)}
    >
      {renderStep()}
    </WizardLayout>
  );
}

