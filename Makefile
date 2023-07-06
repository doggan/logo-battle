# TODO: hmm... how to get env file depending on environment (local, etc)?
ifneq (,$(wildcard ./.env.local))
	include .env.local
	export
endif

reset-database:
	# Import company data.
	@mongoimport --uri $(MONGODB_URI)	\
		--drop	\
		--collection=companies --file=./db/seeders/companies.json	\
		--jsonArray
	# Cleanout existing results.
	@echo "" | mongoimport --uri $(MONGODB_URI)	\
		--drop	\
		--collection=results

get-companies:
	pnpm run get-companies

scrape-logos:
	pnpm run scrape-logos
