import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, CheckCircle2, CreditCard, Phone, Copy, Check, QrCode } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PlanRegistrationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  planPrice: number;
  billingCycle: 'monthly' | 'annual';
}

const PlanRegistrationForm = ({
  open,
  onOpenChange,
  planName,
  planPrice,
  billingCycle,
}: PlanRegistrationFormProps) => {
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    message: '',
  });

  const upiId = '7303408500@kotak811';
  const qrCodeUrl = 'https://i.ibb.co/hJLJ14q0/Whats-App-Image-2026-01-29-at-03-50-23.jpg';

  const copyUPIId = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUPI(true);
    toast.success('UPI ID copied to clipboard!');
    setTimeout(() => setCopiedUPI(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('plan_registrations').insert({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company_name: formData.companyName || null,
        plan_name: planName,
        billing_cycle: billingCycle,
        plan_price: planPrice,
        message: formData.message || null,
        status: 'pending',
      });

      if (error) throw error;

      toast.success('Registration submitted successfully!');
      setStep('payment');
    } catch (error: any) {
      toast.error(`Failed to submit registration: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      companyName: '',
      message: '',
    });
    onOpenChange(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={step === 'payment' ? "sm:max-w-[800px] max-h-[90vh] overflow-y-auto" : "sm:max-w-[500px]"}>
        {step === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Register for {planName} Plan</DialogTitle>
              <DialogDescription>
                Fill in your details to get started with the {planName} plan at {formatPrice(planPrice)}/{billingCycle === 'annual' ? 'year' : 'month'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name (Optional)</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="Your company name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Message (Optional)</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Any specific requirements or questions?"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Continue to Payment'
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <DialogHeader className="space-y-3">
              <div className="flex items-center justify-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <DialogTitle className="text-2xl text-center">Registration Successful!</DialogTitle>
              <DialogDescription className="text-center">
                Thank you for choosing the {planName} plan. Complete your payment below to activate your account.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              <div className="bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/15 p-5 rounded-xl border-2 border-primary/40 dark:border-primary/50">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Plan</p>
                    <p className="font-bold text-primary text-lg">{planName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Amount</p>
                    <p className="font-bold text-2xl text-gray-900 dark:text-gray-100">{formatPrice(planPrice)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Billing</p>
                    <p className="font-bold text-lg capitalize text-gray-900 dark:text-gray-100">{billingCycle}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 p-6 rounded-xl border-2 border-green-600/50 dark:border-green-500/60">
                <div className="flex items-center gap-2 mb-4">
                  <QrCode className="w-6 h-6 text-green-700 dark:text-green-400" />
                  <h4 className="font-bold text-lg text-green-900 dark:text-green-100">UPI Payment (Recommended)</h4>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs font-semibold text-green-800 dark:text-green-300 mb-2 block">UPI ID</Label>
                      <div className="flex gap-2">
                        <div className="flex-1 p-3 bg-white dark:bg-gray-950 rounded-lg border-2 border-green-300 dark:border-green-700 font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {upiId}
                        </div>
                        <Button
                          size="sm"
                          onClick={copyUPIId}
                          className="gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white"
                        >
                          {copiedUPI ? (
                            <>
                              <Check className="w-4 h-4" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-950 p-4 rounded-lg border-2 border-green-300 dark:border-green-700">
                      <h5 className="font-semibold text-sm mb-2 text-green-900 dark:text-green-100">Payment Instructions:</h5>
                      <ol className="text-xs space-y-1.5 text-gray-700 dark:text-gray-300 list-decimal list-inside">
                        <li>Open any UPI app (GPay, PhonePe, Paytm)</li>
                        <li>Scan the QR code or use the UPI ID</li>
                        <li>Enter amount: <span className="font-bold text-gray-900 dark:text-gray-100">{formatPrice(planPrice)}</span></li>
                        <li>Complete the payment</li>
                      </ol>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-white dark:bg-gray-950 p-4 rounded-xl border-4 border-green-600 dark:border-green-500 shadow-lg">
                      <img
                        src={qrCodeUrl}
                        alt="UPI QR Code"
                        className="w-48 h-48 object-cover"
                      />
                    </div>
                    <p className="text-sm font-semibold text-green-800 dark:text-green-300 mt-3">
                      Scan to Pay {formatPrice(planPrice)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl space-y-2 hover:border-primary/50 transition-colors">
                  <p className="font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Bank Transfer
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Contact our sales team for bank account details
                  </p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-xl space-y-2 hover:border-primary/50 transition-colors">
                  <p className="font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Need Help?
                  </p>
                  <div className="flex flex-col gap-1">
                    <a href="tel:+917303408500" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                      +91 73034 08500
                    </a>
                    <a href="https://wa.me/917303408500" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                      WhatsApp Support
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-2 border-amber-200 dark:border-amber-700">
                <p className="text-xs text-amber-900 dark:text-amber-100 text-center font-medium">
                  Our team will verify your payment and activate your account within 24 hours. You will receive a confirmation email once your account is active.
                </p>
              </div>

              <Button onClick={handleClose} className="w-full" size="lg">
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlanRegistrationForm;
