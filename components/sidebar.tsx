export default function Sidebar() {
    return (
      <div className="w-32
       bg-black-500 text-white h-screen">
        <ul className="space-y-5 p-">
          <li><button  className="w-40 flex-1 btn bg-red-600 text-white">Products</button></li>
          <li><button  className="w-40 flex-1 btn bg-red-600 text-white">Stock Views</button></li>
          <li><button  className="w-40 flex-1 btn bg-red-600 text-white">Purchase Orders</button></li>
          <li><button  className="w-40 flex-1 btn bg-red-600 text-white">Transcript</button></li>
        </ul>
        <button className="absolute bottom-4 left-4 text-left">Log out</button>
      </div>
    );
  }