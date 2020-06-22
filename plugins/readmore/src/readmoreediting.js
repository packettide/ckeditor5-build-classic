/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module readmore/readmoreediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ReadMoreCommand from './readmorecommand';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import first from '@ckeditor/ckeditor5-utils/src/first';

import '../theme/readmore.css';

/**
 * The page break editing feature.
 *
 * @extends module:core/plugin~Plugin
 */
export default class ReadMoreEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ReadMoreEditing';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const schema = editor.model.schema;
		const t = editor.t;
		const conversion = editor.conversion;

		schema.register( 'readMore', {
			isObject: true,
			allowWhere: '$block'
		} );

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'readMore',
			view: ( modelElement, viewWriter ) => {
				const divElement = viewWriter.createContainerElement( 'div', {
					class: 'readmore'
				} );

				// For a rationale of using span inside a div see:
				// https://github.com/ckeditor/ckeditor5-readmore/pull/1#discussion_r328934062.
				const spanElement = viewWriter.createContainerElement( 'span', {
					style: 'display: none'
				} );

				viewWriter.insert( viewWriter.createPositionAt( divElement, 0 ), spanElement );

				return divElement;
			}
		} );

		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'readMore',
			view: ( modelElement, viewWriter ) => {
				const label = t( 'Read more' );
				const viewWrapper = viewWriter.createContainerElement( 'div' );
				const viewLabelElement = viewWriter.createContainerElement( 'span' );
				const innerText = viewWriter.createText( t( 'Read more' ) );

				viewWriter.addClass( 'readmore', viewWrapper );
				viewWriter.setCustomProperty( 'readMore', true, viewWrapper );

				viewWriter.addClass( 'readmore__label', viewLabelElement );

				viewWriter.insert( viewWriter.createPositionAt( viewWrapper, 0 ), viewLabelElement );
				viewWriter.insert( viewWriter.createPositionAt( viewLabelElement, 0 ), innerText );

				return toReadMoreWidget( viewWrapper, viewWriter, label );
			}
		} );

		conversion.for( 'upcast' )
			.elementToElement( {
				view: element => {
					// The "page break" div must have specified value for the 'readmore-after' definition and single child only.
					if ( !element.is( 'div' ) || !element.hasClass( 'readmore' ) || element.childCount != 1 ) {
						return;
					}

					const viewSpan = first( element.getChildren() );

					// The child must be the "span" element that is not displayed and has a space inside.
					if ( !viewSpan.is( 'span' ) || viewSpan.getStyle( 'display' ) != 'none' || viewSpan.childCount != 1 ) {
						return;
					}

					const text = first( viewSpan.getChildren() );

					if ( !text.is( 'text' ) || ( text.data !== ' ' && text.data !== '&nbsp;' ) ) {
						return;
					}
					return { name: true };
				},
				model: 'readMore'
			} );

		editor.commands.add( 'readMore', new ReadMoreCommand( editor ) );
	}
}

// Converts a given {@link module:engine/view/element~Element} to a page break widget:
// * Adds a {@link module:engine/view/element~Element#_setCustomProperty custom property} allowing to
//   recognize the page break widget element.
// * Calls the {@link module:widget/utils~toWidget} function with the proper element's label creator.
//
//  @param {module:engine/view/element~Element} viewElement
//  @param {module:engine/view/downcastwriter~DowncastWriter} writer An instance of the view writer.
//  @param {String} label The element's label.
//  @returns {module:engine/view/element~Element}
function toReadMoreWidget( viewElement, writer, label ) {
	writer.setCustomProperty( 'readMore', true, viewElement );

	return toWidget( viewElement, writer, { label } );
}
