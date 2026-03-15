import { useState, useEffect } from 'react';
import { Building2, Upload, Save, RefreshCw, MapPin, Phone, Mail, Globe, CreditCard, FileText, Hash, Landmark, Settings } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCompanyProfile, CompanyProfileInput } from '@/hooks/useCompanyProfile';
import { toast } from '@/hooks/use-toast';

type Section = 'basic' | 'address' | 'tax' | 'bank' | 'documents' | 'terms';

const sectionTabs: { id: Section; label: string; icon: typeof Building2 }[] = [
  { id: 'basic', label: 'Company Info', icon: Building2 },
  { id: 'address', label: 'Address', icon: MapPin },
  { id: 'tax', label: 'Tax & Legal', icon: Hash },
  { id: 'bank', label: 'Bank Details', icon: Landmark },
  { id: 'documents', label: 'Doc Settings', icon: FileText },
  { id: 'terms', label: 'Terms & T&C', icon: Settings },
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

const CompanyProfile = () => {
  const { profile, loading, saving, saveProfile, defaultProfile } = useCompanyProfile();
  const [activeSection, setActiveSection] = useState<Section>('basic');
  const [form, setForm] = useState<CompanyProfileInput>(defaultProfile);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        company_name: profile.company_name || '',
        display_name: profile.display_name || '',
        logo_url: profile.logo_url || '',
        tagline: profile.tagline || '',
        email: profile.email || '',
        phone: profile.phone || '',
        website: profile.website || '',
        address_line1: profile.address_line1 || '',
        address_line2: profile.address_line2 || '',
        city: profile.city || '',
        state: profile.state || '',
        pincode: profile.pincode || '',
        country: profile.country || 'India',
        gst_number: profile.gst_number || '',
        pan_number: profile.pan_number || '',
        cin_number: profile.cin_number || '',
        bank_name: profile.bank_name || '',
        bank_account: profile.bank_account || '',
        bank_ifsc: profile.bank_ifsc || '',
        bank_branch: profile.bank_branch || '',
        invoice_prefix: profile.invoice_prefix || 'INV',
        quotation_prefix: profile.quotation_prefix || 'QT',
        agreement_prefix: profile.agreement_prefix || 'AGR',
        currency: profile.currency || 'INR',
        signature_url: profile.signature_url || '',
        terms_and_conditions: profile.terms_and_conditions || '',
      });
      setIsDirty(false);
    }
  }, [profile]);

  const update = (field: keyof CompanyProfileInput, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!form.company_name.trim()) {
      toast({ title: 'Company name required', variant: 'destructive' });
      return;
    }
    await saveProfile(form);
    setIsDirty(false);
  };

  const Field = ({ label, field, type = 'text', placeholder = '' }: {
    label: string;
    field: keyof CompanyProfileInput;
    type?: string;
    placeholder?: string;
  }) => (
    <div>
      <label className="block text-xs text-muted-foreground mb-1">{label}</label>
      <input
        type={type}
        value={String(form[field] || '')}
        onChange={e => update(field, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60"
      />
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-wide">
              <span className="gradient-text">COMPANY PROFILE</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your business details • Used in all invoices, quotations & agreements
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-all"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving...' : isDirty ? 'Save Changes' : 'Saved'}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="glass-card p-2 space-y-1">
                {sectionTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-all ${
                      activeSection === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <tab.icon size={15} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {form.company_name && (
                <div className="glass-card p-4 mt-4">
                  <p className="text-xs text-muted-foreground mb-2">Preview</p>
                  {form.logo_url ? (
                    <img src={form.logo_url} alt="Logo" className="h-12 object-contain mb-2" onError={e => (e.currentTarget.style.display = 'none')} />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-2">
                      <Building2 size={20} className="text-primary" />
                    </div>
                  )}
                  <p className="text-sm font-bold text-foreground">{form.display_name || form.company_name}</p>
                  {form.tagline && <p className="text-xs text-muted-foreground">{form.tagline}</p>}
                  {form.gst_number && <p className="text-xs text-muted-foreground mt-1">GST: {form.gst_number}</p>}
                  {(form.city || form.state) && (
                    <p className="text-xs text-muted-foreground">{[form.city, form.state].filter(Boolean).join(', ')}</p>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-3">
              <div className="glass-card p-6">
                {activeSection === 'basic' && (
                  <div className="space-y-5">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Building2 size={14} className="text-primary" />
                      Company Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Field label="Company Name *" field="company_name" placeholder="e.g., Acme Textiles Pvt Ltd" />
                      </div>
                      <Field label="Display Name on Documents" field="display_name" placeholder="e.g., Acme Textiles" />
                      <Field label="Tagline / Slogan" field="tagline" placeholder="e.g., Quality you can trust" />
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Logo URL</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={form.logo_url}
                          onChange={e => update('logo_url', e.target.value)}
                          placeholder="https://example.com/logo.png"
                          className="flex-1 px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60"
                        />
                        {form.logo_url && (
                          <img src={form.logo_url} alt="Logo Preview" className="h-9 w-9 object-contain rounded border border-border" onError={e => (e.currentTarget.style.display = 'none')} />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Enter a URL to your company logo (PNG, JPG, SVG recommended)</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-muted-foreground shrink-0" />
                        <Field label="Business Email" field="email" type="email" placeholder="info@company.com" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-muted-foreground shrink-0" />
                        <Field label="Phone Number" field="phone" placeholder="+91 98765 43210" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-muted-foreground shrink-0" />
                        <Field label="Website" field="website" placeholder="https://yourcompany.com" />
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'address' && (
                  <div className="space-y-5">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <MapPin size={14} className="text-primary" />
                      Business Address
                    </h2>
                    <div className="space-y-4">
                      <Field label="Address Line 1" field="address_line1" placeholder="Building name, street address" />
                      <Field label="Address Line 2" field="address_line2" placeholder="Area, landmark (optional)" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="City" field="city" placeholder="Mumbai" />
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">State</label>
                          <select
                            value={form.state}
                            onChange={e => update('state', e.target.value)}
                            className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm focus:outline-none focus:border-primary text-foreground"
                          >
                            <option value="">Select state</option>
                            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <Field label="Pincode" field="pincode" placeholder="400001" />
                        <Field label="Country" field="country" placeholder="India" />
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'tax' && (
                  <div className="space-y-5">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Hash size={14} className="text-primary" />
                      Tax & Legal Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Field label="GST Number" field="gst_number" placeholder="22AAAAA0000A1Z5" />
                        <p className="text-xs text-muted-foreground mt-1">15-digit GSTIN</p>
                      </div>
                      <div>
                        <Field label="PAN Number" field="pan_number" placeholder="AAAAA0000A" />
                        <p className="text-xs text-muted-foreground mt-1">10-character PAN</p>
                      </div>
                      <div>
                        <Field label="CIN Number" field="cin_number" placeholder="U12345AB2000PTC000000" />
                        <p className="text-xs text-muted-foreground mt-1">Corporate Identity Number (optional)</p>
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Currency</label>
                        <select
                          value={form.currency}
                          onChange={e => update('currency', e.target.value)}
                          className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm focus:outline-none focus:border-primary text-foreground"
                        >
                          <option value="INR">INR - Indian Rupee (₹)</option>
                          <option value="USD">USD - US Dollar ($)</option>
                          <option value="EUR">EUR - Euro (€)</option>
                          <option value="GBP">GBP - British Pound (£)</option>
                          <option value="AED">AED - UAE Dirham</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'bank' && (
                  <div className="space-y-5">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Landmark size={14} className="text-primary" />
                      Bank Details
                    </h2>
                    <p className="text-xs text-muted-foreground">These details appear on invoices for payment reference</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Bank Name" field="bank_name" placeholder="HDFC Bank" />
                      <Field label="Account Number" field="bank_account" placeholder="12345678901234" />
                      <Field label="IFSC Code" field="bank_ifsc" placeholder="HDFC0001234" />
                      <Field label="Branch Name" field="bank_branch" placeholder="Andheri West, Mumbai" />
                    </div>
                    {form.bank_name && form.bank_account && (
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                        <p className="text-xs text-muted-foreground mb-2">Preview on Invoice</p>
                        <p className="text-sm font-medium">{form.bank_name}</p>
                        <p className="text-sm text-muted-foreground">A/c: {form.bank_account}</p>
                        {form.bank_ifsc && <p className="text-sm text-muted-foreground">IFSC: {form.bank_ifsc}</p>}
                        {form.bank_branch && <p className="text-sm text-muted-foreground">Branch: {form.bank_branch}</p>}
                      </div>
                    )}
                  </div>
                )}

                {activeSection === 'documents' && (
                  <div className="space-y-5">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <FileText size={14} className="text-primary" />
                      Document Settings
                    </h2>
                    <p className="text-xs text-muted-foreground">Prefixes used when auto-generating document numbers</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Field label="Invoice Prefix" field="invoice_prefix" placeholder="INV" />
                        <p className="text-xs text-muted-foreground mt-1">e.g., INV-001, INV-002...</p>
                      </div>
                      <div>
                        <Field label="Quotation Prefix" field="quotation_prefix" placeholder="QT" />
                        <p className="text-xs text-muted-foreground mt-1">e.g., QT-001, QT-002...</p>
                      </div>
                      <div>
                        <Field label="Agreement Prefix" field="agreement_prefix" placeholder="AGR" />
                        <p className="text-xs text-muted-foreground mt-1">e.g., AGR-001, AGR-002...</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Signature Image URL</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={form.signature_url}
                          onChange={e => update('signature_url', e.target.value)}
                          placeholder="https://example.com/signature.png"
                          className="flex-1 px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60"
                        />
                        {form.signature_url && (
                          <img src={form.signature_url} alt="Signature" className="h-9 object-contain rounded border border-border" onError={e => (e.currentTarget.style.display = 'none')} />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Appears on PDFs as authorized signatory signature</p>
                    </div>
                  </div>
                )}

                {activeSection === 'terms' && (
                  <div className="space-y-5">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Settings size={14} className="text-primary" />
                      Default Terms & Conditions
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      These terms will auto-fill when creating new invoices and quotations. You can edit them per document.
                    </p>
                    <textarea
                      value={form.terms_and_conditions}
                      onChange={e => update('terms_and_conditions', e.target.value)}
                      placeholder={`Enter your standard terms and conditions...\n\nExample:\n1. Payment due within 30 days of invoice date.\n2. Late payment subject to 18% per annum interest.\n3. Goods remain property of seller until full payment.\n4. All disputes subject to jurisdiction of [your city] courts.`}
                      rows={12}
                      className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60 resize-none"
                    />
                  </div>
                )}

                <div className="pt-4 mt-4 border-t border-border/50 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving || !isDirty}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-all"
                  >
                    {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                    {saving ? 'Saving...' : isDirty ? 'Save Changes' : 'All Saved'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CompanyProfile;
