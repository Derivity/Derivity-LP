import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Sparkles, RotateCcw, ArrowLeft, TrendingUp, PieChart, DollarSign, BarChart3, PanelLeft } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import ChatSidebar from "../components/ChatSidebar"
import { SIDEBAR_PAGE_DATA } from "../data/sidebarPagesData"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"

const TOPIC_RESPONSES = [
  {
    keywords: ["diversif", "portfolio", "spread", "allocat"],
    response: `**Diversification** simply means — don't put all your eggs in one basket.\n\nIf you invest all your money in one stock and it crashes, you lose everything. But if you spread it across stocks, gold, and bonds, one bad investment won't hurt you much.\n\n**A simple starting split:**\n• Stocks / Equity funds → for growth\n• Gold → for safety during bad times\n• Bonds / FDs → for stability\n\nThe idea is: when one goes down, the others usually hold up. That balance is what protects your money over the long run.\n\nStart simple — even two or three different types of investments is better than just one.`,
  },
  {
    keywords: ["dollar.cost", "dca", "averaging", "cost averaging", "regular invest"],
    response: `**Dollar-Cost Averaging (DCA)** means investing a fixed amount every month — no matter what the market is doing.\n\nInstead of trying to guess the "right time" to invest (which even experts can't do), you just invest regularly. When prices are low, you automatically buy more. When prices are high, you buy less.\n\n**Simple example:**\nInvest $5,000 every month:\n• Month 1: Price $100 → you get 50 units\n• Month 2: Price $50 → you get 100 units (more units at the same money!)\n• Month 3: Price $125 → you get 40 units\n\nOver time, your average cost stays low — without any effort from you.\n\nThis is exactly how a SIP works. Set it up once, forget about it, and let it grow.`,
  },
  {
    keywords: ["savings rate", "save", "saving", "how much to save", "income"],
    response: `A simple rule to start: **save at least 20% of whatever you earn.**\n\nIf you earn $30,000/month → try to save $6,000.\nIf you earn $100,000/month → save at least $20,000.\n\n**The 50/30/20 rule is a great guide:**\n• 50% → Needs (rent, food, bills)\n• 30% → Wants (shopping, eating out, fun)\n• 20% → Savings & investments\n\nThe key is to save first, spend later. Transfer your savings on the same day your salary arrives — before you get a chance to spend it.\n\nEven $500/month is a great start. The habit matters more than the amount.`,
  },
  {
    keywords: ["market condition", "market analysis", "current market", "analyse market", "analyze market", "market today"],
    response: `The stock market goes up and down — that's completely normal.\n\n**Two simple things to keep in mind:**\n\n**When the market is rising (Bull market):**\nStay invested. Don't try to sell and "book profits" too early. Let your money grow.\n\n**When the market is falling (Bear market):**\nDon't panic and sell. This is actually a great time to invest more — you're buying the same stocks at a discount.\n\nThe biggest mistake most people make is selling when the market falls and missing the recovery.\n\n**One simple rule:** Keep investing every month through a SIP regardless of market conditions. Time in the market always beats trying to time the market.`,
  },
  {
    keywords: ["what is a stock", "what are stocks", "stock mean", "stocks work", "what is stock", "define stock", "equity share"],
    response: `A **stock** is a small piece of ownership in a company.\n\nWhen a company wants to raise money, it sells tiny pieces of itself to the public — these are called stocks (or shares). When you buy a stock, you become a part-owner of that company.\n\n**How you make money:**\n• If the company grows and does well, the stock price goes up — you profit.\n• Some companies also share their profits with you regularly — these are called dividends.\n\n**Simple example:**\nYou buy 10 shares of a company at $100 each (spend $1,000). A year later, the shares are worth $150 each. Your $1,000 is now $1,500 — a 50% gain.\n\nBuying a stock = believing in that company's future. That's the core idea.`,
  },
  {
    keywords: ["sip", "systematic investment", "mutual fund", "what is sip", "sip mean"],
    response: `**SIP (Systematic Investment Plan)** means investing a small fixed amount every month into a mutual fund — automatically.\n\nThink of it like a recurring deposit, except your money goes into the stock market (through a fund) and can grow much more over time.\n\n**How it works:**\n• You choose an amount — even $500/month\n• On a fixed date, it auto-deducts from your bank\n• Your money buys units of a mutual fund\n• Over years, these units grow in value\n\n**Why SIP is great for beginners:**\n• No need to watch the market every day\n• You build wealth slowly and steadily\n• Works on autopilot once set up\n\n$5,000/month for 20 years at 12% return = around **$4.9 million**. From just $1.2 million invested. That's the power of SIP + time.`,
  },
  {
    keywords: ["strateg", "invest strateg", "basic strateg", "how to invest", "investment tip", "beginner", "start investing", "where to invest"],
    response: `Just starting out? Here are the **simplest strategies** that actually work:\n\n**1. Start a SIP in a mutual fund**\nPick a Nifty 50 index fund and set up a monthly SIP. Even $500–$1,000/month. Don't overthink it.\n\n**2. Buy and Hold**\nBuy good stocks or funds and just… hold them for years. Don't sell when prices dip. This is how most long-term wealth is built.\n\n**3. Don't try to time the market**\nNobody can predict when the market will go up or down — not even experts. Invest regularly instead.\n\n**4. Diversify**\nDon't put everything in one place. Spread across stocks, gold, and some fixed-income options.\n\n**The golden rule:**\nStart early. Stay consistent. Don't panic. That's honestly 90% of successful investing.`,
  },
  // ── General questions ──────────────────────────────────────────────────────
  {
    keywords: ["compound", "compounding", "compound interest", "power of compounding"],
    response: `**Compounding** means your money earns returns, and then those returns also earn returns. It's like a snowball rolling downhill — it keeps getting bigger on its own.\n\n**Simple example:**\nYou invest $100,000 at 12% per year:\n• Year 1: $112,000\n• Year 5: $176,000\n• Year 10: $310,000\n• Year 20: $964,000 — nearly 10x!\n\nYou didn't add a single dollar after the first investment. Time did all the work.\n\n**The key insight:** The earlier you start, the more compounding works in your favour. Starting at 22 vs 32 can mean having 3x more money at retirement — just because of those extra 10 years.\n\nStart now, even with a small amount. Time is your biggest advantage.`,
  },
  {
    keywords: ["inflation", "what is inflation", "inflation affect", "inflation mean", "inflation rate"],
    response: `**Inflation** means prices go up over time — so the same amount of money buys less in the future.\n\n**Simple example:**\nA movie ticket that cost $100 in 2010 might cost $300 today. Your $100 didn't change, but what it can buy did.\n\n**Why this matters for your money:**\nIf your money is just sitting in a savings account earning 3%, but inflation is 6%, you're actually losing 3% of your purchasing power each year.\n\n**What to do:**\nMake sure your money grows faster than inflation. Equity (stocks/mutual funds) have historically given 12–15% returns — well above inflation. Gold and real estate also help.\n\n**Rule of thumb:** Money sitting idle = slowly losing value. Money invested wisely = growing faster than inflation.`,
  },
  {
    keywords: ["index fund", "etf", "exchange traded", "nifty 50 fund", "passive fund", "what is index"],
    response: `An **Index Fund** is a type of mutual fund that simply copies a market index — like the Nifty 50.\n\nInstead of a fund manager trying to pick the best stocks (and charging you a fee for it), an index fund automatically holds all 50 stocks in the Nifty 50. When the index goes up, your investment goes up too.\n\n**Why it's great for beginners:**\n• Very low cost (no expensive fund manager)\n• Automatically diversified across 50 big companies\n• Historically, outperforms most actively managed funds over the long run\n\n**ETF** is the same idea but it trades on the stock exchange like a regular stock.\n\n**Recommendation for beginners:** A Nifty 50 index fund SIP is one of the best ways to start investing — simple, low cost, and proven over decades.`,
  },
  {
    keywords: ["what is a bond", "what are bonds", "bond mean", "fixed income", "government bond", "debt fund"],
    response: `A **bond** is basically a loan you give to a government or company — and they pay you interest in return.\n\n**Simple example:**\nYou lend $10,000 to the government for 5 years at 7% interest. Every year they pay you $700, and at the end of 5 years you get your $10,000 back.\n\n**Bonds vs Stocks:**\n• Bonds → steady, predictable income, lower risk\n• Stocks → higher growth potential, but prices go up and down\n\n**When bonds are useful:**\n• When you want safety and regular income\n• As a cushion in your portfolio — when stocks fall, bonds usually stay stable\n\nMost people use bonds as a "safety" part of their portfolio — not to get rich, but to protect existing wealth.`,
  },
  {
    keywords: ["bull market", "bear market", "bull run", "market crash", "correction", "rally"],
    response: `These are just terms for market direction:\n\n**Bull Market** = market going up 📈\nPrices are rising, economy is doing well, people are optimistic. Good time to stay invested.\n\n**Bear Market** = market going down 📉\nPrices are falling, often by 20% or more. People get scared. But historically, every bear market ends and markets recover.\n\n**Market Correction** = a smaller dip (10–20%)\nHappens regularly — roughly every 1–2 years. Totally normal.\n\n**What should you do?**\n• In a bull market: Stay invested. Don't get greedy.\n• In a bear market: Don't panic sell. Keep your SIPs running — you're buying at lower prices.\n\nThe investors who stay calm during downturns are the ones who build real wealth. Every market crash in history has been followed by a recovery.`,
  },
  {
    keywords: ["emergency fund", "emergency", "rainy day", "liquid fund", "safety net"],
    response: `An **emergency fund** is money you keep aside for unexpected situations — job loss, medical bills, urgent repairs.\n\n**How much to save:**\n• Minimum: 3 months of your expenses\n• Ideal: 6 months of your expenses\n\nIf you spend $30,000/month, aim for $0.18 million in your emergency fund.\n\n**Where to keep it:**\nNot in a regular savings account (too easy to spend). Use a **liquid mutual fund** — it earns better returns and you can withdraw within 24 hours whenever needed.\n\n**Why it matters:**\nWithout one, any emergency will force you to break your investments or take a loan. With one, you're protected and can let your investments grow undisturbed.\n\nBuild this before anything else. It's your financial safety net.`,
  },
  {
    keywords: ["risk", "risk management", "how risky", "risk appetite", "risk tolerance", "volatility", "safe investment"],
    response: `In investing, **risk** simply means the chance that your investment might go down in value.\n\n**Different investments = different risk levels:**\n• Fixed Deposits / Government bonds → Very low risk, lower returns\n• Mutual funds (debt) → Low to medium risk\n• Mutual funds (equity) → Medium to high risk, but historically best long-term returns\n• Individual stocks → High risk\n• Crypto → Very high risk\n\n**Simple rule:** The higher the potential return, the higher the risk. There's no free lunch.\n\n**How to decide your risk level?**\nAsk yourself: "If my investment dropped 30% tomorrow, would I panic or stay calm?"\n• Panic → stick to safer options like debt funds or FDs\n• Stay calm → you can take more equity exposure\n\n**The best risk management tool:** Time. The longer you stay invested, the less equity risk hurts you.`,
  },
  {
    keywords: ["fixed deposit", "fd", "what is fd", "bank deposit", "term deposit"],
    response: `A **Fixed Deposit (FD)** is one of the safest ways to save money in India.\n\nYou deposit a fixed amount with a bank for a set period (say 1 year), and they guarantee you a fixed interest rate (around 6–7.5% currently).\n\n**The good:**\n• Completely safe — no market risk\n• Guaranteed returns\n• FDs up to $0.5 million are insured by the government\n\n**The not-so-good:**\n• Returns are taxed as income — so real returns after tax can be low\n• Often doesn't beat inflation in the long run\n\n**When FD is the right choice:**\n• Money you absolutely cannot lose\n• Short-term goals (1–3 years)\n• Emergency fund (though liquid mutual funds are slightly better)\n\nFDs are great for safety, but relying on them alone won't help you build wealth over time.`,
  },
  {
    keywords: ["ppf", "public provident fund", "what is ppf", "tax saving", "80c", "elss", "tax benefit", "nps", "national pension"],
    response: `**Tax-saving investments** let you reduce your tax bill AND grow your money — a double benefit.\n\n**The most common ones:**\n\n**PPF (Public Provident Fund)**\nLike an FD but tax-free. Government-backed, earns ~7.1%. 15-year lock-in. Very safe.\n\n**ELSS (Equity Linked Savings Scheme)**\nA type of mutual fund with a 3-year lock-in. Because it invests in stocks, returns can be much higher (12–15%). Best for long-term wealth + tax saving.\n\n**NPS (National Pension System)**\nBuilds a retirement fund. Extra $50,000 tax deduction beyond normal limits.\n\n**How much you can save on tax:**\nInvest up to $0.15 million in these → reduce your taxable income by $0.15 million (saves $15,000–$45,000 in taxes depending on your slab).\n\n**Quick advice:** If you want the best of both tax saving + returns, ELSS is usually the top pick.`,
  },
  {
    keywords: ["crypto", "cryptocurrency", "bitcoin", "ethereum", "web3", "digital currency", "blockchain"],
    response: `**Cryptocurrency** is digital money that exists only online — not issued or controlled by any government or bank.\n\n**Most well-known ones:**\n• **Bitcoin** — the original, most popular, often called "digital gold"\n• **Ethereum** — powers smart contracts and apps on the blockchain\n\n**The appeal:**\n• Can grow a lot in a short time\n• Decentralised — no government controls it\n\n**The risks (very real):**\n• Can drop 50–80% just as fast as it rises\n• No regulations protecting you if something goes wrong\n• Very speculative — no real earnings backing the price\n\n**Simple advice:**\nIf you want to invest in crypto, keep it to a small portion (5–10% max) of your total investments. Never invest money you can't afford to lose completely.\n\nCrypto is high-risk, high-reward. Build your core investments (SIPs, FDs, gold) first.`,
  },
  {
    keywords: ["trading", "trading vs investing", "day trading", "swing trading", "intraday", "short term trading"],
    response: `**Trading** means buying and selling stocks/assets quickly to profit from short-term price changes. **Investing** means buying and holding for the long term.\n\n**Trading:**\n• You watch charts and prices daily (or even hourly)\n• Profits are quick — but so are losses\n• Very stressful and time-consuming\n• SEBI data: 9 out of 10 retail traders lose money\n\n**Investing:**\n• Buy good stocks or funds, hold for years\n• Much less effort once set up\n• Historically, patient investors grow wealthy\n• Much less tax (lower long-term capital gains rate)\n\n**The honest truth:** Most people who try trading lose money. Long-term investing through SIPs is boring — but it reliably builds wealth.\n\nIf you're curious about trading, try paper trading first (no real money) to learn without burning your savings.`,
  },
  {
    keywords: ["demat", "demat account", "trading account", "how to buy stock", "open account", "zerodha", "groww", "broker"],
    response: `A **Demat account** is like a digital locker for your stocks and investments — it stores them electronically.\n\nJust like a bank account holds your money, a Demat account holds your shares, mutual fund units, and bonds.\n\n**To start investing in stocks you need:**\n1. Demat account (holds your investments)\n2. Trading account (to buy/sell — usually opened together with Demat)\n3. Bank account (for money transfers)\n\n**Popular apps to open one:**\n• **Groww** — Best for beginners, very simple\n• **Zerodha (Kite)** — Most popular overall\n• **Upstox** — Good fees, easy to use\n\n**How to open:**\nDownload the app → Enter PAN + Aadhaar → Take a selfie → Done in 15 minutes. Account activates in 1–2 days.\n\n**Tip for beginners:** You don't even need a Demat account to start with mutual fund SIPs — you can do that directly on Groww or Zerodha's Coin app.`,
  },
  {
    keywords: ["pe ratio", "p/e ratio", "price to earning", "valuation", "how to value", "intrinsic value", "fundamental analysis"],
    response: `The **P/E Ratio** (Price-to-Earnings) tells you if a stock is expensive or cheap relative to what the company actually earns.\n\n**Simple formula:**\nP/E = Stock Price ÷ Earnings per Share\n\n**What it means in plain English:**\nA P/E of 20 means you're paying $20 for every $1 the company earns per year. Like paying 20 years' worth of earnings upfront.\n\n**Generally:**\n• Low P/E (below 15) → potentially cheap (but check if the business is declining)\n• Medium P/E (15–25) → fair value for most companies\n• High P/E (above 30) → expensive — investors are betting heavily on future growth\n\n**Simple use case:**\nCompare the P/E of two similar companies. The one with a lower P/E (and good fundamentals) is usually the better value pick.\n\nDon't use P/E alone — it's one piece of the puzzle.`,
  },
  {
    keywords: ["gold", "invest in gold", "gold vs stock", "sovereign gold bond", "sgb", "digital gold", "gold etf"],
    response: `**Gold** is a classic safe-haven asset — people buy it when they're worried about the economy or stock market.\n\n**Why hold some gold:**\n• When stocks fall, gold often rises — it balances your portfolio\n• Protects against inflation over the long term\n• Universally accepted store of value\n\n**Best ways to invest in gold today:**\n• **Sovereign Gold Bond (SGB)** — Issued by the government. You earn gold returns PLUS 2.5% interest per year. Zero tax if held for 8 years. Best option.\n• **Gold ETF** — Buy gold like a stock. No storage hassle, easy to sell.\n• **Physical gold** — Jewellery has high making charges; not ideal for pure investment.\n\n**How much gold to hold:**\nAround 10% of your portfolio is a good rule. Gold is insurance for your portfolio — not the main asset.\n\nThink of gold as a safety cushion, not a growth engine.`,
  },
  {
    keywords: ["real estate", "property invest", "buy property", "rent vs buy", "house invest", "reits", "reit"],
    response: `**Real estate** is one of India's most loved investments — but there are some important things to know before jumping in.\n\n**The good:**\n• You own a physical asset\n• Can earn rental income\n• Prices generally rise over time\n\n**The catch:**\n• Very expensive to buy (and sell — stamp duty, registration add 6–8% cost)\n• Not easy to sell quickly if you need money\n• Home loans tie you to large EMIs for 15–20 years\n\n**A simpler way to invest in real estate — REITs:**\nREITs (Real Estate Investment Trusts) let you invest in commercial properties (offices, malls) from as little as $10,000–15,000. They're listed on the stock exchange and pay regular dividends.\n\n**Rent vs Buy:**\nBuying a home for emotional reasons is understandable. But purely as an investment? Run the numbers first — renting + investing in equity often wins financially.\n\nReal estate is good diversification, but don't put all your wealth into one property.`,
  },
  {
    keywords: ["what is derivity", "who are you", "what can you do", "about derivity", "tell me about yourself", "derivity ai"],
    response: `I'm **Derivity AI** — your personal finance assistant, here to make money simple.\n\nI can explain any finance topic in plain language — from the very basics ("what is a stock?") to more advanced ideas ("how do I diversify my portfolio?").\n\n**Things you can ask me:**\n• What is a SIP / stock / mutual fund / ETF?\n• How does compounding work?\n• What's the difference between trading and investing?\n• How do I start investing with $500/month?\n• What is a credit score and how do I improve it?\n• How do bonds, gold, or real estate work?\n\nI'm still being trained, so my answers are based on financial knowledge — not live market data. But I'll give you honest, jargon-free explanations.\n\nWhat would you like to understand today?`,
  },
  // ── More basic questions ───────────────────────────────────────────────────
  {
    keywords: ["what is nav", "nav mean", "net asset value", "unit price", "fund price"],
    response: `**NAV (Net Asset Value)** is simply the price of one unit of a mutual fund.\n\nJust like a stock has a price (e.g., $200/share), a mutual fund has a NAV (e.g., $85/unit).\n\n**How it works:**\nWhen you invest $5,000 into a mutual fund with a NAV of $50, you get 100 units. When the NAV rises to $70, your investment is worth $7,000.\n\n**One common mistake:** People think a fund with a low NAV ($15) is cheaper or better than one with a high NAV ($150). That's not true. What matters is how much the NAV grows over time — not its starting price.\n\nNAV is updated once a day after market hours — unlike stock prices which change every second.`,
  },
  {
    keywords: ["what is dividend", "dividend mean", "dividend income", "how dividend works", "dividend paying"],
    response: `A **dividend** is when a company shares some of its profit with you — just for owning its stock.\n\n**Simple example:**\nYou own 100 shares of a company. The company announces a $5 dividend per share. You receive $500 directly in your account — without selling a single share.\n\n**Why companies pay dividends:**\nIt's their way of saying "we're doing well and want to reward our shareholders."\n\n**Dividend yield:**\nIf a stock costs $200 and pays $10/year as dividend, the yield is 5% — meaning you earn 5% just from dividends, plus any price appreciation.\n\n**Tax note:** Dividends are added to your income and taxed at your normal tax rate.\n\nDividend stocks are popular with people who want regular income from their investments — like a quarterly "salary" from their portfolio.`,
  },
  {
    keywords: ["what is nifty", "what is sensex", "nifty 50", "bse sensex", "stock market index", "what is an index", "market index"],
    response: `**Nifty 50** and **Sensex** are like a report card for the Indian stock market.\n\nThey track a basket of the biggest, most important companies in India. When people say "the market went up 1% today," they mean Nifty or Sensex moved up 1%.\n\n**Nifty 50:**\n• Top 50 companies on NSE (National Stock Exchange)\n• Includes Reliance, TCS, HDFC Bank, Infosys, etc.\n\n**Sensex:**\n• Top 30 companies on BSE (Bombay Stock Exchange)\n• Older and well-known globally\n\n**Why they matter to you:**\nIf you invest in a Nifty 50 index fund, your investment grows roughly in line with Nifty. When India's top companies do well, you do well too.\n\nThink of Nifty/Sensex as the overall pulse of the Indian economy.`,
  },
  {
    keywords: ["what is nse", "what is bse", "stock exchange", "how stock exchange works", "national stock exchange", "bombay stock exchange"],
    response: `**NSE and BSE** are the two main stock exchanges in India — they're the marketplaces where stocks are bought and sold.\n\n**BSE (Bombay Stock Exchange):**\n• Founded in 1875 — Asia's oldest\n• 5,000+ companies listed\n• Index: Sensex (top 30 companies)\n\n**NSE (National Stock Exchange):**\n• Founded in 1992 — fully electronic from day one\n• Higher trading volume — most popular today\n• Index: Nifty 50 (top 50 companies)\n\n**How they work (simple version):**\nCompanies list their shares here. You (as an investor) can then buy or sell those shares through a broker app like Zerodha or Groww. The exchange just connects buyers and sellers safely.\n\nYou don't directly visit these exchanges — everything happens through your broker app.`,
  },
  {
    keywords: ["credit score", "cibil", "credit rating", "credit report", "credit history", "loan eligibility"],
    response: `Your **credit score** (CIBIL score in India) is a number between 300–900 that shows banks how trustworthy you are with money.\n\nA high score = banks trust you = you get loans easily at lower interest rates.\nA low score = banks see you as risky = loan rejection or very high interest.\n\n**Score guide:**\n• 750–900 → Excellent ✅ (best loan terms)\n• 700–749 → Good\n• Below 650 → Needs improvement ❌\n\n**How to maintain a good score:**\n• Always pay credit card bills and EMIs on time\n• Don't use more than 30% of your credit card limit\n• Don't apply for too many loans at once\n\n**How to check:** Visit cibil.com — one free report per year.\n\nYour credit score is your financial reputation. Protect it.`,
  },
  {
    keywords: ["what is emi", "emi mean", "loan emi", "equated monthly", "home loan", "personal loan", "car loan", "loan interest"],
    response: `**EMI (Equated Monthly Instalment)** is the fixed amount you pay every month to repay a loan.\n\nWhen you take a loan, instead of paying it all back at once, you pay smaller amounts every month for a fixed number of years. Each payment includes a bit of the principal (what you borrowed) and interest.\n\n**Simple example:**\nYou borrow $0.5 million for a car at 10% interest for 3 years.\nYour EMI ≈ $16,000/month\nTotal you pay back ≈ $0.576 million ($76,000 extra as interest)\n\n**Important:** The longer the loan tenure, the lower the EMI — but you pay much more in interest overall.\n\n**Tip:** Always compare interest rates across banks before taking any loan. Even 1–2% difference can save you thousands over years.`,
  },
  {
    keywords: ["what is insurance", "insurance mean", "life insurance", "term insurance", "health insurance", "term plan"],
    response: `**Insurance** is simple — you pay a small amount regularly (premium), and if something bad happens, the insurance company pays you a large amount to cover the damage.\n\n**Two insurances everyone must have:**\n\n**Term Life Insurance:**\nIf you pass away, your family gets a large payout (e.g., $10 million) to replace your income. Very affordable — a $10 million cover costs around $8,000–12,000/year for a 30-year-old.\n\n**Health Insurance:**\nCovers your hospital bills. Medical costs in India are rising 14% per year — one serious illness can wipe out years of savings without insurance.\n\n**Key rule:**\nInsurance is protection, not investment. Buy a simple term plan + health cover. Skip complex products like ULIPs that mix the two.\n\nGet these two before anything else — they're your financial safety net.`,
  },
  {
    keywords: ["what is budget", "budgeting", "how to budget", "manage money", "personal finance", "money management", "financial planning"],
    response: `**Budgeting** just means deciding in advance where your money will go — instead of wondering at the end of the month where it all went.\n\n**The simplest method — 50/30/20:**\n• 50% → Essentials (rent, food, bills, transport)\n• 30% → Lifestyle (dining out, entertainment, shopping)\n• 20% → Savings & investments\n\n**The most powerful trick:**\nMove your savings on the day you get paid. Don't wait to see "what's left." Automate a transfer to your savings/investment account first thing.\n\n**Getting started:**\n1. Write down your income and what you spend it on for one month\n2. Identify the top 2–3 areas where you overspend\n3. Set a limit for each category\n4. Check in at the end of each month\n\nYou don't need a complex spreadsheet. Even a basic note on your phone works.`,
  },
  {
    keywords: ["what is net worth", "net worth mean", "how to calculate net worth", "calculate wealth", "assets liabilities"],
    response: `Your **net worth** is the simplest way to measure how financially healthy you are.\n\n**Formula:**\n**Net Worth = Everything you own − Everything you owe**\n\n**What you own (assets):**\nCash, bank balance, mutual funds, stocks, gold, property, etc.\n\n**What you owe (liabilities):**\nHome loan balance, car loan, credit card debt, personal loans, etc.\n\n**Example:**\nYou have $1.0 million in mutual funds + $5.0 million flat = $6.0 million in assets\nYou owe $3.0 million on your home loan + $0.2 million credit card = $3.2 million in liabilities\nYour net worth = $2.8 million\n\n**Why track it?**\nYour salary shows what you earn. Your net worth shows what you're actually keeping and building. Calculate it once a year — if it's growing, you're on the right track.`,
  },
  {
    keywords: ["capital gain", "ltcg", "stcg", "tax on stock", "tax on mutual fund", "investment tax", "how is investment taxed"],
    response: `When you sell an investment for a profit, the government taxes that profit — this is called **capital gains tax**.\n\n**The tax depends on how long you held the investment:**\n\n**For stocks & equity mutual funds:**\n• Held less than 1 year → 20% tax (Short-term)\n• Held more than 1 year → 12.5% tax on profits above $0.125 million (Long-term)\n\n**Quick tip:** Just by holding your investments for more than a year, you nearly halve your tax rate. That's a huge incentive to invest long-term.\n\n**For FDs & debt funds:**\nProfits are added to your income and taxed at your normal slab rate.\n\n**For gold bonds (SGBs):**\nZero tax if held for the full 8-year term — the best tax deal in investing.\n\nKeep records of when you bought and sold — your broker app usually handles this for you.`,
  },
  {
    keywords: ["sebi", "what is sebi", "securities exchange board", "market regulator", "rbi", "reserve bank", "what is rbi"],
    response: `**SEBI** and **RBI** are the two main financial watchdogs in India — they keep your money safe.\n\n**SEBI (Securities and Exchange Board of India):**\nSEBI is like the police of the stock market. It makes sure brokers, mutual funds, and companies play fair. If a company commits fraud or a broker cheats you, SEBI investigates and penalises them.\n\n**RBI (Reserve Bank of India):**\nRBI is the "central bank" — the bank for all banks. It controls interest rates, manages the dollar, and ensures the banking system stays stable. When RBI raises interest rates, home loan EMIs go up. When it cuts rates, EMIs come down.\n\n**Why they matter to you:**\n• SEBI ensures every mutual fund and broker you use is regulated and legitimate\n• RBI's decisions directly affect your EMIs, FD rates, and the economy overall\n\nBoth work to protect your money from fraud and economic instability.`,
  },
  {
    keywords: ["ipo", "initial public offering", "what is ipo", "how ipo works", "should i invest ipo", "new listing"],
    response: `An **IPO (Initial Public Offering)** is when a private company lists on the stock market for the first time — offering its shares to the general public.\n\n**Simple example:**\nA startup that was privately owned decides to raise money by selling shares to everyone. It lists on NSE/BSE. Now anyone can buy a piece of that company.\n\n**How to apply for an IPO:**\n• Open your broker app (Groww, Zerodha, etc.)\n• Find the IPO section, pick the IPO, enter the quantity\n• Your money is blocked (not debited) until shares are allotted\n• If you don't get shares, your money is released immediately\n\n**Should you invest in every IPO?**\nNot necessarily. Some IPOs give great listing gains (50%+). Others list lower than the issue price. It's not a guaranteed profit.\n\n**Tip:** Research the company before applying. Avoid IPOs based purely on hype or "grey market premium." Treat it like any investment — check the business fundamentals.`,
  },
  {
    keywords: ["dollar.cost", "dca", "averaging", "cost averaging", "regular invest"],
    response: `Dollar-Cost Averaging (DCA) is one of the most powerful — and underrated — strategies for everyday investors.\n\n**How it works:** Instead of investing a lump sum at once, you invest a fixed amount at regular intervals (monthly, weekly). You buy more units when prices are low and fewer when prices are high — automatically.\n\n**Example:**\n• Month 1: $5,000 at $100/unit → 50 units\n• Month 2: $5,000 at $80/unit → 62.5 units\n• Month 3: $5,000 at $125/unit → 40 units\n• Average cost: ~$98/unit vs. a single buy at $100\n\n**Why it works:** It removes the impossible task of timing the market. Even professionals get market timing wrong. DCA turns volatility into your friend.\n\n**Best used for:** SIPs in mutual funds, recurring stock purchases, or crypto accumulation over time.\n\nConsistency beats perfection — every time.`,
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
    response: `A **SIP (Systematic Investment Plan)** is a method of investing a fixed amount regularly into a mutual fund — weekly, monthly, or quarterly.\n\n**Think of it as:** A recurring deposit, but instead of a bank account, your money goes into a market-linked mutual fund that can grow much faster over time.\n\n**How SIP works:**\n1. You pick a mutual fund and a fixed amount (e.g., $2,000/month).\n2. On a set date, the amount is auto-debited from your bank account.\n3. You receive mutual fund units at that day's NAV (Net Asset Value / price).\n4. Over time, you accumulate units and benefit from compounding + dollar cost averaging.\n\n**Why SIP is powerful:**\n• **Discipline:** Automates investing — no willpower needed.\n• **Compounding:** Earnings generate their own earnings over time. $5,000/month at 12% return for 20 years ≈ **$4.9 million** from just $1.2 million invested.\n• **dollar cost averaging:** You buy more units when markets dip, reducing your average cost.\n• **Flexible:** Start with as little as $500/month. Pause or stop anytime.\n\n**Best for:** Long-term goals — retirement, child's education, wealth building. The key is to stay consistent and not stop during market dips.`,
  },
  {
    keywords: ["strateg", "invest strateg", "basic strateg", "how to invest", "investment tip", "beginner", "start investing", "where to invest"],
    response: `Here are the core investment strategies every investor should know:\n\n**1. Buy & Hold (Long-term investing)**\nBuy quality stocks or index funds and hold for 5–10+ years. Warren Buffett's favourite — lets compounding do the heavy lifting.\n\n**2. SIP / Dollar-Cost Averaging**\nInvest a fixed amount regularly regardless of market conditions. Removes emotion and timing risk from investing.\n\n**3. Value Investing**\nBuy stocks trading below their intrinsic value — find great companies at discounted prices. Requires research and patience.\n\n**4. Growth Investing**\nInvest in companies growing revenue/profits faster than the market average. Higher risk, higher reward — tech and consumer sectors often dominate here.\n\n**5. Index Investing (Passive strategy)**\nInvest in index funds (Nifty 50, Sensex) that mirror the entire market. Low cost, low effort, beats most active fund managers over time.\n\n**6. Dividend Investing**\nBuild a portfolio of dividend-paying stocks for regular passive income. Great for retirees or those wanting cash flow.\n\n**Golden rules regardless of strategy:**\n• Start early — time is your biggest advantage.\n• Diversify — never put all eggs in one basket.\n• Avoid panic selling — stay the course during corrections.\n• Keep costs low — high fees silently kill returns.`,
  },
  // ── General questions ──────────────────────────────────────────────────────
  {
    keywords: ["compound", "compounding", "compound interest", "power of compounding"],
    response: `**Compounding** is often called the 8th wonder of the world — and for good reason.\n\n**What it means:** You earn returns not just on your original investment, but also on all the returns you've already earned. Your money makes money, which then makes more money.\n\n**Simple example:**\n• Invest $100,000 at 12% per year\n• Year 1: $112,000\n• Year 5: $176,234\n• Year 10: $310,585\n• Year 20: $964,629 — nearly 10x, without adding a dollar!\n\n**The two keys to maximising compounding:**\n• **Time** — The longer you stay invested, the more dramatic the effect. Starting at 25 vs 35 can mean 3x more wealth at retirement.\n• **Rate of return** — Even a 2% difference in annual returns creates massive gaps over 20–30 years.\n\n**What kills compounding:**\n• Withdrawing early and breaking the cycle\n• High fees eating into returns\n• Stopping SIPs during market downturns\n\nStart early, stay invested, and let time do the work.`,
  },
  {
    keywords: ["inflation", "what is inflation", "inflation affect", "inflation mean", "inflation rate"],
    response: `**Inflation** is the gradual rise in prices over time — which means the purchasing power of your money falls if it's just sitting idle.\n\n**In simple terms:** If a coffee costs $100 today and inflation is 6%, the same coffee will cost $106 next year. Your $100 buys less.\n\n**Why it matters for investors:**\n• A savings account earning 3.5% when inflation is 6% = you're losing 2.5% of real value every year.\n• Your investments must beat inflation to actually grow your wealth.\n\n**Asset classes vs inflation:**\n• **Equities (stocks/mutual funds)** — Historically the best inflation beaters. Long-term equity returns (12–15%) comfortably exceed inflation.\n• **Gold** — A classic hedge; tends to rise when inflation is high.\n• **Real estate** — Property prices typically rise with inflation.\n• **Fixed deposits / bonds** — Often struggle to beat inflation after tax.\n• **Cash** — Worst option during high inflation; always loses real value.\n\n**Rule of thumb:** Always calculate your "real return" = Nominal return − Inflation rate. That's your actual gain in purchasing power.`,
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
    response: `An **emergency fund** is money set aside for unexpected expenses — job loss, medical emergency, urgent repairs — without having to liquidate investments or take loans.\n\n**How much do you need?**\n• **Minimum:** 3 months of living expenses\n• **Recommended:** 6 months of living expenses\n• **If freelancer/variable income:** 9–12 months\n\n**Example:** If your monthly expenses are $40,000, your emergency fund target = $240,000 (6 months).\n\n**Where to keep it:**\n• **NOT in a savings account** (too low a rate, tempting to spend)\n• **Liquid mutual funds** — Returns of 6–7%, instant redemption within 24 hours, no lock-in. Best option.\n• **Overnight funds or ultra short-term debt funds** — Similar to liquid funds, slightly higher returns.\n• **Sweep-in FD** — Earns FD rates but can be broken instantly.\n\n**Why it's the foundation of financial health:**\n• Without it, any emergency forces you to sell investments at possibly the worst time.\n• It gives you psychological security to take more calculated risks with the rest of your wealth.\n\nBuild your emergency fund before investing anywhere else.`,
  },
  {
    keywords: ["risk", "risk management", "how risky", "risk appetite", "risk tolerance", "volatility", "safe investment"],
    response: `**Risk** in investing means the possibility that your investment's value will go down — or that you won't achieve your expected return.\n\n**Types of investment risk:**\n• **Market risk:** The whole market falls (2008 crisis, COVID crash).\n• **Company risk:** A specific company performs badly or goes bankrupt.\n• **Inflation risk:** Your returns don't beat inflation — you lose purchasing power.\n• **Liquidity risk:** You can't sell quickly when you need cash.\n• **Credit risk:** A bond issuer defaults on payment.\n\n**Risk vs Return:** Higher potential return always comes with higher risk. There's no free lunch in investing.\n\n**How to assess your risk appetite:**\n• **Conservative:** Can't sleep if portfolio drops 10%. → Focus on debt funds, FDs, bonds.\n• **Moderate:** Comfortable with 15–20% temporary dips for better long-term returns. → Balanced mix of equity + debt.\n• **Aggressive:** Can handle 40–50% drawdowns knowing it will recover. → Heavy equities, small-cap, growth stocks.\n\n**How to manage risk:**\n• Diversify across asset classes\n• Invest for the long term (time reduces equity risk dramatically)\n• Never invest money you need within 3 years in equities\n• Maintain an emergency fund so market downturns don't force you to sell`,
  },
  {
    keywords: ["fixed deposit", "fd", "what is fd", "bank deposit", "term deposit"],
    response: `A **Fixed Deposit (FD)** is a savings instrument offered by banks where you deposit a lump sum for a fixed tenure at a predetermined interest rate.\n\n**Key features:**\n• Interest rates: typically 6–7.5% per year (varies by bank and tenure)\n• Tenure: 7 days to 10 years\n• Guaranteed returns — no market risk\n• Premature withdrawal allowed (with a small penalty)\n\n**Is FD a good investment?**\n• **For safety:** Yes — FDs up to $0.5 million are insured by DICGC per bank.\n• **For wealth creation:** Not ideal. After 30% tax on interest, real returns often barely beat inflation.\n\n**Better alternatives depending on your goal:**\n• **Emergency fund:** Liquid mutual funds (better returns, same liquidity)\n• **Short-term goals (1–3 years):** Debt mutual funds (more tax-efficient)\n• **Long-term wealth:** Equity mutual funds via SIP (far superior returns over 7+ years)\n\n**When FD makes sense:**\n• Senior citizens (extra 0.5% rate + stable income)\n• Capital you absolutely cannot afford to lose\n• Short-term parking of large sums (house purchase, festival expenses)\n\nFDs are safe but shouldn't be your only savings vehicle.`,
  },
  {
    keywords: ["ppf", "public provident fund", "what is ppf", "tax saving", "80c", "elss", "tax benefit", "nps", "national pension"],
    response: `**Tax-saving investments** let you reduce your taxable income while building wealth — a double win.\n\n**Section 80C (up to $0.15 million deduction):**\n• **PPF (Public Provident Fund):** 7.1% tax-free returns, 15-year lock-in. Sovereign guarantee. Excellent for conservative long-term saving.\n• **ELSS (Equity Linked Savings Scheme):** Mutual funds with 3-year lock-in (shortest among 80C options). Equity exposure means 12–15% potential returns. Best wealth creator among 80C options.\n• **EPF (Employee Provident Fund):** Employer + employee contribution, 8.25% tax-free for salaried individuals.\n• **NSC, Tax-saving FD:** 5-year lock-in, fixed returns. Lower potential than ELSS.\n\n**NPS (National Pension System) — 80CCD:**\n• Additional $50,000 deduction over 80C limit.\n• Invests in equity + debt; builds retirement corpus.\n• Partial withdrawal at 60; annuity required for 40% of corpus.\n\n**Smart approach:**\n• Max out ELSS SIPs first (best returns + tax benefit)\n• Contribute to PPF for safe, tax-free debt allocation\n• Use NPS for additional $50k deduction if you're in the 30% tax bracket\n\n**Remember:** Don't invest only for tax saving — ensure the investment aligns with your goals.`,
  },
  {
    keywords: ["crypto", "cryptocurrency", "bitcoin", "ethereum", "web3", "digital currency", "blockchain"],
    response: `**Cryptocurrency** is a digital or virtual currency that uses cryptography (blockchain technology) for security and operates without a central authority like a bank or government.\n\n**Popular cryptocurrencies:**\n• **Bitcoin (BTC):** The original. Often called "digital gold" — a store of value.\n• **Ethereum (ETH):** A programmable blockchain powering smart contracts and DeFi apps.\n• **Others (Altcoins):** Thousands exist — most are highly speculative.\n\n**The case for crypto (potential upsides):**\n• High return potential — Bitcoin delivered 200%+ in bull cycles.\n• Portfolio diversification — Low long-term correlation with traditional assets.\n• Inflation hedge narrative — Fixed supply (Bitcoin capped at 21 million).\n\n**The risks (very real):**\n• **Extreme volatility:** 50–80% crashes are common. Not for the faint-hearted.\n• **Regulatory risk:** Governments can restrict or heavily tax crypto.\n• **No intrinsic value guarantee:** Unlike stocks (tied to business earnings) or gold (industrial use).\n• **Security risk:** Exchange hacks, lost wallets — your keys, your crypto.\n\n**Derivity's take:** Crypto can be a small speculative allocation (5–10% max) for high-risk-tolerance investors — but it should never replace a core equity + debt portfolio. Never invest more than you can afford to lose completely.`,
  },
  {
    keywords: ["trading", "trading vs investing", "day trading", "swing trading", "intraday", "short term trading"],
    response: `**Trading** and **Investing** both involve financial markets — but they're fundamentally different approaches.\n\n**Investing:**\n• Time horizon: Years to decades\n• Goal: Wealth creation through compounding and business growth\n• Effort: Research companies/funds, then let time work\n• Risk: Lower (markets recover over time)\n• Tax: LTCG (10% above $0.1 million on equity after 1 year)\n• Success rate: High for disciplined, patient investors\n\n**Trading (Day/Swing/F&O):**\n• Time horizon: Minutes to weeks\n• Goal: Profit from short-term price movements\n• Effort: Constant monitoring, technical analysis, fast decisions\n• Risk: Very high — a few bad trades can wipe out months of gains\n• Tax: STCG (15%) or business income (slab rate for F&O)\n• Success rate: Studies show 85–90% of retail traders lose money\n\n**F&O (Futures & Options) — Extra caution:**\nSEBI data shows 9 out of 10 F&O traders lose money. Leverage amplifies both gains and losses. Not recommended without deep expertise.\n\n**Derivity's recommendation:** For most people, long-term investing via SIPs and diversified equity funds will outperform active trading with a fraction of the stress and risk. If you want to trade, start with paper trading (no real money) to learn without losses.`,
  },
  {
    keywords: ["demat", "demat account", "trading account", "how to buy stock", "open account", "zerodha", "groww", "broker"],
    response: `A **Demat account** (Dematerialised account) holds your stocks, bonds, ETFs, and mutual fund units in digital form — just like a bank account holds money.\n\n**To start investing in stocks, you need:**\n• **Demat account** — Holds your securities\n• **Trading account** — Used to place buy/sell orders (usually linked to Demat)\n• **Bank account** — For funds transfer\n\nMost brokers open all three together.\n\n**Popular brokers in India:**\n• **Zerodha** — Largest discount broker. $0 for delivery trades, $20 per F&O order. Kite platform is excellent.\n• **Groww** — Very beginner-friendly. Great for mutual funds + stocks.\n• **Upstox** — Competitive pricing, good for active traders.\n• **Angel One, ICICI Direct, HDFC Securities** — Full-service brokers with research support (higher fees).\n\n**How to open:**\n1. Choose a broker and download their app\n2. Complete KYC (Aadhaar + PAN + selfie — fully online, takes 10–15 minutes)\n3. Account activated in 24–48 hours\n4. Transfer funds and start investing\n\n**Key tip:** For beginners, start with direct mutual funds (no Demat needed) via Groww or Coin by Zerodha — simpler and lower risk than direct stock picking.`,
  },
  {
    keywords: ["pe ratio", "p/e ratio", "price to earning", "valuation", "how to value", "intrinsic value", "fundamental analysis"],
    response: `**P/E Ratio (Price-to-Earnings)** is one of the most widely used metrics to gauge if a stock is cheap or expensive.\n\n**Formula:** P/E = Stock Price ÷ Earnings Per Share (EPS)\n\n**What it means:** If a stock has a P/E of 20, investors are paying $20 for every $1 of annual earnings. A higher P/E means the market expects strong future growth (or the stock is overvalued).\n\n**Interpreting P/E:**\n• **P/E < 15** — Potentially undervalued (or declining business)\n• **P/E 15–25** — Fair value for most established companies\n• **P/E > 30** — Growth priced in; expensive unless growth is exceptional\n• **Nifty 50 average P/E** — Historically 18–22. Above 24 = caution zone.\n\n**Important context:**\n• Compare P/E within the same industry — tech stocks naturally carry higher P/E than banks.\n• A low P/E could be a value opportunity or a value trap (declining business).\n• Use alongside other metrics: P/B ratio, ROE, debt levels, revenue growth.\n\n**Other key valuation metrics:**\n• **P/B (Price-to-Book):** Useful for banks and asset-heavy companies\n• **EV/EBITDA:** Good for comparing companies with different debt levels\n• **PEG Ratio:** P/E adjusted for growth rate — a PEG below 1 often signals undervaluation`,
  },
  {
    keywords: ["gold", "invest in gold", "gold vs stock", "sovereign gold bond", "sgb", "digital gold", "gold etf"],
    response: `**Gold** has been a store of value for thousands of years — and it still plays a relevant role in a modern portfolio.\n\n**Why invest in gold:**\n• **Inflation hedge:** Gold tends to hold its purchasing power over long periods.\n• **Safe haven:** During market crashes, recessions, or geopolitical crises, gold often rises while stocks fall.\n• **Portfolio diversifier:** Low/negative correlation with equities — reduces overall portfolio volatility.\n\n**Forms of gold investment:**\n• **Physical gold (jewellery/coins/bars):** High making charges, storage risk, not ideal for investment.\n• **Gold ETF:** Buy gold like a stock on exchange. Low cost, pure play on gold price. No storage worries.\n• **Sovereign Gold Bond (SGB):** Issued by RBI. You get gold price appreciation PLUS 2.5% annual interest. Zero capital gains tax if held to maturity (8 years). **Best option for long-term gold allocation.**\n• **Digital gold:** Convenient but check the platform's credibility. Not regulated like ETFs/SGBs.\n\n**How much gold to hold:** 5–10% of your portfolio is a widely recommended allocation. Gold shouldn't be your primary investment — it doesn't generate earnings like stocks.\n\n**Bottom line:** Gold is insurance, not a growth engine. Hold it as a hedge, not as your core wealth-building asset.`,
  },
  {
    keywords: ["real estate", "property invest", "buy property", "rent vs buy", "house invest", "reits", "reit"],
    response: `**Real estate** is one of India's most popular investments — though it comes with both unique advantages and often-overlooked drawbacks.\n\n**Pros of real estate:**\n• Tangible asset with intrinsic utility\n• Rental income provides cash flow\n• Leverage (home loan) can amplify returns\n• Emotional value of owning property\n\n**The real costs (often ignored):**\n• High transaction costs: stamp duty (5–7%), registration, brokerage\n• Illiquid — can take months to sell, unlike stocks you can exit in seconds\n• Maintenance, property tax, vacancy risk if renting out\n• EMI lock-in for 15–20 years limits financial flexibility\n• Real estate returns (5–8% CAGR in most cities) often barely beat inflation after costs\n\n**REITs (Real Estate Investment Trusts) — A smarter alternative:**\n• Invest in commercial real estate (offices, malls) without buying property\n• Traded on stock exchange — liquid like stocks\n• Mandatory 90% profit distribution as dividends\n• Start with $10,000–15,000 (vs. $5.0 million+ for physical property)\n• Popular in India: Embassy REIT, Mindspace REIT, Nexus Select Trust\n\n**Rent vs Buy:**\nIf your Price-to-Rent ratio (property price ÷ annual rent) is above 20, renting + investing the difference in equity funds often beats buying financially.`,
  },
  {
    keywords: ["what is derivity", "who are you", "what can you do", "about derivity", "tell me about yourself", "derivity ai"],
    response: `I'm **Derivity AI** — your personal financial intelligence engine.\n\n**What I'm being built to do:**\n• Analyse your entire financial picture in one place — income, expenses, investments, goals\n• Provide institutional-grade portfolio insights, previously reserved for hedge funds and HNIs\n• Synthesise market signals, macro data, and personal finance data into clear, actionable advice\n• Help you build wealth through intelligent automation — rebalancing, SIP optimisation, tax-loss harvesting\n• Answer any finance question — from "what is a stock?" to complex multi-asset portfolio analysis\n\n**Where I am now:**\nI'm currently in active training. My responses are illustrative and based on financial knowledge — not connected to live market data or your personal accounts yet. That full experience is rolling out soon.\n\n**What I can help you with today:**\nAsk me about stocks, SIPs, mutual funds, trading strategies, budgeting, tax saving, inflation, compounding — I'll give you my best thinking.\n\nDerivity exists because everyone deserves financial intelligence that was once only available to the ultra-wealthy. That's the mission. What would you like to explore?`,
  },
  // ── More basic questions ───────────────────────────────────────────────────
  {
    keywords: ["what is nav", "nav mean", "net asset value", "unit price", "fund price"],
    response: `**NAV (Net Asset Value)** is the per-unit price of a mutual fund — essentially what one unit of that fund is worth at any given time.\n\n**How it's calculated:**\nNAV = (Total value of fund's assets − Liabilities) ÷ Total number of units\n\n**Simple example:**\nIf a mutual fund owns stocks worth $100 million and has 10 million units outstanding, the NAV = $10 per unit.\n\n**Key things to know about NAV:**\n• Mutual fund NAV is updated once daily after market close (unlike stocks which change every second).\n• A **low NAV doesn't mean the fund is cheap** — it just means the fund is newer or has distributed dividends. What matters is the fund's performance and quality of underlying assets.\n• When you invest via SIP, you get units at whatever the NAV is on that day.\n• When you redeem, you get the NAV at that day's closing price.\n\n**NAV vs Stock Price:**\nThink of NAV as the stock price of a mutual fund. But unlike stocks, you can't profit by trading NAV fluctuations within a day — it moves once daily.\n\nFocus on fund performance (returns over 3, 5, 10 years) rather than absolute NAV value when choosing a fund.`,
  },
  {
    keywords: ["what is dividend", "dividend mean", "dividend income", "how dividend works", "dividend paying"],
    response: `A **dividend** is a portion of a company's profits distributed to its shareholders — a reward for owning the stock.\n\n**How it works:**\n• Company earns profit → Board decides to share some of it with shareholders → Dividend is paid per share.\n• Example: If a company declares $5 dividend per share and you own 100 shares → you receive $500.\n\n**Types of dividends:**\n• **Cash dividend:** Direct money paid to your bank/Demat account. Most common.\n• **Stock dividend (Bonus shares):** Company gives extra shares instead of cash.\n• **Interim dividend:** Paid during the financial year.\n• **Final dividend:** Paid after the year-end results are announced.\n\n**Key terms:**\n• **Dividend yield:** Annual dividend ÷ Stock price × 100. A 3% yield means you earn $3 per year for every $100 invested.\n• **Ex-dividend date:** You must own the stock before this date to receive the dividend.\n\n**Tax on dividends (India):**\nDividends are added to your income and taxed at your income tax slab rate — so high earners pay up to 30% tax on dividend income.\n\n**Dividend investing strategy:** Focus on companies with consistent dividend history and growing payouts — a sign of financial health and shareholder-friendly management.`,
  },
  {
    keywords: ["what is nifty", "what is sensex", "nifty 50", "bse sensex", "stock market index", "what is an index", "market index"],
    response: `**Nifty 50** and **Sensex** are stock market indices — benchmarks that track the overall health of the Indian stock market.\n\n**Nifty 50 (NSE):**\n• Tracks the top 50 companies listed on the National Stock Exchange by market capitalisation.\n• Covers sectors like IT, banking, energy, FMCG, pharma.\n• Companies include Reliance, TCS, HDFC Bank, Infosys, Wipro, etc.\n• Base year: 1995 (base value 1,000). Now at ~22,000+ — a 22x rise in ~30 years.\n\n**Sensex (BSE):**\n• Tracks the top 30 companies on the Bombay Stock Exchange.\n• Older index — base year 1979 (base value 100). Now at ~73,000+ — a 730x rise.\n• Fewer stocks than Nifty but covers India's largest blue-chip companies.\n\n**Why they matter:**\n• When news says "markets rose 1% today" they mean Nifty/Sensex moved 1%.\n• They're the ultimate measure of India's economic and corporate health.\n• Mutual funds and portfolio performance are benchmarked against them.\n\n**NSE vs BSE:**\n• NSE has higher trading volume and is preferred by most traders.\n• BSE is older (Asia's oldest stock exchange, est. 1875).\n• Most large companies are listed on both.`,
  },
  {
    keywords: ["what is nse", "what is bse", "stock exchange", "how stock exchange works", "national stock exchange", "bombay stock exchange"],
    response: `**NSE (National Stock Exchange)** and **BSE (Bombay Stock Exchange)** are India's two main stock exchanges — the marketplaces where stocks are bought and sold.\n\n**BSE (Bombay Stock Exchange):**\n• Established in 1875 — Asia's oldest stock exchange.\n• Located in Mumbai's Dalal Street.\n• Hosts 5,000+ listed companies — the most of any exchange in the world.\n• Benchmark index: **Sensex** (top 30 companies).\n\n**NSE (National Stock Exchange):**\n• Established in 1992 — younger but now the dominant exchange by trading volume.\n• First fully electronic exchange in India — revolutionised transparent price discovery.\n• Benchmark index: **Nifty 50** (top 50 companies).\n• Where most derivatives (F&O) trading happens in India.\n\n**How they work:**\n• Companies list their shares on these exchanges to raise money from the public (via IPO).\n• After listing, investors buy and sell shares among themselves — exchange just facilitates this.\n• Trades are settled in T+1 day (you get shares/money the next business day).\n\n**SEBI** (Securities and Exchange Board of India) regulates both exchanges to protect investors and ensure fair markets.`,
  },
  {
    keywords: ["credit score", "cibil", "credit rating", "credit report", "credit history", "loan eligibility"],
    response: `Your **credit score** (also called CIBIL score in India) is a 3-digit number between 300–900 that represents your creditworthiness — how likely you are to repay loans on time.\n\n**Score ranges:**\n• **750–900:** Excellent. Best loan rates, easy approval. ✅\n• **700–749:** Good. Decent rates, most loans approved.\n• **650–699:** Fair. Higher interest rates, harder to get premium cards.\n• **Below 650:** Poor. High rejection risk, very high interest if approved. ❌\n\n**What affects your score:**\n• **Payment history (35%):** Most important. Never miss EMIs or credit card dues.\n• **Credit utilisation (30%):** Use less than 30% of your credit card limit.\n• **Credit age (15%):** Older accounts help. Don't close your oldest credit card.\n• **Credit mix (10%):** Mix of home loan, credit card shows you can handle different credit types.\n• **New inquiries (10%):** Too many loan applications in a short time hurts your score.\n\n**How to improve your score:**\n• Pay all EMIs and credit card bills on or before due date — set auto-pay.\n• Keep credit card utilisation below 30%.\n• Don't apply for multiple loans/cards at once.\n• Check your CIBIL report free once a year at cibil.com and dispute any errors.`,
  },
  {
    keywords: ["what is emi", "emi mean", "loan emi", "equated monthly", "home loan", "personal loan", "car loan", "loan interest"],
    response: `**EMI (Equated Monthly Instalment)** is the fixed monthly payment you make to repay a loan — it covers both the principal (original amount borrowed) and the interest.\n\n**Simple example:**\n• Home loan: $5.0 million at 8.5% for 20 years\n• EMI ≈ $43,391/month\n• Total paid over 20 years ≈ $10.4 million\n• Interest paid = $5.4 million on a $5.0 million loan — more than the principal!\n\n**Types of loans and typical rates (India 2026):**\n• **Home loan:** 8–9.5% (lowest — secured by property)\n• **Car loan:** 8.5–12%\n• **Personal loan:** 11–24% (highest — unsecured, no collateral)\n• **Education loan:** 8–14%\n\n**Smart borrowing tips:**\n• Always compare EMIs across banks — even 0.5% difference saves a lot over 20 years.\n• Prepay when you can — extra payments reduce interest dramatically on long-tenure loans.\n• Avoid personal loans for non-essential purchases — 20%+ interest is very expensive.\n• For home loans, claim Section 24 (interest) and 80C (principal) tax deductions.`,
  },
  {
    keywords: ["what is insurance", "insurance mean", "life insurance", "term insurance", "health insurance", "term plan"],
    response: `**Insurance** is a financial safety net — you pay a small regular premium, and in return, the insurer covers large financial losses from unexpected events.\n\n**The two essential insurances everyone needs:**\n\n**1. Term Life Insurance**\n• Pays a lump sum to your family if you die during the policy period.\n• Pure protection — no investment component (that's why it's cheap).\n• A $10 million cover for a 30-year-old typically costs just $8,000–12,000/year.\n• **Who needs it:** Anyone with financial dependents (spouse, kids, parents, EMIs).\n• **How much:** At least 10–15x your annual income.\n• **Avoid:** ULIPs and endowment plans — they mix insurance + investment poorly. Buy term + invest separately.\n\n**2. Health Insurance**\n• Covers hospitalisation, surgery, and medical bills.\n• Medical inflation in India is 14%+ per year — a 3-day hospital stay can cost $0.3-1.0 million.\n• **Minimum cover:** $1.0 million for individuals; $1.5-2.5 million for families.\n• Get it early — premiums are lower when you're young and healthy.\n\n**Golden rule:** Insurance is not an investment. Buy the cheapest term plan, maximum health cover, and invest the rest.`,
  },
  {
    keywords: ["what is budget", "budgeting", "how to budget", "manage money", "personal finance", "money management", "financial planning"],
    response: `**Budgeting** is the foundation of financial health — it's simply knowing where your money comes from and deciding where it goes, before it disappears.\n\n**The best budgeting frameworks:**\n\n**50/30/20 Rule (Simple & effective):**\n• 50% → Needs: rent, groceries, utilities, EMIs\n• 30% → Wants: dining, entertainment, travel, subscriptions\n• 20% → Savings & investments\n\n**Pay Yourself First (Best for wealth building):**\nAs soon as salary hits, auto-transfer your savings/investment amount. Spend what remains. You never miss what you never see.\n\n**Zero-based budgeting (Most detailed):**\nAssign every dollar a job. Income − All expenses = $0. Nothing is "unaccounted for."\n\n**Practical steps to start:**\n• Track expenses for 30 days (use Google Sheets, Walnut app, or Money Manager)\n• Identify your top 3 spending categories — that's where waste usually hides\n• Set up automatic SIP and savings transfers on salary day\n• Review monthly — adjust as life changes\n\n**One powerful shift:** Treat investments as a fixed expense, not "what's left over." Wealthy people invest first, spend second.`,
  },
  {
    keywords: ["what is net worth", "net worth mean", "how to calculate net worth", "calculate wealth", "assets liabilities"],
    response: `Your **net worth** is the most honest measure of your financial health — the total picture of where you stand.\n\n**Formula:**\n**Net Worth = Total Assets − Total Liabilities**\n\n**Assets (what you own):**\n• Cash and bank balances\n• Mutual funds, stocks, ETFs\n• PPF, EPF, NPS balance\n• Fixed deposits\n• Gold and jewellery (market value)\n• Real estate (market value)\n\n**Liabilities (what you owe):**\n• Home loan outstanding\n• Car loan outstanding\n• Personal loan / credit card debt\n\n**Example:**\n• Assets: $4.0 million (mutual funds) + $6.0 million (flat) + $0.5 million (gold) = $10.5 million\n• Liabilities: $3.5 million (home loan) + $0.2 million (car loan) = $3.7 million\n• Net worth = $10.5 million − $3.7 million = **$6.8 million**\n\n**Why it matters:**\n• Tracks real wealth progress over time — income alone doesn't tell the full story.\n• Helps identify if debt is growing faster than assets (a warning sign).\n• Motivates better financial decisions when you see the number grow.\n\n**Goal:** Calculate your net worth annually. Consistent, steady growth year after year is the target.`,
  },
  {
    keywords: ["capital gain", "ltcg", "stcg", "tax on stock", "tax on mutual fund", "investment tax", "how is investment taxed"],
    response: `When you sell an investment for a profit, the government taxes that profit — this is called **capital gains tax**.\n\n**The tax depends on how long you held the investment:**\n\n**For stocks & equity mutual funds:**\n• Held less than 1 year → 20% tax (Short-term)\n• Held more than 1 year → 12.5% tax on profits above $0.125 million (Long-term)\n\n**Quick tip:** Just by holding for more than 1 year, you nearly halve your tax rate. That's a big reason to invest long-term.\n\n**For FDs & debt funds:**\nProfits are added to your income and taxed at your normal tax slab.\n\n**For gold bonds (SGBs):**\nZero tax if held for the full 8-year term — the best tax deal in investing.\n\nYour broker app (Groww, Zerodha, etc.) usually shows a full tax breakdown under the P&L section.`,
  },
  {
    keywords: ["sebi", "what is sebi", "securities exchange board", "market regulator", "rbi", "reserve bank", "what is rbi"],
    response: `**SEBI** and **RBI** are the two main financial watchdogs in India — they keep your money safe.\n\n**SEBI (Securities and Exchange Board of India):**\nSEBI is like the police of the stock market. It makes sure brokers, mutual funds, and companies play fair. If any company commits fraud or a broker cheats you, SEBI investigates and takes action.\n\n**RBI (Reserve Bank of India):**\nRBI is the central bank — the bank for all banks. It controls interest rates, manages the dollar, and keeps the banking system stable. When RBI raises rates, home loan EMIs go up. When it cuts rates, EMIs come down.\n\n**Why they matter to you:**\n• SEBI ensures every mutual fund and broker you use is regulated and legitimate\n• RBI's decisions directly affect your loans, FD rates, and the overall economy\n\nBoth exist to protect your money from fraud and instability.`,
  },
  {
    keywords: ["ipo", "initial public offering", "what is ipo", "how ipo works", "should i invest ipo", "new listing"],
    response: `An **IPO (Initial Public Offering)** is when a private company lists on the stock market for the first time — offering shares to the public.\n\n**Simple example:**\nA startup that was privately owned decides to raise money by selling shares to everyone. It lists on NSE/BSE, and now anyone can buy a piece of it.\n\n**How to apply for an IPO:**\n• Open your broker app (Groww, Zerodha, etc.)\n• Go to IPO section → pick the IPO → enter quantity\n• Your money is blocked (not debited) until shares are allotted\n• If you don't get shares, your money is released immediately\n\n**Should you invest in every IPO?**\nNot necessarily. Some give great listing gains (50%+). Others list below the issue price.\n\n**Tip:** Research the company before applying. Avoid IPOs based purely on hype — treat it like any investment and check the business first.`,
  },
]

