import React from "react";

export default async function Dashboard({ userId }: { userId: string }) {
  //! Fetch les réservations du jour
  const today = new Date().toISOString().split("T")[0]; // Format : 2025-06-18

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACK_URL}/reservation?userId=${userId}&date=${today}`,
    {
      cache: "no-store",
    }
  );
  const reservationsToday = await res.json();

  const totalCouverts = reservationsToday.reduce(
    (acc: number, res: { guests: number }) => acc + res.guests,
    0
  );

  const nextReservation = reservationsToday[0];

  console.log("Total couverts for today:", totalCouverts);
  console.log("Next reservation:", nextReservation);
  console.log("Reservations for today:", reservationsToday);

  return (
    <section>
      <h1 className="text-secondary-500 font-one font-bold text-4xl pl-10 py-10">
        Dashboard
      </h1>
    </section>
  );
}
