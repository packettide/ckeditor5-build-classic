import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class PageLinks extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		// The upcast converter will convert <a class="mention" href="" data-user-id="">
		// elements to the model 'mention' attribute.
		editor.conversion.for( 'upcast' ).elementToAttribute( {
			view: {
				name: 'a',
				key: 'data-mention',
				classes: 'mention',
				attributes: {
					href: true
				}
			},
			model: {
				key: 'mention',
				value: viewItem => {
					// The mention feature expects that the mention attribute value
					// in the model is a plain object with a set of additional attributes.
					// In order to create a proper object, use the toMentionAttribute helper method:
					const mentionAttribute = editor.plugins.get( 'Mention' ).toMentionAttribute( viewItem, {
						// Add any other properties that you need.
						link: viewItem.getAttribute( 'href' )
					} );

					return mentionAttribute;
				}
			},
			converterPriority: 'high'
		} );

		// Downcast the model 'mention' text attribute to a view <a> element.
		editor.conversion.for( 'downcast' ).attributeToElement( {
			model: 'mention',
			view: ( modelAttributeValue, viewWriter ) => {
				// Do not convert empty attributes (lack of value means no mention).
				if ( !modelAttributeValue ) {
					return;
				}
				if ( !modelAttributeValue.href || modelAttributeValue.href == null ) {
					return viewWriter.createAttributeElement( 'span', {
						'data-mention': modelAttributeValue.id
					}, {
						// Make mention attribute to be wrapped by other attribute elements.
						priority: 20,
						// Prevent merging mentions together.
						id: modelAttributeValue.uid
					} );
				}
				return viewWriter.createAttributeElement( 'a', {
					'data-mention': modelAttributeValue.id,
					'href': modelAttributeValue.href
				}, {
					// Make mention attribute to be wrapped by other attribute elements.
					priority: 20,
					// Prevent merging mentions together.
					id: modelAttributeValue.uid
				} );
			},
			converterPriority: 'high'
		} );
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'PageLinks';
	}
}
