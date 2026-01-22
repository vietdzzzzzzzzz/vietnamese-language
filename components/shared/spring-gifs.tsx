"use client"

export function SpringGifs() {
  return (
    <section className="py-8 border-b bg-red-50/60">
      <div className="container px-4 mx-auto">
        <div className="relative rounded-2xl border bg-card px-6 py-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-700">
            Xuân về rực rỡ
          </div>
          <h2 className="mt-3 text-2xl font-bold text-red-900">Chào mừng mùa xuân đến với GYMORA</h2>
          <p className="mt-2 text-sm text-red-700">
            Chúc bạn một năm mới tràn đầy sức khỏe và động lực luyện tập.
          </p>

          <img
            src="https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif"
            alt="Hoa đào"
            className="pointer-events-none absolute -left-2 -top-3 h-14 w-14 rounded-full border bg-white shadow-sm sm:-left-4 sm:-top-4"
          />
          <img
            src="https://media.giphy.com/media/3o7TKP6Ofv2hC2uP6c/giphy.gif"
            alt="Lì xì"
            className="pointer-events-none absolute -right-2 -top-3 h-14 w-14 rounded-full border bg-white shadow-sm sm:-right-4 sm:-top-4"
          />
          <img
            src="https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif"
            alt="Pháo hoa"
            className="pointer-events-none absolute -left-2 -bottom-3 h-14 w-14 rounded-full border bg-white shadow-sm sm:-left-4 sm:-bottom-4"
          />
          <img
            src="https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif"
            alt="Mèo meme"
            className="pointer-events-none absolute -right-2 -bottom-3 h-14 w-14 rounded-full border bg-white shadow-sm sm:-right-4 sm:-bottom-4"
          />
        </div>
      </div>
    </section>
  )
}
