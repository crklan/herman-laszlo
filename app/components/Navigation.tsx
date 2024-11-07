import {NavLink} from '@remix-run/react'

export const Navigation = () => {
  return (
    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
      <NavLink
        to="/"
        className={({isActive}) =>
          `transition-colors ${isActive ? 'underline' : 'hover:underline'}`
        }
      >
        Home
      </NavLink>
      <NavLink
        to="work"
        className={({isActive}) =>
          `transition-colors ${isActive ? 'underline' : 'hover:underline'}`
        }
      >
        Work
      </NavLink>
      <NavLink
        to="about"
        className={({isActive}) =>
          `transition-colors ${isActive ? 'underline' : 'hover:underline'}`
        }
      >
        About
      </NavLink>
      <NavLink
        to="contact"
        className={({isActive}) =>
          `transition-colors ${isActive ? 'underline' : 'hover:underline'}`
        }
      >
        Contact
      </NavLink>
    </nav>
  )
}
