import { defineField, defineType } from 'sanity'
import { MdEmail } from 'react-icons/md'

export default defineType({
	name: 'contact-form-module',
	title: 'Contact Form',
	type: 'object',
	icon: MdEmail,
	fields: [
		defineField({
			name: 'title',
			type: 'string',
		}),
		defineField({
			name: 'description',
			type: 'array',
			of: [{ type: 'block' }],
		}),
		// defineField({
		// 	name: 'emailTo',
		// 	type: 'string',
		// 	validation: (Rule) => Rule.email(),
		// }),
		defineField({
			name: 'successMessage',
			type: 'string',
		}),
	],
	preview: {
		select: {
			title: 'title',
		},
		prepare({ title }) {
			return {
				title: title || 'Contact Form',
			}
		},
	},
})
