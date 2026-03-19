import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAppSettings } from '@/hooks/useAppSettings';
import WhatsAppButton from '@/components/WhatsAppButton';
import PlanRegistrationForm from '@/components/PlanRegistrationForm';
import { Target, Users, TrendingUp, Phone, Mail, MapPin, ArrowRight, Star, ChevronRight, Zap, Building2, MessageSquare, Shield, Clock, Briefcase, Award, Layers, ChartLine as LineChart, Package, FileText, ChartBar as BarChart3, CircleCheck as CheckCircle, MapPinned, IndianRupee, Menu, X } from 'lucide-react';

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

  const whatsappNumber = '917303408500';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi! I'd like to learn more about QWII.`;
  const qwiiLogoUrl = 'https://exkmbvfehmzehnsnfzww.supabase.co/storage/v1/object/public/logos/logo-1767650736764.png';

  const handlePlanSelection = (planName: string, price: number) => {
    setSelectedPlan({ name: planName, price, billingCycle: isAnnual ? 'annual' : 'monthly' });
    setRegistrationDialogOpen(true);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'about', label: 'About' },
  ];

  const features = [
    {
      icon: Target,
      title: 'Precision Targeting',
      desc: 'Reach exactly the right prospects — filtered by industry, geography, and business profile. Every outreach counts.',
    },
    {
      icon: Zap,
      title: 'Auto-Refreshing Pipeline',
      desc: 'Fresh, verified leads delivered to your dashboard every day. No stale lists, no manual sourcing.',
    },
    {
      icon: Users,
      title: 'Enriched Contact Data',
      desc: 'Each lead includes business name, contact details, location, and category — ready for immediate action.',
    },
    {
      icon: LineChart,
      title: 'Sales Forecasting',
      desc: 'Predict revenue, spot trends early, and make smarter hiring and inventory decisions with confidence.',
    },
    {
      icon: MessageSquare,
      title: 'AI Business Assistant',
      desc: 'Instant answers to complex business questions — from pricing strategy to market expansion analysis.',
    },
    {
      icon: BarChart3,
      title: 'Performance Intelligence',
      desc: 'Track conversion rates, team performance, and channel effectiveness from one unified dashboard.',
    },
    {
      icon: Building2,
      title: 'Client & Order Management',
      desc: 'Full visibility over clients, orders, and payment status — all in one clean, fast interface.',
    },
    {
      icon: Package,
      title: 'Inventory Intelligence',
      desc: 'Know what to stock and when. Reduce waste, eliminate stockouts, and optimize working capital.',
    },
    {
      icon: FileText,
      title: 'Digital Documents',
      desc: 'Create, send, and collect signed agreements and invoices digitally — paperless and professional.',
    },
  ];

  const stats = [
    { value: '1,000+', label: 'Leads generated daily' },
    { value: '500+', label: 'Businesses onboarded' },
    { value: '95%', label: 'Data accuracy rate' },
    { value: '8hrs', label: 'Saved per team per day' },
  ];

  const testimonials = [
    {
      name: 'Rajesh Agarwal',
      title: 'Director, Hardware Distribution',
      location: 'Jaipur',
      text: 'Our sales team used to spend half their day just finding people to call. Now that pipeline fills itself. Close rates are up 40% in three months.',
      rating: 5,
    },
    {
      name: 'Sunita Gupta',
      title: 'CEO, Textile Wholesale',
      location: 'Kanpur',
      text: 'The quality of leads is what surprised us most. Every contact is relevant, every detail is accurate. We expanded into 3 new cities within 2 months.',
      rating: 5,
    },
    {
      name: 'Mahesh Bansal',
      title: 'Managing Director',
      location: 'Ahmedabad',
      text: '200 new accounts in our first month. The ROI was immediate and the platform paid for itself before the first invoice.',
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: 'Basic',
      subtitle: 'Business Insights',
      monthlyPrice: 2999,
      annualPrice: 29999,
      description: 'For small businesses that need clarity on their numbers.',
      features: [
        'Monthly performance report',
        'Key business metrics',
        'Actionable recommendations',
        'WhatsApp & email delivery',
        'Email support',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Growth',
      subtitle: 'Leads + Analytics',
      monthlyPrice: 6999,
      annualPrice: 69999,
      description: 'For growing businesses ready to scale their pipeline.',
      features: [
        'Everything in Basic',
        'Up to 500 leads per day',
        'City & industry targeting',
        'Sales trend analysis',
        'Custom dashboard',
        'Monthly strategy call',
      ],
      cta: 'Start Growing',
      popular: true,
    },
    {
      name: 'Pro',
      subtitle: 'Full AI Suite',
      monthlyPrice: 14999,
      annualPrice: 149999,
      description: 'For established businesses that want the full picture.',
      features: [
        'Everything in Growth',
        'Up to 1,000 leads per day',
        'AI decision support',
        'Dedicated business analyst',
        'Weekly reports',
        'Multi-user access',
        'Priority support',
      ],
      cta: 'Go Pro',
      popular: false,
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: '#0a0a0a', color: '#fff', overflowX: 'hidden' }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={qwiiLogoUrl} alt="QWII" style={{ height: 32, width: 'auto' }} />
            <span style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>{settings.app_name}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="nav-desktop">
            {navItems.map(item => (
              <button key={item.id} onClick={() => scrollToSection(item.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500,
                color: activeSection === item.id ? '#fff' : 'rgba(255,255,255,0.5)',
                transition: 'color 0.2s', padding: 0,
              }}>
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/auth" style={{
              padding: '8px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500, textDecoration: 'none',
              transition: 'all 0.2s', background: 'transparent',
            }}>
              Sign in
            </Link>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{
              padding: '8px 20px', borderRadius: 8,
              background: '#fff', color: '#0a0a0a',
              fontSize: 13, fontWeight: 600, textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}>
              Book a Demo
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', padding: 4, display: 'none' }}
              className="nav-mobile-btn"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div style={{
            background: '#111', borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '16px 28px 24px', display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => scrollToSection(item.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 500,
                color: 'rgba(255,255,255,0.8)', padding: '10px 0', textAlign: 'left',
              }}>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="home" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        paddingTop: 80, paddingBottom: 80,
        position: 'relative', overflow: 'hidden',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(220,38,38,0.12) 0%, transparent 70%), #0a0a0a',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', width: '100%', position: 'relative' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: '1px solid rgba(220,38,38,0.4)',
              background: 'rgba(220,38,38,0.08)',
              borderRadius: 100, padding: '6px 18px', marginBottom: 36,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.2 }}>
                B2B Lead Intelligence Platform
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(40px, 6vw, 76px)', fontWeight: 900, lineHeight: 1.05,
              letterSpacing: '-3px', marginBottom: 28, color: '#fff',
            }}>
              Your sales team
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                deserves better leads.
              </span>
            </h1>

            <p style={{
              fontSize: 18, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75,
              marginBottom: 44, maxWidth: 560, margin: '0 auto 44px',
            }}>
              QWII delivers hundreds of verified, high-intent business prospects to your pipeline every single day — automatically, intelligently, at scale.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 80 }}>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#fff', color: '#0a0a0a',
                padding: '13px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700,
                textDecoration: 'none', transition: 'opacity 0.2s',
              }}>
                Get a Free Demo
                <ArrowRight size={16} />
              </a>
              <button onClick={() => scrollToSection('pricing')} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'transparent', color: 'rgba(255,255,255,0.7)',
                padding: '13px 28px', borderRadius: 10, fontSize: 15, fontWeight: 500,
                cursor: 'pointer', border: '1px solid rgba(255,255,255,0.12)', transition: 'border-color 0.2s',
              }}>
                View Pricing
              </button>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 0, border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, overflow: 'hidden', background: 'rgba(255,255,255,0.02)',
            }} className="stats-grid">
              {stats.map((s, i) => (
                <div key={i} style={{
                  padding: '28px 24px', textAlign: 'center',
                  borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <div style={{ fontSize: 'clamp(22px, 2.5vw, 30px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 6 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.8 }}>{s.label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Lead Generation Focus */}
      <section style={{ padding: '120px 28px', background: '#0f0f0f', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="split-grid">

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
                Lead Generation
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 800, color: '#fff', lineHeight: 1.15, letterSpacing: '-1.5px', marginBottom: 24 }}>
                Stop sourcing leads.<br />Start closing them.
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginBottom: 40 }}>
                Most sales teams spend over half their time looking for who to contact. QWII eliminates that entirely — a fresh, targeted list hits your dashboard every morning before you start work.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 44 }}>
                {[
                  { title: 'Targeted by industry & location', desc: 'Filter by sector, city, district, and company size to reach the exact businesses you want.' },
                  { title: 'Verified contact data', desc: 'Every lead is validated for accuracy — real businesses, real contacts, no dead ends.' },
                  { title: 'Export-ready in one click', desc: 'Download as Excel or CSV. Your team can start calling the same morning.' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2,
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#ef4444', color: '#fff',
                padding: '12px 26px', borderRadius: 9, fontSize: 14, fontWeight: 600,
                textDecoration: 'none', transition: 'background 0.2s',
              }}>
                See it in action
                <ArrowRight size={15} />
              </a>
            </div>

            {/* Live UI Card */}
            <div style={{
              background: '#141414', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, padding: 24, position: 'relative',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Today's Pipeline</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Auto-refreshed 6 min ago</div>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
                  borderRadius: 100, padding: '5px 12px',
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>Live</span>
                </div>
              </div>

              {[
                { name: 'Sharma Trading Co.', city: 'Jaipur', seg: 'Hardware', score: 94, new: true },
                { name: 'Mehta Steel Works', city: 'Rajkot', seg: 'Steel', score: 89, new: true },
                { name: 'Gupta Fabrics Ltd.', city: 'Surat', seg: 'Textiles', score: 86, new: false },
                { name: 'Agarwal Distributors', city: 'Kanpur', seg: 'FMCG', score: 82, new: false },
                { name: 'Singh Chemicals', city: 'Ludhiana', seg: 'Pharma', score: 79, new: false },
              ].map((lead, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '11px 14px', borderRadius: 10, marginBottom: 6,
                  background: lead.new ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${lead.new ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)'}`,
                  transition: 'background 0.2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 8,
                      background: lead.new ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: lead.new ? '#ef4444' : 'rgba(255,255,255,0.3)',
                    }}>
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{lead.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>
                        {lead.city} &middot; {lead.seg}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {lead.new && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 4, padding: '2px 6px' }}>
                        NEW
                      </span>
                    )}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: lead.new ? '#ef4444' : 'rgba(255,255,255,0.4)' }}>{lead.score}</div>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{
                marginTop: 16, padding: '16px 18px',
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>Generated today</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>847 leads</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>Total cost</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#ef4444' }}>₹423</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '120px 28px', background: '#0a0a0a' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 72 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
              Platform
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 46px)', fontWeight: 800, color: '#fff', lineHeight: 1.12, letterSpacing: '-1.5px', maxWidth: 480, margin: 0 }}>
                Everything your business needs to grow.
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 340, margin: 0 }}>
                Lead generation is the foundation. But QWII is a complete operating system for business growth.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }} className="three-col-feature">
            {features.map((f, i) => (
              <div key={i} style={{
                background: '#0a0a0a', padding: '32px 28px',
                transition: 'background 0.2s', cursor: 'default',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#111'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = '#0a0a0a'; }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
                }}>
                  <f.icon size={18} style={{ color: '#ef4444' }} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '120px 28px', background: '#0f0f0f' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 72 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
              Social Proof
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 46px)', fontWeight: 800, color: '#fff', lineHeight: 1.12, letterSpacing: '-1.5px', maxWidth: 480, margin: 0 }}>
              Trusted by businesses across India.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="three-col">
            {testimonials.map((t, i) => (
              <div key={i} style={{
                background: '#141414', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, padding: '32px 28px',
                transition: 'border-color 0.2s', cursor: 'default',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(239,68,68,0.3)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}
              >
                <div style={{ display: 'flex', gap: 2, marginBottom: 20 }}>
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={13} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                  ))}
                </div>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, marginBottom: 28 }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, color: '#ef4444',
                  }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{t.title} &middot; {t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '120px 28px', background: '#0a0a0a' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 64, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
              Pricing
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 46px)', fontWeight: 800, color: '#fff', lineHeight: 1.12, letterSpacing: '-1.5px', marginBottom: 16 }}>
              Simple, transparent pricing.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', marginBottom: 40 }}>
              No surprises. Cancel anytime.
            </p>

            <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 4 }}>
              <button
                onClick={() => setIsAnnual(false)}
                style={{
                  background: !isAnnual ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: 'none', borderRadius: 7, padding: '8px 24px',
                  cursor: 'pointer', fontSize: 13, fontWeight: 500,
                  color: !isAnnual ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s',
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                style={{
                  background: isAnnual ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: 'none', borderRadius: 7, padding: '8px 24px',
                  cursor: 'pointer', fontSize: 13, fontWeight: 500,
                  color: isAnnual ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                Annual
                <span style={{
                  background: 'rgba(239,68,68,0.2)', color: '#ef4444',
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                }}>
                  2 months free
                </span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, alignItems: 'start' }} className="three-col">
            {pricingPlans.map((plan, i) => (
              <div key={i} style={{
                background: plan.popular ? 'rgba(239,68,68,0.04)' : '#111',
                border: `1px solid ${plan.popular ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 16, padding: '36px 30px', position: 'relative',
              }}>
                {plan.popular && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: '#ef4444', color: '#fff', borderRadius: 100,
                    padding: '4px 16px', fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                    whiteSpace: 'nowrap',
                  }}>
                    Most Popular
                  </div>
                )}

                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{plan.name}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{plan.description}</div>
                </div>

                <div style={{ marginBottom: 28 }}>
                  <span style={{ fontSize: 44, fontWeight: 800, color: '#fff', letterSpacing: '-2px' }}>
                    {formatPrice(isAnnual ? plan.annualPrice : plan.monthlyPrice)}
                  </span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginLeft: 6 }}>
                    /{isAnnual ? 'yr' : 'mo'}
                  </span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                      <CheckCircle size={14} style={{ color: '#22c55e', flexShrink: 0, marginTop: 1 }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelection(plan.name, isAnnual ? plan.annualPrice : plan.monthlyPrice)}
                  style={{
                    width: '100%', padding: '13px', borderRadius: 9, fontSize: 14, fontWeight: 600,
                    cursor: 'pointer',
                    background: plan.popular ? '#ef4444' : 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { if (!plan.popular) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; }}
                  onMouseLeave={e => { if (!plan.popular) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ padding: '120px 28px', background: '#0f0f0f' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="split-grid">
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
                About
              </div>
              <h2 style={{ fontSize: 'clamp(26px, 3vw, 42px)', fontWeight: 800, color: '#fff', lineHeight: 1.15, letterSpacing: '-1.5px', marginBottom: 24 }}>
                Built to put every business on an equal footing.
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginBottom: 20 }}>
                For too long, sophisticated sales intelligence has been a privilege of large corporations with big budgets. We built QWII to change that.
              </p>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginBottom: 48 }}>
                Every MSME, distributor, and manufacturer deserves access to the same quality of prospect data and business intelligence. That's the mission.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { icon: Award, title: 'India-first design', desc: 'Every feature is built around how Indian businesses actually operate.' },
                  { icon: Shield, title: 'Your data stays yours', desc: 'Zero third-party sharing. Complete data privacy, always.' },
                  { icon: Clock, title: 'Built for speed', desc: 'Onboard in minutes. See results on day one.' },
                  { icon: Zap, title: 'Continuously improving', desc: 'The platform learns and gets smarter with every interaction.' },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: '#141414', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 12, padding: '20px 18px',
                  }}>
                    <item.icon size={18} style={{ color: '#ef4444', marginBottom: 12 }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                background: '#141414', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, padding: '36px 32px',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32,
              }}>
                {[
                  { val: '500+', label: 'Active businesses' },
                  { val: '1,000+', label: 'Leads per day' },
                  { val: '95%', label: 'Data accuracy' },
                  { val: '₹0.50', label: 'Avg. cost per lead' },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 6 }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { initials: 'MB', name: 'Mayank Bajaj', role: 'Co-Founder' },
                  { initials: 'HK', name: 'Himanshu Kumar', role: 'Co-Founder' },
                ].map((person, i) => (
                  <div key={i} style={{
                    background: '#141414', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 14, padding: '24px 20px', display: 'flex', alignItems: 'center', gap: 14,
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 15, fontWeight: 700, color: '#ef4444', flexShrink: 0,
                    }}>
                      {person.initials}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{person.name}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{person.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '120px 28px',
        background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(220,38,38,0.15) 0%, transparent 70%), #0a0a0a',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-2px', marginBottom: 20 }}>
            Ready to scale your pipeline?
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 48 }}>
            Get a personalised walkthrough and see how QWII works for your industry and target market.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#fff', color: '#0a0a0a',
              padding: '14px 32px', borderRadius: 10, fontSize: 15, fontWeight: 700,
              textDecoration: 'none',
            }}>
              <Phone size={16} />
              Book a Free Demo
            </a>
            <button onClick={() => scrollToSection('pricing')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'transparent', color: 'rgba(255,255,255,0.5)',
              padding: '14px 32px', borderRadius: 10, fontSize: 15, fontWeight: 500,
              cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)',
            }}>
              View Plans
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '60px 28px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }} className="footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <img src={qwiiLogoUrl} alt="QWII" style={{ height: 28, width: 'auto' }} />
                <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{settings.app_name}</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', lineHeight: 1.75, maxWidth: 240, marginBottom: 24 }}>
                B2B lead generation and business intelligence for Indian enterprises.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.3)', transition: 'color 0.2s' }}>
                  <Phone size={16} />
                </a>
                <a href="mailto:contact@qwii.in" style={{ color: 'rgba(255,255,255,0.3)', transition: 'color 0.2s' }}>
                  <Mail size={16} />
                </a>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 20 }}>Navigation</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {navItems.map((item, i) => (
                  <button key={i} onClick={() => scrollToSection(item.id)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 14, color: 'rgba(255,255,255,0.4)', padding: 0, textAlign: 'left', transition: 'color 0.2s',
                  }}>
                    {item.label}
                  </button>
                ))}
                <Link to="/auth" style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Sign in</Link>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 20 }}>Legal</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Terms', to: '/terms' },
                  { label: 'Privacy', to: '/privacy' },
                  { label: 'Refund Policy', to: '/refund' },
                ].map((item, i) => (
                  <Link key={i} to={item.to} style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>{item.label}</Link>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 20 }}>Contact</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href="tel:+917303408500" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>+91 73034 08500</a>
                <a href="tel:+918383954181" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>+91 83839 54181</a>
                <a href="mailto:contact@qwii.in" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>contact@qwii.in</a>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
              &copy; {new Date().getFullYear()} {settings.app_name}. All rights reserved.
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>Made in India</p>
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
        @media (max-width: 900px) {
          .split-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .three-col { grid-template-columns: 1fr 1fr !important; }
          .three-col-feature { grid-template-columns: 1fr 1fr !important; }
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px) {
          .three-col { grid-template-columns: 1fr !important; }
          .three-col-feature { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Landing;
