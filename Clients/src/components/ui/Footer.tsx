import {  Facebook, Instagram, Mail, Sparkles, Twitter } from "lucide-react";
import { Link } from "react-router-dom";


export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">GlowGuide</span>
            </div>
            <p className="mt-4 text-sm text-foreground/70">
              Your personal guide to achieving healthy, glowing skin. We provide
              personalized routines, expert advice, and progress tracking.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="text-foreground/70 transition-colors hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="#"
                className="text-foreground/70 transition-colors hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                className="text-foreground/70 transition-colors hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Learn</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/skincare-101"
                  className="text-sm text-foreground/70 transition-colors hover:text-primary"
                >
                  Skincare 101
                </Link>
              </li>
              <li>
                <Link
                  to="/ingredients-guide"
                  className="text-sm text-foreground/70 transition-colors hover:text-primary"
                >
                  Ingredients Guide
                </Link>
              </li>
              <li>
                <Link
                  to="/product-recommendations"
                  className="text-sm text-foreground/70 transition-colors hover:text-primary"
                >
                  Product Recommendations
                </Link>
              </li>
              <li>
                <Link
                  to="/sustainability"
                  className="text-sm text-foreground/70 transition-colors hover:text-primary"
                >
                  Sustainable Beauty
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/about-us"
                  className="text-sm text-foreground/70 transition-colors hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/for-dermatologists"
                  className="text-sm text-foreground/70 transition-colors hover:text-primary"
                >
                  For Dermatologists
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-sm text-foreground/70 transition-colors hover:text-primary"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/press"
                  className="text-sm text-foreground/70 transition-colors hover:text-primary"
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-foreground/70 transition-colors hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-foreground/70 transition-colors hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="text-sm text-foreground/70 transition-colors hover:text-primary"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center pt-8 mt-8 border-t border-border md:flex-row md:justify-between md:items-center">
          <p className="text-xs text-foreground/70">
            &copy; {new Date().getFullYear()} GlowGuide. All rights reserved.
          </p>
          <div className="flex items-center mt-4 md:mt-0">
            <a
              href="mailto:contact@glowguide.com"
              className="flex items-center text-xs text-foreground/70 transition-colors hover:text-primary"
            >
              <Mail className="mr-1 h-4 w-4" />
              contact@glowguide.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
