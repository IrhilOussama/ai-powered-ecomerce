"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api_endpoints";

interface Categorie {
    id: number, 
    title: string, 
    categorie_id: string, 
    description: string
}

export function Navbar() {
    const [categories, setCategories] = useState<Categorie[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(API_ENDPOINTS.CATEGORIES.BASE);
            const data: Categorie[] = response.data;
            setCategories(data);
        }
        fetchData();
    }, [])
  return (
    <nav className="flex items-center justify-between p-4 bg-background border-b">
      {/* Logo */}
      <Link href="/" className="font-bold text-lg">
        Dyano
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-4">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">Categories</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {
                categories.map((e, i) => (
                    <DropdownMenuItem key={i}>
                        <Link href={`/products/category/${e.title}`}>{e.title}</Link>
                    </DropdownMenuItem>
                ))
            }
          </DropdownMenuContent>
        </DropdownMenu>
        <Link href="/account" className="hover:text-primary">
          Account
        </Link>
        <Link href="/about" className="hover:text-primary">
          About
        </Link>
      </div>

      {/* Mobile Menu (Step 3) */}
        <Sheet>
        <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
            </Button>
        </SheetTrigger>
        <SheetContent side="left">
            <div className="flex flex-col gap-4 mt-6">
            <Link href="/" className="text-lg">
                Homes
            </Link>
            <Link href="/products" className="text-lg">
                Products
            </Link>
            <Link href="/about" className="text-lg">
                About
            </Link>
            </div>
        </SheetContent>
        </Sheet>
    </nav>
  );
}