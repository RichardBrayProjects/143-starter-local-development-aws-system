export const name = "001_create_todos";

export async function up(client) {
  await client.query(`
    create table if not exists todos (
      id bigserial primary key,
      text text not null,
      done boolean not null default false,
      created_at timestamptz not null default now()
    )
  `);
}
