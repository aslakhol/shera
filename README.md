Shera
Shera is a tool for managing events without being tied to one social network.

Getting it running
The only annoying thing to set up is database access, there are two options.

Our database is currently hosted in supabase. If you want to connect to the live "prod" db talk to Aslak to get the env file with a connection string.

Alternative two (the prefered alternative) is using a local sqlite instance. In prisma/schema.prisma there are instructions for swapping to the local db.

When db is set up it's just npm run dev

PS: The sqlite db might not be updated at all times, if this is the case run a migration after starting to use it (see below).

Migrations
When making changes to the prisma schema we need to make migrations.

For local db we can just use npx prisma db push

When hitting the live database we use npx prisma migrate dev --name name-of-migration

Neat stuff
npx prisma studio gives you a neat studio to see the data in the db.
