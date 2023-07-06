# Logo Battle

An app to determine which S&P 500 Company has the best looking logo, based on user votes.

## Development

- `pnpm dev` — Starts the application in development mode at `http://localhost:3000`.
- `pnpm build` — Creates an optimized production build of your application.
- `pnpm start` — Starts the application in production mode.
- `pnpm type-check` — Validate code using TypeScript compiler.
- `pnpm lint` — Runs ESLint for all files in the `src` directory.
- `pnpm format` — Runs Prettier for all files in the `src` directory.
- `make reset-database` — Seeds the database (drops all existing data).
- `make get-companies` — Builds the list of companies via the Wikipedia S&P 500 list.
- `make scrape-logos` — Using the master list of companies, scrape the logos from Wikipedia.

### Requirements

- Node.js >= 16
- pnpm 8
