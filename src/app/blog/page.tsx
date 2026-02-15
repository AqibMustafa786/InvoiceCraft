'use client';

import { BLOG_POSTS } from '@/lib/blog-data';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Search, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(BLOG_POSTS.map(post => post.category)));

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-primary/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="container relative z-10 px-4 mx-auto md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-headline mb-6">
              InvoiceCraft <span className="text-primary">Insights</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl leading-relaxed">
              Expert advice on freelancing, financial management, and growing your business.
            </p>
          </motion.div>

          <motion.div
            className="max-w-md mx-auto mt-10 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10 h-12 rounded-full bg-background border-border/50 shadow-sm focus:ring-2 focus:ring-primary/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-2 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="rounded-full"
            >
              All
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="rounded-full"
              >
                {cat}
              </Button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="container px-4 mx-auto md:px-6 -mt-10 relative z-20">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-background/80 backdrop-blur-md text-foreground hover:bg-background/90 border-none shadow-sm">
                        {post.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col flex-grow p-6">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-auto">
                      <div className="flex items-center gap-2">
                        <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full border border-border" />
                        <span className="text-xs font-medium">{post.author.name}</span>
                      </div>
                      <span className="text-primary text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                        Read <ArrowRight className="ml-1 h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold mb-2">No articles found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
          </div>
        )}
      </section>
    </div>
  );
}
