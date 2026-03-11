import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Sparkles, RotateCcw, ArrowLeft, TrendingUp, PieChart, DollarSign, BarChart3 } from "lucide-react"

const TOPIC_RESPONSES = [
  {
    keywords: ["diversif", "portfolio", "spread", "allocat"],
    response: `Great question on diversification — here's how to think about it:\n\n**Why diversify?** No single asset always wins. Spreading across asset classes reduces the risk that one bad bet wipes out your gains.\n\n**A solid framework:**\n• **Equities (stocks)** — 50–70% for long-term growth. Mix large-cap, mid-cap, and international.\n• **Debt / Bonds** — 20–30% for stability. Government bonds or fixed-income funds act as a cushion.\n• **Gold / Commodities** — 5–10% as an inflation hedge.\n• **Cash / Liquid funds** — 5% for emergencies and opportunistic buys.\n\n**Pro tip:** Rebalance once a year. If equities surge to 80% of your portfolio, trim and redistribute — this forces you to "sell high, buy low" automatically.\n\nDerivity's full portfolio analysis engine will personalise these ratios to your age, risk appetite, and goals. That's coming soon.`,
  },
  {
    keywords: ["dollar.cost", "dca", "averaging", "cost averaging", "regular invest"],
    response: `Dollar-Cost Averaging (DCA) is one of the most powerful — and underrated — strategies for everyday investors.\n\n**How it works:** Instead of investing a lump sum at once, you invest a fixed amount at regular intervals (monthly, weekly). You buy more units when prices are low and fewer when prices are high — automatically.\n\n**Example:**\n• Month 1: ₹5,000 at ₹100/unit → 50 units\n• Month 2: ₹5,000 at ₹80/unit → 62.5 units\n• Month 3: ₹5,000 at ₹125/unit → 40 units\n• Average cost: ~₹98/unit vs. a single buy at ₹100\n\n**Why it works:** It removes the impossible task of timing the market. Even professionals get market timing wrong. DCA turns volatility into your friend.\n\n**Best used for:** SIPs in mutual funds, recurring stock purchases, or crypto accumulation over time.\n\nConsistency beats perfection — every time.`,
  },
  {
    keywords: ["savings rate", "save", "saving", "how much", "income"],
    response: `Your optimal savings rate depends on your goals and timeline, but here are proven benchmarks to work from:\n\n**The 50/30/20 Rule (starter framework):**\n• 50% → Needs (rent, food, bills)\n• 30% → Wants (lifestyle, entertainment)\n• 20% → Savings & investments\n\n**If you want to retire early (FIRE movement):** Aim for 40–60% savings rate. Every 10% extra shaves years off your working life.\n\n**Key factors to consider:**\n• **Age:** The earlier you start, the less you need to save thanks to compounding.\n• **Goals:** Home in 5 years? Child's education in 10? Each goal needs a dedicated SIP.\n• **Inflation:** Your savings must grow faster than inflation (currently ~6% in India). Park idle cash in liquid funds, not a savings account.\n\n**Quick formula:** Save at least 6 months of expenses as an emergency fund first, then invest the rest consistently.\n\nDerivity will soon help you calculate your exact savings rate based on your income, goals, and timeline.`,
  },
  {
    keywords: ["market condition", "market analysis", "current market", "analyse market", "analyze market", "market today"],
    response: `Here's how to read and approach current market conditions as a smart investor:\n\n**Key signals to watch:**\n• **Index levels (Nifty/Sensex):** Are markets at all-time highs or correcting? High valuations (P/E > 24 for Nifty) suggest caution; corrections are buying opportunities.\n• **Interest rates:** Rising rates hurt growth stocks and real estate. Falling rates boost equities and bonds.\n• **Inflation data (CPI):** High inflation erodes fixed-income returns. Favour equities and gold during inflationary periods.\n• **FII/DII flows:** Heavy foreign institutional selling is a short-term red flag; domestic buying usually provides support.\n\n**The right mindset:**\n• Don't try to predict the market — position yourself for multiple scenarios.\n• Bull market → stay invested, avoid over-leveraging.\n• Bear market / correction → ideal time to increase SIP contributions.\n• Sideways market → focus on quality dividend-paying stocks.\n\n**Remember:** Time in the market consistently beats timing the market. Derivity's full market analysis engine will synthesise all these signals in real time — coming soon.`,
  },
  {
    keywords: ["what is a stock", "what are stocks", "stock mean", "stocks work", "what is stock", "define stock", "equity share"],
    response: `A **stock** (also called a share or equity) represents a small ownership stake in a company.\n\n**In simple terms:** When a company wants to raise money (to expand, build, hire), it divides itself into millions of tiny pieces — these are stocks. You can buy a piece of that company.\n\n**How you make money from stocks:**\n• **Capital appreciation:** The stock price rises and you sell at a profit.\n• **Dividends:** Some companies share a portion of their profits with shareholders periodically.\n\n**Types of stocks:**\n• **Large-cap** — Big, stable companies (e.g., Reliance, TCS). Lower risk, steady growth.\n• **Mid-cap** — Growing companies. Higher potential return, moderate risk.\n• **Small-cap** — Early-stage companies. High risk, high reward.\n• **Dividend stocks** — Companies that regularly pay dividends, great for passive income.\n\n**Key thing to remember:** Stock prices fluctuate daily based on company performance, news, and market sentiment. Short-term = volatile. Long-term = historically one of the best wealth creators.\n\nBuying a stock is buying a piece of a real business — invest in businesses you understand and believe in.`,
  },
  {
    keywords: ["sip", "systematic investment", "mutual fund", "what is sip", "sip mean"],
    response: `A **SIP (Systematic Investment Plan)** is a method of investing a fixed amount regularly into a mutual fund — weekly, monthly, or quarterly.\n\n**Think of it as:** A recurring deposit, but instead of a bank account, your money goes into a market-linked mutual fund that can grow much faster over time.\n\n**How SIP works:**\n1. You pick a mutual fund and a fixed amount (e.g., ₹2,000/month).\n2. On a set date, the amount is auto-debited from your bank account.\n3. You receive mutual fund units at that day's NAV (Net Asset Value / price).\n4. Over time, you accumulate units and benefit from compounding + rupee cost averaging.\n\n**Why SIP is powerful:**\n• **Discipline:** Automates investing — no willpower needed.\n• **Compounding:** Earnings generate their own earnings over time. ₹5,000/month at 12% return for 20 years ≈ **₹49 lakhs** from just ₹12 lakh invested.\n• **Rupee cost averaging:** You buy more units when markets dip, reducing your average cost.\n• **Flexible:** Start with as little as ₹500/month. Pause or stop anytime.\n\n**Best for:** Long-term goals — retirement, child's education, wealth building. The key is to stay consistent and not stop during market dips.`,
  },
  {
    keywords: ["strateg", "invest strateg", "basic strateg", "how to invest", "investment tip", "beginner", "start investing", "where to invest"],
    response: `Here are the core investment strategies every investor should know:\n\n**1. Buy & Hold (Long-term investing)**\nBuy quality stocks or index funds and hold for 5–10+ years. Warren Buffett's favourite — lets compounding do the heavy lifting.\n\n**2. SIP / Dollar-Cost Averaging**\nInvest a fixed amount regularly regardless of market conditions. Removes emotion and timing risk from investing.\n\n**3. Value Investing**\nBuy stocks trading below their intrinsic value — find great companies at discounted prices. Requires research and patience.\n\n**4. Growth Investing**\nInvest in companies growing revenue/profits faster than the market average. Higher risk, higher reward — tech and consumer sectors often dominate here.\n\n**5. Index Investing (Passive strategy)**\nInvest in index funds (Nifty 50, Sensex) that mirror the entire market. Low cost, low effort, beats most active fund managers over time.\n\n**6. Dividend Investing**\nBuild a portfolio of dividend-paying stocks for regular passive income. Great for retirees or those wanting cash flow.\n\n**Golden rules regardless of strategy:**\n• Start early — time is your biggest advantage.\n• Diversify — never put all eggs in one basket.\n• Avoid panic selling — stay the course during corrections.\n• Keep costs low — high fees silently kill returns.`,
  },
  // ── General questions ──────────────────────────────────────────────────────
  {
    keywords: ["compound", "compounding", "compound interest", "power of compounding"],
    response: `**Compounding** is often called the 8th wonder of the world — and for good reason.\n\n**What it means:** You earn returns not just on your original investment, but also on all the returns you've already earned. Your money makes money, which then makes more money.\n\n**Simple example:**\n• Invest ₹1,00,000 at 12% per year\n• Year 1: ₹1,12,000\n• Year 5: ₹1,76,234\n• Year 10: ₹3,10,585\n• Year 20: ₹9,64,629 — nearly 10x, without adding a rupee!\n\n**The two keys to maximising compounding:**\n• **Time** — The longer you stay invested, the more dramatic the effect. Starting at 25 vs 35 can mean 3x more wealth at retirement.\n• **Rate of return** — Even a 2% difference in annual returns creates massive gaps over 20–30 years.\n\n**What kills compounding:**\n• Withdrawing early and breaking the cycle\n• High fees eating into returns\n• Stopping SIPs during market downturns\n\nStart early, stay invested, and let time do the work.`,
  },
  {
    keywords: ["inflation", "what is inflation", "inflation affect", "inflation mean", "inflation rate"],
    response: `**Inflation** is the gradual rise in prices over time — which means the purchasing power of your money falls if it's just sitting idle.\n\n**In simple terms:** If a coffee costs ₹100 today and inflation is 6%, the same coffee will cost ₹106 next year. Your ₹100 buys less.\n\n**Why it matters for investors:**\n• A savings account earning 3.5% when inflation is 6% = you're losing 2.5% of real value every year.\n• Your investments must beat inflation to actually grow your wealth.\n\n**Asset classes vs inflation:**\n• **Equities (stocks/mutual funds)** — Historically the best inflation beaters. Long-term equity returns (12–15%) comfortably exceed inflation.\n• **Gold** — A classic hedge; tends to rise when inflation is high.\n• **Real estate** — Property prices typically rise with inflation.\n• **Fixed deposits / bonds** — Often struggle to beat inflation after tax.\n• **Cash** — Worst option during high inflation; always loses real value.\n\n**Rule of thumb:** Always calculate your "real return" = Nominal return − Inflation rate. That's your actual gain in purchasing power.`,
  },
  {
    keywords: ["index fund", "etf", "exchange traded", "nifty 50 fund", "passive fund", "what is index"],
    response: `An **Index Fund** (or ETF — Exchange Traded Fund) is a type of mutual fund that simply mirrors a market index like Nifty 50 or Sensex.\n\n**How it works:** Instead of a fund manager picking stocks, the fund automatically holds all the stocks in the index in the same proportion. When Nifty goes up, your fund goes up by roughly the same amount.\n\n**Why index funds are loved by smart investors:**\n• **Low cost:** No expensive fund manager. Expense ratios as low as 0.1% vs 1.5–2% for active funds.\n• **Broad diversification:** Instant exposure to 50 or 500 companies with one investment.\n• **Consistent performance:** Over 10–15 year periods, ~80% of active fund managers fail to beat their benchmark index.\n• **Simplicity:** No need to research individual stocks or track fund managers.\n\n**Index Fund vs ETF:**\n• Both track an index, but ETFs trade on the stock exchange like shares (real-time pricing).\n• Index funds are bought/sold at the end-of-day NAV through a fund house or app.\n\n**Best for:** Long-term wealth building with minimal effort and cost. A core Nifty 50 index SIP is one of the most sensible starting points for any investor.`,
  },
  {
    keywords: ["what is a bond", "what are bonds", "bond mean", "fixed income", "government bond", "debt fund"],
    response: `A **bond** is essentially a loan you give to a government or company — and they pay you interest for it.\n\n**How it works:** When you buy a bond, you lend money to the issuer for a fixed period. In return, they pay you regular interest (called a coupon) and return your principal at the end.\n\n**Types of bonds:**\n• **Government bonds (G-Secs):** Issued by the Indian government. Virtually zero default risk, but lower returns (6–7%).\n• **Corporate bonds:** Issued by companies. Higher returns (8–12%) but carry credit risk — the company could default.\n• **Tax-free bonds:** Interest income is exempt from tax. Issued by PSUs like NHAI, REC.\n\n**Bonds vs Stocks:**\n• Bonds = predictable income, lower risk, lower long-term returns\n• Stocks = higher growth potential, higher volatility\n• A balanced portfolio holds both — bonds cushion the portfolio when stocks fall.\n\n**Key risk:** Interest rate risk. When interest rates rise, existing bond prices fall (and vice versa). Longer-duration bonds are more sensitive to this.\n\n**Best for:** Capital preservation, regular income, and as a stabiliser in a diversified portfolio.`,
  },
  {
    keywords: ["bull market", "bear market", "bull run", "market crash", "correction", "rally"],
    response: `Understanding market cycles helps you stay calm and make smarter decisions.\n\n**Bull Market** 📈\nA period of rising stock prices — typically defined as a 20%+ rise from recent lows. Characterised by economic growth, rising corporate earnings, and investor optimism.\n• Strategy: Stay invested, don't try to time the top. Avoid taking on excessive debt/leverage.\n\n**Bear Market** 📉\nA period of falling stock prices — typically defined as a 20%+ fall from recent highs. Often triggered by recessions, high interest rates, or economic shocks.\n• Strategy: **Don't panic sell.** Increase SIP contributions — you're buying more units at lower prices.\n\n**Market Correction**\nA shorter, smaller dip (10–20%) within a broader uptrend. Very normal — happens roughly every 1–2 years.\n• Strategy: Treat it as a sale. Quality assets become cheaper.\n\n**Key insight:** Bear markets are temporary, but the wealth destroyed by panic selling is permanent. Every bear market in history has eventually been followed by new all-time highs.\n\n**Historical perspective:** The Nifty 50 has delivered ~13% CAGR over 25 years — through multiple bear markets, crashes, and crises. Time in the market is the only proven strategy.`,
  },
  {
    keywords: ["emergency fund", "emergency", "rainy day", "liquid fund", "safety net"],
    response: `An **emergency fund** is money set aside for unexpected expenses — job loss, medical emergency, urgent repairs — without having to liquidate investments or take loans.\n\n**How much do you need?**\n• **Minimum:** 3 months of living expenses\n• **Recommended:** 6 months of living expenses\n• **If freelancer/variable income:** 9–12 months\n\n**Example:** If your monthly expenses are ₹40,000, your emergency fund target = ₹2,40,000 (6 months).\n\n**Where to keep it:**\n• **NOT in a savings account** (too low a rate, tempting to spend)\n• **Liquid mutual funds** — Returns of 6–7%, instant redemption within 24 hours, no lock-in. Best option.\n• **Overnight funds or ultra short-term debt funds** — Similar to liquid funds, slightly higher returns.\n• **Sweep-in FD** — Earns FD rates but can be broken instantly.\n\n**Why it's the foundation of financial health:**\n• Without it, any emergency forces you to sell investments at possibly the worst time.\n• It gives you psychological security to take more calculated risks with the rest of your wealth.\n\nBuild your emergency fund before investing anywhere else.`,
  },
  {
    keywords: ["risk", "risk management", "how risky", "risk appetite", "risk tolerance", "volatility", "safe investment"],
    response: `**Risk** in investing means the possibility that your investment's value will go down — or that you won't achieve your expected return.\n\n**Types of investment risk:**\n• **Market risk:** The whole market falls (2008 crisis, COVID crash).\n• **Company risk:** A specific company performs badly or goes bankrupt.\n• **Inflation risk:** Your returns don't beat inflation — you lose purchasing power.\n• **Liquidity risk:** You can't sell quickly when you need cash.\n• **Credit risk:** A bond issuer defaults on payment.\n\n**Risk vs Return:** Higher potential return always comes with higher risk. There's no free lunch in investing.\n\n**How to assess your risk appetite:**\n• **Conservative:** Can't sleep if portfolio drops 10%. → Focus on debt funds, FDs, bonds.\n• **Moderate:** Comfortable with 15–20% temporary dips for better long-term returns. → Balanced mix of equity + debt.\n• **Aggressive:** Can handle 40–50% drawdowns knowing it will recover. → Heavy equities, small-cap, growth stocks.\n\n**How to manage risk:**\n• Diversify across asset classes\n• Invest for the long term (time reduces equity risk dramatically)\n• Never invest money you need within 3 years in equities\n• Maintain an emergency fund so market downturns don't force you to sell`,
  },
  {
    keywords: ["fixed deposit", "fd", "what is fd", "bank deposit", "term deposit"],
    response: `A **Fixed Deposit (FD)** is a savings instrument offered by banks where you deposit a lump sum for a fixed tenure at a predetermined interest rate.\n\n**Key features:**\n• Interest rates: typically 6–7.5% per year (varies by bank and tenure)\n• Tenure: 7 days to 10 years\n• Guaranteed returns — no market risk\n• Premature withdrawal allowed (with a small penalty)\n\n**Is FD a good investment?**\n• **For safety:** Yes — FDs up to ₹5 lakh are insured by DICGC per bank.\n• **For wealth creation:** Not ideal. After 30% tax on interest, real returns often barely beat inflation.\n\n**Better alternatives depending on your goal:**\n• **Emergency fund:** Liquid mutual funds (better returns, same liquidity)\n• **Short-term goals (1–3 years):** Debt mutual funds (more tax-efficient)\n• **Long-term wealth:** Equity mutual funds via SIP (far superior returns over 7+ years)\n\n**When FD makes sense:**\n• Senior citizens (extra 0.5% rate + stable income)\n• Capital you absolutely cannot afford to lose\n• Short-term parking of large sums (house purchase, festival expenses)\n\nFDs are safe but shouldn't be your only savings vehicle.`,
  },
  {
    keywords: ["ppf", "public provident fund", "what is ppf", "tax saving", "80c", "elss", "tax benefit", "nps", "national pension"],
    response: `**Tax-saving investments** let you reduce your taxable income while building wealth — a double win.\n\n**Section 80C (up to ₹1.5 lakh deduction):**\n• **PPF (Public Provident Fund):** 7.1% tax-free returns, 15-year lock-in. Sovereign guarantee. Excellent for conservative long-term saving.\n• **ELSS (Equity Linked Savings Scheme):** Mutual funds with 3-year lock-in (shortest among 80C options). Equity exposure means 12–15% potential returns. Best wealth creator among 80C options.\n• **EPF (Employee Provident Fund):** Employer + employee contribution, 8.25% tax-free for salaried individuals.\n• **NSC, Tax-saving FD:** 5-year lock-in, fixed returns. Lower potential than ELSS.\n\n**NPS (National Pension System) — 80CCD:**\n• Additional ₹50,000 deduction over 80C limit.\n• Invests in equity + debt; builds retirement corpus.\n• Partial withdrawal at 60; annuity required for 40% of corpus.\n\n**Smart approach:**\n• Max out ELSS SIPs first (best returns + tax benefit)\n• Contribute to PPF for safe, tax-free debt allocation\n• Use NPS for additional ₹50k deduction if you're in the 30% tax bracket\n\n**Remember:** Don't invest only for tax saving — ensure the investment aligns with your goals.`,
  },
  {
    keywords: ["crypto", "cryptocurrency", "bitcoin", "ethereum", "web3", "digital currency", "blockchain"],
    response: `**Cryptocurrency** is a digital or virtual currency that uses cryptography (blockchain technology) for security and operates without a central authority like a bank or government.\n\n**Popular cryptocurrencies:**\n• **Bitcoin (BTC):** The original. Often called "digital gold" — a store of value.\n• **Ethereum (ETH):** A programmable blockchain powering smart contracts and DeFi apps.\n• **Others (Altcoins):** Thousands exist — most are highly speculative.\n\n**The case for crypto (potential upsides):**\n• High return potential — Bitcoin delivered 200%+ in bull cycles.\n• Portfolio diversification — Low long-term correlation with traditional assets.\n• Inflation hedge narrative — Fixed supply (Bitcoin capped at 21 million).\n\n**The risks (very real):**\n• **Extreme volatility:** 50–80% crashes are common. Not for the faint-hearted.\n• **Regulatory risk:** Governments can restrict or heavily tax crypto.\n• **No intrinsic value guarantee:** Unlike stocks (tied to business earnings) or gold (industrial use).\n• **Security risk:** Exchange hacks, lost wallets — your keys, your crypto.\n\n**Derivity's take:** Crypto can be a small speculative allocation (5–10% max) for high-risk-tolerance investors — but it should never replace a core equity + debt portfolio. Never invest more than you can afford to lose completely.`,
  },
  {
    keywords: ["trading", "trading vs investing", "day trading", "swing trading", "intraday", "short term trading"],
    response: `**Trading** and **Investing** both involve financial markets — but they're fundamentally different approaches.\n\n**Investing:**\n• Time horizon: Years to decades\n• Goal: Wealth creation through compounding and business growth\n• Effort: Research companies/funds, then let time work\n• Risk: Lower (markets recover over time)\n• Tax: LTCG (10% above ₹1L on equity after 1 year)\n• Success rate: High for disciplined, patient investors\n\n**Trading (Day/Swing/F&O):**\n• Time horizon: Minutes to weeks\n• Goal: Profit from short-term price movements\n• Effort: Constant monitoring, technical analysis, fast decisions\n• Risk: Very high — a few bad trades can wipe out months of gains\n• Tax: STCG (15%) or business income (slab rate for F&O)\n• Success rate: Studies show 85–90% of retail traders lose money\n\n**F&O (Futures & Options) — Extra caution:**\nSEBI data shows 9 out of 10 F&O traders lose money. Leverage amplifies both gains and losses. Not recommended without deep expertise.\n\n**Derivity's recommendation:** For most people, long-term investing via SIPs and diversified equity funds will outperform active trading with a fraction of the stress and risk. If you want to trade, start with paper trading (no real money) to learn without losses.`,
  },
  {
    keywords: ["demat", "demat account", "trading account", "how to buy stock", "open account", "zerodha", "groww", "broker"],
    response: `A **Demat account** (Dematerialised account) holds your stocks, bonds, ETFs, and mutual fund units in digital form — just like a bank account holds money.\n\n**To start investing in stocks, you need:**\n• **Demat account** — Holds your securities\n• **Trading account** — Used to place buy/sell orders (usually linked to Demat)\n• **Bank account** — For funds transfer\n\nMost brokers open all three together.\n\n**Popular brokers in India:**\n• **Zerodha** — Largest discount broker. ₹0 for delivery trades, ₹20 per F&O order. Kite platform is excellent.\n• **Groww** — Very beginner-friendly. Great for mutual funds + stocks.\n• **Upstox** — Competitive pricing, good for active traders.\n• **Angel One, ICICI Direct, HDFC Securities** — Full-service brokers with research support (higher fees).\n\n**How to open:**\n1. Choose a broker and download their app\n2. Complete KYC (Aadhaar + PAN + selfie — fully online, takes 10–15 minutes)\n3. Account activated in 24–48 hours\n4. Transfer funds and start investing\n\n**Key tip:** For beginners, start with direct mutual funds (no Demat needed) via Groww or Coin by Zerodha — simpler and lower risk than direct stock picking.`,
  },
  {
    keywords: ["pe ratio", "p/e ratio", "price to earning", "valuation", "how to value", "intrinsic value", "fundamental analysis"],
    response: `**P/E Ratio (Price-to-Earnings)** is one of the most widely used metrics to gauge if a stock is cheap or expensive.\n\n**Formula:** P/E = Stock Price ÷ Earnings Per Share (EPS)\n\n**What it means:** If a stock has a P/E of 20, investors are paying ₹20 for every ₹1 of annual earnings. A higher P/E means the market expects strong future growth (or the stock is overvalued).\n\n**Interpreting P/E:**\n• **P/E < 15** — Potentially undervalued (or declining business)\n• **P/E 15–25** — Fair value for most established companies\n• **P/E > 30** — Growth priced in; expensive unless growth is exceptional\n• **Nifty 50 average P/E** — Historically 18–22. Above 24 = caution zone.\n\n**Important context:**\n• Compare P/E within the same industry — tech stocks naturally carry higher P/E than banks.\n• A low P/E could be a value opportunity or a value trap (declining business).\n• Use alongside other metrics: P/B ratio, ROE, debt levels, revenue growth.\n\n**Other key valuation metrics:**\n• **P/B (Price-to-Book):** Useful for banks and asset-heavy companies\n• **EV/EBITDA:** Good for comparing companies with different debt levels\n• **PEG Ratio:** P/E adjusted for growth rate — a PEG below 1 often signals undervaluation`,
  },
  {
    keywords: ["gold", "invest in gold", "gold vs stock", "sovereign gold bond", "sgb", "digital gold", "gold etf"],
    response: `**Gold** has been a store of value for thousands of years — and it still plays a relevant role in a modern portfolio.\n\n**Why invest in gold:**\n• **Inflation hedge:** Gold tends to hold its purchasing power over long periods.\n• **Safe haven:** During market crashes, recessions, or geopolitical crises, gold often rises while stocks fall.\n• **Portfolio diversifier:** Low/negative correlation with equities — reduces overall portfolio volatility.\n\n**Forms of gold investment:**\n• **Physical gold (jewellery/coins/bars):** High making charges, storage risk, not ideal for investment.\n• **Gold ETF:** Buy gold like a stock on exchange. Low cost, pure play on gold price. No storage worries.\n• **Sovereign Gold Bond (SGB):** Issued by RBI. You get gold price appreciation PLUS 2.5% annual interest. Zero capital gains tax if held to maturity (8 years). **Best option for long-term gold allocation.**\n• **Digital gold:** Convenient but check the platform's credibility. Not regulated like ETFs/SGBs.\n\n**How much gold to hold:** 5–10% of your portfolio is a widely recommended allocation. Gold shouldn't be your primary investment — it doesn't generate earnings like stocks.\n\n**Bottom line:** Gold is insurance, not a growth engine. Hold it as a hedge, not as your core wealth-building asset.`,
  },
  {
    keywords: ["real estate", "property invest", "buy property", "rent vs buy", "house invest", "reits", "reit"],
    response: `**Real estate** is one of India's most popular investments — though it comes with both unique advantages and often-overlooked drawbacks.\n\n**Pros of real estate:**\n• Tangible asset with intrinsic utility\n• Rental income provides cash flow\n• Leverage (home loan) can amplify returns\n• Emotional value of owning property\n\n**The real costs (often ignored):**\n• High transaction costs: stamp duty (5–7%), registration, brokerage\n• Illiquid — can take months to sell, unlike stocks you can exit in seconds\n• Maintenance, property tax, vacancy risk if renting out\n• EMI lock-in for 15–20 years limits financial flexibility\n• Real estate returns (5–8% CAGR in most cities) often barely beat inflation after costs\n\n**REITs (Real Estate Investment Trusts) — A smarter alternative:**\n• Invest in commercial real estate (offices, malls) without buying property\n• Traded on stock exchange — liquid like stocks\n• Mandatory 90% profit distribution as dividends\n• Start with ₹10,000–15,000 (vs. ₹50L+ for physical property)\n• Popular in India: Embassy REIT, Mindspace REIT, Nexus Select Trust\n\n**Rent vs Buy:**\nIf your Price-to-Rent ratio (property price ÷ annual rent) is above 20, renting + investing the difference in equity funds often beats buying financially.`,
  },
  {
    keywords: ["what is derivity", "who are you", "what can you do", "about derivity", "tell me about yourself", "derivity ai"],
    response: `I'm **Derivity AI** — your personal financial intelligence engine.\n\n**What I'm being built to do:**\n• Analyse your entire financial picture in one place — income, expenses, investments, goals\n• Provide institutional-grade portfolio insights, previously reserved for hedge funds and HNIs\n• Synthesise market signals, macro data, and personal finance data into clear, actionable advice\n• Help you build wealth through intelligent automation — rebalancing, SIP optimisation, tax-loss harvesting\n• Answer any finance question — from "what is a stock?" to complex multi-asset portfolio analysis\n\n**Where I am now:**\nI'm currently in active training. My responses are illustrative and based on financial knowledge — not connected to live market data or your personal accounts yet. That full experience is rolling out soon.\n\n**What I can help you with today:**\nAsk me about stocks, SIPs, mutual funds, trading strategies, budgeting, tax saving, inflation, compounding — I'll give you my best thinking.\n\nDerivity exists because everyone deserves financial intelligence that was once only available to the ultra-wealthy. That's the mission. What would you like to explore?`,
  },
]