const FALLBACK_RESPONSES = [
  "I'm still working on that one! That topic isn't in my knowledge base just yet — but I'm actively being trained to cover it. Try asking me about stocks, SIPs, mutual funds, index funds, compounding, inflation, credit scores, IPOs, or investment strategies. I've got solid answers ready for those!",
  "Hmm, that's a bit outside what I can answer right now — I'm still being trained on that topic. I work best with finance and investing questions. Try something like: 'What is a stock?', 'How does SIP work?', 'What is compounding?', or 'Explain index funds' — I'll give you a thorough answer!",
  "That one's still a work in progress for me! I'm built to answer financial and investment questions — things like budgeting, mutual funds, tax saving, market analysis, bonds, gold, or crypto. Ask me any of those and I'll walk you through it clearly.",
  "I don't have a great answer for that just yet — still working on it! I'm best at finance topics: portfolio diversification, EMIs, credit scores, NAV, dividends, SEBI & RBI, and more. What financial topic can I help you with?",
  "Still working on that one! My training is focused on personal finance and investing. Ask me about stocks, SIPs, FDs, insurance, tax-saving investments, real estate vs REITs, or how to start investing — I'll give you detailed, useful advice.",
]

function getResponse(userText, fallbackIdx) {
  const match = findTopicMatch(userText)
  if (match) return match.response
  return FALLBACK_RESPONSES[fallbackIdx % FALLBACK_RESPONSES.length]
}

