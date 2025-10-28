export default function SearchBar({ onSearch }) {
  return (
    <div className="flex justify-center mt-4">
      <input
        type="text"
        placeholder="Search for movies..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full sm:w-2/3 md:w-1/2 px-4 py-3 rounded-full bg-gray-800 text-white placeholder-gray-500 
                   focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
      />
    </div>
  );
}
