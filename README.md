# Shera

Shera is a tool for managing events without being tied to one social
network.

## Getting it running

### Database

To get the database running you need docker and make.
Then run `make db:fix` to create the db and apply the migrations.
To make migrations use `npm run db:make-migrations`.

### Envs

Make a copy of `.env.example` and name it `.env`.
Several of the envs are set to `local`.
The app will work with these set to `local`, but certain features, such as google login and email sending, will be disabled.
Locally emails will be sent to the console instead.

### Running the app

When db is set up it's just `npm run dev`

That should be it, send me an email if you can't get it running.
Most likely something has changed, and I've forgot to update the README.
