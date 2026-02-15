import { BLOG_POSTS } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Share2, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Metadata } from 'next';

interface Props {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);
    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} | InvoiceCraft Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.image],
            type: 'article',
            publishedTime: post.date,
            authors: [post.author.name],
        },
    };
}

export default function BlogPostPage({ params }: Props) {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    // Find related posts (just picked random ones for now not equal to current)
    const relatedPosts = BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 2);

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Article Header */}
            <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/50 z-10"></div>
                <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />

                <div className="container relative z-20 h-full flex flex-col justify-center px-4 md:px-6">
                    <Link href="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors w-fit">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                    </Link>

                    <Badge className="w-fit mb-4 bg-primary text-primary-foreground border-none px-3 py-1 text-sm font-medium">
                        {post.category}
                    </Badge>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white font-headline max-w-4xl leading-tight mb-6">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-white/90">
                        <div className="flex items-center gap-3">
                            <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full border-2 border-white/20" />
                            <div>
                                <p className="font-semibold text-sm">{post.author.name}</p>
                                <p className="text-xs text-white/70">{post.author.role}</p>
                            </div>
                        </div>

                        <div className="h-8 w-px bg-white/20 hidden sm:block"></div>

                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span>{post.date}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>{post.readTime}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container px-4 md:px-6 mx-auto mt-[-4rem] relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
                    {/* Main Content */}
                    <article className="bg-card border border-border/50 rounded-2xl p-8 md:p-12 shadow-xl">
                        <div
                            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-headline prose-a:text-primary prose-img:rounded-xl"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Tags */}
                        <div className="mt-12 pt-8 border-t border-border/50">
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-muted-foreground">
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Social Search - Dummy implementation */}
                        <div className="mt-8 flex items-center gap-4">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Share Article</span>
                            <div className="flex gap-2">
                                <Button size="icon" variant="ghost" className="rounded-full hover:text-[#1877F2] hover:bg-[#1877F2]/10"><Facebook className="h-4 w-4" /></Button>
                                <Button size="icon" variant="ghost" className="rounded-full hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10"><Twitter className="h-4 w-4" /></Button>
                                <Button size="icon" variant="ghost" className="rounded-full hover:text-[#0A66C2] hover:bg-[#0A66C2]/10"><Linkedin className="h-4 w-4" /></Button>
                                <Button size="icon" variant="ghost" className="rounded-full hover:text-primary hover:bg-primary/10"><Share2 className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        {/* Related Posts */}
                        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm sticky top-24">
                            <h3 className="font-bold text-lg mb-4 font-headline">Related Articles</h3>
                            <div className="space-y-6">
                                {relatedPosts.map(related => (
                                    <Link key={related.id} href={`/blog/${related.slug}`} className="group block">
                                        <div className="aspect-video w-full rounded-lg overflow-hidden mb-3">
                                            <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <h4 className="font-semibold group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1">
                                            {related.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">{related.date}</p>
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-border/50">
                                <h3 className="font-bold text-lg mb-2 font-headline">Newsletter</h3>
                                <p className="text-sm text-muted-foreground mb-4">Get the latest invoicing tips delivered to your inbox.</p>
                                <div className="flex flex-col gap-2">
                                    <input type="email" placeholder="Your email address" className="bg-background border border-border rounded-md px-3 py-2 text-sm" />
                                    <Button className="w-full">Subscribe</Button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
