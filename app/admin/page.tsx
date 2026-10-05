const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', phone: adminPhone, role: currentRole })
      });
      const data = await res.json();
      
      // Live MSG91 Diagnostic Alert
      if (data.msg91_response) {
        alert("MSG91 Live Server Response: " + JSON.stringify(data.msg91_response));
      }

      if (data.success) {
        setOtpSent(true);
        if (data.dev_otp) {
          alert(`TestBeat Console OTP: ${data.dev_otp}\n(Note: Master Bypass Code is 999888)`);
        }
      } else {
        setAuthError(data.error || 'Failed to dispatch OTP');
      }
    } catch (err: any) {
      setAuthError('Connection error: ' + err.message);
    }
  };
