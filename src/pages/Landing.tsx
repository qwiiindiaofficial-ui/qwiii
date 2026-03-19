import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSettings } from '@/hooks/useAppSettings';
import WhatsAppButton from '@/components/WhatsAppButton';
import PlanRegistrationForm from '@/components/PlanRegistrationForm';
import { Target, Users, TrendingUp, Phone, Mail, MapPin, CircleCheck as CheckCircle, ArrowRight, Star, ChevronRight, Zap, ChartBar as BarChart3, Building2, MessageSquare, Shield, Clock, IndianRupee, Briefcase, Award, MapPinned, Search, Filter, Download, Repeat, Layers } from 'lucide-react';

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
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Namaste! QWII ke baare mein jaanna chahta hoon.`;
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

  const leadSteps = [
    { icon: Search, title: 'Automatic Business Discovery', desc: 'Our AI searches Google Maps to find verified businesses in your target city, industry, and area — automatically, 24x7.' },
    { icon: Filter, title: 'Smart Lead Filtering', desc: 'Filter leads by city, district, keyword, and business type. Get only the leads that match your exact customer profile.' },
    { icon: Users, title: 'Complete Contact Details', desc: 'Each lead comes with business name, phone number, address, and rating — everything you need to start selling immediately.' },
    { icon: Download, title: 'Export & Act Instantly', desc: 'Download leads as Excel or CSV. Share directly with your sales team. Start calling the same day.' },
    { icon: Repeat, title: 'Fresh Leads Every Day', desc: 'Set up automated daily lead generation. Never run out of prospects. Your pipeline stays full without manual effort.' },
  ];

  const whyQwii = [
    { icon: Target, title: '1,000+ Leads Per Day', desc: 'Generate up to 1,000 fresh, verified business leads every single day from across India.' },
    { icon: MapPinned, title: 'Pan-India Coverage', desc: 'From metro cities to Tier-2 and Tier-3 towns — we cover every district and every industry.' },
    { icon: Clock, title: 'Saves 8 Hours Daily', desc: 'No more manual searching, calling directories, or buying outdated lead lists. Save your team\'s precious time.' },
    { icon: IndianRupee, title: 'Lowest Cost Per Lead', desc: 'At just ₹0.05–₹0.50 per lead, QWII gives you the best ROI in the market. Far cheaper than any agency.' },
    { icon: Shield, title: 'Verified & Fresh Data', desc: 'All leads sourced directly from Google Maps — not recycled databases. You get real, active businesses.' },
    { icon: Zap, title: 'Ready in 5 Minutes', desc: 'No lengthy setup. Login, set your city and keyword, and your first batch of leads is ready in minutes.' },
  ];

  const features = [
    { icon: BarChart3, title: 'Sales Analytics & Forecasting', desc: 'Track your sales performance, forecast future revenue, and spot growth opportunities before your competition.' },
    { icon: MessageSquare, title: 'AI Business Assistant', desc: 'Ask any business question and get instant, intelligent answers powered by AI trained on your data.' },
    { icon: Building2, title: 'Client & Order Management', desc: 'Manage all your clients, orders, and invoices in one clean dashboard. No more juggling spreadsheets.' },
    { icon: Layers, title: 'Inventory & Production', desc: 'Track your stock, manage production cycles, and get alerts before you run out of critical inventory.' },
    { icon: TrendingUp, title: 'Market Intelligence', desc: 'Understand market trends, track competitors, and identify new geographic and product opportunities.' },
    { icon: Briefcase, title: 'Digital Agreements & Invoices', desc: 'Create, send, and get signed agreements and invoices — all digital, all professional, all trackable.' },
  ];

  const testimonials = [
    { name: 'Rajesh Agarwal', city: 'Jaipur', business: 'Hardware Trading', text: 'Pehle lead ke liye 3-4 ghante lagti thi. Ab QWII se subah uthke seedha calling start kar deta hoon. Business 40% badh gaya.', rating: 5 },
    { name: 'Sunita Gupta', city: 'Kanpur', business: 'Textile Wholesale', text: 'Mere sales team ko ab pata hai kahan jaana hai. QWII ne hamara pura lead generation process badal diya. Bahut achha software hai.', rating: 5 },
    { name: 'Mahesh Bansal', city: 'Ahmedabad', business: 'Chemicals Distribution', text: 'Sirf ek mahine mein 200 naye clients add kiye. Yeh possible nahi hota bina QWII ke. Sach mein game changer hai.', rating: 5 },
  ];

  const pricingPlans = [
    {
      name: 'BASIC',
      subtitle: 'Business Insights',
      monthlyPrice: 2999,
      annualPrice: 29999,
      bestFor: 'Chhote Dukaan, Service Providers',
      features: [
        'Monthly business performance summary',
        'Key metrics tracking',
        'Simple insights & recommendations',
        'Email/WhatsApp report',
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
      bestFor: 'Growing MSMEs & Traders',
      features: [
        'Everything in Basic',
        'Lead Generation (up to 500/day)',
        'Pan-India city & keyword targeting',
        'Sales & revenue trend analysis',
        'Customer behavior insights',
        'Custom dashboard access',
        'Monthly strategy call',
      ],
      cta: 'Get More Customers',
      popular: true,
    },
    {
      name: 'PRO',
      subtitle: 'Full AI Business Suite',
      monthlyPrice: 14999,
      annualPrice: 149999,
      bestFor: 'Established Businesses & Distributors',
      features: [
        'Everything in Growth',
        'Lead Generation (up to 1,000/day)',
        'Advanced AI decision support',
        'Priority support & dedicated analyst',
        'Weekly strategy reports',
        'Custom AI model training',
        'Multi-user access',
        'Industry-specific intelligence',
      ],
      cta: 'Scale Your Business',
      popular: false,
    },
  ];

  const navItems = ['home', 'features', 'pricing', 'about'];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#fff', color: '#1a1a1a' }}>

      {/* Navigation */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #f0e0e0', boxShadow: '0 2px 12px rgba(220,38,38,0.06)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={qwiiLogoUrl} alt="QWII" style={{ height: 40, width: 'auto' }} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#dc2626', letterSpacing: '-0.5px' }}>{settings.app_name}</div>
              <div style={{ fontSize: 11, color: '#888', letterSpacing: 1 }}>{settings.tagline}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden-mobile">
            {navItems.map(s => (
              <button key={s} onClick={() => scrollToSection(s)} style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500,
                color: activeSection === s ? '#dc2626' : '#555',
                borderBottom: activeSection === s ? '2px solid #dc2626' : '2px solid transparent',
                paddingBottom: 2, transition: 'all 0.2s'
              }}>
                {s === 'home' ? 'Home' : s === 'features' ? 'Features' : s === 'pricing' ? 'Pricing' : 'About Us'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/auth" style={{
              padding: '8px 20px', borderRadius: 8, border: '1.5px solid #dc2626',
              color: '#dc2626', fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s'
            }}>
              Login
            </Link>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{
              padding: '8px 20px', borderRadius: 8, background: '#dc2626',
              color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s'
            }}>
              <Phone size={14} />
              Contact Sales
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" style={{ paddingTop: 100, paddingBottom: 80, background: 'linear-gradient(135deg, #fff 0%, #fff5f5 40%, #fef2f2 100%)', minHeight: '92vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }} className="hero-grid">

            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fef2f2',
                border: '1px solid #fca5a5', borderRadius: 100, padding: '6px 16px', marginBottom: 24
              }}>
                <Target size={14} style={{ color: '#dc2626' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#dc2626' }}>India's #1 Lead Generation Platform</span>
              </div>

              <h1 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 20, letterSpacing: '-1px' }}>
                <span style={{ color: '#1a1a1a' }}>Roz Naye </span>
                <span style={{ color: '#dc2626' }}>Customers</span>
                <br />
                <span style={{ color: '#1a1a1a' }}>Aapke Business</span>
                <br />
                <span style={{ color: '#dc2626' }}>Ke Liye</span>
              </h1>

              <p style={{ fontSize: 18, color: '#555', lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
                QWII automatically finds <strong style={{ color: '#1a1a1a' }}>verified business leads</strong> from across India using Google Maps AI — so your sales team never runs out of prospects.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', gap: 8, background: '#dc2626',
                  color: '#fff', padding: '14px 28px', borderRadius: 10, fontSize: 16,
                  fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(220,38,38,0.35)',
                  transition: 'all 0.2s'
                }}>
                  <Phone size={18} />
                  Free Demo Lein
                </a>
                <Link to="/auth" style={{
                  display: 'flex', alignItems: 'center', gap: 8, background: '#fff',
                  color: '#dc2626', padding: '14px 28px', borderRadius: 10, fontSize: 16,
                  fontWeight: 700, textDecoration: 'none', border: '2px solid #dc2626', transition: 'all 0.2s'
                }}>
                  Platform Dekhein
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                {[
                  { value: '1,000+', label: 'Leads Per Day' },
                  { value: '500+', label: 'Businesses Using QWII' },
                  { value: '₹0.50', label: 'Cost Per Lead' },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#dc2626' }}>{s.value}</div>
                    <div style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div style={{ position: 'relative' }}>
              <div style={{
                background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 8px 40px rgba(220,38,38,0.12)',
                border: '1px solid #fee2e2'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Live Lead Generation — Running</span>
                </div>

                {[
                  { name: 'Sharma Trading Co.', city: 'Jaipur', phone: '+91 98765 43210', type: 'Hardware' },
                  { name: 'Gupta Textiles Pvt.', city: 'Surat', phone: '+91 87654 32109', type: 'Textiles' },
                  { name: 'Mehta Steel Works', city: 'Rajkot', phone: '+91 76543 21098', type: 'Steel' },
                  { name: 'Agarwal Chemicals', city: 'Kanpur', phone: '+91 65432 10987', type: 'Chemicals' },
                ].map((lead, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', background: i === 0 ? '#fef2f2' : '#fafafa',
                    borderRadius: 10, marginBottom: 8, border: `1px solid ${i === 0 ? '#fca5a5' : '#f0f0f0'}`,
                    transition: 'all 0.3s'
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{lead.name}</div>
                      <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                        <MapPin size={10} style={{ display: 'inline', marginRight: 3 }} />
                        {lead.city} &middot; {lead.type}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#dc2626' }}>{lead.phone}</div>
                      <div style={{
                        display: 'inline-block', marginTop: 4, fontSize: 10, fontWeight: 700,
                        background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: 100
                      }}>Verified</div>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: 16, padding: '12px 14px', background: '#dc2626', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Today's Leads Generated</span>
                  <span style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>847</span>
                </div>
              </div>

              {/* floating badge */}
              <div style={{
                position: 'absolute', top: -16, right: -16, background: '#16a34a',
                color: '#fff', borderRadius: 100, padding: '8px 16px', fontSize: 12,
                fontWeight: 700, boxShadow: '0 4px 16px rgba(22,163,74,0.4)'
              }}>
                Auto-Pilot Mode ON
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div style={{ background: '#dc2626', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {[
            'Hardware & Steel Traders',
            'Textile Wholesalers',
            'Chemical Distributors',
            'FMCG Companies',
            'Real Estate Firms',
            'Manufacturing Units',
          ].map((industry, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle size={14} style={{ color: '#fca5a5' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{industry}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How Lead Generation Works */}
      <section style={{ padding: '96px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fef2f2',
              border: '1px solid #fca5a5', borderRadius: 100, padding: '6px 16px', marginBottom: 16
            }}>
              <Zap size={14} style={{ color: '#dc2626' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#dc2626' }}>How It Works</span>
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 900, color: '#1a1a1a', marginBottom: 16, letterSpacing: '-0.5px' }}>
              5 Steps Mein Apna Business Badhao
            </h2>
            <p style={{ fontSize: 17, color: '#666', maxWidth: 560, margin: '0 auto' }}>
              QWII ka AI aapke liye raat-din fresh leads dhundhta rehta hai — bina kisi manual effort ke.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {leadSteps.map((step, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 24, padding: '28px 32px',
                background: i % 2 === 0 ? '#fff' : '#fff5f5',
                border: '1.5px solid', borderColor: i % 2 === 0 ? '#f0f0f0' : '#fca5a5',
                borderRadius: 16, transition: 'all 0.2s'
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14, background: '#dc2626',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <step.icon size={24} style={{ color: '#fff' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: '50%', background: '#1a1a1a',
                      color: '#fff', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      {i + 1}
                    </span>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a' }}>{step.title}</h3>
                  </div>
                  <p style={{ fontSize: 15, color: '#666', lineHeight: 1.65 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why QWII */}
      <section style={{ padding: '96px 24px', background: '#fafafa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fef2f2',
              border: '1px solid #fca5a5', borderRadius: 100, padding: '6px 16px', marginBottom: 16
            }}>
              <Award size={14} style={{ color: '#dc2626' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#dc2626' }}>Why QWII</span>
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 900, color: '#1a1a1a', marginBottom: 16, letterSpacing: '-0.5px' }}>
              Kyon Chunein QWII Ko?
            </h2>
            <p style={{ fontSize: 17, color: '#666', maxWidth: 560, margin: '0 auto' }}>
              Har din, har shahar, har industry mein fresh leads. Aapka business barhta rahe — yahi hamaara kaam hai.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {whyQwii.map((item, i) => (
              <div key={i} style={{
                background: '#fff', border: '1.5px solid #f0e0e0', borderRadius: 16,
                padding: '28px 24px', transition: 'all 0.2s', cursor: 'default'
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#dc2626'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(220,38,38,0.12)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#f0e0e0'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14, background: '#fef2f2',
                  border: '1.5px solid #fca5a5', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: 16
                }}>
                  <item.icon size={22} style={{ color: '#dc2626' }} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1a1a1a', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: '#666', lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '96px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fef2f2',
              border: '1px solid #fca5a5', borderRadius: 100, padding: '6px 16px', marginBottom: 16
            }}>
              <Layers size={14} style={{ color: '#dc2626' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#dc2626' }}>Complete Business Suite</span>
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 900, color: '#1a1a1a', marginBottom: 16, letterSpacing: '-0.5px' }}>
              Sirf Leads Nahi — Poora Business Manage Karein
            </h2>
            <p style={{ fontSize: 17, color: '#666', maxWidth: 600, margin: '0 auto' }}>
              Lead generation ke saath-saath, QWII aapke pore business ko manage karne ke liye bhi taiyaar hai.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: '#fff', border: '1.5px solid #f0e0e0', borderRadius: 16, padding: '28px 24px',
                display: 'flex', alignItems: 'flex-start', gap: 16, transition: 'all 0.2s', cursor: 'default'
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#dc2626'; (e.currentTarget as HTMLDivElement).style.background = '#fff5f5'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#f0e0e0'; (e.currentTarget as HTMLDivElement).style.background = '#fff'; }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: '#fef2f2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <f.icon size={20} style={{ color: '#dc2626' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '96px 24px', background: '#dc2626' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 900, color: '#fff', marginBottom: 12, letterSpacing: '-0.5px' }}>
              Hamare Customers Ki Baat
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.8)', maxWidth: 500, margin: '0 auto' }}>
              Real business owners jo QWII se apna business badha rahe hain
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 16, padding: '28px 24px', backdropFilter: 'blur(8px)'
              }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={16} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                  ))}
                </div>
                <p style={{ fontSize: 15, color: '#fff', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 800, color: '#fff'
                  }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{t.business}, {t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '96px 24px', background: '#fafafa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fef2f2',
              border: '1px solid #fca5a5', borderRadius: 100, padding: '6px 16px', marginBottom: 16
            }}>
              <IndianRupee size={14} style={{ color: '#dc2626' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#dc2626' }}>Pricing</span>
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 900, color: '#1a1a1a', marginBottom: 16, letterSpacing: '-0.5px' }}>
              Apne Budget Mein Sahi Plan Chunein
            </h2>
            <p style={{ fontSize: 17, color: '#666', maxWidth: 500, margin: '0 auto 32px' }}>
              Chhote business se lekar bade distributors tak — sabke liye plan available hai.
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 100, padding: '8px 20px' }}>
              <button
                onClick={() => setIsAnnual(false)}
                style={{ background: !isAnnual ? '#dc2626' : 'none', color: !isAnnual ? '#fff' : '#666', border: 'none', borderRadius: 100, padding: '6px 18px', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                style={{ background: isAnnual ? '#dc2626' : 'none', color: isAnnual ? '#fff' : '#666', border: 'none', borderRadius: 100, padding: '6px 18px', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                Annual
                <span style={{ background: '#fef2f2', color: '#dc2626', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100, border: '1px solid #fca5a5' }}>
                  2 Months Free
                </span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'start' }}>
            {pricingPlans.map((plan, i) => (
              <div key={i} style={{
                background: '#fff',
                border: `2px solid ${plan.popular ? '#dc2626' : '#f0e0e0'}`,
                borderRadius: 20, padding: '36px 28px', position: 'relative',
                transform: plan.popular ? 'scale(1.03)' : 'none',
                boxShadow: plan.popular ? '0 12px 48px rgba(220,38,38,0.18)' : 'none',
              }}>
                {plan.popular && (
                  <div style={{
                    position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                    background: '#dc2626', color: '#fff', borderRadius: 100,
                    padding: '6px 20px', fontSize: 12, fontWeight: 800,
                    display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap'
                  }}>
                    <Star size={12} style={{ fill: '#fff' }} />
                    Sabse Popular
                  </div>
                )}

                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#dc2626', letterSpacing: 1, textTransform: 'uppercase' }}>{plan.name}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', marginTop: 4 }}>{plan.subtitle}</div>
                </div>

                <div style={{ margin: '24px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: 40, fontWeight: 900, color: '#1a1a1a' }}>
                      {formatPrice(isAnnual ? plan.annualPrice : plan.monthlyPrice)}
                    </span>
                    <span style={{ fontSize: 14, color: '#888' }}>{isAnnual ? '/year' : '/month'}</span>
                  </div>
                </div>

                <div style={{ background: '#fafafa', borderRadius: 10, padding: '10px 14px', marginBottom: 20, border: '1px solid #f0e0e0' }}>
                  <span style={{ fontSize: 12, color: '#888' }}>Best for: </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a' }}>{plan.bestFor}</span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#444' }}>
                      <CheckCircle size={16} style={{ color: '#16a34a', flexShrink: 0, marginTop: 1 }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelection(plan.name, isAnnual ? plan.annualPrice : plan.monthlyPrice)}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 10, fontSize: 15, fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: plan.popular ? '#dc2626' : '#fff',
                    color: plan.popular ? '#fff' : '#dc2626',
                    border: `2px solid #dc2626`,
                    transition: 'all 0.2s',
                    boxShadow: plan.popular ? '0 4px 16px rgba(220,38,38,0.3)' : 'none'
                  }}
                >
                  {plan.cta}
                  <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ padding: '96px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="hero-grid">
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fef2f2',
                border: '1px solid #fca5a5', borderRadius: 100, padding: '6px 16px', marginBottom: 24
              }}>
                <Briefcase size={14} style={{ color: '#dc2626' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#dc2626' }}>Our Story</span>
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 38px)', fontWeight: 900, color: '#1a1a1a', marginBottom: 20, lineHeight: 1.2 }}>
                Bane Hain Indian Business Owners Ke Liye
              </h2>
              <p style={{ fontSize: 16, color: '#555', lineHeight: 1.75, marginBottom: 16 }}>
                QWII ka janm ek simple observation se hua — Indian business owners ke paas mehnat ki kami nahi, lekin <strong>sahi customers dhundhne ka time nahi hai.</strong>
              </p>
              <p style={{ fontSize: 16, color: '#555', lineHeight: 1.75, marginBottom: 32 }}>
                Hamara mission hai har chhote-bade vyapari ko vahi tools dena jo bade corporations use karte hain — simple Hindi mein, affordable price par, bina kisi technical knowledge ke.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { icon: Award, title: 'India First', desc: 'Indian markets, Indian languages, Indian businesses' },
                  { icon: Shield, title: 'Data Privacy', desc: 'Aapka data sirf aapka — koi sharing nahi' },
                ].map((item, i) => (
                  <div key={i} style={{ background: '#fafafa', border: '1.5px solid #f0e0e0', borderRadius: 12, padding: '20px 16px' }}>
                    <item.icon size={22} style={{ color: '#dc2626', marginBottom: 10 }} />
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: '#888' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {[
                { initials: 'MB', name: 'Mayank Bajaj', role: 'Co-Founder', icon: Briefcase },
                { initials: 'HK', name: 'Himanshu Kumar', role: 'Co-Founder', icon: Zap },
              ].map((person, i) => (
                <div key={i} style={{
                  background: '#fff', border: '1.5px solid #f0e0e0', borderRadius: 16,
                  padding: '28px 20px', textAlign: 'center', transition: 'all 0.2s'
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#dc2626'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(220,38,38,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#f0e0e0'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                >
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, fontWeight: 900, color: '#fff', margin: '0 auto 16px',
                    boxShadow: '0 4px 20px rgba(220,38,38,0.3)'
                  }}>
                    {person.initials}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: '#1a1a1a', marginBottom: 4 }}>{person.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#dc2626' }}>{person.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1010 50%, #1a1a1a 100%)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#fff', marginBottom: 16, lineHeight: 1.2 }}>
            Aaj Hi Shuru Karein — <span style={{ color: '#f87171' }}>Pehle Mahine Free Demo</span>
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', marginBottom: 40, lineHeight: 1.65 }}>
            Abhi WhatsApp karein aur hamare team se ek free 30-minute demo book karein. Aap dekkhenge kaise QWII aapke business mein 2x growth la sakta hai.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 8, background: '#dc2626',
              color: '#fff', padding: '16px 36px', borderRadius: 12, fontSize: 17,
              fontWeight: 800, textDecoration: 'none', boxShadow: '0 6px 24px rgba(220,38,38,0.5)', transition: 'all 0.2s'
            }}>
              <Phone size={20} />
              Free Demo Book Karein
            </a>
            <button
              onClick={() => scrollToSection('pricing')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, background: 'transparent',
                color: '#fff', padding: '16px 36px', borderRadius: 12, fontSize: 17,
                fontWeight: 700, cursor: 'pointer', border: '2px solid rgba(255,255,255,0.4)', transition: 'all 0.2s'
              }}
            >
              Plans Dekhein
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#111', padding: '64px 24px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <img src={qwiiLogoUrl} alt="QWII" style={{ height: 36, width: 'auto' }} />
                <span style={{ fontSize: 20, fontWeight: 800, color: '#f87171' }}>{settings.app_name}</span>
              </div>
              <p style={{ fontSize: 13, color: '#888', lineHeight: 1.65, marginBottom: 20 }}>
                {settings.tagline}<br />
                India's leading AI-powered lead generation platform for businesses.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ color: '#888', transition: 'color 0.2s' }}>
                  <Phone size={18} />
                </a>
                <a href="mailto:contact@qwii.in" style={{ color: '#888', transition: 'color 0.2s' }}>
                  <Mail size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 16, letterSpacing: 0.5 }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Features', action: () => scrollToSection('features') },
                  { label: 'Pricing', action: () => scrollToSection('pricing') },
                  { label: 'About Us', action: () => scrollToSection('about') },
                ].map((item, i) => (
                  <li key={i}>
                    <button onClick={item.action} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#888', padding: 0 }}>
                      {item.label}
                    </button>
                  </li>
                ))}
                <li><Link to="/auth" style={{ fontSize: 14, color: '#888', textDecoration: 'none' }}>Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 16, letterSpacing: 0.5 }}>Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Terms & Conditions', to: '/terms' },
                  { label: 'Privacy Policy', to: '/privacy' },
                  { label: 'Refund Policy', to: '/refund' },
                ].map((item, i) => (
                  <li key={i}>
                    <Link to={item.to} style={{ fontSize: 14, color: '#888', textDecoration: 'none' }}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 16, letterSpacing: 0.5 }}>Contact</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Phone size={14} style={{ color: '#dc2626' }} />
                  <a href="tel:+917303408500" style={{ fontSize: 14, color: '#888', textDecoration: 'none' }}>+91 73034 08500</a>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Phone size={14} style={{ color: '#dc2626' }} />
                  <a href="tel:+918383954181" style={{ fontSize: 14, color: '#888', textDecoration: 'none' }}>+91 83839 54181</a>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Mail size={14} style={{ color: '#dc2626' }} />
                  <a href="mailto:contact@qwii.in" style={{ fontSize: 14, color: '#888', textDecoration: 'none' }}>contact@qwii.in</a>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <MapPin size={14} style={{ color: '#dc2626', marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: '#888' }}>India</span>
                </li>
              </ul>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #222', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 13, color: '#555' }}>
              &copy; {new Date().getFullYear()} {settings.app_name}. All rights reserved.
            </p>
            <p style={{ fontSize: 13, color: '#555' }}>Made with love in India</p>
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
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Landing;
