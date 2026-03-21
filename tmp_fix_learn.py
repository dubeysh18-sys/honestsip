import os

replacements = {
    'bg-[#1c1b1b]': 'bg-surface-low',
    'bg-[#151515]': 'bg-surface',
    'bg-[#2a2a2a]': 'bg-surface-high',
    'text-[#131313]': 'text-on-primary',
    'border-[rgba(255,255,255,0.05)]': 'border-outline-var/10',
    'border-[rgba(255,255,255,0.06)]': 'border-outline-var/10',
    'border-[rgba(255,255,255,0.03)]': 'border-outline-var/5',
    'border-[rgba(255,255,255,0.2)]': 'border-outline-var/20',
    'bg-[rgba(255,255,255,0.03)]': 'bg-surface-highest/20',
    'bg-[rgba(255,255,255,0.02)]': 'bg-surface-highest/10',
    'bg-[rgba(255,255,255,0.04)]': 'bg-surface-highest/30',
    'border-[rgba(255,183,125,0.2)]': 'border-primary/20',
    'border-[rgba(255,183,125,0.4)]': 'border-primary/40',
    'shadow-[0_0_15px_rgba(255,183,125,0.03)]': 'shadow-sm',
    'text-[rgba(255,183,125,0.7)]': 'text-primary/70',
    'bg-mango-text': 'bg-primary',
    'text-mango-text': 'text-primary',
    'border-mango-text': 'border-primary',
    "background: goalType === key ? 'rgba(255,183,125,0.12)' : '#2a2a2a'": "className: `w-full text-left p-3 rounded-xl transition-all flex justify-between items-center border ${goalType === key ? 'bg-primary/10 border-primary/30' : 'bg-surface-high border-transparent'}`",
    "border: goalType === key ? '1px solid rgba(255,183,125,0.3)' : '1px solid transparent'": "",
    "background: isCurrent ? 'rgba(255,183,125,0.08)' : 'transparent'": "className: `flex justify-between items-center p-3 rounded-lg border ${isCurrent ? 'bg-primary/10 border-primary/20' : 'border-transparent'}`"
}

files = ['src/pages/LearnChapter.jsx', 'src/pages/LearnIndex.jsx', 'src/pages/GoalPlanner.jsx', 'src/pages/EmergencyFund.jsx', 'src/pages/OnTrack.jsx', 'src/pages/FinancialHealthScore.jsx']

for filename in files:
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        for k, v in replacements.items():
            content = content.replace(k, v)
            
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
    except FileNotFoundError:
        pass
