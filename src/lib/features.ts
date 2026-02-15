import {
    FileText, FilePlus, Shield, LayoutDashboard, Edit, Bot, Share2, Palette,
    CheckCircle, Zap, Globe, Lock, Smartphone, PieChart, Mail, CreditCard, Users,
    FileCheck, History, Download, Printer, Settings, BarChart3, Search, Clock
} from 'lucide-react';

export const TOOLS = [
    {
        href: '/create-invoice',
        label: 'Invoice',
        icon: FileText,
        description: 'Create professional invoices in seconds.'
    },
    {
        href: '/create-estimate',
        label: 'Estimate',
        icon: FilePlus,
        description: 'Send detailed estimates and win more jobs.'
    },
    {
        href: '/create-quote',
        label: 'Quote',
        icon: FileText,
        description: 'Provide instant pricing quotes to clients.'
    },
    {
        href: '/create-insurance',
        label: 'Insurance',
        icon: Shield,
        description: 'Generate insurance documents for your projects.'
    },
];

export const FEATURES = [
    {
        title: 'Smart Invoicing',
        description: 'Automated calculations, tax presets, and professional layouts that get you paid faster.',
        icon: Zap,
        highlight: true,
        category: 'Core'
    },
    {
        title: 'Live Preview',
        description: 'What you see is what you get. Edit your document and see the changes instantly.',
        icon: Edit,
        highlight: false,
        category: 'Editor'
    },
    {
        title: 'Client Portal',
        description: 'Give clients a dedicated, secure link to view, download, and pay their invoices online.',
        icon: Globe,
        highlight: true,
        category: 'Client Experience'
    },
    {
        title: 'Branding Suite',
        description: 'Upload your logo, choose brand colors, and remove watermarks for a fully white-labeled experience.',
        icon: Palette,
        highlight: false,
        category: 'Customization'
    },
    {
        title: 'Cloud Dashboard',
        description: 'Access your financial data from anywhere. Secure Firestore storage keeps your records safe.',
        icon: LayoutDashboard,
        highlight: false,
        category: 'Management'
    },
    {
        title: 'Stripe Payments',
        description: 'Accept credit card payments directly on your invoices with our seamless Stripe integration.',
        icon: CreditCard,
        highlight: true,
        category: 'Payments'
    },
    {
        title: 'AI Assistant',
        description: 'Leverage Genkit AI to auto-generate email summaries and optimize your workflow.',
        icon: Bot,
        highlight: false,
        category: 'Advanced'
    },
    {
        title: 'Mobile Optimized',
        description: 'Manage your business on the go with our fully responsive mobile-first design.',
        icon: Smartphone,
        highlight: false,
        category: 'Core'
    },
    {
        title: 'Audit Logs',
        description: 'Track every view, edit, and download with a detailed history trail for full transparency.',
        icon: History,
        highlight: false,
        category: 'Security'
    },
    {
        title: 'Business Analytics',
        description: 'Visualize your income, outstanding invoices, and client value with interactive charts.',
        icon: BarChart3,
        highlight: true,
        category: 'Management'
    },
    {
        title: 'Template Gallery',
        description: 'Choose from over 20+ professionally designed templates tailored for specific industries.',
        icon: LayoutDashboard,
        highlight: false,
        category: 'Customization'
    },
    {
        title: 'PDF Generation',
        description: 'Instant, high-quality PDF downloads that look perfect on any device or printer.',
        icon: Download,
        highlight: false,
        category: 'Core'
    },
    {
        title: 'Client Management',
        description: 'Save client details for one-click invoicing. Track contact info and billing history.',
        icon: Users,
        highlight: false,
        category: 'Management'
    }
];

export const PRICING_PLANS = [
    {
        id: 'free',
        title: 'Starter',
        description: 'Perfect for freelancers just getting started.',
        price: { monthly: '$0', yearly: '$0' },
        features: [
            { text: '5 Invoices / Month', included: true },
            { text: '3 Estimates / Month', included: true },
            { text: 'Basic Templates', included: true },
            { text: 'PDF Export', included: true },
            { text: 'Cloud Save (Last 5 Docs)', included: true },
            { text: 'Custom Branding', included: false },
            { text: 'Remove Watermark', included: false },
            { text: 'Client Portal', included: false },
            { text: 'Online Payments', included: false },
        ],
        cta: 'Start for Free',
        variant: 'outline',
        popular: false
    },
    {
        id: 'business',
        title: 'Business Pro',
        description: 'For growing agencies and professionals.',
        price: { monthly: '$19.99', yearly: '$199.99' },
        features: [
            { text: 'Unlimited Invoices & Estimates', included: true },
            { text: 'Unlimited Quotes & Insurance Docs', included: true },
            { text: 'Access All 20+ Premium Templates', included: true },
            { text: 'Full Custom Branding & Logos', included: true },
            { text: 'No Watermarks', included: true },
            { text: 'Client Portal Access', included: true },
            { text: 'Accept Online Payments', included: true },
            { text: 'Priority Email Support', included: true },
            { text: 'Unlimited Cloud Storage', included: true },
        ],
        cta: 'Upgrade to Business',
        variant: 'default',
        popular: true
    }
];

export const COMPARISON_TABLE = [
    { feature: 'Documents / Month', free: '5 Limited', pro: 'Unlimited' },
    { feature: 'Templates', free: 'Basic Only', pro: 'All Premium (20+)' },
    { feature: 'Custom Branding', free: false, pro: true },
    { feature: 'Remove Watermark', free: false, pro: true },
    { feature: 'Client Portal', free: false, pro: true },
    { feature: 'Online Payments', free: false, pro: true },
    { feature: 'Cloud Storage', free: 'Last 5 Docs', pro: 'Unlimited History' },
    { feature: 'AI Assistant', free: 'Limited', pro: 'Full Access' },
    { feature: 'Search & Filtering', free: 'Basic', pro: 'Advanced' },
    { feature: 'Audit Logs', free: 'Basic', pro: 'Full History' },
    { feature: 'Analytics', free: false, pro: true },
    { feature: 'Priority Support', free: false, pro: true },
];
