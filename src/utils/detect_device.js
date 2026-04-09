import { UAParser } from 'ua-parser-js';

const formatBrowser = (browser) => {
    if (!browser.name) {
        return 'Unknown Browser';
    }
    
    if (browser.version) {
        return `${browser.name} ${browser.version}`;
    }
    
    return browser.name;
};

const formatOS = (os) => {
    if (!os.name) {
        return 'Unknown OS';
    }
    
    if (os.version) {
        return `${os.name} ${os.version}`;
    }
    
    return os.name;
};

const formatEngine = (engine) => {
    if (!engine.name) {
        return null;
    }
    
    if (engine.version) {
        return `${engine.name} ${engine.version}`;
    }
    
    return engine.name;
};

const getDeviceModel = (device) => {
    if (!device.vendor && !device.model) {
        return null;
    }
    
    const parts = [];
    if (device.vendor) parts.push(device.vendor);
    if (device.model) parts.push(device.model);
    
    return parts.join(' ');
};

const getDeviceType = (device) => {
    if (!device.type) {
        return 'Desktop';
    }
    
    return device.type.charAt(0).toUpperCase() + device.type.slice(1);
};

const detectDevice = () => {
    try {
        // Check if we're in browser environment
        if (typeof window === 'undefined' || typeof navigator === 'undefined') {
            throw new Error('Not running in browser environment');
        }

        // Get User-Agent string
        const userAgent = navigator.userAgent;
        
        if (!userAgent || userAgent.length === 0) {
            throw new Error('User-Agent string is empty');
        }
        
        // Create parser instance with explicit UA string
        const parser = new UAParser(userAgent);
        const result = parser.getResult();

        const browserInfo = formatBrowser(result.browser);
        const osInfo = formatOS(result.os);
        const engineInfo = formatEngine(result.engine);
        const deviceModel = getDeviceModel(result.device);
        const deviceType = getDeviceType(result.device);

        const deviceBase = deviceModel || deviceType;
        const deviceInfo = `${deviceBase} - ${osInfo} - ${browserInfo}`;

        return {
            deviceType,
            os: osInfo,
            browser: browserInfo,
            model: deviceModel,
            cpu: result.cpu.architecture || null,
            engine: engineInfo,
            deviceInfo,
            userAgent,
            raw: result
        };
    } catch (error) {
        // Return fallback data
        return {
            deviceType: 'Unknown',
            os: 'Unknown OS',
            browser: 'Unknown Browser',
            model: null,
            cpu: null,
            engine: null,
            deviceInfo: 'Unknown Device - Unknown OS - Unknown Browser',
            userAgent: '',
            raw: null,
            error: error.message
        };
    }
};

export default detectDevice;
