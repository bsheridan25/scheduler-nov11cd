import { sql } from '@vercel/postgres';

// Create tables if they don't exist
export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS providers (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS schedules (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      provider_id INTEGER REFERENCES providers(id),
      location TEXT NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      nurse TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

// Provider functions
export async function saveProvider(name) {
  const result = await sql`
    INSERT INTO providers (name)
    VALUES (${name})
    RETURNING id;
  `;
  return result.rows[0];
}

export async function getProviders() {
  const result = await sql`SELECT * FROM providers ORDER BY name;`;
  return result.rows;
}

// Schedule functions
export async function saveSchedule(schedule) {
  const { date, provider_id, location, start_time, end_time, nurse } = schedule;
  const result = await sql`
    INSERT INTO schedules (date, provider_id, location, start_time, end_time, nurse)
    VALUES (${date}, ${provider_id}, ${location}, ${start_time}, ${end_time}, ${nurse})
    RETURNING id;
  `;
  return result.rows[0];
}

export async function getScheduleByDate(start_date, end_date) {
  const result = await sql`
    SELECT s.*, p.name as provider_name
    FROM schedules s
    JOIN providers p ON s.provider_id = p.id
    WHERE s.date BETWEEN ${start_date} AND ${end_date}
    ORDER BY s.date, s.start_time;
  `;
  return result.rows;
}