# Shera

Shera is a tool for managing events without being tied to one social
network.

## Getting it running

Run `npm install` to install the dependencies.

### Environment variables

Make a copy of `.env.example` and name it `.env`.
Several of the envs are set to `local`.
The app will work with these set to `local`, but certain features, such as google login and email sending, will be disabled.
Locally emails will be sent to the console instead.

### Database

To get the database running you need docker and make.
Then run `make db:fix` to create the db and apply the migrations.
To make migrations use `npm run db:make-migrations`.

### Running the app

When db is set up it's just `npm run dev`

To run the emails locally, run `npx dev:email`

That should be it, send me an email if you can't get it running.
Most likely something has changed, and I've forgot to update the README.

## Contributing

Contributions are very welcome!
There are labels for issues that are [appropriate for a PR](https://github.com/aslakhol/shera/issues?q=is%3Aopen+is%3Aissue+label%3A%22PR+Welcome%21%22), or for issues where I would like some [input and ideas](https://github.com/aslakhol/shera/issues?q=is%3Aopen+is%3Aissue+label%3A%22Ideas+%2F+Thoughts+Welcome%22).
Or if you have any other thoughts, bugs, ideas or such feel free to open a [new issue](https://github.com/aslakhol/shera/issues/new).

You're also welcome to make PRs for things that are not described in issues, but then the risk is that I might close it if I have different plans.
It's probably best to make an issue first to discuss, unless it's small stuff, then please bring the PRs!
