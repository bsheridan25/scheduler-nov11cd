'use client'

export default function Error({ error, reset }) {
  return (
    <div className="p-4">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}