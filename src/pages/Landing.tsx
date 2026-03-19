import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSettings } from '@/hooks/useAppSettings';
import WhatsAppButton from '@/components/WhatsAppButton';
import PlanRegistrationForm from '@/components/PlanRegistrationForm';
import { Target, Users, TrendingUp, Phone, Mail, MapPin, CircleCheck as CheckCircle, ArrowRight, Star, ChevronRight, Zap, ChartBar as BarChart3, Building2, MessageSquare, Shield, Clock, IndianRupee, Briefcase, Award, MapPinned, Layers, ChartLine as LineChart, Package, FileText } from 'lucide-react';

const Landing = () => {
  const { settings } = useAppSettings();
  const [isAnnual, setIsAnnual] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    price: number;
    billingCycle: 'monthly' | 'annual';
  } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
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
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi! I'm interested in learning more about QWII.`;
  const qwiiLogoUrl = 'https://exkmbvfehmzehnsnfzww.supabase.co/storage/v1/object/public/logos/logo-1767650736764.png';

  const handlePlanSelection = (planName: string, price: number) => {
    setSelectedPlan({ name: planName, price, billingCycle: isAnnual ? 'annual' : 'monthly' });
    setRegistrationDialogOpen(true);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const leadFeatures = [
    {
      icon: Target,
      title: 'Targeted Prospect Discovery',
      desc: 'Automatically identify thousands of qualified business prospects matching your ideal customer profile — by industry, city, and segment.',
    },
    {
      icon: MapPinned,
      title: 'Pan-India Coverage',
      desc: 'From metros to Tier-2 and Tier-3 cities — reach businesses anywhere in India. Expand your market without hiring more feet on street.',
    },
    {
      icon: Users,
      title: 'Complete Contact Intelligence',
      desc: 'Every lead comes enriched with business name, contact details, location, and industry category — ready for your sales team to act on.',
    },
    {
      icon: Clock,
      title: 'Daily Fresh Pipeline',
      desc: 'Your lead pipeline refreshes automatically every day. No stale data, no recycled lists. Always new, always relevant.',
    },
    {
      icon: Zap,
      title: 'Instant Export & Action',
      desc: 'Download leads as Excel or CSV in one click. Assign to your sales team and start outreach the same morning.',
    },
    {
      icon: BarChart3,
      title: 'Lead Performance Tracking',
      desc: 'Track which leads convert, which channels work best, and where your team should focus — all in one dashboard.',
    },
  ];

  const otherFeatures = [
    { icon: LineChart, title: 'Sales Forecasting', desc: 'Predict revenue, spot seasonal trends, and make confident inventory and hiring decisions months in advance.' },
    { icon: MessageSquare, title: 'AI Business Assistant', desc: 'Get instant answers to any business question — from pricing strategy to market sizing — powered by AI.' },
    { icon: Building2, title: 'Client & Order Management', desc: 'Manage all your clients, track orders, and monitor payment status from a single, clean interface.' },
    { icon: Package, title: 'Inventory Intelligence', desc: 'Know exactly what to stock and when. Reduce waste and never lose a sale to out-of-stock situations.' },
    { icon: FileText, title: 'Digital Agreements & Invoices', desc: 'Create, send, and collect signed agreements and invoices digitally — professional and paperless.' },
    { icon: TrendingUp, title: 'Market Intelligence', desc: 'Understand where the market is heading, what competitors are doing, and where your next big opportunity lies.' },
  ];

  const stats = [
    { value: '1,000+', label: 'Fresh Leads Per Day' },
    { value: '500+', label: 'Businesses Onboarded' },
    { value: '95%', label: 'Data Accuracy' },
    { value: '₹0.50', label: 'Average Cost Per Lead' },
  ];

  const testimonials = [
    {
      name: 'Rajesh Agarwal',
      city: 'Jaipur',
      business: 'Hardware Distribution',
      text: 'We used to spend hours building prospect lists manually. QWII now delivers hundreds of qualified leads every morning. Our sales team is closing 40% more deals.',
      rating: 5,
    },
    {
      name: 'Sunita Gupta',
      city: 'Kanpur',
      business: 'Textile Wholesale',
      text: 'The quality of leads is genuinely impressive. Every contact is verified and relevant to our business. We have expanded to 3 new cities in just 2 months.',
      rating: 5,
    },
    {
      name: 'Mahesh Bansal',
      city: 'Ahmedabad',
      business: 'Chemical Distribution',
      text: 'QWII has completely transformed how we acquire new clients. In the first month alone, we onboarded 200 new accounts. The ROI is extraordinary.',
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: 'BASIC',
      subtitle: 'Business Insights',
      monthlyPrice: 2999,
      annualPrice: 29999,
      bestFor: 'Small businesses & service providers',
      features: [
        'Monthly business performance report',
        'Key metrics tracking',
        'Insights & recommendations',
        'Email / WhatsApp delivery',
        'Email support',
      ],
      cta: 'Start with Basic',
      popular: false,
    },
    {
      name: 'GROWTH',
      subtitle: 'Lead Generation + Analytics',
      monthlyPrice: 6999,
      annualPrice: 69999,
      bestFor: 'Growing MSMEs & trading companies',
      features: [
        'Everything in Basic',
        'Lead Generation — up to 500 per day',
        'City & industry targeting',
        'Sales trend analysis',
        'Customer behavior insights',
        'Custom dashboard access',
        'Monthly strategy call',
      ],
      cta: 'Grow Your Business',
      popular: true,
    },
    {
      name: 'PRO',
      subtitle: 'Full AI Business Suite',
      monthlyPrice: 14999,
      annualPrice: 149999,
      bestFor: 'Established businesses & distributors',
      features: [
        'Everything in Growth',
        'Lead Generation — up to 1,000 per day',
        'Advanced AI decision support',
        'Dedicated business analyst',
        'Weekly performance reports',
        'Custom AI model',
        'Multi-user access',
        'Priority support',
      ],
      cta: 'Scale with AI',
      popular: false,
    },
  ];

  const industries = [
    'Hardware & Steel',
    'Textile & Apparel',
    'Chemicals & Pharma',
    'FMCG & Distribution',
    'Real Estate',
    'Manufacturing',
  ];

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'about', label: 'About' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: '#ffffff', color: '#1a1a1a', overflowX: 'hidden' }}>

      {/* Navigation */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #f5e8e8', boxShadow: '0 1px 16px rgba(0,0,0,0.06)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={qwiiLogoUrl} alt="QWII" style={{ height: 38, width: 'auto' }} />
            <div>
              <div style={{ fontSize: 19, fontWeight: 800, color: '#cc1f1f', letterSpacing: '-0.3px' }}>{settings.app_name}</div>
              <div style={{ fontSize: 10, color: '#aaa', letterSpacing: 1.2, textTransform: 'uppercase' }}>{settings.tagline}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 36 }} className="nav-links">
            {navItems.map(item => (
              <button key={item.id} onClick={() => scrollToSection(item.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500,
                color: activeSection === item.id ? '#cc1f1f' : '#555',
                borderBottom: activeSection === item.id ? '2px solid #cc1f1f' : '2px solid transparent',
                paddingBottom: 2, transition: 'all 0.2s'
              }}>
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/auth" style={{
              padding: '9px 22px', borderRadius: 8, border: '1.5px solid #cc1f1f',
              color: '#cc1f1f', fontSize: 13, fontWeight: 600, textDecoration: 'none'
            }}>
              Login
            </Link>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{
              padding: '9px 22px', borderRadius: 8, background: '#cc1f1f',
              color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              <Phone size={13} />
              Contact Sales
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" style={{
        paddingTop: 120, paddingBottom: 100,
        background: 'linear-gradient(160deg, #fff 0%, #fff8f8 50%, #fdf2f2 100%)',
        minHeight: '95vh', display: 'flex', alignItems: 'center'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: 64, alignItems: 'center' }} className="hero-grid">

            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff0f0',
                border: '1px solid #f5a0a0', borderRadius: 100, padding: '6px 16px', marginBottom: 28
              }}>
                <Target size={13} style={{ color: '#cc1f1f' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#cc1f1f', letterSpacing: 0.5 }}>
                  India's Leading B2B Lead Generation Platform
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(34px, 4vw, 56px)', fontWeight: 900, lineHeight: 1.12, marginBottom: 22, letterSpacing: '-1.5px', color: '#111' }}>
                Turn Every City Into
                <br />
                <span style={{ color: '#cc1f1f' }}>Your Sales Territory.</span>
              </h1>

              <p style={{ fontSize: 18, color: '#555', lineHeight: 1.75, marginBottom: 36, maxWidth: 500 }}>
                QWII delivers hundreds of <strong style={{ color: '#111' }}>verified, targeted business leads</strong> to your team every single day — so your pipeline never runs dry and your salespeople always have someone to call.
              </p>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 56 }}>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', gap: 8, background: '#cc1f1f',
                  color: '#fff', padding: '15px 32px', borderRadius: 10, fontSize: 15,
                  fontWeight: 700, textDecoration: 'none',
                  boxShadow: '0 6px 24px rgba(204,31,31,0.3)', transition: 'transform 0.15s'
                }}>
                  <Phone size={17} />
                  Get a Free Demo
                </a>
                <button onClick={() => scrollToSection('pricing')} style={{
                  display: 'flex', alignItems: 'center', gap: 8, background: '#fff',
                  color: '#cc1f1f', padding: '15px 32px', borderRadius: 10, fontSize: 15,
                  fontWeight: 700, cursor: 'pointer', border: '2px solid #cc1f1f', transition: 'all 0.2s'
                }}>
                  View Pricing
                  <ArrowRight size={17} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
                {stats.map((s, i) => (
                  <div key={i} style={{ borderLeft: i > 0 ? '1px solid #eee' : 'none', paddingLeft: i > 0 ? 40 : 0 }}>
                    <div style={{ fontSize: 30, fontWeight: 900, color: '#cc1f1f', letterSpacing: '-1px' }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: '#888', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Card */}
            <div style={{ position: 'relative' }}>
              <div style={{
                background: '#fff', borderRadius: 20, padding: 28,
                boxShadow: '0 12px 60px rgba(204,31,31,0.1), 0 2px 16px rgba(0,0,0,0.06)',
                border: '1px solid #fde8e8'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>Live Lead Pipeline</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 100, padding: '4px 12px' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a' }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a' }}>Active</span>
                  </div>
                </div>

                {[
                  { name: 'Sharma Traders & Co.', city: 'Jaipur, Rajasthan', segment: 'Hardware', score: 92 },
                  { name: 'Gupta Fabrics Pvt. Ltd.', city: 'Surat, Gujarat', segment: 'Textiles', score: 88 },
                  { name: 'Mehta Steel Industries', city: 'Rajkot, Gujarat', segment: 'Steel', score: 85 },
                  { name: 'Agarwal Distribution', city: 'Kanpur, UP', segment: 'Chemicals', score: 81 },
                ].map((lead, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: i === 0 ? '#fff8f8' : '#fafafa',
                    borderRadius: 10, marginBottom: 8,
                    border: `1px solid ${i === 0 ? '#fecaca' : '#f0f0f0'}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, background: i === 0 ? '#fef2f2' : '#f4f4f4',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 800, color: i === 0 ? '#cc1f1f' : '#888'
                      }}>
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{lead.name}</div>
                        <div style={{ fontSize: 11, color: '#999', marginTop: 1 }}>
                          <MapPin size={9} style={{ display: 'inline', marginRight: 3 }} />
                          {lead.city} &middot; {lead.segment}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 16, fontWeight: 900, color: i === 0 ? '#cc1f1f' : '#888' }}>{lead.score}</div>
                      <div style={{ fontSize: 10, color: '#aaa' }}>score</div>
                    </div>
                  </div>
                ))}

                <div style={{
                  marginTop: 16, padding: '14px 16px', background: 'linear-gradient(135deg, #cc1f1f, #991b1b)',
                  borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>Today's leads generated</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>847 prospects</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>₹423</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>total cost</div>
                  </div>
                </div>
              </div>

              <div style={{
                position: 'absolute', top: -14, right: -14, background: '#16a34a',
                color: '#fff', borderRadius: 100, padding: '7px 16px', fontSize: 11,
                fontWeight: 800, boxShadow: '0 4px 16px rgba(22,163,74,0.35)', letterSpacing: 0.3
              }}>
                Running on Auto-Pilot
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Industry Trust Bar */}
      <div style={{ background: '#cc1f1f', padding: '18px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, textTransform: 'uppercase' }}>Trusted Across Industries</span>
          {industries.map((ind, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <CheckCircle size={13} style={{ color: '#fca5a5' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{ind}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Generation Deep Dive */}
      <section style={{ padding: '100px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '42% 58%', gap: 80, alignItems: 'center' }} className="hero-grid">
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff0f0',
                border: '1px solid #f5a0a0', borderRadius: 100, padding: '6px 16px', marginBottom: 24
              }}>
                <Target size={13} style={{ color: '#cc1f1f' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#cc1f1f', letterSpacing: 0.3 }}>Lead Generation</span>
              </div>
              <h2 style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 900, color: '#111', marginBottom: 20, lineHeight: 1.2, letterSpacing: '-0.5px' }}>
                Stop Chasing Leads.<br />
                <span style={{ color: '#cc1f1f' }}>Let Them Come to You.</span>
              </h2>
              <p style={{ fontSize: 16, color: '#666', lineHeight: 1.8, marginBottom: 28 }}>
                Most businesses lose growth to a simple problem — their sales team spends more time finding prospects than actually selling. QWII solves this completely.
              </p>
              <p style={{ fontSize: 16, color: '#666', lineHeight: 1.8, marginBottom: 36 }}>
                Our AI platform identifies, verifies, and delivers a fresh batch of high-quality business leads to your dashboard every single day — targeted by industry, city, and customer segment.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  'Thousands of verified prospects delivered daily',
                  'Target by city, district, industry, and business size',
                  'Export instantly — your team can start calling same day',
                  'No stale databases. Always fresh, always relevant',
                ].map((point, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fef2f2', border: '1.5px solid #fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <CheckCircle size={13} style={{ color: '#cc1f1f' }} />
                    </div>
                    <span style={{ fontSize: 15, color: '#444', lineHeight: 1.6 }}>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {leadFeatures.map((f, i) => (
                <div key={i} style={{
                  background: i % 3 === 0 ? '#fef2f2' : '#fff',
                  border: `1.5px solid ${i % 3 === 0 ? '#fca5a5' : '#f0f0f0'}`,
                  borderRadius: 16, padding: '24px 20px', transition: 'all 0.2s', cursor: 'default'
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#cc1f1f'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(204,31,31,0.1)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = i % 3 === 0 ? '#fca5a5' : '#f0f0f0'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <f.icon size={20} style={{ color: '#cc1f1f' }} />
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: '#111', marginBottom: 8, lineHeight: 1.3 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: '#777', lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Businesses Choose QWII */}
      <section style={{ padding: '100px 24px', background: '#fafafa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff0f0',
              border: '1px solid #f5a0a0', borderRadius: 100, padding: '6px 16px', marginBottom: 20
            }}>
              <Award size={13} style={{ color: '#cc1f1f' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#cc1f1f', letterSpacing: 0.3 }}>The QWII Advantage</span>
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 900, color: '#111', marginBottom: 16, letterSpacing: '-0.5px' }}>
              Built for the Way Indian Business Works
            </h2>
            <p style={{ fontSize: 17, color: '#666', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
              We understand the pace, the relationships, and the ambition that drives Indian enterprise. QWII is engineered around it.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }} className="three-col">
            {[
              { icon: Target, title: 'Hyper-Targeted Outreach', desc: 'Reach exactly the right buyer — by geography, industry, and company profile. No spray and pray.' },
              { icon: MapPinned, title: 'Every City, Every District', desc: 'From Tier-1 metros to emerging Tier-3 markets — build presence everywhere your customers are.' },
              { icon: Clock, title: 'Save 8+ Hours Per Day', desc: 'Your sales team should be selling, not building lists. QWII gives them their time — and results — back.' },
              { icon: IndianRupee, title: 'Lowest Cost Per Lead in India', desc: 'At a fraction of what agencies or field teams cost, QWII delivers better-qualified leads at scale.' },
              { icon: Shield, title: 'Verified, High-Quality Data', desc: 'Every lead is validated for accuracy. Your team reaches real, active businesses — not ghost contacts.' },
              { icon: Zap, title: 'Operational in Minutes', desc: 'No complex onboarding. Set your targeting criteria, and your first batch of leads arrives within minutes.' },
            ].map((item, i) => (
              <div key={i} style={{
                background: '#fff', border: '1.5px solid #ece8e8', borderRadius: 16,
                padding: '28px 24px', transition: 'all 0.2s', cursor: 'default'
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#cc1f1f'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(204,31,31,0.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#ece8e8'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
              >
                <div style={{ width: 50, height: 50, borderRadius: 14, background: '#fff0f0', border: '1.5px solid #fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <item.icon size={22} style={{ color: '#cc1f1f' }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111', marginBottom: 10 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: '#777', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Feature Suite */}
      <section id="features" style={{ padding: '100px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff0f0',
              border: '1px solid #f5a0a0', borderRadius: 100, padding: '6px 16px', marginBottom: 20
            }}>
              <Layers size={13} style={{ color: '#cc1f1f' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#cc1f1f', letterSpacing: 0.3 }}>Complete Platform</span>
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 900, color: '#111', marginBottom: 16, letterSpacing: '-0.5px' }}>
              Beyond Leads — A Full Business Intelligence Suite
            </h2>
            <p style={{ fontSize: 17, color: '#666', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
              Lead generation is just where QWII starts. Manage your entire business — from forecasting to operations — in one platform.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="three-col">
            {otherFeatures.map((f, i) => (
              <div key={i} style={{
                background: '#fff', border: '1.5px solid #f0eded', borderRadius: 16, padding: '26px 22px',
                display: 'flex', alignItems: 'flex-start', gap: 16, transition: 'all 0.2s', cursor: 'default'
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#cc1f1f'; (e.currentTarget as HTMLDivElement).style.background = '#fff8f8'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#f0eded'; (e.currentTarget as HTMLDivElement).style.background = '#fff'; }}
              >
                <div style={{ width: 46, height: 46, borderRadius: 12, background: '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <f.icon size={20} style={{ color: '#cc1f1f' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 7 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: '#777', lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '100px 24px', background: 'linear-gradient(135deg, #cc1f1f 0%, #991b1b 100%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 900, color: '#fff', marginBottom: 12, letterSpacing: '-0.5px' }}>
              Businesses That Scaled with QWII
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', maxWidth: 480, margin: '0 auto' }}>
              Real results from real business owners across India
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="three-col">
            {testimonials.map((t, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 18, padding: '32px 28px', backdropFilter: 'blur(8px)',
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.15)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.1)'; }}
              >
                <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={15} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                  ))}
                </div>
                <p style={{ fontSize: 15, color: '#fff', lineHeight: 1.75, marginBottom: 24 }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 17, fontWeight: 900, color: '#fff', border: '1.5px solid rgba(255,255,255,0.25)'
                  }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{t.business} &middot; {t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '100px 24px', background: '#fafafa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff0f0',
              border: '1px solid #f5a0a0', borderRadius: 100, padding: '6px 16px', marginBottom: 20
            }}>
              <IndianRupee size={13} style={{ color: '#cc1f1f' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#cc1f1f', letterSpacing: 0.3 }}>Transparent Pricing</span>
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 900, color: '#111', marginBottom: 16, letterSpacing: '-0.5px' }}>
              Simple Plans. Real Results.
            </h2>
            <p style={{ fontSize: 17, color: '#666', maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.7 }}>
              Whether you're a growing MSME or a large distributor, there's a plan built for your stage.
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fff', border: '1.5px solid #e5e5e5', borderRadius: 100, padding: '6px' }}>
              <button
                onClick={() => setIsAnnual(false)}
                style={{
                  background: !isAnnual ? '#cc1f1f' : 'none', color: !isAnnual ? '#fff' : '#666',
                  border: 'none', borderRadius: 100, padding: '8px 22px',
                  cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s'
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                style={{
                  background: isAnnual ? '#cc1f1f' : 'none', color: isAnnual ? '#fff' : '#666',
                  border: 'none', borderRadius: 100, padding: '8px 22px',
                  cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 8
                }}
              >
                Annual
                <span style={{
                  background: isAnnual ? 'rgba(255,255,255,0.2)' : '#fff0f0',
                  color: isAnnual ? '#fff' : '#cc1f1f',
                  fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 100
                }}>
                  Save 2 months
                </span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'start' }} className="three-col">
            {pricingPlans.map((plan, i) => (
              <div key={i} style={{
                background: '#fff',
                border: `2px solid ${plan.popular ? '#cc1f1f' : '#ece8e8'}`,
                borderRadius: 20, padding: '36px 30px', position: 'relative',
                transform: plan.popular ? 'scale(1.04)' : 'none',
                boxShadow: plan.popular ? '0 16px 56px rgba(204,31,31,0.15)' : '0 2px 16px rgba(0,0,0,0.04)',
              }}>
                {plan.popular && (
                  <div style={{
                    position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                    background: '#cc1f1f', color: '#fff', borderRadius: 100,
                    padding: '6px 22px', fontSize: 11, fontWeight: 800,
                    display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', letterSpacing: 0.5
                  }}>
                    <Star size={11} style={{ fill: '#fff' }} />
                    Most Popular
                  </div>
                )}

                <div style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#cc1f1f', letterSpacing: 1.5, textTransform: 'uppercase' }}>{plan.name}</div>
                  <div style={{ fontSize: 19, fontWeight: 800, color: '#111', marginTop: 6 }}>{plan.subtitle}</div>
                </div>

                <div style={{ margin: '24px 0 20px' }}>
                  <span style={{ fontSize: 42, fontWeight: 900, color: '#111', letterSpacing: '-1px' }}>
                    {formatPrice(isAnnual ? plan.annualPrice : plan.monthlyPrice)}
                  </span>
                  <span style={{ fontSize: 14, color: '#999', marginLeft: 4 }}>{isAnnual ? '/year' : '/month'}</span>
                </div>

                <div style={{ background: '#f8f8f8', borderRadius: 10, padding: '10px 14px', marginBottom: 24, border: '1px solid #eeeeee' }}>
                  <span style={{ fontSize: 12, color: '#999' }}>Best for: </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#333' }}>{plan.bestFor}</span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 13 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#444', lineHeight: 1.5 }}>
                      <CheckCircle size={16} style={{ color: '#16a34a', flexShrink: 0, marginTop: 1 }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelection(plan.name, isAnnual ? plan.annualPrice : plan.monthlyPrice)}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: plan.popular ? '#cc1f1f' : '#fff',
                    color: plan.popular ? '#fff' : '#cc1f1f',
                    border: '2px solid #cc1f1f',
                    boxShadow: plan.popular ? '0 6px 20px rgba(204,31,31,0.25)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {plan.cta}
                  <ChevronRight size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ padding: '100px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="hero-grid">
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff0f0',
                border: '1px solid #f5a0a0', borderRadius: 100, padding: '6px 16px', marginBottom: 28
              }}>
                <Briefcase size={13} style={{ color: '#cc1f1f' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#cc1f1f', letterSpacing: 0.3 }}>Our Mission</span>
              </div>
              <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 900, color: '#111', marginBottom: 22, lineHeight: 1.2, letterSpacing: '-0.5px' }}>
                Democratizing Business Intelligence for Every Indian Enterprise
              </h2>
              <p style={{ fontSize: 16, color: '#666', lineHeight: 1.8, marginBottom: 18 }}>
                QWII was built with a clear purpose — to give every Indian business owner access to the same sophisticated growth tools that large corporations have always had, but at a price and simplicity that works for everyone.
              </p>
              <p style={{ fontSize: 16, color: '#666', lineHeight: 1.8, marginBottom: 36 }}>
                We believe that the next wave of India's economic growth will be driven by MSMEs, traders, and manufacturers who have the right information at the right time. That is exactly what we deliver.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { icon: Award, title: 'India-First Philosophy', desc: 'Designed for Indian markets, Indian industries, and Indian business realities.' },
                  { icon: Shield, title: 'Your Data, Your Privacy', desc: 'Zero data sharing. Your business intelligence stays completely private.' },
                ].map((item, i) => (
                  <div key={i} style={{ background: '#fafafa', border: '1.5px solid #ece8e8', borderRadius: 14, padding: '22px 18px' }}>
                    <item.icon size={22} style={{ color: '#cc1f1f', marginBottom: 12 }} />
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 6 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {[
                { initials: 'MB', name: 'Mayank Bajaj', role: 'Co-Founder' },
                { initials: 'HK', name: 'Himanshu Kumar', role: 'Co-Founder' },
              ].map((person, i) => (
                <div key={i} style={{
                  background: '#fff', border: '1.5px solid #ece8e8', borderRadius: 18,
                  padding: '36px 24px', textAlign: 'center', transition: 'all 0.2s', cursor: 'default'
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#cc1f1f'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 36px rgba(204,31,31,0.1)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#ece8e8'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                >
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #cc1f1f, #7f1d1d)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26, fontWeight: 900, color: '#fff', margin: '0 auto 20px',
                    boxShadow: '0 6px 24px rgba(204,31,31,0.25)'
                  }}>
                    {person.initials}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: '#111', marginBottom: 6 }}>{person.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#cc1f1f' }}>{person.role}</div>
                </div>
              ))}

              <div style={{
                gridColumn: '1 / -1', background: 'linear-gradient(135deg, #fff8f8, #fef2f2)',
                border: '1.5px solid #fca5a5', borderRadius: 18, padding: '28px 24px', textAlign: 'center'
              }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#cc1f1f', letterSpacing: '-1px' }}>500+</div>
                <div style={{ fontSize: 14, color: '#777', marginTop: 6 }}>Businesses growing with QWII across India</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '88px 24px', background: 'linear-gradient(135deg, #111 0%, #2a0a0a 50%, #111 100%)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 900, color: '#fff', marginBottom: 18, lineHeight: 1.15, letterSpacing: '-1px' }}>
            Ready to Fill Your Pipeline<br />
            <span style={{ color: '#f87171' }}>Every Single Day?</span>
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', marginBottom: 44, lineHeight: 1.7 }}>
            Talk to our team and get a free 30-minute walkthrough of how QWII can work for your specific business, industry, and target markets.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 9, background: '#cc1f1f',
              color: '#fff', padding: '17px 38px', borderRadius: 12, fontSize: 16,
              fontWeight: 800, textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(204,31,31,0.45)', transition: 'all 0.2s'
            }}>
              <Phone size={19} />
              Book a Free Demo
            </a>
            <button
              onClick={() => scrollToSection('pricing')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, background: 'transparent',
                color: '#fff', padding: '17px 38px', borderRadius: 12, fontSize: 16,
                fontWeight: 600, cursor: 'pointer', border: '2px solid rgba(255,255,255,0.3)', transition: 'all 0.2s'
              }}
            >
              Explore Plans
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0d0d0d', padding: '64px 24px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 52 }} className="footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <img src={qwiiLogoUrl} alt="QWII" style={{ height: 34, width: 'auto' }} />
                <span style={{ fontSize: 19, fontWeight: 800, color: '#f87171' }}>{settings.app_name}</span>
              </div>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.75, marginBottom: 22, maxWidth: 260 }}>
                India's leading AI-powered lead generation and business intelligence platform for MSMEs and growing enterprises.
              </p>
              <div style={{ display: 'flex', gap: 14 }}>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ color: '#555' }}>
                  <Phone size={17} />
                </a>
                <a href="mailto:contact@qwii.in" style={{ color: '#555' }}>
                  <Mail size={17} />
                </a>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 18, letterSpacing: 0.5, textTransform: 'uppercase' }}>Navigation</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {navItems.map((item, i) => (
                  <li key={i}>
                    <button onClick={() => scrollToSection(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#666', padding: 0 }}>
                      {item.label}
                    </button>
                  </li>
                ))}
                <li><Link to="/auth" style={{ fontSize: 14, color: '#666', textDecoration: 'none' }}>Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 18, letterSpacing: 0.5, textTransform: 'uppercase' }}>Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Terms & Conditions', to: '/terms' },
                  { label: 'Privacy Policy', to: '/privacy' },
                  { label: 'Refund Policy', to: '/refund' },
                ].map((item, i) => (
                  <li key={i}>
                    <Link to={item.to} style={{ fontSize: 14, color: '#666', textDecoration: 'none' }}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 18, letterSpacing: 0.5, textTransform: 'uppercase' }}>Contact</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <Phone size={13} style={{ color: '#cc1f1f' }} />
                  <a href="tel:+917303408500" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>+91 73034 08500</a>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <Phone size={13} style={{ color: '#cc1f1f' }} />
                  <a href="tel:+918383954181" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>+91 83839 54181</a>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <Mail size={13} style={{ color: '#cc1f1f' }} />
                  <a href="mailto:contact@qwii.in" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>contact@qwii.in</a>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                  <MapPin size={13} style={{ color: '#cc1f1f', marginTop: 1 }} />
                  <span style={{ fontSize: 13, color: '#666' }}>India</span>
                </li>
              </ul>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 13, color: '#444' }}>
              &copy; {new Date().getFullYear()} {settings.app_name}. All rights reserved.
            </p>
            <p style={{ fontSize: 13, color: '#444' }}>Made with pride in India</p>
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
          .hero-grid { grid-template-columns: 1fr !important; }
          .three-col { grid-template-columns: 1fr 1fr !important; }
          .nav-links { display: none !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px) {
          .three-col { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Landing;
