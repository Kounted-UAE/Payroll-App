// components/home/hero-section/hero-section.tsx

'use client'

export function HeroSection() {
  return (
    <section className={'mx-auto max-w-7xl px-[32px] relative flex items-center justify-between mt-16 mb-12'}>
      <div className={'text-center w-full '}>
        <h1 className={'text-[48px] leading-[48px] md:text-[80px] md:leading-[80px] tracking-[-1.6px] font-medium'}>
          Advontier's Backyard </h1>
          <h2 className="text-lg sm:text-6xl font-medium sm:font-normal tracking-tight leading-tight text-brand-charcoal dark:text-white">
            Where we take <span className="bg-blue-500">complete ownership</span> of our operational and compliance requirements.
          </h2>
          <br />        
        <p className={'mt-6 text-[18px] leading-[27px] md:text-[20px] md:leading-[30px]'}>
          Welcome to the Sheet Show
        </p>
      </div>
    </section>
  );
}
