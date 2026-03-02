# India DNS Fix - Supabase Connection Issue

## Problem
Supabase India mein block ho gaya hai kuch ISPs ke through (Jio, Airtel, etc.). Yeh government/ISP level block hai.

## Quick Solutions (Choose One)

### Solution 1: Change DNS to Cloudflare (RECOMMENDED - 2 minutes)

#### Windows:
1. **Settings kholo**
2. **Network & Internet** pe jao
3. **Ethernet/Wi-Fi** pe click karo (jo use kar rahe ho)
4. **Edit DNS settings** click karo
5. **Manual** select karo
6. **IPv4** on karo
7. **Preferred DNS**: `1.1.1.1`
8. **Alternate DNS**: `1.0.0.1`
9. **Save** karo
10. **Browser restart** karo

#### Mac:
1. **System Preferences** kholo
2. **Network** pe jao
3. Apna connection select karo (Wi-Fi/Ethernet)
4. **Advanced** click karo
5. **DNS** tab pe jao
6. **+** button click karke add karo:
   - `1.1.1.1`
   - `1.0.0.1`
7. **OK** aur **Apply** karo
8. **Browser restart** karo

#### Linux:
```bash
# Edit resolv.conf
sudo nano /etc/resolv.conf

# Add these lines at the top:
nameserver 1.1.1.1
nameserver 1.0.0.1

# Save and exit (Ctrl+X, Y, Enter)
```

#### Android:
1. **Settings** > **Wi-Fi**
2. Connected network pe **long press**
3. **Modify Network**
4. **Advanced options** show karo
5. **IP Settings** ko **Static** karo
6. **DNS 1**: `1.1.1.1`
7. **DNS 2**: `1.0.0.1`
8. **Save** karo

#### iPhone:
1. **Settings** > **Wi-Fi**
2. Connected network pe **(i)** button
3. **Configure DNS** > **Manual**
4. **Add Server**: `1.1.1.1`
5. **Add Server**: `1.0.0.1`
6. **Save** karo

---

### Solution 2: Use VPN (Instant but slower)

#### Free VPN Options:
1. **Cloudflare WARP** (RECOMMENDED - Fast & Free):
   - Download: https://1.1.1.1
   - Install karo
   - App open karke ON karo
   - Done!

2. **ProtonVPN** (Free tier available):
   - Download: https://protonvpn.com
   - Free account banao
   - Connect to any server
   - Done!

3. **Windscribe** (10GB/month free):
   - Download: https://windscribe.com
   - Free account banao
   - Connect
   - Done!

---

### Solution 3: Router DNS Change (Affects whole home network)

1. **Router admin panel kholo**:
   - Usually: `192.168.1.1` or `192.168.0.1`
   - Browser mein type karo

2. **Login karo** (usually admin/admin or check router sticker)

3. **DNS Settings** dhundo:
   - Usually under **Internet**, **WAN**, or **Network Settings**

4. **Primary DNS**: `1.1.1.1`
5. **Secondary DNS**: `1.0.0.1`

6. **Save** aur **Reboot** router

7. Wait 2-3 minutes

8. Sabhi devices automatically fixed ho jayenge

---

## Alternative DNS Providers

Agar Cloudflare kaam nahi kara to try karo:

### Google DNS:
- Primary: `8.8.8.8`
- Secondary: `8.8.4.4`

### Quad9 DNS:
- Primary: `9.9.9.9`
- Secondary: `149.112.112.112`

### OpenDNS:
- Primary: `208.67.222.222`
- Secondary: `208.67.220.220`

---

## How to Test If Fixed

1. **Browser restart karo** (important!)
2. **Application kholo**
3. **Login try karo**
4. Agar login hua to **SUCCESS!**

### Still Not Working?

Try karo in order:
1. Browser cache clear karo (Ctrl+Shift+Delete)
2. Different browser try karo (Chrome, Firefox, Edge)
3. Incognito/Private mode try karo
4. Different DNS provider try karo (Google or Quad9)
5. VPN use karo as last resort

---

## Why This Happened?

- Indian ISPs ne Supabase domains ko block kar diya
- Yeh government order ya ISP decision ho sakta hai
- Supabase team actively authorities se baat kar rahi hai
- Fix permanent nahi hai abhi tak
- DNS change sabse reliable workaround hai

---

## For Developers

### Custom Domain Solution (Advanced):
Agar tumhara own domain hai (example.com):

1. Supabase Dashboard > **Project Settings** > **Custom Domains**
2. Apna domain add karo (api.example.com)
3. DNS records add karo
4. Enable **Cloudflare Proxying**
5. Code mein `VITE_SUPABASE_URL` update karo

This way Indian ISP block bypass ho jayega.

---

## Current Status

Check latest status: https://status.supabase.com

As of **March 2, 2026**:
- Issue ongoing since **Feb 24, 2026**
- Multiple ISPs affected (Jio, Airtel, etc.)
- Supabase working with authorities
- DNS/VPN workaround confirmed working
- No ETA for permanent fix

---

## Quick Command Check

Test if DNS working:

### Windows:
```cmd
nslookup nyozmlwpttctnmljzmdu.supabase.co 1.1.1.1
```

### Mac/Linux:
```bash
dig @1.1.1.1 nyozmlwpttctnmljzmdu.supabase.co
```

Agar IP address dikhega to DNS working hai!

---

## Support

Agar koi problem ho:
1. Screenshot lo error ka
2. Kaun sa DNS use kar rahe ho batao
3. ISP kaun sa hai batao (Jio/Airtel/BSNL/etc.)
4. City batao

---

## TL;DR (Too Long, Didn't Read)

**FASTEST FIX** (2 minutes):
1. Download **Cloudflare WARP**: https://1.1.1.1
2. Install karo
3. ON karo
4. Login karo application mein
5. Done! ✅

---

**Permanent Solution Aane Tak Yahi Use Karo!**
