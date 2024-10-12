export default function Header() {
    return (
      <div className="flex justify-between items-center bg-red-500 text-white p-5">
        <h1 className="text-4xl">Stock Views</h1>
        <div className="flex space-x-4">
          <button className="bg-white text-black px-2 py-1">Personal Information</button>
          <button className="bg-white text-black px-2 py-1">Settings</button>
        </div>
      </div>
    );
  }