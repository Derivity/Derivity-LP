export const SIDEBAR_PAGE_DATA = {
  dashboard: {
    title: 'Financial Command Center',
    subtitle: 'Live overview of your accounts, cash flow, and market exposure.',
    kpis: [
      { label: 'Net Worth', value: 'Rs 42.8L', delta: '+2.1% this month' },
      { label: 'Monthly Savings', value: 'Rs 78,000', delta: 'Target: Rs 75,000' },
      { label: 'Debt Ratio', value: '18%', delta: 'Healthy range' },
    ],
    highlights: [
      'Equity allocation is 4% above your target risk profile.',
      'Emergency fund now covers 6.4 months of expenses.',
      'Insurance cover check due in 9 days.',
    ],
    actions: [
      'Review equity rebalance recommendation.',
      'Confirm April SIP step-up by 10%.',
      'Upload latest salary slip for income projection updates.',
    ],
  },
  portfolio: {
    title: 'Portfolio Allocation',
    subtitle: 'Current distribution across equity, debt, gold, and cash.',
    kpis: [
      { label: 'Equity', value: '62%', delta: 'Target 58%' },
      { label: 'Debt', value: '22%', delta: 'Target 25%' },
      { label: 'Gold + Cash', value: '16%', delta: 'On target' },
    ],
    highlights: [
      'Large-cap funds continue to outperform your benchmark by 1.8%.',
      'International ETF exposure is currently 6%.',
      'Debt ladder maturity concentration in Q4 is slightly high.',
    ],
    actions: [
      'Shift 4% from equity to short-duration debt funds.',
      'Add one global ETF SIP line for diversification.',
      'Reduce overlap between two index funds.',
    ],
  },
  watchlist: {
    title: 'Watchlist Intelligence',
    subtitle: 'Assets and sectors currently under active tracking.',
    kpis: [
      { label: 'Assets Tracked', value: '12', delta: '4 alerts this week' },
      { label: 'Top Mover', value: 'NVIDIA +6.2%', delta: '1D performance' },
      { label: 'Risk Alerts', value: '2', delta: 'Action needed' },
    ],
    highlights: [
      'Banking sector momentum remains positive above 50-day average.',
      'Gold retraced 1.4% after RBI policy commentary.',
      'USD/INR volatility is above monthly baseline.',
    ],
    actions: [
      'Set downside alert for Nifty below 22,100.',
      'Track earnings date for Infosys and TCS this week.',
      'Review forex hedge if USD/INR crosses 84.20.',
    ],
  },
  goals: {
    title: 'Goal Planner',
    subtitle: 'Progress tracking for retirement, home fund, and education.',
    kpis: [
      { label: 'Retirement Goal', value: '34% funded', delta: 'On track' },
      { label: 'Home Downpayment', value: 'Rs 11.2L', delta: '68% funded' },
      { label: 'Education Corpus', value: 'Rs 6.5L', delta: 'Ahead by 3 months' },
    ],
    highlights: [
      'Current SIP pace supports retirement target by age 50.',
      'Home goal can be accelerated by adding Rs 8,000 monthly.',
      'Education fund projection assumes 9% return and 7% inflation.',
    ],
    actions: [
      'Approve recommended SIP top-up for home goal.',
      'Update goal timeline if purchase date has changed.',
      'Review inflation assumptions for long-term goals.',
    ],
  },
  reports: {
    title: 'Research & Reports',
    subtitle: 'Briefings, strategy notes, and weekly summaries.',
    kpis: [
      { label: 'Weekly Brief', value: 'Published', delta: 'Today 08:00 AM' },
      { label: 'Macro Signals', value: 'Neutral', delta: 'Unchanged' },
      { label: 'Portfolio Health', value: '8.7 / 10', delta: '+0.4 this month' },
    ],
    highlights: [
      'Rate-sensitive sectors may stay volatile for the next 2 weeks.',
      'SIP inflows remain strong, supporting large-cap stability.',
      'Rebalance window suggested before month-end close.',
    ],
    actions: [
      'Read this week\'s tactical allocation note.',
      'Compare your portfolio score vs previous quarter.',
      'Export advisor-ready monthly report PDF.',
    ],
  },
}
