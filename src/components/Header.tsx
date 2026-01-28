import { Bell, Search, Menu } from 'lucide-react'

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 left-0 md:left-64 z-10 transition-all">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Menu size={24} className="text-gray-600" />
        </button>

        <div className="hidden sm:flex items-center bg-gray-100 rounded-xl px-3 py-2 w-64 lg:w-96 shadow-inner">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search for anything..."
            className="bg-transparent border-none outline-none ml-2 text-sm w-full font-medium placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800 leading-tight">Admin User</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Super Admin</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-orange-200">
            A
          </div>
        </div>
      </div>
    </header>
  )
}
