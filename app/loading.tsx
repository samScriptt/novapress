export default function Loading() {
  return (
    <div className="min-h-screen container mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-stone-800 w-32 mb-8 rounded"></div>
      <div className="h-16 bg-gray-200 dark:bg-stone-800 w-3/4 mb-6 rounded"></div>
      <div className="h-4 bg-gray-200 dark:bg-stone-800 w-48 mb-12 rounded"></div>
      <div className="h-96 bg-gray-200 dark:bg-stone-800 w-full mb-10 rounded-lg"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-stone-800 w-full rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-stone-800 w-full rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-stone-800 w-2/3 rounded"></div>
      </div>
    </div>
  );
}