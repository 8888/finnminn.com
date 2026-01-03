# CSS Class Structure / Configuration

Since we are using Tailwind CSS via CDN, the configuration will be injected directly into the `<head>`.

## Tailwind Config
```javascript
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                void: '#0d0208',
                crypt: '#1a0b14',
                bone: '#fbe9d0',
                ash: '#8a7d85',
                radical: '#ff0055',
                toxic: '#00ff41',
                spirit: '#00f2ff',
                gloom: '#4b0082',
            },
            fontFamily: {
                pixel: ['"VT323"', 'monospace'],
                mono: ['"Space Mono"', 'monospace'],
            },
            boxShadow: {
                'hard': '4px 4px 0px 0px #ff0055',
                'hard-green': '4px 4px 0px 0px #00ff41',
                'hard-void': '4px 4px 0px 0px #0d0208',
            },
            animation: {
                'blink': 'blink 1s step-end infinite',
            },
            keyframes: {
                blink: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0' },
                }
            }
        }
    }
}
```

## Custom CSS
```css
.scanlines {
    background: linear-gradient(
        to bottom,
        rgba(255,255,255,0),
        rgba(255,255,255,0) 50%,
        rgba(0,0,0,0.1) 50%,
        rgba(0,0,0,0.1)
    );
    background-size: 100% 4px;
}
```
