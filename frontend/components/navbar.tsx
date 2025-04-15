"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api_endpoints";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Categorie {
  id: number;
  title: string;
  categorie_id: string;
  description: string;
}

export function Navbar() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(API_ENDPOINTS.CATEGORIES.BASE);
      const data: Categorie[] = response.data;
      setCategories(data);
    };
    fetchData();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: user ? "Account" : "Login", href: "/account" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "sticky top-0 z-50 flex items-center justify-between p-4 border-b backdrop-blur-sm transition-all duration-300",
        isScrolled ? "bg-background/90 shadow-sm" : "bg-background"
      )}
    >
      {/* Logo with hover effect */}
      <motion.div whileHover={{ scale: 1.05 }}>
        <Link href="/" className="font-bold text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Dyano
        </Link>
      </motion.div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        {navItems.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href={item.href}
              className="relative text-sm font-medium transition-colors hover:text-primary group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </motion.div>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                className="text-sm font-medium group relative"
              >
                Categories
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            asChild
            className="mt-2 min-w-[200px] rounded-lg shadow-lg border bg-background/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {categories.map((e, i) => (
                <DropdownMenuItem key={i} asChild>
                  <motion.div whileHover={{ x: 5 }}>
                    <Link
                      href={`/products/category/${e.title}`}
                      className="w-full px-4 py-2 text-sm hover:text-primary transition-colors"
                    >
                      {e.title}
                    </Link>
                  </motion.div>
                </DropdownMenuItem>
              ))}
            </motion.div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[85vw] max-w-sm border-r bg-background/95 backdrop-blur-sm"
            onInteractOutside={() => setMobileOpen(false)}
          >
            <div className="flex flex-col h-full">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="pt-6 pb-8 px-4"
              >
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
                >
                  Dyano
                </Link>
              </motion.div>

              <div className="flex-1 flex flex-col gap-1 px-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center px-4 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-accent/50"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  className="px-2 mt-2"
                >
                  <h3 className="px-4 py-2 text-sm font-semibold text-muted-foreground">
                    Categories
                  </h3>
                  <div className="flex flex-col gap-1 mt-1">
                    {categories.map((e, i) => (
                      <Link
                        key={i}
                        href={`/products/category/${e.title}`}
                        onClick={() => setMobileOpen(false)}
                        className="px-4 py-3 rounded-lg text-base transition-colors hover:bg-accent/50"
                      >
                        {e.title}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navItems.length + 1) * 0.1 }}
                className="p-4 border-t"
              >
                <p className="text-xs text-muted-foreground">
                  © {new Date().getFullYear()} Dyano. All rights reserved.
                </p>
              </motion.div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  );
}