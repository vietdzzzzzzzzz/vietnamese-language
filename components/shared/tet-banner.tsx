"use client"

export function TetBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white">
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,215,0,0.35),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(255,215,0,0.25),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.15),transparent_50%)]" />
      </div>
      <div className="relative px-4 py-5 sm:px-10 sm:py-6 md:pr-28">
        <div className="flex flex-col gap-2">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-yellow-100">
            Tết rộn ràng
          </span>
          <h2 className="text-xl font-bold sm:text-3xl">Chào xuân mới, luyện tập bứt phá cùng GYMORA</h2>
          <p className="text-sm text-yellow-100 sm:text-base">
            Sức khỏe dồi dào, phong độ thăng hoa, cả năm sung túc.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2 px-4 pb-4 sm:mt-5 sm:gap-4 sm:px-10 sm:pb-6">
        <img
          src="https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif"
          alt="Pháo hoa"
          className="h-8 w-8 rounded-full border-2 border-white/80 bg-white shadow-md sm:h-12 sm:w-12"
        />
        <img
          src="https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif"
          alt="Mèo meme"
          className="h-8 w-8 rounded-full border-2 border-white/80 bg-white shadow-md sm:h-12 sm:w-12"
        />
        <img
          src="https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"
          alt="Đèn lồng"
          className="h-8 w-8 rounded-full border-2 border-white/80 bg-white shadow-md sm:h-12 sm:w-12"
        />
      </div>
    </section>
  )
}
