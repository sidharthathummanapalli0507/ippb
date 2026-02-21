document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    // DOM Elements - Tracking
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const captchaDisplay = document.getElementById('captcha-code');
    const captchaInput = document.getElementById('captcha-input');
    const refreshCaptcha = document.getElementById('refresh-captcha');
    const trackBtn = document.getElementById('track-btn');
    const errorMsg = document.getElementById('error-msg');
    const trackingResult = document.getElementById('tracking-result');
    const timeline = document.getElementById('timeline');
    const resId = document.getElementById('res-id');
    const resDate = document.getElementById('res-date');

    // DOM Elements - OTP
    const otpActionContainer = document.getElementById('otp-action-container');
    const verifyDeliveryBtn = document.getElementById('verify-delivery-btn');
    const otpModal = document.getElementById('otp-modal');
    const closeModal = document.querySelector('.close-modal');
    const otpDigits = document.querySelectorAll('.otp-digit');
    const submitOtpBtn = document.getElementById('submit-otp-btn');
    const otpMessage = document.getElementById('otp-message');

    // DOM Elements - Booking
    const weightInput = document.getElementById('weight-input');
    const priceValue = document.getElementById('price-value');
    const bookingForm = document.getElementById('booking-form');
    const bookingSuccess = document.getElementById('booking-success');
    const newConsignmentId = document.getElementById('new-consignment-id');

    let currentCaptcha = '';
    const CORRECT_OTP = '1234';

    // Tab Switching Logic
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');

                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                document.getElementById(`${tabId}-tab`).classList.add('active');

                // Clear error and reset button state
                if (errorMsg) errorMsg.textContent = '';
                if (trackBtn) trackBtn.classList.remove('active');
            });
        });
    }

    // Enter Key Support for Tracking Inputs
    document.querySelectorAll('.tracking-input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (captchaInput.value.length >= 5) {
                    handleTrack();
                } else {
                    captchaInput.focus();
                    if (errorMsg) errorMsg.textContent = 'Please enter the CAPTCHA first.';
                }
            }
        });
    });

    // Captcha Logic
    function generateCaptcha() {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let captcha = '';
        for (let i = 0; i < 5; i++) {
            captcha += chars[Math.floor(Math.random() * chars.length)];
        }
        currentCaptcha = captcha;
        if (captchaDisplay) captchaDisplay.textContent = captcha;
    }

    if (refreshCaptcha) {
        refreshCaptcha.addEventListener('click', generateCaptcha);
    }

    generateCaptcha(); // Initial generation

    // Enable Search button when captcha is entered
    if (captchaInput) {
        captchaInput.addEventListener('input', () => {
            if (captchaInput.value.length >= 5) {
                trackBtn.classList.add('active');
                trackBtn.disabled = false;
            } else {
                trackBtn.classList.remove('active');
                trackBtn.disabled = true;
            }
        });

        captchaInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && captchaInput.value.length >= 5) {
                handleTrack();
            }
        });
    }

    // Event Listeners
    if (trackBtn) {
        trackBtn.addEventListener('click', handleTrack);
    }

    // Booking Captcha Logic
    const bookingCaptchaDisplay = document.getElementById('booking-captcha-code');
    const bookingCaptchaInput = document.getElementById('booking-captcha-input');
    const bookingRefreshCaptcha = document.getElementById('booking-refresh-captcha');
    let currentBookingCaptcha = '';

    function generateBookingCaptcha() {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let captcha = '';
        for (let i = 0; i < 5; i++) {
            captcha += chars[Math.floor(Math.random() * chars.length)];
        }
        currentBookingCaptcha = captcha;
        if (bookingCaptchaDisplay) bookingCaptchaDisplay.textContent = captcha;
    }

    if (bookingRefreshCaptcha) {
        bookingRefreshCaptcha.addEventListener('click', generateBookingCaptcha);
    }

    generateBookingCaptcha();

    // Validating weight for price
    if (weightInput) {
        weightInput.addEventListener('input', calculatePrice);
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userCaptcha = bookingCaptchaInput.value.trim().toUpperCase();
            if (userCaptcha !== currentBookingCaptcha) {
                alert('Invalid Booking CAPTCHA. Please try again.');
                generateBookingCaptcha();
                bookingCaptchaInput.value = '';
                return;
            }
            handleBooking(e);
        });
    }

    if (verifyDeliveryBtn) {
        verifyDeliveryBtn.addEventListener('click', openOtpModal);
    }

    if (closeModal) {
        closeModal.addEventListener('click', closeOtpModal);
    }

    // OTP Input Logic
    if (otpDigits && otpDigits.length > 0) {
        otpDigits.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1 && index < otpDigits.length - 1) {
                    otpDigits[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                    otpDigits[index - 1].focus();
                }
            });
        });
    }

    if (submitOtpBtn) {
        submitOtpBtn.addEventListener('click', verifyOtp);
    }

    // Contact Captcha Logic
    const contactCaptchaDisplay = document.getElementById('contact-captcha-code');
    const contactCaptchaInput = document.getElementById('contact-captcha-input');
    const contactRefreshCaptcha = document.getElementById('contact-refresh-captcha');
    const contactForm = document.getElementById('contact-form');
    let currentContactCaptcha = '';

    function generateContactCaptcha() {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let captcha = '';
        for (let i = 0; i < 5; i++) {
            captcha += chars[Math.floor(Math.random() * chars.length)];
        }
        currentContactCaptcha = captcha;
        if (contactCaptchaDisplay) contactCaptchaDisplay.textContent = captcha;
    }

    if (contactRefreshCaptcha) {
        contactRefreshCaptcha.addEventListener('click', generateContactCaptcha);
    }

    if (contactForm) {
        generateContactCaptcha();
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userCaptcha = contactCaptchaInput.value.trim().toUpperCase();
            if (userCaptcha !== currentContactCaptcha) {
                alert('Invalid Contact CAPTCHA. Please try again.');
                generateContactCaptcha();
                contactCaptchaInput.value = '';
                return;
            }
            alert('Message Sent Successfully!');
            contactForm.reset();
            generateContactCaptcha();
        });
    }

    // Functions

    function handleTrack() {
        const activeTab = document.querySelector('.tab-content.active');
        const queryInput = activeTab.querySelector('.tracking-input');
        const query = queryInput.value.trim().toUpperCase();
        const userCaptcha = captchaInput.value.trim();

        // Reset state
        if (errorMsg) errorMsg.textContent = '';
        if (trackingResult) trackingResult.classList.add('hidden');
        if (otpActionContainer) otpActionContainer.classList.add('hidden');

        // Captcha Validation
        if (userCaptcha !== currentCaptcha) {
            if (errorMsg) errorMsg.textContent = 'Invalid CAPTCHA. Please try again.';
            generateCaptcha();
            if (captchaInput) captchaInput.value = '';
            if (trackBtn) trackBtn.classList.remove('active');
            return;
        }

        if (!query) {
            if (errorMsg) errorMsg.textContent = 'Please enter a number to track.';
            return;
        }

        // Logic based on tab
        const activeTabId = activeTab.id;
        if (activeTabId === 'consignment-tab') {
            const consignmentRegex = /^[A-Z0-9]{9,13}$/;
            if (!consignmentRegex.test(query)) {
                if (errorMsg) errorMsg.textContent = 'Please enter a valid Consignment Number (e.g., CP123456789IN).';
                return;
            }
        } else if (activeTabId === 'money-order-tab') {
            if (query.length !== 10 && query.length !== 18) {
                if (errorMsg) errorMsg.textContent = 'Money Order number must be 10 or 18 digits.';
                return;
            }
        }

        // Simulate API Load
        if (trackBtn) {
            const originalText = trackBtn.textContent;
            trackBtn.textContent = 'Searching...';
            trackBtn.disabled = true;

            setTimeout(() => {
                showTrackingResult(query);
                trackBtn.textContent = originalText;
                trackBtn.disabled = false;
                generateCaptcha(); // Refresh for next time
                if (captchaInput) captchaInput.value = '';
            }, 1000);
        }
    }

    function showTrackingResult(input) {
        const today = new Date();
        const deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + 2);

        const mockSteps = [
            { date: formatDate(minusDays(today, 2)), status: 'Consignment Booked', location: 'Source Post Office', active: true },
            { date: formatDate(minusDays(today, 1)), status: 'Shipped', location: 'Transit Hub', active: true },
            { date: formatDate(today), status: 'Out for Delivery', location: 'Destination Post Office', active: true },
            { date: 'Expected: ' + formatDate(deliveryDate), status: 'Delivered', location: 'Recipient Address', active: false }
        ];

        if (resId) resId.textContent = input;
        if (resDate) resDate.textContent = formatDate(deliveryDate);

        renderTimeline(mockSteps);

        if (trackingResult) {
            trackingResult.classList.remove('hidden');
            trackingResult.scrollIntoView({ behavior: 'smooth' });
        }

        if (mockSteps[2].active && !mockSteps[3].active) {
            if (otpActionContainer) otpActionContainer.classList.remove('hidden');
        }
    }

    function calculatePrice() {
        const weight = parseFloat(weightInput.value) || 0;
        let price = 0;
        if (weight > 0) {
            price = 40 + (weight * 0.1);
        }
        if (priceValue) priceValue.textContent = `₹${Math.ceil(price)}`;
    }

    function handleBooking(e) {
        e.preventDefault();
        const randomID = 'CP' + Math.floor(Math.random() * 1000000000) + 'IN';
        if (newConsignmentId) newConsignmentId.textContent = randomID;
        if (bookingSuccess) bookingSuccess.classList.remove('hidden');
        if (bookingForm) {
            bookingForm.parentElement.querySelector('.form-grid')?.classList.add('hidden');
            bookingForm.parentElement.querySelector('.parcel-section')?.classList.add('hidden');
            bookingForm.parentElement.querySelector('.booking-captcha')?.classList.add('hidden');
            bookingForm.parentElement.querySelector('.form-actions')?.classList.add('hidden');
            bookingForm.parentElement.querySelector('.form-divider')?.classList.add('hidden');
        }
        if (bookingSuccess) bookingSuccess.scrollIntoView({ behavior: 'smooth' });
    }

    function renderTimeline(steps) {
        if (!timeline) return;
        timeline.innerHTML = '';
        steps.forEach((step, index) => {
            const isActive = step.active ? 'active' : '';
            const html = `
                <div class="timeline-item ${isActive}">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="timeline-date">${step.date}</div>
                        <div class="timeline-status">${step.status}</div>
                        <div class="timeline-location">${step.location}</div>
                    </div>
                </div>
            `;
            timeline.insertAdjacentHTML('beforeend', html);
        });
    }

    function openOtpModal() {
        if (otpModal && otpDigits.length > 0) {
            otpModal.classList.add('active');
            otpDigits[0].focus();
            otpMessage.textContent = '';
            otpMessage.className = 'otp-message';
            resetOtpInputs();
        }
    }

    function closeOtpModal() {
        otpModal.classList.remove('active');
    }

    function verifyOtp() {
        let enteredOtp = '';
        otpDigits.forEach(input => enteredOtp += input.value);

        if (enteredOtp === CORRECT_OTP) {
            otpMessage.textContent = 'Verification Successful! Delivery Confirmed.';
            otpMessage.classList.add('success');

            setTimeout(() => {
                closeOtpModal();
                updateToDelivered();
            }, 1500);
        } else {
            otpMessage.textContent = 'Invalid OTP. Please try again (Use 1234).';
            otpMessage.classList.add('error');
        }
    }

    function updateToDelivered() {
        const items = document.querySelectorAll('.timeline-item');
        if (items.length > 3) {
            items[3].classList.add('active');
            items[3].querySelector('.timeline-status').textContent = 'Successfully Delivered';
            items[3].querySelector('.timeline-date').textContent = formatDate(new Date());
        }

        otpActionContainer.innerHTML = '<h3 style="color: green; text-align: center;"><i class="fa-solid fa-check-circle"></i> Parcel Delivered Successfully</h3>';
    }

    function resetOtpInputs() {
        otpDigits.forEach(input => input.value = '');
    }

    function formatDate(date) {
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    function minusDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() - days);
        return result;
    }
});
