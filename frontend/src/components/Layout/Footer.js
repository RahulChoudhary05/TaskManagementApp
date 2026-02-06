'use client';

export default function Footer() {
  return (
    <footer className="border-t border-purple-100 bg-white/95 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
            © 2026 Task Manager
          </div>
          <div className="text-sm text-gray-600 font-medium">
            Built with ❤️ using Next.js & Firebase
          </div>
        </div>
      </div>
    </footer>
  );
}
