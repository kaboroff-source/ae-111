import { create } from 'zustand';

const usePhoneStore = create((set, get) => ({
    countryCode: null,
    dialCode: null,
    isFetching: false,

    setCountry: (countryCode, dialCode) => set({ countryCode, dialCode }),

    fetchGeoCountry: async () => {
        if (get().countryCode || get().isFetching) return get().countryCode;

        set({ isFetching: true });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
            const res = await fetch(`https://ipapi.co/json/?t=${Date.now()}`, {
                signal: controller.signal,
                cache: 'no-store',
                headers: { Accept: 'application/json' }
            });

            clearTimeout(timeoutId);

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            const code = data.country_code?.toLowerCase();
            const resolved = code && code.length === 2 ? code : 'vn';

            set({ countryCode: resolved, isFetching: false });

            return resolved;
        } catch {
            clearTimeout(timeoutId);
            set({ countryCode: 'vn', isFetching: false });

            return 'vn';
        }
    }
}));

export default usePhoneStore;
