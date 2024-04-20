db\:fix:
	@echo "Attempting to clear and restart local db. If it fails, restart Docker Desktop program or reboot.";
	docker compose -f database-docker.yml down --volumes;
	docker compose -f database-docker.yml up --build -d;
	@echo "Waiting for databases to boot..."
	@sleep 4;
	#@echo "Populating seed data..."
	# when I make a seed script
	@echo "Local databases wiped and ready. Restart yarn dev if running..."
