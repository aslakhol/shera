db\:fix:
	@echo "Attempting to clear and restart local db. If it fails, restart Docker Desktop program or reboot.";
	docker compose -f database-docker.yml down --volumes;
	docker compose -f database-docker.yml up --build -d;
	@echo "Waiting for databases to boot..."
	@sleep 4;
	@echo "Populating seed data..."
	npm run db:reset --force;
	@echo "Local databases wiped and ready. Restart npm run dev if running..."
