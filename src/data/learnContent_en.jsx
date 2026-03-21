import React from 'react';

export const enChapters = [
  {
    id: 'what-is-a-sip',
    title: 'What is a SIP?',
    byline: 'The Autopilot Engine for Middle-Class Wealth',
    content: (
      <>
        <h3 className="font-serif text-2xl text-on-surface mb-3">The Gym Membership Paradox</h3>
        <p className="mb-4">Every January, millions of people buy an expensive, annual gym membership. They are highly motivated for exactly fourteen days. By February, the gym is empty, but their bank account is still lighter. Now, imagine a different scenario: What if, instead of relying on your fragile willpower to go to the gym, a trainer came to your house, took exactly 15 minutes of your time, and guaranteed you would be fit in five years? You wouldn’t have to think; you just have to <em>not cancel</em>.</p>
        <p className="mb-8">This is exactly what a Systematic Investment Plan (SIP) does for your financial fitness. Human beings are terrible at manually saving large chunks of money—there is always a new phone to buy or a vacation to take. A SIP removes your brain from the equation entirely.</p>
        
        <h3 className="font-serif text-xl text-on-surface mb-3 border-b border-[rgba(255,255,255,0.05)] pb-2">The Mechanics: How a SIP Actually Works</h3>
        <p className="mb-8">A SIP is not an investment product. You cannot "buy a SIP." A SIP is simply an instruction, a financial mandate, that you give to your bank. You are telling your bank: <em>"On the 5th of every month, before I can spend it on pizza or shoes, automatically extract ₹5,000 and deploy it into my chosen Mutual Fund."</em></p>

        <h3 className="font-serif text-xl text-on-surface mb-3 border-b border-[rgba(255,255,255,0.05)] pb-2">The Twin Engines of a SIP</h3>
        <p className="mb-4">To understand why this boring, automated process creates millionaires, you need to look under the hood at its two main engines:</p>
        
        <h4 className="font-semibold text-mango-text mb-2 mt-4">1. The Eighth Wonder: Compound Interest</h4>
        <p className="mb-6">If you invest ₹10,000 every month for 20 years at a 12% annual return, your total out-of-pocket investment is ₹24 Lakhs. But the final value of your portfolio? <strong>Nearly ₹1 Crore.</strong> Where did the extra ₹76 Lakhs come from? In the first few years, your money earns a profit. But in the later years, <em>your profits start earning their own profits</em>. The math goes parabolic. The money you made in Year 5 is working night shifts for you in Year 15. The secret to compounding isn't the amount you invest; it is the <em>time</em> you allow it to bake.</p>

        <h4 className="font-semibold text-mango-text mb-2 mt-4">2. The "Honest SIP" Reality Check: Direct vs. Regular Plans</h4>
        <p className="mb-3">This is the single biggest trap for beginners. Every mutual fund has two doors you can enter through:</p>
        <ul className="list-disc pl-5 mb-8 space-y-3 text-on-surface-var">
          <li><strong>Regular Plan (The Middleman Door):</strong> If you invest via a bank agent or a traditional broker, they put you in a "Regular" plan. You don't pay an upfront fee, but the mutual fund company silently deducts 1% to 1.5% of your total wealth every single year and pays it to the broker as a commission. Over 20 years, this "tiny" 1% fee will eat away nearly <strong>20% of your total final wealth</strong>.</li>
          <li><strong>Direct Plan (The Honest Door):</strong> You bypass the broker. No commissions are paid. That 1.5% stays in your account and compounds. Platforms like Honest SIP champion the Direct Plan because your money should work for <em>you</em>, not for a bank manager's yacht fund.</li>
        </ul>
        <p className="italic opacity-70 border-l-2 border-[rgba(255,183,125,0.5)] pl-4 py-2 mt-6 bg-[rgba(255,255,255,0.02)] rounded-r-lg">Now that your money is on autopilot, you might be wondering, "Why can't I just keep my money safe in a bank account?" To answer that, we need to meet the silent thief hiding in your wallet...</p>
      </>
    ),
    quiz: {
      question: "When you automate your investments through a SIP, choosing a ________ mutual fund ensures that zero commissions are paid to middlemen, allowing your wealth to compound significantly faster over the long term.",
      options: ["Regular", "Direct", "Guaranteed", "Lumpsum"],
      answer: 1 // index of Direct
    }
  },
  {
    id: 'inflation',
    title: 'Inflation',
    byline: 'The Invisible Pickpocket in Your Savings Account',
    content: (
      <>
        <h3 className="font-serif text-2xl text-on-surface mb-3">The Parle-G Phenomenon</h3>
        <p className="mb-8">If you grew up in India, you know the iconic Parle-G biscuit packet. Twenty years ago, a ₹5 packet was thick, bulky, and could feed a group of kids. Today, you still hand the shopkeeper a ₹5 coin, and you still get a Parle-G packet. But hold it in your hand. It’s significantly smaller, lighter, and contains half the biscuits. The price didn’t change, but the <em>value</em> of your ₹5 coin was sliced in half. This is called "Shrinkflation," and it is the most visible proof of a terrifying invisible force: Inflation.</p>
        
        <h3 className="font-serif text-xl text-on-surface mb-3 border-b border-[rgba(255,255,255,0.05)] pb-2">The Mathematics of Getting Poorer Safely</h3>
        <p className="mb-4">Inflation is the rate at which the general cost of living—rent, petrol, milk, school fees—rises over time. Historically, in developing economies like India, inflation hovers around 6% to 7% annually.</p>
        <p className="mb-4">Most beginners look at their bank accounts and think, <em>"I have ₹5 Lakhs sitting safely in my savings account earning 3% interest. I am not losing money."</em> This is the greatest optical illusion in personal finance. You must always calculate your <strong>Real Rate of Return</strong>.</p>
        
        <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg p-5 mb-6 text-center font-serif text-lg text-on-surface mt-5">
          <p className="opacity-70 text-sm mb-2 font-sans">The Formula That Matters</p>
          Nominal Return (What the bank pays)<br/> - Inflation (The rising cost of life)<br/> <strong className="text-mango-text mt-2 block">= Real Return (Your actual wealth growth)</strong>
        </div>

        <p className="mb-3">Let's do the math on "safe" investments:</p>
        <ul className="list-disc pl-5 mb-6 space-y-2 text-on-surface-var">
          <li><strong>Savings Account:</strong> You earn 3%. Inflation is 6%. Your Real Return is <strong>-3%</strong>.</li>
          <li><strong>Fixed Deposit (Post-Tax):</strong> You earn 5.5%. Inflation is 6%. Your Real Return is <strong>-0.5%</strong>.</li>
        </ul>
        <p className="mb-8 font-semibold text-red-300 opacity-90">You are literally losing purchasing power safely. If you hide ₹1 Lakh under your mattress today, in 10 years, it will still physically be ₹1 Lakh, but it will only buy you ₹50,000 worth of goods.</p>
        
        <h3 className="font-serif text-xl text-on-surface mb-3 border-b border-[rgba(255,255,255,0.05)] pb-2">Why You Must Invest to Survive</h3>
        <p className="mb-6">Investing is not a luxury for the rich; it is a survival mechanism for the middle class. To actually build wealth, your money <em>must</em> be parked in vehicles that grow faster than the inflation rate. If inflation is running at 6%, your portfolio needs to generate 10%, 12%, or 14% to ensure your future self can actually afford to live.</p>

        <p className="italic opacity-70 border-l-2 border-[rgba(255,183,125,0.5)] pl-4 py-2 mt-6 bg-[rgba(255,255,255,0.02)] rounded-r-lg">So, if cash and FDs are slowly making us poorer, where exactly do we deploy our SIPs to beat this invisible thief? We need to build an army...</p>
      </>
    ),
    quiz: {
      question: "If your fixed deposit gives you a 7% return, but the cost of education, healthcare, and groceries rises by 8% that same year, your ________ is -1%, meaning your money lost purchasing power.",
      options: ["Compound Interest", "Real Rate of Return", "Tax Bracket", "Expense Ratio"],
      answer: 1 // index of Real Rate of Return
    }
  },
  {
    id: 'asset-classes',
    title: 'Asset Classes',
    byline: 'Drafting Your Financial Cricket Team',
    content: (
      <>
        <h3 className="font-serif text-2xl text-on-surface mb-3">The All-Batsmen Blunder</h3>
        <p className="mb-8">Imagine the coach of the Indian Cricket Team deciding that since batters score the runs, he is going to send a playing 11 made entirely of aggressive openers like Rohit Sharma and Virat Kohli. No bowlers. No wicketkeeper. Just 11 batters. What happens? They might score 300 runs, but the opposing team will score 400 because there is no one to defend. Your money works the exact same way. If you put 100% of your money into high-risk stocks, you will be destroyed in a market crash. If you put 100% into safe FDs, inflation will beat you. You need a balanced team. In finance, the "players" are called Asset Classes.</p>

        <h3 className="font-serif text-xl text-on-surface mb-4 border-b border-[rgba(255,255,255,0.05)] pb-2">The Big Three Asset Classes</h3>
        <p className="mb-6">An asset class is a category of financial instruments that behave similarly. To build wealth safely, you need to deploy your SIPs across a mix of these three.</p>

        <h4 className="font-semibold text-mango-text mb-2 mt-4 flex items-center gap-2"><span className="text-2xl">🏏</span> 1. Equity (The Aggressive Batters)</h4>
        <ul className="list-none pl-1 mb-6 space-y-3 text-on-surface-var">
          <li>• <strong className="text-on-surface opacity-90">What it is:</strong> Buying shares in actual companies (like HDFC, TCS, or Reliance). When you buy an Equity Mutual Fund, a manager buys a basket of 50-100 of these companies for you.</li>
          <li>• <strong className="text-on-surface opacity-90">The Job:</strong> To score heavy runs. Equity is volatile, chaotic, and unpredictable in the short term. But over a 7-10 year horizon, it is the <em>only</em> asset class proven to consistently beat inflation by a wide margin (averaging 12-15%).</li>
        </ul>

        <h4 className="font-semibold text-mango-text mb-2 mt-6 flex items-center gap-2"><span className="text-2xl">🛡️</span> 2. Debt (The Defensive Bowlers)</h4>
        <ul className="list-none pl-1 mb-6 space-y-3 text-on-surface-var">
          <li>• <strong className="text-on-surface opacity-90">What it is:</strong> Government Bonds, Corporate Bonds, FDs, and PPF. Instead of <em>owning</em> a piece of a company, you are <em>lending</em> them your money. They are legally obligated to pay you a fixed interest rate, whether their business does well or not.</li>
          <li>• <strong className="text-on-surface opacity-90">The Job:</strong> To protect your capital. Debt funds will rarely beat inflation, but they won't crash 30% during a pandemic either. They provide the psychological comfort needed to not panic-sell your equity.</li>
        </ul>

        <h4 className="font-semibold text-mango-text mb-2 mt-6 flex items-center gap-2"><span className="text-2xl">🏆</span> 3. Gold (The Substitute Fielder)</h4>
        <ul className="list-none pl-1 mb-6 space-y-3 text-on-surface-var">
          <li>• <strong className="text-on-surface opacity-90">What it is:</strong> Physical gold, Sovereign Gold Bonds (SGBs), or Gold Mutual Funds.</li>
          <li>• <strong className="text-on-surface opacity-90">The Job:</strong> Crisis insurance. Gold doesn't produce anything (unlike a company that makes cars). However, it has an inverse relationship with equity. When the stock market crashes and panic sets in, investors flock to gold. Having 5-10% of your portfolio in gold acts as a shock absorber.</li>
        </ul>

        <p className="italic opacity-70 border-l-2 border-[rgba(255,183,125,0.5)] pl-4 py-2 mt-6 bg-[rgba(255,255,255,0.02)] rounded-r-lg">Now you know the players. But how do you decide how many batters and how many bowlers you need? That depends entirely on how strong your stomach is...</p>
      </>
    ),
    quiz: {
      question: "When you invest in ________, you become a partial owner of a business, making it a high-return, high-volatility asset class designed primarily to beat inflation.",
      options: ["Corporate Bonds", "Equity Mutual Funds", "Fixed Deposits", "Sovereign Gold Bonds"],
      answer: 1 
    }
  },
  {
    id: 'risk-appetite',
    title: 'Risk Appetite',
    byline: 'The "Sleep Well At Night" (SWAN) Metric',
    content: (
      <>
        <h3 className="font-serif text-2xl text-on-surface mb-3">The Highway Speed Limit Illusion</h3>
        <p className="mb-4">Imagine a 25-year-old guy, driving alone in a heavily insured, modern sports car on an empty highway. He has the ability to drive at 150 km/h. Now, take that exact same driver, but put his newborn baby in the backseat and a fragile, expensive antique vase in the trunk. Suddenly, his speed drops to 60 km/h. His driving skills didn't change. His <em>capacity</em> for a crash changed.</p>
        <p className="mb-8">In the investing world, people constantly confuse how much risk they <em>want</em> to take with how much risk they <em>can actually afford</em> to take.</p>

        <h3 className="font-serif text-xl text-on-surface mb-4 border-b border-[rgba(255,255,255,0.05)] pb-2">Risk Tolerance vs. Risk Capacity</h3>
        <p className="mb-6">Before you set up a SIP, you must accurately diagnose your Risk Appetite. It is built on two very different pillars:</p>

        <h4 className="font-semibold text-mango-text mb-2 mt-4">1. Risk Tolerance (The Psychological Pillar)</h4>
        <p className="mb-3 text-on-surface-var">This is purely emotional. It is your gut reaction to losing money. If you invest ₹1 Lakh, and tomorrow the market crashes and your app shows a value of ₹60,000, what do you do?</p>
        <ul className="list-disc pl-5 mb-6 space-y-2 text-on-surface-var">
          <li>If your heart races, you lose sleep, and you hit "Sell" to save the rest, you have <strong className="text-red-300">Low Risk Tolerance</strong>.</li>
          <li>If you delete the app, ignore the news, and continue your SIP because you know the market will recover in 5 years, you have <strong className="text-green-300">High Risk Tolerance</strong>.</li>
        </ul>

        <h4 className="font-semibold text-mango-text mb-2 mt-6">2. Risk Capacity (The Mathematical Pillar)</h4>
        <p className="mb-3 text-on-surface-var">This has nothing to do with your emotions. It is cold, hard math based on your life situation.</p>
        <ul className="list-disc pl-5 mb-6 space-y-3 text-on-surface-var">
          <li><strong>Time Horizon:</strong> If you need the invested money next year for your daughter's college fees, your risk capacity is ZERO. You cannot afford a market crash. If the money is for your retirement 25 years away, your capacity is massive.</li>
          <li><strong>Financial Liabilities:</strong> A 30-year-old bachelor with zero debt and a stable IT job has high risk capacity. A 30-year-old father paying a heavy home loan EMI as the sole breadwinner has low risk capacity.</li>
        </ul>

        <div className="bg-[rgba(255,183,125,0.05)] border border-[rgba(255,183,125,0.2)] rounded-lg p-5 mb-6 mt-8">
          <h4 className="text-lg font-serif text-on-surface mb-2">The Honest SIP Takeaway: Asset Allocation</h4>
          <p className="mb-4 text-sm text-on-surface-var">You combine Tolerance and Capacity to create your <strong>Asset Allocation</strong> (the ratio of Equity to Debt).</p>
          <ul className="text-sm space-y-2 mb-4">
            <li>🎯 <strong>Young, aggressive, debt-free:</strong> 80% Equity / 20% Debt.</li>
            <li>⚓ <strong>Nearing retirement, anxious:</strong> 30% Equity / 70% Debt.</li>
          </ul>
          <p className="font-medium text-mango-text text-sm">The goal of investing isn't just to get rich; it's to get rich while maintaining your "Sleep Well At Night" (SWAN) metric.</p>
        </div>

        <p className="italic opacity-70 border-l-2 border-[rgba(255,183,125,0.5)] pl-4 py-2 mt-6 bg-[rgba(255,255,255,0.02)] rounded-r-lg">Once you've decided you want Equity in your portfolio, you have to choose <em>which</em> mutual fund to buy. And this is where the financial industry tries to sell you an expensive illusion...</p>
      </>
    ),
    quiz: {
      question: "While Risk ________ is your psychological ability to stomach market drops without panicking, Risk Capacity is your mathematical ability to take risks based on your timeline and financial dependents.",
      options: ["Aversion", "Allocation", "Tolerance", "Profiling"],
      answer: 2 // Tolerance
    }
  },
  {
    id: 'active-vs-passive',
    title: 'Active vs. Passive Funds',
    byline: 'Why Boring is the New Brilliant',
    content: (
      <>
        <h3 className="font-serif text-2xl text-on-surface mb-3">The Traffic Jam Illusion</h3>
        <p className="mb-8">You are stuck in massive, bumper-to-bumper traffic on a 4-lane highway. You notice the lane next to you moving slightly faster. You aggressively cut into that lane. Two minutes later, your new lane stops completely, and your old lane starts moving. You keep switching lanes, burning fuel, stressing out, and risking an accident. Meanwhile, the guy who just stayed in the middle lane reaches the toll booth at the exact same time as you, but with half the blood pressure. Lane-switching is "Active Investing." Staying in the middle lane is "Passive Investing."</p>

        <h3 className="font-serif text-xl text-on-surface mb-3 border-b border-[rgba(255,255,255,0.05)] pb-2">Active Funds: The Quest for Alpha</h3>
        <p className="mb-4">An Active Mutual Fund is run by a highly paid, brilliant Fund Manager in a fancy suit. His entire job is to analyze companies, buy low, sell high, and "beat the market" (generate higher returns than the Nifty 50).</p>
        <ul className="list-disc pl-5 mb-8 space-y-3 text-on-surface-var">
          <li><strong>The Catch:</strong> Because of the manager's salary, the research team, and the constant trading, Active funds charge a high <strong>Expense Ratio</strong> (often 1% to 1.5% every year).</li>
          <li><strong>The Reality:</strong> The data is brutal. The SPIVA (S&P Indices Versus Active) scorecard repeatedly shows that over a 10-year horizon, roughly 70-80% of these genius fund managers actually <em>fail</em> to beat the simple market index.</li>
        </ul>

        <h3 className="font-serif text-xl text-on-surface mb-3 border-b border-[rgba(255,255,255,0.05)] pb-2">Passive (Index) Funds: Owning the Haystack</h3>
        <p className="mb-4">John Bogle, a legendary investor, once said: <em>"Don't look for the needle in the haystack. Just buy the haystack!"</em> A Passive Mutual Fund (or Index Fund) doesn't have a manager picking stocks. It uses a simple computer algorithm to blindly copy a stock market index. If a company is in the top 50 companies of India (Nifty 50), it is in your fund.</p>
        <ul className="list-disc pl-5 mb-8 space-y-3 text-on-surface-var">
          <li><strong>The Benefit:</strong> Because there is no expensive manager, the Expense Ratio is microscopic (often 0.1% to 0.2%).</li>
          <li><strong>The Math:</strong> If the Active Fund makes 13% but charges a 1.5% fee, you get 11.5%. If the Index Fund makes 12% (the market average) and charges a 0.1% fee, you get 11.9%. By being "average" and paying low fees, the passive investor mathematically beats the expensive active investor over 20 years.</li>
        </ul>

        <div className="bg-[rgba(255,255,255,0.03)] border-l-4 border-mango-text p-4 mb-6">
          <h4 className="font-bold text-on-surface mb-1">The Honest SIP Verdict</h4>
          <p className="text-on-surface-var text-sm">For 90% of retail investors, a simple, boring Nifty 50 Index Fund is all the equity exposure they will ever need. It isn't sexy, but wealth creation shouldn't be a thriller movie.</p>
        </div>

        <p className="italic opacity-70 border-l-2 border-[rgba(255,183,125,0.5)] pl-4 py-2 mt-6 bg-[rgba(255,255,255,0.02)] rounded-r-lg">So, your Index fund is growing beautifully. But just as you get ready to enjoy your wealth, the government knocks on your door. Let's learn how to legally protect your profits...</p>
      </>
    ),
    quiz: {
      question: "A mutual fund that uses an algorithm to blindly copy a benchmark like the Nifty 50, resulting in microscopic expense ratios and zero human bias, is known as a ________ Fund.",
      options: ["Sectoral", "Active", "Passive (Index)", "Liquid"],
      answer: 2 // Passive (Index)
    }
  },
  {
    id: 'sip-taxation',
    title: 'SIP Taxation',
    byline: 'How to Legally Keep the Taxman Out of Your Compounding Machine',
    content: (
      <>
        <h3 className="font-serif text-2xl text-on-surface mb-3">The Pizza Delivery Tax</h3>
        <p className="mb-8">Imagine ordering a large, 8-slice pizza. You wait patiently for 45 minutes. When the delivery guy finally arrives, he opens the box, takes out two slices, eats them right in front of you, and says, "That's the delivery tax." You'd be furious! But what if the restaurant had a secret rule: If you use a specific coupon code when ordering, the delivery guy is only allowed to take half a slice. In the investing world, your profits are the pizza. Capital Gains Tax is the delivery guy. And understanding tax codes is your secret coupon.</p>

        <h3 className="font-serif text-xl text-on-surface mb-3 border-b border-[rgba(255,255,255,0.05)] pb-2">Demystifying Capital Gains in Equity</h3>
        <p className="mb-6">Whenever your SIP investments make a profit, and you <em>sell</em> those units to bring the money back to your bank, the government applies a Capital Gains tax. The rules (updated in the recent Indian Budgets) depend entirely on your patience.</p>

        <h4 className="font-semibold text-red-300 mb-2 mt-4">1. STCG (Short-Term Capital Gains): The Impatient Penalty</h4>
        <ul className="list-none pl-2 mb-6 space-y-2 text-on-surface-var">
          <li><strong>The Rule:</strong> If you buy mutual fund units and sell them <em>before</em> completing 365 days, the government views you as a short-term trader, not an investor.</li>
          <li><strong>The Tax:</strong> You are slammed with a flat <strong>20%</strong> tax on your pure profits.</li>
        </ul>

        <h4 className="font-semibold text-green-300 mb-2 mt-6">2. LTCG (Long-Term Capital Gains): The Investor's Reward</h4>
        <ul className="list-none pl-2 mb-6 space-y-2 text-on-surface-var">
          <li><strong>The Rule:</strong> If you hold your units for <em>more</em> than 1 year (365 days) before selling, you enter the golden zone of LTCG.</li>
          <li><strong>The Magic Exemption:</strong> The government allows you to book up to <strong>₹1.25 Lakhs of pure profit every single financial year absolutely TAX-FREE</strong>.</li>
          <li><strong>The Tax:</strong> Any profit you make <em>above</em> that ₹1.25 Lakh threshold is taxed at a much lower rate of <strong>12.5%</strong>.</li>
        </ul>

        <h4 className="font-semibold text-mango-text mb-2 mt-6">3. ELSS: The Section 80C Hack</h4>
        <p className="mb-3 text-on-surface-var">What if you want to save the income tax you pay on your salary <em>today</em>? Enter the Equity Linked Savings Scheme (ELSS). By starting a SIP in an ELSS mutual fund, you can claim a deduction of up to ₹1.5 Lakhs from your taxable income under Section 80C.</p>
        <p className="mb-6 text-on-surface-var bg-[rgba(255,255,255,0.05)] p-3 rounded text-sm italic">
          <strong>The Catch:</strong> To prevent you from just using it as a tax loophole and immediately withdrawing it, ELSS funds come with a strict, unbreakable 3-year lock-in period.
        </p>
      </>
    ),
    quiz: {
      question: "Under the Long-Term Capital Gains (LTCG) rules for equity mutual funds, profits up to ________ per financial year are completely exempt from tax, provided the investment was held for more than one year.",
      options: ["₹50,000", "₹1.25 Lakhs", "₹2.5 Lakhs", "₹5 Lakhs"],
      answer: 1 // 1.25 L
    }
  },
  {
    id: 'goal-based-investing',
    title: 'Goal-Based Investing',
    byline: 'Giving Every Rupee a Job Description',
    content: (
      <>
        <h3 className="font-serif text-2xl text-on-surface mb-3">The Boarding Pass Blunder</h3>
        <p className="mb-8">Imagine walking into an international airport, going up to the airline counter, and handing the agent ₹50,000. When she asks, "Where are you flying today, sir?" you shrug and reply, "I don't know, just put me on a plane to somewhere." It sounds absurd. Yet, 80% of people invest their money exactly like this. They just start an SIP "to make money." Money without a specific, emotionally-tied destination will inevitably be withdrawn early to buy a depreciating asset—like a shiny new car you don't really need.</p>

        <h3 className="font-serif text-xl text-on-surface mb-3 border-b border-[rgba(255,255,255,0.05)] pb-2">The 3-Bucket Strategy</h3>
        <p className="mb-6">Goal-based investing forces you to act like a strict manager. You must give every single rupee a specific job description, a deadline, and a designated risk level.</p>

        <div className="space-y-6">
          <div className="p-4 border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(255,255,255,0.02)]">
            <h4 className="font-bold text-lg text-on-surface mb-2">Bucket 1: The Short-Term (0 to 3 Years)</h4>
            <ul className="text-sm space-y-2 text-on-surface-var">
              <li>• <strong>The Goals:</strong> Building an Emergency Fund (6 months of living expenses), saving for a wedding next year, or accumulating a down payment for a car.</li>
              <li>• <strong className="text-red-300">The Rule: NO EQUITY.</strong> A 1-year timeline is too short to survive a sudden market crash. Your only goal here is absolute capital protection.</li>
              <li>• <strong>The SIP Vehicle:</strong> Liquid Funds, Arbitrage Funds, or Recurring Deposits.</li>
            </ul>
          </div>

          <div className="p-4 border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(255,255,255,0.02)]">
            <h4 className="font-bold text-lg text-on-surface mb-2">Bucket 2: The Medium-Term (3 to 7 Years)</h4>
            <ul className="text-sm space-y-2 text-on-surface-var">
              <li>• <strong>The Goals:</strong> A massive down payment for a house, or saving for a child’s early schooling.</li>
              <li>• <strong className="text-mango-text">The Rule: The Hybrid Approach.</strong> You need growth to beat inflation, but you need a parachute in case the market dips just before you need the money.</li>
              <li>• <strong>The SIP Vehicle:</strong> Balanced Advantage Funds or Aggressive Hybrid Funds (mix of Equity and Debt in 60:40 or 70:30).</li>
            </ul>
          </div>

          <div className="p-4 border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(255,255,255,0.02)]">
            <h4 className="font-bold text-lg text-on-surface mb-2">Bucket 3: The Long-Term (7+ Years)</h4>
            <ul className="text-sm space-y-2 text-on-surface-var">
              <li>• <strong>The Goals:</strong> Your Retirement (Financial Independence), or a newborn child's higher education fund.</li>
              <li>• <strong className="text-green-300">The Rule: Maximum Aggression.</strong> Because you have a decade or more, you don't care about daily market news, wars, or temporary recessions. You have the time to ride the wave.</li>
              <li>• <strong>The SIP Vehicle:</strong> Pure Equity Index Funds, Flexi-Cap Funds, or Mid-Cap funds.</li>
            </ul>
          </div>
        </div>

        <p className="italic opacity-70 border-l-2 border-[rgba(255,183,125,0.5)] pl-4 py-2 mt-8 bg-[rgba(255,255,255,0.02)] rounded-r-lg">You have your buckets set up. Your goals are locked in. But three years from now, the stock market is going to crash, and your screen will bleed red. Will you survive it?</p>
      </>
    ),
    quiz: {
      question: "If you are saving for a strict, non-negotiable goal that is only 18 months away (like a wedding), your SIPs should be directed strictly into ________ to ensure the capital is protected from market crashes.",
      options: ["Small-Cap Equity Funds", "Liquid / Debt Funds", "Sectoral Technology Funds", "Real Estate Investment Trusts"],
      answer: 1 // Liquid / Debt
    }
  },
  {
    id: 'market-volatility',
    title: 'Market Volatility',
    byline: 'Surviving the Stock Market Sale Without Panicking',
    content: (
      <>
        <h3 className="font-serif text-2xl text-on-surface mb-3">The iPhone Sale Psychology</h3>
        <p className="mb-4">If a brand new iPhone costs ₹1,00,000, and tomorrow Apple announces a sudden "Black Friday Crash Sale" dropping the price by 40% to ₹60,000, what happens? People go crazy. They queue up outside stores overnight. They buy two instead of one.</p>
        <p className="mb-4">Now, apply this to the stock market. You buy a Mutual Fund unit for ₹100. Tomorrow, the stock market crashes, and the price drops by 40% to ₹60. What do investors do? They panic, log into their apps, and violently hit the "SELL" button.</p>
        <p className="mb-8 font-semibold text-mango-text border-l-4 border-mango-text pl-4">When retail goods go on sale, we buy more. When financial assets go on sale, we run away. This psychological glitch destroys middle-class wealth.</p>

        <h3 className="font-serif text-xl text-on-surface mb-3 border-b border-[rgba(255,255,255,0.05)] pb-2">The Superpower of a SIP: Rupee Cost Averaging</h3>
        <p className="mb-4">Market volatility (the constant up and down movement of prices) is not a bug; it is a feature. If the market only went straight up, it would act like a Fixed Deposit, and you would only get FD-level returns. The premium returns of Equity exist <em>because</em> of the risk of volatility.</p>
        <p className="mb-6">But a SIP is perfectly designed to hack this volatility. Because your SIP amount is fixed (say, ₹5,000/month), you automatically practice <strong>Rupee Cost Averaging</strong>.</p>

        <h4 className="font-bold text-on-surface mb-3">Let's look at the math:</h4>
        <ul className="space-y-4 mb-6">
          <li className="bg-[rgba(255,255,255,0.03)] p-3 rounded"><strong>Month 1 (Market is booming):</strong> The fund price (NAV) is ₹100. Your ₹5,000 buys you <strong className="text-green-300">50 units</strong>.</li>
          <li className="bg-[rgba(255,60,60,0.05)] p-3 rounded border border-[rgba(255,60,60,0.1)]"><strong>Month 2 (Market crashes 50% due to a crisis!):</strong> The NAV drops to ₹50. Your portfolio value looks red, and you feel sick. <em>But</em>, your automated ₹5,000 SIP triggers anyway. Because the price is cheap, your same ₹5,000 now buys you <strong className="text-mango-text text-lg">100 units</strong>!</li>
          <li className="bg-[rgba(255,255,255,0.03)] p-3 rounded"><strong>Month 3 (Market recovers slowly):</strong> The NAV goes to ₹75.</li>
        </ul>

        <p className="mb-8">Because you didn't stop your SIP during the crash, you hoovered up double the units at a massive discount. When the market eventually hits new highs, those cheap units act as a rocket booster for your overall portfolio value.</p>

        <div className="bg-[#1c1b1b] border border-[rgba(255,183,125,0.3)] rounded-xl p-6 text-center shadow-2xl">
          <h4 className="font-serif text-2xl text-on-surface mb-3">The Ultimate Rule of SIPs</h4>
          <p className="text-on-surface-var">The single worst financial mistake you can ever make is logging into your net banking and "pausing" your SIP because the market is down. Pausing your SIP during a crash is like walking out of the supermarket just as they announce a 50% discount on groceries. <br/><br/><strong className="text-mango-text text-lg">Hold your nerve. Stay automated. Let the math do the heavy lifting.</strong></p>
        </div>
      </>
    ),
    quiz: {
      question: "The built-in mathematical feature of a SIP that automatically forces you to accumulate more mutual fund units when the market crashes, and fewer units when the market is expensive, is known as ________.",
      options: ["Tax Harvesting", "Asset Rebalancing", "Rupee Cost Averaging", "The Expense Ratio"],
      answer: 2 // Rupee Cost Averaging
    }
  }
];
