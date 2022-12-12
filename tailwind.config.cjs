/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			backgroundColor: {
				default: 'rgb(var(--color-bg-default) / <alpha-value>)',
				overlay: 'rgb(var(--color-bg-overlay) / <alpha-value>)',
				inset: 'rgb(var(--color-bg-inset) / <alpha-value>)',
				subtle: 'rgb(var(--color-bg-subtle) / <alpha-value>)',
				neutral: {
					emphasis: 'rgb(var(--color-neutral-emphasis) / <alpha-value>)',
					muted: 'rgb(var(--color-neutral-muted))',
					subtle: 'rgb(var(--color-neutral-subtle))'
				}
			}
		},
		screens: {
			sm: '0px',
			xs: '380px',
			md: '544px',
			lg: '768px'
		},
		textColor: {
			default: 'rgb(var(--color-fg-default) / <alpha-value>)',
			muted: 'rgb(var(--color-fg-muted) / <alpha-value>)',
			subtle: 'rgb(var(--color-fg-subtle) / <alpha-value>)',
			emphasis: 'rgb(var(--color-fg-emphasis) / <alpha-value>)'
		},
		boxShadow: {
			default: 'var(--color-shadow-default)',
			medium: 'var(--color-shadow-medium)',
			large: 'var(--color-shadow-large)',
			'extra-large': 'var(--color-shadow-extra-large)',
			'outline-default': 'var(--color-shadow-outline-default)',
			'outline-muted': 'var(--color-shadow-outline-muted)',
			ambient: 'var(--color-shadow-ambient)'
		},
		borderColor: {
			default: 'rgb(var(--color-border-default) / <alpha-value>)',
			muted: 'rgb(var(--color-border-muted) / <alpha-value>)',
			subtle: 'rgb(var(--color-border-subtle))',
			emphasis: 'rgb(var(--color-border-emphasis))'
		}
	},
	plugins: [
		function ({ addVariant }) {
			addVariant('child', '& > *');
			addVariant('child-hover', '& > *:hover');
		}
	]
};
