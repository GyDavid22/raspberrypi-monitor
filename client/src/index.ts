import { execSync } from 'child_process';
import { platform } from 'os';

(() => {
    const url = process.env.MONITOR_URL;
    if (!url) {
        return;
    }
    const authToken = process.env.AUTH_TOKEN;

    const headers: Record<string, string> = {
        'Content-Type': 'text/plain',
    };

    if (authToken) {
        headers['Authorization'] = authToken;
    }

    let body = '';

    if (platform() === 'linux') {
        try {
            body = execSync('uptime', { encoding: 'utf-8' }).trim();
        } catch (error) { }
    }

    fetch(url, {
        method: 'POST',
        headers,
        body: body || undefined,
    });
})();