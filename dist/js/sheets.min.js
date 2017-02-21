/**
 *
 * Sheets.js v1.0.0
 * by John Lioneil Dionisio
 * WYSIWYG Editor for backend developers
 *
 * https://github.com/lioneil/sheets.js
 *
 * Free to use under the MIT License.
 * https://github.com/lioneil/sheets.js/blob/master/LICENSE
 *
 */
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
    	} else if ( typeof exports === 'object' ) {
        	module.exports = factory(root);
    	} else {
        	root.Sheets = factory(root);
    	}
})(this, function (root) {

	'use strict';

	/**
	 * -----------------------------------------
	 * Variables
	 * -----------------------------------------
	 *
	 */

	// Object for Public APIs
	var Sheets = {};
	// Feature test
	var supports = !!document.querySelector && !!root.addEventListener;
	// Settings
	var settings, eventTimeout;
	// tools
	var toolbarItems = [
		[
			{
				name: 'bold',
				type: 'button',
				command: 'bold',
				icon: 'icon-bold',
			},
			{
				name: 'italic',
				type: 'button',
				command: 'italic',
				icon: 'icon-italic',
			},
			{
				name: 'underline',
				type: 'button',
				command: 'underline',
				icon: 'icon-underline',
			},
			{
				name: 'strikethrough',
				type: 'button',
				command: 'strikethrough',
				icon: 'icon-strikethrough',
			},
		],
		[
			{
				name: 'text-formatting',
				text: 'Text Formatting',
				type: 'dropdown',
				icon: 'icon-header',
				options: [
					{
						name: 'format-h1',
						type: 'a',
						command: 'formatBlock',
						commandValue: 'h1',
						text: 'Heading 1',
					},
					{
						name: 'format-h2',
						type: 'a',
						command: 'formatBlock',
						commandValue: 'h2',
						text: 'Heading 2',
					},
					{
						name: 'format-h3',
						type: 'a',
						command: 'formatBlock',
						commandValue: 'h3',
						text: 'Heading 3',
					},
					{
						name: 'format-h4',
						type: 'a',
						command: 'formatBlock',
						commandValue: 'h4',
						text: 'Heading 4',
					},
					{
						name: 'format-h5',
						type: 'a',
						command: 'formatBlock',
						commandValue: 'h5',
						text: 'Heading 5',
					},
					{
						name: 'format-h6',
						type: 'a',
						command: 'formatBlock',
						commandValue: 'h6',
						text: 'Heading 6',
					},
					{
						name: 'format-p',
						type: 'a',
						command: 'formatBlock',
						commandValue: 'p',
						text: 'paragraph',
					},
					{
						name: 'format-pre',
						type: 'a',
						command: 'formatBlock',
						commandValue: 'pre',
						text: 'pre formatting',
					},
				],
			}
		],
	];
	// Default Settings
	var defaults = {
		target: '[data-sheets-editor]',
		classes: {
			init: 'sheets-wysiwyg-editor',
			container: 'sheets-cover',
			sheetContainer: 'sheet-container',
			sheetHeader: 'sheet-header',
			sheetFooter: 'sheet-footer',
			sheetEditor: 'sheet-editor',
		},
		beforeCreateEditorHandler: {},
		afterCreateEditorHandler: {},

		beforeCreateToolbarHandler: {},
		afterCreateToolbarHandler: {},

		toolsets: toolbarItems,

		debug: false,
	}

	/**
	 * -----------------------------------------
	 * Private Methods
	 * -----------------------------------------
	 * The private functions of the library.
	 */

	/**
	 * forEach
	 * implementation for Arrays, Objects, and NodeLists
	 *
	 * @private
	 * @param  {Array|Object|NodeList}   collection Collection of items to iterate
	 * @param  {Function} callback   Callback function for each iteration
	 * @param  {Array|Object|NodeList}   scope      Array/Object/NodeList that forEach is iterating over (aka `this`)
	 *
	 * @return {void}
	 */
	var forEach = function (collection, callback, scope) {
		// Simple way to identify if `collection` is an Object
		if ( Object.prototype.toString.call( collection ) == '[object Object]' ) {
			for ( var property in collection ) {
				if ( Object.prototype.hasOwnProperty.call( collection, property ) ) {
					callback.call( scope, collection[ property ], property, collection );
				}
			}
		} else {
			for (var i = 0; i < collection.length; i++) {
				callback.call( scope, collection[i], i, collection );
			}
		}
	}

	/**
	 * Merge defaults with user options
	 *
	 * @private
	 * @param  {Object} defaults Default settings
	 * @param  {Object} options  User options
	 * @return {Object}          Merged values of defaults and options
	 */
	var extend = function (defaults, options) {
		var extended = {};
		forEach(defaults, function (value, prop) {
			extended[ prop ] = defaults[ prop ];
		});
		forEach(options, function (value, prop) {
			extended[ prop ] = options[ prop ];
		});

		return extended;
	}

	/**
	 * Covert to key/value pair
	 *
	 * @param  {String} options
	 * @return {Object}
	 */
	var getData = function (options) {
		return ! options || ! (typeof JSON === 'object' && typeof JSON.parse === 'function') ? {} : JSON.parse( options );
	}

	/**
	 * Remove whitespace from a string
	 *
	 * @param  {String} string
	 * @return {String}
	 */
	var trim = function (string) {
		return string.replace(/^\s+|\s+$/g, '');
	}

	/**
	 * Hide the Element
	 *
	 * @param  {Element} element
	 * @return {void}
	 */
	var hide = function (element) {
		element.style.display = 'none';
	}

	/**
	 * Show the Element
	 *
	 * @param  {Element} element
	 * @return {void}
	 */
	var show = function (element, display) {
		display = display ? display : 'block';

		element.style.display = display;
	}

	var fadeOut = function (element, callback, duration) {
		duration = duration ? duration : 20;
		var fadeEffect = setInterval(function () {
			if ( ! element.style.opacity ) {
				element.style.opacity = 1;
			}
			if ( element.style.opacity < 0.1 ) {
				clearInterval(fadeEffect);
				callback(element);
			} else {
				element.style.opacity -= 0.1;
			}
		}, duration);
	}

	/**
	 * On window scroll and resize, only run events at a rate of 15fps for better performance
	 * @private
	 * @param  {Function} eventTimeout Timeout function
	 * @param  {Object} settings
	 */
	var eventThrottler = function () {
		if ( ! eventTimeout ) {
			eventTimeout = setTimeout(function() {
				eventTimeout = null;
				actualMethod( settings );
			}, 66);
		}
	};

	/**
	 * Debugger
	 *
	 */
	var debug = function (loggable) {
		if ( settings.debug ) {
			console.log("[Sheets.js] ", loggable);
		}
	}

	/**
	 * Insert element after the reference node
	 *
	 * @private
	 * @param  {Element} newNode 	The node to insert
	 * @param  {Element} referenceNode
	 *
	 * @return {void}
	 */
	var insertAfter = function (newNode, referenceNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	}

	var listen = function (element, events, fn) {
		events.split(' ').forEach( e => element.addEventListener(e, fn, false));
	}

	/**
	 * -----------------------------------------
	 * Event Handlers
	 * -----------------------------------------
	 *
	 */
	// @todo Add Event handlers here
	var DOMContentLoadedHandler = function (event) {
		var toggle = event.target;
		var targets = document.querySelectorAll(settings.target);

		debug(targets);

		[].map.call(targets, function (target) {
			hide(target);
			debug(target);

			Sheets.bindSheets(target);
			Sheets.makeToolbar(target);
		});
	}

	var ToolbarCommandHandler = function (event) {
		var toggle = event.target;
		var targets = document.querySelectorAll('.sheets-toolbar [data-command]');
		debug(targets);

		[].map.call(targets, function (target) {

			target.addEventListener('mousedown', function (e) {
				e.preventDefault();
			});

			listen(target, 'click', function (e) {
				debug(target);
				// document.designMode = "on";

				e.preventDefault();
				e.stopPropagation();

				var command = target.getAttribute('data-command') ? target.getAttribute('data-command') : null;
				var commandValue = target.getAttribute('data-command-value') ? target.getAttribute('data-command-value') : null;

				switch (command) {
					case "rtl":
						// _.innerEditor.classList.toggle('direction-rtl');
						break;

					case "pre":
						document.execCommand(command, false, commandValue);
						document.execCommand("insertHtml", false, "<p></p>");
						break;

					case 'addSection':
						//
						break;

					case 'addRow':
						//
						break;

					case 'dropcap':
						var elem = window.getSelection ? window.getSelection : getWord();
						document.execCommand("formatBlock", false, "p");
						var selectedElement = window.getSelection().focusNode.parentNode;
								selectedElement.classList.toggle('dropcap');
						break;

					case 'sizeFormat':
						if (window.getSelection) {
							surroundSelection('span', 'font-'+commandValue);
						}
						break;

					default:
						// alert(commandValue);
						document.execCommand(command, false, commandValue);
						break;
				}

				// document.designMode = "off";
			});
		});
	}

	var EditorEventHandler = function (event) {
		var toggle = event.target;
		var targets = document.querySelectorAll("." + settings.classes.container + " ." + settings.classes.sheetEditor);
		debug(targets);

		[].map.call(targets, function (target) {
			listen(target, 'click keyup', function (e) {
				//
			});
		});
	}

	/**
	 * -----------------------------------------
	 * Sheets.js / Public Methods / APIs
	 * -----------------------------------------
	 *
	 */
	Sheets.destroy = function () {
		if ( ! settings ) return;

		document.documentElement.classList.remove( settings.classes.init );

		// @todo Undo any init functions

		// Remove Event Listeners
		document.removeEventListener('DOMContentLoaded', DOMContentLoadedHandler, false);
		document.removeEventListener('DOMContentLoaded', ToolbarCommandHandler, false);
		document.removeEventListener('DOMContentLoaded', EditorEventHandler, false);

		// Reset Variables
		settings = null;
		eventTimeout = null;
	}

	Sheets.init = function (options) {
		// Feature test
		if ( ! supports ) return;

		// Start anew
		Sheets.destroy();

		// Merge settings
		settings = extend( defaults, options || {} );

		document.addEventListener('DOMContentLoaded', DOMContentLoadedHandler, false);
		document.addEventListener('DOMContentLoaded', ToolbarCommandHandler, false);
		document.addEventListener('DOMContentLoaded', EditorEventHandler, false);
	}

	Sheets.bindSheets = function (target) {
		var cover = document.createElement('div');
		cover.setAttribute("class", settings.classes.container);

		var sheetHeader = this.makeSheetHeader();
		var sheetEditor = this.makeSheetEditor();
		var sheetContainer = this.makeSheetContainer();
		var sheetFooter = this.makeSheetFooter();

		sheetContainer.appendChild(sheetHeader);
		sheetContainer.appendChild(sheetEditor);
		sheetContainer.appendChild(sheetFooter);

		cover.appendChild(sheetContainer);

		insertAfter(cover, target);
	}

	Sheets.makeSheetContainer = function () {
		var sheetContainer = document.createElement('div');
		sheetContainer.setAttribute('class', settings.classes.sheetContainer);

		return sheetContainer;
	}

	Sheets.makeSheetEditor = function () {
		var sheetEditor = document.createElement('div');
		sheetEditor.setAttribute('contenteditable', true);
		sheetEditor.setAttribute('class', "sheet-mode-html " + settings.classes.sheetEditor);

		// Listeners
		listen(sheetEditor, 'keydown click', function (e) {
			// TAB key
			if ( 9 === e.keyCode ) {
                 	document.execCommand('insertHTML', false, "&#09;");
                    	e.preventDefault();
               	}

               	// Make anything wrap inside p unless already formatted
             //   	if ( document.queryCommandState("formatBlock") ) {
	           	// document.execCommand("formatBlock", false, "p");
             //   	}
		});

		return sheetEditor;
	}

	Sheets.makeSheetHeader = function () {
		var sheetHeader = document.createElement('div');
		sheetHeader.setAttribute('class', settings.classes.sheetHeader);

		var closeButton = this.makeButton("", "btn-close sheets-toolbar-item", "i", "icon-cross");
		closeButton.setAttribute("data-command", "removeSection");
          	closeButton.addEventListener("click", function (e) {
                var container = this.closest("." + settings.classes.sheetContainer);

                fadeOut(container, function (el) {
                		el.remove();
                });

                e.preventDefault();
		});

          	sheetHeader.appendChild(closeButton);
          	// @todo add eventhandler to extend this fn

          	return sheetHeader;
	}

	Sheets.makeSheetFooter = function () {
		var sheetFooter = document.createElement('div');
		sheetFooter.setAttribute('class', settings.classes.sheetFooter);

		//
          	// @todo add eventhandler to extend this fn

          	return sheetFooter;
	}

	Sheets.makeButton = function (text, btnClass, icon, iconClass) {
		btnClass = btnClass ? btnClass : 'btn-tool';
		icon = icon ? '<' + icon + ' class="' + iconClass + '">&nbsp;</' + icon + '>' : '';

		var btn = document.createElement("button");
		btn.innerHTML += icon;
		btn.innerHTML += text;
		btn.setAttribute("class", btnClass);
		btn.setAttribute("type", "button");

		return btn;
	}

	Sheets.makeToolbar = function (target) {
		var toolbar = document.createElement('div');
		toolbar.setAttribute("class", "sheets-toolbar");

		var toolbarItems = settings.toolsets;
		for (var j = 0; j < toolbarItems.length; j++) {
			var toolsets = toolbarItems[j];
			var toolset = document.createElement('div');
			toolset.setAttribute("class", "sheets-toolset");

			for (var i = 0; i < toolsets.length; i++) {
				var toolbarItem = toolsets[i];

				var text = toolbarItem.text ? toolbarItem.text : "",
					btnClass = "btn-toolbar sheets-toolbar-item btn-" + toolbarItem.name,
					iconClass = toolbarItem.icon ? toolbarItem.icon : "",
					command = toolbarItem.command ? toolbarItem.command : null,
					commandValue = toolbarItem.commandValue ? toolbarItem.commandValue : null,
					type = toolbarItem.type;


				var item = null;
				switch ( type ) {
					case 'button':
						item = this.makeButton(text, btnClass, "i", iconClass );
						if ( command ) item.setAttribute('data-command', command);
						if ( commandValue ) item.setAttribute('data-command-value', commandValue);
						break;

					case 'dropdown':
						item = document.createElement("div");
						item.setAttribute("class", "sheets-toolbar-dropdown");
						var inner = this.makeButton(text, "dropdown-toggle", "i", iconClass);
						var options = toolbarItem.options;
						var dropdownMenu = document.createElement("div");
						dropdownMenu.setAttribute("class", "sheets-toolbar-dropdown-menu");
						[].map.call(options, function (option) {
							var optionItem = document.createElement(option.type);
							optionItem.setAttribute("class", "sheets-toolbar-dropdown-option");
							// optionItem.setAttribute("href", "#");
							optionItem.setAttribute("data-command", option.command);
							optionItem.setAttribute("data-command-value", option.commandValue);
							optionItem.setAttribute("role", "option");
							optionItem.text = option.text;
							dropdownMenu.appendChild(optionItem);
						});
						item.appendChild(inner);
						item.appendChild(dropdownMenu);

						listen(inner, 'click', function (e) {
							var parent = this.closest(".sheets-toolbar-dropdown");
							var children = parent.children;

							[].map.call(children, function (child) {
								if ( child.className.match(/sheets-toolbar-dropdown-menu/) ) {
									var previouses = document.querySelectorAll('.toolbar-dropdown-menu.open');
									[].map.call(previouses, function (previous) {
										previous.classList.remove("open");
									});
									child.classList.toggle('open');
								}
							});
						});

						var optionItems = dropdownMenu.querySelectorAll('.sheets-toolbar-dropdown-option');
						[].map.call(optionItems, function (oi) {
							listen(oi, 'click', function (e) {
								var menu = this.closest('.sheets-toolbar-dropdown-menu');
								menu.classList.remove('open');
							});
						});
						break;

					default:
						break;
				}

				if ( item !== null ) toolset.appendChild(item);

			}

			toolbar.append(toolset);
		}

		insertAfter(toolbar, target);
		// debug(toolset);
	}

	return Sheets;
});

var sheets = Sheets.init({debug:true});
// console.log();
// var sheets = Sheets;
// sheets.init();
console.log(Sheets);