const FALLBACK_RESPONSES = [
  "I'm Derivity AI — I'm currently in training and growing smarter every day. My full capabilities are rolling out soon, but I can already walk you through financial concepts and strategies.",
  "Great question. I'm still in training, so consider this a preview of what's coming — Derivity is being built to give you institutional-grade portfolio analysis at your fingertips.",
  "As Derivity AI, I'm designed to synthesise market signals, macro data, and your personal financial picture into one clear view. That full experience is on its way.",
  "I'm currently under active training, so I can't connect to live accounts just yet — but I can reason through this with you based on what I know. Here's how I'd approach it.",
  "Derivity is being built so every individual has access to the kind of financial intelligence that was once reserved for hedge funds. I'm the engine powering that — and I'm still learning.",
]

function getResponse(userText, fallbackIdx) {
  const lower = userText.toLowerCase()
  const match = TOPIC_RESPONSES.find(({ keywords }) =>
    keywords.some((kw) => lower.includes(kw))
  )
  if (match) return match.response
  return FALLBACK_RESPONSES[fallbackIdx % FALLBACK_RESPONSES.length]
}

const WELCOME_MSG = {
  id: "welcome",
  role: "assistant",
  text: "Hi, I'm Derivity AI — built to be your personal financial intelligence engine. I'm currently in training, so my responses are illustrative and may not reflect live data. That said, I'm here and ready to help you think through investments, markets, budgeting, and more. What's on your mind?",
}

