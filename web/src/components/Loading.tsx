export function Loading() {
  return (
    <div className="grid min-h-screen place-content-center bg-transparent bg-opacity-25">
      <div className="flex items-center gap-2 text-white">
        <span className="h-12 w-12 block bg-zinc-900 rounded border-violet-800 border-4 border-t-violet-800 animate-spin"></span>

        <div className="animate-pulse">loading...</div>
      </div>
    </div>
  );
}
