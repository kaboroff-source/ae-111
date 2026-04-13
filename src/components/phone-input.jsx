import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';
import './phone-input.css';
import usePhoneStore from '@/stores/phone-store';

const PhoneInput = ({ value, onChange, error, id, name, forceCountry }) => {
    const inputRef = useRef(null);
    const itiRef = useRef(null);
    const isUpdatingRef = useRef(false);
    const { countryCode: cachedCountry, fetchGeoCountry, setCountry } = usePhoneStore();

    useEffect(() => {
        const inputElement = inputRef.current;

        if (inputElement && !itiRef.current) {
            itiRef.current = intlTelInput(inputElement, {
                initialCountry: forceCountry || cachedCountry || 'auto',
                nationalMode: false,
                showSelectedDialCode: true,
                loadUtils: () => import('intl-tel-input/build/js/utils.js'),
                geoIpLookup: (callback) => {
                    if (forceCountry) {
                        callback(forceCountry);

                        return;
                    }

                    if (cachedCountry) {
                        callback(cachedCountry);

                        return;
                    }

                    fetchGeoCountry().then(callback);
                }
            });

            const handleCountryChange = () => {
                if (isUpdatingRef.current) return;

                isUpdatingRef.current = true;

                const selectedCountryData = itiRef.current.getSelectedCountryData();
                const dialCode = selectedCountryData.dialCode;
                const iso2 = selectedCountryData.iso2;

                if (iso2) {
                    setCountry(iso2, dialCode);
                }

                if (dialCode) {
                    itiRef.current.setNumber(`+${dialCode}`);
                }

                setTimeout(() => {
                    isUpdatingRef.current = false;
                }, 0);
            };

            const handleInput = () => {
                if (isUpdatingRef.current) return;

                isUpdatingRef.current = true;

                const fullNumber = itiRef.current.getNumber();
                const selectedCountryData = itiRef.current.getSelectedCountryData();
                const dialCode = selectedCountryData.dialCode;

                if (fullNumber && fullNumber.startsWith('+')) {
                    onChange(fullNumber);
                } else if (inputElement.value && dialCode) {
                    const digits = inputElement.value.replace(/\D/g, '');
                    onChange(digits ? `+${dialCode}${digits}` : '');
                } else {
                    onChange(inputElement.value);
                }

                setTimeout(() => {
                    isUpdatingRef.current = false;
                }, 0);
            };

            inputElement.addEventListener('input', handleInput);
            inputElement.addEventListener('countrychange', handleCountryChange);

            return () => {
                inputElement.removeEventListener('input', handleInput);
                inputElement.removeEventListener('countrychange', handleCountryChange);
                itiRef.current?.destroy();
                itiRef.current = null;
            };
        }
    }, []);

    useEffect(() => {
        if (itiRef.current && value && !isUpdatingRef.current) {
            itiRef.current.setNumber(value);
        }
    }, [value]);

    return (
        <div className={error ? 'is-invalid' : ''}>
            <input
                ref={inputRef}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                id={id}
                name={name}
                type="tel"
            />
        </div>
    );
};

PhoneInput.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.bool,
    id: PropTypes.string,
    name: PropTypes.string,
    forceCountry: PropTypes.string
};

export default PhoneInput;