function useTypewriter(text, speed = 14) {
  const [displayed, setDisplayed] = useState("")
  useEffect(() => {
    setDisplayed("")
    if (!text) return
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return displayed
}

function formatMessage(text) {
  // Split into lines and render bold (**text**) and bullets
  return text.split("\n").map((line, i) => {
    // Bold spans
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>
        : part
    )
    const isBullet = line.trimStart().startsWith("•")
    return (
      <span key={i} className={`block ${isBullet ? "pl-2" : ""} ${i > 0 && !isBullet && line.trim() !== "" ? "mt-3" : i > 0 && line.trim() === "" ? "mt-1" : ""}`}>
        {parts}
      </span>
    )
  })
}

function AssistantBubble({ text, animate }) {
  const displayed = useTypewriter(animate ? text : "")
  const content = animate ? displayed : text
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-4 max-w-3xl"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center mt-0.5 shadow-lg shadow-violet-900/40">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex-1 pt-1">
        <p className="text-[15px] text-gray-200 leading-[1.75]">
          {formatMessage(content)}
          {animate && content.length < text.length && (
            <span className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5 animate-pulse align-middle" />
          )}
        </p>
      </div>
    </motion.div>
  )
}

function UserBubble({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex justify-end"
    >
      <div
        className="max-w-[72%] rounded-2xl rounded-tr-sm px-5 py-3.5 text-[15px] leading-[1.7] text-white"
        style={{
          background: "linear-gradient(135deg, rgba(109,40,217,0.45), rgba(37,99,235,0.45))",
          border: "1px solid rgba(139,92,246,0.22)",
        }}
      >
        {text}
      </div>
    </motion.div>
  )
}

