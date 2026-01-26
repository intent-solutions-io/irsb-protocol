// Centralized configuration for external URLs
// These can be overridden via environment variables

export const config = {
  // CTA redirect destinations
  bookCallUrl: process.env.NEXT_PUBLIC_BOOK_CALL_URL ||
    'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2AyAXFHec9JKIVgHd_NObZfGHOiYBTqjvVb3ky3ygRWpz8lF--p0UaYZPi4SwEbo0NHWhauJvS',

  requestDocsUrl: process.env.NEXT_PUBLIC_REQUEST_DOCS_URL ||
    'https://intentsolutions.io/contact?subject=IRSB%20Protocol&interest=Protocol%20Pilot',

  // Contact info
  email: 'jeremy@intentsolutions.io',
  company: 'Intent Solutions',
  companyUrl: 'https://intentsolutions.io',

  // Contract addresses (Sepolia)
  contracts: {
    solverRegistry: '0xB6ab964832808E49635fF82D1996D6a888ecB745',
    intentReceiptHub: '0xD66A1e880AA3939CA066a9EA1dD37ad3d01D977c',
    disputeModule: '0x144DfEcB57B08471e2A75E78fc0d2A74A89DB79D',
  },

  // Network
  network: 'sepolia',
  etherscanBase: 'https://sepolia.etherscan.io',
}

export function getEtherscanUrl(address: string): string {
  return `${config.etherscanBase}/address/${address}`
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
