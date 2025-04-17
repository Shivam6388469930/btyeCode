"use client";
import { useEffect, useState } from "react";
import Image from "next/image"; // ✅ Import Next.js Image component
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Article", href: "/articles", current: false },
  { name: "About", href: "/about", current: false },
  { name: "Dashboard", href: "/dashboard", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [userImage, setUserImage] = useState("/avter.png");
  const [userName, setUserName] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const img = localStorage.getItem("Image");
    const name = localStorage.getItem("userName");
    setUserImage(img || "/avter.png");
    setUserName(name || "");

    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleSignOut = () => {
    if (!localStorage.getItem("token")) {
      alert("User is not logged in");
    } else {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    <Disclosure as="nav" className="bg-gray-800 dark:bg-gray-900 sticky top-0 z-10 shadow-lg">  
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile menu */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white">
                  {open ? <XMarkIcon className="size-6" /> : <Bars3Icon className="size-6" />}
                </DisclosureButton>
              </div>

              {/* Logo & Nav */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                {/* <Image
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                /> */}
                  <h3 className="text-2xl font-bold mb-2 text-white">
            <span className="text-emerald-300">Byte</span>Code
          </h3>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right section */}
              <div className="absolute inset-y-0 right-3 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  onClick={toggleTheme}
                  className="rounded-full p-2 mr-5 text-gray-400 hover:text-white"
                >
                  {theme === "light" ? <MoonIcon className="size-6" /> : <SunIcon className="size-6" />}
                </button>

                {/* Profile Dropdown */}
                <Menu as="div" className="relative ml-3">
                  <MenuButton className="flex rounded-full text-sm focus:ring-2 focus:ring-white">
                    <Image
                      src={userImage}
                      alt="User"
                      width={32}
                      height={32}
                      className="size-8 rounded-full object-cover"
                    />
                  </MenuButton>

                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black/5">
                    {!userName ? (
                      <>
                        <MenuItem>
                          {({ active }) => (
                            <a
                              href="/register"
                              className={classNames(
                                active && "bg-gray-100 dark:bg-gray-700",
                                "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                              )}
                            >
                              Sign Up
                            </a>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <a
                              href="/login"
                              className={classNames(
                                active && "bg-gray-100 dark:bg-gray-700",
                                "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                              )}
                            >
                              Sign In
                            </a>
                          )}
                        </MenuItem>
                      </>
                    ) : (
                      <>
                        <MenuItem>
                          {({ active }) => (
                            <a
                              href="/profile"
                              className={classNames(
                                active && "bg-gray-100 dark:bg-gray-700",
                                "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                              )}
                            >
                              Your Profile
                            </a>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={handleSignOut}
                              className={classNames(
                                active && "bg-gray-100 dark:bg-gray-700",
                                "w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                              )}
                            >
                              Sign Out
                            </button>
                          )}
                        </MenuItem>
                      </>
                    )}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          {/* Mobile Menu Panel */}
          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
