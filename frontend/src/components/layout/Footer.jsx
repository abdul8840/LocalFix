export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h3 className="text-white font-bold text-lg">LocalFix</h3>
          <p className="text-sm text-gray-400 mt-1">
            Trusted local services for small towns and villages.
          </p>
        </div>
        <p className="text-sm text-gray-400 self-end">
          © {new Date().getFullYear()} LocalFix. All rights reserved.
        </p>
      </div>
    </footer>
  );
}