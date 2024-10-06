import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Search, LogOut, Menu } from "lucide-react";
import { useAuthStore } from "../store/authUser";
import { useContentStore } from "../store/content";
import Popup from "reactjs-popup";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const { user, logout } = useAuthStore();
  const { setContentType } = useContentStore();

  return (
    <header className="max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4 h-20">
      <div className="flex items-center gap-10 z-50">
        <Link to="/">
          <img src="/netflix-logo.png" alt="logo" className="w-32 sm:w-40" />
        </Link>

        {/* desktop navbar */}
        <div className="hidden sm:flex gap-2 items-center">
          <Link
            to="/"
            className="hover:underline"
            onClick={() => setContentType("movie")}
          >
            Movies
          </Link>
          <Link
            to="/"
            className="hover:underline"
            onClick={() => setContentType("tv")}
          >
            Tv Shows
          </Link>
          <Link to="/history" className="hover:underline">
            Search History
          </Link>
        </div>
      </div>

      <div className="flex gap-2 items-center z-50">
        <Link to={"/search"}>
          <Search className="size-6 cursor-pointer" />
        </Link>
        <Popup
          trigger={
            <button>
              <img
                src={user.image}
                alt="Avatar"
                className="h-8 rounded cursor-pointer"
              />
            </button>
          }
          position="bottom center"
          arrow={false}
          closeOnDocumentClick
          contentStyle={{
            marginTop: "0.3rem",
            maxwidth: "20rem",
            borderRadius: "0.5rem",
            padding: "1rem",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            color: "white",
          }}
        >
          <div className="text-sm">
            <p className="mb-2">
              <span className="font-bold">USERNAME :</span>
              <br /> {user.username}
            </p>
            <p>
              <span className="font-bold">EMAIL :</span>
              <br />
              {user.email}
            </p>
          </div>
        </Popup>
        <LogOut className="size-6 cursor-pointer" onClick={logout} />
        <div className="sm:hidden">
          <Menu className="size-6 cursor-pointer" onClick={toggleMobileMenu} />
        </div>
      </div>

      {/* mobile navbar */}

      {isMobileMenuOpen && (
        <div className="w-full sm:hidden mt-4 z-50 bg-black border rounded border-gray-800">
          <Link
            to="/"
            className="block hover:underline p-2"
            onClick={() => {
              setContentType("movie");
              toggleMobileMenu();
            }}
          >
            Movies
          </Link>
          <Link
            to="/"
            className="block hover:underline p-2"
            onClick={() => {
              setContentType("tv");
              toggleMobileMenu();
            }}
          >
            Tv Shows
          </Link>
          <Link
            to="/history"
            className="block hover:underline p-2"
            onClick={toggleMobileMenu}
          >
            Search History
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;