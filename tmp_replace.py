import re

color_map = {
    '#131313': 'rgb(var(--color-surface))',
    '#0e0e0e': 'rgb(var(--color-surface-lowest))',
    '#1c1b1b': 'rgb(var(--color-surface-low))',
    '#2a2a2a': 'rgb(var(--color-surface-high))',
    '#353534': 'rgb(var(--color-surface-highest))',
    '#ffb77d': 'rgb(var(--color-primary))',
    '#ff8c00': 'rgb(var(--color-primary-container))',
    '#cebefa': 'rgb(var(--color-secondary))',
    '#bdcca3': 'rgb(var(--color-tertiary))',
    '#e5e2e1': 'rgb(var(--color-on-surface))',
    '#ddc1ae': 'rgb(var(--color-on-surface-var))',
    '#1a0a00': 'rgb(var(--color-on-primary))',
    '#4caf82': 'rgb(var(--color-success))',
    '#e05252': 'rgb(var(--color-danger))',
    '#f5c842': 'rgb(var(--color-warning))',
    'rgba(86, 67, 52,': 'rgb(var(--color-outline-var) /',
    'rgba(28, 27, 27,': 'rgb(var(--color-surface-low) /',
    'rgba(229, 226, 225,': 'rgb(var(--color-on-surface) /',
    'rgba(255, 183, 125,': 'rgb(var(--color-primary) /',
    'rgba(255, 140, 0,': 'rgb(var(--color-primary-container) /',
    'rgba(76, 175, 130,': 'rgb(var(--color-success) /',
    'rgba(245, 200, 66,': 'rgb(var(--color-warning) /',
    'rgba(224, 82, 82,': 'rgb(var(--color-danger) /',
}

with open("src/index.css", "r", encoding="utf-8") as f:
    text = f.read()

for k, v in color_map.items():
    if k.startswith("rgba"):
        pattern = re.escape(k) + r'\s*([\d.]+)\)'
        text = re.sub(pattern, lambda m: f"{v} {m.group(1)})", text, flags=re.IGNORECASE)
    else:
        text = re.sub(re.escape(k), v, text, flags=re.IGNORECASE)

with open("src/index.css", "w", encoding="utf-8") as f:
    f.write(text)