function normalizeForMatch(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function hasKeywordMatch(inputText, keyword) {
  const input = normalizeForMatch(inputText)
  const key = normalizeForMatch(keyword)
  if (!input || !key) return false
  if (input.includes(key)) return true

  // Also compare compact forms so variants like "nifty50" and "nifty 50" match.
  const compactInput = input.replace(/\s+/g, "")
  const compactKey = key.replace(/\s+/g, "")
  return compactInput.includes(compactKey)
}

function findTopicMatch(userText) {
  return TOPIC_RESPONSES.find(({ keywords }) =>
    keywords.some((kw) => hasKeywordMatch(userText, kw))
  )
}

const STOCK_MAP = {
  'apple': 'NASDAQ:AAPL', 'aapl': 'NASDAQ:AAPL',
  'tesla': 'NASDAQ:TSLA', 'tsla': 'NASDAQ:TSLA',
  'nvidia': 'NASDAQ:NVDA', 'nvda': 'NASDAQ:NVDA',
  'microsoft': 'NASDAQ:MSFT', 'msft': 'NASDAQ:MSFT',
  'google': 'NASDAQ:GOOGL', 'googl': 'NASDAQ:GOOGL', 'alphabet': 'NASDAQ:GOOGL',
  'amazon': 'NASDAQ:AMZN', 'amzn': 'NASDAQ:AMZN',
  'meta': 'NASDAQ:META', 'facebook': 'NASDAQ:META',
  'netflix': 'NASDAQ:NFLX', 'nflx': 'NASDAQ:NFLX',
  'bitcoin': 'BITSTAMP:BTCUSD', 'btc': 'BITSTAMP:BTCUSD',
  'ethereum': 'BITSTAMP:ETHUSD', 'eth': 'BITSTAMP:ETHUSD',
  'nifty 50': 'NSE:NIFTY', 'nifty50': 'NSE:NIFTY', 'nifty': 'NSE:NIFTY',
  'sensex': 'BSE:SENSEX',
  's&p 500': 'SP:SPX', 'sp500': 'SP:SPX', 's&p': 'SP:SPX', 'spx': 'SP:SPX',
  'gold': 'FOREXCOM:XAUUSD',
  'silver': 'FOREXCOM:XAGUSD',
  'reliance': 'NSE:RELIANCE',
  'tcs': 'NSE:TCS', 'tata consultancy': 'NSE:TCS',
  'hdfc bank': 'NSE:HDFCBANK', 'hdfcbank': 'NSE:HDFCBANK',
  'infosys': 'NSE:INFY', 'infy': 'NSE:INFY',
  'wipro': 'NSE:WIPRO',
  'icici bank': 'NSE:ICICIBANK', 'icicibank': 'NSE:ICICIBANK',
  'bajaj finance': 'NSE:BAJFINANCE',
  'adani': 'NSE:ADANIENT',
  'usd inr': 'FX_IDC:USDINR', 'dollar': 'FX_IDC:USDINR',
}

const STOCK_DISPLAY = {
  'NASDAQ:AAPL': 'Apple (AAPL)', 'NASDAQ:TSLA': 'Tesla (TSLA)',
  'NASDAQ:NVDA': 'NVIDIA (NVDA)', 'NASDAQ:MSFT': 'Microsoft (MSFT)',
  'NASDAQ:GOOGL': 'Alphabet / Google (GOOGL)', 'NASDAQ:AMZN': 'Amazon (AMZN)',
  'NASDAQ:META': 'Meta (META)', 'NASDAQ:NFLX': 'Netflix (NFLX)',
  'BITSTAMP:BTCUSD': 'Bitcoin (BTC)', 'BITSTAMP:ETHUSD': 'Ethereum (ETH)',
  'NSE:NIFTY': 'Nifty 50', 'BSE:SENSEX': 'BSE Sensex',
  'SP:SPX': 'S&P 500', 'FOREXCOM:XAUUSD': 'Gold (XAU/USD)',
  'FOREXCOM:XAGUSD': 'Silver (XAG/USD)', 'NSE:RELIANCE': 'Reliance Industries',
  'NSE:TCS': 'TCS', 'NSE:HDFCBANK': 'HDFC Bank',
  'NSE:INFY': 'Infosys', 'NSE:WIPRO': 'Wipro',
  'NSE:ICICIBANK': 'ICICI Bank', 'NSE:BAJFINANCE': 'Bajaj Finance',
  'NSE:ADANIENT': 'Adani Enterprises', 'FX_IDC:USDINR': 'USD / INR',
}

function detectStockQuery(text) {
  const normalizedText = normalizeForMatch(text)
  const priceIntent = ['price', 'chart', 'live', 'current', 'today', 'worth', 'rate', 'trading', 'how much', 'value', 'show me', 'tell me about']
  const hasPriceIntent = priceIntent.some((kw) => hasKeywordMatch(normalizedText, kw))
  const sortedKeys = Object.keys(STOCK_MAP).sort((a, b) => b.length - a.length)
  for (const name of sortedKeys) {
    if (hasKeywordMatch(normalizedText, name) && hasPriceIntent) {
      const symbol = STOCK_MAP[name]
      return { symbol, label: STOCK_DISPLAY[symbol] || name }
    }
  }
  return null
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

const markdownComponents = {
  h1: ({ children }) => <h1 className="mt-5 mb-3 text-2xl font-black tracking-[-0.03em] text-white">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-5 mb-2 text-[1.15rem] font-bold tracking-[-0.02em] text-white">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-4 mb-2 text-[1.02rem] font-semibold text-white">{children}</h3>,
  p: ({ children }) => <p className="mb-3 last:mb-0 leading-[1.75] text-gray-200">{children}</p>,
  ul: ({ children }) => <ul className="my-3 ml-5 list-disc space-y-1.5 text-gray-200">{children}</ul>,
  ol: ({ children }) => <ol className="my-3 ml-5 list-decimal space-y-1.5 text-gray-200">{children}</ol>,
  li: ({ children }) => <li className="pl-1 leading-[1.7]">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-4 rounded-2xl border border-violet-500/20 bg-white/5 px-4 py-3 text-gray-200">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
      <table className="min-w-full border-collapse text-left text-[13px] text-gray-200">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-white/[0.05] text-gray-100">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="border-b border-white/8 last:border-b-0">{children}</tr>,
  th: ({ children }) => <th className="px-4 py-3 font-semibold text-white">{children}</th>,
  td: ({ children }) => <td className="px-4 py-3 align-top text-gray-200">{children}</td>,
  a: ({ children, href }) => (
    <a href={href} className="text-violet-300 underline decoration-violet-400/40 underline-offset-4" target="_blank" rel="noreferrer">
      {children}
    </a>
  ),
  code: ({ inline, className, children, ...props }) => {
    if (inline) {
      return (
        <code className="rounded-md border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[0.9em] text-violet-200" {...props}>
          {children}
        </code>
      )
    }
    return (
      <code className={`block overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-[13px] leading-7 text-gray-100 ${className || ""}`} {...props}>
        {children}
      </code>
    )
  },
  pre: ({ children }) => <pre className="my-4 overflow-x-auto rounded-2xl border border-white/10 bg-black/40">{children}</pre>,
}

function MarkdownMessage({ content }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {content}
    </ReactMarkdown>
  )
}

function AssistantBubble({ text, animate }) {
  const displayed = useTypewriter(animate ? text : "")
  const content = animate ? displayed : text
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-4 w-full max-w-[min(54rem,92%)]"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center mt-0.5 shadow-lg shadow-violet-900/40">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex-1 min-w-0 pt-1">
        <div className="text-[15px] text-gray-200 leading-[1.75] break-words">
          <MarkdownMessage content={content} />
          {animate && content.length < text.length && (
            <span className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5 animate-pulse align-middle" />
          )}
        </div>
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
        className="max-w-[78%] rounded-2xl rounded-tr-sm px-5 py-3.5 text-[15px] leading-[1.7] text-white"
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

function StockWidget({ symbol, label }) {
  const containerRef = useRef(null)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.innerHTML = ""
    const wrap = document.createElement("div")
    wrap.className = "tradingview-widget-container"
    const inner = document.createElement("div")
    inner.className = "tradingview-widget-container__widget"
    wrap.appendChild(inner)
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js"
    script.async = true
    script.innerHTML = JSON.stringify({
      symbol,
      width: "100%",
      height: 220,
      locale: "en",
      dateRange: "1D",
      colorTheme: "dark",
      isTransparent: true,
      autosize: false,
      largeChartUrl: "",
    })
    wrap.appendChild(script)
    el.appendChild(wrap)
  }, [symbol])

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
        <p className="text-[13px] text-gray-500 mb-2">
          Live price for <span className="text-violet-400 font-medium">{label}</span>
        </p>
        <div
          ref={containerRef}
          style={{
            width: "100%",
            maxWidth: 420,
            height: 220,
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid rgba(139,92,246,0.18)",
            background: "rgba(255,255,255,0.02)",
          }}
        />
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

function SidebarPagePanel({ pageKey }) {
  const page = SIDEBAR_PAGE_DATA[pageKey]
  if (!page) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-4xl mx-auto px-4 md:px-6 py-10"
    >
      <div className="mb-8">
        <h2 className="text-[clamp(28px,4vw,40px)] font-black tracking-[-0.03em] text-white mb-2">{page.title}</h2>
        <p className="text-gray-400 text-[15px] leading-relaxed">{page.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
        {page.kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(139,92,246,0.16)",
            }}
          >
            <p className="text-[12px] text-gray-500 mb-2">{kpi.label}</p>
            <p className="text-[24px] font-bold text-white tracking-tight">{kpi.value}</p>
            <p className="text-[12px] text-violet-300 mt-1">{kpi.delta}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h3 className="text-white text-[15px] font-semibold mb-3">Highlights</h3>
          <div className="space-y-2.5">
            {page.highlights.map((item) => (
              <p key={item} className="text-[13px] text-gray-300 leading-relaxed">{item}</p>
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h3 className="text-white text-[15px] font-semibold mb-3">Recommended Next Steps</h3>
          <div className="space-y-2.5">
            {page.actions.map((item) => (
              <p key={item} className="text-[13px] text-gray-300 leading-relaxed">{item}</p>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function TryDerivity({ onBack }) {
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [input, setInput] = useState("")
  const [thinking, setThinking] = useState(false)
  const [fallbackIdx, setFallbackIdx] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [desktopSidebarVisible, setDesktopSidebarVisible] = useState(true)
  const [conversations, setConversations] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)
  const [activeSection, setActiveSection] = useState("chat")
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const textareaRef = useRef(null)
  const sessionIdRef = useRef(`web-${Date.now()}`)

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
    ;(async () => {
      try {
        if (msg.startsWith("/market ")) {
          const q = msg.replace("/market ", "").trim()
          const marketRes = await fetch(`${API_BASE_URL}/api/chat/market?q=${encodeURIComponent(q)}`)
          if (!marketRes.ok) throw new Error(`Market API failed (${marketRes.status})`)
          const marketData = await marketRes.json()
          const s = marketData?.snapshot
          const marketText = `**Market Snapshot**\n• ${s?.symbol || "N/A"}\n• Price: ${s?.price ?? "N/A"} ${s?.currency || ""}\n• 24h change: ${s?.change24hPct ?? "N/A"}`
          setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", text: marketText }])
          return
        }
        if (msg.startsWith("/retrieve ")) {
          const q = msg.replace("/retrieve ", "").trim()
          const retRes = await fetch(`${API_BASE_URL}/api/chat/retrieve?q=${encodeURIComponent(q)}`)
          if (!retRes.ok) throw new Error(`Retrieve API failed (${retRes.status})`)
          const retData = await retRes.json()
          const textLines = (retData?.hits || []).map((h) => `• ${h.title || h.id}: ${String(h.content || "").slice(0, 140)}...`)
          setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", text: `**Retrieved Documents**\n${textLines.join("\n") || "No matching documents."}` }])
          return
        }
        if (msg.startsWith("/ingest ")) {
          const content = msg.replace("/ingest ", "").trim()
          const ingRes = await fetch(`${API_BASE_URL}/api/chat/ingest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "Manual note", content, source: "chat-ui" }),
          })
          if (!ingRes.ok) throw new Error(`Ingest API failed (${ingRes.status})`)
          const ingData = await ingRes.json()
          setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", text: `Document ingested successfully with id: ${ingData.id}` }])
          return
        }
        if (msg.startsWith("/calc sip ")) {
          const parts = msg.replace("/calc sip ", "").trim().split(/\s+/)
          const [monthly, annualRatePct, years] = parts.map(Number)
          const calcRes = await fetch(`${API_BASE_URL}/api/chat/finance/calc`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "sip_future_value",
              payload: {
                monthlyContribution: monthly,
                annualRate: (annualRatePct || 0) / 100,
                years,
              },
            }),
          })
          if (!calcRes.ok) throw new Error(`Calc API failed (${calcRes.status})`)
          const calcData = await calcRes.json()
          setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", text: `Projected SIP future value: **${calcData.result}**` }])
          return
        }
        const payload = {
          message: msg,
          responseFormat: "json",
        }
        const res = await fetch(`${API_BASE_URL}/api/chat/structured`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-session-id": sessionIdRef.current,
          },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`API failed (${res.status})`)
        const data = await res.json()

        const parts = []
        if (data?.structured?.summary) parts.push(`**Summary:** ${data.structured.summary}`)
        if (Array.isArray(data?.structured?.key_points) && data.structured.key_points.length) {
          parts.push(`**Key points:**\n${data.structured.key_points.map((p) => `• ${p}`).join("\n")}`)
        }
        if (data?.marketSnapshot?.symbol) {
          parts.push(`**Market:** ${data.marketSnapshot.symbol} at ${data.marketSnapshot.price} ${data.marketSnapshot.currency || ""}`)
        }
        if (Array.isArray(data?.retrieved) && data.retrieved.length) {
          parts.push(`**Sources used:** ${data.retrieved.map((r) => r.title || r.id).join(", ")}`)
        }
        const response = parts.join("\n\n") || data?.reply || "No response available."
        setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", text: response }])
      } catch (_error) {
        const stockMatch = detectStockQuery(msg)
        if (stockMatch) {
          setMessages((prev) => [...prev, { id: Date.now() + 1, role: "widget", symbol: stockMatch.symbol, label: stockMatch.label }])
          setThinking(false)
          return
        }
        const response = getResponse(msg, fallbackIdx)
        const isFallback = !findTopicMatch(msg)
        if (isFallback) setFallbackIdx((i) => i + 1)
        setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", text: response }])
      } finally {
        setThinking(false)
      }
    })()
  }, [input, thinking, fallbackIdx])

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() }
  }

  const handleNewChat = () => {
    // Save current chat if it has more than welcome message
    if (messages.length > 1) {
      const firstUserMsg = messages.find(m => m.role === "user")
      const title = firstUserMsg?.text.slice(0, 40) || "New conversation"
      setConversations(prev => [{ id: Date.now(), title, messages }, ...prev])
    }
    
    // Reset to new chat
    setMessages([WELCOME_MSG])
    setInput("")
    setThinking(false)
    setFallbackIdx(0)
    setCurrentChatId(null)
    setActiveSection("chat")
    setSidebarOpen(false)
  }

  const handleSelectConversation = (id) => {
    const conv = conversations.find(c => c.id === id)
    if (conv) {
      setMessages(conv.messages)
      setCurrentChatId(id)
      setActiveSection("chat")
      setSidebarOpen(false)
    }
  }

  const reset = () => {
    handleNewChat()
  }

  const isEmpty = messages.length === 1
  const isChatSection = activeSection === "chat"
  const sectionMeta = {
    chat: conversations.length ? String(conversations.length) : undefined,
    dashboard: "Live",
    portfolio: "4 assets",
    watchlist: "12",
    goals: "3",
    reports: "Weekly",
  }

  return (
    <>
      {/* Chat Sidebar - completely separate */}
      <ChatSidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        desktopVisible={desktopSidebarVisible}
        onDesktopToggle={() => setDesktopSidebarVisible((v) => !v)}
        onNewChat={handleNewChat}
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
        currentId={currentChatId}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        sectionMeta={sectionMeta}
      />

      {/* Main chat area - full screen */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className={`fixed inset-0 z-[200] flex flex-col bg-black overflow-hidden ${desktopSidebarVisible ? 'md:pl-72' : 'md:pl-0'}`}
      >
      {!desktopSidebarVisible && (
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setDesktopSidebarVisible(true)}
          className="hidden md:flex fixed top-4 left-4 z-[220] items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white transition-colors duration-200"
          style={{
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.09)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
          title="Show sidebar"
        >
          <PanelLeft className="w-4 h-4" />
          <span className="text-[12px] font-medium tracking-wide">Show sidebar</span>
        </motion.button>
      )}

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
          title={isChatSection ? "New conversation" : "Back to chat"}
        >
          <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-[12px] font-medium tracking-wide hidden sm:block">{isChatSection ? "New chat" : "Reset"}</span>
        </motion.button>
      </div>

      {/* Messages */}
      <div
        className="relative z-10 flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.05) transparent" }}
      >
        {isChatSection ? (
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
              : msg.role === "widget"
              ? <StockWidget key={msg.id} symbol={msg.symbol} label={msg.label} />
              : <AssistantBubble key={msg.id} text={msg.text}
                  animate={i === messages.length - 1 && msg.id !== "welcome"} />
          )}

          <AnimatePresence>{thinking && <Thinking key="thinking" />}</AnimatePresence>
          <div ref={bottomRef} />
        </div>
        ) : (
          <SidebarPagePanel pageKey={activeSection} />
        )}
      </div>

      {/* Input bar with neon glow border */}
      {isChatSection && (
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
          Commands: /market BTC, /calc sip 5000 12 10, /ingest text, /retrieve query
        </p>
      </div>
      )}
      </motion.div>
    </>
  )
}
