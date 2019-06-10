import pgPromise = require('pg-promise');

const asyncMain: (fn: () => Promise<void>) => void = (fn) => {
  Promise.resolve()
    .then(() => fn())
    .catch((e: any) => {
      console.error(e);
      process.exit(1);
    });
};

const sql: string[] = [
  `
    DROP TABLE IF EXISTS groups
  `,
  `
    CREATE TABLE IF NOT EXISTS groups (
      id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      group_id varchar(50) NOT NULL,
      brand varchar(255) NOT NULL
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS group_users (
      group_id INT NOT NULL,
      user_id varchar(255) NOT NULL
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS events (
      event_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      group_id INT NOT NULL,
      name varchar(255) NOT NULL,
      start_time timestamp
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS talks (
      talk_id INT NOT NULL,
      event_id INT NOT NULL,
      title varchar(255) NOT NULL,
      fps INT NOT NULL
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS talk_presenters (
      talk_id INT NOT NULL,
      user_id varchar(255) NOT NULL,
      order INT NOT NULL
    )
  `,
];

asyncMain(async () => {
  const pgp = pgPromise();
  const db = pgp({
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT || '', 10),
    user: process.env.PGUSER,
  });

  try {
    await db.connect();
    for (const statement of sql) {
      await db.none(statement);
    }
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    console.log('kill db connection');
    await pgp.end();
  }

  console.log('Done.');
});
