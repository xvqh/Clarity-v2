const endpoint_v4 = 'https://api.ipify.org';
const endpoint_v6 = 'https://api6.ipify.org';

interface CacheValueTyping {
    ipv4: string;
    ipv6: string;
}

const CacheValue: CacheValueTyping = {
    ipv4: '',
    ipv6: ''
}

export default async function getIP({ useIPv6 = false }: { useIPv6?: boolean } = {}) {
    if (useIPv6 && CacheValue.ipv6 !== '') {
        return CacheValue.ipv6;
    } else if (!useIPv6 && CacheValue.ipv4 !== '') {
        return CacheValue.ipv4;
    }

    const fetchIPv4 = fetch(endpoint_v4).then(res => res.text());
    const fetchIPv6 = fetch(endpoint_v6).then(res => res.text());

    const [ipv4, ipv6] = await Promise.all<Promise<string>[]>([fetchIPv4, fetchIPv6]);

    CacheValue.ipv4 = ipv4;
    CacheValue.ipv6 = ipv6;

    if (useIPv6) {
        return CacheValue.ipv6;
    } else {
        return CacheValue.ipv4;
    }
};

