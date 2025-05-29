export default function SectionDivider({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center w-full py-6 bg-gray-800 ">
      <div className="flex items-center w-full max-w-4xl px-4">
        {/* Left line */}
        <div className="flex-1 h-px bg-red-500 relative">
          <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full" />
        </div>

        {/* Center text box */}
        <div className="mx-4 px-4 py-1 border border-red-500 text-white font-bold text-sm tracking-widest uppercase">
          {text}
        </div>

        {/* Right line */}
        <div className="flex-1 h-px bg-red-500 relative">
          <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}
