import { useState } from 'react';
import { MessageSquare, Users, Headphones, Send, Bot, User, Sparkles, Clock } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import AnimatedCounter from '@/components/ai/AnimatedCounter';

const internalMessages = [
  { role: 'user', text: 'Last week ka production kitna hua?', time: '10:23 AM' },
  { role: 'bot', text: 'Last week total production: 12,450 units. Breakdown: Sarees 4,200, Lehengas 3,800, Kurtas 4,450. Target achievement: 96.2%', time: '10:23 AM' },
  { role: 'user', text: 'Top selling SKU batao', time: '10:25 AM' },
  { role: 'bot', text: 'Top 3 SKUs this month:\n1. SKU-2847 (Banarasi Silk) - 1,250 units\n2. SKU-1923 (Designer Lehenga) - 980 units\n3. SKU-4521 (Cotton Kurta) - 870 units', time: '10:25 AM' },
];

const externalMessages = [
  { role: 'user', text: 'Order #ORD-4521 ka status?', time: '2:15 PM' },
  { role: 'bot', text: 'Order #ORD-4521 Status: In Production\n• Items: 50 Banarasi Sarees\n• Expected dispatch: 3 days\n• Tracking will be shared via WhatsApp', time: '2:15 PM' },
  { role: 'user', text: 'New catalogue bhejo', time: '2:18 PM' },
  { role: 'bot', text: 'Sure! Sending our latest catalogue with 200+ new designs. Categories include:\n• Wedding Collection 2024\n• Festive Specials\n• Designer Kurtas\n\n📎 Catalogue link sent to your WhatsApp', time: '2:18 PM' },
];

const Chatbot = () => {
  const [activeTab, setActiveTab] = useState<'internal' | 'external'>('internal');
  const [inputValue, setInputValue] = useState('');

  const messages = activeTab === 'internal' ? internalMessages : externalMessages;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="page-header">
          <h1 className="page-title">AI CHATBOT</h1>
          <p className="page-subtitle">Dual-mode intelligent assistant • Internal & B2B support</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Queries Today"
            value={<AnimatedCounter value={847} duration={1500} />}
            change="+124"
            changeType="positive"
            icon={<MessageSquare size={16} />}
          />
          <MetricCard
            title="Resolution Rate"
            value="94.5%"
            change="+2.1%"
            changeType="positive"
            icon={<Sparkles size={16} />}
          />
          <MetricCard
            title="Avg Response"
            value="1.2s"
            change="-0.3s"
            changeType="positive"
            icon={<Clock size={16} />}
          />
          <MetricCard
            title="Satisfaction"
            value="98%"
            change="+1%"
            changeType="positive"
            icon={<Users size={16} />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2 glass-card flex flex-col h-[500px]">
            {/* Tabs */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('internal')}
                className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === 'internal' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Users size={16} />
                Internal Bot
              </button>
              <button
                onClick={() => setActiveTab('external')}
                className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === 'external' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Headphones size={16} />
                B2B Bot
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'bot' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                      <Bot size={16} className="text-primary-foreground" />
                    </div>
                  )}
                  <div className={`max-w-[70%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                    <div className={`p-3 rounded-lg text-sm whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-foreground'
                    }`}>
                      {msg.text}
                    </div>
                    <p className={`text-xs text-muted-foreground mt-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                      {msg.time}
                    </p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <User size={16} className="text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="space-y-4">
            <div className="glass-card p-4">
              <h3 className="section-title">
                <Sparkles size={14} className="text-primary" />
                Top Queries Today
              </h3>
              <div className="space-y-2 mt-3">
                {[
                  { query: 'Order status check', count: 234 },
                  { query: 'Production updates', count: 189 },
                  { query: 'Catalogue requests', count: 156 },
                  { query: 'Price enquiries', count: 142 },
                  { query: 'Delivery tracking', count: 126 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted-foreground">{item.query}</span>
                    <span className="text-sm font-medium text-foreground">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="section-title">
                <Bot size={14} className="text-primary" />
                Bot Capabilities
              </h3>
              <div className="space-y-2 mt-3">
                {['Order tracking', 'Catalogue sharing', 'Price quotes', 'Production status', 'Invoice download', 'Payment reminders'].map((cap, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {cap}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chatbot;
