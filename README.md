# Shera

Shera is a tool for managing events without being tied to one social
network.

## Getting it running

### Database

To get the database running you need docker and make.
Then run `make db:fix` to create the db and apply the migrations.
To make migrations use `npm run db:make-migrations`.

### Running the app

When db is set up it's just `npm run dev`
