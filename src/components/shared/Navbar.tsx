// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Menu, X } from "lucide-react";
// import { useState, useEffect } from "react";

// const navItems = [
//   { name: "Home", href: "/" },
//   { name: "Pricing", href: "/pricing" },
//   { name: "About", href: "/about" },
//   { name: "How It Works", href: "/how-it-works" },
// ];

// export default function Navbar() {
//   const pathname = usePathname();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       // Switch style after 20px of scroll
//       if (window.scrollY > 20) {
//         setIsScrolled(true);
//       } else {
//         setIsScrolled(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     // Initial check
//     handleScroll();

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const isActive = (href: string) => {
//     if (href === "/") return pathname === "/";
//     return pathname.startsWith(href);
//   };

//   return (
//     <header
//       className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-in-out ${
//         isScrolled
//           ? "bg-secondary backdrop-blur-lg border-b border-gray-200/50 shadow-sm py-0"
//           : "bg-transparent shadow-none py-2 border-b border-gray-200/70"
//       }`}
//     >
//       <div className="container mx-auto flex h-[80px] md:h-[100px] items-center justify-between px-4 md:px-6">
//         {/* Logo */}
//         <Link href="/" className="shrink-0">
//           <Image
//             src="/images/logo.png"
//             alt="Second Sight Logo"
//             width={110}
//             height={60}
//             className="h-auto w-[78px] sm:w-[90px] md:w-[110px]"
//             priority
//           />
//         </Link>

//         {/* Desktop Nav */}
//         <nav className="hidden md:flex items-center gap-8 lg:gap-12">
//           {navItems.map((item) => {
//             const active = isActive(item.href);

//             return (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 className={`relative text-[15px] lg:text-[16px] font-medium transition ${
//                   active
//                     ? "text-[#111827]"
//                     : "text-[#334155] hover:text-[#111827]"
//                 }`}
//               >
//                 {item.name}
//                 <span
//                   className={`absolute left-1/2 -bottom-[6px] h-[2px] -translate-x-1/2 bg-[#1f2937] transition-all duration-300 ${
//                     active ? "w-[56px]" : "w-0"
//                   }`}
//                 />
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Right Side */}
//         <div className="flex items-center gap-3 md:gap-8">
//           {/* <Link
//             href="/login"
//             className="hidden sm:inline-flex text-[15px] font-semibold text-[#111827] hover:opacity-80 transition"
//           >
//             Login
//           </Link> */}

//           <Link
//             href="/dashboard/new-scenario"
//             className="hidden sm:inline-flex rounded-lg bg-[#0f172a] px-5 py-2.5 text-[14px] md:px-6 md:py-3.5 md:text-[15px] font-semibold text-white transition hover:opacity-90 shadow-lg shadow-gray-200"
//           >
//             Start Scenario Analysis
//           </Link>

//           {/* Mobile menu button */}
//           <button
//             type="button"
//             onClick={() => setIsOpen(!isOpen)}
//             className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-[#111827]"
//             aria-label="Toggle menu"
//           >
//             {isOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <div
//         className={`overflow-hidden border-t border-[#d9e3ea] bg-white transition-all duration-300 md:hidden ${
//           isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
//         }`}
//       >
//         <div className="container mx-auto flex flex-col px-4 py-4">
//           {navItems.map((item) => {
//             const active = isActive(item.href);

//             return (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 onClick={() => setIsOpen(false)}
//                 className={`rounded-md px-3 py-3 text-[15px] font-medium transition ${
//                   active
//                     ? "bg-[#eef7fc] text-[#111827]"
//                     : "text-[#334155] hover:bg-[#f8fbfd] hover:text-[#111827]"
//                 }`}
//               >
//                 {item.name}
//               </Link>
//             );
//           })}

//           <Link
//             href="/dashboard/new-scenario"
//             onClick={() => setIsOpen(false)}
//             className="mt-4 inline-flex justify-center rounded-lg bg-[#0f172a] px-4 py-3 text-[14px] font-semibold text-white transition hover:opacity-90 sm:hidden"
//           >
//             Start Scenario Analysis
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// }

/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: new (
          options: Record<string, unknown>,
          element: string,
        ) => void;
      };
    };
  }
}

const SOURCE_LANGUAGE = "en";
const LANGUAGE_STORAGE_KEY = "secondsight-language";

const languages = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "ar", label: "Arabic", dir: "rtl" },
] as const;

type LanguageCode = (typeof languages)[number]["code"];

const navItems = [
  { name: "Home", href: "/" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "How It Works", href: "/how-it-works" },
];

function getSavedLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";

  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

  return languages.some((item) => item.code === savedLanguage)
    ? (savedLanguage as LanguageCode)
    : "en";
}

