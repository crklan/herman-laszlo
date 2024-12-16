export function Footer() {
  return (
    <footer className="border-t border-gray-100 transition-colors ease-in-out dark:border-gray-900 flex-shrink-0">
      <div className="container mx-auto flex items-center justify-between p-4 lg:px-12">
        <div className="flex gap-4">
          <a
            className="text-sky-600 text-sm®"
            href="mailto:info@laszloherman.com"
          >
            info@laszloherman.com
          </a>
          {/* <Link to="https://www.instagram.com">
            <img
              height="24"
              width="24"
              src="https://unpkg.com/simple-icons@v13/icons/instagram.svg"
              alt="Instagram profile icon"
            />
          </Link> */}
        </div>
        <div className="flex max-w-sm text-right flex-1 flex-col items-end justify-end gap-2 text-sm lg:flex-row lg:items-center lg:gap-5">
          <div>© 2024 László Herman</div>
        </div>
      </div>
    </footer>
  )
}
