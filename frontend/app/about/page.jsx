"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Briefcase, Users, Globe, Award, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const stats = [
    { value: "10,000+", label: "Happy Customers", icon: <Users className="w-8 h-8" /> },
    { value: "500+", label: "Premium Products", icon: <ShoppingBag className="w-8 h-8" /> },
    { value: "50+", label: "Global Brands", icon: <Globe className="w-8 h-8" /> },
    { value: "5+", label: "Industry Awards", icon: <Award className="w-8 h-8" /> },
  ];

  const team = [
    {
      name: "IRHIL OUSSAMA",
      role: "SOFTWARE DEVELOPER, Founder & CEO",
      image: "/images/oussama.jpg",
      bio: "Computer science student with a passion for technology, development, and problem-solving. I enjoy creating digital solutions and exploring new innovations in the tech world."
    },
    {
      name: "Moad Fayd",
      role: "MARKETING MANAGER, Founder & CEO",
      image: "/images/moad.jpg",
      bio: "Marketing student who loves creativity, communication, and understanding consumer behavior. They are interested in branding, advertising, and digital media strategies."
    },
  ];

  return (
    <div className="bg-background dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-[60vh] max-h-[800px]">
        <Image
          src="/images/about.jpg"
          alt="Our Team Working Together"
          fill
          className="object-cover dark:brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="container mx-auto px-6 relative h-full flex flex-col justify-end pb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold text-white max-w-2xl mb-4"
          >
            Our Story of Excellence
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/90 max-w-2xl"
          >
            Redefining e-commerce through innovation, quality, and customer-first philosophy.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-6 text-foreground dark:text-white"
          >
            Our Mission
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground dark:text-gray-300 mb-12"
          >
            To deliver exceptional products with seamless shopping experiences that inspire and empower our customers.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-card dark:bg-gray-800 p-8 rounded-xl shadow-md border dark:border-gray-700"
            >
              <Briefcase className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3 text-foreground dark:text-white">Our Vision</h3>
              <p className="text-muted-foreground dark:text-gray-300">
                To become the most trusted destination for premium products worldwide, setting new standards in e-commerce excellence.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-card dark:bg-gray-800 p-8 rounded-xl shadow-md border dark:border-gray-700"
            >
              <Users className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3 text-foreground dark:text-white">Our Values</h3>
              <p className="text-muted-foreground dark:text-gray-300">
                Integrity, innovation, and customer obsession drive every decision we make and every product we curate.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-16 text-center text-foreground dark:text-white"
          >
            By The Numbers
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-sm border dark:border-gray-600"
              >
                <div className="text-primary dark:text-primary-400 mx-auto mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold mb-2 text-foreground dark:text-white">{stat.value}</h3>
                <p className="text-muted-foreground dark:text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-white">Meet Our Leadership</h2>
          <p className="text-xl text-muted-foreground dark:text-gray-300">
            The passionate team driving our vision forward
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border dark:border-gray-700"
            >
              <div className="relative h-80">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
              <div className="p-6 bg-white dark:bg-gray-800">
                <h3 className="text-xl font-bold text-foreground dark:text-white">{member.name}</h3>
                <p className="text-primary dark:text-primary-400 mb-2">{member.role}</p>
                <p className="text-muted-foreground dark:text-gray-300">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary dark:from-primary-600 dark:to-secondary-600">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6 text-white"
          >
            Ready to Experience the Difference?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl mb-8 text-white/90 max-w-2xl mx-auto"
          >
            Join thousands of satisfied customers who trust us for quality products and exceptional service.
          </motion.p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/products" passHref>
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8">
                Shop Our Collection
              </Button>
            </Link>
            <Link href="/contact" passHref>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8">
                Contact Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}