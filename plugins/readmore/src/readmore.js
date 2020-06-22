/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module readmore/readmore
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ReadMoreEditing from './readmoreediting';
import ReadMoreUI from './readmoreui';

/**
 * The page break feature.
 *
 * It provides the possibility to insert a page break into the rich-text editor.
 *
 * For a detailed overview, check the {@glink features/readmore Page break feature} documentation.
 *
 * @extends module:core/plugin~Plugin
 */
export default class ReadMore extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ ReadMoreEditing, ReadMoreUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ReadMore';
	}
}
