export default {
	props: {
		user: { active: true }
	},

	html: `<div class="active"></div>`,

	test({ assert, component, target, window }) {
		component.user = { active: false };

		assert.htmlEqual(target.innerHTML, `
			<div class></div>
		`);
	}
};