function Thinking() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-4"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-900/40">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex gap-1.5 items-center py-1">
        {[0, 0.16, 0.32].map((d) => (
          <motion.span
            key={d}
            className="w-1.5 h-1.5 rounded-full bg-violet-400/70"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: d }}
          />
        ))}
      </div>
    </motion.div>
  )
}

const SUGGESTIONS = [
  { icon: PieChart,    text: "How should I diversify my portfolio?" },
  { icon: DollarSign, text: "Explain dollar-cost averaging" },
  { icon: TrendingUp, text: "What is my optimal savings rate?" },
  { icon: BarChart3,  text: "Analyse current market conditions" },
  { icon: TrendingUp, text: "What is a stock?" },
  { icon: DollarSign, text: "What is SIP?" },
  { icon: PieChart,   text: "What are some basic investment strategies?" },
]

export default function TryDerivity({ onBack }) {
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [input, setInput] = useState("")
  const [thinking, setThinking] = useState(false)
  const [fallbackIdx, setFallbackIdx] = useState(0)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, thinking])

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 500)
  }, [])

  const send = useCallback((text) => {
    const msg = (text ?? input).trim()
    if (!msg || thinking) return
    setInput("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: msg }])
    setThinking(true)
    setTimeout(() => {
      const response = getResponse(msg, fallbackIdx)
      const isFallback = !TOPIC_RESPONSES.some(({ keywords }) =>
        keywords.some((kw) => msg.toLowerCase().includes(kw))
      )
      if (isFallback) setFallbackIdx((i) => i + 1)
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", text: response }])
      setThinking(false)
    }, 850 + Math.random() * 650)
  }, [input, thinking, fallbackIdx])

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() }
  }

  const reset = () => {
    setMessages([WELCOME_MSG])
    setInput("")
    setThinking(false)
    setFallbackIdx(0)
  }

  const isEmpty = messages.length === 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[200] flex flex-col bg-black overflow-hidden"
    >
      {/* Layered ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
        <motion.div
          className="absolute top-[-20%] left-[25%] w-[55%] h-[55%] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(109,40,217,0.10) 0%, transparent 70%)", filter: "blur(1px)" }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-15%] right-[15%] w-[45%] h-[45%] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(37,99,235,0.09) 0%, transparent 70%)", filter: "blur(1px)" }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.95, 0.6] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Radial fade-out mask over the grid */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, black 100%)" }}
        />
      </div>

      {/* Top bar */}
      <div
        className="relative z-10 flex items-center justify-between px-6 h-[60px] flex-shrink-0"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-300 transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span className="text-[13px] font-medium tracking-wide">Back</span>
        </motion.button>

        <motion.button
          onClick={reset}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-1.5 text-gray-700 hover:text-gray-400 transition-colors duration-200 group"
          title="New conversation"
        >
          <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-[12px] font-medium tracking-wide hidden sm:block">New chat</span>
        </motion.button>
      </div>

      {/* Messages */}
      <div
        className="relative z-10 flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.05) transparent" }}
      >
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-6">

          <AnimatePresence>
            {isEmpty && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center pt-14 pb-4 gap-12"
              >
                {/* Heading block */}
                <div className="flex flex-col items-center gap-4">
                  {/* Wordmark */}
                  <motion.div
                    initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.05, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center gap-2 mb-2"
                  >
                    <span
                      className="text-[13px] font-semibold tracking-[0.3em] uppercase"
                      style={{ color: "rgba(167,139,250,0.5)" }}
                    >
                      Derivity
                    </span>
                    <div className="w-6 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)" }} />
                  </motion.div>
                  <div>
                    <motion.h1
                      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="text-[clamp(26px,4.5vw,48px)] font-black tracking-[-0.03em] text-white leading-[1.1] mb-1"
                    >
                      What can I help you
                    </motion.h1>
                    <motion.h1
                      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 0.22, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="text-[clamp(26px,4.5vw,48px)] font-black tracking-[-0.03em] leading-[1.1]"
                      style={{
                        background: "linear-gradient(135deg, #a78bfa, #60a5fa, #22d3ee)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      with today?
                    </motion.h1>
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className="text-[14px] text-gray-600 leading-relaxed max-w-sm"
                  >
                    Your AI-powered financial intelligence engine. Ask anything about investments, markets, or personal finance.
                  </motion.p>
                </div>

                {/* Suggestion cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
                  {SUGGESTIONS.map((s, i) => {
                    const Icon = s.icon
                    return (
                      <motion.button
                        key={s.text}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.09, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        onClick={() => send(s.text)}
                        className="group relative text-left px-4 py-4 rounded-[16px] overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
                        style={{
                          background: "rgba(255,255,255,0.028)",
                          border: "1px solid rgba(255,255,255,0.07)",
                        }}
                        whileHover={{ borderColor: "rgba(139,92,246,0.25)" }}
                      >
                        {/* Hover spotlight */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 rounded-[16px] transition-opacity duration-400"
                          style={{ background: "radial-gradient(circle at 30% 50%, rgba(109,40,217,0.07), transparent 70%)" }}
                        />
                        <div className="relative flex items-center gap-3">
                          <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-300"
                            style={{ background: "rgba(139,92,246,0.1)" }}>
                            <Icon className="w-3.5 h-3.5 text-violet-400/70 group-hover:text-violet-400 transition-colors duration-300" />
                          </div>
                          <span className="text-[13px] text-gray-500 font-medium group-hover:text-gray-200 transition-colors duration-300 leading-snug">
                            {s.text}
                          </span>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {messages.map((msg, i) =>
            msg.role === "user"
              ? <UserBubble key={msg.id} text={msg.text} />
              : <AssistantBubble key={msg.id} text={msg.text}
                  animate={i === messages.length - 1 && msg.id !== "welcome"} />
          )}

          <AnimatePresence>{thinking && <Thinking key="thinking" />}</AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar with neon glow border */}
      <div className="relative z-10 flex-shrink-0 px-4 md:px-6 pb-6 pt-3 max-w-2xl mx-auto w-full">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-4 md:inset-x-6 inset-y-3"
          style={{
            background: "conic-gradient(from var(--glow-angle), #7c3aed, #2563eb, #06b6d4, #a855f7, #ec4899, #7c3aed)",
            animation: "glow-card-spin 5s linear infinite",
            borderRadius: 20,
            filter: "blur(22px)",
            opacity: input.trim() ? 0.7 : 0.35,
            transform: "scale(1.04)",
            transition: "opacity 0.4s ease",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-4 md:inset-x-6 inset-y-3"
          style={{
            background: "conic-gradient(from var(--glow-angle), #7c3aed, #2563eb, #06b6d4, #a855f7, #ec4899, #7c3aed)",
            animation: "glow-card-spin 5s linear infinite",
            borderRadius: 20,
            filter: "blur(48px)",
            opacity: input.trim() ? 0.35 : 0.15,
            transform: "scale(1.10)",
            transition: "opacity 0.4s ease",
          }}
        />

        <div
          className="relative"
          style={{
            background: "conic-gradient(from var(--glow-angle), #7c3aed, #2563eb, #06b6d4, #a855f7, #ec4899, #7c3aed)",
            animation: "glow-card-spin 5s linear infinite",
            padding: "1.5px",
            borderRadius: 20,
          }}
        >
          <div
            className="flex items-end gap-3 px-4 py-3.5"
            style={{ background: "rgba(5, 3, 14, 0.98)", borderRadius: 19 }}
          >
            <textarea
              ref={(el) => { inputRef.current = el; textareaRef.current = el }}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                e.target.style.height = "auto"
                e.target.style.height = Math.min(e.target.scrollHeight, 130) + "px"
              }}
              onKeyDown={onKey}
              placeholder="Ask anything about your finances..."
              className="flex-1 bg-transparent resize-none outline-none text-[15px] text-gray-200 placeholder:text-gray-700 leading-relaxed min-h-[24px] max-h-[130px]"
              style={{ scrollbarWidth: "none" }}
            />
            <motion.button
              onClick={() => send()}
              disabled={!input.trim() || thinking}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-25"
              style={{
                background: input.trim() && !thinking ? "linear-gradient(135deg, #7c3aed, #2563eb)" : "rgba(255,255,255,0.07)",
                boxShadow: input.trim() && !thinking ? "0 0 20px rgba(124,58,237,0.5)" : "none",
              }}
            >
              <Send className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-800 mt-3 tracking-wide select-none">
          Derivity AI · Under development · Responses are illustrative only
        </p>
      </div>
    </motion.div>
  )
}
