export default function Loader() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black backdrop-blur-sm"
    >
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 animate-bounce rounded-full bg-white [animation-delay:-0.3s] motion-reduce:animate-pulse" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-white [animation-delay:-0.15s] motion-reduce:animate-pulse" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-white motion-reduce:animate-pulse" />
      </div>
    </div>
  );
}