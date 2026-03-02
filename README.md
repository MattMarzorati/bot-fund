# bot-fund

Automated daily allocation reporter for the gFund wallet on Berachain.

## Project layout

- `gfund-agent/`: TypeScript service that fetches allocations/APYs/premium and sends emails.

## gfund-agent

### Features

- Pulls Kodiak wallet allocation and TVL share for 3 configured pools.
- Uses Kodiak `farmApr` as the Infrared staking APR proxy for those pool farms.
- Pulls Euler wBERA supply APY from Euler Berachain subgraph.
- Pulls Dolomite wallet position size with onchain `balanceOf` and supply APY from Vaults.fyi.
- Scrapes iBGT premium from Furthermore using Playwright.
- Sends a daily status email to configured recipients.
- Sends an extra alert email when premium is `> 5%` or `<= 0.2%`.
- Schedules execution daily at `08:00` in `Europe/Rome` timezone.

### Setup

```bash
cd gfund-agent
cp .env.example .env
npm install
npm run build
```

### Run

Run continuously (daily schedule at 08:00 Europe/Rome):

```bash
npm start
```

Run once immediately:

```bash
npm run run-once
```

### Notes

- Ensure Playwright browser dependencies are installed in your runtime environment.
- SMTP credentials should be an app password if using Gmail.
- `WALLET` and all RPC/SMTP settings are read from environment variables.