function setGoogleTranslateCookie(languageCode: LanguageCode) {
  const cookieValue = `/${SOURCE_LANGUAGE}/${languageCode}`;
  const expires = "max-age=31536000";

  document.cookie = `googtrans=${cookieValue}; path=/; ${expires}`;
  document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}; ${expires}`;
}

function resetGoogleTranslateToolbar() {
  document.body.style.top = "0px";

  const toolbarFrame = document.querySelector<HTMLIFrameElement>(
    "iframe.goog-te-banner-frame, iframe.skiptranslate",
  );

  if (toolbarFrame) {
    toolbarFrame.style.display = "none";
  }
}

function applyGoogleTranslate(languageCode: LanguageCode, retries = 12) {
  setGoogleTranslateCookie(languageCode);

  resetGoogleTranslateToolbar();

  const translateSelect =
    document.querySelector<HTMLSelectElement>(".goog-te-combo");

  if (!translateSelect) {
    if (retries > 0) {
      window.setTimeout(
        () => applyGoogleTranslate(languageCode, retries - 1),
        250,
      );
    }

    return;
  }

  translateSelect.value = languageCode;

  translateSelect.dispatchEvent(new Event("change"));

  window.setTimeout(resetGoogleTranslateToolbar, 250);
}

export default function Navbar() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("en");

  // Initialize language
  useEffect(() => {
    const savedLanguage = getSavedLanguage();

    setLanguage(savedLanguage);

    // Initial RTL/LTR setup
    if (savedLanguage === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    }
  }, []);

  // Google Translate initialization
  useEffect(() => {
    const initialLanguage = getSavedLanguage();

    setGoogleTranslateCookie(initialLanguage);

    // Initial direction setup
    if (initialLanguage === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    }

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) {
        return;
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: SOURCE_LANGUAGE,
          includedLanguages: languages.map((item) => item.code).join(","),
          autoDisplay: false,
        },
        "google_translate_element",
      );

      window.setTimeout(() => {
        applyGoogleTranslate(getSavedLanguage());
      }, 100);
    };

    if (!document.querySelector("#google-translate-script")) {
      const script = document.createElement("script");

      script.id = "google-translate-script";

      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

      script.async = true;

      document.body.appendChild(script);

      return;
    }

    if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();

      return;
    }

    window.setTimeout(() => {
      applyGoogleTranslate(initialLanguage);
    }, 100);
  }, []);

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLanguage = e.target.value as LanguageCode;

    setLanguage(nextLanguage);

    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);

    setGoogleTranslateCookie(nextLanguage);

    // RTL/LTR support
    if (nextLanguage === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    }

    window.location.reload();
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";

    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-secondary backdrop-blur-lg border-b border-gray-200/50 shadow-sm py-0"
          : "bg-transparent shadow-none py-2 border-b border-gray-200/70"
      }`}
    >
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" className="hidden" />

      <div className="container mx-auto flex h-[80px] md:h-[100px] items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo.png"
            alt="Second Sight Logo"
            width={110}
            height={60}
            className="h-auto w-[78px] sm:w-[90px] md:w-[110px]"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative text-[15px] lg:text-[16px] font-medium transition ${
                  active
                    ? "text-[#111827]"
                    : "text-[#334155] hover:text-[#111827]"
                }`}
              >
                {item.name}

                <span
                  className={`absolute left-1/2 -bottom-[6px] h-[2px] -translate-x-1/2 bg-[#1f2937] transition-all duration-300 ${
                    active ? "w-[56px]" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3 md:gap-8">
          {/* Language Switcher */}
          <div className="hidden md:flex items-center">
            <Select
              value={language}
              onValueChange={(value) =>
                handleLanguageChange({
                  target: { value },
                } as React.ChangeEvent<HTMLSelectElement>)
              }
            >
              <SelectTrigger className="notranslate h-[46px] min-w-[160px] rounded-xl border border-gray-200 bg-white/90 px-4 text-[#111827] shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-white focus:ring-0 focus:ring-offset-0">
                <div className="flex items-center gap-2">
                  <Globe size={18} className="text-gray-500" />
                  <SelectValue placeholder="Select Language" />
                </div>
              </SelectTrigger>

              <SelectContent className="rounded-xl border border-gray-200 bg-white shadow-xl">
                {languages.map((item) => (
                  <SelectItem
                    key={item.code}
                    value={item.code}
                    className="cursor-pointer rounded-md text-sm"
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* CTA Button */}
          <Link
            href="/dashboard/new-scenario"
            className="hidden sm:inline-flex rounded-lg bg-[#0f172a] px-5 py-2.5 text-[14px] md:px-6 md:py-3.5 md:text-[15px] font-semibold text-white transition hover:opacity-90 shadow-lg shadow-gray-200"
          >
            Start Scenario Analysis
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-[#111827]"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden border-t border-[#d9e3ea] bg-white transition-all duration-300 md:hidden ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container mx-auto flex flex-col px-4 py-4">
          {/* Mobile Language Switcher */}
          <div className="notranslate mb-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-3">
            <Globe size={18} />

            <select
              value={language}
              onChange={handleLanguageChange}
              className="w-full bg-transparent text-sm outline-none"
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Nav */}
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-md px-3 py-3 text-[15px] font-medium transition ${
                  active
                    ? "bg-[#eef7fc] text-[#111827]"
                    : "text-[#334155] hover:bg-[#f8fbfd] hover:text-[#111827]"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          {/* Mobile CTA */}
          <Link
            href="/dashboard/new-scenario"
            onClick={() => setIsOpen(false)}
            className="mt-4 inline-flex justify-center rounded-lg bg-[#0f172a] px-4 py-3 text-[14px] font-semibold text-white transition hover:opacity-90 sm:hidden"
          >
            Start Scenario Analysis
          </Link>
        </div>
      </div>
    </header>
  );
}
