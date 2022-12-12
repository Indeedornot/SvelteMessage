/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		/*
			--color-bg-dark: 32 34 37;
			--color-bg-default: 54 57 63;
			--color-bg-hover: 50 53 59;
			--color-bg-subtle: 64 68 75;
			--color-fg-default: 220 221 222;
			--color-fg-muted: 114 118 125;
			--color-bg-icon: 220 221 222;
			--color-fg-icon: 64 68 75;
			--color-caret-default: 220 221 222; 
		*/
		extend: {
			backgroundColor: {
				dark: 'rgb(var(--color-bg-dark) / <alpha-value>)',
				default: 'rgb(var(--color-bg-default) / <alpha-value>)',
				hover: 'rgb(var(--color-bg-hover) / <alpha-value>)',
				subtle: 'rgb(var(--color-bg-subtle) / <alpha-value>)',
				icon: 'rgb(var(--color-bg-icon) / <alpha-value>)',
				emphasis: 'rgb(var(--color-bg-emphasis) / <alpha-value>)'
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
			icon: 'rgb(var(--color-fg-icon) / <alpha-value>)',
			'icon-bg': 'rgb(var(--color-fg-icon-bg) / <alpha-value>)',
			emphasis: 'rgb(var(--color-fg-emphasis) / <alpha-value>)'
		},
		caretColor: {
			default: 'rgb(var(--color-caret-default) / <alpha-value>)'
		},
		// boxShadow: {
		// 	default: 'var(--color-shadow-default)',
		// 	medium: 'var(--color-shadow-medium)',
		// 	large: 'var(--color-shadow-large)',
		// 	'extra-large': 'var(--color-shadow-extra-large)',
		// 	'outline-default': 'var(--color-shadow-outline-default)',
		// 	'outline-muted': 'var(--color-shadow-outline-muted)',
		// 	ambient: 'var(--color-shadow-ambient)'
		// },
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
		},
		require('@tailwindcss/forms')
	]
};
