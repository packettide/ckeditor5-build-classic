/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module filemanager/filemanagerediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImageEditing from '@ckeditor/ckeditor5-image/src/image/imageediting';
import LinkEditing from '@ckeditor/ckeditor5-link/src/linkediting';
import Notification from '@ckeditor/ckeditor5-ui/src/notification/notification';

import FileManagerCommand from './filemanagercommand';

/**
 * The FileManager editing feature. It introduces the {@link module:filemanager/filemanagercommand~FileManagerCommand FileManager command}.
 *
 * @extends module:core/plugin~Plugin
 */
export default class FileManagerEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'FileManagerEditing';
	}

	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ Notification, ImageEditing, LinkEditing ];
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		editor.commands.add( 'filemanager', new FileManagerCommand( editor ) );
	}
}
