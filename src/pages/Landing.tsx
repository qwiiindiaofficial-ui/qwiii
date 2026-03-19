import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSettings } from '@/hooks/useAppSettings';
import WhatsAppButton from '@/components/WhatsAppButton';
import PlanRegistrationForm from '@/components/PlanRegistrationForm';
import {
  Target, Users, Phone, Mail, ArrowRight, Star,
  Zap, Building2, MessageSquare, Shield, Clock, Award,
  ChartLine as LineChart, Package, FileText,
  ChartBar as BarChart3, CircleCheck as CheckCircle,
  Menu, X, ArrowUpRight, TrendingUp,
} from 'lucide-react';

const R = '#9b1239';
const RD = '#7e0f2e';
const RDD = '#5c0b22';
const FOOT = '#180510';

const Landing = () => {
  const { settings } = useAppSettings();
  const [isAnnual, setIsAnnual] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    price: number;
    billingCycle: 'monthly' | 'annual';
  } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = ['home', 'features', 'pricing', 'about'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappLink = `https://wa.me/917303408500?text=Hi! I'd like to learn more about QWII.`;
  const qwiiLogoUrl = 'https://exkmbvfehmzehnsnfzww.supabase.co/storage/v1/object/public/logos/logo-1767650736764.png';

  const handlePlanSelection = (planName: string, price: number) => {
    setSelectedPlan({ name: planName, price, billingCycle: isAnnual ? 'annual' : 'monthly' });
    setRegistrationDialogOpen(true);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'about', label: 'About' },
  ];

  const features = [
    { icon: Target, title: 'Precision Targeting', desc: 'Filter by industry, city, and business type. Every outreach hits the right desk.' },
    { icon: Zap, title: 'Auto-Refreshing Pipeline', desc: 'Fresh, verified leads land in your dashboard every morning. Zero manual sourcing.' },
    { icon: Users, title: 'Enriched Contact Data', desc: 'Name, number, location, category — every lead arrives ready for immediate action.' },
    { icon: LineChart, title: 'Sales Forecasting', desc: 'Predict revenue with confidence. Spot trends early and plan ahead with clarity.' },
    { icon: MessageSquare, title: 'AI Business Assistant', desc: 'Ask anything — pricing strategy, market sizing, competitor gaps — and get answers instantly.' },
    { icon: BarChart3, title: 'Performance Intelligence', desc: 'Track conversion, team efficiency, and channel ROI from one unified view.' },
    { icon: Building2, title: 'Client Management', desc: 'Full visibility over clients, orders, and payments — no more scattered spreadsheets.' },
    { icon: Package, title: 'Inventory Intelligence', desc: 'Never overstock or run out. Smart alerts keep your supply chain lean and responsive.' },
    { icon: FileText, title: 'Digital Documents', desc: 'Issue signed agreements, quotations, and invoices in minutes — fully paperless.' },
  ];

  const testimonials = [
    {
      name: 'Rajesh Agarwal',
      role: 'Director, Hardware Distribution · Jaipur',
      quote: 'Our sales team used to spend half their day just finding who to call. Now the pipeline fills itself. Close rates are up 40% in three months.',
      rating: 5,
    },
    {
      name: 'Sunita Gupta',
      role: 'CEO, Textile Wholesale · Kanpur',
      quote: "The lead quality surprised us. Every contact is accurate. We expanded into 3 new cities in 2 months \u2014 something we\u2019d been planning for years.",
      rating: 5,
    },
    {
      name: 'Mahesh Bansal',
      role: 'Managing Director · Ahmedabad',
      quote: '200 new accounts in our first month. ROI was immediate — the platform paid for itself well before our first invoice.',
      rating: 5,
    },
  ];

  const plans = [
    {
      name: 'Basic',
      desc: 'For small businesses that need clarity on their numbers.',
      monthly: 2999,
      annual: 29999,
      features: ['Monthly performance report', 'Key business metrics', 'Actionable recommendations', 'WhatsApp & email delivery', 'Email support'],
      cta: 'Get Started',
      highlight: false,
    },
    {
      name: 'Growth',
      desc: 'For teams ready to scale their sales pipeline fast.',
      monthly: 6999,
      annual: 69999,
      features: ['Everything in Basic', 'Up to 500 leads per day', 'City & industry targeting', 'Sales trend analysis', 'Custom dashboard', 'Monthly strategy call'],
      cta: 'Start Growing',
      highlight: true,
    },
    {
      name: 'Pro',
      desc: 'For established businesses that want the full picture.',
      monthly: 14999,
      annual: 149999,
      features: ['Everything in Growth', 'Up to 1,000 leads per day', 'AI decision support', 'Dedicated business analyst', 'Weekly reports', 'Multi-user access', 'Priority support'],
      cta: 'Go Pro',
      highlight: false,
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: '#fafafa', color: '#1a1a1a', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <img src={qwiiLogoUrl} alt="QWII" style={{ height: 28 }} />
            <span style={{ fontSize: 17, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.4px' }}>{settings.app_name}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 36 }} className="nav-desktop">
            {navItems.map(item => (
              <button key={item.id} onClick={() => scrollToSection(item.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 500,
                color: activeSection === item.id ? R : 'rgba(0,0,0,0.4)',
                transition: 'color 0.2s', padding: 0, letterSpacing: '-0.1px',
              }}>
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link to="/auth" style={{
              padding: '7px 18px', borderRadius: 8,
              border: '1px solid rgba(0,0,0,0.12)',
              color: 'rgba(0,0,0,0.6)', fontSize: 13, fontWeight: 500, textDecoration: 'none',
              background: 'transparent',
            }}>
              Sign in
            </Link>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{
              padding: '7px 18px', borderRadius: 8,
              background: R, color: '#fff',
              fontSize: 13, fontWeight: 600, textDecoration: 'none',
            }}>
              Book Demo
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="nav-mobile-btn"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a', padding: 4, display: 'none' }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div style={{ background: '#fff', borderTop: '1px solid rgba(0,0,0,0.06)', padding: '12px 28px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => scrollToSection(item.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 500,
                color: '#1a1a1a', padding: '10px 0', textAlign: 'left',
              }}>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        paddingTop: 60, position: 'relative', overflow: 'hidden',
        background: '#fff',
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '55%', height: '100%',
          background: 'linear-gradient(135deg, #fdf2f5 0%, #fce7ed 100%)',
          clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)',
        }} />
        <div style={{
          position: 'absolute', top: '15%', right: '4%', width: 480,
          background: '#fff', borderRadius: 20,
          border: '1px solid rgba(155,18,57,0.1)',
          boxShadow: '0 24px 80px rgba(155,18,57,0.08)',
          overflow: 'hidden',
        }} className="hero-card">
          <div style={{ padding: '20px 22px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1a1a1a' }}>Today's Pipeline</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 100, padding: '3px 10px' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              Live
            </span>
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { name: 'Sharma Trading Co.', city: 'Jaipur · Hardware', score: 94, fresh: true },
              { name: 'Mehta Steel Works', city: 'Rajkot · Steel', score: 89, fresh: true },
              { name: 'Gupta Fabrics Ltd.', city: 'Surat · Textiles', score: 86, fresh: false },
              { name: 'Agarwal Distributors', city: 'Kanpur · FMCG', score: 82, fresh: false },
              { name: 'Singh Chemicals', city: 'Ludhiana · Pharma', score: 79, fresh: false },
            ].map((lead, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 12px', borderRadius: 10,
                background: lead.fresh ? '#fdf4f7' : 'transparent',
                border: `1px solid ${lead.fresh ? 'rgba(155,18,57,0.1)' : 'transparent'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: lead.fresh ? R : '#f0f0f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: lead.fresh ? '#fff' : '#666',
                  }}>{lead.name[0]}</div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1a1a1a' }}>{lead.name}</div>
                    <div style={{ fontSize: 11, color: '#999', marginTop: 1 }}>{lead.city}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  {lead.fresh && <span style={{ fontSize: 9.5, fontWeight: 700, background: R, color: '#fff', borderRadius: 4, padding: '2px 6px', letterSpacing: 0.4 }}>NEW</span>}
                  <span style={{ fontSize: 13, fontWeight: 700, color: lead.fresh ? R : '#bbb' }}>{lead.score}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{
            margin: '0 16px 16px', padding: '14px 16px',
            background: `linear-gradient(135deg, ${R} 0%, ${RDD} 100%)`, borderRadius: 12,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.6 }}>Generated today</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>847 leads</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.6 }}>Total cost</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>₹423</div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 28px', width: '100%', position: 'relative' }}>
          <div style={{ maxWidth: 540 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: '#fdf2f5', border: '1px solid rgba(155,18,57,0.15)',
              borderRadius: 100, padding: '5px 14px', marginBottom: 32,
            }}>
              <TrendingUp size={12} color={R} />
              <span style={{ fontSize: 12, fontWeight: 600, color: R, letterSpacing: 0.1 }}>B2B Lead Intelligence · India</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(42px, 5.5vw, 72px)', fontWeight: 900, lineHeight: 1.03,
              letterSpacing: '-3.5px', color: '#1a1a1a', marginBottom: 24,
            }}>
              Your sales team deserves a
              <br />
              <span style={{ position: 'relative', display: 'inline-block' }}>
                better pipeline.
                <svg style={{ position: 'absolute', bottom: -6, left: 0, width: '100%' }} viewBox="0 0 300 12" fill="none">
                  <path d="M2 8 Q75 2 150 8 Q225 14 298 6" stroke={R} strokeWidth="3" strokeLinecap="round" fill="none" />
                </svg>
              </span>
            </h1>

            <p style={{ fontSize: 17, color: 'rgba(0,0,0,0.5)', lineHeight: 1.75, marginBottom: 40, maxWidth: 460 }}>
              QWII delivers hundreds of verified, high-intent business prospects to your dashboard every day — automatically, intelligently, at scale.
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 64 }}>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: R, color: '#fff',
                padding: '13px 26px', borderRadius: 10, fontSize: 14.5, fontWeight: 700,
                textDecoration: 'none',
              }}>
                Get a Free Demo
                <ArrowRight size={15} />
              </a>
              <button onClick={() => scrollToSection('pricing')} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'transparent', color: 'rgba(0,0,0,0.5)',
                padding: '13px 26px', borderRadius: 10, fontSize: 14.5, fontWeight: 500,
                cursor: 'pointer', border: '1px solid rgba(0,0,0,0.12)', transition: 'border-color 0.2s',
              }}>
                See Pricing
              </button>
            </div>

            <div style={{ display: 'flex', gap: 36 }}>
              {[
                { val: '1,000+', label: 'Leads / day' },
                { val: '500+', label: 'Businesses' },
                { val: '95%', label: 'Accuracy' },
                { val: '₹0.50', label: 'Per lead' },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: R, letterSpacing: '-0.8px' }}>{s.val}</div>
                  <div style={{ fontSize: 11.5, color: 'rgba(0,0,0,0.35)', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <div style={{
        background: `linear-gradient(90deg, ${RDD} 0%, ${R} 50%, ${RDD} 100%)`,
        padding: '18px 0', overflow: 'hidden',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          display: 'flex', gap: 56, alignItems: 'center', whiteSpace: 'nowrap',
          animation: 'marquee 28s linear infinite',
          fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.55)',
          letterSpacing: 1.2, textTransform: 'uppercase',
        }}>
          {['Lead Generation', 'Sales Intelligence', 'B2B Prospecting', 'Market Expansion', 'Revenue Growth', 'Demand Prediction', 'Client Management', 'Digital Agreements', 'Inventory Control', 'AI-Powered Insights',
            'Lead Generation', 'Sales Intelligence', 'B2B Prospecting', 'Market Expansion', 'Revenue Growth', 'Demand Prediction', 'Client Management', 'Digital Agreements', 'Inventory Control', 'AI-Powered Insights',
          ].map((t, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 56 }}>
              {t}
              <span style={{ display: 'inline-block', width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.35)' }} />
            </span>
          ))}
        </div>
      </div>

      {/* LEAD SPOTLIGHT */}
      <section style={{ background: '#fff', padding: '120px 28px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 100, alignItems: 'center' }} className="split-grid">

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: R, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24 }}>
                Lead Generation
              </div>
              <h2 style={{ fontSize: 'clamp(30px, 3.5vw, 50px)', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.1, letterSpacing: '-2px', marginBottom: 28 }}>
                Stop sourcing leads.
                <br />
                <em style={{ fontStyle: 'italic', color: 'rgba(0,0,0,0.25)' }}>Start closing them.</em>
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(0,0,0,0.45)', lineHeight: 1.8, marginBottom: 44, maxWidth: 420 }}>
                Most teams burn half their day just finding who to call. QWII eliminates that entirely — a fresh, targeted list arrives every morning before work starts.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 48 }}>
                {[
                  { n: '01', title: 'Targeted by industry & city', desc: 'Filter by sector, district, and company size to reach exactly the right businesses.' },
                  { n: '02', title: 'Verified before it reaches you', desc: 'Real businesses, real contacts, accuracy-checked before every delivery.' },
                  { n: '03', title: 'Export-ready in one click', desc: 'Download as Excel or CSV. Your team starts calling the same morning.' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '40px 1fr', gap: 16,
                    padding: '20px 0',
                    borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(155,18,57,0.3)', paddingTop: 2 }}>{item.n}</span>
                    <div>
                      <div style={{ fontSize: 14.5, fontWeight: 700, color: '#1a1a1a', marginBottom: 5 }}>{item.title}</div>
                      <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)', lineHeight: 1.65 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: R, color: '#fff',
                padding: '12px 24px', borderRadius: 9, fontSize: 13.5, fontWeight: 600,
                textDecoration: 'none',
              }}>
                See it in action
                <ArrowUpRight size={14} />
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { val: '1,000+', label: 'Fresh leads generated daily, automatically', dark: true },
                { val: '₹0.50', label: 'Average cost per qualified lead', dark: false },
                { val: '3×', label: 'Average increase in sales team output', dark: false },
                { val: '95%', label: 'Data accuracy across all deliveries', dark: true },
              ].map((s, i) => (
                <div key={i} style={{
                  background: s.dark ? `linear-gradient(135deg, ${R} 0%, ${RDD} 100%)` : '#fdf0f4',
                  borderRadius: 18,
                  padding: '32px 28px',
                }}>
                  <div style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 900, color: s.dark ? '#fff' : R, letterSpacing: '-2px', lineHeight: 1, marginBottom: 12 }}>{s.val}</div>
                  <div style={{ fontSize: 13, color: s.dark ? 'rgba(255,255,255,0.55)' : 'rgba(155,18,57,0.55)', lineHeight: 1.55 }}>{s.label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ background: '#fafafa', padding: '120px 28px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 72, flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: R, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Platform</div>
              <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 46px)', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.1, letterSpacing: '-2px', margin: 0 }}>
                One platform.<br />Every growth lever.
              </h2>
            </div>
            <p style={{ fontSize: 15, color: 'rgba(0,0,0,0.4)', lineHeight: 1.75, maxWidth: 320, margin: 0 }}>
              Lead generation is just the start. QWII is a complete intelligence platform for growing businesses.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="three-col">
            {features.map((f, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: 16,
                padding: '28px 26px',
                border: '1px solid transparent',
                transition: 'box-shadow 0.2s, border-color 0.2s',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = '0 8px 40px rgba(155,18,57,0.08)';
                  el.style.borderColor = 'rgba(155,18,57,0.12)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = 'none';
                  el.style.borderColor = 'transparent';
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 9,
                  background: '#fdf2f5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
                }}>
                  <f.icon size={17} color={R} />
                </div>
                <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#1a1a1a', marginBottom: 9, letterSpacing: '-0.3px' }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: '#fff', padding: '120px 28px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 72, flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: R, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Stories</div>
              <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 46px)', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.1, letterSpacing: '-2px', margin: 0 }}>
                Real results,<br />real businesses.
              </h2>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ display: 'flex' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />)}
              </div>
              <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)' }}>500+ businesses onboarded</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="three-col">
            {testimonials.map((t, i) => (
              <div key={i} style={{
                background: i === 1 ? `linear-gradient(135deg, ${R} 0%, ${RDD} 100%)` : '#fafafa',
                borderRadius: 20, padding: '36px 32px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 32,
              }}>
                <div>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 20 }}>
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={13} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                    ))}
                  </div>
                  <p style={{ fontSize: 15.5, color: i === 1 ? 'rgba(255,255,255,0.88)' : 'rgba(0,0,0,0.7)', lineHeight: 1.75, margin: 0 }}>
                    "{t.quote}"
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: i === 1 ? 'rgba(255,255,255,0.15)' : '#fce7ed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, color: i === 1 ? '#fff' : R,
                  }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: i === 1 ? '#fff' : '#1a1a1a' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: i === 1 ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)', marginTop: 2 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ background: '#fafafa', padding: '120px 28px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: R, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Pricing</div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 50px)', fontWeight: 800, color: '#1a1a1a', letterSpacing: '-2px', marginBottom: 14 }}>
              Simple, honest pricing.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(0,0,0,0.4)', marginBottom: 40 }}>No surprises. Cancel anytime.</p>

            <div style={{ display: 'inline-flex', background: '#ece8e8', borderRadius: 10, padding: 3 }}>
              {[
                { label: 'Monthly', val: false },
                { label: 'Annual', val: true },
              ].map(opt => (
                <button key={String(opt.val)} onClick={() => setIsAnnual(opt.val)} style={{
                  background: isAnnual === opt.val ? '#fff' : 'transparent',
                  border: 'none', borderRadius: 8, padding: '8px 22px',
                  cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  color: isAnnual === opt.val ? '#1a1a1a' : 'rgba(0,0,0,0.4)',
                  boxShadow: isAnnual === opt.val ? '0 1px 6px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 7,
                }}>
                  {opt.label}
                  {opt.val && (
                    <span style={{ fontSize: 10, fontWeight: 700, background: R, color: '#fff', padding: '2px 7px', borderRadius: 4 }}>
                      2 free
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, alignItems: 'start' }} className="three-col">
            {plans.map((plan, i) => (
              <div key={i} style={{
                background: plan.highlight ? `linear-gradient(145deg, ${R} 0%, ${RDD} 100%)` : '#fff',
                borderRadius: 20, padding: '36px 30px',
                position: 'relative',
                boxShadow: plan.highlight ? `0 24px 60px rgba(155,18,57,0.3)` : 'none',
                transform: plan.highlight ? 'scale(1.025)' : 'scale(1)',
              }}>
                {plan.highlight && (
                  <div style={{
                    position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                    background: '#fff', color: R,
                    borderRadius: 100, padding: '4px 16px',
                    fontSize: 10.5, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase',
                    whiteSpace: 'nowrap', boxShadow: '0 2px 12px rgba(155,18,57,0.2)',
                  }}>
                    Most Popular
                  </div>
                )}

                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: plan.highlight ? '#fff' : '#1a1a1a', letterSpacing: '-0.3px', marginBottom: 6 }}>{plan.name}</div>
                  <div style={{ fontSize: 13, color: plan.highlight ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)', lineHeight: 1.5 }}>{plan.desc}</div>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <span style={{ fontSize: 46, fontWeight: 900, color: plan.highlight ? '#fff' : R, letterSpacing: '-2.5px' }}>
                    {fmt(isAnnual ? plan.annual : plan.monthly)}
                  </span>
                  <span style={{ fontSize: 13, color: plan.highlight ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)', marginLeft: 6 }}>
                    /{isAnnual ? 'yr' : 'mo'}
                  </span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column', gap: 11 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: plan.highlight ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.55)', lineHeight: 1.5 }}>
                      <CheckCircle size={14} style={{ color: plan.highlight ? 'rgba(255,255,255,0.6)' : R, flexShrink: 0, marginTop: 1 }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelection(plan.name, isAnnual ? plan.annual : plan.monthly)}
                  style={{
                    width: '100%', padding: '13px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                    cursor: 'pointer',
                    background: plan.highlight ? '#fff' : R,
                    color: plan.highlight ? R : '#fff',
                    border: 'none',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ background: '#fff', padding: '120px 28px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 100, alignItems: 'center' }} className="split-grid">

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: R, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24 }}>About</div>
              <h2 style={{ fontSize: 'clamp(26px, 3vw, 44px)', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.12, letterSpacing: '-2px', marginBottom: 28 }}>
                Built to level the
                <br />playing field.
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(0,0,0,0.45)', lineHeight: 1.8, marginBottom: 20, maxWidth: 420 }}>
                Sophisticated sales intelligence has long been a privilege of large enterprises with deep pockets. We built QWII to change that.
              </p>
              <p style={{ fontSize: 16, color: 'rgba(0,0,0,0.45)', lineHeight: 1.8, marginBottom: 52, maxWidth: 420 }}>
                Every MSME, distributor, and manufacturer deserves the same quality of data and intelligence as a Fortune 500 sales team.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { icon: Award, title: 'India-first design', desc: 'Built around how Indian businesses operate.' },
                  { icon: Shield, title: 'Data stays yours', desc: 'Zero third-party sharing, ever.' },
                  { icon: Clock, title: 'Start in minutes', desc: 'Onboard fast. See results on day one.' },
                  { icon: Zap, title: 'Continuously improving', desc: 'Gets smarter with every interaction.' },
                ].map((item, i) => (
                  <div key={i} style={{ background: '#fdf2f5', borderRadius: 14, padding: '20px 18px' }}>
                    <item.icon size={17} color={R} style={{ marginBottom: 12 }} />
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1a1a1a', marginBottom: 5 }}>{item.title}</div>
                    <div style={{ fontSize: 12.5, color: 'rgba(0,0,0,0.4)', lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: `linear-gradient(135deg, ${R} 0%, ${RDD} 100%)`, borderRadius: 20, padding: '40px 36px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36 }}>
                {[
                  { val: '500+', label: 'Active businesses' },
                  { val: '1,000+', label: 'Leads per day' },
                  { val: '95%', label: 'Data accuracy' },
                  { val: '₹0.50', label: 'Avg. cost/lead' },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 34, fontWeight: 900, color: '#fff', letterSpacing: '-1.5px', marginBottom: 6 }}>{s.val}</div>
                    <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { initials: 'MB', name: 'Mayank Bajaj', role: 'Co-Founder' },
                  { initials: 'HK', name: 'Himanshu Kumar', role: 'Co-Founder' },
                ].map((p, i) => (
                  <div key={i} style={{
                    background: '#fdf2f5', borderRadius: 14, padding: '22px 18px',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                      background: R,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 800, color: '#fff',
                    }}>{p.initials}</div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1a1a1a' }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', marginTop: 2 }}>{p.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ background: `linear-gradient(135deg, ${RDD} 0%, ${R} 60%, ${RDD} 100%)`, padding: '120px 28px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 900, color: '#fff', lineHeight: 1.05, letterSpacing: '-3px', marginBottom: 24 }}>
            Ready to fill your pipeline?
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 52 }}>
            Get a personalised walkthrough and see exactly how QWII works for your industry and target market.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#fff', color: R,
              padding: '14px 32px', borderRadius: 10, fontSize: 15, fontWeight: 700,
              textDecoration: 'none',
            }}>
              <Phone size={15} />
              Book a Free Demo
            </a>
            <button onClick={() => scrollToSection('pricing')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'transparent', color: 'rgba(255,255,255,0.55)',
              padding: '14px 32px', borderRadius: 10, fontSize: 15, fontWeight: 500,
              cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)',
            }}>
              View Plans
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: FOOT, borderTop: `1px solid rgba(155,18,57,0.15)`, padding: '56px 28px 28px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }} className="footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
                <img src={qwiiLogoUrl} alt="QWII" style={{ height: 26 }} />
                <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{settings.app_name}</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', lineHeight: 1.75, maxWidth: 230, marginBottom: 22 }}>
                B2B lead generation and business intelligence for India.
              </p>
              <div style={{ display: 'flex', gap: 14 }}>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.3)' }}><Phone size={15} /></a>
                <a href="mailto:contact@qwii.in" style={{ color: 'rgba(255,255,255,0.3)' }}><Mail size={15} /></a>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 18 }}>Navigation</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {navItems.map((item, i) => (
                  <button key={i} onClick={() => scrollToSection(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, color: 'rgba(255,255,255,0.35)', padding: 0, textAlign: 'left' }}>
                    {item.label}
                  </button>
                ))}
                <Link to="/auth" style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Sign in</Link>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 18 }}>Legal</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {[{ label: 'Terms', to: '/terms' }, { label: 'Privacy', to: '/privacy' }, { label: 'Refund Policy', to: '/refund' }].map((item, i) => (
                  <Link key={i} to={item.to} style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>{item.label}</Link>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 18 }}>Contact</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                <a href="tel:+917303408500" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>+91 73034 08500</a>
                <a href="tel:+918383954181" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>+91 83839 54181</a>
                <a href="mailto:contact@qwii.in" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>contact@qwii.in</a>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>&copy; {new Date().getFullYear()} {settings.app_name}. All rights reserved.</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>Made in India</p>
          </div>
        </div>
      </footer>

      <WhatsAppButton />

      {selectedPlan && (
        <PlanRegistrationForm
          open={registrationDialogOpen}
          onOpenChange={setRegistrationDialogOpen}
          planName={selectedPlan.name}
          planPrice={selectedPlan.price}
          billingCycle={selectedPlan.billingCycle}
        />
      )}

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (max-width: 960px) {
          .split-grid { grid-template-columns: 1fr !important; gap: 52px !important; }
          .three-col { grid-template-columns: 1fr 1fr !important; }
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
          .hero-card { display: none !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .three-col { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Landing;
