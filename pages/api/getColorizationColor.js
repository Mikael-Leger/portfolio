import Registry from 'winreg';

export default function handler(req, res) {
    const regKey = new Registry({
        hive: Registry.HKCU,
        key: '\\Software\\Microsoft\\Windows\\DWM',
    });

    regKey.get('ColorizationColor', (err, item) => {
        if (err) {
            return res.status(404).json({ error: 'No color' });
        }
        const colorHex = item.value.substring(2);

        const r = parseInt(colorHex.substring(2, 4), 16);
        const g = parseInt(colorHex.substring(4, 6), 16);
        const b = parseInt(colorHex.substring(6, 8), 16);

        res.status(200).json({ r, g, b });
    });
}
