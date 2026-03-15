import { useState, useEffect, useRef } from 'react';
import { Building2, Upload, Save, RefreshCw, MapPin, Phone, Mail, Globe, FileText, Hash, Landmark, Settings, X, Image } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCompanyProfile, CompanyProfileInput } from '@/hooks/useCompanyProfile';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import SignaturePad from '@/components/signature/SignaturePad';

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

const inputClass = "w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60";

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}

const Field = ({ label, value, onChange, type = 'text', placeholder = '' }: FieldProps) => (
  <div>
    <label className="block text-xs text-muted-foreground mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputClass}
    />
  </div>
);

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  userId: string;
  filePrefix: string;
  hint?: string;
  previewClass?: string;
}

const ImageUpload = ({ label, value, onChange, userId, filePrefix, hint, previewClass = 'h-12' }: ImageUploadProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${userId}/${filePrefix}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('company-assets')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('company-assets').getPublicUrl(path);
      onChange(data.publicUrl);
      toast({ title: 'Image uploaded successfully' });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1">{label}</label>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative group">
            <img
              src={value}
              alt={label}
              className={`${previewClass} object-contain rounded border border-border bg-muted/20`}
              onError={e => (e.currentTarget.style.display = 'none')}
            />
            <button
              onClick={() => onChange('')}
              className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={10} />
            </button>
          </div>
        ) : (
          <div className="h-12 w-20 rounded border-2 border-dashed border-border flex items-center justify-center bg-muted/20">
            <Image size={16} className="text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 space-y-1">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-xs hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            {uploading ? <RefreshCw size={12} className="animate-spin" /> : <Upload size={12} />}
            {uploading ? 'Uploading...' : value ? 'Replace Image' : 'Upload Image'}
          </button>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
      />
    </div>
  );
};

const CompanyProfile = () => {
  const { user } = useAuth();
  const { profile, loading, saving, saveProfile } = useCompanyProfile();
  const [activeSection, setActiveSection] = useState<Section>('basic');
  const [form, setForm] = useState<CompanyProfileInput>({
    company_name: '', display_name: '', logo_url: '', tagline: '', email: '', phone: '',
    website: '', address_line1: '', address_line2: '', city: '', state: '', pincode: '',
    country: 'India', gst_number: '', pan_number: '', cin_number: '', bank_name: '',
    bank_account: '', bank_ifsc: '', bank_branch: '', invoice_prefix: 'INV',
    quotation_prefix: 'QT', agreement_prefix: 'AGR', currency: 'INR', signature_url: '',
    terms_and_conditions: '',
  });
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

  const set = (field: keyof CompanyProfileInput, value: string) => {
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

  const uid = user?.id || '';

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
                        <Field label="Company Name *" value={form.company_name} onChange={v => set('company_name', v)} placeholder="e.g., Acme Textiles Pvt Ltd" />
                      </div>
                      <Field label="Display Name on Documents" value={form.display_name} onChange={v => set('display_name', v)} placeholder="e.g., Acme Textiles" />
                      <Field label="Tagline / Slogan" value={form.tagline} onChange={v => set('tagline', v)} placeholder="e.g., Quality you can trust" />
                    </div>

                    <ImageUpload
                      label="Company Logo"
                      value={form.logo_url}
                      onChange={v => set('logo_url', v)}
                      userId={uid}
                      filePrefix="logo"
                      hint="PNG, JPG, SVG recommended. Max 5MB."
                      previewClass="h-12"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <Field label="Business Email" value={form.email} onChange={v => set('email', v)} type="email" placeholder="info@company.com" />
                        </div>
                        <Mail size={14} className="text-muted-foreground mb-2.5 shrink-0" />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <Field label="Phone Number" value={form.phone} onChange={v => set('phone', v)} placeholder="+91 98765 43210" />
                        </div>
                        <Phone size={14} className="text-muted-foreground mb-2.5 shrink-0" />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <Field label="Website" value={form.website} onChange={v => set('website', v)} placeholder="https://yourcompany.com" />
                        </div>
                        <Globe size={14} className="text-muted-foreground mb-2.5 shrink-0" />
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
                      <Field label="Address Line 1" value={form.address_line1} onChange={v => set('address_line1', v)} placeholder="Building name, street address" />
                      <Field label="Address Line 2" value={form.address_line2} onChange={v => set('address_line2', v)} placeholder="Area, landmark (optional)" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="City" value={form.city} onChange={v => set('city', v)} placeholder="Mumbai" />
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">State</label>
                          <select
                            value={form.state}
                            onChange={e => set('state', e.target.value)}
                            className={inputClass}
                          >
                            <option value="">Select state</option>
                            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <Field label="Pincode" value={form.pincode} onChange={v => set('pincode', v)} placeholder="400001" />
                        <Field label="Country" value={form.country} onChange={v => set('country', v)} placeholder="India" />
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
                        <Field label="GST Number" value={form.gst_number} onChange={v => set('gst_number', v)} placeholder="22AAAAA0000A1Z5" />
                        <p className="text-xs text-muted-foreground mt-1">15-digit GSTIN</p>
                      </div>
                      <div>
                        <Field label="PAN Number" value={form.pan_number} onChange={v => set('pan_number', v)} placeholder="AAAAA0000A" />
                        <p className="text-xs text-muted-foreground mt-1">10-character PAN</p>
                      </div>
                      <div>
                        <Field label="CIN Number" value={form.cin_number} onChange={v => set('cin_number', v)} placeholder="U12345AB2000PTC000000" />
                        <p className="text-xs text-muted-foreground mt-1">Corporate Identity Number (optional)</p>
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Currency</label>
                        <select
                          value={form.currency}
                          onChange={e => set('currency', e.target.value)}
                          className={inputClass}
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
                      <Field label="Bank Name" value={form.bank_name} onChange={v => set('bank_name', v)} placeholder="HDFC Bank" />
                      <Field label="Account Number" value={form.bank_account} onChange={v => set('bank_account', v)} placeholder="12345678901234" />
                      <Field label="IFSC Code" value={form.bank_ifsc} onChange={v => set('bank_ifsc', v)} placeholder="HDFC0001234" />
                      <Field label="Branch Name" value={form.bank_branch} onChange={v => set('bank_branch', v)} placeholder="Andheri West, Mumbai" />
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
                        <Field label="Invoice Prefix" value={form.invoice_prefix} onChange={v => set('invoice_prefix', v)} placeholder="INV" />
                        <p className="text-xs text-muted-foreground mt-1">e.g., INV-001, INV-002...</p>
                      </div>
                      <div>
                        <Field label="Quotation Prefix" value={form.quotation_prefix} onChange={v => set('quotation_prefix', v)} placeholder="QT" />
                        <p className="text-xs text-muted-foreground mt-1">e.g., QT-001, QT-002...</p>
                      </div>
                      <div>
                        <Field label="Agreement Prefix" value={form.agreement_prefix} onChange={v => set('agreement_prefix', v)} placeholder="AGR" />
                        <p className="text-xs text-muted-foreground mt-1">e.g., AGR-001, AGR-002...</p>
                      </div>
                    </div>

                    <SignaturePad
                      label="Authorized Signature"
                      value={form.signature_url}
                      onChange={v => set('signature_url', v)}
                    />
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
                      onChange={e => set('terms_and_conditions', e.target.value)}
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
